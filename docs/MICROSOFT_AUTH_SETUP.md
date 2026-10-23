# DevPath: Microsoft-Anmeldung einrichten

Die Desktop-App startet Microsoft OAuth über Supabase Auth. Der Providername in der App ist `azure`; in Supabase heißt der Provider **Azure**. Microsoft-Kundendaten werden nicht in der App gespeichert.

## 1. Microsoft Entra-Anwendung erstellen

1. Öffne [Microsoft Entra admin center](https://entra.microsoft.com/) und melde dich mit dem Microsoft-Konto an, das die DevPath-App verwalten soll.
2. Öffne **Identity → Applications → App registrations** und wähle **New registration**.
3. Name: `DevPath`.
4. Bei **Supported account types** wähle **Accounts in any organizational directory and personal Microsoft accounts**, damit private Microsoft-Konten und Arbeits-/Schulkonten zugelassen werden.
5. Bei **Redirect URI** wähle **Web** und füge exakt diese Adresse ein:

   ```text
   https://rvhxsgexonmolrpdxdou.supabase.co/auth/v1/callback
   ```

6. Klicke **Register**.
7. Auf der Übersichtsseite kopiere **Application (client) ID**. Nicht die Object ID verwenden.

## 2. Client Secret erzeugen

1. In der App-Registrierung öffne **Certificates & secrets → Client secrets → New client secret**.
2. Als Beschreibung `DevPath Supabase Auth` eintragen und eine Ablaufzeit auswählen.
3. **Add** wählen und sofort den Wert aus der Spalte **Value** kopieren. Nicht **Secret ID** verwenden. Der Value wird später nicht erneut vollständig angezeigt.
4. Ablaufdatum sicher notieren und vor Ablauf ein neues Secret erstellen und in Supabase austauschen.

## 3. Supabase konfigurieren

1. Öffne das Supabase-Projekt `rvhxsgexonmolrpdxdou`.
2. Öffne **Authentication → Sign In / Providers → Azure**.
3. Aktiviere den Provider.
4. Füge die **Application (client) ID** in das Client-ID-Feld ein.
5. Füge den **Value** des Microsoft Client Secret in das Secret-Feld ein.
6. Für private Microsoft-Konten plus Organisationskonten den Standardtenant verwenden. Nur bei einer bewusst auf einen einzelnen Organisationstenant beschränkten Anwendung dort dessen Tenant-URL eintragen.
7. Speichern.

Die App fordert bei Microsoft den Scope `email` an, den Supabase für diesen Provider benötigt. Die Rückleitung zurück in die Desktop-App wird über `devpath://auth/callback` abgewickelt; diese Deep-Link-Adresse gehört nicht als Microsoft-Redirect URI in Entra. Die Microsoft-Redirect URI oben führt zuerst zurück zu Supabase.

## Sicherheitsnotizen

- Client Secret weder in den Quellcode noch in GitHub, Makers-Variablen oder die Desktop-App eintragen. Es gehört nur in Supabases Provider-Konfiguration.
- Falls das Secret in einem falschen Feld gespeichert oder öffentlich geteilt wurde, in Entra widerrufen und ein neues erzeugen.
- OAuth-App-Registrierung, Redirect URI und Client Secret müssen in Entra und Supabase zueinander passen.

Quellen: [Supabase: Sign in with Azure (Microsoft)](https://supabase.com/docs/guides/auth/social-login/auth-azure), [Microsoft Learn: App registrieren](https://learn.microsoft.com/en-us/graph/auth-register-app-v2).
