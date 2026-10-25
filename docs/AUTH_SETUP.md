# CodeZone-Konto und Anbieter einrichten

Die Desktop-App verwendet Supabase Auth für E-Mail/Passwort und Google. Google-Passwörter werden nie an CodeZone übermittelt. Google OAuth läuft mit PKCE im Systembrowser und kehrt über `codezone://auth/callback` zurück. `public.accounts` speichert die interne Konto-ID, die OIDC-Identität und das Startprofil. Lernstand, Programmcode und Projekte werden lokal je Konto getrennt gespeichert und derzeit nicht synchronisiert.

## 1. Supabase Auth vorbereiten

1. Öffne [das CodeZone-Supabase-Projekt](https://supabase.com/dashboard/project/rvhxsgexonmolrpdxdou).
2. Gehe zu **Authentication → URL Configuration**.
3. Setze die **Site URL** auf die aktuelle CodeZone-Präsentationsdomain.
4. Füge unter **Redirect URLs** genau `codezone://auth/callback` hinzu und speichere. Die alte `devpath://auth/callback`-Adresse darf während der Übergangszeit zusätzlich eingetragen bleiben, damit ältere App-Versionen noch zurückkehren können.
5. Gehe zu **Authentication → Sign In / Providers → Email** und aktiviere E-Mail-Anmeldung. Lass E-Mail-Bestätigung eingeschaltet, damit ein neues Konto erst nach bestätigter Adresse verwendet wird.

## 2. Google-Provider

1. Öffne [Google Cloud Console](https://console.cloud.google.com/) und wähle das bestehende Projekt `devpath-512514`. Ändere nicht die Projekt-ID; sie ist eine technische Kennung.
2. Öffne **Google Auth Platform → Branding** und ändere den sichtbaren App-Namen zu `CodeZone`. Die vorhandene Supportadresse `devpath.support@gmail.com` und der erreichbare Entwicklerkontakt bleiben eingetragen, bis eine neue Supportadresse eingerichtet ist.
   Lade dort auch das CodeZone-Logo hoch. Wenn Google im Anmeldefenster weiterhin `rvhxsgexonmolrpdxdou.supabase.co` statt `CodeZone` nennt, prüfe diese Branding-Seite und speichere/publiziere die Angaben. Bei einer externen App im Testmodus oder ungeprüfter Marke kann Google Name und Logo ausblenden; für eine breite Veröffentlichung kann eine Markenprüfung nötig sein.
3. Öffne **Audience**, wähle **External** und füge dein Google-Konto als **Test user** hinzu, solange die App im Testmodus ist.
4. Öffne **Data Access** und vergewissere dich, dass `openid`, `email` und `profile` angefordert werden. Füge keine weiteren Scopes hinzu.
5. Öffne **Clients → Create client**, wähle **Web application** und gib dem Client den Namen `CodeZone Supabase Auth`.
6. Unter **Authorized redirect URIs** füge die Callback-Adresse ein, die Supabase auf der Google-Providerseite anzeigt. Für dieses Projekt lautet sie:

   ```text
   https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1/callback
   ```

7. Erstelle den Client und kopiere Client-ID und Client-Secret direkt in **Supabase → Authentication → Sign In / Providers → Google**. Aktiviere und speichere den Google-Provider. Das Client-Secret bleibt ausschließlich in Supabase.

Google leitet zuerst zu Supabase zurück. Supabase leitet anschließend an die erlaubte App-Adresse `codezone://auth/callback` weiter. Diese Deep-Link-Adresse gehört in Supabase unter **Authentication → URL Configuration → Redirect URLs**, nicht in Googles Callback-Feld. Die Google-Callback-Adresse bleibt `https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1/callback`; sie darf nicht durch die `codezone://`-Adresse ersetzt werden. Client-Secrets niemals in `.env.local`, GitHub-Variablen oder den Desktop-Build kopieren.

## 3. Datenbank einmalig migrieren

Die Tabelle `public.accounts` ist bereits vorhanden. Es wird **keine zweite Kontotabelle** angelegt.

1. Prüfe zuerst, ob Migration 005 bereits angewendet wurde. Wenn ja, überspringe diesen Abschnitt.
2. Öffne im Supabase-Dashboard **SQL Editor → New query**.
3. Öffne lokal die Datei `server/migrations/005_account_profiles.sql`, kopiere den gesamten Inhalt in den SQL Editor und klicke **Run**.
4. Die Ausgabe muss mit `COMMIT` enden und darf keine `ERROR`-Zeile enthalten. Eine bereits angewendete Migration nicht erneut ausführen.

Migration 005 ergänzt das JSONB-Startprofil, gibt der eingeschränkten `devpath_app`-Rolle die nötigen Kontorechte und filtert sie mit PostgreSQL-RLS nach der im jeweiligen Transaktionskontext verifizierten OIDC-Issuer- und Subject-Kombination.

## 4. Makers-Production-Variablen

Öffne das EdgeOne-Makers-Projekt → **Settings → Environment Variables** → **Production**. Lege diese Einträge an beziehungsweise prüfe sie:

| Name | Wert |
| --- | --- |
| `OIDC_ISSUER` | `https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1` |
| `OIDC_AUDIENCE` | `authenticated` |
| `OIDC_JWKS_URI` | `https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1/.well-known/jwks.json` |
| `SUPABASE_URL` | `https://rvhxsgexonmolrpdxdou.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Geheimer `service_role`-Key aus **Supabase → Project Settings → API Keys**; als Secret speichern |
| `CORS_ORIGINS` | `http://tauri.localhost,https://tauri.localhost,tauri://localhost,https://<aktuelle-makers-project-domain>` |

Für die API muss Supabase ein asymmetrisch signiertes Auth-JWT (zum Beispiel ES256 oder RS256) mit passendem JWKS-Endpunkt ausstellen. Der `service_role`-Key wird nur für die serverseitige Kontolöschung benötigt und darf nie in die App gelangen. Speichere und deploye die Production-Variablen in Makers.

## 5. Lokale App konfigurieren und starten

1. Öffne PowerShell im Projektordner:

   ```powershell
   cd "C:\Users\leviw\Documents\ChatGPT\devpath"
   Copy-Item .env.example .env.local
   notepad .env.local
   ```

2. Ersetze in `.env.local` den Platzhalter `VITE_SUPABASE_ANON_KEY` mit dem **öffentlichen anon/publishable Key** aus **Supabase → Project Settings → API Keys**. Verwende dort niemals `service_role`.
3. Speichere die Datei, schließe CodeZone und starte die Entwicklungs-App:

   ```powershell
   npm run tauri -- dev
   ```

## 6. GitHub-Variablen für Installer-Builds

Die Vite-Konfiguration wird beim Build in die Desktop-App eingebettet. Öffne auf GitHub `leviwehner99-licon/devpath` → **Settings → Secrets and variables → Actions → Variables** und lege diese **Repository variables** an:

- `VITE_SUPABASE_URL` = `https://rvhxsgexonmolrpdxdou.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = derselbe öffentliche anon/publishable Key
- `VITE_DEVPATH_API_URL` = aktuelle dauerhafte Makers-Production-Domain, ohne abschließenden `/`

Dann **Actions → Desktop build matrix → Run workflow → Branch `main` → Run workflow**. Der Installer hat die Kontoanmeldung erst nach erfolgreichem Build und einem Makers-Deployment mit diesen Variablen.

## 7. Funktion prüfen

1. In der App **Mit Google registrieren** wählen und das als Testnutzer zugelassene Google-Konto verwenden.
2. Nach der Google-Freigabe sollte der Browser Supabase und dann die CodeZone-App über `codezone://auth/callback` öffnen.
3. Die App sollte das Startprofil anzeigen und es nach „Meinen Lernplan erstellen“ speichern.
4. In Supabase **Table Editor → public → accounts** muss eine Zeile mit `oidc_issuer`, `oidc_subject` und gefülltem `profile` erscheinen. Keine Tokens oder Passwörter dort eintragen.
5. Abmelden und erneut mit Google anmelden. Das Profil sollte für dasselbe Konto wieder geladen werden.
6. E-Mail/Passwort separat prüfen: Bestätigungslink öffnen, zur App zurückkehren, abmelden und wieder anmelden.

Für produktive Freigabe müssen Google-OAuth-Rückleitung, Kontoanlage, Profilabruf, Abmelden, Passwortwiederherstellung und Kontolöschung in der installierten App erfolgreich geprüft werden.
