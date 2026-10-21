# DevPath Phase 2 – Abschlussstand und Übergabe

**Stand:** 21. Oktober 2026  
**Status:** Lokale Windows-Alpha und EdgeOne-/Supabase-Readiness funktionieren; Phase 2 ist noch nicht als private Alpha freigegeben.
**Plan:** [DEVPATH_PHASE2_PLAN.md](DEVPATH_PHASE2_PLAN.md)

## EdgeOne-Vorbereitung (21. Oktober 2026)

- GitHub-Deployment der Website vorbereitet: Makers-Projektwurzel ist `website`, statische Ausgabe `.`; die Website bleibt eine noch nicht produktionsreife Platzhalterseite.
- Node.js-Cloud-Function-Handler unter `website/cloud-functions/api/` bilden Health-, Kurs-, Release- und OIDC-Kontorouten ab. Der lokale Fastify-Server bleibt für lokale Entwicklung und klassische Node-Hosts erhalten.
- Cloud-Functions-Zielregion ist Frankfurt (`eu-frankfurt`); die Supabase-Datenbank liegt in `eu-west-1` (Ireland). Der Nutzer hat die PostgreSQL-Migration und die Makers-Produktionsvariablen eingerichtet. `/api/health/ready` wurde auf der aktuellen Produktionsdomain erfolgreich bestätigt; der TLS-Handshake verwendet das geprüfte Supabase-CA-Zertifikat.
- Eine versionierte HTML/CSS-Pilotkursdatei wird reproduzierbar aus `src/course.ts` generiert. Ihre SHA-256-Prüfsumme und die zugehörige idempotente Metadatenmigration liegen im Repository. Der Nutzer hat Migration 001 und danach 002 in einer pgAdmin-Verbindung mit Datenbankname `devpath` erfolgreich ausgeführt. Die Produktions-API antwortet auf `/api/v1/courses` mit `{"courses":[]}`. Da die konfigurierte Produktions-URL auf `/postgres` zeigt, ist noch zu verifizieren, ob die Pilotkursmigration auch in genau dieser gehosteten Produktionsdatenbank ausgeführt wurde.
- Aktuelle vom Nutzer bestätigte Produktionsdomain: `https://devpath-dpbd5xdq2oj6.edgeone.dev/`. Domainwechsel in Makers können diese Adresse ändern.
- Makers-Projektvariablen, Migrationsschritte, Routen und verbleibende Sicherheitsprüfung stehen in [website/DEPLOYMENT.md](website/DEPLOYMENT.md). Keine Zugangsdaten wurden gespeichert.
- Ein Windows-/macOS-/Linux-Desktop-Buildworkflow wurde ergänzt. Er ist erst nach Push in GitHub ausführbar; die plattformübergreifenden Pakete wurden noch nicht gebaut oder signiert.
- EdgeOne-Handler-Syntax und JSON-Manifeste geprüft. Der Frontend-Produktionsbuild wurde nach der Mehrdateien-Projektumsetzung erneut erfolgreich erstellt. Ein erfolgreicher `/api/health/ready`-Aufruf bestätigt PostgreSQL-Erreichbarkeit; er bestätigt nicht, dass der Kurskatalog befüllt, ein Download signiert oder alle Datenbankrechte minimal sind. `/api/v1/courses` lieferte trotz gemeldeter Kursmigration `{"courses":[]}`. Die dynamische Katalogantwort verwendete CDN-Caching mit `stale-while-revalidate`; dies wurde auf `Cache-Control: no-store` geändert. Die Änderung ist lokal gebaut, muss aber noch in Makers deployed und gegen den Produktionsendpunkt geprüft werden. Bleibt die Antwort danach leer, muss die Produktions-DATABASE_URL mit der Datenbank abgeglichen werden, in der 002 ausgeführt wurde.

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

1. **Produkt-/Rechtsfreigaben:** Zielmarkt, Altersrahmen, unterstützte OS-Mindestversionen, Datenschutz-/Supportkontakt und Teilnahmebedingungen festlegen. Minderjährige bis zur Freigabe nicht einladen.
2. **Datenbankbetrieb:** Least-privilege-Runtime-Rolle, Kurs-/Releaseendpunkte, Kursdaten, Backup und Restore prüfen. Migration/TLS-Erreichbarkeit sind bestätigt; Rollenprüfung und Wiederherstellungsübung sind nicht bestätigt.
3. **Konto:** Identitätsanbieter ist noch nicht gewählt; Desktop-PKCE, Wiederherstellung, Logout/Widerruf und Kontolöschung sind nicht verbunden. Offline-Lernen ohne Konto ist die aktuelle Vorgabe und darf dafür nicht blockiert werden.
4. **Codeausführung:** Runnerprotokoll und Sandbox je OS bauen und unabhängig prüfen. Bis dahin bleibt Ausführung bewusst ausgeschaltet.
5. **Release:** NSIS signieren; CI-Builds auf echten Windows-, macOS- und Linux-Runnern erfolgreich belegen; macOS signieren/notarisieren; Updatefeed, Rollback/Widerruf, SBOM und Schlüsselverwaltung einrichten.
6. **Website/API:** Platzhalterseite durch freigegebene Produkt-, Systemanforderungs-, Datenschutz-, Download- und Supportinformationen ersetzen. Kurs-/Releaseinhalte, Runtime-Datenbankrechte, API-Rate-Limits und CORS der konkreten Clients verifizieren.
7. **Unabhängige Prüfung:** Phase-1-Threat-/Datenschutzgates, Accessibility-/Screenreaderreview, Kursfachreview, Usabilitytests und Securityreview durchführen; kritische Befunde schließen.
8. **Betrieb:** Vorfallablauf, Datenlöschung, Backup/Restore, Supportkontakt und private Alpha-Teilnahmebedingungen dokumentieren. Private Alpha erst nach diesen Freigaben starten.

## Was du jetzt ausführen kannst

Zum Installieren und Ausprobieren des lokalen Windows-Alpha-Builds kannst du die NSIS-Datei oben starten. Wenn du stattdessen aus dem Quellcode starten willst:

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run tauri -- dev
```

Der aktuelle Produktions-Healthcheck zeigt, dass die API PostgreSQL erreicht. Er führt keine Kursinhalte ein und veröffentlicht keine App-Releases. Community, Cloud-Synchronisierung und externe KI bleiben entsprechend dem Phase-2-Plan außerhalb der privaten Alpha.
