import type { CourseLesson } from "./course";
import type { LessonProgress } from "./types";

export type PlanRecommendation = { lesson: CourseLesson; reason: string; isReview: boolean };

export function recommendNextLesson(
  lessons: CourseLesson[],
  progress: Record<string, LessonProgress>,
  now = new Date(),
): PlanRecommendation {
  const dueReview = lessons.find((lesson) => {
    const entry = progress[lesson.id];
    return entry?.completed && entry.nextReviewAt && new Date(entry.nextReviewAt) <= now;
  });
  if (dueReview) return { lesson: dueReview, reason: "Eine kurze Wiederholung ist jetzt fällig.", isReview: true };

  const next = lessons.find((lesson) => !progress[lesson.id]?.completed) ?? lessons[lessons.length - 1];
  const done = lessons.filter((lesson) => progress[lesson.id]?.completed).length;
  return {
    lesson: next,
    reason: done === 0 ? "Das ist der Einstieg in deinen Lernpfad." : `Du hast ${done} von ${lessons.length} Lernzielen abgeschlossen. Dieser Schritt baut darauf auf.`,
    isReview: false,
  };
}

export function reviewDate(confidence: number, now = new Date()): string {
  const intervals = [1, 1, 3, 7, 14, 30];
  const safeConfidence = Math.min(5, Math.max(0, Math.round(confidence)));
  const next = new Date(now);
  next.setDate(next.getDate() + intervals[safeConfidence]);
  return next.toISOString();
}
