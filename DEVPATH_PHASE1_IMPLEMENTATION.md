# DevPath – Phase-1-Implementierungsstand

**Stand:** 21. Oktober 2026  
**Version:** 0.1  
**Zweck:** Trennung zwischen gebautem Fundament, lokal verifizierten Punkten und noch offenen Phase-1-Gates.

## Umgesetzt

- Tauri-2-Desktopprojekt mit React, TypeScript und Vite als ausführbarem Frontend-Fundament.
- Minimale Tauri-Capability: nur `core:default`; die native Rust-Schicht stellt im Moment nur die Appversion bereit.
- CSP-Grundregel im Tauri-Konfigurationsfile; keine extern geladenen Fonts.
- Ansichten: Heute, Lernen, Code Studio, Code Base und Einstellungen.
- Eine lokale HTML-Pilotlektion mit Lernziel, Inhalt, abgestuften Hinweisen und Monaco-Editor.
- Lokale Speicherung von Anzeigename, Lernziel, Rhythmus, Darstellung und Pilotcode/-fortschritt.
- Lokaler Datenexport und Löschaktion für den Prototyp.
- Codeausführung ist gesperrt und erklärt den Grund; es gibt keinen unsicheren Prozessstart.
- Konto, KI, Community, Sync und Backend sind nicht verbunden und senden keine Daten.
- Separate, statische Produktwebsite mit Produktbeschreibung und Startstatus.
- Statische Hostingheader als Beispiel unter `website/_headers`; Hostingplattform ist noch nicht gewählt.
- Frontend-CI-Workflow für TypeScript-Build.
- npm-Abhängigkeiten gescannt; DOMPurify auf 3.4.17 überschrieben, weil die installierte Monaco-Abhängigkeit sonst bekannte Advisories enthielt.

## Verifizierte Punkte

- `npm run build` erzeugt den Vite-Produktionsbuild erfolgreich.
- `npm audit` nach dem Abhängigkeitsfix meldete 0 bekannte Schwachstellen.
- Die Abhängigkeit `dompurify` wird im Lockfile auf 3.4.17 aufgelöst.

## Noch offen – Phase 1 ist deshalb noch nicht vollständig abgenommen

| Gate / Bereich | Status | Grund / nächster Schritt |
|---|---|---|
| Rust-/Tauri-Build | Nicht verifiziert | Rust/Cargo ist in der aktuellen Umgebung nicht installiert. Toolchain und Tauri-OS-Voraussetzungen einrichten, dann Desktoppakete bauen. |
| Windows/macOS/Linux-Paketmatrix | Nicht verifiziert | Es liegt nur ein Frontendbuild vor; Builds, Mindestversionen und Installationspfade müssen in Plattform-CI geprüft werden. |
| Signierter Testbuild und Update | Nicht umgesetzt | Keine Signierschlüssel oder Releaseumgebung im Projekt. Signing/Rotation separat konfigurieren; keinen geheimen Schlüssel ins Repository legen. |
| Runner-Sandbox | Nicht umgesetzt | Nutzer-Code wird absichtlich nicht ausgeführt. Je Betriebssystem isolierten Runner konzipieren und nach den dokumentierten Grenzen prüfen. |
| Lokale persistente Datenbank | Prototypisch | Frontend nutzt `localStorage`, nicht die geplante native SQLite-Schicht. Das ist nicht als Sicherheitsgrenze gedacht und muss vor Beta ersetzt werden. |
| Konten/API/Hosting | Offen | Zielmarkt, Hostingregion, Kontooptionalität und Identitätsanbieter sind nicht beschlossen. |
| Nutzertest und Accessibilityreview | Offen | Kein externer Usabilitytest, Screenreaderreview oder gemessener Kontrastnachweis durchgeführt. |
| Lerninhalt/Fachreview | Teilweise | Beispiellektion und Hinweise angelegt; qualifizierter Fachreview und didaktischer Nutzertest stehen aus. |
| Minderjährigen- und Rechtsprüfung | Offen | Zielmarkt und Altersmodell sind nicht entschieden; Community bleibt aus. |
| Websiteproduktion | Grundgerüst | Statische Seite ist erstellt; reale Datenschutzinformation, Kontakt, Downloadartefakte, Hosting und Headerverifikation fehlen. |

## Architekturhinweise

- Der Editor ist ein Code-Editor, keine Laufzeit. Die Schaltfläche „Code ausführen“ startet keinen Prozess.
- Der lokale Stand wird derzeit in der Browser-/WebView-Ablage gehalten. Nutzer mit Zugriff auf dasselbe Betriebssystemkonto können ihn potenziell einsehen oder ändern.
- Das JSON-Exportformat ist ein Prototypformat und noch kein dauerhaft versioniertes Austauschformat.
- CI erstellt momentan nur den Frontendbuild, keine plattformübergreifenden Desktoppakete.
- Die statischen `_headers` sind Netlify-kompatibel; ihre Wirkung hängt von einer passenden Hostingplattform ab und wurde hier nicht online geprüft.
- Der Vite-Devserver ließ sich in diesem UI-Prüfumfeld nicht über den In-App-Browser öffnen; visuelle Browserprüfung steht damit aus.

## Nächste konkrete Schritte

1. Rust/Cargo und Tauri-Systemabhängigkeiten in einer Buildumgebung bereitstellen.
2. Tauri-Konfiguration und Paketbau auf Windows, macOS und Linux validieren.
3. Plattform-CI sowie SBOM- und Lizenzinventar ergänzen.
4. SQLite- und Dateizugriffsschicht mit versionierten Migrationen entwickeln.
5. Sandboxrunner und signierten Updateprototyp mit separaten Freigabeschlüsseln umsetzen.
6. Browser-/Desktopreview, Accessibility-Review und Lernendentest durchführen.
7. Ergebnis in `DEVPATH_PHASE1_BACKLOG.md` nach Gates abnehmen und den Phase-2-Umfang freigeben.

Der vorgeschlagene Phase-2-Umfang ist in [DEVPATH_PHASE2_PLAN.md](DEVPATH_PHASE2_PLAN.md) dokumentiert; Phase 2 startet erst nach Freigabe bzw. klarer Einschränkung der dort genannten Gate-0-Voraussetzungen.
