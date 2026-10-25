# CodeZone – Produktanforderungen, Datenschutz und Design

**Status:** Arbeitsgrundlage für Phase 1  
**Version:** 0.1  
**Stand:** 21. Oktober 2026

## 1. Produktziel

CodeZone ist eine Desktop-Lernumgebung für Softwareentwicklung auf Windows, macOS und Linux. Sie unterstützt Einsteiger und erfahrene Lernende jeden Alters mit verständlichen Kursen, praktischen Programmieraufgaben und einem individuellen Lernpfad. Eine begleitende Website dient zunächst der Kontoerstellung, dem Download und den nötigen Informationsseiten.

**Produktversprechen:** CodeZone hilft Menschen, Softwareentwicklung im eigenen Tempo zu lernen. Die Lernplanung passt sich an verfügbare Zeit, Ziele und beobachtbaren Lernfortschritt an. KI-Unterstützung erklärt und gibt Hinweise; sie verändert Nutzercode nicht ohne Zustimmung.

## 2. Grundsätze

1. **Lernende behalten die Kontrolle.** Lernplan, Tempo, Erinnerungen und KI-Hilfen sind einstellbar.
2. **Lokal zuerst.** Code, Projekte und Versionsgeschichte werden standardmäßig auf dem eigenen Gerät verarbeitet und gespeichert.
3. **Datensparsam.** Es werden nur Daten erhoben, die für die ausdrücklich genutzte Funktion nötig sind.
4. **Verständlich für alle Altersgruppen.** Sprache, Navigation und Aufgaben setzen kein Vorwissen über Lernplattformen voraus.
5. **Zugänglich und inklusiv.** Tastaturbedienung, Screenreader, skalierbare Schrift, Kontrast und reduzierte Bewegung sind Anforderungen.
6. **Sicher durch Gestaltung.** Ausführung von Nutzer-Code ist isoliert; Onlinefreigaben und externe KI-Übermittlung erfordern klare Nutzerhandlung.
7. **Ehrliche Rückmeldung.** Fortschritt und Diplome beschreiben tatsächlich abgeschlossene Lernziele und behaupten keine externe Anerkennung.

## 3. Umfang der ersten Ausbaustufe

### Enthalten

- Eine Desktop-App-Grundstruktur für Windows, macOS und Linux.
- Eine einfache Website für Kontoerstellung, App-Download, Datenschutzinformationen und Supportkontakt.
- Einen lokalen Nutzerbereich mit Sprache, Barrierefreiheits- und Basiseinstellungen.
- Eine definierte Schnittstelle zwischen App und Server für Anmeldung und Kurskatalog.
- Einen dokumentierten Sicherheits- und Datenschutzrahmen als Grundlage für Architekturentscheidungen.
- Eine erste visuelle Sprache mit Navigation, Typografie, Farben, Komponenten und Zuständen.

### Noch nicht Teil des ersten Grundgerüsts

- Vollständige Lerninhalte für alle angekündigten Kurse.
- Öffentliche Community und Projektveröffentlichungen.
- Cloud-Synchronisierung von Quellcode oder Code Base.
- Unbegrenzte oder ungeprüfte Codeausführung.
- Automatische Änderungen am Code durch KI.

Diese Punkte können später ergänzt werden, sobald Nutzerbedarf, Schutzmaßnahmen und Betriebsaufwand geklärt sind.

## 4. Nutzer und Kernabläufe

### Zielgruppen

- Menschen ohne Programmiererfahrung
- Lernende mit ersten Kenntnissen, die gezielt weiterlernen möchten
- Personen, die sich beruflich orientieren oder auf einen Einstieg vorbereiten
- Erfahrene Entwickler, die eine neue Sprache oder ein neues Thema lernen
- Minderjährige, die mit altersgerechten Voreinstellungen lernen

Die App leitet Lernniveau nicht allein aus Alter ab. Bei Minderjährigen sind Konto-, Community- und Datenschutzanforderungen vor Freischaltung gesondert zu prüfen.

### Erster Ablauf

1. Nutzer lädt die App von der offiziellen Website herunter und prüft Herausgeber sowie Plattform.
2. App zeigt Zweck, lokale Datenverarbeitung und Onlinefunktionen in knapper Sprache.
3. Nutzer kann ein lokales Profil anlegen; Konto ist nur für ausdrücklich kontogebundene Funktionen nötig.
4. Eine optionale Startabfrage erfasst Ziel, Vorkenntnisse und realistische Lernzeit.
5. CodeZone schlägt einen anpassbaren Lernplan vor und erklärt, warum die nächsten Schritte empfohlen werden.
6. Nutzer kann eine Lektion offline öffnen, soweit der Kursinhalt lokal verfügbar ist.

## 5. Funktionale Anforderungen

### Desktop-App

