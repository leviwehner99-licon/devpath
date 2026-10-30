import { isTauri } from "@tauri-apps/api/core";
import { initialState, type DevPathState } from "./types";
import { validateProjectFiles } from "./projects";
import { defaultStudyDays } from "./planner";

const STORAGE_KEY = "devpath.local.v1";
const ACTIVE_PROFILE_KEY = "devpath.active-profile.v1";
function readActiveProfileId(): string {
  try {
    const saved = window.localStorage.getItem(ACTIVE_PROFILE_KEY);
    return saved && /^[a-zA-Z0-9_-]{1,128}$/.test(saved) ? saved : "local";
  } catch {
    return "local";
  }
}
let activeProfileId = readActiveProfileId();
const DATABASE_URL = "sqlite:devpath.db";
const DATA_EXPORT_FORMAT = "devpath-data";
const DATA_EXPORT_VERSION = 1;
const MAX_DATA_EXPORT_BYTES = 50_000_000;
type LocalDatabase = import("@tauri-apps/plugin-sql").default;
let databasePromise: Promise<LocalDatabase> | undefined;

async function getDatabase(): Promise<LocalDatabase> {
  databasePromise ??= import("@tauri-apps/plugin-sql").then(({ default: Database }) => Database.load(DATABASE_URL));
  return databasePromise;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function boundedString(value: unknown, fallback: string, maxLength: number): string {
  return typeof value === "string" ? value.slice(0, maxLength) : fallback;
}

function normalizeState(value: unknown): DevPathState {
  if (!isRecord(value)) return structuredClone(initialState);

  const parsed = value as Partial<DevPathState>;
  const safeProjects = (Array.isArray(parsed.projects) ? parsed.projects : [])
    .slice(0, 100)
    .flatMap((value) => {
      if (!isRecord(value) || typeof value.id !== "string" || !value.id || !isRecord(value.files)) return [];
      try {
        const files = validateProjectFiles(value.files);
        const firstFile = Object.keys(files)[0];
        return [{
          id: value.id.slice(0, 128),
          name: boundedString(value.name, "Importiertes Projekt", 80),
          language: boundedString(value.language, "html", 32),
          files,
          activeFile: typeof value.activeFile === "string" && files[value.activeFile] !== undefined ? value.activeFile : firstFile,
          ...(typeof value.linkedLessonId === "string" ? { linkedLessonId: value.linkedLessonId.slice(0, 128) } : {}),
          ...(typeof value.linkedLessonFile === "string" && files[value.linkedLessonFile] !== undefined ? { linkedLessonFile: value.linkedLessonFile } : {}),
          createdAt: boundedString(value.createdAt, new Date(0).toISOString(), 40),
          updatedAt: boundedString(value.updatedAt, new Date(0).toISOString(), 40),
        }];
      } catch {
        return [];
      }
    });
  const uniqueProjects = safeProjects.filter((project, index, projects) => projects.findIndex((candidate) => candidate.id === project.id) === index);
  const projects = uniqueProjects.length ? uniqueProjects : structuredClone(initialState.projects);
  const safeProgress = Object.create(null) as DevPathState["progress"];
  if (isRecord(parsed.progress)) {
    for (const [lessonId, value] of Object.entries(parsed.progress).slice(0, 500)) {
      if (!isRecord(value)) continue;
      const safeLessonId = lessonId.slice(0, 128);
      Object.defineProperty(safeProgress, safeLessonId, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {
        completed: value.completed === true,
        code: boundedString(value.code, "", 1_000_000),
        updatedAt: boundedString(value.updatedAt, new Date(0).toISOString(), 40),
        attempts: Number.isSafeInteger(value.attempts) && Number(value.attempts) >= 0 ? Number(value.attempts) : 0,
        hintCount: Number.isSafeInteger(value.hintCount) && Number(value.hintCount) >= 0 ? Number(value.hintCount) : 0,
        confidence: Number.isSafeInteger(value.confidence) && Number(value.confidence) >= 0 && Number(value.confidence) <= 5 ? Number(value.confidence) : 0,
          ...(typeof value.nextReviewAt === "string" ? { nextReviewAt: value.nextReviewAt.slice(0, 40) } : {}),
        },
      });
    }
  }
  const safeVersions: DevPathState["versions"] = [];
  for (const value of (Array.isArray(parsed.versions) ? parsed.versions : []).slice(0, 2_000)) {
    if (!isRecord(value) || typeof value.id !== "string" || typeof value.lessonId !== "string") continue;
    const files = isRecord(value.files) ? (() => { try { return validateProjectFiles(value.files); } catch { return undefined; } })() : undefined;
    safeVersions.push({
      id: value.id.slice(0, 128),
      name: boundedString(value.name, "Importierte Version", 60),
      note: boundedString(value.note, "", 180),
      code: boundedString(value.code, "", 1_000_000),
      createdAt: boundedString(value.createdAt, new Date(0).toISOString(), 40),
      lessonId: value.lessonId.slice(0, 128),
      ...(typeof value.projectId === "string" ? { projectId: value.projectId.slice(0, 128) } : {}),
      ...(files ? { files } : {}),
    });
  }
  const rawSettings: Record<string, unknown> = isRecord(parsed.settings) ? parsed.settings : {};
  const experience = parsed.experience === "some" || parsed.experience === "experienced" ? parsed.experience : "new";
  const weeklySessions = Number.isSafeInteger(parsed.weeklySessions) && Number(parsed.weeklySessions) >= 1 && Number(parsed.weeklySessions) <= 7 ? Number(parsed.weeklySessions) : initialState.weeklySessions;
  const studyDays = Array.isArray(parsed.studyDays)
    ? [...new Set(parsed.studyDays.filter((day): day is number => Number.isInteger(day) && day >= 0 && day <= 6))].slice(0, 7)
    : [];
  const safeStudyDays = studyDays.length ? studyDays : defaultStudyDays(weeklySessions);
  const studyTime = typeof parsed.studyTime === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(parsed.studyTime) ? parsed.studyTime : "18:00";
  const theme = rawSettings.theme === "dark" || rawSettings.theme === "light" || rawSettings.theme === "system"
    ? rawSettings.theme
    : "system";
  const aiMode = rawSettings.aiMode === "local" || rawSettings.aiMode === "external" ? rawSettings.aiMode : "off";
  const learnerName = boundedString(parsed.learnerName, initialState.learnerName, 32);
  const hasCompletedOnboarding = parsed.onboardingCompleted === true
    && learnerName.trim().length > 0
    && learnerName.trim().toLowerCase() !== "alex"
    && learnerName.trim().toLowerCase() !== initialState.learnerName.toLowerCase();

  return {
    learnerName: learnerName.trim().toLowerCase() === "alex" ? initialState.learnerName : learnerName,
    goal: boundedString(parsed.goal, initialState.goal, 100),
    experience,
    weeklySessions: safeStudyDays.length,
    studyDays: safeStudyDays,
    studyTime,
    sessionMinutes: [10, 15, 20, 30, 45, 60].includes(Number(parsed.sessionMinutes)) ? Number(parsed.sessionMinutes) : initialState.sessionMinutes,
    progress: safeProgress,
    versions: safeVersions,
    projects,
    activeProjectId: projects.some((project) => project.id === parsed.activeProjectId) ? parsed.activeProjectId! : projects[0].id,
    activeCourseId: typeof parsed.activeCourseId === "string" && /^[a-z0-9-]{1,80}$/.test(parsed.activeCourseId) ? parsed.activeCourseId : initialState.activeCourseId,
    onboardingCompleted: hasCompletedOnboarding,
    ...(typeof parsed.courseCompletedAt === "string" ? { courseCompletedAt: parsed.courseCompletedAt.slice(0, 40) } : {}),
    courseCompletions: isRecord(parsed.courseCompletions) ? Object.fromEntries(Object.entries(parsed.courseCompletions).filter(([key, date]) => /^[a-z0-9-]{1,80}$/.test(key) && typeof date === "string").slice(0, 100)) as Record<string, string> : {},
    settings: {
      theme,
      reducedMotion: rawSettings.reducedMotion === true,
      sendDiagnostics: false,
      aiMode,
    },
  };
}

