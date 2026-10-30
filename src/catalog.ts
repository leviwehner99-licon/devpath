import type { DevPathState } from "./types";
import { learningCourses } from "./course";

export type CatalogCourse = { id: string; title: string; description: string; category: string; icon: string; status: "available" | "planned"; tags: string[]; lessonCount?: number };

const descriptions: Record<string, string> = {
  "programming-intro": "Ein anfängerfreundlicher Lernpfad mit Beispielen, kleinen Übungen, Wiederholungen und einem eigenen JavaScript-Projekt.",
  javascript: "Daten, Funktionen und Browser-Interaktionen für dynamische Anwendungen verbinden.", java: "Typen, Klassen und objektorientierte Grundlagen mit kleinen Programmen üben.", python: "Lesbare Programme, Funktionen und Sammlungen für Automatisierung und Daten lernen.", php: "Serverseitige Logik, Formulare und sichere Webantworten verstehen.", typescript: "JavaScript mit Typen, Schnittstellen und überprüfbaren Datenstrukturen absichern.", cpp: "C++-Grundlagen, Funktionen, Standardbibliothek und Systemnähe kennenlernen.", csharp: ".NET-Grundlagen, Typen, Methoden und praktische Anwendungen entwickeln.", rust: "Ownership, Typen und Cargo als Basis sicherer Rust-Programme verstehen.", sql: "Daten auswählen, filtern, gruppieren und relational sauber modellieren.", c: "Kontrollfluss, Funktionen und systemnahe Grundlagen verständlich erarbeiten.", kotlin: "Kompakte JVM-Syntax, Null-Sicherheit und Collections praktisch einsetzen.", swift: "Typen, Funktionen, Collections und moderne Swift-Werkzeuge kennenlernen.",
  "web-development": "Von semantischem HTML und zugänglichem Layout zu React, Tests und einem eigenen Kurskatalog.", backend: "APIs, Validierung, PostgreSQL, Zugriffsschutz und ein getesteter eigener Dienst.", security: "Bedrohungsmodell, konkrete Abwehr, Sicherheitswerkzeuge und ein geprüftes Praxisprojekt.", ai: "Von KI-Grundlagen und Python bis scikit-learn, PyTorch, SQL und einer eigenen Modellpipeline.", "game-development": "Von Spielzustand und Game Loop bis Godot oder Unity und einem getesteten eigenen Spiel.", career: "Ein nutzbares Portfolio-Projekt planen, umsetzen, testen und nachvollziehbar veröffentlichen.",
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
      : goal.includes("beruf") || goal.includes("job") ? "career"
        : goal.includes("ki") || goal.includes("künstliche") ? "ai"
          : goal.includes("sicher") ? "security"
            : goal.includes("spiel") ? "game-development"
              : goal.includes("software") ? (state.experience === "experienced" ? "typescript" : "javascript")
                : state.experience === "new" ? "programming-intro" : "python";
  const candidate = courseCatalog.find((course) => course.id === match);
  return candidate ?? intro;
}
