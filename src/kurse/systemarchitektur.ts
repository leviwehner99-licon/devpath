import type { CourseLesson } from "./course";

type Diagram = NonNullable<CourseLesson["systemDiagram"]>;
const diagrams: Record<string, Diagram> = {
  "web-development": {
    title: "So arbeitet ein Frontend",
    diagram: "Nutzeraktion\n    ↓\nHTML-Struktur + CSS-Gestaltung\n    ↓\nJavaScript/TypeScript ändert den Seitenzustand\n    ↓\nBrowser zeigt Treffer, Laden oder Fehler\n    ↕  optional: HTTP-Anfrage an eine bestehende API",
    note: "Der Browser baut die sichtbare Seite. Eine vorhandene API kann Daten liefern; die Serverlogik entsteht im Backendkurs.",
  },
  backend: {
    title: "Weg einer Serveranfrage",
    diagram: "Browser oder App → HTTP-Anfrage\n                     ↓\n                  Route → Eingabe prüfen → Rechte prüfen\n                                             ↓\n                                        Geschäftsregel\n                                             ↓\n                                         Datenbank\n                                             ↓\nClient ← Status + Antwortdaten ← Server",
    note: "Eine Route nimmt die Anfrage an. Die Geschäftsregel entscheidet, was fachlich erlaubt ist; die Datenbank speichert den Zustand.",
  },
  ai: {
    title: "Weg vom Datensatz zum nutzbaren Modell",
    diagram: "Freigegebene Daten → Bereinigung → Training / Validierung / Test\n                                    ↓\n                          Baseline → Modelltraining\n                                    ↓\n                          Fehleranalyse + Freigabe\n                                    ↓\n                       API → Vorhersage → Rückmeldung",
    note: "Training verändert das Modell. Der zurückgehaltene Test bewertet es; die API stellt nur eine geprüfte Version bereit.",
  },
  "game-development": {
    title: "Was in jedem Spielschritt passiert",
    diagram: "Spieler-Eingabe → Spielregeln → neuer Zustand\n       ↑                            ↓\n       └── nächster Schritt ← Darstellung + Ton\n                 ↕\n          Engine: Szenen, Zeit, Physik, Ressourcen",
    note: "Die Engine liefert Bausteine. Deine Regeln bestimmen, wie Eingaben den Spielzustand verändern und wann Sieg oder Verlust eintritt.",
  },
  security: {
    title: "Sicherheit entlang des Datenflusses",
    diagram: "Eingabe → Browser → Server → Datenbank\n             ↓          ↓          ↓\n       sichere Ausgabe  Rechte   Parameter\n             └────── Tests + Protokolle ──────┘",
    note: "Jede Grenze braucht eine passende Prüfung. Firewall, Zugriffskontrolle und sichere Verarbeitung schützen unterschiedliche Teile.",
  },
  career: {
    title: "Eine Arbeitsprobe nachvollziehbar machen",
    diagram: "Nutzerproblem → kleine Aufgabe → Umsetzung\n                                  ↓\n                           Test + Review\n                                  ↓\n                     Demo + Entscheidung + Grenze",
    note: "Ein Portfolio zeigt Arbeitsweise und überprüfbare Ergebnisse statt eine bloße Werkzeugliste.",
  },
};