export function parseDataExport(text: string): DevPathState {
  if (new TextEncoder().encode(text).byteLength > MAX_DATA_EXPORT_BYTES) throw new Error("Der Datenexport ist größer als 50 MB.");
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error("Der Datenexport ist kein gültiges JSON."); }
  if (!isRecord(value)) throw new Error("Das Datenexportformat wird nicht erkannt.");
  if (value.format === DATA_EXPORT_FORMAT) {
    if (value.version !== DATA_EXPORT_VERSION || !isRecord(value.state)) throw new Error("Diese Version des Datenexports wird nicht unterstützt.");
    return validateImportedState(value.state);
  }
  // Accept exports created by devpath 0.1 before the versioned envelope was added.
  if ("learnerName" in value || "progress" in value || "projects" in value) return validateImportedState(value);
  throw new Error("Das Datenexportformat wird nicht erkannt.");
}

function validateImportedState(value: Record<string, unknown>): DevPathState {
  if (!Array.isArray(value.projects) || value.projects.length === 0 || value.projects.length > 100) {
    throw new Error("Der Export enthält keine gültige Projektliste.");
  }
  for (const project of value.projects) {
    if (!isRecord(project) || typeof project.id !== "string" || !project.id || !isRecord(project.files)) {
      throw new Error("Der Export enthält ein ungültiges Projekt. Deine bisherigen Daten wurden nicht verändert.");
    }
    try { validateProjectFiles(project.files); }
    catch (error) { throw new Error(error instanceof Error ? `Projekt im Export ungültig: ${error.message}` : "Ein Projekt im Export ist ungültig."); }
  }
  if (value.progress !== undefined && !isRecord(value.progress)) throw new Error("Der Lernfortschritt im Export ist ungültig.");
  if (value.versions !== undefined && !Array.isArray(value.versions)) throw new Error("Die Versionsgeschichte im Export ist ungültig.");
  if (Array.isArray(value.versions)) {
    for (const version of value.versions) {
      if (!isRecord(version) || typeof version.id !== "string" || typeof version.lessonId !== "string" || typeof version.code !== "string") {
        throw new Error("Der Export enthält eine ungültige gespeicherte Version. Deine bisherigen Daten wurden nicht verändert.");
      }
      if (version.files !== undefined) {
        if (!isRecord(version.files)) throw new Error("Eine gespeicherte Projektversion enthält keine gültige Dateiliste.");
        try { validateProjectFiles(version.files); }
        catch (error) { throw new Error(error instanceof Error ? `Gespeicherte Version im Export ungültig: ${error.message}` : "Eine gespeicherte Version im Export ist ungültig."); }
      }
    }
  }
  return normalizeState(value);
}

