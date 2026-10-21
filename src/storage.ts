import { isTauri } from "@tauri-apps/api/core";
import { initialState, type DevPathState } from "./types";

const STORAGE_KEY = "devpath.local.v1";
const DATABASE_URL = "sqlite:devpath.db";
type LocalDatabase = import("@tauri-apps/plugin-sql").default;
let databasePromise: Promise<LocalDatabase> | undefined;

async function getDatabase(): Promise<LocalDatabase> {
  databasePromise ??= import("@tauri-apps/plugin-sql").then(({ default: Database }) => Database.load(DATABASE_URL));
  return databasePromise;
}

function normalizeState(value: unknown): DevPathState {
  if (!value || typeof value !== "object") return initialState;
  const parsed = value as Partial<DevPathState>;
  const projects = Array.isArray(parsed.projects) ? parsed.projects.filter((project) => project && typeof project.id === "string" && typeof project.name === "string" && project.files && typeof project.files === "object") : [];
  const safeProjects = projects.length ? projects : initialState.projects;
  return {
    ...initialState,
    ...parsed,
    progress: { ...initialState.progress, ...(parsed.progress ?? {}) },
    versions: Array.isArray(parsed.versions) ? parsed.versions : [],
    projects: safeProjects,
    activeProjectId: safeProjects.some((project) => project.id === parsed.activeProjectId) ? parsed.activeProjectId! : safeProjects[0].id,
    settings: { ...initialState.settings, ...(parsed.settings ?? {}) },
  };
}

function loadBrowserState(): DevPathState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeState(JSON.parse(raw)) : initialState;
  } catch {
    return initialState;
  }
}

export async function loadState(): Promise<DevPathState> {
  if (!isTauri()) return loadBrowserState();
  const db = await getDatabase();
  const rows = await db.select<{ state_json: string }[]>("SELECT state_json FROM app_state WHERE id = 1");
  const stored = rows[0]?.state_json;
  if (stored && stored !== "{}") return normalizeState(JSON.parse(stored));

  // Import prototype data once; only remove the old copy after SQLite accepted it.
  const oldState = loadBrowserState();
  await persistSqliteState(oldState, db);
  window.localStorage.removeItem(STORAGE_KEY);
  return oldState;
}

async function persistSqliteState(state: DevPathState, existingDb?: LocalDatabase): Promise<void> {
  const db = existingDb ?? await getDatabase();
  await db.execute(
    "INSERT INTO app_state (id, state_json, updated_at) VALUES (1, $1, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP",
    [JSON.stringify(state)],
  );
}

export async function saveState(state: DevPathState): Promise<void> {
  if (isTauri()) await persistSqliteState(state);
  else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportState(state: DevPathState): void {
  const data = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "devpath-datenexport.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function clearState(): Promise<void> {
  if (isTauri()) {
    const db = await getDatabase();
    await db.execute("UPDATE app_state SET state_json = '{}' WHERE id = 1");
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
