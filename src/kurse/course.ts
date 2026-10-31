import { courseCurricula } from "./course-curriculum";
import { einstiegLektionen } from "./einstieg";
import { enrichLesson } from "./lernmaterial";
import { improveLesson } from "./systemarchitektur";

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
  previousLesson?: { title: string; reminder: string };
  definitions?: { term: string; meaning: string }[];
  setup?: { title: string; steps: { text: string; command?: string }[]; verify: string; source?: string };
  systemDiagram?: { title: string; diagram: string; note: string };
  languageGuide?: { field: string; technology: string; role: string }[];
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
  version: "5.2.0",
  title: "Einstieg in die Programmierung",
  category: "Programmiergrundlagen",
  lessons: einstiegLektionen,
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
  { id:"backend", title:"Backendentwicklung", category:"Themenkurs", language:"javascript", topic:"Eine API mit Datenbank entwerfen", framework:"Node.js, Express, PostgreSQL und Spring Boot", intro:"Das Backend prüft Anfragen, setzt Regeln durch und verwaltet Daten.", examples:["GET /api/courses → 200 + JSON","const course = await db.query('SELECT id, title FROM courses');","if (!user) return response.status(401);","Client → Route → Validierung → Datenbank → Antwort"] },
  { id:"security", title:"IT-Sicherheit", category:"Themenkurs", language:"javascript", topic:"Risiken erkennen und sicher abwehren", framework:"OWASP Top 10, STRIDE und Defense in Depth", intro:"Sicherheit beginnt mit Bedrohungsmodell, sicheren Standardwerten und Prüfung.", examples:["Asset → Bedrohung → Schwachstelle → Schutzmaßnahme","const safe = textContent; // Text statt ungeprüftem HTML","SELECT * FROM users WHERE id = $1; // gebundener Parameter","Änderung → Review → automatischer Scan → Freigabe"] },
  { id:"ai", title:"Künstliche Intelligenz", category:"Themenkurs", language:"python", topic:"KI-Systeme einschätzen und anwenden", framework:"scikit-learn, PyTorch und Retrieval-Augmented Generation", intro:"KI lernt Muster aus Daten; gute Nutzung verlangt Messung, Grenzen und Datenschutz.", examples:["Daten → Merkmale → Modell → Vorhersage → Prüfung","train_test_split(X, y, test_size=0.2)","Frage → relevante Dokumente → Kontext → Modellantwort","Messwert → Fehleranalyse → nächste Verbesserung"] },
  { id:"game-development", title:"Spieleentwicklung", category:"Themenkurs", language:"javascript", topic:"Ein Spiel von Prototyp bis Build entwickeln", framework:"Spielschleife, Godot und Unity praktisch", intro:"Spiele aktualisieren Zustand und Darstellung wiederholt und reagieren auf Eingaben.", examples:["Eingabe → Zustand aktualisieren → zeichnen","if (keys.left) player.x -= speed * delta;","player.x += velocity * delta;\\nvelocity.y += gravity * delta;","Idee → spielbarer Prototyp → Test → Feinschliff"] },
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
    const lessonLanguage = definition.id === "web-development" && blueprint.id === "frameworks" ? "typescript" : blueprint.language;
    const languageCourseId = blueprint.languageCourse?.id ?? (definition.id === "backend" && blueprint.id === "database" || definition.id === "security" && blueprint.id === "injection-lab" ? "sql" : ({ javascript: "javascript", typescript: "typescript", python: "python", sql: "sql", csharp: "csharp", java: "java", php: "php", gdscript: "gdscript" } as Record<string, string>)[lessonLanguage]);
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
  return { id: definition.id, version: definition.category === "Themenkurs" ? "5.3.0" : "5.2.0", title: definition.title, category: definition.category, lessons };
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

programmingCourse.lessons = addRetrievalPractice(programmingCourse.lessons).map((lesson, index, all) => enrichLesson(lesson, all[index - 1]));
export const learningCourses: LearningCourse[] = [programmingCourse, ...courseDefinitions.map((definition) => {
  const course = buildCourse(definition);
  const refined = addRetrievalPractice(course.lessons.map((lesson) => improveLesson(lesson, course.id)));
  course.lessons = refined.map((lesson, index) => enrichLesson(lesson, refined[index - 1]));
  return course;
})];
export function getLearningCourse(courseId: string): LearningCourse { return learningCourses.find((course) => course.id === courseId) ?? programmingCourse; }
