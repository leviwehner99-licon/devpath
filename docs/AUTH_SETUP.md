# DevPath-Konto und Anbieter einrichten

Die Desktop-App verwendet Supabase Auth für E-Mail/Passwort, Google und Apple. Google-/Apple-Passwörter werden nie an DevPath übermittelt. OAuth läuft mit PKCE im Systembrowser und kehrt über `devpath://auth/callback` zurück. `public.accounts` speichert die interne Konto-ID, die OIDC-Identität und das Startprofil. Lernstand, Programmcode und Projekte werden lokal je Konto getrennt gespeichert und derzeit nicht synchronisiert.

## 1. Supabase Auth vorbereiten

1. Öffne [das DevPath-Supabase-Projekt](https://supabase.com/dashboard/project/rvhxsgexonmolrpdxdou).
2. Gehe zu **Authentication → URL Configuration**.
3. Setze die **Site URL** auf die aktuelle DevPath-Präsentationsdomain.
4. Füge unter **Redirect URLs** genau `devpath://auth/callback` hinzu und speichere.
5. Gehe zu **Authentication → Sign In / Providers → Email** und aktiviere E-Mail-Anmeldung. Lass E-Mail-Bestätigung eingeschaltet, damit ein neues Konto erst nach bestätigter Adresse verwendet wird.

## 2. Google-Provider

1. Öffne [Google Cloud Console](https://console.cloud.google.com/) und erstelle oder wähle ein Projekt.
2. Richte unter **Google Auth Platform** die Branding- und Audience-Angaben ein.
3. Erstelle unter **Clients** eine OAuth-Client-ID vom Typ **Web application**.
4. Trage als **Authorized redirect URI** die Callback-Adresse ein, die Supabase auf der Google-Providerseite anzeigt. Sie hat für dieses Projekt die Form `https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1/callback`.
5. Kopiere Client-ID und Client-Secret in **Supabase → Authentication → Sign In / Providers → Google** und aktiviere den Provider.

## 3. Apple-Provider

1. Öffne [Apple Developer](https://developer.apple.com/account/) und richte dort **Sign in with Apple** samt Services ID und Key ein. Apple verlangt dafür ein Apple-Developer-Konto.
2. Verwende als Return URL die Callback-Adresse, die Supabase in den Einstellungen des Apple-Providers anzeigt (für das Projekt typischerweise `https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1/callback`).
3. Trage Services ID, Team ID, Key ID und den von Apple erzeugten privaten Key in **Supabase → Authentication → Sign In / Providers → Apple** ein und aktiviere den Provider.

Google und Apple leiten zuerst zu Supabase zurück. Supabase leitet anschließend an die erlaubte App-Adresse `devpath://auth/callback` weiter. Client-Secrets bleiben in Supabase; niemals in `.env.local`, GitHub-Variablen oder den Desktop-Build kopieren.

## 4. Datenbank einmalig migrieren

Die Tabelle `public.accounts` ist bereits vorhanden. Es wird **keine zweite Kontotabelle** angelegt.

1. Öffne im Supabase-Dashboard **SQL Editor → New query**.
2. Öffne lokal die Datei `server/migrations/005_account_profiles.sql`.
3. Kopiere den gesamten Dateiinhalt in den SQL Editor und klicke **Run**.
4. Die Ausgabe muss mit `COMMIT` enden und darf keine `ERROR`-Zeile enthalten.

Migration 005 ergänzt das JSONB-Startprofil, gibt der eingeschränkten `devpath_app`-Rolle die nötigen Kontorechte und filtert sie mit PostgreSQL-RLS nach der im jeweiligen Transaktionskontext verifizierten OIDC-Issuer- und Subject-Kombination.

## 5. Makers-Production-Variablen

Öffne das EdgeOne-Makers-Projekt → **Settings → Environment Variables** → **Production**. Lege diese Einträge an beziehungsweise prüfe sie:

| Name | Wert |
| --- | --- |
| `OIDC_ISSUER` | `https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1` |
| `OIDC_AUDIENCE` | `authenticated` |
| `OIDC_JWKS_URI` | `https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1/.well-known/jwks.json` |
| `SUPABASE_URL` | `https://rvhxsgexonmolrpdxdou.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Geheimer `service_role`-Key aus **Supabase → Project Settings → API Keys**; als Secret speichern |
| `CORS_ORIGINS` | `http://tauri.localhost,https://tauri.localhost,tauri://localhost,https://devpath-dpxzcux4g6bz.edgeone.dev` |

Für die API muss Supabase ein asymmetrisch signiertes Auth-JWT (zum Beispiel ES256 oder RS256) mit passendem JWKS-Endpunkt ausstellen. Der `service_role`-Key wird nur für die serverseitige Kontolöschung benötigt und darf nie in die App gelangen. Speichere und deploye die Production-Variablen in Makers.

## 6. Lokale App konfigurieren und starten

1. Öffne PowerShell im Projektordner:

   ```powershell
   cd "C:\Users\leviw\Documents\ChatGPT\devpath"
   Copy-Item .env.example .env.local
   notepad .env.local
   ```

2. Ersetze in `.env.local` den Platzhalter `VITE_SUPABASE_ANON_KEY` mit dem **öffentlichen anon/publishable Key** aus **Supabase → Project Settings → API Keys**. Verwende dort niemals `service_role`.
3. Speichere die Datei, schließe DevPath und starte die Entwicklungs-App:

   ```powershell
   npm run tauri -- dev
   ```

## 7. GitHub-Variablen für Installer-Builds

Die Vite-Konfiguration wird beim Build in die Desktop-App eingebettet. Öffne auf GitHub `leviwehner99-licon/devpath` → **Settings → Secrets and variables → Actions → Variables** und lege diese **Repository variables** an:

- `VITE_SUPABASE_URL` = `https://rvhxsgexonmolrpdxdou.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = derselbe öffentliche anon/publishable Key
- `VITE_DEVPATH_API_URL` = aktuelle dauerhafte Makers-Production-Domain, ohne abschließenden `/`

Dann **Actions → Desktop build matrix → Run workflow → Branch `main` → Run workflow**. Der Installer hat die Kontoanmeldung erst nach erfolgreichem Build und einem Makers-Deployment mit diesen Variablen.

## 8. Funktion prüfen

1. In der App **Konto erstellen** wählen und mit einer eigenen Testadresse registrieren.
2. Den Supabase-Bestätigungslink öffnen. Windows/macOS/Linux sollten die installierte DevPath-App über `devpath://` wieder öffnen.
3. Die App sollte danach die Startabfrage zeigen und sie nach „Meinen Lernplan erstellen“ speichern.
4. In Supabase **Table Editor → public → accounts** muss eine neue Zeile mit `oidc_issuer`, `oidc_subject` und gefülltem `profile` erscheinen. Keine Tokens oder Passwörter dort eintragen.
5. Abmelden und erneut anmelden. Das Profil sollte für dasselbe Konto wieder geladen werden.

Google und Apple zusätzlich jeweils mit ihren aktivierten Provider-Clients testen. Für produktive Freigabe müssen Bestätigungs-E-Mails, OAuth-Rückleitung, Kontoanlage, Profilabruf, Abmelden und Kontolöschung in der installierten App erfolgreich geprüft werden.
