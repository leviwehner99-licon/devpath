# DevPath Phase 2 – Datenschutz- und Supportentwurf

**Stand:** 22. Oktober 2026  
**Status:** Interner Arbeitsentwurf. Nicht als vollständige Datenschutzerklärung oder Teilnahmebedingung veröffentlichen, bevor Betreiberangaben, Hostingdetails und Rechtsprüfung ergänzt sind.

## 1. Aktueller Umfang

DevPath ist derzeit eine Windows-Desktop-Alpha ohne Nutzerkonto. Die App speichert Daten auf dem Gerät in ihrer SQLite-Datenbank. Im Browser-/Entwicklungsmodus gibt es zusätzlich einen lokalen Speicher-Fallback. Gespeichert werden:

- selbst angegebener Anzeigename, Lernziel, Vorerfahrung, gewünschte Lerntage, Uhrzeit und Dauer;
- Lernfortschritt, Übungscode, Fehlversuche, angeforderte Hinweise, Selbsteinschätzung und Wiederholungstermine;
- lokale Projekte mit Dateien sowie gespeicherte Code-Versionen und Notizen;
- Anzeigeeinstellungen und Abschlusszeitpunkt.

Die App hat aktuell keine Anmeldung, Synchronisierung, Community-Veröffentlichung, externe KI-Anbindung und keine Übermittlung von Code, Lernverhalten oder Diagnoseberichten. Der Kurs ist in der Desktop-App enthalten. Die App-Einstellungen müssen deshalb Diagnoseberichte als deaktiviert anzeigen; eine anklickbare Einwilligung für eine nicht vorhandene Übermittlung wäre irreführend.

Die Datenbankdatei wird von DevPath nicht zusätzlich anwendungsspezifisch verschlüsselt. Der Schutz ruhender Daten hängt damit von Windows-Konto- und Geräteverschlüsselung sowie Dateizugriffen ab. Für dieses Gerät wurde in der bisherigen Prüfung bestätigt, dass Laufwerk C: nicht mit BitLocker verschlüsselt war. Das muss als offener Schutzpunkt vor einer Alpha mit echten persönlichen Daten behandelt werden; das Deaktivieren von Konten und Cloudübertragung verhindert keinen lokalen Zugriff auf eine ungeschützte Gerätedatei.

Die Präsentations- und Downloadwebsite ist statisch. Die beobachtete Website-Konfiguration lädt keine Analysebibliotheken, Tracking-Skripte, externen Schriftarten oder Formulare. EdgeOne hostet die Website und Makers-Funktionen. In den vom Betreiber vorgelegten Makers-Protokollen waren Zeit, Anfrage-ID, Domain, Pfad, Quelle, Status, Laufzeit, Speicherverbrauch und Runtime sichtbar. Die aktuelle Makers-Dokumentation sagt, dass Cloud-Function-Protokolle standardmäßig 24 Stunden aufbewahrt werden. Separat dazu sind EdgeOne-Offlinelogs für Websitezugriffe standardmäßig nicht aktiviert; laut EdgeOne-Dokumentation werden sie erst nach manueller Aktivierung gespeichert. Vor Veröffentlichung muss die konkrete Projekteinstellung geprüft werden.

Die öffentliche Kurs-API liest veröffentlichte Kurs- und Versionsmetadaten aus Supabase in `eu-west-1`. Sie erhält keine lokalen App-Projekte oder Lernstände. Die Datenbank enthält DevPath-Katalogdaten; laut letzter Prüfung waren in `accounts` keine Einträge. Für den vom Betreiber bestätigten Supabase-Free-Tarif weist Supabase aktuell eine eintägige Log-Aufbewahrung aus. Das ist die zugängliche Log-Historie, keine vollständige Auskunft über alle internen Sicherheits-/Betriebsdaten des Anbieters. Supabase weist darauf hin, dass begrenzte Betriebsmetadaten/Logs auch außerhalb der gewählten Datenbankregion verarbeitet werden können. Anbieterunterlagen und Projektkonfiguration sind vor Veröffentlichung zu prüfen.

## 2. Datenschutzmaßnahmen für die Alpha

- Keine Konten, Nutzerprofile auf dem Server oder Verhaltensanalyse aktivieren.
- Keine Code-/Lerninhalte oder vollständigen Exporte an den Support senden lassen.
- Vor Tests mit echten persönlichen Inhalten eine unterstützte Geräteverschlüsselung und ein geschütztes Windows-Konto sicherstellen; auf diesem Gerät ist Laufwerk C: laut bisheriger Prüfung unverschlüsselt.
- Support zunächst über einen manuell ausgewählten Kontaktweg abwickeln; Betroffene sollen selbst entscheiden, welche Angaben sie teilen.
- Supportfälle auf Version, Betriebssystem, kurze Fehlerbeschreibung und reproduzierbare Schritte begrenzen. Vor dem Teilen Code, Namen, lokale Pfade, Tokens, Passwörter und andere personenbezogene Inhalte entfernen.
- Anhänge nur bei konkretem Bedarf erfragen. Projektdateien und DevPath-Datenexporte können privaten Quelltext und Lerninformationen enthalten.
- Zugriff auf eingehende Supportanfragen auf die zuständige Person begrenzen. Lösch- und Aufbewahrungsfrist vor dem Start festlegen und in der Information nennen.
- Für Datenschutzanfragen und Sicherheitsmeldungen einen erreichbaren Kontakt und eine Vertretung festlegen.

