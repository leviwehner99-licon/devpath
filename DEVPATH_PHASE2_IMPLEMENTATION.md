# DevPath Phase 2 – Abschlussstand und Übergabe

**Stand:** 22. Oktober 2026
**Status:** Lokale Windows-Alpha und der Production-Kurskatalog funktionieren. Phase 2 ist weiterhin **nicht** als private Alpha freigegeben; externe Betriebs-, Produkt- und Sicherheitsgates sind offen.
**Plan:** [DEVPATH_PHASE2_PLAN.md](DEVPATH_PHASE2_PLAN.md)

## EdgeOne-Vorbereitung (21. Oktober 2026)

- GitHub-Deployment der Website vorbereitet: Makers-Projektwurzel ist `website`, statische Ausgabe `.`; die Website bleibt eine noch nicht produktionsreife Platzhalterseite.
- Node.js-Cloud-Function-Handler unter `website/cloud-functions/api/` bilden Health-, Kurs-, Release- und OIDC-Kontorouten ab. Der lokale Fastify-Server bleibt für lokale Entwicklung und klassische Node-Hosts erhalten.
- Cloud-Functions-Zielregion ist Frankfurt (`eu-frankfurt`); die Supabase-Datenbank liegt in `eu-west-1` (Ireland). Der Nutzer hat die PostgreSQL-Migration und die Makers-Produktionsvariablen eingerichtet. `/api/health/ready` wurde auf der aktuellen Produktionsdomain erfolgreich bestätigt; der TLS-Handshake verwendet das geprüfte Supabase-CA-Zertifikat.
- Eine versionierte HTML/CSS-Pilotkursdatei wird reproduzierbar aus `src/course.ts` generiert. Migration 001 erstellt Schema und Tabellen; Migration 002 veröffentlicht den HTML/CSS-Pilotkurs; Migration 003 gewährt `devpath_app` nur SELECT-Zugriff auf veröffentlichte Kurs-/Releasezeilen und setzt RLS-Policies. Am 22.10.2026 bestätigte der Nutzer, dass `/api/v1/courses` in Production jetzt alle erwarteten Kurse anzeigt. Damit ist der Produktionsabruf des veröffentlichten Katalogs verifiziert.
- Aktuelle vom Nutzer bestätigte Produktionsdomain: `https://devpath-dpv9ts9ylvn2.edgeone.dev/`. Domainwechsel in Makers können diese Adresse ändern.
- Makers-Projektvariablen, Migrationsschritte, Routen und verbleibende Sicherheitsprüfung stehen in [website/DEPLOYMENT.md](website/DEPLOYMENT.md). Keine Zugangsdaten wurden gespeichert.
- Backup-/Restore-Ablauf, Incident-Triage und Alpha-Freigabeprotokoll sind in [docs/PHASE2_OPERATIONS.md](docs/PHASE2_OPERATIONS.md) vorbereitet. Eine Restoreprobe oder Incidentübung wurde dadurch nicht durchgeführt.
- Bestätigte Produkt-/Architekturentscheidungen und offene Betreiberentscheidungen sind in [docs/PHASE2_DECISIONS.md](docs/PHASE2_DECISIONS.md) getrennt dokumentiert.
- Dependabot ist für npm, Cargo und GitHub Actions eingerichtet; ein CI-Workflow für npm- und RustSec-Lockfile-Audits wurde ergänzt. Bis ein GitHub-Workflow erfolgreich gelaufen ist, gilt der Scan nicht als bestanden.
- Ein Windows-/macOS-/Linux-Desktop-Buildworkflow wurde ergänzt. Er ist erst nach Push in GitHub ausführbar; die plattformübergreifenden Pakete wurden noch nicht gebaut oder signiert.
- EdgeOne-Handler-Syntax und JSON-Manifeste geprüft. Der Frontend-Produktionsbuild wurde nach der Mehrdateien-Projektumsetzung erneut erfolgreich erstellt. Die Katalogantwort verwendet `Cache-Control: no-store`. Nach Vergabe der gezielten Leserechte durch Migration 003 bestätigte der Nutzer in Production, dass der Kurskatalog die erwarteten Kurse anzeigt. Dies verifiziert den Katalogendpunkt und die Lesepfade für veröffentlichte Kurs- und Release-Metadaten; es ersetzt keine Prüfung weiterer Tabellenrechte oder anderer API-Routen.

## Lokal umgesetzt

- Tauri-2-Desktop-App mit React/TypeScript, Monaco-Editor, Ansichten für Heute, Lernen, Code Studio, Code Base, Diplom und Einstellungen.
- Ersteinrichtung beim ersten Start: Lernziel, Vorerfahrung und gewünschte Einheiten sowie Zeit je Woche. Überspringbar; jederzeit lokal änderbar.
- HTML-/CSS-Pilotkurs mit sieben Lernzielen, Kursbegründungen, Übungshinweisen und lokalen Wiederholungsintervallen.
- Tauri-SQLite-Speicherung, Migration und einmaliger Import der alten Browserdaten; JSON-Export und lokale Löschfunktion.
- Lokale Code-Base-Snapshots mit Notizen, Zeilendiff und Wiederherstellung. Code Studio enthält jetzt lokale Mehrdateien-Projekte, Dateiwechsel, Erstellen/Umbenennen/Löschen, Projektimport/-export als `.devpath-project.json`, Pfad-/Größenbegrenzungen und Erkennung typischer Schlüsseldateien. Code Base speichert ganze Projekt-Snapshots; vor Wiederherstellung wird automatisch der aktuelle Stand gesichert. Lektion und Studio teilen den Code der jeweils verknüpften Übungsdatei. Die Projektexporte sind JSON-Dateien, keine ZIP-Dateien oder Git-Repositories.
- Lokales Diplom und überspringbarer Abschlussmoment mit Unterstützung für reduzierte Bewegung.
- OIDC-geschütztes API-Grundgerüst mit Ratenbegrenzung, Herkunfts-Allowlist, Health-Endpunkten und minimaler PostgreSQL-Migration für Konto-/Kurs-/Release-Metadaten.
- Produktwebsite-Grundgerüst. Vite ignoriert Rust-Buildartefakte im Datei-Watcher.
- Codeausführung bleibt deaktiviert, bis eine Sandbox pro Zielbetriebssystem unabhängig geprüft ist. Externe KI, Kontoanmeldung in der Desktop-App, Community und Synchronisierung sind nicht verbunden.

