# CodeZone – Phase-1-Fundament und Phase-2-Alphaaufbau

Der Repositorystand enthält ein lokales Desktop-Alpha-Grundgerüst. Ein Windows-x64-NSIS-Installer wurde erstellt. Das Projekt ist **noch nicht sicherheitsgeprüft oder für öffentliche Verteilung freigegeben**.

## Enthalten

- Tauri-2-Shell mit beschränkter Capability.
- React + TypeScript-Oberfläche für Heute, Lernen, Code Studio, Code Base, Diplom und Einstellungen.
- Einmalige, lokal gespeicherte Startabfrage; anfängerfreundlicher Einstieg ohne Sprachcode; Sprach- und Themenkurse mit persönlichem Lehrplan und Wiederholungen.
- Lokale SQLite-Datenhaltung, Lernplan, Code-Base-Snapshots, JSON-Export und Löschfunktion.
- PostgreSQL-Migration und OIDC-geschütztes API-Grundgerüst unter `server/`; noch ohne Hosting, Identitätsanbieter oder produktive Datenbank.
- Statische Website unter `website/`.
- Nutzer-Codeausführung ist bis zur Prüfung eines Betriebssystem-spezifischen Sandboxesystems gesperrt. Externe KI, Community, Kontoanmeldung und Synchronisierung sind nicht verbunden.

## Ordnerübersicht

| Ordner | Hier änderst du … |
| --- | --- |
| `src/kurse/` | Kursinhalte (`course-curriculum.ts`), zusätzliche Themenlektionen (`course-extensions.ts`), Sprachlektionen (`language-extensions.ts`), Katalog und Lernplan. |
| `src/oberflaeche/` | Ansichten, wiederverwendbare Bauteile, Editor und Gestaltung der Desktop-App. |
| `src/anmeldung/` | Anmeldung und Kontenansicht. |
| `src/projekte/` | Lokale Code-Projekte und Import/Export. |
| `src/daten/` | Gespeicherter Lernstand und gemeinsame Datentypen. |
| `dokumentation/` | Einrichtung, Betrieb und Entscheidungen. |
| `skripte/` | Build- und Veröffentlichungshelfer. |
| `website/` | Statische Website und veröffentlichte Kurspakete. |
| `server/` | API und Datenbankmigrationen. |

`src`, `src-tauri`, `public` und `.github` behalten ihre von den verwendeten Werkzeugen erwarteten Namen. Die Startdateien `src/main.tsx` und `src/App.tsx` liegen direkt unter `src`.

## Entwicklung

Die neueste Version direkt auf diesem Windows-PC starten:

```powershell
cd C:\Users\leviw\Documents\ChatGPT\devpath
git pull origin main
npm install
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run tauri -- dev
```

Die App öffnet sich als lokales Desktop-Fenster. Für einen schnellen Blick nur auf die Oberfläche reicht `npm run dev`; Vite zeigt danach die lokale Adresse im Terminal an. Für die Desktop-Funktionen den Tauri-Befehl oben verwenden.

Voraussetzungen: Node.js 20.19+ oder 22.12+, Rust stable/Cargo sowie die Tauri-Systemabhängigkeiten des jeweiligen Betriebssystems.

```powershell
npm install
$env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
npm run tauri -- dev
```

Frontend-Produktionsbuild: `npm run build`. Windows-NSIS-Paket: `npm run tauri -- build --bundles nsis`. macOS-ARM64, macOS-x64 und Linux-x64 werden über die GitHub-Actions-Matrix gebaut. Für die öffentliche Veröffentlichung müssen die Supabase-Storage-Secrets eingerichtet und **Actions → Desktop build matrix → Run workflow** auf `main` gestartet werden; die Veröffentlichung erzeugt SHA-256-Prüfdateien. Die Plattformpakete sind in dieser Alpha unsigniert.

Die PostgreSQL-Migration wird nicht automatisch ausgeführt. Das API-Grundgerüst und die vorsichtigen Datenbankhinweise stehen in [server/README.md](server/README.md).

## Datenschutz und Sicherheit

- Lernstand, Code und Versionen bleiben im aktuellen Stand lokal; keine Zugangsdaten oder Lernprofile werden an den Server gesendet.
- Appcode wird nicht ausgeführt und nicht an KI gesendet.
- Der NSIS-Build ist unsigniert und dient nur der lokalen Alphaerprobung. Vor Installation eigene CodeZone-Daten sichern; nicht öffentlich verteilen.
- Veröffentlichung setzt unabhängige Sicherheits-, Datenschutz-, Accessibility- und Lerninhaltsreviews, Signierung, Updatebetrieb und die offenen Punkte aus [DEVPATH_PHASE2_IMPLEMENTATION.md](DEVPATH_PHASE2_IMPLEMENTATION.md) voraus.
