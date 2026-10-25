# CodeZone – Navigations-Wireframes und Design-Tokens

**Status:** Arbeitsgrundlage für Phase 1  
**Version:** 0.1  
**Stand:** 21. Oktober 2026  
**Geltungsbereich:** Desktop-App für Windows, macOS und Linux; Website nur für Konto, Download und Information  
**Bezug:** [DEVPATH_FOUNDATION.md](DEVPATH_FOUNDATION.md), [DEVPATH_THREAT_MODEL.md](DEVPATH_THREAT_MODEL.md)

## 1. Gestaltungsziel

CodeZone soll freundlich, klar und modern wirken, ohne wie ein Kinderspiel oder eine Entwicklerkonsole auszusehen. Die visuelle Richtung ist expressiv, mit großzügigen Flächen, sanften Formen und gezielten Akzentfarben. Sie wird als eigenständige CodeZone-Designsprache umgesetzt und an Desktop-Konventionen angepasst. „Android 17 Material Expressive 3“ ist eine Stilreferenz; dieses Dokument behauptet keine offizielle Designsystem-Konformität.

**Prioritäten in Reihenfolge:** verständliche Orientierung, Lesbarkeit, zugängliche Bedienung, ruhige Lernumgebung, visuelle Eigenständigkeit.

## 2. Informationsarchitektur

### Hauptnavigation

| Reihenfolge | Bereich | Zweck | Verfügbarkeit |
|---:|---|---|---|
| 1 | **Heute** | Nächste Lerneinheit, Tagesfortschritt und Planänderung | Phase 1 |
| 2 | **Lernen** | Persönlicher Lernpfad und Kursbibliothek | Phase 1, anfangs mit Pilotinhalt |
| 3 | **Code Studio** | Aufgaben und lokale Projekte bearbeiten | zunächst als Grundgerüst; später ausbauen |
| 4 | **Code Base** | Lokale Projekte und Versionen verwalten | späterer Funktionsausbau |
| 5 | **Community** | Veröffentlichen und Projekte entdecken | deaktiviert bis Moderation und Datenschutz bereit sind |

### Sekundäre Navigation

- **Suche** in Kursen und lokal vorhandenen Projekten; Suchumfang wird sichtbar benannt.
- **Einstellungen**: Konto, Datenschutz, KI, Darstellung, Bedienungshilfen, Benachrichtigungen und Updates.
- **Hilfe**: kontextbezogene Hilfe, Tastaturkürzel und Support.
- **Profilmenü**: lokales Profil, optionaler Kontostatus, Datenexport und Abmeldung.

### Navigationsregeln

1. Die Hauptbereiche bleiben in einer stabilen Seitenleiste sichtbar; auf schmaleren Fenstern wird sie einklappbar.
2. Eine Ansicht hat genau einen primären Seitentitel und höchstens eine visuell dominante Hauptaktion.
3. Unterbereiche erscheinen als Tabs oder sekundäre Navigation innerhalb des Bereichs, nicht als zusätzliche globale Ebene.
4. Der Zurück-Befehl führt innerhalb des aktuellen Bereichs zum vorherigen Kontext; er verliert keine Eingaben ohne Rückfrage.
5. In Code Studio bleiben Projektname, Speicherstatus und aktive Aufgabe jederzeit erkennbar.
6. Onlinefunktionen tragen einen klaren Status (offline, verbunden, wird synchronisiert); private Inhalte werden nicht durch ein unbestimmtes Cloudsymbol angedeutet.
7. Noch nicht verfügbare Funktionen werden ausgeblendet oder als „später verfügbar“ erklärt; sie erscheinen nicht als funktionsfähige, aber tote Navigation.
8. Tastaturfokus und Screenreader-Reihenfolge folgen derselben logischen Reihenfolge wie die visuelle Oberfläche.

