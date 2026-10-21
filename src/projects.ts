import type { LocalProject } from "./types";

export const PROJECT_BUNDLE_FORMAT = "devpath-project";
export const MAX_PROJECT_FILES = 100;
export const MAX_PROJECT_FILE_BYTES = 1_000_000;
export const MAX_PROJECT_BYTES = 5_000_000;

export function safeProjectPath(input: string): string | null {
  const path = input.trim().replaceAll("\\", "/");
  if (!path || path.length > 240 || path.startsWith("/") || /^[a-z]:/i.test(path)) return null;
  const parts = path.split("/");
  if (parts.some((part) => !part || part === "." || part === ".." || part.length > 100)) return null;
  if (parts.some((part) => [".git", "node_modules", "target", "dist", "__pycache__"].includes(part.toLowerCase()))) return null;
  const filename = parts.at(-1)!.toLowerCase();
  if (/^\.env(?:\..*)?$/.test(filename) || /^id_(?:rsa|ed25519)$/.test(filename) || /\.(?:pem|key|p12|pfx)$/.test(filename)) return null;
  return parts.join("/");
}

export function validateProjectFiles(files: unknown): Record<string, string> {
  if (!files || typeof files !== "object" || Array.isArray(files)) throw new Error("Das Projekt enthält keine gültige Dateiliste.");
  const entries = Object.entries(files);
  if (!entries.length || entries.length > MAX_PROJECT_FILES) throw new Error(`Ein Projekt muss 1 bis ${MAX_PROJECT_FILES} Textdateien enthalten.`);
  let totalBytes = 0;
  const safeFiles: Record<string, string> = {};
  for (const [rawPath, content] of entries) {
    const path = safeProjectPath(rawPath);
    if (!path) throw new Error(`Der Dateipfad „${rawPath}“ ist nicht erlaubt. Absolute Pfade, Geheimdateien und Buildordner werden ausgeschlossen.`);
    if (Object.hasOwn(safeFiles, path)) throw new Error(`Der Dateipfad „${path}“ kommt mehrfach vor.`);
    if (typeof content !== "string") throw new Error(`„${path}“ ist keine Textdatei.`);
    const size = new TextEncoder().encode(content).byteLength;
    if (size > MAX_PROJECT_FILE_BYTES) throw new Error(`„${path}“ ist größer als 1 MB.`);
    totalBytes += size;
    if (totalBytes > MAX_PROJECT_BYTES) throw new Error("Das Projekt ist größer als 5 MB.");
    safeFiles[path] = content;
  }
  return safeFiles;
}

export function parseProjectBundle(text: string): Omit<LocalProject, "id" | "createdAt" | "updatedAt" | "activeFile"> {
  if (new TextEncoder().encode(text).byteLength > MAX_PROJECT_BYTES + 100_000) throw new Error("Die Projektdatei ist zu groß.");
  let value: unknown;
  try { value = JSON.parse(text); } catch { throw new Error("Die Projektdatei ist kein gültiges JSON."); }
  if (!value || typeof value !== "object") throw new Error("Das Dateiformat wird nicht erkannt.");
  const bundle = value as { format?: unknown; version?: unknown; project?: { name?: unknown; language?: unknown; files?: unknown } };
  if (bundle.format !== PROJECT_BUNDLE_FORMAT || bundle.version !== 1 || !bundle.project) throw new Error("Das ist kein unterstützter DevPath-Projektexport.");
  const name = typeof bundle.project.name === "string" ? bundle.project.name.trim().slice(0, 80) : "Importiertes Projekt";
  const language = typeof bundle.project.language === "string" ? bundle.project.language.slice(0, 32) : "html";
  return { name: name || "Importiertes Projekt", language, files: validateProjectFiles(bundle.project.files) };
}

export function projectBundle(project: LocalProject): string {
  const files = validateProjectFiles(project.files);
  const keyPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
    /\bsb_secret_[A-Za-z0-9_\-]{20,}/,
  ];
  const suspiciousFiles = Object.entries(files)
    .filter(([, content]) => keyPatterns.some((pattern) => pattern.test(content)))
    .map(([path]) => path);
  if (suspiciousFiles.length && !window.confirm(`Mögliche Zugangsdaten in ${suspiciousFiles.join(", ")} gefunden. Trotzdem exportieren?`)) return "";
  return JSON.stringify({ format: PROJECT_BUNDLE_FORMAT, version: 1, project: { name: project.name, language: project.language, files } }, null, 2);
}

export function downloadProjectBundle(project: LocalProject): void {
  const contents = projectBundle(project);
  if (!contents) return;
  const fileName = project.name.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, "-").replace(/^-|-$/g, "") || "devpath-projekt";
  const url = URL.createObjectURL(new Blob([contents], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${fileName}.devpath-project.json`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function editorLanguage(path: string): string {
  const extension = path.split(".").at(-1)?.toLowerCase();
  const languages: Record<string, string> = { html: "html", htm: "html", css: "css", js: "javascript", mjs: "javascript", cjs: "javascript", ts: "typescript", tsx: "typescript", json: "json", md: "markdown", py: "python", sql: "sql", xml: "xml", yml: "yaml", yaml: "yaml", sh: "shell", rs: "rust", java: "java", c: "c", h: "c", cpp: "cpp", cs: "csharp" };
  return languages[extension ?? ""] ?? "plaintext";
}

export function createLocalProject(name: string, files: Record<string, string> = { "index.html": "" }): LocalProject {
  const validFiles = validateProjectFiles(files);
  const now = new Date().toISOString();
  const firstFile = Object.keys(validFiles)[0];
  return { id: crypto.randomUUID(), name: name.trim().slice(0, 80) || "Neues Projekt", language: "html", files: validFiles, activeFile: firstFile, createdAt: now, updatedAt: now };
}
