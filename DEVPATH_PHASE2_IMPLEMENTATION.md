# DevPath Phase 2 – Abschlussstand und Übergabe

**Stand:** 22. Oktober 2026
**Status:** Lokale Windows-Alpha und der Production-Kurskatalog funktionieren. Phase 2 ist weiterhin **nicht** als private Alpha freigegeben; externe Betriebs-, Produkt- und Sicherheitsgates sind offen.
**Plan:** [DEVPATH_PHASE2_PLAN.md](DEVPATH_PHASE2_PLAN.md)

## Website, Installer und EdgeOne-Bereitstellung (22. Oktober 2026)

- Makers-Bereitstellung ist für Repository `leviwehner99-licon/devpath`, Branch `main`, Projektwurzel `website` und Ausgabe `.` vorbereitet. Die Website enthält eine Präsentationsseite unter `/` und eine Installationsseite unter `/download/`; beide verlinken aufeinander. Die Installationsseite liefert den versionierten Windows-NSIS-Installer und zeigt Plattform-/Alpha-Hinweise.
- Node.js-Cloud-Function-Handler unter `website/cloud-functions/api/` bilden Health-, Kurs-, Release- und OIDC-Kontorouten ab. Der lokale Fastify-Server bleibt für lokale Entwicklung und klassische Node-Hosts erhalten.
- Cloud-Functions-Zielregion ist Frankfurt (`eu-frankfurt`); die Supabase-Datenbank liegt in `eu-west-1` (Ireland). Der Nutzer hat die PostgreSQL-Migration und die Makers-Produktionsvariablen eingerichtet. `/api/health/ready` wurde auf der aktuellen Produktionsdomain erfolgreich bestätigt; der TLS-Handshake verwendet das geprüfte Supabase-CA-Zertifikat.
- Der bisherige HTML/CSS-Pilotkurs und die geplanten Einzelkurse HTML und CSS sind aus der App-Bibliothek entfernt. Stattdessen wird `programming-intro` mit sieben JavaScript-Grundlagenlektionen reproduzierbar aus `src/course.ts` gebaut. Migration 001 erstellt Schema und Tabellen; Migration 002 dokumentiert den früheren HTML/CSS-Pilotkurs; Migration 003 gewährt `devpath_app` nur SELECT-Zugriff auf veröffentlichte Kurs-/Releasezeilen und setzt RLS-Policies; Migration 004 ersetzt den veröffentlichten Pilotkurs durch den JavaScript-Einstieg. Migration 004 muss der Betreiber noch in Supabase ausführen.
- Die Makers-Production-Domain lässt sich aus dem Repository nicht verlässlich ermitteln. Frühere Deployment-Adressen wechselten bzw. lieferten 404; vor einer Freigabe muss die aktuelle **Project Domain** in Makers unter Domain Management abgelesen und live geprüft werden. Keine alte Deployment-Domain als garantiert gültig behandeln.
- Makers-Projektvariablen, Migrationsschritte, Routen und verbleibende Sicherheitsprüfung stehen in [website/DEPLOYMENT.md](website/DEPLOYMENT.md). Keine Zugangsdaten wurden gespeichert.
- Backup-/Restore-Ablauf, Incident-Triage und Alpha-Freigabeprotokoll stehen in [docs/PHASE2_OPERATIONS.md](docs/PHASE2_OPERATIONS.md). Am 22.10.2026 wurde ein Supabase-Custom-Dump erstellt, dessen Lesbarkeit geprüft und ausschließlich das DevPath-`public`-Schema in `devpath_restore_test` lokal wiederhergestellt. Die Zähler waren `accounts=0`, `courses=1`, `course_releases=1`, `app_releases=0`. Migration 003 und `SET ROLE devpath_app` wurden lokal erfolgreich geprüft; die App-Rolle las genau einen Kurs und eine Kursversion. Supabase-Systemschemata (`auth`, `vault` usw.) wurden nicht wiederhergestellt; die Probe bestätigt daher nicht die vollständige Supabase-Wiederherstellung. Eine Incidentübung wurde nicht durchgeführt.
- Bestätigte Produkt-/Architekturentscheidungen und offene Betreiberentscheidungen sind in [docs/PHASE2_DECISIONS.md](docs/PHASE2_DECISIONS.md) getrennt dokumentiert.
- Dependabot ist für npm, Cargo und GitHub Actions eingerichtet. Für Commit `4e5b8a0` sind Frontend build #41, Desktop build matrix #30 und Dependency security audit #19 in GitHub Actions erfolgreich abgeschlossen. Die Matrix enthielt erfolgreiche Windows-, macOS- und Linux-Jobs.
- Der Windows-/macOS-/Linux-Desktop-Buildworkflow baut unsignierte Pakete. Der manuelle Workflow veröffentlicht Windows x64, macOS ARM64, macOS Intel x64 und Linux x64 in Supabase Storage und aktiviert danach die Links auf der Downloadseite. Das braucht noch den öffentlichen Bucket `devpath-downloads` und die GitHub Actions Secrets `SUPABASE_URL` sowie `SUPABASE_SERVICE_ROLE_KEY`.
- EdgeOne-Handler-Syntax und JSON-Manifeste geprüft. Der Frontend-Produktionsbuild wurde nach der Mehrdateien-Projektumsetzung erneut erfolgreich erstellt. Die Katalogantwort verwendet `Cache-Control: no-store`. Nach Vergabe der gezielten Leserechte durch Migration 003 bestätigte der Nutzer in Production, dass der Kurskatalog die erwarteten Kurse anzeigt. Dies verifiziert den Katalogendpunkt und die Lesepfade für veröffentlichte Kurs- und Release-Metadaten; es ersetzt keine Prüfung weiterer Tabellenrechte oder anderer API-Routen.