- Plattformübergreifender Installer und nachvollziehbare Versionsanzeige.
- Startansicht mit nächster Lerneinheit, Fortschritt und Plananpassung.
- Lokale Einstellungen für Sprache, Schriftgröße, Kontrast, Animation und Benachrichtigungen.
- Verständliche Fehlerzustände, Offlinehinweis und Wiederherstellung nach Absturz.
- Aktualisierung über signierte Pakete; Updatekanal und aktuelle Version sind sichtbar.

### Website

- Download der freigegebenen App-Versionen.
- Kontoerstellung und Kontowiederherstellung, wenn Kontofunktionen aktiviert sind.
- Datenschutz-, Sicherheits-, Support- und Systemanforderungsseiten.
- Keine Werbe- oder Trackingprofile als Voraussetzung für die Nutzung.

### Lernplanung

- Nutzer kann Lernziel, Zeitbudget und bevorzugte Tage ändern.
- Empfehlungen sind erklärbar und können abgelehnt werden.
- Anpassung nutzt nur für diesen Zweck erforderliche Lernsignale.
- Keine Sanktionen oder beschämenden Meldungen bei Pausen oder verfehlten Zielen.

### KI-Tutor (spätere Funktion, Anforderungen bereits festgelegt)

- Nutzer sieht, ob eine Anfrage lokal oder über einen Serverdienst verarbeitet wird.
- Vor externer Übermittlung werden Inhalt und Datenarten benannt; Übermittlung ist abschaltbar.
- Standardantworten sind Hinweise, Fragen und Erklärungen, keine stillen Codeänderungen.
- Änderungsvorschläge werden als Diff oder klar abgegrenzter Vorschlag angezeigt und benötigen Zustimmung.
- Keine Zugangsdaten oder Umgebungsvariablen ohne ausdrückliche Auswahl in Prompts aufnehmen.

## 6. Datenschutzkonzept

### Datenklassen und Standardbehandlung

| Datenart | Beispiele | Standardort | Zweck |
|---|---|---|---|
| Lokale Profildaten | Einstellungen, Lernziel | Gerät | App personalisieren |
| Lernfortschritt | abgeschlossene Lektionen, Übungsversuche | Gerät | Lernplan und Fortschritt |
| Quellcode/Projekte | Dateien, lokale Versionen | Gerät | Lernen und Entwickeln |
| Kontodaten | E-Mail oder gewählter Anmeldename, Sitzungsdaten | Server, falls Konto genutzt wird | Anmeldung und Kontowiederherstellung |
| Diagnosedaten | Absturz- und Fehlerberichte | Gerät; Versand nur nach Einwilligung | Fehler beheben |
| Communitydaten | veröffentlichte Projekte, Kommentare | Server, erst nach aktiver Veröffentlichung | Teilen und Austausch |
| KI-Anfragen | ausgewählter Text oder Codeausschnitt | lokal oder benannter KI-Anbieter | konkrete KI-Hilfe |

### Verbindliche Regeln

- Vor Implementierung werden Rechtsraum, Anbieter, Aufbewahrungsfristen und Verantwortlichkeiten festgelegt.
- Keine Analyse von Lernverhalten zu Werbung, Verkauf oder Bewertung außerhalb des Lernzwecks.
- Nicht notwendige Telemetrie ist standardmäßig ausgeschaltet; Diagnoseversand erfolgt mit Einwilligung.
- Nutzer können lokale Daten exportieren und löschen. Kontolöschung umfasst die zugeordneten Serverdaten nach dokumentierter Frist.
- Cloud-Synchronisierung ist separat und ausdrücklich aktivierbar; Synchronisationsumfang und Konfliktverhalten sind sichtbar.
- Verschlüsselung bei Übertragung und angemessene Verschlüsselung gespeicherter Kontodaten sind Pflicht.
- Für Minderjährige werden Altersanforderungen, Einwilligungswege und Communityschutz vor Start rechtlich geprüft.

## 7. Sicherheitsanforderungen

- Bedrohungsmodell für Anmeldung, Updatekette, lokale Dateien, Server-API, KI-Anbindung und Community erstellen.
- Server-API authentifiziert und autorisiert jede geschützte Aktion; Konten erhalten minimal nötige Rechte.
- Geheimnisse und Signierschlüssel liegen nicht im Client und nicht im Quellcode.
- Installer und Updates werden signiert; Updateartefakte werden serverseitig geprüft und versioniert.
- Nutzer-Code läuft in einer isolierten Umgebung mit Zeit-, Speicher- und Rechtebegrenzung. Netzwerk und Dateizugriff sind standardmäßig gesperrt.
- Communityupload validiert Dateitypen, Größen und Metadaten; gefährliche Inhalte werden nicht automatisch ausgeführt.
- Sicherheitsereignisse werden protokolliert, ohne unnötig Quellcode oder Zugangsdaten zu erfassen.
- Abhängigkeiten werden inventarisiert und regelmäßig auf bekannte Schwachstellen geprüft.
- Backup-, Wiederherstellungs- und Vorfallreaktionsverfahren sind vor Produktionsbetrieb dokumentiert.