## 3. Globale App-Hülle

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Fenstertitel / App-Menü]                         [Hilfe] [Profil/Einstellungen] │
├────────────────────┬────────────────────────────────────────────────────────┤
│ CodeZone            │ Bereichstitel                           Status/Sync     │
│                    ├────────────────────────────────────────────────────────┤
│ ◉ Heute            │                                                        │
│ ◌ Lernen           │                 Inhaltsfläche                         │
│ ◌ Code Studio      │                                                        │
│ ◌ Code Base        │                                                        │
│ ◌ Community*       │                                                        │
│                    │                                                        │
│ ───────────────    │                                                        │
│ ⚙ Einstellungen   │                                                        │
│ ? Hilfe            │                                                        │
└────────────────────┴────────────────────────────────────────────────────────┘
* Nur sichtbar, wenn Community freigeschaltet ist.
```

- Standardfenster: Inhaltsbreite für angenehmes Lesen begrenzen; keine Vollbildpflicht.
- Seitenleiste: auf breiten Fenstern mit Icon und Text; einklappbar, aber nie nur Icon ohne zugänglichen Namen.
- Fenstergröße, Split-Ansichten und zuletzt geöffneter Bereich werden lokal gespeichert.
- Systemrahmen und Fenstermenü respektieren Windows, macOS und Linux; CodeZone-Komponenten bleiben plattformübergreifend konsistent.

## 4. Textuelle Wireframes

### 4.1 Ersteinrichtung

```text
┌───────────────────────────────────────────┐
│ CodeZone                              1/4   │
│                                           │
│ Was möchtest du lernen?                   │
│ [ Webentwicklung                    ▾ ]   │
│                                           │
│ Wie vertraut bist du mit Programmieren?   │
│ ( ) Ich starte ganz neu                   │
│ ( ) Ich kenne erste Grundlagen            │
│ ( ) Ich programmiere bereits              │
│                                           │
│ [Überspringen]                 [Weiter →] │
│ Deine Antworten bleiben standardmäßig     │
│ auf diesem Gerät.                         │
└───────────────────────────────────────────┘
```

**Anforderungen:** maximal eine Frage pro Schritt; Fortschritt sichtbar; jede Frage überspringbar, wenn kein Pflichtgrund besteht; keine Alterserfassung als Voraussetzung; kurze Erklärung des Speicherorts; keine Einwilligung in optionale KI, Diagnose oder Synchronisierung in der Startabfrage verstecken.

### 4.2 Heute – Startansicht

```text
Heute                                      [Plan anpassen]
Guten Morgen, Alex                         Offline / Verbunden

┌───────────────────────────────┐  ┌───────────────────────────┐
│ Dein nächster Schritt         │  │ Dein Lernrhythmus         │
│ JavaScript · Bedingungen      │  │ 2 von 3 geplanten Einheiten│
│ ca. 20 Minuten                │  │ [Woche ansehen]            │
│ [Lektion starten →]           │  │                            │
└───────────────────────────────┘  └───────────────────────────┘

Weiterlernen
[HTML Grundlagen] [CSS Layout] [Zum Lernpfad →]

Letztes Mal: Variablen · Übung abgeschlossen
```

**Regeln:** keine beschämenden Streak-Verluste; Dauer ist Schätzung; Lernplanänderung direkt erreichbar; „heute nichts geplant“ ist ein gültiger Zustand mit freiwilliger Option.

### 4.3 Lernen – Lernpfad

```text
Lernen                       [Kurse durchsuchen] [Ziel / Zeit bearbeiten]

Dein Lernziel: Erste eigene Website bauen
Vorgeschlagene Zeit: 3 Einheiten pro Woche · je etwa 20 Minuten
Warum dieser Schritt? Du hast die Grundlagen sicher angewendet.

HTML ──● Grundlagen abgeschlossen
       └──● Semantische Elemente · Nächster Schritt [Starten]
CSS  ───○ Layout und responsive Gestaltung
Webentwicklung ──○ Erstes Portfolio-Projekt

[Lernplan bearbeiten] [Vorschlag erklären]
```

Der Lernpfad zeigt Voraussetzungen, Abschlussstatus und nächste Schritte. Fortschritt darf nicht ausschließlich über Prozentanzeigen dargestellt werden; Lernziele und konkrete Fähigkeiten bleiben benannt.

### 4.4 Kursbibliothek

```text
Kurse                                         [Suche …]
[Alle] [Sprachen] [Themen] [Mein Lernpfad]

Programmiersprachen
[HTML] [CSS] [JavaScript] [Java] [Python] [PHP] …

Themenkurse
[Webentwicklung] [Backend] [IT-Sicherheit] [KI]
[Spieleentwicklung] [Auf dem Weg zum Job]

