# CodeZone Phase 2 – Betriebsabläufe

**Stand:** 22. Oktober 2026  
**Status am 22. Oktober 2026:** Ein manueller Supabase-Dump wurde erstellt und mit `pg_restore --list` lesend geprüft. Das CodeZone-`public`-Schema wurde erfolgreich in der lokalen Testdatenbank `devpath_restore_test` restauriert. Die Zähler ergaben `accounts=0`, `courses=1`, `course_releases=1`, `app_releases=0`. Migration 003 und `SET ROLE devpath_app` liefen erfolgreich; die Rolle las einen Kurs und eine Kursversion. Supabase-Systemschemata wie `auth` und `vault` wurden ausdrücklich nicht restauriert. Die Dump-Datei liegt vorübergehend auf C:, das nach der `manage-bde`-Prüfung unverschlüsselt ist; nach abgeschlossener Probe löschen. Ein Incident-Tabletop und Alpha-Betrieb sind nicht nachgewiesen.

## 0. Dependency-Audit-Ausnahme

Der RustSec-Audit ignoriert ausschließlich `RUSTSEC-2023-0071` für `rsa`. Die aktuelle Abhängigkeitskette stammt aus `sqlx-mysql`, einem optionalen SQLx-Treiber, der im CodeZone-App-Build nicht aktiviert ist; CodeZone verwendet lokal SQLite. RustSec führt für den Marvin-Timing-Angriff derzeit keine gepatchte `rsa`-Version. Der CI-Befehl enthält die einzelne Advisory-ID sichtbar. Die Ausnahme muss entfernt werden, bevor MySQL oder Codepfade mit `rsa` aktiviert werden; sie ist keine Freigabe für betroffene Kryptografie. Zusätzlich wurde `tokio` von 1.54.0 auf die Fixversion 1.54.1 angehoben.

Dieses Dokument macht die noch offenen Betriebsarbeiten ausführbar. Es enthält keine produktiven Zugangsdaten. Die Produktionsdatenbank darf für eine Wiederherstellungsprobe niemals als Restore-Ziel verwendet werden.

## 1. PostgreSQL-Backup und Wiederherstellungsprobe

### Vorbedingungen