const correctedWeb: Record<string, Partial<CourseLesson>> = {
  "web-development-html": {
    explanation: "HTML ist die Auszeichnungssprache für Bedeutung und Struktur einer Seite. Ein vollständiges Dokument beginnt mit <!doctype html>, enthält ein <html>-Wurzelelement und trennt Angaben im <head> vom sichtbaren Inhalt im <body>. <nav> markiert Navigation, <main> den Hauptinhalt und <article> einen eigenständigen Beitrag. Öffnende und schließende Tags müssen zusammenpassen; Elemente wie <meta> haben keinen schließenden Tag.",
    examples: [
      { title: "Vollständige index.html", language: "html", code: "<!doctype html>\n<html lang=\"de\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <title>Kursfinder</title>\n  </head>\n  <body>\n    <nav aria-label=\"Hauptnavigation\"><a href=\"/kurse\">Kurse</a></nav>\n    <main>\n      <article>\n        <h1>Kursfinder</h1>\n        <p>Finde ein passendes Thema.</p>\n      </article>\n    </main>\n  </body>\n</html>", note: "Alle sichtbaren Elemente stehen im body. nav, main und article haben jeweils eine andere Aufgabe." },
      { title: "Link und Aktion", language: "html", code: "<a href=\"/kurse\">Kurse ansehen</a>\n<button type=\"button\">Suche zurücksetzen</button>", note: "Ein Link wechselt zu einer Adresse; ein Button löst eine Aktion auf derselben Seite aus." },
    ],
    starterCode: "<!doctype html>\n<html lang=\"de\">\n  <head><meta charset=\"utf-8\"><title>Mein Projekt</title></head>\n  <body>\n    <!-- Navigation und Hauptinhalt ergänzen -->\n  </body>\n</html>\n",
    task: "Ergänze in einer vollständigen index.html eine Navigation mit Link sowie einen main-Bereich mit Artikel und Überschrift.",
    successPattern: /<nav\b[\s\S]*<a\b[\s\S]*<\/nav>[\s\S]*<main\b[\s\S]*<article\b[\s\S]*<\/article>[\s\S]*<\/main>/i,
    resources: [{ label: "MDN: Aufbau einer HTML-Seite", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content" }],
  },
  "web-development-forms": {
    examples: [
      { title: "Vollständiges Suchformular", language: "html", code: "<form role=\"search\">\n  <label for=\"course-search\">Kurse suchen</label>\n  <input id=\"course-search\" name=\"q\" type=\"search\">\n  <button type=\"submit\">Suchen</button>\n</form>", note: "Das for-Attribut verweist exakt auf die id des Eingabefelds. Der Button hat eine eindeutige Aufgabe." },
      { title: "Fehler mit Feld verbinden", language: "html", code: "<label for=\"email\">E-Mail-Adresse</label>\n<input id=\"email\" name=\"email\" type=\"email\" aria-describedby=\"email-error\">\n<p id=\"email-error\">Bitte gib eine gültige E-Mail-Adresse ein.</p>", note: "Die Fehlermeldung ist für das Eingabefeld beschrieben und als Text sichtbar." },
    ],
    task: "Baue ein Formular mit beschrifteten Feldern für E-Mail und Nachricht sowie einem Absenden-Button. Verbinde jedes label-for mit der passenden id.",
    resources: [{ label: "MDN: Formular und Label", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms" }],
  },
  "web-development-combine-frontend": {
    explanation: "Drei Dateien bilden ein kleines Frontend: index.html enthält die Struktur, styles.css die Gestaltung und app.js das Verhalten. Das link-Element lädt die CSS-Datei im head. Ein script mit type=\"module\" lädt app.js; Module werden nach dem Einlesen des HTML-Dokuments ausgeführt. JavaScript liest das Suchfeld, filtert vorhandene Kursdaten und zeigt auch einen Leerzustand.",
    examples: [
      { title: "index.html", language: "html", code: "<!doctype html>\n<html lang=\"de\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Kursfinder</title>\n  <link rel=\"stylesheet\" href=\"styles.css\">\n  <script type=\"module\" src=\"app.js\"></script>\n</head>\n<body>\n  <main>\n    <h1>Kursfinder</h1>\n    <label for=\"search\">Kurse suchen</label>\n    <input id=\"search\" type=\"search\">\n    <p id=\"result\" role=\"status\"></p>\n  </main>\n</body>\n</html>", note: "Die Datei lädt CSS und JavaScript über getrennte, korrekt geschlossene HTML-Elemente." },
      { title: "styles.css", language: "css", code: "body { font-family: system-ui; margin: 2rem; }\nmain { max-width: 42rem; margin-inline: auto; }", note: "CSS verändert nur die Gestaltung; es enthält keine HTML-Tags." },
      { title: "app.js", language: "javascript", code: "const courses = ['Webentwicklung', 'Spieleentwicklung'];\nconst search = document.querySelector('#search');\nconst result = document.querySelector('#result');\nsearch?.addEventListener('input', () => {\n  const matches = courses.filter(title => title.toLowerCase().includes(search.value.toLowerCase()));\n  if (result) result.textContent = matches.length ? matches.join(', ') : 'Keine Kurse gefunden';\n});", note: "JavaScript liest die Eingabe und schreibt das Ergebnis als Text in die Seite." },
    ],
    starterCode: "<!doctype html>\n<html lang=\"de\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>Kursfinder</title>\n  <!-- CSS und JavaScript einbinden -->\n</head>\n<body>\n  <main><label for=\"search\">Kurse suchen</label><input id=\"search\"></main>\n</body>\n</html>\n",
    task: "Lege im Code Studio index.html, styles.css und app.js an. Verbinde CSS und JavaScript in index.html und prüfe Suche sowie Leerzustand im Browser. Trage hier deine index.html ein.",
    successPattern: /<link\b[^>]*rel=["']stylesheet["'][^>]*>[\s\S]*<script\b[^>]*type=["']module["'][^>]*src=["']app\.js["'][^>]*><\/script>/i,
    resources: [{ label: "MDN: Script-Element und Module", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script" }],
  },
  "web-development-frameworks": {
    title: "React-Komponenten im eingerichteten Projekt",
    objective: "Du baust eine kleine Kurskarte im bereits eingerichteten React-Projekt und prüfst ihre Darstellung.",
    explanation: "React ergänzt JavaScript um wiederverwendbare Oberflächenteile. Eine Komponente erhält Werte von außen und beschreibt, was der Browser anzeigen soll. Nach der Vite-Einrichtung schreibst du eine Kurskarte in einer .tsx-Datei, bindest sie in App.tsx ein und prüfst den sichtbaren Titel. HTML-Struktur und CSS bleiben weiterhin wichtig.",
    language: "typescript",
    examples: [{ title: "CourseCard.tsx", language: "typescript", code: "type Props = { title: string };\nexport function CourseCard({ title }: Props) {\n  return <article><h2>{title}</h2></article>;\n}", note: "Die Komponente bekommt einen Titel und erzeugt einen Artikel mit Überschrift." }],
    starterCode: "type Props = { title: string };\n\nexport function CourseCard({ title }: Props) {\n  // Gib eine Kurskarte zurück\n}\n",
    task: "Ergänze in CourseCard.tsx eine article-Karte mit h2. Binde sie in App.tsx ein und prüfe den sichtbaren Kurstitel im Browser.",
    successPattern: /<article\b[\s\S]*<h2>[\s\S]*\{title\}[\s\S]*<\/h2>[\s\S]*<\/article>/i,
    resources: [{ label: "React: Komponenten schreiben", url: "https://react.dev/learn/your-first-component" }],
  },
  "web-development-react-state": {
    explanation: "State ist ein Wert, dessen Änderung React zu einer neuen Darstellung veranlasst. Die Eingabe schreibt den Suchtext in State. Aus Suchtext und Kursliste berechnet die Komponente bei jeder Änderung die sichtbaren Treffer; eine zweite veränderliche Trefferliste ist nicht nötig. Prüfe passende Suche, keine Treffer und leere Eingabe im laufenden Vite-Projekt.",
    examples: [{ title: "App.tsx: vollständige kleine Suche", language: "typescript", code: "import { useState } from 'react';\n\nconst courses = ['Webentwicklung', 'Spieleentwicklung', 'Python'];\n\nexport default function App() {\n  const [query, setQuery] = useState('');\n  const visible = courses.filter(title =>\n    title.toLowerCase().includes(query.trim().toLowerCase())\n  );\n  return <main>\n    <h1>Kursfinder</h1>\n    <label htmlFor=\"search\">Kurse suchen</label>\n    <input id=\"search\" value={query} onChange={event => setQuery(event.target.value)} />\n    {visible.length ? <ul>{visible.map(title => <li key={title}>{title}</li>)}</ul> : <p>Keine Kurse gefunden.</p>}\n  </main>;\n}", note: "In React heißt das Label-Attribut htmlFor. Im reinen HTML heißt es for; beide verbinden die Beschriftung mit dem Feld." }],
    task: "Baue die Suche im laufenden React-Projekt nach. Prüfe „Web“, einen unbekannten Begriff und eine leere Eingabe; erkläre, welcher State-Wert sich ändert.",
  },
  "web-development-project": {
    starterCode: "<!doctype html>\n<html lang=\"de\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Mein Kursfinder</title>\n  <!-- styles.css und app.js einbinden -->\n</head>\n<body>\n  <main>\n    <h1>Kursfinder</h1>\n    <!-- Suche und Kursliste ergänzen -->\n  </main>\n</body>\n</html>\n",
    task: "Baue im Code Studio index.html, styles.css und app.js für einen eigenen Kursfinder. Prüfe Suche, Leerzustand, Tastatur und schmale Ansicht. Trage hier die fertige index.html ein.",
    successPattern: /<!doctype html>[\s\S]*<html\b[\s\S]*<link\b[^>]*stylesheet[^>]*>[\s\S]*<script\b[^>]*app\.js[^>]*><\/script>[\s\S]*<main\b[\s\S]*<label\b[\s\S]*<\/main>[\s\S]*<\/html>/i,
  },
};

export function improveLesson(lesson: CourseLesson, courseId: string): CourseLesson {
  return {
    ...lesson,
    ...(correctedWeb[lesson.id] ?? {}),
    systemDiagram: lesson.systemDiagram ?? (lesson.id === `${courseId}-orientation` || lesson.id === `${courseId}-project` ? diagrams[courseId] : undefined),
  };
}
