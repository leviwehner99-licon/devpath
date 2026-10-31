import { courseCurricula } from "./course-curriculum";

export type CourseLesson = {
  id: string;
  title: string;
  objective: string;
  duration: number;
  language: string;
  concepts: { tag: string; description: string }[];
  explanation: string;
  starterCode: string;
  task: string;
  successPattern: RegExp;
  exampleCode?: string;
  visualSteps?: string[];
  method?: { title: string; description: string };
  framework?: { title: string; description: string };
  module?: string;
  examples?: { title: string; code: string; note: string; language?: string; walkthrough?: string[] }[];
  languageCourse?: { id: string; title: string; reason: string };
  takeaway?: string;
  retrievalPrompt?: string;
  retrievalAnswer?: string;
  projectSteps?: string[];
  acceptanceCriteria?: string[];
  resultPreview?: { title: string; summary: string; checks: string[] };
  resources?: { label: string; url: string }[];
  practice?: boolean;
  knowledgeCheck?: { question: string; options: string[]; correctIndex: number; explanation: string };
};

export type LearningCourse = { id: string; version: string; title: string; category: string; lessons: CourseLesson[] };

export const programmingCourse: LearningCourse = {
  id: "programming-intro",
  version: "4.0.0",
  title: "Einstieg in die Programmierung",
  category: "Programmiergrundlagen",
  lessons: [
    {
      id: "program-output", title: "Was ist Programmieren?", objective: "Du kannst erklären, warum Menschen Programme schreiben und wie aus einer Idee klare Schritte werden.", duration: 10, language: "plaintext", practice: false, module: "01 · Orientierung",
      concepts: [{ tag: "Programm", description: "Eine nachvollziehbare Folge von Anweisungen, die ein Computer ausführt." }, { tag: "Laufzeit", description: "Ein Programm wird von einer passenden Umgebung ausgeführt, zum Beispiel einem Browser oder Node.js." }],
      explanation: "Programmieren heißt, eine Idee in so eindeutige Schritte zu übersetzen, dass ein Computer sie ausführen kann. Denk an eine Wegbeschreibung: Wenn eine Abzweigung fehlt, kommt jemand am falschen Ort an. Ebenso braucht ein Programm Eingaben, Regeln und ein erkennbares Ergebnis. Zuerst üben wir dieses Denken ganz ohne Code. Du musst noch keine Zeichen oder Befehle kennen.",
      starterCode: "", exampleCode: "Idee → klare Schritte → Ergebnis", examples: [{ title: "Alltag statt Code", code: "Ziel: Jemandem ein Getränk anbieten\nEingabe: gewünschtes Getränk\nRegel: Ist es vorhanden?\nErgebnis: Getränk anbieten oder Alternative nennen", note: "Die Entscheidung muss klar sein. So zerlegst du später auch ein digitales Problem." }, { title: "Ein Spiel als Programmidee", code: "Eingabe: Taste drücken\nRegel: Figur bewegt sich einen Schritt\nErgebnis: neue Position erscheint", note: "Eine App, eine Webseite und ein Spiel folgen demselben Grundmuster." }],
      task: "Wissenscheck: Was ist ein Programm?", successPattern: /(?:)/,
      knowledgeCheck: { question: "Welche Aussage beschreibt ein Programm am besten?", options: ["Eine Folge klarer Anweisungen, die eine Laufzeit ausführt", "Ein Bild, das ein Computer von selbst versteht", "Eine Programmiersprache ist immer an einen einzigen Browser gebunden"], correctIndex: 0, explanation: "Richtig: Ein Programm beschreibt Schritte. Eine passende Laufzeit, zum Beispiel ein Browser oder Node.js, führt JavaScript aus." },
    },
    { id: "program-why", title: "Was kann man mit Programmierung machen?", objective: "Du erkennst Anwendungen und findest ein eigenes Lernziel.", duration: 10, language: "plaintext", practice: false, module: "01 · Orientierung", concepts: [], explanation: "Programme stecken in Webseiten, Apps, Spielen, Datenanalysen und Geräten. Das Interessante ist nicht der Code allein, sondern was du damit für Menschen lösen oder erschaffen kannst. Eine Website zeigt Informationen und reagiert auf Eingaben. Ein Server verwaltet gemeinsame Daten. Ein Spiel verbindet Regeln, Eingabe und Rückmeldung. Du darfst klein anfangen: Eine einzige nützliche Funktion ist schon ein echtes Projekt.", starterCode: "", task: "Wähle ein erreichbares erstes Projekt.", successPattern: /(?:)/, examples: [{ title: "Drei kleine Ideen", code: "Website: eine persönliche Projektseite\nSpiel: Punkte zählen und anzeigen\nAlltag: Ausgaben einer Woche addieren", note: "Jede Idee lässt sich in kleine Schritte zerlegen." }], knowledgeCheck: { question: "Welches Ziel ist für den Anfang gut geeignet?", options: ["Ein kleines Problem mit klarem Ergebnis lösen", "Sofort eine große Plattform allein bauen", "Zuerst alle Befehle auswendig lernen"], correctIndex: 0, explanation: "Ein kleines, überprüfbares Ergebnis motiviert und zeigt dir, was du schon kannst." } },
    { id: "program-languages", title: "Welche Sprache passt zu welchem Ziel?", objective: "Du kannst Sprachen nach Einsatzgebiet einordnen, ohne schon Syntax zu lernen.", duration: 12, language: "plaintext", practice: false, module: "01 · Orientierung", concepts: [], explanation: "Eine Programmiersprache ist ein Werkzeug. HTML beschreibt die Struktur einer Webseite, CSS ihre Gestaltung und JavaScript ihr Verhalten. Python eignet sich gut für erste Programme, Automatisierung und Daten. SQL fragt Datenbanken ab. C# wird unter anderem in Unity-Spielen genutzt; Java, C++, Rust und andere Sprachen haben weitere Stärken. Es gibt keine Sprache, die für alles immer die beste ist. Wähle zuerst nach deinem Ziel und lerne dann die gemeinsamen Grundideen: Werte, Entscheidungen, Wiederholungen und Funktionen.", starterCode: "", task: "Ordne ein Ziel einem Werkzeug zu.", successPattern: /(?:)/, examples: [{ title: "Eine interaktive Webseite", code: "HTML: Inhalt\nCSS: Aussehen\nJavaScript: Klicks und Reaktionen", note: "Mehrere Werkzeuge arbeiten zusammen, ohne dass du alle sofort beherrschen musst." }, { title: "Daten untersuchen", code: "Python: Daten verarbeiten\nSQL: gespeicherte Daten abfragen", note: "Der Zweck hilft bei der Wahl." }], knowledgeCheck: { question: "Du möchtest, dass ein Knopf auf einer Webseite auf Klick reagiert. Was passt dazu?", options: ["JavaScript", "Nur CSS", "Nur SQL"], correctIndex: 0, explanation: "JavaScript beschreibt das Verhalten; HTML und CSS übernehmen Struktur und Gestaltung." } },
    { id: "program-learning", title: "So lernst du Programmieren", objective: "Du kennst einen Lernrhythmus, der Verstehen, Ausprobieren und Wiederholen verbindet.", duration: 10, language: "plaintext", practice: false, module: "01 · Orientierung", concepts: [], explanation: "Lies eine Idee, sage sie mit eigenen Worten, probiere ein kleines Beispiel aus und ändere genau eine Sache. Frage danach: Was habe ich erwartet und was ist wirklich passiert? Fehler sind Hinweise auf eine ungenaue Annahme. Wenn etwas nicht sitzt, wiederhole es mit einer neuen Aufgabe und bitte um einen Hinweis. Kurze regelmäßige Einheiten helfen mehr als bloßes Abschreiben. Ab der nächsten Lektion wirst du deinen ersten Code langsam, Zeile für Zeile, kennenlernen.", starterCode: "", task: "Wähle die beste Lernweise.", successPattern: /(?:)/, examples: [{ title: "Eine Übung in vier Schritten", code: "1. Vermutung aufschreiben\n2. Kleinste Änderung ausprobieren\n3. Ergebnis prüfen\n4. Ohne Vorlage erklären", note: "So merkst du, ob du etwas wirklich verstanden hast." }], knowledgeCheck: { question: "Was hilft am meisten, wenn ein Beispiel nicht funktioniert?", options: ["Eine Annahme prüfen und nur eine Sache ändern", "Alles ungelesen kopieren", "Den Fehler ignorieren"], correctIndex: 0, explanation: "Kleine Änderungen machen Ursache und Wirkung sichtbar." } },
    {
      id: "program-variables", title: "Werte in Variablen speichern", objective: "Du kannst einen Wert mit const oder let benennen und wiederverwenden.", duration: 15, language: "javascript", module: "02 · Werte und Datentypen",
      concepts: [{ tag: "const", description: "Legt einen Namen an, der nicht neu zugewiesen wird." }, { tag: "Variable", description: "Ein benannter Platz, über den ein Wert im Programm erreichbar ist." }],
      explanation: "Variablen machen Werte unter einem Namen verfügbar. Verwende const, wenn du den Namen nicht neu belegen musst. Eine aussagekräftige Bezeichnung hilft, den Code später zu verstehen.",
      starterCode: "// Speichere deinen Namen\n\nconsole.log(name);\n", examples: [{ title: "Text benennen", code: "const learnerName = 'Mina';", note: "Der Name learnerName steht für den Text Mina." }, { title: "Zähler ändern", code: "let attempts = 0;\nattempts = attempts + 1;", note: "let ist passend, wenn später ein neuer Wert zugewiesen werden soll." }],
      task: "Lege eine Variable name mit deinem Namen an und gib sie aus.", successPattern: /(?:const|let)\s+name\s*=\s*[\"'`][^\"'`]+[\"'`][\s\S]*console\s*\.\s*log\s*\(\s*name\s*\)/i,
    },
    {
      id: "program-types", title: "Texte, Zahlen und Wahrheitswerte", objective: "Du erkennst die grundlegenden Datentypen und kannst sie verwenden.", duration: 15, language: "javascript", module: "02 · Werte und Datentypen",
      concepts: [{ tag: "string", description: "Text steht in Anführungszeichen." }, { tag: "number", description: "Zahlen können berechnet werden." }, { tag: "boolean", description: "true und false drücken eine Ja/Nein-Aussage aus." }],
      explanation: "JavaScript unterscheidet Werte wie Texte, Zahlen und Wahrheitswerte. Der Typ bestimmt, welche Operationen sinnvoll sind. Mit typeof kannst du den Typ eines Werts untersuchen.",
      starterCode: "const age = 18;\nconst learning = true;\n\n// Gib den Typ von age aus\n", examples: [{ title: "Text, Zahl und Boolean", code: "const name = 'Mina';\nconst age = 18;\nconst learning = true;", note: "Die Werte haben unterschiedliche Datentypen." }, { title: "Typ prüfen", code: "console.log(typeof age); // number", note: "typeof liefert den Typ des aktuellen Werts." }],
      task: "Gib mit typeof den Typ der Variable age aus.", successPattern: /console\s*\.\s*log\s*\(\s*typeof\s+age\s*\)/i,
    },
    {
      id: "program-operators", title: "Rechnen und Werte vergleichen", objective: "Du verwendest Rechenoperatoren und vergleichst Werte ohne unbeabsichtigte Typumwandlung.", duration: 15, language: "javascript", module: "02 · Werte und Datentypen",
      concepts: [{ tag: "Operator", description: "Ein Zeichen wie + oder >=, das mit einem oder mehreren Werten arbeitet." }],
      explanation: "Mit +, -, * und / rechnest du. Vergleiche wie ===, !==, < und >= ergeben true oder false. Verwende meist === statt ==: === vergleicht Wert und Typ, während == Typen automatisch umwandeln kann. Rechenregeln wie Punkt-vor-Strich gelten auch im Code.",
      starterCode: "const price = 7;\nconst amount = 3;\n\n// Berechne den Gesamtpreis und prüfe die Menge\n",
      examples: [{ title: "Reihenfolge", code: "const total = 2 + 3 * 4; // 14", note: "Multiplikation wird vor Addition berechnet." }, { title: "Typgenauer Vergleich", code: "console.log(12 === '12'); // false", note: "Eine Zahl und ein Text sind verschiedene Typen." }],
      task: "Berechne den Gesamtpreis und prüfe mit ===, ob amount genau 3 ist.", successPattern: /===|\*\s*amount/i,
    },
    {
      id: "program-conditions", title: "Entscheidungen mit Bedingungen", objective: "Du kannst mit if und else unterschiedliche Fälle behandeln.", duration: 20, language: "javascript", module: "03 · Ablauf und Wiederholung",
      concepts: [{ tag: "if", description: "Führt einen Block aus, wenn die Bedingung wahr ist." }, { tag: "else", description: "Behandelt den anderen Fall." }],
      explanation: "Bedingungen lassen ein Programm abhängig von einem Wert entscheiden. Der Ausdruck in den Klammern wird geprüft; danach läuft der passende Codeblock.",
      starterCode: "const points = 12;\n\n// Prüfe, ob points mindestens 10 ist\n", examples: [{ title: "Zwei Fälle", code: "if (points >= 10) {\n  console.log('Bestanden');\n} else {\n  console.log('Weiter üben');\n}", note: "Die Bedingung entscheidet, welcher Block läuft." }, { title: "Drei Fälle", code: "if (points < 0) {\n  console.log('Ungültig');\n} else if (points >= 10) {\n  console.log('Bestanden');\n}", note: "else if ergänzt einen weiteren möglichen Fall." }],
      task: "Ergänze eine if/else-Entscheidung für mindestens 10 Punkte.", successPattern: /if\s*\([^)]*points\s*>=\s*10[^)]*\)\s*\{[\s\S]*\}\s*else\s*\{[\s\S]*\}/i,
    },
    {
      id: "program-loops", title: "Wiederholungen mit Schleifen", objective: "Du kannst eine Schleife nutzen, um eine Aktion mehrfach auszuführen.", duration: 20, language: "javascript", module: "03 · Ablauf und Wiederholung",
      concepts: [{ tag: "for", description: "Wiederholt Code mit einem Startwert, einer Bedingung und einer Änderung." }, { tag: "Iteration", description: "Ein einzelner Durchlauf einer Schleife." }],
      explanation: "Schleifen sparen Wiederholungen. Eine for-Schleife legt fest, wo sie startet, wann sie endet und wie sich der Zähler verändert.",
      starterCode: "// Gib die Zahlen von 1 bis 5 aus\n",
      task: "Schreibe eine for-Schleife, die i von 1 bis einschließlich 5 zählt.", successPattern: /for\s*\(\s*(?:let|var)\s+i\s*=\s*1\s*;\s*i\s*<=\s*5\s*;\s*i\s*(?:\+\+|\+=\s*1)\s*\)/i,
      examples: [{ title: "Zählschleife", code: "for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}", note: "Startwert, Bedingung und Änderung stehen im Schleifenkopf." }, { title: "Array durchlaufen", code: "for (const name of ['Mina', 'Sam']) {\n  console.log(name);\n}", note: "for...of liest jedes Element der Liste." }],
    },
    {
      id: "program-collections", title: "Listen und Objekte", objective: "Du speicherst mehrere Werte und greifst gezielt auf einzelne Eigenschaften zu.", duration: 18, language: "javascript", module: "03 · Ablauf und Wiederholung",
      concepts: [{ tag: "Array", description: "Eine geordnete Liste von Werten." }, { tag: "Objekt", description: "Benannte Eigenschaften, die zu einem Gegenstand gehören." }],
      explanation: "Ein Array speichert mehrere Werte in einer Reihenfolge. Der erste Index ist 0. Ein Objekt gruppiert Werte unter Namen, etwa name und score. Mit map wandelst du Listenelemente um; filter behält nur Werte, die eine Bedingung erfüllen.",
      starterCode: "const scores = [4, 8, 12];\nconst learner = { name: 'Mina', score: 12 };\n\n// Lies learner.name und filtere bestandene Punktzahlen\n",
      examples: [{ title: "Erstes Arrayelement", code: "const names = ['Mina', 'Sam'];\nconsole.log(names[0]); // Mina", note: "Der erste Index eines Arrays ist 0." }, { title: "Objekt und Filter", code: "const learner = { name: 'Mina', score: 12 };\nconst passed = [4, 12].filter(score => score >= 10);", note: "Punktzahlen bleiben Daten; filter wählt passende Werte." }],
      task: "Gib learner.name aus und filtere aus scores alle Werte ab 10.", successPattern: /\.filter\s*\(|learner\.name/,
    },
    {
      id: "program-functions", title: "Eigene Funktionen schreiben", objective: "Du kannst eine Funktion mit einem Parameter definieren und aufrufen.", duration: 20, language: "javascript", module: "04 · Funktionen und Fehler",
      concepts: [{ tag: "function", description: "Bündelt einen wiederverwendbaren Arbeitsschritt." }, { tag: "Parameter", description: "Übergibt einen Wert an die Funktion." }, { tag: "return", description: "Gibt ein Ergebnis zurück." }],
      explanation: "Funktionen machen wiederkehrende Arbeitsschritte wiederverwendbar. Parameter sind Eingaben, return liefert das berechnete Ergebnis zurück.",
      starterCode: "// Schreibe eine Funktion greet(name)\n\nconsole.log(greet(\"Ada\"));\n",
      task: "Schreibe greet(name), sodass die Funktion eine Begrüßung zurückgibt.", successPattern: /function\s+greet\s*\(\s*name\s*\)\s*\{[\s\S]*return\s+[^;]*name[^;]*;?[\s\S]*\}/i,
      examples: [{ title: "Ergebnis zurückgeben", code: "function double(value) {\n  return value * 2;\n}\nconsole.log(double(4));", note: "return liefert 8 zurück; console.log zeigt es an." }, { title: "Arrow Function", code: "const greet = name => `Hallo, ${name}`;", note: "Eine kurze Funktion kann als Arrow Function geschrieben werden." }],
    },
    {
      id: "program-errors", title: "Fehler lesen und Werte prüfen", objective: "Du unterscheidest Fehlerarten und prüfst Daten vor ihrer Verwendung.", duration: 18, language: "javascript", module: "04 · Funktionen und Fehler",
      concepts: [{ tag: "Debugging", description: "Fehlerursache mit Beobachtung und gezielten Prüfungen finden." }],
      explanation: "Ein Syntaxfehler verhindert, dass JavaScript den Code versteht. Ein Laufzeitfehler tritt beim Ausführen auf. Ein Logikfehler läuft, liefert aber das falsche Ergebnis. Lies Fehlermeldung und Zeile; gib Zwischenwerte aus und ändere immer nur eine Sache.",
      starterCode: "const input = 'abc';\nconst value = Number(input);\n\n// Prüfe, ob die Eingabe eine gültige Zahl ist\n",
      examples: [{ title: "Zwischenstand ansehen", code: "console.log({ input, value, type: typeof value });", note: "Mehrere relevante Werte lassen sich gemeinsam anzeigen." }, { title: "Ungültige Zahl erkennen", code: "if (Number.isNaN(value)) {\n  console.log('Bitte Zahl eingeben');\n}", note: "Eine Umwandlung kann fehlschlagen und NaN ergeben." }],
      task: "Erkenne NaN und gib eine verständliche Meldung aus.", successPattern: /Number\.isNaN\s*\(/,
    },
    {
      id: "program-browser", title: "Auf Klicks im Browser reagieren", objective: "Du verbindest einen Button mit einer sicheren Text-Rückmeldung.", duration: 20, language: "javascript", module: "05 · Erste Browseranwendung",
      concepts: [{ tag: "Ereignis", description: "Ein Klick oder Tastendruck, auf den das Programm reagieren kann." }],
      explanation: "Der Browser stellt Webseiten über ein DOM dar. document.querySelector sucht ein HTML-Element. addEventListener registriert eine Funktion, die bei einem Ereignis läuft. Diese Dinge sind Browser-APIs, nicht Bestandteile der JavaScript-Sprache. textContent setzt sicheren Text statt ungeprüftes HTML.",
      starterCode: "const button = document.querySelector('button');\nconst message = document.querySelector('#message');\n\n// Reagiere auf einen Klick\n",
      examples: [{ title: "Klickereignis", code: "button.addEventListener('click', () => {\n  message.textContent = 'Gestartet';\n});", note: "Die Funktion wird erst beim Klick ausgeführt." }, { title: "Text aus einem Feld", code: "output.textContent = input.value.trim();", note: "textContent interpretiert Nutzereingaben nicht als HTML." }],
      task: "Registriere ein click-Ereignis und schreibe eine kurze Rückmeldung mit textContent.", successPattern: /addEventListener\s*\(|textContent\s*=/,
    },
    {
      id: "program-mini-project", title: "Mini-Projekt: Punkte auswerten", objective: "Du verbindest Variablen, Arrays, Schleifen und Funktionen in einem kleinen Programm.", duration: 30, language: "javascript", module: "06 · Erstes eigenes Programm",
      concepts: [{ tag: "Array", description: "Speichert mehrere Werte in einer geordneten Liste." }, { tag: "function", description: "Macht die Auswertung als Arbeitsschritt wiederverwendbar." }, { tag: "for...of", description: "Geht nacheinander durch die Werte einer Liste." }],
      explanation: "In kleinen Programmen wirken die Grundlagen zusammen: Daten liegen in einer Liste, eine Funktion wertet sie aus und eine Schleife verarbeitet jeden Eintrag.",
      starterCode: "const scores = [4, 7, 9];\n\nfunction sumScores(values) {\n  // Addiere alle Werte\n}\n\nconsole.log(sumScores(scores));\n", examples: [{ title: "Datenliste", code: "const scores = [4, 7, 9];", note: "Jeder Wert steht einmal in der Liste." }, { title: "Schleife und Funktion", code: "function sumScores(values) {\n  let total = 0;\n  for (const value of values) total += value;\n  return total;\n}", note: "Die Funktion verarbeitet jeden Listenwert und gibt das Ergebnis zurück." }],
      task: "Vervollständige sumScores mit einer for...of-Schleife und gib die Summe zurück.", successPattern: /function\s+sumScores\s*\(\s*values\s*\)\s*\{[\s\S]*for\s*\(\s*(?:const|let)\s+\w+\s+of\s+values\s*\)[\s\S]*return\s+\w+\s*;?[\s\S]*\}/i, projectSteps: ["1. Verfolge einen Durchlauf mit dem Wert 4.", "2. Addiere jeden Wert zur laufenden Summe.", "3. Gib die Summe zurück und prüfe die leere Liste."], acceptanceCriteria: ["Für [4, 7, 9] kommt 20 heraus.", "Die leere Liste ergibt 0.", "Eine Schleife verarbeitet alle Einträge.", "Du kannst Eingabe, Zwischensumme und Rückgabe erklären."],
    },
  ] satisfies CourseLesson[],
};

export const courseSkills = programmingCourse.lessons.map((lesson) => lesson.id);

const courseDefinitions = [
  { id:"javascript", title:"JavaScript", category:"Programmiersprache", language:"javascript", topic:"Interaktive Programme bauen", framework:"DOM, Fetch und React als Ausblick", intro:"JavaScript verbindet Daten, Entscheidungen und Aktionen im Browser oder Server.", examples:["const greeting = 'Hallo';\\nconsole.log(greeting);","const score = 12;\\nif (score >= 10) {\\n  console.log('Bestanden');\\n}","function double(value) {\\n  return value * 2;\\n}\\nconsole.log(double(4));","const names = ['Ada', 'Linus'];\\nnames.forEach((name) => console.log(name));"] },
  { id:"java", title:"Java", category:"Programmiersprache", language:"java", topic:"Typisierte Anwendungen schreiben", framework:"JUnit und Spring Boot als Ausblick", intro:"Java nutzt klare Typen und Klassen und läuft auf der Java Virtual Machine.", examples:["String name = \"Ada\";\\nSystem.out.println(name);","int points = 12;\\nif (points >= 10) {\\n  System.out.println(\"Bestanden\");\\n}","static int doubleValue(int value) {\\n  return value * 2;\\n}","List<String> names = List.of(\"Ada\", \"Linus\");\\nnames.forEach(System.out::println);"] },
  { id:"python", title:"Python", category:"Programmiersprache", language:"python", topic:"Lesbaren Code schreiben", framework:"pytest, FastAPI und pandas als Ausblick", intro:"Python setzt auf gut lesbare Syntax und wird für Web, Daten und Automatisierung genutzt.", examples:["name = \"Ada\"\\nprint(name)","points = 12\\nif points >= 10:\\n    print(\"Bestanden\")","def double(value):\\n    return value * 2\\n\\nprint(double(4))","names = [\"Ada\", \"Linus\"]\\nfor name in names:\\n    print(name)"] },
  { id:"php", title:"PHP", category:"Programmiersprache", language:"php", topic:"Serverseitige Webseiten bauen", framework:"Laravel und PHPUnit als Ausblick", intro:"PHP verarbeitet häufig Anfragen auf dem Webserver und erzeugt Antworten.", examples:["$name = \"Ada\";\\necho $name;","$points = 12;\\nif ($points >= 10) {\\n  echo \"Bestanden\";\\n}","function doubleValue(int $value): int {\\n  return $value * 2;\\n}","$names = [\"Ada\", \"Linus\"];\\nforeach ($names as $name) {\\n  echo $name;\\n}"] },
  { id:"typescript", title:"TypeScript", category:"Programmiersprache", language:"typescript", topic:"JavaScript mit Typen absichern", framework:"TypeScript, Zod und React als Ausblick", intro:"TypeScript ergänzt JavaScript um Typprüfung vor der Ausführung.", examples:["const name: string = \"Ada\";\\nconsole.log(name);","const points: number = 12;\\nif (points >= 10) {\\n  console.log(\"Bestanden\");\\n}","function double(value: number): number {\\n  return value * 2;\\n}","const names: string[] = [\"Ada\", \"Linus\"];\\nnames.forEach((name) => console.log(name));"] },
  { id:"cpp", title:"C++", category:"Programmiersprache", language:"cpp", topic:"Leistungsfähige Programme verstehen", framework:"CMake, Catch2 und STL als Ausblick", intro:"C++ bietet Kontrolle über Leistung und Ressourcen mit modernen Bibliotheken.", examples:["#include <iostream>\\nint main() {\\n  std::cout << \"Hallo\";\\n}","int points = 12;\\nif (points >= 10) {\\n  std::cout << \"Bestanden\";\\n}","int doubleValue(int value) {\\n  return value * 2;\\n}","#include <vector>\\nstd::vector<int> values{2, 4, 6};\\nfor (int value : values) { std::cout << value; }"] },
  { id:"csharp", title:"C#", category:"Programmiersprache", language:"csharp", topic:".NET-Anwendungen entwickeln", framework:".NET, ASP.NET Core und xUnit als Ausblick", intro:"C# ist eine moderne, typisierte Sprache für .NET-Anwendungen und Spiele.", examples:["string name = \"Ada\";\\nConsole.WriteLine(name);","int points = 12;\\nif (points >= 10) {\\n  Console.WriteLine(\"Bestanden\");\\n}","static int Double(int value) => value * 2;","var names = new[] { \"Ada\", \"Linus\" };\\nforeach (var name in names) Console.WriteLine(name);"] },
  { id:"rust", title:"Rust", category:"Programmiersprache", language:"rust", topic:"Speichersichere Programme bauen", framework:"Cargo, Clippy und Axum als Ausblick", intro:"Rust macht Ressourcenbesitz und sichere Speicherzugriffe sichtbar.", examples:["let name = \"Ada\";\\nprintln!(\"{}\", name);","let points = 12;\\nif points >= 10 {\\n    println!(\"Bestanden\");\\n}","fn double(value: i32) -> i32 {\\n    value * 2\\n}","let names = vec![\"Ada\", \"Linus\"];\\nfor name in names { println!(\"{}\", name); }"] },
  { id:"sql", title:"SQL", category:"Programmiersprache", language:"sql", topic:"Relationale Daten abfragen", framework:"PostgreSQL, Indizes und Migrationen", intro:"SQL beschreibt Abfragen und Änderungen an relationalen Tabellen.", examples:["SELECT 'Ada' AS name;","SELECT title FROM courses WHERE published = true;","SELECT category, COUNT(*) FROM courses GROUP BY category;","CREATE TABLE learner (id INTEGER PRIMARY KEY, name TEXT NOT NULL);\\nINSERT INTO learner (id, name) VALUES (1, 'Ada');"] },
  { id:"c", title:"C", category:"Programmiersprache", language:"c", topic:"Systemnahe Grundlagen lernen", framework:"Compiler, Make und Unity als Ausblick", intro:"C ist eine kompakte Sprache, die nah an Betriebssystem und Hardware arbeitet.", examples:["#include <stdio.h>\\nint main(void) {\\n  printf(\"Hallo\\n\");\\n}","int points = 12;\\nif (points >= 10) {\\n  printf(\"Bestanden\\n\");\\n}","int double_value(int value) {\\n  return value * 2;\\n}","int values[] = {2, 4, 6};\\nfor (int i = 0; i < 3; i++) printf(\"%d\\n\", values[i]);"] },
  { id:"kotlin", title:"Kotlin", category:"Programmiersprache", language:"kotlin", topic:"Moderne JVM-Apps schreiben", framework:"Kotlin coroutines, Ktor und Android", intro:"Kotlin verbindet kompakte Syntax mit JVM- und Android-Ökosystemen.", examples:["val name = \"Ada\"\\nprintln(name)","val points = 12\\nif (points >= 10) println(\"Bestanden\")","fun double(value: Int): Int = value * 2","val names = listOf(\"Ada\", \"Linus\")\\nnames.forEach(::println)"] },
  { id:"swift", title:"Swift", category:"Programmiersprache", language:"swift", topic:"Apps für Apple-Plattformen entwickeln", framework:"SwiftUI, XCTest und async/await", intro:"Swift ist eine typsichere Sprache für Apps und Programme im Apple-Ökosystem.", examples:["let name = \"Ada\"\\nprint(name)","let points = 12\\nif points >= 10 {\\n    print(\"Bestanden\")\\n}","func double(_ value: Int) -> Int { value * 2 }","let names = [\"Ada\", \"Linus\"]\\nnames.forEach { print($0) }"] },
  { id:"gdscript", title:"GDScript", category:"Programmiersprache", language:"gdscript", topic:"Spielregeln in Godot schreiben", framework:"", intro:"GDScript ist die gut lesbare Skriptsprache von Godot.", examples:[] },
  { id:"web-development", title:"Webentwicklung", category:"Themenkurs", language:"html", topic:"Eine vollständige Webseite planen und bauen", framework:"HTML, CSS, JavaScript und React", intro:"Webentwicklung verbindet Struktur, Gestaltung, Verhalten und Veröffentlichung.", examples:["<main><h1>Mein Projekt</h1><p>Eine klare Aussage.</p></main>",".card { display: grid; gap: 1rem; }","const button = document.querySelector('button');\\nbutton?.addEventListener('click', () => console.log('Start'));","Komponente → Daten → Darstellung → Interaktion"] },
  { id:"backend", title:"Backendentwicklung", category:"Themenkurs", language:"javascript", topic:"Eine API mit Datenbank entwerfen", framework:"REST, Node.js, PostgreSQL und OpenAPI", intro:"Das Backend prüft Anfragen, setzt Regeln durch und verwaltet Daten.", examples:["GET /api/courses → 200 + JSON","const course = await db.query('SELECT id, title FROM courses');","if (!user) return response.status(401);","Client → Route → Validierung → Datenbank → Antwort"] },
  { id:"security", title:"IT-Sicherheit", category:"Themenkurs", language:"javascript", topic:"Risiken erkennen und sicher abwehren", framework:"OWASP Top 10, STRIDE und Defense in Depth", intro:"Sicherheit beginnt mit Bedrohungsmodell, sicheren Standardwerten und Prüfung.", examples:["Asset → Bedrohung → Schwachstelle → Schutzmaßnahme","const safe = textContent; // Text statt ungeprüftem HTML","SELECT * FROM users WHERE id = $1; // gebundener Parameter","Änderung → Review → automatischer Scan → Freigabe"] },
  { id:"ai", title:"Künstliche Intelligenz", category:"Themenkurs", language:"python", topic:"KI-Systeme einschätzen und anwenden", framework:"scikit-learn, PyTorch und Retrieval-Augmented Generation", intro:"KI lernt Muster aus Daten; gute Nutzung verlangt Messung, Grenzen und Datenschutz.", examples:["Daten → Merkmale → Modell → Vorhersage → Prüfung","train_test_split(X, y, test_size=0.2)","Frage → relevante Dokumente → Kontext → Modellantwort","Messwert → Fehleranalyse → nächste Verbesserung"] },
  { id:"game-development", title:"Spieleentwicklung", category:"Themenkurs", language:"javascript", topic:"Ein kleines Spiel systematisch entwickeln", framework:"Game Loop, Godot und Unity als Ausblick", intro:"Spiele aktualisieren Zustand und Darstellung wiederholt und reagieren auf Eingaben.", examples:["Eingabe → Zustand aktualisieren → zeichnen","if (keys.left) player.x -= speed * delta;","player.x += velocity * delta;\\nvelocity.y += gravity * delta;","Idee → spielbarer Prototyp → Test → Feinschliff"] },
  { id:"career", title:"Auf dem Weg zum Job", category:"Themenkurs", language:"plaintext", topic:"Fähigkeiten sichtbar und nachvollziehbar zeigen", framework:"Portfolio, Git, Code Review und STAR-Methode", intro:"Ein gutes Portfolio zeigt Entscheidungen und Ergebnisse, nicht nur Schlagwörter.", examples:["Problem → Lösung → Ergebnis → gelernte Erkenntnis","git status → git add → git commit → git push","Code lesen → Rückfrage stellen → Änderung vorschlagen","Situation → Aufgabe → Handlung → Ergebnis"] },
];

function buildCourse(definition: typeof courseDefinitions[number]): LearningCourse {
  const curriculum = courseCurricula[definition.id];
  if (!curriculum || curriculum.length < 7) throw new Error(`Ausführlicher Kursinhalt fehlt: ${definition.id}`);
  const linkedLanguages = new Set<string>();
  const lessons = curriculum.map((blueprint, index) => {
    // Preserve the earlier release's four lesson IDs so saved completion records stay visible.
    const stableId = blueprint.id === "orientation" ? "orientation"
      : blueprint.id === "run" ? "basics"
      : blueprint.id === "conditions" || blueprint.id === "flow" ? "logic"
      : index === curriculum.length - 1 ? "project"
      : blueprint.id;
    const languageCourseId = blueprint.languageCourse?.id ?? (definition.id === "backend" && blueprint.id === "database" || definition.id === "security" && blueprint.id === "injection-lab" ? "sql" : ({ javascript: "javascript", typescript: "typescript", python: "python", sql: "sql", csharp: "csharp", java: "java", php: "php", gdscript: "gdscript" } as Record<string, string>)[blueprint.language]);
    const linkLanguage = definition.category === "Themenkurs" && blueprint.practice !== false && languageCourseId && !linkedLanguages.has(languageCourseId);
    if (linkLanguage) linkedLanguages.add(languageCourseId);
    return {
      ...blueprint,
      languageCourse: linkLanguage
        ? blueprint.languageCourse ?? { id: languageCourseId, title: learningLanguageTitles[languageCourseId] ?? languageCourseId, reason: `Hier brauchst du erstmals ${learningLanguageTitles[languageCourseId] ?? languageCourseId}. Im Sprachkurs übst du die Grundlagen ausführlich und kehrst danach zu dieser Anwendung zurück.` }
        : undefined,
      id: `${definition.id}-${stableId}`,
      concepts: [],
      exampleCode: blueprint.examples[0]?.code,
    } satisfies CourseLesson;
  });
  return { id: definition.id, version: "4.0.0", title: definition.title, category: definition.category, lessons };
}

const learningLanguageTitles: Record<string, string> = { javascript: "JavaScript", typescript: "TypeScript", python: "Python", sql: "SQL", csharp: "C#", java: "Java", php: "PHP", gdscript: "GDScript" };

function addRetrievalPractice(lessons: CourseLesson[]): CourseLesson[] {
  return lessons.map((lesson, index) => {
    const earlierIndex = index > 7 && index % 7 === 0 ? index - 7 : index > 3 && index % 3 === 0 ? index - 3 : index - 1;
    const previous = lessons[earlierIndex];
    return {
      ...lesson,
      retrievalPrompt: previous
        ? `Zum Festigen: Was erinnerst du zu „${previous.title}“? Nenne eine Regel und ein eigenes kleines Beispiel. Erst überlegen, dann bei Bedarf die Antwort einblenden.`
        : `Zum Festigen: Erkläre nach der Lektion in einem Satz, was „${lesson.title}“ bedeutet und nenne ein Beispiel.`,
      retrievalAnswer: previous
        ? previous.takeaway ?? previous.objective
        : `Ziel dieser Lektion: ${lesson.objective}`,
    };
  });
}

programmingCourse.lessons = addRetrievalPractice(programmingCourse.lessons);
export const learningCourses: LearningCourse[] = [programmingCourse, ...courseDefinitions.map((definition) => {
  const course = buildCourse(definition);
  course.lessons = addRetrievalPractice(course.lessons);
  return course;
})];
export function getLearningCourse(courseId: string): LearningCourse { return learningCourses.find((course) => course.id === courseId) ?? programmingCourse; }
