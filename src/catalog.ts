import type { DevPathState } from "./types";

export type CatalogCourse = { id: string; title: string; description: string; category: string; icon: string; status: "available" | "planned"; tags: string[] };

export const courseCatalog: CatalogCourse[] = [
  { id: "programming-intro", title: "Einstieg in die Programmierung", description: "Ein Grundlagenkurs zu Algorithmen, Variablen, Bedingungen und Wiederholungen. Lektionen werden vorbereitet.", category: "Programmiersprache", icon: "01", status: "planned", tags: ["Anfänger", "Grundlagen", "Programmierung"] },
  { id: "pilot-html-css", title: "HTML & CSS: Erste responsive Webseite", description: "Baue Schritt für Schritt eine zugängliche, responsive Infoseite.", category: "Web", icon: "</>", status: "available", tags: ["HTML", "CSS", "Webentwicklung"] },
  ...[
    ["html", "HTML", "Semantische Dokumente, Formulare und barrierefreie Seiten strukturieren.", "HTML"], ["css", "CSS", "Layouts, responsive Oberflächen, Typografie und Animationen gestalten.", "CSS"], ["javascript", "JavaScript", "Interaktive Webseiten und die Grundlagen moderner Webanwendungen.", "JS"], ["java", "Java", "Objektorientierte Programme mit einer vielseitigen Sprache entwickeln.", "Ja"], ["python", "Python", "Ein klarer Einstieg in Programmierung, Automatisierung und Daten.", "Py"], ["php", "PHP", "Dynamische Webanwendungen und serverseitige Logik verstehen.", "PHP"], ["typescript", "TypeScript", "JavaScript-Projekte mit statischen Typen sicherer gestalten.", "TS"], ["cpp", "C++", "Leistungsfähige Programme und zentrale Systemkonzepte kennenlernen.", "C++"], ["csharp", "C#", "Moderne Anwendungen und Spiele im .NET-Ökosystem entwickeln.", "C#"], ["rust", "Rust", "Speichersichere Programme mit Ownership und klaren Typen erstellen.", "Rs"], ["sql", "SQL", "Relationale Daten abfragen, verändern und strukturiert modellieren.", "SQL"], ["c", "C", "Grundlagen von Speicher, Datenstrukturen und systemnaher Entwicklung.", "C"], ["kotlin", "Kotlin", "Ausdrucksstarke Anwendungen für JVM und Android schreiben.", "Kt"], ["swift", "Swift", "Moderne Apps und Programme mit Apples Sprache entwickeln.", "Sw"],
    ["web-development", "Webentwicklung", "Von Layout und Browser bis zu modernen Webprojekten.", "Web"], ["backend", "Backendentwicklung", "APIs, Serverlogik, Datenbanken und sichere Schnittstellen.", "API"], ["security", "IT-Sicherheit", "Sichere Grundlagen, Bedrohungsmodelle und defensive Praxis.", "Sec"], ["ai", "Künstliche Intelligenz", "KI-Grundlagen, Daten, Modelle und verantwortungsvolle Anwendungen.", "AI"], ["game-development", "Spieleentwicklung", "Spielschleifen, Eingaben, Grafik und Projektaufbau.", "Game"], ["career", "Auf dem Weg zum Job", "Portfolio, Zusammenarbeit, Bewerbungen und technische Interviews.", "Job"],
  ].map(([id, title, description, icon]) => ({ id, title, description, category: ["html", "css", "javascript", "java", "python", "php", "typescript", "cpp", "csharp", "rust", "sql", "c", "kotlin", "swift"].includes(id) ? "Programmiersprache" : "Themenkurs", icon, status: "planned" as const, tags: [title] })),
];

export function recommendedCourse(state: DevPathState): CatalogCourse {
  const pilot = courseCatalog.find((course) => course.id === "pilot-html-css") ?? courseCatalog[0];
  if (!state.courseCompletedAt) return pilot;
  const goal = state.goal.toLowerCase();
  const match = goal.includes("grund") ? "python" : goal.includes("web") ? "javascript" : goal.includes("software") ? (state.experience === "experienced" ? "typescript" : "java") : "web-development";
  const candidate = courseCatalog.find((course) => course.id === match && course.status === "available");
  return candidate ?? pilot;
}
