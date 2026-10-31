import type { DevPathState } from "./types";
import { learningCourses } from "./course";

export type CatalogCourse = { id: string; title: string; description: string; category: string; icon: string; status: "available" | "planned"; tags: string[]; lessonCount?: number };

const descriptions: Record<string, string> = {
  "programming-intro": "Ohne Vorkenntnisse starten: verstehen, was Programmierung ist, passende Sprachen wählen und erst danach den ersten Code schreiben.",
  javascript: "Daten, Funktionen und Browser-Interaktionen für dynamische Anwendungen verbinden.", java: "Typen, Klassen und objektorientierte Grundlagen mit kleinen Programmen üben.", python: "Lesbare Programme, Funktionen und Sammlungen für Automatisierung und Daten lernen.", php: "Serverseitige Logik, Formulare und sichere Webantworten verstehen.", typescript: "JavaScript mit Typen, Schnittstellen und überprüfbaren Datenstrukturen absichern.", cpp: "C++-Grundlagen, Funktionen, Standardbibliothek und Systemnähe kennenlernen.", csharp: ".NET-Grundlagen, Typen, Methoden und praktische Anwendungen entwickeln.", rust: "Ownership, Typen und Cargo als Basis sicherer Rust-Programme verstehen.", sql: "Daten auswählen, filtern, gruppieren und relational sauber modellieren.", c: "Kontrollfluss, Funktionen und systemnahe Grundlagen verständlich erarbeiten.", kotlin: "Kompakte JVM-Syntax, Null-Sicherheit und Collections praktisch einsetzen.", swift: "Typen, Funktionen, Collections und moderne Swift-Werkzeuge kennenlernen.", gdscript: "Godots Skriptsprache von den ersten Werten bis zu eigenen Spielregeln verstehen.",
  "web-development": "Frontend planen und bauen: HTML, CSS, JavaScript, TypeScript, zugängliche Oberflächen, React, Vue, Angular und eigene Website-Projekte.", backend: "Das Modell hinter Servern verstehen und APIs mit Express, Fastify, Spring Boot, Datenbank, Validierung und Zugriffsschutz programmieren.", security: "Hackermethoden und Schwachstellen in erlaubten Laboren untersuchen; Firewalls und Abwehr praktisch prüfen.", ai: "Machine Learning von Daten und Training bis Modellbewertung, scikit-learn, PyTorch und eigenem Projekt verstehen.", "game-development": "Spielregeln, Bewegung und Kollision programmieren; Godot und Unity kennenlernen und ein erstes Spiel bauen.", career: "Zielrolle finden, Fähigkeiten belegen, ein Portfolio-Projekt zeigen und Bewerbungsgespräche praktisch üben.",
};
export const courseCatalog: CatalogCourse[] = learningCourses.map((course, index) => ({
  id: course.id, title: course.title, description: descriptions[course.id] ?? `Lerne ${course.title} mit verständlichen Erklärungen und praktischen Beispielen.`,
  category: course.category, icon: String(index + 1).padStart(2, "0"), status: "available", lessonCount: course.lessons.length, tags: [course.title, course.category, ...course.lessons.map((lesson) => lesson.language)],
}));

export function recommendedCourse(state: DevPathState): CatalogCourse {
  const intro = courseCatalog.find((course) => course.id === "programming-intro") ?? courseCatalog[0];
  const goal = state.goal.toLowerCase();
  const match = goal.includes("grund") && state.experience === "new" ? "programming-intro"
    : goal.includes("web") ? "web-development"
      : goal.includes("server") || goal.includes("backend") || goal.includes("api") ? "backend"
      : goal.includes("beruf") || goal.includes("job") ? "career"
        : goal.includes("ki") || goal.includes("künstliche") ? "ai"
          : goal.includes("sicher") ? "security"
            : goal.includes("spiel") ? "game-development"
              : goal.includes("software") ? (state.experience === "experienced" ? "typescript" : "javascript")
                : state.experience === "new" ? "programming-intro" : "python";
  const candidate = courseCatalog.find((course) => course.id === match);
  return candidate ?? intro;
}
