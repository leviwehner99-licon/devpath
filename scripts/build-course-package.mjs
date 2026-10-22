import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const source = await readFile(resolve(root, "src/course.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const { programmingCourse, courseSkills } = await import(moduleUrl);
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
await writeFile(resolve(targetDir, "programming-intro-1.0.0.json"), output);
await writeFile(resolve(targetDir, "programming-intro-1.0.0.sha256"), `${digest}  programming-intro-1.0.0.json\n`);
process.stdout.write(`${digest}\n`);