## 3. Supportablauf für die private Alpha

1. Person meldet ein Problem über den vom Betreiber veröffentlichten Supportkontakt.
2. Support bestätigt den Eingang und vergibt intern eine Fallnummer; keine automatischen Diagnoseuploads.
3. Zuerst werden DevPath-Version, Windows-Version, erwartetes und tatsächliches Verhalten sowie kurze Reproduktionsschritte erfragt.
4. Falls ein Datenexport zur Wiederherstellung benötigt wird, wird ausdrücklich darauf hingewiesen, dass er Profil, Lernstand, Projekte und Quellcode enthält. Der Export wird nur über einen vorher freigegebenen, zugriffsbeschränkten Weg angefordert und nach Abschluss entsprechend der festgelegten Frist gelöscht.
5. Bei Datenschutz- oder Sicherheitsvorfällen wird der Fall unverzüglich an den benannten Verantwortlichen eskaliert. Entscheidungen zu gesetzlichen Meldepflichten trifft der Verantwortliche mit qualifizierter Beratung.

Es gibt aktuell keinen im Projekt hinterlegten öffentlichen Supportkontakt, keine Support-Mailbox und keine automatische Ticketübermittlung. Daher darf die Website noch keinen erfundenen oder nicht überwachten Kontakt anzeigen.

## 4. Bausteine für die spätere Datenschutzerklärung

Vor Veröffentlichung müssen mindestens Betreiberidentität und erreichbare elektronische Kontaktmöglichkeit, Zwecke und Rechtsgrundlagen je Verarbeitung, Empfänger/Auftragsverarbeiter, Hostingstandorte und internationale Übermittlungen, Speicherfristen, Betroffenenrechte und Beschwerdemöglichkeit sowie gegebenenfalls Datenschutzbeauftragte und Profiling-Angaben passend zum tatsächlichen Betrieb geklärt werden. Die konkrete Anwendbarkeit ist mit qualifizierter Datenschutz-/Rechtsberatung zu prüfen.

Die Website enthält inzwischen eine kurze Produktinformation zur Windows-Alpha. Diese ist ausdrücklich keine vollständige Datenschutzerklärung und ersetzt die obigen Angaben nicht.

## 5. Vor öffentlicher oder privater Alpha-Einladung zu ergänzen

- [ ] Betreiber: natürliche Person oder Organisation, offizieller Name und ladungsfähige Anschrift (intern sicher erfassen; nicht in dieses öffentliche Repository schreiben).
- [ ] Öffentliche Supportadresse und separater Sicherheits-/Datenschutzkontakt; Postfächer testen und Zuständigkeit/Vertretung bestimmen.
- [ ] Zielmärkte und Altersgruppe einschließlich Umgang mit Minderjährigen festlegen und fachlich prüfen.
- [ ] In Makers prüfen, ob Website-Offlinelogs oder externe Logweiterleitungen manuell aktiviert wurden; Cloud-Function-Protokolle sind laut Dokumentation standardmäßig 24 Stunden sichtbar.
- [ ] Supabase-Free-Logaufbewahrung (aktuell 1 Tag) und Hinweise zu anbieterinternen Betriebs-/Sicherheitslogs in der eigenen Projekt-/Vertragskonfiguration abgleichen.
- [ ] Aktuelle EdgeOne/Makers- und Supabase-Unterlagen prüfen: verarbeitete Protokollfelder, Speicherorte, Unterauftragsverarbeiter, Vertrag/Auftragsverarbeitung und internationale Übermittlungen.
- [ ] Zwecke/Rechtsgrundlagen und konkrete Löschfristen für Websiteprotokolle, Datenbankprotokolle und Supportfälle festlegen.
- [ ] Vollständige Datenschutzerklärung, Anbieterkennzeichnung soweit anwendbar, Supportseite und Teilnahme-/Feedbackhinweise durch qualifizierte Personen prüfen lassen.
- [ ] Supportkontakt von einer zweiten Person aus testen; Lösch- und Datenschutzanfragen praktisch durchspielen.

Keine privaten Wohnanschriften, Zugangsdaten, CA-Zertifikate oder Passwörter in GitHub, Issues oder öffentliche Supportanfragen eintragen.

## 6. Externe Referenzen für die Prüfung

- [Datenschutz-Grundverordnung, insbesondere Artikel 13](https://eur-lex.europa.eu/eli/reg/2016/679)
- [§ 5 Digitale-Dienste-Gesetz (DDG)](https://www.gesetze-im-internet.de/ddg/__5.html)
- [EdgeOne Makers: Log Analysis und Aufbewahrung von Cloud-Function-Protokollen](https://pages.edgeone.ai/document/log-analysis)
- [EdgeOne: Offline Logs (standardmäßig nicht gespeichert; Aktivierung erforderlich)](https://edgeone.ai/document/46981)
- [Supabase: Planvergleich mit Log-Aufbewahrung](https://supabase.com/pricing)
- [Supabase: Datenstandort und Übermittlungen](https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq)

Diese Links sind Prüfreferenzen, keine Feststellung, welche Pflichten im Einzelfall greifen.
