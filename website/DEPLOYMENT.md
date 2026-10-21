# DevPath auf EdgeOne Makers vorbereiten

## GitHub-Projekt

- Repository: `leviwehner99-licon/devpath`
- Produktionsbranch: `main`
- Projektverzeichnis in Makers: `website`
- Build command: leer / kein Build
- Output directory: `.`
- Cloud Function Region: Frankfurt (`eu-frankfurt`), in `edgeone.json` festgelegt

Die Website und die API liegen im selben Makers-Projekt. Die statische Website bleibt im Ordner `website`; die API-Routen liegen unter `website/cloud-functions/api`. Makers erzeugt daraus `/api/...`-Routen.

## Erst deployen, wenn die öffentliche Platzhalterseite in Ordnung ist

Der erste erfolgreiche Produktions-Deploy macht `index.html` öffentlich erreichbar. Die Seite ist momentan noch eine Platzhalter-/Vorstellungsseite und kein fertiges Konto- oder Downloadportal.

## Projektvariablen

Variablen ausschließlich in **Project Settings → Environment Variables** der Makers-Konsole setzen, niemals in GitHub, `edgeone.json` oder eine `.env`-Datei committen.

| Name | Wann | Wert |
| --- | --- | --- |
| `NODE_ENV` | Produktion | `production` |
| `DATABASE_URL` | Nach Einrichtung der gehosteten PostgreSQL-Datenbank | TLS-Verbindungs-URI; nur eine eingeschränkte Anwendungsrolle verwenden |
| `DATABASE_SSL` | Produktion | `true` |
| `DATABASE_CA_CERT` | Produktion | Inhalt des Supabase-CA-Zertifikats (`prod-ca-2021.crt`); wird für die TLS-Zertifikatsprüfung benötigt |
| `DATABASE_POOL_SIZE` | Produktion | `1` als Startwert für serverless Funktionen |
| `OIDC_ISSUER` | Nach Wahl des Identitätsanbieters | Exakter HTTPS-Issuer aus der Anbieter-Konfiguration |
| `OIDC_AUDIENCE` | Nach Wahl des Identitätsanbieters | API-Audience, für die Zugriffstoken ausgestellt werden |
| `OIDC_JWKS_URI` | Nach Wahl des Identitätsanbieters | HTTPS-URL des JWKS-Endpunkts |
| `CORS_ORIGINS` | Wenn Browser-/Desktopclients cross-origin zugreifen | Kommagetrennte, exakte Ursprünge; keine Wildcards |

Ohne Datenbankkonfiguration antworten Datenbankrouten mit `503`. Das ist beabsichtigt: es gibt keinen Rückfall auf eine lokale oder unsichere Datenbank.

## PostgreSQL-Migration

Vor dem Setzen von `DATABASE_URL` eine **dedizierte, gehostete** PostgreSQL-Datenbank in einer EU-Region (bevorzugt Frankfurt, falls verfügbar) erstellen. Lokal laufendes PostgreSQL auf dem Entwickler-PC ist kein Cloud-Backend. Port 5432 nicht am Router oder PC ins Internet freigeben.

Die Datei `../server/migrations/001_initial.sql` nach Prüfung einmal auf der neuen leeren Datenbank ausführen (zum Beispiel in pgAdmin Query Tool, mit der dedizierten Migrationsrolle). Die Runtime-Rolle sollte nur die benötigten Tabellenrechte erhalten und nicht als `postgres` laufen. Danach die Runtime-Verbindungs-URI ausschließlich als geheime Makers-Variable hinterlegen.

## API-Routen

- `GET /api/health/live` – Prozess-/Handler-Liveness ohne Datenbankzugriff.
- `GET /api/health/ready` – prüft PostgreSQL.
- `GET /api/v1/courses` – veröffentlichte Kursmetadaten.
- `GET /api/v1/releases/:platform?channel=alpha` – Release-Metadaten.
- `PUT /api/v1/me` und `DELETE /api/v1/me` – OIDC-geschützte Kontoanlage/-löschung.

Konto-Routen bleiben nicht nutzbar, bis Issuer, Audience, JWKS, Datenbank und ein passender Client-PKCE-Flow eingerichtet und überprüft sind. Die Desktop-App sendet derzeit noch keinen produktiven Login-Flow.

## Vor einer Alpha-Freigabe

Die EdgeOne-Handler müssen nach Einrichtung der Anbieter in einem echten Makers-Projekt gegen die konkrete Runtime, CORS-Konfiguration, OIDC-Ausstellung und PostgreSQL-TLS-Verbindung geprüft werden. In der Makers-/EdgeOne-Sicherheitskonsole sollte die verfügbare präzise Rate-Limit-Regel auf `PUT`/`DELETE /api/v1/me` gelegt werden. Die freie Makers-Edition weist derzeit eine solche präzise Regel aus; Quoten können sich ändern. Ein prozesslokaler Zähler wäre bei serverless Instanzen keine verlässliche Schutzmaßnahme. Der bisherige Fastify-Server bleibt für lokale Entwicklung und andere Node-Hosts erhalten.
