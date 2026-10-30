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
};

export type LearningCourse = { id: string; version: string; title: string; category: string; lessons: CourseLesson[] };

export const programmingCourse: LearningCourse = {
  id: "programming-intro",
  version: "1.0.0",
  title: "Einstieg in die Programmierung",
  category: "Programmiergrundlagen",
  lessons: [
    {
      id: "program-output", title: "Dein erstes Programm", objective: "Du kannst einen Wert mit JavaScript ausgeben.", duration: 10, language: "javascript",
      concepts: [{ tag: "console.log()", description: "Gibt einen Wert in der Entwicklerkonsole aus." }, { tag: "Anweisung", description: "Eine einzelne Anweisung beschreibt einen Arbeitsschritt." }],
      explanation: "Programme bestehen aus Anweisungen, die der Reihe nach ausgeführt werden. Mit console.log() kannst du einen Text oder Wert in der Konsole sichtbar machen.",
      starterCode: "// Gib eine Begrüßung aus\n",
      task: "Gib mit console.log() den Text Hallo CodeZone aus.", successPattern: /console\s*\.\s*log\s*\(\s*[\"'`]Hallo CodeZone[\"'`]\s*\)/i,
    },
    {
      id: "program-variables", title: "Werte in Variablen speichern", objective: "Du kannst einen Wert mit const oder let benennen und wiederverwenden.", duration: 15, language: "javascript",
      concepts: [{ tag: "const", description: "Legt einen Namen an, der nicht neu zugewiesen wird." }, { tag: "Variable", description: "Ein benannter Platz, über den ein Wert im Programm erreichbar ist." }],
      explanation: "Variablen machen Werte unter einem Namen verfügbar. Verwende const, wenn du den Namen nicht neu belegen musst. Eine aussagekräftige Bezeichnung hilft, den Code später zu verstehen.",
      starterCode: "// Speichere deinen Namen\n\nconsole.log(name);\n",
      task: "Lege eine Variable name mit deinem Namen an und gib sie aus.", successPattern: /(?:const|let)\s+name\s*=\s*[\"'`][^\"'`]+[\"'`][\s\S]*console\s*\.\s*log\s*\(\s*name\s*\)/i,
    },
    {
      id: "program-types", title: "Texte, Zahlen und Wahrheitswerte", objective: "Du erkennst die grundlegenden Datentypen und kannst sie verwenden.", duration: 15, language: "javascript",
      concepts: [{ tag: "string", description: "Text steht in Anführungszeichen." }, { tag: "number", description: "Zahlen können berechnet werden." }, { tag: "boolean", description: "true und false drücken eine Ja/Nein-Aussage aus." }],
      explanation: "JavaScript unterscheidet Werte wie Texte, Zahlen und Wahrheitswerte. Der Typ bestimmt, welche Operationen sinnvoll sind. Mit typeof kannst du den Typ eines Werts untersuchen.",
      starterCode: "const age = 18;\nconst learning = true;\n\n// Gib den Typ von age aus\n",
      task: "Gib mit typeof den Typ der Variable age aus.", successPattern: /console\s*\.\s*log\s*\(\s*typeof\s+age\s*\)/i,
    },
    {
      id: "program-conditions", title: "Entscheidungen mit Bedingungen", objective: "Du kannst mit if und else unterschiedliche Fälle behandeln.", duration: 20, language: "javascript",
      concepts: [{ tag: "if", description: "Führt einen Block aus, wenn die Bedingung wahr ist." }, { tag: "else", description: "Behandelt den anderen Fall." }],
      explanation: "Bedingungen lassen ein Programm abhängig von einem Wert entscheiden. Der Ausdruck in den Klammern wird geprüft; danach läuft der passende Codeblock.",
      starterCode: "const points = 12;\n\n// Prüfe, ob points mindestens 10 ist\n",
      task: "Ergänze eine if/else-Entscheidung für mindestens 10 Punkte.", successPattern: /if\s*\([^)]*points\s*>=\s*10[^)]*\)\s*\{[\s\S]*\}\s*else\s*\{[\s\S]*\}/i,
    },
    {
      id: "program-loops", title: "Wiederholungen mit Schleifen", objective: "Du kannst eine Schleife nutzen, um eine Aktion mehrfach auszuführen.", duration: 20, language: "javascript",
      concepts: [{ tag: "for", description: "Wiederholt Code mit einem Startwert, einer Bedingung und einer Änderung." }, { tag: "Iteration", description: "Ein einzelner Durchlauf einer Schleife." }],
      explanation: "Schleifen sparen Wiederholungen. Eine for-Schleife legt fest, wo sie startet, wann sie endet und wie sich der Zähler verändert.",
      starterCode: "// Gib die Zahlen von 1 bis 5 aus\n",
      task: "Schreibe eine for-Schleife, die i von 1 bis einschließlich 5 zählt.", successPattern: /for\s*\(\s*(?:let|var)\s+i\s*=\s*1\s*;\s*i\s*<=\s*5\s*;\s*i\s*(?:\+\+|\+=\s*1)\s*\)/i,
    },
    {
      id: "program-functions", title: "Eigene Funktionen schreiben", objective: "Du kannst eine Funktion mit einem Parameter definieren und aufrufen.", duration: 20, language: "javascript",
      concepts: [{ tag: "function", description: "Bündelt einen wiederverwendbaren Arbeitsschritt." }, { tag: "Parameter", description: "Übergibt einen Wert an die Funktion." }, { tag: "return", description: "Gibt ein Ergebnis zurück." }],
      explanation: "Funktionen machen wiederkehrende Arbeitsschritte wiederverwendbar. Parameter sind Eingaben, return liefert das berechnete Ergebnis zurück.",
      starterCode: "// Schreibe eine Funktion greet(name)\n\nconsole.log(greet(\"Ada\"));\n",
      task: "Schreibe greet(name), sodass die Funktion eine Begrüßung zurückgibt.", successPattern: /function\s+greet\s*\(\s*name\s*\)\s*\{[\s\S]*return\s+[^;]*name[^;]*;?[\s\S]*\}/i,
    },
    {
      id: "program-mini-project", title: "Mini-Projekt: Punkte auswerten", objective: "Du verbindest Variablen, Arrays, Schleifen und Funktionen in einem kleinen Programm.", duration: 30, language: "javascript",
      concepts: [{ tag: "Array", description: "Speichert mehrere Werte in einer geordneten Liste." }, { tag: "function", description: "Macht die Auswertung als Arbeitsschritt wiederverwendbar." }, { tag: "for...of", description: "Geht nacheinander durch die Werte einer Liste." }],
      explanation: "In kleinen Programmen wirken die Grundlagen zusammen: Daten liegen in einer Liste, eine Funktion wertet sie aus und eine Schleife verarbeitet jeden Eintrag.",
      starterCode: "const scores = [4, 7, 9];\n\nfunction sumScores(values) {\n  // Addiere alle Werte\n}\n\nconsole.log(sumScores(scores));\n",
      task: "Vervollständige sumScores mit einer for...of-Schleife und gib die Summe zurück.", successPattern: /function\s+sumScores\s*\(\s*values\s*\)\s*\{[\s\S]*for\s*\(\s*(?:const|let)\s+\w+\s+of\s+values\s*\)[\s\S]*return\s+\w+\s*;?[\s\S]*\}/i,
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

const lessonStages = [
  { id:"basics", title:"Bausteine und Ausgabe", objective:"Du erkennst die wichtigsten Bausteine und machst ein erstes Ergebnis sichtbar.", method:{title:"Beobachten → Ausprobieren",description:"Ändere zunächst einen Wert und beobachte genau, welche Ausgabe sich ändert."}, visual:["Eingabe","Anweisung","Ergebnis"] },
  { id:"decisions", title:"Daten und Entscheidungen", objective:"Du verarbeitest einen Wert und wählst abhängig davon einen passenden Fall.", method:{title:"Fallunterscheidung",description:"Schreibe erst die Fälle in Alltagssprache auf, dann bilde daraus Bedingungen."}, visual:["Wert prüfen","Bedingung","passender Fall"] },
  { id:"functions", title:"Wiederverwendbare Schritte", objective:"Du zerlegst eine Aufgabe in einen klar benannten Arbeitsschritt.", method:{title:"Kleine Funktionen",description:"Eine Funktion sollte eine Aufgabe haben, verständliche Eingaben erhalten und ein prüfbares Ergebnis liefern."}, visual:["Eingaben","Funktion","Rückgabe"] },
  { id:"project", title:"Werkzeug und Mini-Projekt", objective:"Du kombinierst die Grundlagen in einem kleinen, nachvollziehbaren Beispiel.", method:{title:"In kleinen Schleifen arbeiten",description:"Baue einen kleinen Schritt, probiere ihn aus, lies die Ausgabe und verbessere dann gezielt."}, visual:["Plan","Prototyp","Prüfen","Verbessern"] },
];

function buildCourse(definition: typeof courseDefinitions[number]): LearningCourse {
  return { id: definition.id, version:"1.0.0", title:definition.title, category:definition.category, lessons: lessonStages.map((stage, index) => {
    const exampleCode = definition.examples[index].replaceAll("\\n", "\n");
    const token = exampleCode.split(/\s+/).find((part) => /[A-Za-z_]{3,}/.test(part) && !["include", "return", "const", "function", "SELECT", "FROM", "WHERE"].includes(part)) ?? exampleCode.trim().split(" ")[0];
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return {
      id:`${definition.id}-${stage.id}`, title:stage.title, objective:stage.objective, duration:index === 3 ? 25 : 15, language:definition.id === "web-development" ? ["html", "css", "javascript", "html"][index] : definition.language,
      concepts:[{tag:definition.title,description:definition.intro},{tag:stage.method.title,description:stage.method.description}],
      explanation:`${definition.intro} ${stage.objective} Als Beispiel kannst du diesen Code lesen und danach selbst verändern. ${index === 3 ? "Am Ende prüfst du dein Ergebnis mit einem kleinen Test oder einer Vorschau." : "Verändere nur einen Teil auf einmal; so erkennst du Ursache und Wirkung."}`,
      starterCode:`// ${stage.title}: probiere den Beispielbaustein aus\n// Schreibe deinen eigenen Versuch hierhin\n`, exampleCode,
      task:`Übertrage den Kern aus dem Beispiel in deinen eigenen Code. Nutze dabei ${definition.topic.toLowerCase()} und prüfe, ob dein Ergebnis verständlich ist.`,
      successPattern:new RegExp(escaped,"i"), visualSteps:stage.visual,
      method:stage.method, framework:{title:definition.framework,description:`Einordnung: ${definition.framework} baut auf diesen Grundlagen auf. Lerne zuerst das Sprachkonzept; danach kannst du das Werkzeug passend zum Projekt einsetzen.`},
    };
  }) };
}

export const learningCourses: LearningCourse[] = [programmingCourse, ...courseDefinitions.map(buildCourse)];
export function getLearningCourse(courseId: string): LearningCourse { return learningCourses.find((course) => course.id === courseId) ?? programmingCourse; }
