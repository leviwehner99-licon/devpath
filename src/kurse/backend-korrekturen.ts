import type { LessonBlueprint } from "./course-curriculum";

const example = (title: string, code: string, note: string, language = "javascript") => ({ title, code, note, language });
const changes: Record<string, Partial<LessonBlueprint>> = {
  "api-model": {
    explanation: "Ein Server ist ein laufendes Programm, das auf Anfragen wartet. Eine API legt fest, welche Anfragen erlaubt sind und welche Antworten zurückkommen. HTTP nutzt Methoden wie GET zum Lesen und POST zum Anlegen. JSON transportiert Daten. Node.js führt JavaScript auf dem Server aus; Express verbindet URLs und HTTP-Methoden mit eigenen Funktionen. Die Regeln hinter einer API musst du selbst entwickeln und testen.",
  },
  tests: {
    explanation: "Unit-Tests prüfen Geschäftsregeln; Integrationstests prüfen den Weg durch Route und Datenbank. OpenAPI beschreibt eine HTTP-Schnittstelle maschinenlesbar. Express ist ein Node.js-Framework für Routen und Middleware. Spring Boot erfüllt diese Aufgabe im Java-Ökosystem. REST ist ein Architekturstil, kein Framework.",
    task: "Beschreibe für deine Express-API einen Erfolgs- und Fehlerfall und dokumentiere Methode, Pfad, Status und Antwort.",
  },
  "express-setup": {
    module: "05 · Express von Grund auf",
    title: "Node.js und Express installieren und eine API starten",
    objective: "Du richtest ein Node-Projekt ein, startest Express und prüfst zwei echte HTTP-Antworten.",
    explanation: "Node.js ist die Laufzeit für JavaScript auf dem Server. npm verwaltet die Pakete eines Projekts. Express ist eine Bibliothek, die HTTP-Anfragen an deine Routen weitergibt. Starte zuerst eine GET-Route für den Zustand des Servers und danach eine POST-Route mit geprüfter JSON-Eingabe. Das Framework erledigt Routing und das Einlesen von JSON; die fachliche Prüfung des Titels bleibt deine Aufgabe.",
    task: "Installiere Node.js und Express nach der Checkliste. Starte GET /health und POST /tasks; prüfe Status 200, 201 und 400 mit echten Anfragen.",
    projectSteps: ["Node.js und npm-Version prüfen.", "Eigenes Projekt mit package.json und Express anlegen.", "server.js aus dem Beispiel schreiben und lokal starten.", "GET und POST mit gültiger und ungültiger Eingabe testen."],
  },
  "node-fastify-api": {
    id: "node-express-api",
    module: "05 · Express-API bauen",
    title: "GET-Routen, Parameter und Fehlerfälle mit Express",
    objective: "Du programmierst eine Detailroute mit klaren Antworten für gültige, ungültige und fehlende IDs.",
    explanation: "Express ruft den Handler einer passenden Route auf. req.params enthält Werte aus dem URL-Pfad zunächst als Text. Wandle die ID bewusst in eine positive ganze Zahl um. Eine ungültige ID erhält 400, eine nicht vorhandene 404 und ein vorhandener Kurs 200 mit JSON. Ein Test ruft alle drei Fälle über HTTP auf und vergleicht Status und Inhalt.",
    examples: [example("Drei Fälle", "app.get('/courses/:id', (req, res) => {\n  const id = Number(req.params.id);\n  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'invalid_id' });\n  const course = courses.find(item => item.id === id);\n  if (!course) return res.status(404).json({ error: 'not_found' });\n  return res.status(200).json(course);\n});", "Die ID wird vor der Suche geprüft; Fehler und Erfolg bleiben unterscheidbar.")],
    starterCode: "app.get('/courses/:id', (req, res) => {\n  // ID prüfen, Kurs suchen und passenden Status senden\n});\n",
    task: "Ergänze GET /courses/:id in deiner Express-App und prüfe 400, 404 und 200 mit je einer HTTP-Anfrage.",
    successPattern: /app\.get\s*\(|req\.params\.id|res\.status\s*\(/i,
    projectSteps: ["Route in der vorhandenen Express-App registrieren.", "ID als Zahl und Grenzwert prüfen.", "Kurs aus Testdaten suchen.", "Drei Statusfälle mit fetch oder curl prüfen."],
    acceptanceCriteria: ["Ungültige ID liefert 400.", "Nicht vorhandener Kurs liefert 404.", "Erfolg liefert 200 und nur öffentliche Daten.", "Die drei Fälle sind wirklich aufgerufen worden."],
  },
  "backend-architecture": {
    explanation: "Die Express-Route kennt HTTP, die Fachfunktion kennt die Regel, das Repository kennt SQL. Prüfe die Nutzerkennung serverseitig und gib nur eigene Aufgaben zurück. Nutze Parameter statt zusammengesetzter SQL-Strings. Teste dieselbe Fachregel ohne Server, dann den HTTP-Vertrag mit einem lokalen Testserver und schließlich die Datenbankabfrage mit Testdaten.",
  },
  "framework-choice": {
    title: "Express und Spring Boot sinnvoll einordnen",
    objective: "Du wählst für Node.js und Java einen passenden Serveraufbau und begründest die Wahl.",
    explanation: "Express verbindet Node.js-Anfragen mit Funktionen und lässt die Projektstruktur bewusst offen. Spring Boot liefert im Java-Ökosystem zusätzlich Konfiguration und viele integrierte Bausteine. In diesem Kurs baust du den Hauptserver mit Node.js und Express. Die Spring-Lektionen zeigen dieselbe Grundidee in Java. Vergleiche Laufzeit, Teamkenntnisse, Datenzugriff und Betrieb statt nur Namen von Frameworks.",
    starterCode: "Projektziel: \nNode.js + Express passt, weil: \nSpring Boot wäre sinnvoll, wenn: \n",
    task: "Begründe Express für deine Aufgaben-API und nenne einen Fall, in dem ein Java-Team Spring Boot wählen würde.",
    successPattern: /Express|Spring Boot/i,
  },
  "server-from-zero": {
    title: "Einen Express-Server in App und Startdatei aufteilen",
    objective: "Du trennst Routen von dem Aufruf, der einen lokalen Netzwerkport öffnet.",
    explanation: "Eine Express-App registriert Routen und Middleware. Erst app.listen öffnet einen Port. Wenn App-Erstellung und Start in getrennten Dateien stehen, kannst du die App in Tests verwenden, ohne beim Import sofort einen Port zu belegen. Starte lokal an 127.0.0.1 und prüfe GET /health sowie einen unbekannten Pfad.",
    examples: [example("app.js", "import express from 'express';\nexport const app = express();\napp.use(express.json());\napp.get('/health', (_req, res) => res.json({ status: 'ok' }));", "Die App wird exportiert, ohne beim Import einen Port zu öffnen."), example("server.js", "import { app } from './app.js';\napp.listen(3000, '127.0.0.1', () => console.log('API bereit'));", "Nur diese Datei startet den lokalen HTTP-Server.")],
    starterCode: "import express from 'express';\nconst app = express();\n// Health-Route und lokalen Start ergänzen\n",
    task: "Trenne app.js und server.js, starte lokal und prüfe 200 für /health sowie 404 für einen unbekannten Pfad.",
    successPattern: /app\.get\s*\(|app\.listen\s*\(|127\.0\.0\.1/i,
  },
  "node-postgres-api": {
    examples: [example("Parametrisierte Abfrage", "const result = await pool.query(\n  'SELECT id, title FROM courses WHERE id = $1',\n  [courseId]\n);", "Der Wert bleibt Dateninhalt und kann die SQL-Struktur nicht verändern."), example("Kontrollierte HTTP-Fehler", "try {\n  const course = await repository.findCourse(courseId);\n  if (!course) return res.status(404).json({ error: 'not_found' });\n  return res.json(course);\n} catch (error) {\n  console.error('course lookup failed', error);\n  return res.status(503).json({ error: 'temporarily_unavailable' });\n}", "Die Antwort verrät keine internen Datenbankdetails.")],
  },
  "spring-api": {
    explanation: "Erstelle im Paket der Startklasse einen @RestController. @GetMapping verbindet eine URL mit einer Java-Methode; Spring wandelt das zurückgegebene Objekt in JSON um. Starte den Dienst und rufe /health auf. Ergänze dann einen Query-Parameter mit @RequestParam und prüfe Standardwert und eigenen Wert. Vergleiche dieselbe Fachfunktion in Express und Spring Boot: Route, Eingabe, Antwort und Startvorgang.",
    task: "Implementiere GET /health und eine Route mit @RequestParam; prüfe beide Antworten und erkläre den Unterschied zur Express-Route.",
  },
  project: {
    explanation: "Baue GET /tasks, POST /tasks und PATCH /tasks/:id mit Node.js und Express. Prüfe Eingaben und Rechte vor Datenbankzugriff, nutze parametrisierte SQL-Abfragen und trenne HTTP-Routen von Geschäftsregeln. Teste Erfolg, ungültige Daten, fehlende Aufgaben und fremden Zugriff. Dokumentiere den API-Vertrag, Startbefehl, Migration und Rücknahme.",
    starterCode: "import express from 'express';\nconst app = express();\napp.use(express.json());\n// GET, POST und PATCH mit getrennten Regeln ergänzen\n",
    successPattern: /app\.get|app\.post|pool\.query/i,
  },
};

export function modernizeBackend(track: LessonBlueprint[]): LessonBlueprint[] {
  const removed = new Set(["fastify-setup", "fastify-schema"]);
  return track.filter((lesson) => !removed.has(lesson.id)).map((lesson) => ({ ...lesson, ...(changes[lesson.id] ?? {}) }));
}
