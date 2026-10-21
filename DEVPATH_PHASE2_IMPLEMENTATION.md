# DevPath Phase 2 – Abschlussstand und Übergabe

**Stand:** 21. Oktober 2026  
**Status:** Windows-Alpha-Build erstellt; Phase 2 ist noch nicht für private oder öffentliche Verteilung freigegeben.  
**Plan:** [DEVPATH_PHASE2_PLAN.md](DEVPATH_PHASE2_PLAN.md)

## EdgeOne-Vorbereitung (21. Oktober 2026)

- GitHub-Deployment der Website vorbereitet: Makers-Projektwurzel ist `website`, statische Ausgabe `.`; die Website bleibt eine noch nicht produktionsreife Platzhalterseite.
- Node.js-Cloud-Function-Handler unter `website/cloud-functions/api/` bilden Health-, Kurs-, Release- und OIDC-Kontorouten ab. Der lokale Fastify-Server bleibt für lokale Entwicklung und klassische Node-Hosts erhalten.
- Cloud-Functions-Zielregion ist Frankfurt (`eu-frankfurt`). PostgreSQL und OIDC sind absichtlich nicht konfiguriert, weil dafür noch Anbieterentscheidungen fehlen.
- Makers-Projektvariablen, Migrationsschritte, Routen und verbleibende Sicherheitsprüfung stehen in [website/DEPLOYMENT.md](website/DEPLOYMENT.md). Keine Zugangsdaten wurden gespeichert.
- Ein Windows-/macOS-/Linux-Desktop-Buildworkflow wurde ergänzt. Er ist erst nach Push in GitHub ausführbar; die plattformübergreifenden Pakete wurden noch nicht gebaut oder signiert.
- EdgeOne-Handler-Syntax und JSON-Manifeste geprüft. `npm ci` für die neue Website-API konnte lokal nicht abgeschlossen werden, weil die npm-Paketregistrierung in dieser Umgebung nicht erreichbar war; der GitHub-/Makers-Build braucht Netzwerkzugriff.

## Lokal umgesetzt

- Tauri-2-Desktop-App mit React/TypeScript, Monaco-Editor, Ansichten für Heute, Lernen, Code Studio, Code Base, Diplom und Einstellungen.
- Ersteinrichtung beim ersten Start: Lernziel, Vorerfahrung und gewünschte Einheiten sowie Zeit je Woche. Überspringbar; jederzeit lokal änderbar.
- HTML-/CSS-Pilotkurs mit sieben Lernzielen, Kursbegründungen, Übungshinweisen und lokalen Wiederholungsintervallen.
- Tauri-SQLite-Speicherung, Migration und einmaliger Import der alten Browserdaten; JSON-Export und lokale Löschfunktion.
- Lokale Code-Base-Snapshots mit Notizen, Zeilendiff und Wiederherstellung. Der aktuelle Prototyp versioniert den Editorinhalt pro Lektion, noch keine frei wählbaren Mehrdateien-Projekte.
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

1. **Produktentscheidungen:** Hoster/Region, API-Betrieb, Identitätsanbieter, unterstützte OS-Versionen, Zielmarkt/Altersrahmen, Datenschutz- und Supportkontakt festlegen.
2. **Server und PostgreSQL:** dedizierte Dev/Test-Datenbank, begrenzte Anwendungsrolle, Migration ausführen, TLS/Secrets sicher einrichten; danach Kurs-/Releaseendpunkte gegen echte DB prüfen. Migration wurde hier nicht ausgeführt.
3. **Konto:** OIDC/PKCE in Desktop-App/Webseite anbinden, Logout/Widerruf und Kontolöschung im gewählten Anbieter abstimmen. Lokales Lernen muss weiterhin ohne Konto laufen.
4. **Projektarbeit:** Projektbaum, Mehrdateien-Speichern, explizite Projektpfadwahl, Ex-/Import und Secrets-/Pfadhygiene ergänzen.
5. **Codeausführung:** Runnerprotokoll und Sandbox je OS bauen und unabhängig prüfen. Bis dahin bleibt Ausführung ausgeschaltet.
6. **Release:** NSIS signieren; CI-Builds auf echten Windows-, macOS- und Linux-Runnern verifizieren; macOS notarisieren; Updatefeed, Rollback/Widerruf, SBOM und Schlüsselverwaltung einrichten.
7. **Unabhängige Prüfung:** Phase-1-Threat-/Datenschutzgates schließen; Accessibility-/Screenreaderreview, Kursfachreview, Usabilitytests und Securityreview durchführen; kritische Befunde beheben.
8. **Betrieb:** Support-/Securitykontakt, Backup/Restore, Vorfallablauf, Datenlöschung und Alpha-Teilnahmebedingungen dokumentieren. Keine Rekrutierung Minderjähriger, bis Alters-/Rechtsfragen freigegeben sind.

## Was du jetzt ausführen kannst

Zum Installieren und Ausprobieren des lokalen Windows-Alpha-Builds kannst du die NSIS-Datei oben starten. Wenn du stattdessen aus dem Quellcode starten willst:

```powershell
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run tauri -- dev
```

Der Web-/API-Produktionsbuild wird nicht auf die PostgreSQL-Datenbank angewendet. Für Hosting brauche ich als nächsten Kontext nur **Hoster und Hostingpaket** sowie – wenn entschieden – den **OIDC-Anbieter**. Keine Zugangsdaten in den Chat kopieren. Danach lassen sich konkrete Hosting- und pgAdmin-Schritte für deine Umgebung festlegen.
