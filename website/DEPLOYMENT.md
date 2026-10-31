# CodeZone auf EdgeOne Makers vorbereiten

## GitHub-Projekt

- Repository: `leviwehner99-licon/devpath`
- Produktionsbranch: `main`
- Projektverzeichnis in Makers: `website`
- Build command: leer / kein Build
- Output directory: `.`
- Cloud Function Region: Frankfurt (`eu-frankfurt`), in `edgeone.json` festgelegt

Die Website und die API liegen im selben Makers-Projekt. Die statische Website bleibt im Ordner `website`; die API-Routen liegen unter `website/cloud-functions/api`. Makers erzeugt daraus `/api/...`-Routen.

## Produktionsbereitstellung

Die Repository-Wurzel für Makers ist `website`; die fertige Präsentationsseite liegt unter `/`, die Downloadseite unter `/download/`. Ein erfolgreicher Push auf den Production-Branch `main` löst entsprechend der Makers-Projekteinstellung ein Production-Deployment aus. Die aktuelle Project Domain ist danach im Makers-Projekt unter **Domain Management** abzulesen. Deployment-Domains pro Commit sind nicht als dauerhafte öffentliche Adresse zu behandeln.

Nach erfolgreichem Deployment alle Website- und API-Routen aus dem Abschnitt „API-Routen“ sowie die Installer- und SHA-256-URLs live abrufen. Die statischen Sicherheitsheader in `edgeone.json` und `_headers` sind erst dann bestätigt, wenn die echte Production-Antwort sie ausliefert. Die verwendete Cloud-Function-Region Frankfurt ist nicht automatisch gleichbedeutend mit der PostgreSQL-Region; die Datenbank bleibt in Supabase `eu-west-1`.

Vor einer Freigabe zusätzlich in Makers die Production-Domain-Zuordnung, Environment-Variablen, Request-/Rate-Limit-Regeln und Runtime-Logs prüfen. Keine geheimen Variablenwerte in GitHub, Screenshots oder Nachrichten kopieren.

## Projektvariablen

Variablen ausschließlich in **Project Settings → Environment Variables** der Makers-Konsole setzen, niemals in GitHub, `edgeone.json` oder eine `.env`-Datei committen.

| Name | Wann | Wert |
| --- | --- | --- |
| `NODE_ENV` | Produktion | `production` |
| `DATABASE_URL` | Nach Einrichtung der gehosteten PostgreSQL-Datenbank | TLS-Verbindungs-URI; nur eine eingeschränkte Anwendungsrolle verwenden |
| `DATABASE_SSL` | Produktion | `true` |
| `DATABASE_CA_CERT_B64_1` … `DATABASE_CA_CERT_B64_4` | Produktion | In bis zu vier Teile (je maximal 900 Zeichen) geteiltes Base64 des Supabase-CA-Zertifikats; die Teile werden in Reihenfolge zusammengesetzt und für TLS verwendet. Alternativ `DATABASE_CA_CERT`, falls der Anbieter den gesamten Inhalt zulässt. |
| `DATABASE_POOL_SIZE` | Produktion | `1` als Startwert für serverless Funktionen |
| `OIDC_ISSUER` | Nach Wahl des Identitätsanbieters | Exakter HTTPS-Issuer aus der Anbieter-Konfiguration |
| `OIDC_AUDIENCE` | Nach Wahl des Identitätsanbieters | API-Audience, für die Zugriffstoken ausgestellt werden |
| `OIDC_JWKS_URI` | Nach Wahl des Identitätsanbieters | HTTPS-URL des JWKS-Endpunkts |
| `SUPABASE_URL` | Konto löschen | `https://rvhxsgexonmolrpdxdou.supabase.co`; nur serverseitig |
| `SUPABASE_SERVICE_ROLE_KEY` | Konto löschen | Supabase-`service_role`-Key; nur als Makers-Secret, niemals in App oder Website einbetten |
| `CORS_ORIGINS` | Desktop-/Websitezugriff | Exakte Ursprünge: `http://tauri.localhost,https://tauri.localhost,tauri://localhost,https://devpath-dpxzcux4g6bz.edgeone.dev` |

Ohne Datenbankkonfiguration antworten Datenbankrouten mit `503`. Das ist beabsichtigt: es gibt keinen Rückfall auf eine lokale oder unsichere Datenbank.

## PostgreSQL-Migration

Vor dem Setzen von `DATABASE_URL` eine **dedizierte, gehostete** PostgreSQL-Datenbank in einer EU-Region (bevorzugt Frankfurt, falls verfügbar) erstellen. Lokal laufendes PostgreSQL auf dem Entwickler-PC ist kein Cloud-Backend. Port 5432 nicht am Router oder PC ins Internet freigeben.

Für eine komplett neue Datenbank zuerst `../server/migrations/001_initial.sql`, danach `../server/migrations/002_publish_html_css_pilot.sql` und zuletzt `../server/migrations/003_runtime_course_catalog_access.sql` ausführen. Für die bereits verwendete CodeZone-Datenbank zusätzlich einmalig `../server/migrations/004_replace_html_css_with_programming_intro.sql` und `../server/migrations/005_account_profiles.sql` ausführen. Migration 005 erweitert die vorhandene `accounts`-Tabelle um das Startprofil und erteilt der Serverrolle kontoindividuelle Rechte über transaktionsgebundene OIDC-Claims und RLS. Bereits ausgeführte Migrationen 001 bis 004 nicht wiederholen.