## Lokal umgesetzt

- Tauri-2-Desktop-App mit React/TypeScript, Monaco-Editor, Ansichten für Heute, Lernen, Code Studio, Code Base, Diplom und Einstellungen.
- Kontoansicht mit E-Mail/Passwort und Google-Anmeldung über Supabase Auth/PKCE; Microsoft und Apple werden in dieser Version nicht angeboten. Die Startabfrage speichert Name, Lernziel, Vorerfahrung, Lerntage, bevorzugte Uhrzeit und Einheitsdauer nach erfolgreichem Speichern am Konto. Lernstand, Programmcode und Projekte bleiben lokal auf dem Gerät.
- Personalisierter Wochenrhythmus mit auswählbaren Lerntagen, bevorzugter Uhrzeit und Einheitsdauer; lokal gespeichert. Die Uhrzeit ist eine Orientierung innerhalb der App, keine Benachrichtigung. Begonnene Übungen, Fehlversuche und angeforderte Hinweise fließen lokal in die Empfehlung und die Begründung fälliger Wiederholungen ein.
- Lokaler JavaScript-Einstiegskurs mit sieben Lernzielen, Kursbegründungen, Übungshinweisen und lokalen Wiederholungsintervallen.
- Tauri-SQLite-Speicherung, Migration und einmaliger Import der alten Browserdaten; versionierter JSON-Gesamtexport, Import/Wiederherstellung mit Größen- und Dateivalidierung, Bestätigungsdialog und lokale Löschfunktion. Beim beschädigten Speicher werden normale Ansichten und Schreibvorgänge blockiert, bis ein gültiger Export wiederhergestellt ist. Exportdateien können privaten Quellcode enthalten.
- Lokale Code-Base-Snapshots mit Notizen, Zeilendiff und Wiederherstellung. Code Studio enthält jetzt lokale Mehrdateien-Projekte, Dateiwechsel, Erstellen/Umbenennen/Löschen, Projektimport/-export als `.devpath-project.json`, Pfad-/Größenbegrenzungen und Erkennung typischer Schlüsseldateien. Code Base speichert ganze Projekt-Snapshots; vor Wiederherstellung wird automatisch der aktuelle Stand gesichert. Lektion und Studio teilen den Code der jeweils verknüpften Übungsdatei. Die Projektexporte sind JSON-Dateien, keine ZIP-Dateien oder Git-Repositories.
- Lokales Diplom und überspringbarer Abschlussmoment mit Unterstützung für reduzierte Bewegung.
- OIDC-geschütztes API-Grundgerüst mit Ratenbegrenzung, Herkunfts-Allowlist, Health-Endpunkten und minimaler PostgreSQL-Migration für Konto-/Kurs-/Release-Metadaten.
- Produktwebsite-Grundgerüst. Vite ignoriert Rust-Buildartefakte im Datei-Watcher.
- Codeausführung bleibt deaktiviert, bis eine Sandbox pro Zielbetriebssystem unabhängig geprüft ist. Externe KI, Community und Synchronisierung sind nicht verbunden.

## Erfolgreich verifiziert

- `npm run build` – TypeScript und Frontend-Produktionsbuild erfolgreich; nach der Ergänzung des persönlichen Wochenrhythmus am 22.10.2026 erneut erfolgreich ausgeführt.
- `npm run check --prefix server` – Syntaxprüfung der API erfolgreich.
- `cargo check --manifest-path src-tauri/Cargo.toml` – erfolgreich.
- `npm run tauri -- build --bundles nsis` – Windows-x64-NSIS-Installer erfolgreich erstellt und vom Bundler geprüft.
- Aktueller Stand 22.10.2026: `npm run tauri -- build --bundles nsis` nach den Wochenplanänderungen erfolgreich; unsignierter NSIS-Installer unter `src-tauri/target/release/bundle/nsis/DevPath_0.1.0_x64-setup.exe`.
- `npm run tauri -- dev` – Nutzer hat bestätigt, dass die Desktop-Entwicklungsapp startet.
- Tauri-Icons für Windows, macOS und Linux sind in `src-tauri/icons/` vorhanden.

