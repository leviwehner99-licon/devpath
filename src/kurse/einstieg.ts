import type { CourseLesson } from "./course";

type Intro = Pick<CourseLesson, "id" | "title" | "objective" | "explanation" | "visualSteps" | "examples" | "knowledgeCheck"> & Pick<CourseLesson, "languageGuide">;
function step(item: Intro): CourseLesson {
  return { ...item, module: "01 · Software verstehen", duration: 9, language: "plaintext", concepts: [], starterCode: "", task: item.knowledgeCheck!.question, successPattern: /(?:)/, practice: false };
}
function workshop(item: Pick<CourseLesson, "id" | "title" | "objective" | "explanation" | "visualSteps" | "examples" | "task" | "starterCode" | "acceptanceCriteria">): CourseLesson {
  return { ...item, module: "02 · Anwenden", duration: 18, language: "plaintext", concepts: [], successPattern: /(?:)/, practice: true };
}

export const einstiegLektionen: CourseLesson[] = [
  step({
    id: "program-output", title: "Was Programmierung wirklich ist", objective: "Du unterscheidest ein Problem, die Lösungsregel und das laufende Programm.",
    explanation: "Programmieren heißt, ein Problem so genau zu beschreiben, dass ein Computer die Lösung zuverlässig ausführen kann. Dazu gehören Daten, Regeln, Tests und spätere Verbesserungen. Der Quellcode ist die schriftliche Form dieser Regeln; ein Programm ist ihre laufende Ausführung.",
    visualSteps: ["Problem: Kurse schwer auffindbar", "Regel: Suchwort mit Titeln vergleichen", "Prüfung: Treffer und Leerfall testen"],
    examples: [{ title: "Ein Kursfinder", code: "Nutzerwunsch → Suchregel → angezeigte Kurse\nTest 1: 'Web' zeigt Webentwicklung\nTest 2: 'xyz' zeigt einen Leerzustand", note: "Die Lösung ist erst brauchbar, wenn auch der Fall ohne Treffer verständlich behandelt wird.", language: "plaintext" }],
    knowledgeCheck: { question: "Was gehört zu einer programmierten Lösung?", options: ["Eine klare Regel und Tests für erwartete Ergebnisse", "Nur möglichst viel Quellcode", "Nur das Aussehen einer Oberfläche"], correctIndex: 0, explanation: "Code beschreibt die Regel; Tests prüfen, ob sie das Problem wirklich löst." },
  }),
  step({
    id: "program-why", title: "Welches Problem soll Software lösen?", objective: "Du formulierst einen überprüfbaren Nutzen statt einer bloßen Funktionsliste.",
    explanation: "Software ist sinnvoll, wenn sie Menschen eine Aufgabe erleichtert oder einen verlässlichen Ablauf ermöglicht. Beginne mit einer konkreten Person, ihrer Aufgabe und einem sichtbaren Ergebnis. Erst danach entscheidest du, welche Funktionen nötig sind.",
    visualSteps: ["Person: Lernende sucht einen Kurs", "Aufgabe: passende Themen finden", "Erfolg: relevante Kurse sichtbar"],
    examples: [{ title: "Kleiner Projektauftrag", code: "Für: Lernende mit wenig Zeit\nProblem: lange Kursliste\nErste Lösung: Suche nach Titel\nMessbar: 'Spiel' findet Spieleentwicklung", note: "Eine erste Version darf klein sein, wenn sich ihr Nutzen überprüfen lässt.", language: "plaintext" }],
    knowledgeCheck: { question: "Welche Beschreibung hilft beim Projektstart?", options: ["Wer braucht welches überprüfbare Ergebnis?", "Welche möglichst große Liste an Funktionen fällt uns ein?", "Welche Programmiersprache klingt am modernsten?"], correctIndex: 0, explanation: "Das Ergebnis für eine Person bestimmt die benötigten Funktionen." },
  }),
  step({
    id: "program-input-result", title: "Daten, Verarbeitung, Ergebnis", objective: "Du beschreibst den Weg einer Eingabe durch ein Programm.",
    explanation: "Eine Eingabe ist ein Wert, den das Programm erhält. Die Verarbeitung wendet eine festgelegte Regel darauf an. Das Ergebnis ist der Wert oder die sichtbare Änderung danach. Die gleiche Eingabe soll bei derselben Regel nachvollziehbar behandelt werden.",
    visualSteps: ["Eingabe: Suchwort 'Web'", "Verarbeitung: Titel vergleichen", "Ergebnis: Webkurse anzeigen"],
    examples: [{ title: "Datenfluss einer Suche", code: "Suchwort + Kursliste → Vergleich → Trefferliste\n'Web' + ['Web', 'Spiele'] → Vergleich → ['Web']", note: "Die Liste ist bereits vorhanden; die Suchregel wählt daraus passende Einträge.", language: "plaintext" }],
    knowledgeCheck: { question: "Was ist bei der Kurssuche das Ergebnis?", options: ["Die Liste der passenden Kurse", "Das eingetippte Suchwort", "Die Regel zum Vergleichen"], correctIndex: 0, explanation: "Das Suchwort ist Eingabe; die Trefferliste ist Ergebnis." },
  }),
  step({
    id: "program-order", title: "Abläufe und Zustände", objective: "Du ordnest Verarbeitungsschritte so, dass jeder Schritt seine benötigten Daten erhält.",
    explanation: "Ein Ablauf beschreibt, was nacheinander passiert. Ein Zustand ist der aktuelle Wert, etwa das gerade eingegebene Suchwort. Eine Suchansicht liest zuerst diesen Wert, wählt dann passende Kurse und zeigt erst danach das Ergebnis. Wenn sich die Eingabe ändert, wird der Ablauf erneut ausgeführt.",
    visualSteps: ["1 · Suchwort lesen", "2 · Kurse filtern", "3 · Treffer oder Leerzustand zeigen"],
    examples: [{ title: "Warum die Reihenfolge zählt", code: "Falsch: Treffer anzeigen → erst danach Suchwort lesen\nRichtig: Suchwort lesen → Treffer berechnen → anzeigen", note: "Die Anzeige braucht ein berechnetes Ergebnis; es entsteht erst nach dem Vergleich.", language: "plaintext" }],
    knowledgeCheck: { question: "Was muss vor der Anzeige einer Trefferliste passieren?", options: ["Das aktuelle Suchwort lesen und die Kurse vergleichen", "Die Trefferliste ohne Daten anzeigen", "Das Suchwort nach der Anzeige erfassen"], correctIndex: 0, explanation: "Die Ansicht kann nur anzeigen, was vorher berechnet wurde." },
  }),
  step({
    id: "program-decisions", title: "Entscheidungen und Randfälle", objective: "Du planst sowohl den Normalfall als auch einen Fall ohne Ergebnis.",
    explanation: "Eine Bedingung ist eine Frage mit den Antworten ja oder nein. Bei einer Suche entscheidet sie, ob ein Kurstitel zum Suchwort passt. Ein Randfall ist eine Eingabe am Rand des erwarteten Ablaufs, etwa ein leeres Suchwort oder keine Treffer. Gute Programme behandeln diese Fälle bewusst.",
    visualSteps: ["Passt der Titel? → Ja: anzeigen", "Passt er nicht? → auslassen", "Keine Treffer? → Hinweis zeigen"],
    examples: [{ title: "Zwei sichtbare Fälle", code: "'Web' → Webentwicklung anzeigen\n'xyz' → 'Keine Kurse gefunden' anzeigen", note: "Auch ein leerer Trefferbestand braucht eine verständliche Rückmeldung.", language: "plaintext" }],
    knowledgeCheck: { question: "Die Suche findet nichts. Was sollte die Oberfläche zeigen?", options: ["Einen klaren Hinweis und einen Weg zur neuen Suche", "Eine völlig leere Seite", "Einen zufälligen Kurs als Treffer"], correctIndex: 0, explanation: "Ein Hinweis erklärt das Ergebnis und erlaubt den nächsten Schritt." },
  }),
  step({
    id: "program-repeat", title: "Wiederholung und Zerlegung", objective: "Du erkennst, welche Regel für jedes Element einer Liste wiederholt wird.",
    explanation: "Eine Schleife führt denselben Schritt für mehrere Werte aus. Für jeden Kurs wird geprüft, ob sein Titel zum Suchwort passt. Eine Funktion bündelt die wiederverwendbare Suchregel unter einem Namen. So bleibt der Ablauf auch bei vielen Kursen lesbar.",
    visualSteps: ["Kurs 1 → Titel prüfen", "Kurs 2 → dieselbe Regel", "Kurs 3 → dieselbe Regel"],
    examples: [{ title: "Einmal definieren, mehrfach anwenden", code: "Für jeden Kurs in der Liste:\n  Prüfe: enthält sein Titel das Suchwort?\n  Falls ja: nimm ihn in die Trefferliste auf.", note: "Die Regel bleibt gleich; nur der jeweils geprüfte Kurs wechselt.", language: "plaintext" }],
    knowledgeCheck: { question: "Welcher Schritt wird für alle Kurse wiederholt?", options: ["Den Titel mit dem Suchwort vergleichen", "Das Suchwort bei jedem Kurs zufällig ändern", "Die gesamte Kursliste löschen"], correctIndex: 0, explanation: "Jeder Titel durchläuft dieselbe Vergleichsregel." },
  }),
  workshop({
    id: "program-search-workshop", title: "Entwirf eine Kurssuche", objective: "Du formulierst eine Suchregel und prüfst zwei unterschiedliche Eingaben.",
    explanation: "Lege drei eigene Kurstitel fest. Beschreibe anschließend genau, wann ein Titel als Treffer zählt. Prüfe die Regel mit einem Suchwort, das mindestens einen Treffer liefert, und einem ohne Treffer.",
    visualSteps: ["Daten: drei Kurstitel", "Regel: Suchwort im Titel?", "Nachweis: Treffer und Nichttreffer"],
    examples: [{ title: "Ein unabhängiger Test", code: "Titel: Web, Spiele, Python\nSuchwort: Web\nTreffer: Web", note: "Wähle für deine Aufgabe andere Titel und ein eigenes Suchwort.", language: "plaintext" }],
    task: "Beschreibe deine drei Kurstitel, eine eindeutige Suchregel und die Ergebnisse für zwei Suchwörter.",
    starterCode: "Meine drei Titel: \nSuchregel: \nSuchwort mit Treffer: \nErgebnis mit Treffer: \nSuchwort ohne Treffer: \nErgebnis ohne Treffer: \n",
    acceptanceCriteria: ["Die Regel lässt sich für jeden der drei Titel gleich anwenden.", "Ein Test zeigt mindestens einen passenden Titel.", "Der zweite Test beschreibt den Leerzustand verständlich."],
  }),
  step({
    id: "program-debug", title: "Fehler systematisch eingrenzen", objective: "Du unterscheidest Erwartung, Beobachtung und mögliche Ursache.",
    explanation: "Debuggen bedeutet, die Ursache eines Fehlers gezielt zu finden. Beschreibe zuerst, was erwartet wurde und was tatsächlich passiert. Formuliere dann eine prüfbare Vermutung und ändere nur eine Sache. Wiederhole denselben Test, um die Wirkung zu erkennen.",
    visualSteps: ["Erwartet: 'Spiel' findet 'Spiele'", "Beobachtet: keine Treffer", "Vermutung: nur exakte Gleichheit erlaubt"],
    examples: [{ title: "Eine prüfbare Vermutung", code: "Regel: Titel muss exakt dem Suchwort entsprechen\n'Spiel' ≠ 'Spiele' → kein Treffer\nNeue Regel: Titel darf Suchwort enthalten", note: "Die Änderung erklärt genau den beobachteten Unterschied.", language: "plaintext" }],
    knowledgeCheck: { question: "Was hilft zuerst, wenn ein Ergebnis falsch ist?", options: ["Erwartung und tatsächliche Beobachtung konkret aufschreiben", "Mehrere Regeln gleichzeitig ändern", "Den Fehler als Zufall ignorieren"], correctIndex: 0, explanation: "Erst der konkrete Unterschied macht eine Ursache prüfbar." },
  }),
  workshop({
    id: "program-debug-workshop", title: "Prüfe und verbessere die Suchregel", objective: "Du untersuchst einen Fehler mit einer Vermutung und einem Wiederholungstest.",
    explanation: "Die Suche soll bei „Spiel“ auch „Spiele“ finden, liefert aber keinen Treffer. Nutze die Methode aus der vorigen Lektion: Beobachtung festhalten, Regel prüfen, eine Änderung vornehmen und denselben Fall erneut testen.",
    visualSteps: ["Testfall festhalten", "Vergleichsregel prüfen", "Eine Änderung → gleichen Test wiederholen"],
    examples: [{ title: "Startzustand", code: "Suchwort: Spiel\nKurstitel: Spiele\nAktuelle Regel: beide Texte müssen genau gleich sein", note: "Finde eine Regel, die diesen Fall abdeckt, ohne beliebige Titel anzuzeigen.", language: "plaintext" }],
    task: "Dokumentiere erwartetes und tatsächliches Ergebnis, die Ursache, deine Regeländerung und den erneuten Test.",
    starterCode: "Erwartet: \nTatsächlich: \nVermutete Ursache: \nMeine Änderung: \nErneuter Test: \n",
    acceptanceCriteria: ["Erwartung und Beobachtung sind konkret und verschieden.", "Die Ursache bezieht sich auf die Vergleichsregel.", "Der erneute Test verwendet wieder „Spiel“ und „Spiele“."],
  }),
  step({
    id: "program-ecosystem", title: "Sprache, Laufzeit, Framework und Werkzeug", objective: "Du trennst vier Teile eines Softwareprojekts sauber voneinander.",
    explanation: "Eine Programmiersprache legt fest, wie du Regeln formulierst. Eine Laufzeit oder ein Betriebssystem führt das Programm aus. Ein Framework liefert eine Struktur und fertige Bausteine für eine bestimmte Aufgabe. Werkzeuge wie Editor, Paketverwaltung und Tests helfen beim Entwickeln. Erst wenn diese Rollen klar sind, wählst du passende Technik.",
    visualSteps: ["Sprache → Regeln schreiben", "Laufzeit → Regeln ausführen", "Framework + Werkzeuge → Projekt bauen und prüfen"],
    examples: [{ title: "Browserprojekt", code: "JavaScript = Sprache\nBrowser = Ausführungsumgebung\nReact = UI-Bibliothek\nVite = Entwicklungswerkzeug", note: "Diese Teile erfüllen verschiedene Aufgaben; nicht jedes Projekt braucht alle.", language: "plaintext" }],
    knowledgeCheck: { question: "Was ist React im Verhältnis zu JavaScript?", options: ["Eine zusätzliche Bibliothek für Benutzeroberflächen", "Eine andere Schreibweise für JavaScript", "Das Betriebssystem des Browsers"], correctIndex: 0, explanation: "JavaScript ist die Sprache; React ergänzt sie für Oberflächen." },
  }),
  step({
    id: "program-languages", title: "Welche Sprache passt zu welchem Ziel?", objective: "Du ordnest Sprachfamilien und typische Einsatzgebiete ein.",
    explanation: "Für Browseroberflächen gehören HTML als Auszeichnung für Struktur, CSS als Gestaltungssprache und JavaScript als Programmiersprache für Verhalten zusammen; TypeScript ergänzt JavaScript um Typprüfung. Python wird oft für Daten und KI genutzt, Java und C# häufig für Serveranwendungen, PHP für Webserver. SQL ist eine eigene Abfragesprache für Datenbanken. C, C++ und Rust sind wichtig für systemnahe Programme. Kotlin und Swift werden oft für mobile Apps verwendet; GDScript steuert Godot-Spiele. Die Wahl hängt auch von Team, Plattform und bestehendem Projekt ab.",
    visualSteps: ["Browser → HTML + CSS + JavaScript/TypeScript", "Server + Daten → Java/C#/Python/PHP + SQL", "Systeme/Apps/Spiele → C/C++/Rust · Kotlin/Swift · GDScript"],
    languageGuide: [
      { field: "Browseroberfläche", technology: "HTML · CSS · JavaScript / TypeScript", role: "HTML ordnet Inhalte, CSS gestaltet sie, JavaScript steuert Verhalten; TypeScript prüft Typen beim Entwickeln." },
      { field: "Server", technology: "Java · C# · Python · PHP", role: "Verarbeitet Anfragen und Regeln. Die Wahl hängt oft von Team und bestehendem System ab." },
      { field: "Daten und KI", technology: "Python", role: "Bereitet Daten auf, trainiert Modelle und automatisiert Auswertungen." },
      { field: "Datenbank", technology: "SQL", role: "Fragt Tabellen ab und ändert Daten; keine allgemeine Anwendungssprache." },
      { field: "Systemnahe Software", technology: "C · C++ · Rust", role: "Wird eingesetzt, wenn Hardwarezugriff, Speicherverhalten oder Leistung wichtig sind." },
      { field: "Mobile Apps", technology: "Kotlin · Swift", role: "Kotlin ist häufig bei Android, Swift bei Apple-Plattformen im Einsatz." },
      { field: "Godot-Spiele", technology: "GDScript", role: "Beschreibt Spielregeln und steuert Szenen in Godot." },
    ],
    examples: [{ title: "Drei Projekte, drei Kombinationen", code: "Kursfinder: HTML + CSS + JavaScript\nKurs-API: Java oder Python + SQL\nGodot-Spiel: GDScript + Engine", note: "Eine Sprache ist kein Qualitätsurteil. Entscheidend ist, was das Projekt braucht.", language: "plaintext" }],
    knowledgeCheck: { question: "Du willst eine interaktive Website im Browser bauen. Welche Kombination passt?", options: ["HTML, CSS und JavaScript; TypeScript bei Bedarf", "Nur SQL", "Nur eine Spiele-Engine"], correctIndex: 0, explanation: "Struktur, Gestaltung und Verhalten sind unterschiedliche Aufgaben im Frontend." },
  }),
  step({
    id: "program-system", title: "Wie Technologien zu einem System werden", objective: "Du verfolgst eine Anfrage vom Browser bis zu den gespeicherten Daten und zurück.",
    explanation: "Ein vollständiges Websystem hat mehrere Verantwortungen. Das Frontend zeigt Daten und nimmt Eingaben an. Ein Backend prüft Anfragen und Rechte, führt Regeln aus und liest oder schreibt eine Datenbank. Die Antwort wandert zurück zum Frontend, das Erfolg oder Fehler verständlich anzeigt. Nicht jedes Projekt braucht einen eigenen Server.",
    visualSteps: ["Browser → Anfrage an Backend", "Backend → Regeln + Datenbank", "Antwort → sichtbarer Zustand im Browser"],
    examples: [{ title: "Kurs als Favorit speichern", code: "Klick → Anfrage mit Kurs-ID\nServer → Anmeldung und Kurs prüfen\nDatenbank → Favorit speichern\nAntwort → Bestätigung anzeigen", note: "Jeder Teil hat eine klar begrenzte Verantwortung.", language: "plaintext" }],
    knowledgeCheck: { question: "Wer sollte prüfen, ob ein Nutzer einen fremden Favoriten ändern darf?", options: ["Das Backend vor dem Speichern", "Nur die Farbe des Buttons", "Allein das HTML im Browser"], correctIndex: 0, explanation: "Berechtigungen müssen dort geprüft werden, wo Änderungen angenommen werden." },
  }),
  step({
    id: "program-learning", title: "Dein nächster Lernweg", objective: "Du wählst einen Schwerpunkt und eine überprüfbare erste Arbeitsprobe.",
    explanation: "Wähle ein Projekt, das dich interessiert. Lerne die nötigen Grundlagen in kleinen Schritten, baue früh eine lauffähige Version und prüfe Normalfall sowie Randfall. Erkläre Entscheidungen in eigenen Worten und wiederhole gezielt unsichere Teile. Der passende Themenkurs führt dich zu Sprachen und Werkzeugen, sobald du sie brauchst.",
    visualSteps: ["Ziel wählen", "Kleine Version bauen und prüfen", "Fehler verbessern → nächster Schritt"],
    examples: [{ title: "Vom Interesse zum Projekt", code: "Interesse: Weboberflächen\nErstes Projekt: Kursfinder mit Suche\nNachweis: Treffer und Leerzustand funktionieren", note: "Ein überprüfbares Projekt zeigt mehr Lernfortschritt als das bloße Lesen von Begriffen.", language: "plaintext" }],
    knowledgeCheck: { question: "Woran erkennst du bei einem ersten Projekt Fortschritt?", options: ["Ein konkreter Ablauf funktioniert und ist getestet", "Viele Werkzeuge sind installiert", "Alle Sprachen wurden gleichzeitig begonnen"], correctIndex: 0, explanation: "Ein sichtbares und geprüftes Ergebnis ist ein guter nächster Schritt." },
  }),
];
