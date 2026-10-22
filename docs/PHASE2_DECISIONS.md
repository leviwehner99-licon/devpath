# DevPath Phase 2 – Entscheidungsregister

**Stand:** 22. Oktober 2026. Dieses Register trennt bestätigte Projektentscheidungen von Punkten, die externe Informationen oder eine verantwortliche Freigabe erfordern.

## Bestätigte Entscheidungen

| Thema | Entscheidung | Folge |
| --- | --- | --- |
| Offline-Nutzung | Lernen soll vorerst ohne Konto funktionieren. | Desktop-App bleibt lokal nutzbar; Konto darf kein Startblocker sein. |
| Konto in der privaten Phase-2-Alpha | Offline-only; kein Anmeldebildschirm und keine Kontodaten für die Alpha. | OIDC-/PKCE-Implementierung wird bis zu einer späteren ausdrücklichen Kontoentscheidung nicht aktiviert. Die vorbereiteten API-Kontorouten bleiben ohne OIDC-Konfiguration geschlossen. |
| Hosted Datenbank | Supabase PostgreSQL, Projekt `rvhxsgexonmolrpdxdou`, Region `eu-west-1`. | Produktionskurskatalog wurde über die Makers-API bestätigt. Keine Geheimnisse in dieses Register aufnehmen. |
| Website/API-Hosting | EdgeOne Pages/Makers; Production branch ist laut Projektkonfiguration `main`. | Website und Cloud Functions teilen ein Projekt. Deployment-Status in Makers ist vor Release zu prüfen. |
| Runtime-Datenbankrolle | `devpath_app` liest veröffentlichte Kurse und Releases über Migration 003/RLS. | Andere Tabellenrechte und Restoreprobe bleiben offen. |
| Alpha-Umfang | Lokale Windows-Alpha und HTML/CSS-Pilotkurs als vertikaler Ausschnitt. | Kein Anspruch auf die späteren 14 Sprachen, alle Themenkurse oder Community. |
| Codeausführung | Bis zum bestandenen Sandboxreview deaktiviert. | Keine Laufzeit auf Nutzerdateien starten. |
| Community/Cloudsync/externe KI | Nicht verbunden. | Keine Projektdateien oder Lernhistorie hochladen. |

## Vor privater Alpha zu beschließende Punkte

| Entscheidung | Warum nötig | Zuständige Eingabe/Evidenz |
| --- | --- | --- |
| Zielmarkt, Mindestalter und Umgang mit Minderjährigen | Bestimmt Teilnahme-, Datenschutz- und Einwilligungsanforderungen. | Produktverantwortliche und qualifizierte Rechtsprüfung. Bis dahin keine Minderjährigen einladen und keine allgemeine Teilnahme anbieten. |
| Betreibername, Support- und Sicherheitskontakt | Website und Vorfallmeldung brauchen echte erreichbare Kontakte. | Vom Betreiber freigegebene Kontaktadresse; keine Platzhalteradresse veröffentlichen. |
| OIDC-Anbieter oder dauerhaft offline-only | OIDC-/PKCE-, Wiederherstellungs- und Löschabläufe hängen davon ab. | Anbieterprüfung; keine Zugangsdaten im Repository. Offline-Lernen bleibt verfügbar. |
| Mindestversionen der Betriebssysteme | Buildmatrix allein definiert keine getesteten Nutzersysteme. | Auf echten Geräten/Runnern verifizierte Versionen und Supportzeitraum. |
| Backup-Retention, RPO/RTO und Restoreverantwortung | Tarif und Betriebsziel sind noch nicht bekannt. | Aktueller Supabase-Tarif, Backupansicht, Kosten-/Aufbewahrungsentscheidung und Restoreprotokoll. |
| Signierung und Releasekanal | Signierschlüssel, Kosten und Veröffentlichung brauchen Eigentümer und kontrollierten Zugriff. | Getrennte Plattformkonten/Schlüssel, freigegebener Releaseprozess und Signaturverifikation. |
| Private Alpha Teilnahmebedingungen/Feedbackweg | Einladungen, Support und Rückmeldungen brauchen einen dokumentierten, datensparsamen Ablauf. | Freigegebene Bedingungen, Einwilligung, Verantwortliche und Kontakt. |

## Stoppregeln

- Keine rechtlichen Aussagen, Altersgrenzen, Betreiberidentität, Supportadressen oder Backuperfüllung erfinden.
- Kein öffentliches Alpha-Angebot, solange die obigen Freigaben und Sicherheitsgates offen sind.
- Kein Server-Login oder Sync aktivieren, bevor Anbieter, PKCE-Flow, Datenminimierung, Kontolöschung und unabhängige Prüfung vorhanden sind.
- Keine Codeausführung aktivieren, bevor Sandbox und Ressourcenlimits je Plattform geprüft sind.