## Windows-Installer

Der neu gebaute NSIS-Installer mit dem aktualisierten `</>`-Logo liegt unter `src-tauri/target/release/bundle/nsis/DevPath_0.1.0_x64-setup.exe`. Eine Kopie für die Downloadseite liegt unter `website/downloads/DevPath_0.1.0_x64-setup.exe`; die zugehörige SHA-256-Datei liegt daneben. Die Website verlinkt auf `/downloads/DevPath_0.1.0_x64-setup.exe`.

Das ist ein **unsignierter Entwicklungs-/Alpha-Build**. Vor Installation lokale DevPath-Daten sichern. Windows kann vor unsignierter Software warnen. Nicht öffentlich verteilen und nicht als produktives Release behandeln.

## Noch erforderlich, bevor Phase 2 als private Alpha abgeschlossen gilt

1. **Produkt-/Rechtsfreigaben:** Zielmarkt, Altersrahmen, unterstützte OS-Mindestversionen, Betreibername, Datenschutz-/Supportkontakt und Teilnahmebedingungen durch die zuständigen Personen festlegen. Minderjährige bis zur Freigabe nicht einladen.
2. **Datenbankbetrieb:** Produktions-Lesezugriff auf den Kurskatalog und lokaler Restore samt `devpath_app`-Leserechten sind bestätigt. Supabase-Backuptarif/Aufbewahrung, sichere verschlüsselte Ablage und vollständige providerbezogene Wiederherstellung bleiben offen.
3. **Konto:** E-Mail/Passwort und Google-PKCE sind in der App implementiert. Vor einem nutzbaren Produktionskonto müssen Migration 005 angewendet, Google in Supabase konfiguriert, Redirect-Allowlist und Makers-OIDC-Variablen eingerichtet und Kontoanlage, Profilabruf, Logout, Wiederherstellung sowie Kontolöschung getestet werden. Bis dahin ist die Anmeldung nicht als produktionsbereit bestätigt.
4. **Codeausführung:** Runnerprotokoll und Sandbox je OS bauen und unabhängig prüfen. Bis zum bestandenen Gate bleibt Ausführung deaktiviert.
5. **Release:** CI-Matrix auf allen Plattformen erfolgreich nachweisen; Artefakte mit real beschafften Plattformschlüsseln signieren/notarisieren; Updatefeed, Rollback/Widerruf, SBOM/Lizenzinventar und Schlüsselrotation umsetzen. Keine Signierschlüssel sind im Repository.
6. **Website/API:** Präsentations- und Downloadseite sind implementiert und mit dem Installer verbunden. Der Nutzer prüfte für die damals verwendete Domain HTTP 200 sowie CSP und `X-Content-Type-Options: nosniff` auf `/` und `/download/`; die dauerhafte Project Domain aus Makers und die Header der API-Routen müssen noch bestätigt werden. Systemanforderungen und Betreiber-/Datenschutz-/Supportangaben, Makers-Rate-Limit und verifizierte (signierte) Releaseartefakte bleiben offen. Die Katalogroute ist produktiv bestätigt; Kontoendpunkte bleiben ungenutzt.
7. **Unabhängige Prüfung:** Threat-/Datenschutzgates, Accessibility-/Screenreaderreview, Kursfachreview, Usabilitytests und Securityreview mit realen Personen durchführen; kritische Befunde schließen. CI-Dependency-Scans nach dem ersten GitHub-Lauf auswerten.
8. **Betrieb:** Die lokale `public`-Schema-Restoreprobe samt App-Leserechten ist bestanden; vollständige providerbezogene Wiederherstellung ist nicht geprüft. Backup-/Aufbewahrungsentscheidung, Incident-Tabletop, reale Kontaktwege und Teilnahmebedingungen abschließen. Private Alpha erst danach freigeben.

## In dieser Arbeitsrunde vorbereitet

