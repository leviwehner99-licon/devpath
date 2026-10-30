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
  examples?: { title: string; code: string; note: string }[];
  takeaway?: string;
  retrievalPrompt?: string;
  retrievalAnswer?: string;
  projectSteps?: string[];
  acceptanceCriteria?: string[];
  relatedCourses?: { id: string; title: string; reason: string }[];
  resources?: { label: string; url: string }[];
  resultPreview?: { title: string; summary: string; checks: string[] };
  practice?: boolean;
  knowledgeCheck?: { question: string; options: string[]; correctIndex: number; explanation: string };
};

export type LearningCourse = { id: string; version: string; title: string; category: string; lessons: CourseLesson[] };

export const programmingCourse: LearningCourse = {
  id: "programming-intro",
  version: "2.0.0",
  title: "Einstieg in die Programmierung",
  category: "Programmiergrundlagen",
  lessons: [
    {
      id: "program-output", title: "Was ist Programmieren?", objective: "Du kannst erklären, wie ein Programm aus einer Anweisung ein Ergebnis macht.", duration: 10, language: "javascript", practice: false, module: "01 · Einstieg",
      concepts: [{ tag: "Programm", description: "Eine nachvollziehbare Folge von Anweisungen, die ein Computer ausführt." }, { tag: "Laufzeit", description: "Ein Programm wird von einer passenden Umgebung ausgeführt, zum Beispiel einem Browser oder Node.js." }],
      explanation: "Programmieren bedeutet, ein Problem in klare Schritte zu zerlegen. Diese Schritte schreibst du in einer Programmiersprache auf. Eine passende Laufzeit — zum Beispiel ein Browser — führt sie aus. Der Computer errät nicht, was du meinst: Reihenfolge, Werte und Regeln müssen beschrieben werden. In diesem Kurs siehst du zuerst Beispiele und schreibst dann eigene kleine Programme.",
      starterCode: "", exampleCode: "Idee → klare Schritte → Programm → Ergebnis", examples: [{ title: "Ein Programm besteht aus Schritten", code: "1. Zwei Zahlen festlegen\n2. Zahlen addieren\n3. Ergebnis anzeigen", note: "Ein Programm macht aus einer Aufgabe eine genaue Reihenfolge von Arbeitsschritten." }, { title: "JavaScript ausführen", code: "console.log(2 + 3);\n// Ausgabe: 5", note: "Eine JavaScript-Laufzeit berechnet den Ausdruck und zeigt das Ergebnis." }],
      task: "Wissenscheck: Was ist ein Programm?", successPattern: /(?:)/,
      knowledgeCheck: { question: "Welche Aussage beschreibt ein Programm am besten?", options: ["Eine Folge klarer Anweisungen, die eine Laufzeit ausführt", "Ein Bild, das ein Computer von selbst versteht", "Eine Programmiersprache ist immer an einen einzigen Browser gebunden"], correctIndex: 0, explanation: "Richtig: Ein Programm beschreibt Schritte. Eine passende Laufzeit, zum Beispiel ein Browser oder Node.js, führt JavaScript aus." },
    },
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
  const lessons = curriculum.map((blueprint, index) => {
    // Preserve the earlier release's four lesson IDs so saved completion records stay visible.
    const stableId = blueprint.id === "orientation" ? "orientation"
      : blueprint.id === "run" ? "basics"
      : blueprint.id === "conditions" || blueprint.id === "flow" ? "logic"
      : index === curriculum.length - 1 ? "project"
      : blueprint.id;
    return {
      ...blueprint,
      relatedCourses: courseConnections[definition.id] ?? [],
      resources: courseResources[definition.id] ?? [],
      id: `${definition.id}-${stableId}`,
      concepts: [],
      exampleCode: blueprint.examples[0]?.code,
    } satisfies CourseLesson;
  });
  return { id: definition.id, version: "3.0.0", title: definition.title, category: definition.category, lessons };
}

// Explicit lesson-to-lesson paths. Links open the first relevant lesson in the selected course.
const courseConnections: Record<string, { id: string; title: string; reason: string }[]> = {
  javascript: [{ id: "web-development", title: "Webentwicklung", reason: "DOM, Gestaltung und Browserprojekt vertiefen" }, { id: "backend", title: "Backendentwicklung", reason: "JavaScript mit Node.js auf dem Server anwenden" }, { id: "typescript", title: "TypeScript", reason: "JavaScript-Projekte statisch typisieren" }],
  java: [{ id: "backend", title: "Backendentwicklung", reason: "APIs und Datenbanken ergänzen" }, { id: "kotlin", title: "Kotlin", reason: "JVM-Grundlagen auf eine moderne Sprache übertragen" }],
  python: [{ id: "ai", title: "Künstliche Intelligenz", reason: "Python für Daten und Modelle praktisch einsetzen" }, { id: "backend", title: "Backendentwicklung", reason: "Python-APIs mit FastAPI bauen" }, { id: "sql", title: "SQL", reason: "Daten für Programme und Modelle speichern" }],
  php: [{ id: "web-development", title: "Webentwicklung", reason: "PHP mit Formularen und Browseroberflächen verbinden" }, { id: "backend", title: "Backendentwicklung", reason: "API- und Serverkonzepte ausbauen" }, { id: "sql", title: "SQL", reason: "Datenbankabfragen sicher anwenden" }],
  typescript: [{ id: "javascript", title: "JavaScript", reason: "Die Laufzeit- und Sprachgrundlagen nachschlagen" }, { id: "web-development", title: "Webentwicklung", reason: "Typisierte Oberflächen erstellen" }, { id: "backend", title: "Backendentwicklung", reason: "Typisierte APIs mit Node.js entwickeln" }],
  cpp: [{ id: "c", title: "C", reason: "Speicher- und Systemgrundlagen vergleichen" }, { id: "game-development", title: "Spieleentwicklung", reason: "Spielmechaniken und Engines anwenden" }],
  csharp: [{ id: "game-development", title: "Spieleentwicklung", reason: "C# in Unity-Projekten praktisch einsetzen" }, { id: "backend", title: "Backendentwicklung", reason: "APIs und persistente Daten ergänzen" }],
  rust: [{ id: "c", title: "C", reason: "Systemnahe Programmierung vergleichen" }, { id: "backend", title: "Backendentwicklung", reason: "Rust-Services und API-Konzepte vertiefen" }],
  sql: [{ id: "backend", title: "Backendentwicklung", reason: "SQL in eine echte API integrieren" }, { id: "ai", title: "Künstliche Intelligenz", reason: "Trainingsdaten speichern und auswerten" }],
  c: [{ id: "cpp", title: "C++", reason: "Systemnahe Grundlagen in größere Abstraktionen übertragen" }, { id: "security", title: "IT-Sicherheit", reason: "Speicherfehler und sichere Entwicklung verstehen" }],
  kotlin: [{ id: "java", title: "Java", reason: "JVM-Grundlagen ergänzen" }, { id: "career", title: "Auf dem Weg zum Job", reason: "Projekte dokumentieren und präsentieren" }],
  swift: [{ id: "career", title: "Auf dem Weg zum Job", reason: "App-Projekte als Portfolio aufbereiten" }],
  "web-development": [{ id: "javascript", title: "JavaScript", reason: "Interaktionen und Logik systematisch lernen" }, { id: "typescript", title: "TypeScript", reason: "Webanwendungen mit Typen absichern" }, { id: "backend", title: "Backendentwicklung", reason: "Frontend mit APIs und Daten verbinden" }],
  backend: [{ id: "javascript", title: "JavaScript", reason: "Die Sprache hinter Node.js festigen" }, { id: "sql", title: "SQL", reason: "Abfragen, Constraints und Transaktionen üben" }, { id: "security", title: "IT-Sicherheit", reason: "API-Schutz und Bedrohungsmodellierung vertiefen" }],
  security: [{ id: "backend", title: "Backendentwicklung", reason: "Sichere Regeln in API und Datenbank umsetzen" }, { id: "web-development", title: "Webentwicklung", reason: "Browserrisiken wie XSS praktisch nachvollziehen" }, { id: "career", title: "Auf dem Weg zum Job", reason: "Sicherheitsarbeit verständlich dokumentieren" }],
  ai: [{ id: "python", title: "Python", reason: "Modelle mit der Programmiersprache umsetzen" }, { id: "sql", title: "SQL", reason: "Datensätze speichern, abfragen und prüfen" }, { id: "security", title: "IT-Sicherheit", reason: "Datenschutz und Modellrisiken einordnen" }],
  "game-development": [{ id: "csharp", title: "C#", reason: "Unity-Skripte und Spielzustände programmieren" }, { id: "javascript", title: "JavaScript", reason: "Kleine browserbasierte Spiele umsetzen" }],
  career: [{ id: "javascript", title: "JavaScript", reason: "Ein Portfolio-Projekt mit Code vertiefen" }, { id: "python", title: "Python", reason: "Ein zweites Projekt samt Tests aufbauen" }, { id: "security", title: "IT-Sicherheit", reason: "Sicherheitsentscheidungen im Portfolio belegen" }],
};

// Official documentation for the tools actually practiced in each course.
const courseResources: Record<string, { label: string; url: string }[]> = {
  javascript: [{ label: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }, { label: "React: Erste Schritte", url: "https://react.dev/learn" }, { label: "Node.js lernen", url: "https://nodejs.org/en/learn" }],
  java: [{ label: "Java Tutorials", url: "https://dev.java/learn/" }, { label: "JUnit 5 User Guide", url: "https://junit.org/junit5/docs/current/user-guide/" }, { label: "Spring Boot Referenz", url: "https://docs.spring.io/spring-boot/reference/" }],
  python: [{ label: "Python-Tutorial", url: "https://docs.python.org/3/tutorial/" }, { label: "pytest Einstieg", url: "https://docs.pytest.org/en/stable/getting-started.html" }, { label: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" }],
  php: [{ label: "PHP-Handbuch", url: "https://www.php.net/manual/en/" }, { label: "Laravel Dokumentation", url: "https://laravel.com/docs" }, { label: "PHPUnit Handbuch", url: "https://docs.phpunit.de/en/" }],
  typescript: [{ label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" }, { label: "React mit TypeScript", url: "https://react.dev/learn/typescript" }, { label: "Node.js lernen", url: "https://nodejs.org/en/learn" }],
  cpp: [{ label: "C++ Referenz", url: "https://en.cppreference.com/w/" }, { label: "CMake Tutorial", url: "https://cmake.org/cmake/help/latest/guide/tutorial/index.html" }],
  csharp: [{ label: "C#-Lernpfad", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" }, { label: "ASP.NET Core", url: "https://learn.microsoft.com/en-us/aspnet/core/" }, { label: "Unity Learn", url: "https://learn.unity.com/" }],
  rust: [{ label: "The Rust Book", url: "https://doc.rust-lang.org/book/" }, { label: "Cargo Book", url: "https://doc.rust-lang.org/cargo/" }, { label: "Axum Dokumentation", url: "https://docs.rs/axum/latest/axum/" }],
  sql: [{ label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }, { label: "SQLAlchemy Unified Tutorial", url: "https://docs.sqlalchemy.org/en/20/tutorial/" }],
  c: [{ label: "C Sprachreferenz", url: "https://en.cppreference.com/w/c" }, { label: "GCC Handbuch", url: "https://gcc.gnu.org/onlinedocs/" }],
  kotlin: [{ label: "Kotlin Docs", url: "https://kotlinlang.org/docs/home.html" }, { label: "Android mit Compose", url: "https://developer.android.com/develop/ui/compose" }, { label: "Ktor Server", url: "https://ktor.io/docs/server-create-a-new-project.html" }],
  swift: [{ label: "The Swift Programming Language", url: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/" }, { label: "SwiftUI Tutorials", url: "https://developer.apple.com/tutorials/swiftui" }],
  "web-development": [{ label: "MDN Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development" }, { label: "React: Erste Schritte", url: "https://react.dev/learn" }, { label: "Vite Guide", url: "https://vite.dev/guide/" }],
  backend: [{ label: "Node.js lernen", url: "https://nodejs.org/en/learn" }, { label: "Fastify Einstieg", url: "https://fastify.dev/docs/latest/Guides/Getting-Started/" }, { label: "Node.js Test Runner", url: "https://nodejs.org/api/test.html" }, { label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" }],
  security: [{ label: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/" }, { label: "OWASP Cheat Sheet Series", url: "https://cheatsheetseries.owasp.org/" }],
  ai: [{ label: "scikit-learn Einstieg", url: "https://scikit-learn.org/stable/getting_started.html" }, { label: "PyTorch Tutorials", url: "https://pytorch.org/tutorials/" }, { label: "Python-Tutorial", url: "https://docs.python.org/3/tutorial/" }],
  "game-development": [{ label: "Godot Dokumentation", url: "https://docs.godotengine.org/en/stable/getting_started/introduction/index.html" }, { label: "Unity Learn", url: "https://learn.unity.com/" }],
  career: [{ label: "Git Book", url: "https://git-scm.com/book/en/v2" }, { label: "GitHub Skills", url: "https://skills.github.com/" }],
};

function addRetrievalPractice(lessons: CourseLesson[]): CourseLesson[] {
  return lessons.map((lesson, index) => {
    const previous = lessons[index - 1];
    return {
      ...lesson,
      retrievalPrompt: previous
        ? `Ohne zurückzublättern: Was erinnerst du zu „${previous.title}“? Nenne zuerst eine Regel und versuche dann ein eigenes kleines Beispiel.`
        : `Bevor du startest: Was weißt du schon über „${lesson.title}“? Notiere eine Vermutung oder eine Frage.`,
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
