import type { CourseLesson } from "./course";
import type { LessonProgress } from "./types";

export type PlanRecommendation = { lesson: CourseLesson; reason: string; isReview: boolean };

export const weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"] as const;

export function studyTimeLabel(value: string): string {
  if (value === "flexible") return "flexibel, ohne feste Uhrzeit";
  if (value === "morning") return "morgens";
  if (value === "afternoon") return "nachmittags";
  if (value === "evening") return "abends";
  if (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    const hour = Number(value.slice(0, 2));
    return hour < 12 ? "morgens" : hour < 17 ? "nachmittags" : "abends";
  }
  return "flexibel, ohne feste Uhrzeit";
}

export function defaultStudyDays(sessions: number): number[] {
  const schedules: Record<number, number[]> = {
    1: [2],
    2: [1, 4],
    3: [0, 2, 4],
    4: [0, 2, 4, 6],
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  return [...(schedules[Math.max(1, Math.min(7, Math.round(sessions)))] ?? schedules[3])];
}

export function recommendNextLesson(
  lessons: CourseLesson[],
  progress: Record<string, LessonProgress>,
  now = new Date(),
): PlanRecommendation {
  const dueReviews = lessons
    .filter((lesson) => {
      const entry = progress[lesson.id];
      return entry?.completed && entry.nextReviewAt && Number.isFinite(Date.parse(entry.nextReviewAt)) && Date.parse(entry.nextReviewAt) <= now.getTime();
    })
    .sort((left, right) => Date.parse(progress[left.id].nextReviewAt!) - Date.parse(progress[right.id].nextReviewAt!));
  const dueReview = dueReviews[0];
  if (dueReview) {
    const entry = progress[dueReview.id];
    const reason = entry.hintCount >= 2
      ? "Bei diesem Lernziel waren mehrere Hinweise hilfreich. Eine kurze Wiederholung festigt die Grundlagen."
      : entry.confidence <= 2
        ? "Du hast dieses Lernziel als noch unsicher bewertet. Eine kurze Wiederholung ist jetzt fällig."
        : "Dein Wiederholungstermin ist erreicht. So bleibt das Gelernte besser abrufbar.";
    return { lesson: dueReview, reason, isReview: true };
  }

  const next = lessons.find((lesson) => !progress[lesson.id]?.completed);
  const done = lessons.filter((lesson) => progress[lesson.id]?.completed).length;
  if (!next && done > 0) {
    const upcoming = lessons
      .filter((lesson) => progress[lesson.id]?.completed && progress[lesson.id]?.nextReviewAt && Number.isFinite(Date.parse(progress[lesson.id].nextReviewAt!)))
      .sort((left, right) => Date.parse(progress[left.id].nextReviewAt!) - Date.parse(progress[right.id].nextReviewAt!))[0];
    if (upcoming) {
      const reviewAt = new Date(progress[upcoming.id].nextReviewAt!).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
      return { lesson: upcoming, reason: `Alle Lernziele sind abgeschlossen. Deine nächste Wiederholung ist am ${reviewAt} geplant.`, isReview: true };
    }
  }
  const recommendation = next ?? lessons[lessons.length - 1];
  const currentProgress = progress[recommendation.id];
  const resumed = !currentProgress?.completed && Boolean(currentProgress?.code || currentProgress?.attempts);
  return {
    lesson: recommendation,
    reason: resumed
      ? "Du hast hier bereits begonnen. Dein lokal gespeicherter Code und dein Fortschritt warten auf dich."
      : done === 0
        ? "Das ist der Einstieg in deinen Lernpfad."
        : `Du hast ${done} von ${lessons.length} Lernzielen abgeschlossen. Dieser Schritt baut darauf auf.`,
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