- Betriebsrunbook mit PowerShell-Backup, Restore ausschließlich in eine leere Testdatenbank, Prüfabfragen, Incident-Triage und Freigabeprotokoll.
- Entscheidungsregister mit den bestätigten Projektdaten und ausdrücklich offenen Produkt-/Providerfragen.
- Wöchentliche Dependency-Updatekonfiguration für npm/Cargo/GitHub Actions und CI-Lockfile-Audits.
- Desktop-Buildworkflow legt erfolgreiche unsignierte Windows-/macOS-/Linux-CI-Pakete für 14 Tage als GitHub-Actions-Artefakte ab. Das sind Testpakete, keine signierten oder öffentlichen Releases.
- Website-Sprunglink, mobile Navigation und klar sichtbarer Tastaturfokus ergänzt. Das ist eine Implementierung, kein ersetzender Screenreader-/Kontrasttest.
- Wiederherstellung des lokalen Profils in den Einstellungen ergänzt; alte unversionierte DevPath-0.1-Exporte bleiben importierbar. Projektdateien werden bei Import wie bei Code-Studio-Projektimport auf erlaubte relative Pfade, Geheimdateien und Größen geprüft. Beschädigter SQLite-/Browserzustand wird nicht automatisch mit Startdaten überschrieben.
- Importpfade für Dateinamen- und Lernzielschlüssel so abgesichert, dass spezielle JavaScript-Schlüsselnamen keine Prototypen verändern.
- Lerntage und bevorzugte Uhrzeit wurden in Ersteinrichtung und Einstellungen ergänzt; die Wochenübersicht zeigt jetzt die gewählten Tage. Die Lernenden können die Termine jederzeit ändern; es werden keine Benachrichtigungen außerhalb der App aktiviert.
- Lernversuche und Hilfen werden lokal erfasst. Bei Wiederholungen erklärt die Empfehlung, ob zusätzliche Hinweise oder eine niedrige Selbsteinschätzung den Termin ausgelöst haben.
- Die Kontofunktionen wurden nach der früheren offline-only Entscheidung ergänzt: E-Mail/Passwort, Google-OAuth mit PKCE, Startprofilkonto und geschützte API-Routen. Sie sind bis zur vollständigen Supabase-/Makers-Konfiguration und zum End-to-End-Test als nicht betriebsbereit zu behandeln.
- Datenschutz-/Supportentwurf unter `docs/PRIVACY_SUPPORT_PHASE2.md` angelegt. Er dokumentiert lokale Datenarten, deaktivierte Übertragungen, die sichtbaren Makers-Protokollfelder, Support-Triage und vor Veröffentlichung fehlende Betreiber-/Kontakt-/Retentionangaben. Die Diagnoseoption in den App-Einstellungen zeigt jetzt ausdrücklich „Deaktiviert“, weil keine Diagnoseübertragung implementiert ist. Die Website-Kurzinfo benennt klar die derzeitige Windows-Alpha und verlinkt im Footer nicht länger auf ein „Datenschutzkonzept“, das noch keine vollständige Datenschutzerklärung ist.
- Offener lokaler Datenschutzpunkt: DevPath verschlüsselt seine SQLite-Datenbank nicht anwendungsseitig. Auf dem bisherigen Gerät wurde Laufwerk C: als nicht BitLocker-verschlüsselt bestätigt. Vor Tests mit persönlichen Lern- oder Codeinhalten ist ein geeigneter lokaler Geräteschutz erforderlich.
- Nach diesen Änderungen sind `npm run build` und der NSIS-Paketbuild erfolgreich. Der aktualisierte Installer wurde erzeugt; Verhalten des neuen Wochenplans und Datenexports muss noch in der installierten App von einer Person geprüft werden.

## Statusprüfung am 22. Oktober 2026

- GitHub Actions für Commit `4e5b8a0`: Frontend build #41, Desktop build matrix #30 (Windows/macOS/Linux) und Dependency security audit #19 erfolgreich.
- Ältere lokale Buildnachweise (`npm run build`, `npm run check --prefix server`, `cargo check --locked --manifest-path src-tauri/Cargo.toml`) bezogen sich auf `f6983e8`; sie sind kein Ersatz für einen neuen lokalen Build nach späteren Codeänderungen.
- Die zuvor vom Nutzer in PowerShell geprüfte Website-/Downloadantwort lieferte HTTP 200 sowie CSP und `X-Content-Type-Options: nosniff`; eine stabile Project Domain aus der Makers-Konsole und Makers-Rate-Limit-Regeln bleiben unbestätigt. Supabase-Tarif/Retention und eine verschlüsselte Backupablage sind offen. Die lokale Probe des DevPath-`public`-Schemas einschließlich Runtime-Rollenprüfung wurde am 22.10.2026 erfolgreich durchgeführt; Incidentübung offen.

## Was du jetzt ausführen kannst

Zum Installieren und Ausprobieren des lokalen Windows-Alpha-Builds kannst du die NSIS-Datei oben starten. Wenn du stattdessen aus dem Quellcode starten willst:

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run tauri -- dev
```

Der aktuelle Produktions-Healthcheck zeigt, dass die API PostgreSQL erreicht. Er führt keine Kursinhalte ein und veröffentlicht keine App-Releases. Community, Cloud-Synchronisierung und externe KI bleiben entsprechend dem Phase-2-Plan außerhalb der privaten Alpha.