function loadBrowserState(): DevPathState {
  const raw = window.localStorage.getItem(`${STORAGE_KEY}.${activeProfileId}`) ?? (activeProfileId === "local" ? window.localStorage.getItem(STORAGE_KEY) : null);
  if (!raw) return structuredClone(initialState);
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) throw new Error("Ungültiges Datenformat.");
    return normalizeState(parsed);
  } catch (error) {
    throw new Error("Die lokalen Browserdaten sind beschädigt. Sie wurden nicht überschrieben.", { cause: error });
  }
}

export async function loadState(): Promise<DevPathState> {
  if (!isTauri()) return loadBrowserState();
  const db = await getDatabase();
  const rows = await db.select<{ state_json: string }[]>("SELECT state_json FROM app_state WHERE account_id = $1", [activeProfileId]);
  const stored = rows[0]?.state_json;
  if (stored && stored !== "{}") {
    const parsed: unknown = JSON.parse(stored);
    if (!isRecord(parsed)) throw new Error("Die lokalen SQLite-Daten enthalten kein gültiges CodeZone-Profil.");
    return normalizeState(parsed);
  }

  // When moving away from account sign-in, safely adopt a single prior local profile.
  // Keep its old row intact; if several profiles exist, never guess which belongs here.
  if (activeProfileId === "local") {
    const legacyProfiles = await db.select<{ state_json: string }[]>("SELECT state_json FROM app_state WHERE account_id <> $1 ORDER BY updated_at DESC LIMIT 2", [activeProfileId]);
    if (legacyProfiles.length === 1 && legacyProfiles[0].state_json && legacyProfiles[0].state_json !== "{}") {
      const parsed: unknown = JSON.parse(legacyProfiles[0].state_json);
      if (!isRecord(parsed)) throw new Error("Das bisherige lokale Profil enthält kein gültiges CodeZone-Datenformat.");
      const adopted = normalizeState(parsed);
      await persistSqliteState(adopted, db);
      return adopted;
    }
  }

  // Import prototype data once; only remove the old copy after SQLite accepted it.
  const oldState = loadBrowserState();
  await persistSqliteState(oldState, db);
  window.localStorage.removeItem(STORAGE_KEY);
  return oldState;
}

async function persistSqliteState(state: DevPathState, existingDb?: LocalDatabase): Promise<void> {
  const db = existingDb ?? await getDatabase();
  await db.execute(
    "INSERT INTO app_state (account_id, state_json, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT(account_id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP",
    [activeProfileId, JSON.stringify(state)],
  );
}

export async function setStorageProfileId(accountId: string): Promise<void> {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(accountId)) throw new Error("Die Konto-ID für den lokalen Speicher ist ungültig.");
  window.localStorage.setItem(ACTIVE_PROFILE_KEY, accountId);
  activeProfileId = accountId;
}

export async function saveState(state: DevPathState): Promise<void> {
  if (isTauri()) await persistSqliteState(state);
  else window.localStorage.setItem(`${STORAGE_KEY}.${activeProfileId}`, JSON.stringify(state));
}

export function exportState(state: DevPathState): void {
  const data = new Blob([JSON.stringify({ format: DATA_EXPORT_FORMAT, version: DATA_EXPORT_VERSION, exportedAt: new Date().toISOString(), state }, null, 2)], { type: "application/json" });
  if (data.size > MAX_DATA_EXPORT_BYTES) throw new Error("Der Datenexport wäre größer als 50 MB. Exportiere große Projekte einzeln über Code Studio.");
  const url = URL.createObjectURL(data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "codezone-datenexport.json";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function clearState(): Promise<void> {
  if (isTauri()) {
    const db = await getDatabase();
    await db.execute("DELETE FROM app_state WHERE account_id = $1", [activeProfileId]);
  } else {
    window.localStorage.removeItem(`${STORAGE_KEY}.${activeProfileId}`);
    if (activeProfileId === "local") window.localStorage.removeItem(STORAGE_KEY);
  }
}