Migration 004 in Supabase unter **SQL Editor → New query** öffnen, vollständig ausführen und auf `COMMIT` ohne Fehler warten. Danach `GET /api/v1/courses` prüfen: die Antwort soll `programming-intro` enthalten und `pilot-html-css` nicht mehr enthalten. `GET /api/health/ready` allein bestätigt nur, dass die Datenbank erreichbar ist.

Wenn eine neue Fassung des Einstiegskurses veröffentlicht wird, zusätzlich die neueste nummerierte Veröffentlichung in `server/migrations` ausführen. Migration 008 veröffentlicht Version 4.1.0 mit verständlicheren Einstiegsbeispielen. Erst nachdem das statische Website-Deployment abgeschlossen und `/courses/programming-intro-4.1.0.json` erreichbar ist, die Migration ausführen. Danach `GET /api/v1/courses` aufrufen und bei `programming-intro` Version `4.1.0` sowie den neuen `contentPath` kontrollieren.

## Öffentliche Desktop-Installer

Die Workflow-Matrix baut Windows x64, macOS ARM64, macOS Intel x64 und Linux x64. Normale Pushes bauen und prüfen Windows, macOS ARM64 und Linux; der Intel-Mac-Build wird nur beim manuellen Plattformlauf ausgeführt. Öffentliche Pakete werden nach einem manuellen Lauf in den öffentlichen Supabase-Storage-Bucket `devpath-downloads` geladen; erst nach erfolgreichem Upload schaltet der Workflow die Installer- und SHA-256-Links in `/download/` frei und pusht die aktualisierte Seite nach `main`.

Einmalige Einrichtung durch den Repository-Betreiber:

1. Im Supabase-Projekt **Storage → New bucket** öffnen. Name: `devpath-downloads`; **Public bucket** einschalten; die maximale Dateigröße auf 50 MB setzen. Der Workflow verwendet für Linux ein Debian-Paket für Ubuntu/Debian x64 statt eines zu großen AppImages und prüft alle Installer vor dem Upload auf höchstens 48 MiB. Keine Client-Uploadrichtlinie für Besucher hinzufügen.
2. In GitHub `leviwehner99-licon/devpath` **Settings → Secrets and variables → Actions → New repository secret** öffnen. `SUPABASE_URL` auf `https://rvhxsgexonmolrpdxdou.supabase.co` setzen. Ein zweites Secret `SUPABASE_SERVICE_ROLE_KEY` anlegen und dort den geheimen `service_role`-Schlüssel aus Supabase **Project Settings → API Keys** speichern. Den Schlüssel niemals in Dateien, Releases, Chat oder Website eintragen.
3. In GitHub **Actions → Desktop build matrix → Run workflow** wählen, Branch `main` auswählen und den Lauf starten. Erst wenn alle Betriebssystem-Builds und der Job `publish-installers` grün sind, wurden Dateien hochgeladen. Die letzte Workflow-Aktion pusht die freigeschalteten Downloadlinks; Makers sollte daraufhin automatisch die Website neu deployen.

Die Dateien sind unsignierte Alpha-Pakete. Der Workflow veröffentlicht neben jedem Paket eine SHA-256-Datei. Eine Prüfsumme belegt die Unverändertheit der Datei, ersetzt aber keine Codesignatur oder Sicherheitsprüfung.

## API-Routen

- `GET /api/health/live` – Prozess-/Handler-Liveness ohne Datenbankzugriff.
- `GET /api/health/ready` – prüft PostgreSQL.
- `GET /api/v1/courses` – veröffentlichte Kursmetadaten; die Antwort wird mit `Cache-Control: no-store` ausgeliefert, damit neue Veröffentlichungen nicht hinter einem veralteten CDN-Katalog verborgen bleiben.
- `GET /api/v1/releases/:platform?channel=alpha` – Release-Metadaten.
- `PUT`, `GET`, `PATCH`, `DELETE /api/v1/me` – OIDC-geschütztes Konto anlegen, lesen, Startprofil speichern und löschen.

Die Konto-Routen verlangen gültige Supabase-Auth-JWTs und bearbeiten unter transaktionsgebundenen OIDC-Claims nur das Konto der angemeldeten Identität. App-Builds benötigen `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` und `VITE_DEVPATH_API_URL`. Die Einrichtung steht in `../dokumentation/AUTH_SETUP.md`.

## Vor einer Alpha-Freigabe

Die EdgeOne-Handler müssen nach Einrichtung der Anbieter in einem echten Makers-Projekt gegen die konkrete Runtime, CORS-Konfiguration, OIDC-Ausstellung und PostgreSQL-TLS-Verbindung geprüft werden. In der Makers-/EdgeOne-Sicherheitskonsole sollte die verfügbare präzise Rate-Limit-Regel auf `PUT`/`DELETE /api/v1/me` gelegt werden. Die freie Makers-Edition weist derzeit eine solche präzise Regel aus; Quoten können sich ändern. Ein prozesslokaler Zähler wäre bei serverless Instanzen keine verlässliche Schutzmaßnahme. Der bisherige Fastify-Server bleibt für lokale Entwicklung und andere Node-Hosts erhalten.