## Erfolgreich verifiziert

- `npm run build` – TypeScript und Frontend-Produktionsbuild erfolgreich.
- `npm run check --prefix server` – Syntaxprüfung der API erfolgreich.
- `cargo check --manifest-path src-tauri/Cargo.toml` – erfolgreich.
- `npm run tauri -- build --bundles nsis` – Windows-x64-NSIS-Installer erfolgreich erstellt und vom Bundler geprüft.
- `npm run tauri -- dev` – Nutzer hat bestätigt, dass die Desktop-Entwicklungsapp startet.
- Tauri-Icons für Windows, macOS und Linux sind in `src-tauri/icons/` vorhanden.

## Windows-Installer

Erzeugter Pfad: `src-tauri/target/release/bundle/nsis/DevPath_0.1.0_x64-setup.exe`.

Das ist ein **unsignierter Entwicklungs-/Alpha-Build**. Vor Installation lokale DevPath-Daten sichern. Windows kann vor unsignierter Software warnen. Nicht öffentlich verteilen und nicht als produktives Release behandeln.

## Noch erforderlich, bevor Phase 2 als private Alpha abgeschlossen gilt

1. **Produkt-/Rechtsfreigaben:** Zielmarkt, Altersrahmen, unterstützte OS-Mindestversionen, Betreibername, Datenschutz-/Supportkontakt und Teilnahmebedingungen durch die zuständigen Personen festlegen. Minderjährige bis zur Freigabe nicht einladen.
2. **Datenbankbetrieb:** Der Kurskatalog-Lesezugriff von `devpath_app` ist bestätigt. Weitere Rollen-/Tabellenrechte prüfen, Backuptarif und Aufbewahrung festlegen und die Restoreprobe aus `docs/PHASE2_OPERATIONS.md` in einem separaten Testziel tatsächlich durchführen.
3. **Konto:** OIDC-Anbieter ist nicht gewählt; Desktop-PKCE, Wiederherstellung, Logout/Widerruf und Kontolöschung sind nicht verbunden. Entweder diese Funktionen nach Anbieter- und Datenschutzprüfung implementieren oder Konto/API für Alpha deaktiviert lassen. Offline-Lernen bleibt möglich.
4. **Codeausführung:** Runnerprotokoll und Sandbox je OS bauen und unabhängig prüfen. Bis zum bestandenen Gate bleibt Ausführung deaktiviert.
5. **Release:** CI-Matrix auf allen Plattformen erfolgreich nachweisen; Artefakte mit real beschafften Plattformschlüsseln signieren/notarisieren; Updatefeed, Rollback/Widerruf, SBOM/Lizenzinventar und Schlüsselrotation umsetzen. Keine Signierschlüssel sind im Repository.
6. **Website/API:** Website um echte Systemanforderungen, freigegebene Datenschutz-/Supportinformationen und verifizierte Releaseartefakte ergänzen. Aktuell zeigt sie transparent den Entwicklungsstatus; Betreiber-/Rechtsangaben und Downloads werden nicht erfunden. API-Ratenbegrenzung, tatsächliche Clients und OIDC bleiben konkret zu verifizieren.
7. **Unabhängige Prüfung:** Threat-/Datenschutzgates, Accessibility-/Screenreaderreview, Kursfachreview, Usabilitytests und Securityreview mit realen Personen durchführen; kritische Befunde schließen. CI-Dependency-Scans nach dem ersten GitHub-Lauf auswerten.
8. **Betrieb:** Backup/Restore-Probe, Incident-Tabletop, reale Kontaktwege und Teilnahmebedingungen abschließen. Private Alpha erst danach freigeben.

## In dieser Arbeitsrunde vorbereitet

- Betriebsrunbook mit PowerShell-Backup, Restore ausschließlich in eine leere Testdatenbank, Prüfabfragen, Incident-Triage und Freigabeprotokoll.
- Entscheidungsregister mit den bestätigten Projektdaten und ausdrücklich offenen Produkt-/Providerfragen.
- Wöchentliche Dependency-Updatekonfiguration für npm/Cargo/GitHub Actions und CI-Lockfile-Audits.
- Website-Sprunglink, mobile Navigation und klar sichtbarer Tastaturfokus ergänzt. Das ist eine Implementierung, kein ersetzender Screenreader-/Kontrasttest.

## Was du jetzt ausführen kannst

Zum Installieren und Ausprobieren des lokalen Windows-Alpha-Builds kannst du die NSIS-Datei oben starten. Wenn du stattdessen aus dem Quellcode starten willst:

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run tauri -- dev
```

Der aktuelle Produktions-Healthcheck zeigt, dass die API PostgreSQL erreicht. Er führt keine Kursinhalte ein und veröffentlicht keine App-Releases. Community, Cloud-Synchronisierung und externe KI bleiben entsprechend dem Phase-2-Plan außerhalb der privaten Alpha.
