import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
if (!supabaseUrl || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl)) {
  throw new Error("SUPABASE_URL must be the HTTPS project URL (not a database connection string).");
}

const file = resolve(process.env.DEVPATH_DOWNLOAD_PAGE ?? "website/download/index.html");
let html = await readFile(file, "utf8");
const assets = {
  "windows-x64": { name: "DevPath-Windows-x64.exe", label: "Windows-Installer herunterladen" },
  "macos-arm64": { name: "DevPath-macOS-arm64.dmg", label: "macOS-Installer herunterladen · Apple Silicon" },
  "macos-x64": { name: "DevPath-macOS-x64.dmg", label: "macOS-Installer herunterladen · Intel" },
  "linux-x64": { name: "DevPath-Linux-x64.deb", label: "Linux-Paket für Ubuntu/Debian herunterladen" },
};

function replaceTaggedElement(markup, attribute, id, replacement) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const source = `<(?<tag>a|span)\\b(?=[^>]*\\b${attribute}="${escapedId}")[^>]*>[\\s\\S]*?<\\/\\k<tag>>`;
  const pattern = new RegExp(source, "g");
  if (!markup.match(pattern)) throw new Error(`Missing [${attribute}="${id}"] element in download page.`);
  return markup.replace(new RegExp(source, "g"), replacement);
}

for (const [id, asset] of Object.entries(assets)) {
  const url = `${supabaseUrl}/storage/v1/object/public/devpath-downloads/${asset.name}`;
  const downloadLink = `<a class="button primary download-button platform-download" data-installer="${id}" href="${url}?download">${asset.label}</a>`;
  html = replaceTaggedElement(html, "data-installer", id, downloadLink);
}

await writeFile(file, html);
process.stdout.write("Public installer links enabled in website/download/index.html\n");
