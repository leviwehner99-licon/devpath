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

export type SavedVersion = { id: string; name: string; note: string; code: string; createdAt: string; lessonId: string };

export type DevPathState = {
  learnerName: string;
  goal: string;
  experience: "new" | "some" | "experienced";
  weeklySessions: number;
  sessionMinutes: number;
  progress: Record<string, LessonProgress>;
  versions: SavedVersion[];
  onboardingCompleted: boolean;
  courseCompletedAt?: string;
  settings: { theme: "system" | "light" | "dark"; reducedMotion: boolean; sendDiagnostics: boolean; aiMode: "off" | "local" | "external" };
};

export const initialState: DevPathState = {
  learnerName: "Alex",
  goal: "Meine erste eigene Website bauen",
  experience: "new",
  weeklySessions: 3,
  sessionMinutes: 20,
  progress: {},
  versions: [],
  onboardingCompleted: false,
  settings: { theme: "system", reducedMotion: false, sendDiagnostics: false, aiMode: "off" },
};

export const pilotLesson = { ...pilotCourse.lessons[0], course: "HTML Grundlagen" };