## 8. Server- und Betriebsrahmen

Der Server ist für Konto, Downloadmetadaten, Kurskatalog und später optionale Synchronisierung, KI und Community zuständig. Die App soll für lokale Lektionen, Codeprojekte und Code Base nicht von dauerhafter Serververfügbarkeit abhängen.

Für die erste Architekturentscheidung sind mindestens zu dokumentieren:

- unterstützte Regionen und Hostinganbieter
- Identitäts- und Sitzungsverwaltung
- API-Grenzen und Versionskompatibilität
- Trennung von Konten, Community und optionalen Analysen
- Verschlüsselung, Schlüsselverwaltung und Backups
- Verfügbarkeit, Wiederherstellung und Updatekanal
- Kostenannahmen und Zuständigkeit für Sicherheitsupdates

Konkrete Anbieter und Technologien werden erst nach Plattform-, Lizenz-, Datenschutz- und Betriebskostenvergleich ausgewählt.

## 9. Designregeln

Die visuelle Richtung ist eine klare, expressive Material-inspirierte Oberfläche, angepasst an Desktopbedienung und die Konventionen der Zielbetriebssysteme. Android-Begriffe dienen als Stilreferenz; CodeZone übernimmt kein fremdes Branding und behauptet keine offizielle Designsystem-Konformität.

- Primäre Navigation dauerhaft sichtbar und auf wenige Hauptbereiche begrenzt.
- Lernplan, Kursbibliothek und Code Studio haben eindeutige Namen und konsistente Positionen.
- Eine Hauptaktion pro Ansicht; fortgeschrittene Optionen werden bei Bedarf eingeblendet.
- Farben ergänzen Beschriftungen und Symbole, ersetzen diese aber nicht.
- Statusmeldungen nennen Ursache und nächsten sinnvollen Schritt.
- Schrift und Oberfläche skalieren; Tastaturfokus ist jederzeit sichtbar.
- Animationen sind kurz, zweckgebunden und vollständig reduzierbar; Abschlussanimation ist überspringbar.
- Codebeispiele verwenden eigene zugängliche Kontrastregeln, unabhängig vom allgemeinen Farbschema.
- Auf Mobilgeräte optimierte Website, aber Desktoppriorität für die Lern-App.

### Erste Hauptnavigation

1. **Heute** – nächste Lerneinheit und persönlicher Fortschritt
2. **Lernen** – Lernpfad und Kursbibliothek
3. **Code Studio** – Aufgaben und Projekte
4. **Code Base** – lokale Projekte und Versionen
5. **Community** – später, nach Moderations- und Datenschutzfreigabe

## 10. Erfolgskriterien für Phase 1

Phase 1 gilt als abgeschlossen, wenn:

- Zielgruppen, Kernabläufe und Umfang der ersten Version dokumentiert sind.
- Jede Datenart einen Zweck, Speicherort und eine Kontrolle durch Nutzer hat.
- Sicherheitsgrenzen für Konto, Updates, lokale Ausführung und spätere Onlinefunktionen festgehalten sind.
- Navigation, Gestaltungsprinzipien und Barrierefreiheitsanforderungen beschrieben sind.
- Offene Rechts-, Betriebs- und Technologieentscheidungen mit Verantwortlichkeit und Entscheidungstermin erfasst sind.
- Die Grundlagen als überprüfbares, versioniertes Dokument vorliegen.

## 11. Offene Entscheidungen

| Entscheidung | Vorschlag für die nächste Prüfung | Status |
|---|---|---|
| Unterstützte Mindestversionen der Betriebssysteme | Markt- und Wartungsaufwand je Plattform vergleichen | Offen |
| Konto für Offline-Lernen | Lokales Profil ohne Konto ermöglichen | Vorschlag |
| Hostingregion und Betreiber | Nach Zielmarkt und Datenschutzprüfung wählen | Offen |
| KI-Ausführung | Lokal bevorzugen, externe Anbieter pro Funktion transparent machen | Vorschlag |
| Minderjährigenzugang | Altersgerechte Regeln und Rechtsprüfung vor Communitystart | Offen |
| Lizenzierung der Kurse und Editor-Komponenten | Lizenzinventar vor Technologieauswahl | Offen |
| Marken- und Designreferenz | Eigenständige CodeZone-Komponentenbibliothek erstellen | Offen |

## 12. Nächste Arbeitsschritte

1. Dieses Dokument mit Produktverantwortlichen prüfen und offene Entscheidungen festlegen.
2. Bedrohungsmodell und Datenflussdiagramm für App, Website und Server erstellen.
3. Navigations-Wireframes und Design-Tokens für die Desktop-App definieren.
4. Plattform- und Technologievergleich durchführen und begründete Auswahl dokumentieren.
5. Phase-1-Backlog mit Akzeptanzkriterien und einem ersten vertikalen Produktumfang erstellen.