1. In der Supabase-Projektkonsole **Database → Backups** öffnen. Supabase dokumentiert tägliche automatische Backups für Pro/Team/Enterprise und empfiehlt für Free-Projekte regelmäßige eigene Exporte. Aufbewahrungsdauer, Backupart, PITR-Verfügbarkeit und Restoreberechtigte hängen vom Tarif und Projektzustand ab: [Supabase Backup-Dokumentation](https://supabase.com/docs/guides/platform/backups). Tatsächliche Werte für CodeZone sind noch nicht nachgesehen.
2. Für eine Restoreprobe eine **separate leere Testdatenbank oder ein separates Testprojekt** bereitstellen. Niemals `pg_restore --clean` gegen Production ausführen. Die am 22.10.2026 durchgeführte lokale Probe deckte nur CodeZones `public`-Schema ab; sie ist keine vollständige Wiederherstellungsprobe aller Supabase-Systemschemata.
3. `pg_dump` und `pg_restore` aus derselben oder einer kompatiblen PostgreSQL-Hauptversion wie der Server verwenden.
4. Einen geschützten lokalen Ordner außerhalb des Repositorys wählen. Backups enthalten Datenbankinhalte und können vertrauliche Daten enthalten. Lokale Festplattenverschlüsselung aktivieren und eine zweite verschlüsselte Ablage mit begrenztem Zugriff festlegen. Für die am 22.10.2026 durchgeführte Probe war C: laut `manage-bde` vollständig entschlüsselt; den lokalen Dump daher nach Abschluss der Prüfung entfernen und nicht als dauerhaftes Backup behalten.

### Manuelles logisches Backup in PowerShell

In Supabase **Connect** die **Session-Pooler**-Verbindung wählen (Supabase nennt dafür Port 5432) oder eine funktionierende Direct-Verbindung; keinen Transaction-Pooler verwenden. Host, Port, Datenbank und Benutzer genau aus der Anzeige übernehmen. Für den vollständigen Export den Datenbankbesitzer verwenden, nicht `devpath_app`: Diese App-Rolle darf nur veröffentlichte Kurs- und Releasezeilen lesen. Supabase zeigt den Besitzer-Benutzer gewöhnlich als `postgres.<Projekt-Referenz>`; für dieses Projekt ist die Referenz `rvhxsgexonmolrpdxdou`. Das Passwort ist das Datenbankpasswort aus Supabase, nicht das Makers-Feld `DATABASE_URL` und nicht das Passwort von `devpath_app`. Falls es unbekannt ist, in Supabase unter **Database → Settings** zurücksetzen. Das Passwort wird unten verdeckt abgefragt; es landet weder in der Befehlszeile noch im Git-Repository. [Supabase-Verbindungsleitfaden](https://supabase.com/docs/guides/database/connecting-to-postgres).

```powershell
$env:PGHOST = 'HOST_AUS_SUPABASE_CONNECT'
$env:PGPORT = 'PORT_AUS_SUPABASE_CONNECT'
$env:PGDATABASE = 'postgres'
$env:PGUSER = 'BENUTZER_AUS_SUPABASE_CONNECT'
$env:PGSSLMODE = 'require'
$secret = Read-Host 'Datenbankpasswort' -AsSecureString
$secretPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
  $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPtr)
  $backupDir = Join-Path $env:USERPROFILE 'CodeZoneBackups'
  New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
icacls $backupDir /inheritance:r | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Backupordner konnte nicht geschützt werden.' }
icacls $backupDir /grant:r "$($env:USERNAME):(OI)(CI)F" | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Zugriff für das aktuelle Windows-Konto konnte nicht gesetzt werden.' }
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backupFile = Join-Path $backupDir "devpath-$stamp.dump"
  pg_dump --format=custom --no-owner --no-privileges --file="$backupFile"
  if ($LASTEXITCODE -ne 0) { throw 'Backup fehlgeschlagen; Datei nicht als gültiges Backup behandeln.' }
  Get-FileHash -Algorithm SHA256 $backupFile
} finally {
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPtr)
  Remove-Variable secret -ErrorAction SilentlyContinue
}
```

Vor dem ersten Lauf `manage-bde -status $env:SystemDrive` ausführen und bestätigen, dass das Laufwerk mit dem Backupordner vollständig verschlüsselt ist. Die Befehle oben entziehen dem Backupordner geerbte Dateirechte und geben Vollzugriff nur dem angemeldeten Benutzer. Die ausgegebene Prüfsumme zusammen mit Datum, Projektkennung und PostgreSQL-Clientversion im geschützten Backupprotokoll notieren. Die Umgebungsvariablen für Host, Port, Datenbank und Benutzer nach der Sitzung mit `Remove-Item Env:PGHOST,Env:PGPORT,Env:PGDATABASE,Env:PGUSER,Env:PGSSLMODE` entfernen. Ein manuelles Exportbackup ersetzt keine tarifabhängige automatische Sicherung.

### Restoreprobe ausschließlich in ein leeres Testziel

Eine zweite Supabase-Datenbank ist nicht zwingend nötig: Für die Restoreprobe kannst du die vorhandene lokale PostgreSQL-18-Installation in pgAdmin verwenden. In pgAdmin links **Servers → PostgreSQL 18 → Databases** rechts anklicken → **Create → Database…**. Datenbankname `devpath_restore_test`, Owner `postgres`, dann **Save**. Dadurch bleibt die Supabase-Production-Datenbank unberührt. Supabase-spezifische Systemerweiterungen (zum Beispiel `supabase_vault`) gibt es lokal nicht; deshalb ausschließlich das Anwendungsschema `public` restaurieren.

Prüfe in einer PowerShell, ob PostgreSQL-18-Werkzeuge gefunden werden:

```powershell
$env:Path = "C:\Program Files\PostgreSQL\18\bin;$env:Path"
pg_dump --version
pg_restore --version
```

Falls PostgreSQL 18 an einem anderen Ort installiert ist, ändere nur den Pfad zum `bin`-Ordner. Für die Restore-RLS-Policies muss die lokale Serverrolle `devpath_app` existieren. Beim erneuten Restore eines bereits benutzten Testziels muss zuerst das `public`-Schema der lokalen Testdatenbank geleert und neu angelegt werden. Dieses Schema enthält dann nur CodeZones Anwendungstabellen; Supabase-Systemschemata werden ausgelassen. Führe den folgenden Rollenblock im Query Tool der **Datenbank `devpath_restore_test`** aus, nicht in Supabase Production:

```sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'devpath_app') THEN
    CREATE ROLE devpath_app NOLOGIN;
  END IF;
END
$$;
```

Setze danach die Variablen auf **localhost und die neue lokale Testdatenbank**; nicht auf Supabase. Frage das lokale `postgres`-Passwort verdeckt ab wie im Backupbeispiel:

```powershell
$env:PGHOST = 'localhost'
$env:PGPORT = '5432'
$env:PGDATABASE = 'devpath_restore_test'
$env:PGUSER = 'postgres'
$env:PGSSLMODE = 'disable'
$secret = Read-Host 'Lokales PostgreSQL-Passwort für postgres' -AsSecureString
$secretPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
  $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPtr)
  $backupFile = Read-Host 'Vollständigen Pfad zur vorhandenen .dump-Datei eingeben'
  if (-not (Test-Path -LiteralPath $backupFile)) { throw "Backup-Datei nicht gefunden: $backupFile" }
  pg_restore --schema=public --no-owner --no-privileges --exit-on-error --verbose --dbname=devpath_restore_test "$backupFile"
} finally {
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPtr)
  Remove-Variable secret -ErrorAction SilentlyContinue
}
if ($LASTEXITCODE -ne 0) { throw 'Restore fehlgeschlagen; Ursache prüfen und Testziel neu bereitstellen.' }
```

Danach in pgAdmin **devpath_restore_test → Query Tool** öffnen und `server/migrations/003_runtime_course_catalog_access.sql` ausführen. So werden die Lesegrants und Policies auf die lokale Rolle angewandt; Production-Migrationen werden nicht verändert. Ein Backup stellt keine externen Storage-Objekte wieder her; CodeZone verwendet aktuell keinen Supabase Storage für Nutzercode.

Danach im Testziel mindestens prüfen:

```sql
SELECT current_database(), current_user;
SELECT count(*) AS courses FROM public.courses;
SELECT count(*) AS published_courses FROM public.courses WHERE published IS TRUE;
SELECT count(*) AS published_releases FROM public.course_releases WHERE published_at IS NOT NULL;
SET ROLE devpath_app;
SELECT count(*) AS app_visible_courses FROM public.courses;
RESET ROLE;
```

Die Zeile `app_visible_courses` muss denselben Wert wie `published_courses` ergeben. Restorezeit, Client-/Serverversion, Prüfsumme, Zähler und Abweichungen dokumentieren. Nach erfolgreicher Probe die lokale Testdatenbank in pgAdmin durch Rechtsklick → **Delete/Drop** entfernen und die Backupkopien nach der festgelegten Aufbewahrungsregel löschen. Ein bestandener `pg_restore` allein ist noch keine erfolgreiche Wiederherstellungsübung.

### Betriebsentscheidung vor einer privaten Alpha

- Verantwortliche Person für Backupalarm und Wiederherstellung festlegen.
- Anbieter-Backups plus unabhängiges verschlüsseltes Exportbackup gegeneinander bewerten.
- Aufbewahrung und Löschung mit Zweck, Datenklasse und Hostingtarif abstimmen.
- Zielwerte für maximalen Datenverlust (RPO) und Wiederanlaufzeit (RTO) festlegen.
- Backupfehler alarmieren lassen und Restore mindestens einmal in ein separates Ziel üben.

## 2. Incident-Ablauf für private Alpha

### Triage

1. Vorfallzeit, betroffene Version/Umgebung und beobachtetes Verhalten notieren. Keine Quelltexte, Tokens, Passwörter oder unnötigen Nutzerdaten in Tickets kopieren.
2. Schweregrad vorläufig bewerten: **kritisch** (Update-/Signierschlüssel, Konten oder mehrere Nutzer betroffen), **hoch** (unbefugter Zugriff oder private Daten), **mittel** (begrenzter Fehler ohne bestätigte Datenoffenlegung).
3. Eine verantwortliche Person und eine zweite prüfende Person benennen. Falls keine erreichbar ist, Alpha-Einladungen und neue Releases pausieren.

### Eindämmung

- **Geheimnis kompromittiert:** betroffene Schlüssel/Passwörter beim jeweiligen Anbieter widerrufen und rotieren; danach Zugriffe und Logs prüfen.
- **Schadhaftes Desktopartefakt:** Downloads/Releaseverweis abschalten, betroffene Version und Commit kennzeichnen, keine ungesicherte Ersatzdatei verteilen.
- **Datenbankzugriff:** betroffene Runtime-Rolle sperren/rotieren, öffentliche Schreibpfade deaktivieren und Anbieter-Auditdaten sichern.
- **Nutzercode/Projektdatei betroffen:** keine Datei automatisch öffnen oder ausführen; betroffene Imports/Runner-Funktion deaktivieren.

### Wiederherstellung und Abschluss

1. Ursache und Umfang aus minimalen, zugriffsbeschränkten Belegen bestimmen.
2. Wiederherstellung nur nach geprüfter sauberer Version oder in separater Datenbank; Produktionsdaten nicht mit ungeprüftem Dump überschreiben.
3. Betroffene Personen und Hostinganbieter nach dem vorab geprüften Rechts-/Kommunikationsweg informieren.
4. Zeitlinie, Auswirkungen, Entscheidung, Datenminimierung und Folgeaufgaben protokollieren. Keine öffentliche Alpha, bis kritische Punkte geschlossen und Gegenmaßnahmen unabhängig gegengeprüft sind.

## 3. Freigabeprotokoll

Vor jedem privaten Alpha-Release müssen Verantwortliche Evidenz oder eine bewusst engere Produktgrenze eintragen:

| Gate | Evidenz/Link | Verantwortlich | Status |
| --- | --- | --- | --- |
| Zielgruppe, Altersrahmen und Zielmarkt festgelegt |  |  | Offen |
| Datenschutz-/Support-/Sicherheitskontakt freigegeben |  |  | Offen |
| PostgreSQL-Backupanbieter, Aufbewahrung, RPO/RTO |  |  | Offen |
| Restoreprobe für CodeZone-`public`-Schema samt `devpath_app`-Leserechten | Ausgabe/Zählwerte vom 22.10.2026; vollständige Supabase-Systemwiederherstellung nicht umfasst | Betreiber | Bestanden (begrenzt) |
| OIDC-Anbieter und PKCE-Flow (oder Konto bleibt deaktiviert) |  |  | Offline-only |
| Codeausführung je OS unabhängig geprüft (oder überall deaktiviert) |  |  | Deaktiviert |
| Signaturprüfung für tatsächlich verteilte Pakete |  |  | Offen |
| Security-, Accessibility- und Lernendenreview |  |  | Offen |
| Feedback-/Vorfallweg und Teilnahmebedingungen |  |  | Offen |

Eine leere Evidenzspalte ist kein bestandenes Gate. Dieses Protokoll ersetzt keine Rechtsberatung oder externe Sicherheitsprüfung.

## 4. Live-Prüfung der Makers-Production-Adresse

Die feste Makers-Adresse steht im Projekt unter **Domain Management** als Project Domain. Verwende nicht eine ältere URL aus einem einzelnen Deployment. Ersetze im folgenden PowerShell-Block ausschließlich `HIER_DIE_PROJECT_DOMAIN_EINTRAGEN` durch den Hostnamen aus Makers, ohne `https://` und ohne abschließenden Schrägstrich. Beispiel für das Format: `devpath-abcdefgh.edgeone.dev`.

```powershell
$base = 'https://HIER_DIE_PROJECT_DOMAIN_EINTRAGEN'
$paths = @(
  '/',
  '/download/',
  '/downloads/CodeZone_0.1.0_x64-setup.exe',
  '/downloads/CodeZone_0.1.0_x64-setup.exe.sha256',
  '/api/health/live',
  '/api/health/ready',
  '/api/v1/courses'
)
foreach ($path in $paths) {
  try {
    $response = Invoke-WebRequest -Uri ($base + $path) -Method Get -MaximumRedirection 5
    [pscustomobject]@{
      Path = $path
      Status = [int]$response.StatusCode
      ContentType = $response.Headers['Content-Type']
      CacheControl = $response.Headers['Cache-Control']
      CSP = $response.Headers['Content-Security-Policy']
      XContentTypeOptions = $response.Headers['X-Content-Type-Options']
    }
    if ([int]$response.StatusCode -ne 200) { throw "Unerwarteter HTTP-Status für $path" }
    if ($path -in @('/', '/download/') -and [string]::IsNullOrWhiteSpace($response.Headers['Content-Security-Policy'])) { throw "Content-Security-Policy fehlt auf $path" }
    if ($path -in @('/', '/download/') -and $response.Headers['X-Content-Type-Options'] -ne 'nosniff') { throw "X-Content-Type-Options fehlt oder ist falsch auf $path" }
    if ($path -eq '/api/health/live' -and $response.Content -notmatch '"status"\s*:\s*"ok"') { throw 'Liveness-Antwort ist unerwartet.' }
    if ($path -eq '/api/health/ready' -and $response.Content -notmatch '"status"\s*:\s*"ready"') { throw 'Readiness-Antwort ist unerwartet.' }
    if ($path -eq '/api/v1/courses' -and $response.Content -notmatch 'programming-intro') { throw 'JavaScript-Einstiegskurs fehlt in der Katalogantwort.' }
    if ($path -like '/downloads/*' -and $path.EndsWith('.exe') -and $response.Headers['Content-Type'] -notmatch 'octet-stream|application/x-msdownload') { Write-Warning 'Installer kam nicht mit erwartetem Download-Content-Type zurück; manuell prüfen.' }
  } catch {
    Write-Error "Prüfung fehlgeschlagen: $path — $($_.Exception.Message)"
  }
}
```

Erwartet werden sieben Antworten mit HTTP `200`. Bei der Präsentations- und Downloadseite muss `Content-Security-Policy` vorhanden sein; API- und Download-Antworten sollten ebenfalls die vorgesehenen Sicherheitsheader ausliefern. Nach Migration 004 muss die Katalogantwort `programming-intro` enthalten und `pilot-html-css` ausschließen. Kopiere bei Problemen nur Statuscode, Pfad und die nicht geheimen Response-Header hierher, niemals `DATABASE_URL`, Zertifikate oder Passwörter.