Kurskarte zeigt: Niveau, Voraussetzungen, Lernziele,
geschätzter Umfang und ob Inhalt offline verfügbar ist.
```

Filter sind kombinierbar und zurücksetzbar. Niveau wird als „Einstieg“, „Aufbau“ oder „Vertiefung“ plus Voraussetzungen erklärt, nicht nur über Farbe oder abstrakte Stufen.

### 4.5 Lektion und Übung

```text
← Lernpfad          JavaScript · Bedingungen        Speichern ✓

Lernziel
Du kannst eine Bedingung verwenden, um zwischen zwei Fällen zu wählen.

Kurze Erklärung                           [Vorlesen]
┌─────────────────────────────────────────────────────────┐
│ if (temperatur > 20) {                                   │
│   console.log("Warm");                                   │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Jetzt ausprobieren
┌──────────────────────────────┐  ┌───────────────────────┐
│ Editor / Aufgabe              │  │ Ausgabe / Rückmeldung │
└──────────────────────────────┘  └───────────────────────┘
[Hinweis] [Code ausführen]                  [Weiter →]
```

Die Übung trennt Erklärung, Eingabe und Ergebnis. Hinweise sind abgestuft (Begriff → Frage → Teilschritt → Lösungserklärung). Codeänderungen durch KI benötigen eine Vorschau und Bestätigung.

### 4.6 Code Studio

```text
Code Studio   Projekt: Wetter-App ▾   Gespeichert lokal   [Ausführen]
┌───────────────┬───────────────────────────────┬──────────────────┐
│ Dateien       │ Editor                        │ Hilfe / Ausgabe  │
│ src/          │                               │                  │
│  main.js      │  function ...                 │ [Aufgabe]        │
│ README        │                               │ [Ausgabe]        │
│               │                               │ [Tutor fragen]   │
└───────────────┴───────────────────────────────┴──────────────────┘
Tutor: „Was erwartest du, wenn die Temperatur genau 20 ist?“
[Hinweisstufe wählen] [Ausschnitt für KI auswählen]
```

- Projektbaum, Editor und Ergebnisbereich sind unabhängig größenveränderbar.
- Tutorbereich ist einklappbar; Editor bleibt primärer Arbeitsbereich.
- Ausführen ist kontextgebunden und zeigt die aktive Sandbox-/Netzwerkregel.
- KI fragt nicht ungefragt das ganze Projekt ab; Auswahlumfang und Ziel werden vor externer Anfrage angezeigt.
- Zustände wie ungespeicherte Änderung, lokaler Speicher, Sync-Konflikt und Ausführungsfehler sind textlich markiert.

### 4.7 Einstellungen – Datenschutz und KI

```text
Einstellungen
[Darstellung] [Bedienungshilfen] [Datenschutz] [KI] [Konto] [Updates]

KI-Unterstützung
Verarbeitung: (•) Nur lokal, wenn verfügbar  ( ) Externer Anbieter
Vor jeder externen Anfrage Inhalt und Empfänger zeigen: [Ein]
Automatisch Projektdateien einbeziehen: [Aus – empfohlen]

Diagnosedaten
Fehlerberichte senden: [Aus]
[Gespeicherte lokale Daten anzeigen] [Daten exportieren]
```

Optionen verwenden klare Beschriftungen und erklären Auswirkungen direkt. „Ein/Aus“ ist sichtbar; es gibt keine vorgewählten Einwilligungen für optionale Übermittlungen.

### 4.8 Online-/Fehlerzustand

```text
Du bist offline.
Deine lokalen Projekte und heruntergeladenen Lektionen sind verfügbar.
Konto- und Communityfunktionen können gerade nicht geladen werden.
[Erneut versuchen] [Offline weiterlernen]
```

Fehlerzustände erklären Auswirkungen und nächste Schritte. Keine rohen Stacktraces, technischen Codes oder Schuldzuweisungen an Lernende.

## 5. Responsive Verhalten für Desktop

| Fensterbreite | Verhalten |
|---:|---|
| ≥ 1280 px | Vollständige Seitenleiste; Drei-Spalten-Ansichten möglich, wenn Inhalt davon profitiert. |
| 900–1279 px | Seitenleiste kompakt/einklappbar; in Code Studio Editor plus ein Nebenpanel. |
| 640–899 px | Seitenleiste als Overlay oder schmale Navigation; Inhalte einspaltig; Code Studio Panels als Tabs. |
| < 640 px | Unterstützter Minimalmodus für Login/Settings/Lesen; Coding weist auf größere Fensterempfehlung hin, funktioniert aber ohne abgeschnittene Kernaktionen. |

Breakpoints sind Startwerte und werden mit echten Plattformfenstern und Textskalierung geprüft. Keine Ansicht darf bei 200 % Textskalierung wesentliche Aktionen verlieren.

## 6. Design-Tokens

Die Tokens sind semantisch benannt. Komponenten verwenden `color.surface` statt fest codierter Hexwerte; Themes können dadurch konsistent geändert werden. Farbwerte sind Startwerte und müssen mit Kontrastmessung sowie Plattformdarstellung validiert werden.

### 6.1 Farbe – helles Theme

| Token | Startwert | Einsatz |
|---|---|---|
| `color.canvas` | `#F7F7FB` | App-Hintergrund |
| `color.surface` | `#FFFFFF` | Karten und Panels |
| `color.surface.subtle` | `#F0EFF7` | Sekundärflächen |
| `color.surface.raised` | `#FFFFFF` | Dialoge und schwebende Flächen |
| `color.text.primary` | `#1B1B22` | Haupttext |
| `color.text.secondary` | `#555563` | Hilfs- und Sekundärtext |
| `color.text.disabled` | `#70707A` | Deaktivierter Text; Kontrast separat prüfen |
| `color.border` | `#777783` | Eingabefelder und Trennlinien |
| `color.brand` | `#5146A5` | Primäraktionen und aktive Navigation |
| `color.brand.on` | `#FFFFFF` | Text auf Markenfarbe |
| `color.accent` | `#006B67` | Lernfortschritt und unterstützende Akzente |
| `color.accent.on` | `#FFFFFF` | Text auf Akzentfläche |
| `color.success` | `#176B3A` | Erfolg |
| `color.warning` | `#805500` | Warnungen |
| `color.danger` | `#B3261E` | Fehler und destruktive Aktionen |
| `color.focus` | `#005FCC` | Tastaturfokus; mit mindestens 2 px sichtbarer Kontur |
| `color.code.background` | `#F2F3F8` | Codefläche |
| `color.code.text` | `#20212A` | Codegrundtext |

Statusfarben erhalten zusätzlich Icon und Textlabel. Textkontrast wird mindestens nach WCAG 2.2 AA angestrebt: 4.5:1 für normalen Text, 3:1 für großen Text und wesentliche UI-Grafiken. Tokenwerte sind vor Übernahme rechnerisch zu validieren; Tabellenwerte allein sind kein Konformitätsnachweis.

### 6.2 Dunkles Theme – semantische Startwerte

| Token | Startwert |
|---|---|
| `color.canvas` | `#121218` |
| `color.surface` | `#1B1B23` |
| `color.surface.subtle` | `#252530` |
| `color.text.primary` | `#F1F0F7` |
| `color.text.secondary` | `#C3C2CF` |
| `color.border` | `#777783` |
| `color.brand` | `#C7C0FF` |
| `color.brand.on` | `#29205E` |
| `color.accent` | `#78D6CB` |
| `color.accent.on` | `#003733` |
| `color.success` | `#8BDC9E` |
| `color.warning` | `#F1C66D` |
| `color.danger` | `#FFB4AB` |
| `color.focus` | `#9CCAFF` |
| `color.code.background` | `#171820` |
| `color.code.text` | `#F1F0F7` |

Hell/Dunkel/Automatisch folgt Systemeinstellung. Syntaxfarben kommen aus einer separaten, kontrastgeprüften Codepalette und dürfen Statusfarben der Anwendung nicht imitieren.

### 6.3 Typografie

| Token | Startwert | Verwendung |
|---|---:|---|
| `type.family.ui` | Systemschrift | UI, gewählte Plattformschrift mit robustem Fallback |
| `type.family.code` | System-Monospace | Editor und Codebeispiele |
| `type.size.caption` | 12 px / 0.75 rem | ergänzende Metadaten, nie alleinige Anweisung |
| `type.size.body.small` | 14 px / 0.875 rem | kompakte Sekundärtexte |
| `type.size.body` | 16 px / 1 rem | Standardtext |
| `type.size.body.large` | 18 px / 1.125 rem | wichtige Erklärungen |
| `type.size.title` | 24 px / 1.5 rem | Seitentitel |
| `type.size.display` | 32 px / 2 rem | Start-/Onboarding-Überschrift |
| `type.size.code` | 14 px / 0.875 rem | Code; Nutzer kann skalieren |
| `type.line-height.body` | 1.5 | längere Lesetexte |
| `type.line-height.heading` | 1.2 | Überschriften |

Die UI skaliert bis mindestens 200 %, ohne horizontalen Zwangs-Scroll in Standardansichten. Code kann separat skaliert werden. Schriftgrößenwerte sind logische UI-Pixel; plattformspezifisches DPI-Scaling wird berücksichtigt.

### 6.4 Abstände und Geometrie

| Token | Wert |
|---|---:|
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.6` | 24 px |
| `space.8` | 32 px |
| `space.12` | 48 px |
| `size.sidebar.expanded` | 248 px |
| `size.sidebar.collapsed` | 72 px |
| `size.content.max` | 1200 px |
| `size.control.min-height` | 44 px |
| `radius.control` | 12 px |
| `radius.card` | 20 px |
| `radius.dialog` | 28 px |
| `radius.pill` | 999 px |
| `border.width.default` | 1 px |
| `border.width.focus` | 2 px |

44 × 44 px ist das CodeZone-Ziel für häufige interaktive Ziele; plattformtypische kleinere Controls müssen ausreichend große Hit-Areas erhalten. Rundungen dienen Gruppierung und Hierarchie, nicht dekorativer Überladung.

### 6.5 Bewegung und Tiefe

| Token | Startwert | Regel |
|---|---:|---|
| `motion.quick` | 100 ms | kleine Zustandswechsel |
| `motion.standard` | 180 ms | Panels und Navigation |
| `motion.emphasis` | 260 ms | seltene, wichtige Bestätigung |
| `elevation.card` | 0–1 dp äquivalent | Flächen primär über Farbe/Abstand trennen |
| `elevation.dialog` | 2–4 dp äquivalent | Dialog über Inhalt legen |

Bewegung ist optional und folgt `prefers-reduced-motion` bzw. dem Betriebssystem. Keine Information wird nur durch Bewegung vermittelt. Die zehnsekündige Abschlussanimation ist überspringbar und hat eine Einstellung zum vollständigen Deaktivieren.

## 7. Komponenten und Interaktionsregeln

### Schaltflächen

- Varianten: primär, sekundär, Text, destruktiv.
- Beschriftung nennt Handlung („Lektion starten“ statt „Weiter“ wenn Kontext fehlt).
- Destruktive Aktionen erhalten Bestätigung mit konkreter Auswirkung und Rückgängigoption, wenn möglich.
- Ladezustand blockiert keine Navigation ohne Grund und gibt Status für Screenreader aus.

### Karten und Lernfortschritt

- Karten sind nur dann vollständig klickbar, wenn ihr gesamter Inhalt dieselbe Aktion ausführt.
- Fortschritt verwendet Text und Icon, ergänzend eine visuelle Darstellung.
- Kein Fortschrittsring oder Score ist alleinige Erklärung, was noch zu lernen ist.
- Lernstreaks sind optional; keine Verlustdrohung, kein rotes Warnsignal bei Pause.

### Formulare und Dialoge

- Jedes Feld hat sichtbare Beschriftung und Fehlertext direkt am Feld.
- Auswahloptionen erklären Konsequenzen; Standardwahl bei optionaler Datenübermittlung ist aus.
- Dialoge sind per Tastatur vollständig bedienbar; Escape schließt nur, wenn keine wichtige ungespeicherte Aktion verloren geht.
- Datenschutz- und KI-Vorschau zeigen Datenarten und Empfänger in normaler Sprache.

### Editor

- Editor verwendet eine kontrastgeprüfte Codepalette, sichtbare Fokusmarkierung und skalierbare Schrift.
- Fehler sind sowohl im Codebereich als auch in einer lesbaren Problemliste auffindbar.
- Vorschläge der KI werden visuell vom bestehenden Code getrennt; Anwenden, teilweise Anwenden und Ablehnen sind möglich.
- Sandboxstatus, Laufzeitlimits und Netzwerkzugriff sind in der Ausführungsansicht auffindbar.

## 8. Barrierefreiheit und Mehrsprachigkeit

- Tastaturbedienung für jede Funktion; definierte Fokusreihenfolge und keine Tastaturfallen.
- Screenreader-Namen, Rollen, Zustände und dynamische Rückmeldungen für Kernkomponenten.
- Kontrastziele nach WCAG 2.2 AA für Text und wesentliche UI-Elemente.
- Keine Information allein durch Farbe, Position, Ton oder Bewegung.
- Textvergrößerung bis 200 % und Systemkontrastmodi berücksichtigen.
- Alternativen für Audio/Animation; Abschlussanimation optional und überspringbar.
- Klare Sprache und kurze Sätze; Glossar für technische Fachbegriffe.
- Übersetzbare Strings ohne in UI eingebetteten Text; Layout verträgt längere Übersetzungen.
- Datums-, Zeit- und Zahlenformate folgen Locale, die Zeitzone wird sichtbar behandelt.

## 9. Website-Gestaltungsrahmen

Die Website ist kein Ersatz für die Desktop-Lernoberfläche. Hauptnavigation: Produkt, Download, Systemanforderungen, Datenschutz, Hilfe und Konto. Downloadseiten zeigen Plattform, Mindestanforderung, Version, Veröffentlichungsdatum und Herausgeber. Anmeldung und Download sind auch bei aktivierten Skriptblockern verständlich nutzbar; nicht notwendige Trackingelemente sind nicht Voraussetzung.

## 10. Akzeptanzkriterien für die spätere visuelle Umsetzung

1. Nutzer finden in höchstens einem Navigationsschritt Heute, Lernen, Code Studio und Einstellungen.
2. Bei Fensterbreite 900 px bleiben Seitentitel, Hauptaktion und Zurücknavigation sichtbar.
3. Kernabläufe funktionieren per Tastatur einschließlich Editorhilfe, Plananpassung und Datenschutzwahl.
4. Status und Fehler sind immer mit Text und nicht nur Farbe signalisiert.
5. Textkontrast und Fokuskontrast werden automatisiert und visuell geprüft; gemessene Ergebnisse werden dokumentiert.
6. 200-%-Textskalierung lässt Kernaufgaben ohne verlorene Aktionen zu.
7. Community ist in der Erstversion verborgen, solange Moderation und Datenschutz nicht freigegeben sind.
8. KI- oder Synchronisierungsübermittlung ist in den Ansichten nicht vorausgewählt und zeigt den Datenumfang.
9. Die Oberfläche respektiert Betriebssystem-Einstellungen für hell/dunkel, reduzierte Bewegung und Textskalierung.
10. Für jeden Wireframe existieren Zustände: normal, leer, offline, lädt, Fehler und Berechtigung verweigert.

## 11. Offene Designentscheidungen

| Entscheidung | Vorläufiger Vorschlag | Klärung vor Umsetzung |
|---|---|---|
| Produktname und Wort-/Bildmarke | CodeZone als Arbeitsname | Marken-/Namensrecherche und Domainverfügbarkeit |
| Farbidentität | Indigo als Primärfarbe, Türkis als Lernakzent | Nutzertests, Kontrastmessung und Markenprüfung |
| Seitenleistenverhalten | Dauerhaft sichtbar, einklappbar | Tests auf Windows/macOS/Linux und schmalen Fenstern |
| Standard-Theme | Systemeinstellung folgen | Nutzertests und OS-Integrationsfähigkeit |
| Community-Navigation | Bis Freigabe ausgeblendet | Moderation, Altersregeln und Datenschutzkonzept |
| Sprachumfang | Deutsch zuerst, Strings von Beginn an lokalisierbar | Zielsprachen und Supportkapazität |
| Diplomdarstellung | Ruhige, teilbare digitale Urkunde | Kriterien, Verifikation und Datenschutz bei öffentlichem Teilen |

## 12. Änderungsprozess

Änderungen an Navigation, Tokens oder Interaktionsregeln werden mit Datum, Grund, betroffenen Ansichten und Barrierefreiheitsauswirkung festgehalten. Farben, Schriftgrößen und Komponentenwerte ändern sich über semantische Tokens, nicht durch verstreute Einzelwerte. Nach Auswahl des Desktop-Frameworks werden die Wireframes in klickbare Prototypen überführt und mit Lernenden unterschiedlicher Erfahrung und Altersgruppen geprüft.
