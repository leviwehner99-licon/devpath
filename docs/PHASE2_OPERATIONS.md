# DevPath Phase 2 – Betriebsabläufe

**Stand:** 22. Oktober 2026  
**Status:** Vorbereitung; kein Backup-Restore, Incident-Tabletop oder Alpha-Betrieb wurde bisher nachgewiesen.

Dieses Dokument macht die noch offenen Betriebsarbeiten ausführbar. Es enthält keine produktiven Zugangsdaten. Die Produktionsdatenbank darf für eine Wiederherstellungsprobe niemals als Restore-Ziel verwendet werden.

## 1. PostgreSQL-Backup und Wiederherstellungsprobe

### Vorbedingungen

1. In der Supabase-Projektkonsole **Database → Backups** öffnen. Supabase dokumentiert tägliche automatische Backups für Pro/Team/Enterprise und empfiehlt für Free-Projekte regelmäßige eigene Exporte. Aufbewahrungsdauer, Backupart, PITR-Verfügbarkeit und Restoreberechtigte hängen vom Tarif und Projektzustand ab: [Supabase Backup-Dokumentation](https://supabase.com/docs/guides/platform/backups). Tatsächliche Werte für DevPath sind noch nicht nachgesehen.
2. Für eine Restoreprobe eine **separate leere Testdatenbank oder ein separates Testprojekt** bereitstellen. Niemals `pg_restore --clean` gegen Production ausführen.
3. `pg_dump` und `pg_restore` aus derselben oder einer kompatiblen PostgreSQL-Hauptversion wie der Server verwenden.
4. Einen geschützten lokalen Ordner außerhalb des Repositorys wählen. Backups enthalten Kurs-/Kontometadaten und sind vertraulich. Lokale Festplattenverschlüsselung aktivieren und eine zweite verschlüsselte Ablage mit begrenztem Zugriff festlegen.

### Manuelles logisches Backup in PowerShell

In Supabase **Connect** eine Direct- oder Session-Pooler-Verbindung wählen. Für `pg_dump` keinen Transaction-Pooler verwenden. Host, Port, Datenbank und Benutzer aus genau dieser Anzeige übernehmen. Das Passwort wird unten verdeckt abgefragt; es landet weder in der Befehlszeile noch im Git-Repository. Connection string und Poolerwahl: [Supabase-Verbindungsleitfaden](https://supabase.com/docs/guides/database/connecting-to-postgres).

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
  $backupDir = Join-Path $env:USERPROFILE 'DevPathBackups'
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

Für den Restore müssen ebenfalls Host, Port, Datenbank und Benutzer des **separaten leeren Testziels** gesetzt werden; das Passwort erneut verdeckt abfragen und nur `PGPASSWORD` setzen wie oben. Dann:

```powershell
$env:PGHOST = 'TEST-HOST_AUS_SUPABASE_CONNECT'
$env:PGPORT = 'TEST-PORT_AUS_SUPABASE_CONNECT'
$env:PGDATABASE = 'LEERE_TESTDATENBANK'
$env:PGUSER = 'TESTBENUTZER_AUS_SUPABASE_CONNECT'
$env:PGSSLMODE = 'require'
$secret = Read-Host 'Testdatenbankpasswort' -AsSecureString
$secretPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
  $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPtr)
  pg_restore --no-owner --no-privileges --single-transaction "$backupFile"
} finally {
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPtr)
  Remove-Variable secret -ErrorAction SilentlyContinue
}
if ($LASTEXITCODE -ne 0) { throw 'Restore fehlgeschlagen; Ursache prüfen und Testziel neu bereitstellen.' }
```

RLS-Policies verweisen auf die Rolle `devpath_app`. Diese Rolle muss im leeren Ziel vor dem Restore existieren. Nach Restore einer Supabase-Sicherung müssen Passwörter benutzerdefinierter Rollen gegebenenfalls neu gesetzt werden; Supabase weist darauf hin, dass diese nicht in täglichen Backups enthalten sind. Prüfe vor dem Restoreziel den [Supabase Restore-Ablauf](https://supabase.com/docs/guides/platform/backups). Ein Backup stellt keine externen Storage-Objekte wieder her; DevPath verwendet aktuell keinen Supabase Storage für Nutzercode.

Danach im Testziel mindestens prüfen:

```sql
SELECT current_database(), current_user;
SELECT count(*) AS courses FROM public.courses;
SELECT count(*) AS published_courses FROM public.courses WHERE published IS TRUE;
SELECT count(*) AS published_releases FROM public.course_releases WHERE published_at IS NOT NULL;
```

Anschließend die App-Runtimeverbindung gegen das Testziel prüfen und bestätigen, dass nur veröffentlichte Datensätze sichtbar sind. Restorezeit, Client-/Serverversion, Prüfsumme, Zähler und Abweichungen dokumentieren. Testprojekt und Backupkopien nach der festgelegten Aufbewahrungsregel löschen. Ein bestandener `pg_restore` allein ist noch keine erfolgreiche Wiederherstellungsübung.

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
| Restoreprobe in separater Testdatenbank |  |  | Offen |
| OIDC-Anbieter und PKCE-Flow (oder Konto bleibt deaktiviert) |  |  | Offline-only |
| Codeausführung je OS unabhängig geprüft (oder überall deaktiviert) |  |  | Deaktiviert |
| Signaturprüfung für tatsächlich verteilte Pakete |  |  | Offen |
| Security-, Accessibility- und Lernendenreview |  |  | Offen |
| Feedback-/Vorfallweg und Teilnahmebedingungen |  |  | Offen |

Eine leere Evidenzspalte ist kein bestandenes Gate. Dieses Protokoll ersetzt keine Rechtsberatung oder externe Sicherheitsprüfung.
