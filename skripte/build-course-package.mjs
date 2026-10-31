import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const compilerOptions = { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 };
const extensionModules = {};
for (const name of ["course-extensions", "language-extensions", "einstieg", "lernmaterial", "systemarchitektur", "integrationsprojekte"]) {
  const extensionSource = await readFile(resolve(root, `src/kurse/${name}.ts`), "utf8");
  const extensionCompiled = ts.transpileModule(extensionSource, { compilerOptions }).outputText;
  extensionModules[name] = `data:text/javascript;base64,${Buffer.from(extensionCompiled).toString("base64")}`;
}
const curriculumSource = await readFile(resolve(root, "src/kurse/course-curriculum.ts"), "utf8");
let curriculumCompiled = ts.transpileModule(curriculumSource, { compilerOptions }).outputText;
for (const [name, url] of Object.entries(extensionModules)) curriculumCompiled = curriculumCompiled.replace(`from "./${name}"`, `from "${url}"`);
const curriculumUrl = `data:text/javascript;base64,${Buffer.from(curriculumCompiled).toString("base64")}`;
const source = await readFile(resolve(root, "src/kurse/course.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions }).outputText.replace('from "./course-curriculum"', `from "${curriculumUrl}"`).replace('from "./einstieg"', `from "${extensionModules.einstieg}"`).replace('from "./lernmaterial"', `from "${extensionModules.lernmaterial}"`).replace('from "./systemarchitektur"', `from "${extensionModules.systemarchitektur}"`);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const { programmingCourse, courseSkills, learningCourses } = await import(moduleUrl);
const { setups } = await import(extensionModules.lernmaterial);
if (programmingCourse.lessons.some((lesson) => lesson.language !== "plaintext" || (!lesson.knowledgeCheck && !lesson.acceptanceCriteria?.length) || !lesson.visualSteps?.length)) throw new Error("Der Einstiegskurs muss ohne Sprachcode beginnen und jede Lektion anschaulich prüfen");
const languageOrientation = programmingCourse.lessons.find((lesson) => lesson.id === "program-languages");
if (!languageOrientation?.languageGuide || languageOrientation.languageGuide.length < 7 || !languageOrientation.explanation.includes("HTML als Auszeichnung")) throw new Error("Sachliche Orientierung über Sprachen und Webtechniken fehlt");
for (const course of learningCourses) {
  const ids = course.lessons.map((lesson) => lesson.id);
  if (course.id !== "programming-intro" && ids[0] !== `${course.id}-orientation`) throw new Error(`Kurs ${course.id} beginnt nicht mit der Orientierung`);
  if (new Set(ids).size !== ids.length) throw new Error(`Doppelte Lektion im Kurs ${course.id}: ${ids.filter((id, index) => ids.indexOf(id) !== index).join(", ")}`);
  if (course.lessons.some((lesson) => !lesson.title || !lesson.objective || !lesson.explanation)) throw new Error(`Unvollständige Lektion im Kurs ${course.id}`);
  if (course.lessons.some((lesson) => !lesson.visualSteps?.length)) throw new Error(`Anschauliche Schritte fehlen im Kurs ${course.id}`);
  if (course.category === "Themenkurs" && !course.lessons[0].systemDiagram) throw new Error(`Systemdiagramm fehlt im Kurs ${course.id}`);
  if (course.lessons.some((lesson, index) => index > 0 && lesson.previousLesson?.title !== course.lessons[index - 1].title)) throw new Error(`Lernübergang fehlt im Kurs ${course.id}`);
  for (const lesson of course.lessons) {
    if (lesson.languageCourse && !learningCourses.some((target) => target.id === lesson.languageCourse.id)) throw new Error(`Sprachkurs ${lesson.languageCourse.id} für ${lesson.id} fehlt`);
    const check = lesson.knowledgeCheck;
    if (check && (check.options.length < 2 || check.correctIndex < 0 || check.correctIndex >= check.options.length)) throw new Error(`Quiz kann nicht ausgewertet werden: ${lesson.id}`);
    if (lesson.practice !== false && !lesson.task.trim()) throw new Error(`Praxisaufgabe ohne Arbeitsauftrag: ${lesson.id}`);
  }
}
const allLessons = learningCourses.flatMap((course) => course.lessons);
for (const [id, setup] of Object.entries(setups)) {
  const lesson = allLessons.find((entry) => entry.id === id);
  if (!lesson || lesson.setup !== setup || setup.steps.length < 3 || !setup.verify) throw new Error(`Installationsanleitung fehlt oder ist unvollständig: ${id}`);
}
for (const course of learningCourses) {
  if (course.lessons.filter((lesson) => lesson.practice !== false).length < 2) throw new Error(`Praxisübungen fehlen im Kurs ${course.id}`);
}
const orderChecks = {
  "programming-intro": [["program-input-result", "program-search-workshop"], ["program-debug", "program-debug-workshop"], ["program-ecosystem", "program-languages"], ["program-languages", "program-system"]],
  "web-development": [["web-development-combine-frontend", "web-development-vite-setup"], ["web-development-vite-setup", "web-development-frameworks"], ["web-development-frameworks", "web-development-typescript-ui"], ["web-development-react-state", "web-development-frontend-integration"], ["web-development-frontend-integration", "web-development-project"]],
  backend: [["backend-server-model", "backend-api-model"], ["backend-fastify-setup", "backend-node-fastify-api"], ["backend-spring-setup", "backend-spring-api"], ["backend-node-postgres-api", "backend-backend-integration"], ["backend-backend-integration", "backend-project"]],
  ai: [["ai-python-environment", "ai-dataframe"], ["ai-sklearn-setup", "ai-sklearn-model"], ["ai-pytorch-setup", "ai-pytorch-neural-network"], ["ai-fastapi-practice", "ai-ai-integration"], ["ai-ai-integration", "ai-project"]],
  "game-development": [["game-development-orientation", "game-development-godot-setup"], ["game-development-godot-setup", "game-development-godot-first-game"], ["game-development-unity-setup", "game-development-unity-basics"], ["game-development-game-integration", "game-development-project"]],
  security: [["security-ethical-lab", "security-zap-setup"], ["security-security-integration", "security-project"]],
};
for (const [courseId, pairs] of Object.entries(orderChecks)) {
  const ids = learningCourses.find((course) => course.id === courseId).lessons.map((lesson) => lesson.id);
  for (const [before, after] of pairs) {
    if (ids.indexOf(before) < 0 || ids.indexOf(after) < 0 || ids.indexOf(before) >= ids.indexOf(after)) throw new Error(`Kursfolge unklar: ${before} muss vor ${after} liegen`);
  }
}
const web = learningCourses.find((course) => course.id === "web-development");
const html = web.lessons.find((lesson) => lesson.id === "web-development-html");
if (!html.examples[0].code.startsWith("<!doctype html>") || !html.examples[0].code.includes('<html lang="de">') || !html.examples[0].code.includes("</html>")) throw new Error("Vollständiges HTML-Beispiel fehlt");
const combined = web.lessons.find((lesson) => lesson.id === "web-development-combine-frontend");
if (!combined.examples.some((item) => item.title === "index.html" && item.code.includes('<script type="module" src="app.js"></script>')) || !combined.examples.some((item) => item.title === "styles.css") || !combined.examples.some((item) => item.title === "app.js")) throw new Error("Frontend-Dateien sind nicht eindeutig getrennt");
const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
function checkHtml(fragment, label) {
  const stack = [];
  const cleaned = fragment.replace(/<!--[\s\S]*?-->/g, "");
  for (const match of cleaned.matchAll(/<(\/)?([a-z][\w-]*)\b[^>]*>/gi)) {
    const closing = Boolean(match[1]);
    const tag = match[2].toLowerCase();
    if (voidElements.has(tag)) {
      if (closing) throw new Error(`Ungültiger schließender HTML-Tag in ${label}: ${tag}`);
    } else if (closing) {
      if (stack.pop() !== tag) throw new Error(`Falsch verschachtelter HTML-Tag in ${label}: ${tag}`);
    } else if (!match[0].endsWith("/>")) stack.push(tag);
  }
  if (stack.length) throw new Error(`Nicht geschlossener HTML-Tag in ${label}: ${stack.join(", ")}`);
}
for (const lesson of web.lessons) {
  for (const example of lesson.examples ?? []) if (example.language === "html" || (lesson.language === "html" && !example.language)) checkHtml(example.code, `${lesson.id}/${example.title}`);
  if (lesson.starterCode.trimStart().startsWith("<!doctype html>")) checkHtml(lesson.starterCode, `${lesson.id}/Startdatei`);
}
const reactSearch = web.lessons.find((lesson) => lesson.id === "web-development-react-state");
if (!reactSearch.examples[0].code.includes('htmlFor="search"') || reactSearch.examples[0].code.includes(' for="search"')) throw new Error("React-Beispiel benutzt ein falsches Label-Attribut");
process.stdout.write(`${learningCourses.length} Kurse, ${allLessons.length} Lektionen und ${Object.keys(setups).length} Installationsanleitungen geprüft.\n`);
const packageData = {
  schemaVersion: 1,
  id: programmingCourse.id,
  version: programmingCourse.version,
  title: programmingCourse.title,
  category: programmingCourse.category,
  skills: courseSkills,
  lessons: programmingCourse.lessons.map(({ successPattern, ...lesson }) => ({ ...lesson, successPattern: { source: successPattern.source, flags: successPattern.flags } })),
};
const output = `${JSON.stringify(packageData, null, 2)}\n`;
const digest = createHash("sha256").update(output).digest("hex");
const targetDir = resolve(root, "website/courses");
await mkdir(targetDir, { recursive: true });
const packageName = `${packageData.id}-${packageData.version}`;
await writeFile(resolve(targetDir, `${packageName}.json`), output);
await writeFile(resolve(targetDir, `${packageName}.sha256`), `${digest}  ${packageName}.json\n`);
process.stdout.write(`${digest}\n`);
