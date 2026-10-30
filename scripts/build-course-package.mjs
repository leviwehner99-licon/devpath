import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import ts from "typescript";

const root = process.cwd();
const compilerOptions = { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 };
const curriculumSource = await readFile(resolve(root, "src/course-curriculum.ts"), "utf8");
const curriculumCompiled = ts.transpileModule(curriculumSource, { compilerOptions }).outputText;
const curriculumUrl = `data:text/javascript;base64,${Buffer.from(curriculumCompiled).toString("base64")}`;
const source = await readFile(resolve(root, "src/course.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions }).outputText.replace('from "./course-curriculum"', `from "${curriculumUrl}"`);
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
const packageName = `${packageData.id}-${packageData.version}`;
await writeFile(resolve(targetDir, `${packageName}.json`), output);
await writeFile(resolve(targetDir, `${packageName}.sha256`), `${digest}  ${packageName}.json\n`);
process.stdout.write(`${digest}\n`);
