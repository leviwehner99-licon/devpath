export type View = "today" | "learn" | "library" | "curriculum" | "studio" | "projects" | "community" | "base" | "diploma" | "settings";

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
  activeCourseId: string;
  onboardingCompleted: boolean;
  courseCompletedAt?: string;
  courseCompletions: Record<string, string>;
  settings: { theme: "system" | "light" | "dark"; reducedMotion: boolean; sendDiagnostics: boolean; aiMode: "off" | "local" | "external" };
};

export const initialState: DevPathState = {
  learnerName: "Lernende Person",
  goal: "Programmieren von Grund auf lernen",
  experience: "new",
  weeklySessions: 3,
  studyDays: [0, 2, 4],
  studyTime: "18:00",
  sessionMinutes: 20,
  progress: {},
  versions: [],
  projects: [{
    id: "starter-programming",
    name: "Mein erstes JavaScript-Programm",
    language: "javascript",
    files: {
      "index.js": "// Dein erstes Programm\nconsole.log(\"Hallo CodeZone\");\n",
    },
    activeFile: "index.js",
    createdAt: "2026-10-21T00:00:00.000Z",
    updatedAt: "2026-10-21T00:00:00.000Z",
  }],
  activeProjectId: "starter-programming",
  activeCourseId: "programming-intro",
  onboardingCompleted: false,
  courseCompletions: {},
  settings: { theme: "system", reducedMotion: false, sendDiagnostics: false, aiMode: "off" },
};
