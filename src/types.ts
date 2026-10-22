export type View = "today" | "learn" | "studio" | "base" | "diploma" | "settings";

import { pilotCourse } from "./course";

export type LessonProgress = {
  completed: boolean;
  code: string;
  updatedAt: string;
  attempts: number;
  hintCount: number;
  confidence: number;
  nextReviewAt?: string;
};

export type SavedVersion = { id: string; name: string; note: string; code: string; createdAt: string; lessonId: string; projectId?: string; files?: Record<string, string> };

export type LocalProject = {
  id: string;
  name: string;
  language: string;
  files: Record<string, string>;
  activeFile: string;
  linkedLessonId?: string;
  linkedLessonFile?: string;
  createdAt: string;
  updatedAt: string;
};

export type DevPathState = {
  learnerName: string;
  goal: string;
  experience: "new" | "some" | "experienced";
  weeklySessions: number;
  studyDays: number[];
  studyTime: string;
  sessionMinutes: number;
  progress: Record<string, LessonProgress>;
  versions: SavedVersion[];
  projects: LocalProject[];
  activeProjectId: string;
  onboardingCompleted: boolean;
  courseCompletedAt?: string;
  settings: { theme: "system" | "light" | "dark"; reducedMotion: boolean; sendDiagnostics: boolean; aiMode: "off" | "local" | "external" };
};

export const initialState: DevPathState = {
  learnerName: "Alex",
  goal: "Meine erste eigene Website bauen",
  experience: "new",
  weeklySessions: 3,
  studyDays: [0, 2, 4],
  studyTime: "18:00",
  sessionMinutes: 20,
  progress: {},
  versions: [],
  projects: [{
    id: "starter-responsive-site",
    name: "Responsive Infoseite",
    language: "html",
    files: {
      "index.html": "<!doctype html>\n<html lang=\"de\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <title>Meine Infoseite</title>\n    <link rel=\"stylesheet\" href=\"styles.css\">\n  </head>\n  <body>\n    <main class=\"page\">\n      <h1>Meine Infoseite</h1>\n      <section><h2>Über mich</h2><p>Ich lerne, Webseiten zu bauen.</p></section>\n    </main>\n  </body>\n</html>\n",
      "styles.css": "* { box-sizing: border-box; }\n\nbody {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  color: #24233a;\n  background: #f5f4fa;\n}\n\n.page {\n  width: min(100% - 2rem, 52rem);\n  margin: 3rem auto;\n  padding: 2rem;\n  background: white;\n  border-radius: 1rem;\n}\n\n@media (max-width: 40rem) {\n  .page { margin: 1rem auto; padding: 1.25rem; }\n}\n",
    },
    activeFile: "index.html",
    createdAt: "2026-10-21T00:00:00.000Z",
    updatedAt: "2026-10-21T00:00:00.000Z",
  }],
  activeProjectId: "starter-responsive-site",
  onboardingCompleted: false,
  settings: { theme: "system", reducedMotion: false, sendDiagnostics: false, aiMode: "off" },
};

export const pilotLesson = { ...pilotCourse.lessons[0], course: "HTML Grundlagen" };
