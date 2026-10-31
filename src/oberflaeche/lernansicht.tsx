import { lazy, Suspense, useEffect, useState } from "react";
import type { CourseLesson } from "../kurse/course";
import type { LessonProgress } from "../daten/types";
import { measuredMastery, reviewDate } from "../kurse/planner";

const MonacoEditor = lazy(async () => {
  await import("./monaco");
  return import("@monaco-editor/react");
});

type Props = {
  courseTitle: string;
  lessons: CourseLesson[];
  activeLesson: CourseLesson;
  progress: Record<string, LessonProgress>;
  courseProgress: number;
  code: string;
  isReview?: boolean;
  returnToTopic?: { label: string; action: () => void };
  onSelect: (id: string) => void;
  openLanguageCourse: (courseId: string) => void;
  openNextCourse: (courseId: string) => void;
  onCode: (value: string | undefined) => void;
  onHint: (count: number) => void;
  onAttempt: () => void;
  onComplete: (hintCount: number, passed: boolean, confidence: number) => void;
  openStudio: () => void;
  theme?: "light" | "dark";
};

export function Learn({ courseTitle, lessons, activeLesson, progress, courseProgress, code, isReview = false, returnToTopic, onSelect, openLanguageCourse, openNextCourse, onCode, onHint, onAttempt, onComplete, openStudio, theme = "light" }: Props) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [checked, setChecked] = useState(false);
  const [worksheetChecks, setWorksheetChecks] = useState<number[]>([]);
  const [confidence, setConfidence] = useState(3);
  const [hint, setHint] = useState(0);
  const [reviewStarted, setReviewStarted] = useState(false);

  useEffect(() => {
    setAnswer(null);
    setShowExamples(false);
    setShowMore(false);
    setChecked(false);
    setWorksheetChecks([]);
    setConfidence(3);
    setHint(0);
    setReviewStarted(false);
  }, [activeLesson.id, isReview]);

  const isQuiz = Boolean(activeLesson.knowledgeCheck);
  const isWorksheet = !isQuiz && activeLesson.language === "plaintext";
  const response = isReview && !reviewStarted ? activeLesson.starterCode : code;
  const edited = response.trim() !== activeLesson.starterCode.trim();
  const examples = activeLesson.examples ?? (activeLesson.exampleCode ? [{ title: "Beispiel", code: activeLesson.exampleCode, note: "Gehe jeden Schritt in Ruhe durch." }] : []);
  const sentences = activeLesson.explanation.split(/(?<=[.!?])\s+/);
  const shortExplanation = sentences.slice(0, 2).join(" ");
  const additionalExplanation = sentences.slice(2).join(" ");
  const criteria = activeLesson.acceptanceCriteria ?? activeLesson.projectSteps ?? [
    `Meine Antwort bezieht sich auf: ${activeLesson.title}.`,
    "Ich nenne ein konkretes eigenes Beispiel.",
    "Ich kann meine Entscheidung in eigenen Worten begründen.",
  ];
  const blankFields = isWorksheet ? activeLesson.starterCode.split(/\r?\n/).map((line) => line.match(/^([^:]+):\s*_?\s*$/)?.[1]?.trim()).filter((field): field is string => Boolean(field)) : [];
  const fieldsFilled = blankFields.every((field) => response.split(/\r?\n/).some((line) => line.startsWith(`${field}:`) && line.slice(field.length + 1).trim().replace(/_/g, "").length >= 3));
  const worksheetReady = edited && response.trim().length >= 40 && fieldsFilled && worksheetChecks.length === criteria.length;
  const codeReady = edited && response.trim().length >= 8 && activeLesson.successPattern.test(response);
  const quizReady = answer === activeLesson.knowledgeCheck?.correctIndex;
  const optionCount = activeLesson.knowledgeCheck?.options.length ?? 0;
  const optionShift = optionCount ? [...activeLesson.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % optionCount : 0;
  const optionOrder = Array.from({ length: optionCount }, (_, position) => (position + optionShift) % optionCount);
  const ready = isQuiz ? quizReady : isWorksheet ? worksheetReady : checked && codeReady;
  const index = lessons.findIndex((lesson) => lesson.id === activeLesson.id);
  const nextReview = new Date(reviewDate(confidence, new Date(), measuredMastery(progress[activeLesson.id], true, hint, confidence, Boolean(progress[activeLesson.id]?.completed)))).toLocaleDateString("de-DE", { day: "numeric", month: "long" });

  return <>
    <div className="page-title-row"><div><div className="eyebrow">DEIN KURS</div><h1>{courseTitle}</h1><p className="page-subtitle">Ein Schritt nach dem anderen.</p></div></div>
    <div className="learning-layout">
      <main className="lesson-main panel learn-focus">
        <div className="lesson-meta"><span className="course-chip">{activeLesson.module ?? courseTitle}</span><span>{index + 1} / {lessons.length} · etwa {activeLesson.duration} Min.</span></div>
        <h2>{activeLesson.title}</h2>
        {activeLesson.previousLesson && <p className="learn-bridge"><strong>Das kannst du schon:</strong> {activeLesson.previousLesson.title}. {activeLesson.previousLesson.reminder}</p>}
        {returnToTopic && <button className="text-button learn-back" onClick={returnToTopic.action}>← Zurück zu {returnToTopic.label}</button>}
        {activeLesson.languageCourse && <div className="language-prerequisite lesson-language-link"><strong>{activeLesson.languageCourse.title} brauchst du ab hier.</strong><p>{activeLesson.languageCourse.reason}</p><button className="button secondary" onClick={() => openLanguageCourse(activeLesson.languageCourse!.id)}>{activeLesson.languageCourse.title} lernen →</button></div>}

        {Boolean(activeLesson.definitions?.length) && <section className="learn-terms" aria-label="Neue Begriffe"><strong>Bevor du beginnst</strong><dl>{activeLesson.definitions!.map(({ term, meaning }) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl></section>}
        <div className="learn-goal"><span>DEIN ZIEL</span><p>{activeLesson.objective}</p></div>
        <section className="learn-idea"><h3>Kurz erklärt</h3><p>{shortExplanation}</p>{additionalExplanation && <details><summary>Mehr dazu lesen</summary><p>{additionalExplanation}</p></details>}</section>

        {activeLesson.systemDiagram && <section className="learn-system"><h3>{activeLesson.systemDiagram.title}</h3><pre aria-label={activeLesson.systemDiagram.title}>{activeLesson.systemDiagram.diagram}</pre><p>{activeLesson.systemDiagram.note}</p></section>}

        {activeLesson.visualSteps && <ol className="visual-steps" aria-label="Beispiel Schritt für Schritt">{activeLesson.visualSteps.map((step, stepIndex) => <li key={`${stepIndex}-${step}`}><span>{stepIndex + 1}</span><strong>{step}</strong></li>)}</ol>}

        {activeLesson.languageGuide && <section className="learn-language-guide"><h3>Sprachen und Einsatzgebiete</h3><div className="learn-language-table-wrap"><table><thead><tr><th>Bereich</th><th>Technik</th><th>Aufgabe</th></tr></thead><tbody>{activeLesson.languageGuide.map((item) => <tr key={item.field}><th scope="row">{item.field}</th><td>{item.technology}</td><td>{item.role}</td></tr>)}</tbody></table></div></section>}

        {activeLesson.setup && <section className="learn-setup"><h3>{activeLesson.setup.title}</h3><p>Arbeite die Schritte der Reihe nach ab. Die Befehle laufen im Terminal deines eigenen Projekts.</p><ol>{activeLesson.setup.steps.map((item, stepIndex) => <li key={`${stepIndex}-${item.text}`}><span>{item.text}</span>{item.command && <pre><code>{item.command}</code></pre>}</li>)}</ol><p className="learn-setup-verify"><strong>So prüfst du es:</strong> {activeLesson.setup.verify}</p>{(activeLesson.setup.source ?? activeLesson.resources?.[0]?.url) && <a href={activeLesson.setup.source ?? activeLesson.resources?.[0]?.url} target="_blank" rel="noreferrer noopener">Offizielle Anleitung öffnen ↗</a>}</section>}

        {examples.length > 0 && <section className="learn-examples"><button type="button" className="learn-section-toggle" aria-expanded={showExamples} onClick={() => setShowExamples((value) => !value)}>{showExamples ? "− Beispiel schließen" : "+ Ein Beispiel ansehen"}</button>{showExamples && <>
          <p className="learn-example-purpose">{isQuiz ? "Das Beispiel zeigt die Regel. Danach wählst du die passende Antwort." : isWorksheet ? "Nutze es als Orientierung für deinen eigenen Entwurf." : `Sieh dir an, wie du „${activeLesson.task}“ angehen kannst.`}</p>
          {(showMore ? examples : examples.slice(0, 1)).map((item, sampleIndex) => <article className="learn-example-card" key={`${sampleIndex}-${item.title}`}><h4>{item.title}</h4>{(item.language ?? activeLesson.language) === "plaintext" ? <ol className="learn-story">{item.code.split(/\r?\n/).filter(Boolean).map((line, lineIndex) => <li key={`${lineIndex}-${line}`}>{line}</li>)}</ol> : <pre>{item.code}</pre>}<p>{item.note}</p>{item.walkthrough && <ol className="learn-walkthrough">{item.walkthrough.map((part) => <li key={part}>{part}</li>)}</ol>}</article>)}
          {examples.length > 1 && <button className="text-button" onClick={() => setShowMore((value) => !value)}>{showMore ? "Nur erstes Beispiel zeigen" : "Noch ein Beispiel zeigen"}</button>}
        </>}</section>}

        <section className="learn-task"><div className="eyebrow">JETZT DU</div><h3>{isQuiz ? "Was passt?" : activeLesson.task}</h3>
          {activeLesson.projectSteps && <details className="learn-steps"><summary>Schritte für diese Aufgabe</summary><ol>{activeLesson.projectSteps.map((step) => <li key={step}>{step}</li>)}</ol></details>}
          {isQuiz && activeLesson.knowledgeCheck && <div className="knowledge-check" role="group" aria-label={activeLesson.knowledgeCheck.question}><p><strong>{activeLesson.knowledgeCheck.question}</strong></p>{optionOrder.map((optionIndex, displayIndex) => { const option = activeLesson.knowledgeCheck!.options[optionIndex]; return <button key={option} className={`knowledge-option ${answer === optionIndex ? (optionIndex === activeLesson.knowledgeCheck!.correctIndex ? "correct" : "incorrect") : ""}`} aria-pressed={answer === optionIndex} onClick={() => { if (answer !== optionIndex && optionIndex !== activeLesson.knowledgeCheck!.correctIndex) onAttempt(); setAnswer(optionIndex); }}><span>{String.fromCharCode(65 + displayIndex)}</span>{option}</button>; })}{answer !== null && <p className={`knowledge-feedback ${quizReady ? "correct" : "incorrect"}`} role="status">{quizReady ? activeLesson.knowledgeCheck.explanation : "Noch nicht. Sieh dir den Ablauf oben an und versuche es erneut."}</p>}</div>}
          {isWorksheet && <div className="learn-worksheet"><p>Halte deine Idee fest. Bei offenen Projektentscheidungen kann die App den Inhalt nicht zuverlässig benoten. Nutze die Punkte darunter zur eigenen Prüfung.</p><textarea className="lesson-text-answer" rows={7} aria-label="Dein Projektentwurf" value={response} onChange={(event) => { setReviewStarted(true); onCode(event.target.value); }} /><div className="learn-checklist"><strong>Prüfe deinen Entwurf</strong>{criteria.map((criterion, criterionIndex) => <label key={`${criterionIndex}-${criterion}`}><input type="checkbox" checked={worksheetChecks.includes(criterionIndex)} onChange={() => setWorksheetChecks((selected) => selected.includes(criterionIndex) ? selected.filter((item) => item !== criterionIndex) : [...selected, criterionIndex])} />{criterion}</label>)}</div><small>{!edited ? "Schreibe zuerst deinen eigenen Entwurf." : !fieldsFilled ? "Fülle die vorgegebenen Felder aus." : response.trim().length < 40 ? "Beschreibe deine Idee noch etwas konkreter." : worksheetChecks.length < criteria.length ? "Gehe die Prüfpunkte durch." : "Entwurf gespeichert. Du kannst weitergehen und später zurückkehren."}</small></div>}
          {!isQuiz && !isWorksheet && <div className="learn-code"><p>Schreibe oder ändere den Code für diese Aufgabe. Der Check sucht wichtige Bestandteile; er führt den Code noch nicht aus.</p><div className="mini-editor"><Suspense fallback={<div className="editor-loading" role="status">Code-Editor wird geladen …</div>}><MonacoEditor height="260px" language={activeLesson.language} theme={theme === "dark" ? "vs-dark" : "vs"} value={response} onChange={(value) => { setChecked(false); setReviewStarted(true); onCode(value); }} options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on", automaticLayout: true, ariaLabel: `${activeLesson.language}-Aufgabe bearbeiten` }} /></Suspense></div><div className="learn-check-action"><button type="button" className="button secondary" onClick={() => { setChecked(true); if (!codeReady) onAttempt(); }}>Code prüfen</button><span role="status">{!checked ? "" : codeReady ? "✓ Erwarteter Baustein gefunden. Prüfe auch das Ergebnis." : "Noch nicht vollständig. Vergleiche deine Lösung mit der Aufgabe."}</span></div><button className="text-button" onClick={openStudio}>Im Code Studio öffnen →</button></div>}
        </section>

        {activeLesson.resources && <details className="lesson-resources"><summary>Offizielle Anleitungen</summary><ul>{activeLesson.resources.map((resource) => <li key={resource.url}><a href={resource.url} target="_blank" rel="noreferrer noopener">{resource.label} ↗</a></li>)}</ul></details>}
        <div className="learn-bottom"><div className="learn-confidence"><strong>Wie sicher fühlst du dich?</strong><div className="confidence-options" role="group" aria-label="Sicherheit für die Wiederholung">{[{ value: 1, label: "Noch unsicher" }, { value: 3, label: "Teils sicher" }, { value: 5, label: "Sicher" }].map((choice) => <button type="button" key={choice.value} className={confidence === choice.value ? "selected" : ""} aria-pressed={confidence === choice.value} onClick={() => setConfidence(choice.value)}>{choice.label}</button>)}</div><small>Nächste Wiederholung: {nextReview}</small></div><button className="button primary" disabled={!ready} onClick={() => onComplete(hint, ready, confidence)}>{progress[activeLesson.id]?.completed ? "Wiederholung abschließen" : "Weiter zur nächsten Lektion"}</button></div>
        {courseTitle === "Einstieg in die Programmierung" && index === lessons.length - 1 && progress[activeLesson.id]?.completed && <section className="learn-next-course"><h3>Was möchtest du als Nächstes bauen?</h3><p>Wähle ein Thema. Der Kurs führt dich später zur passenden Programmiersprache.</p><div>{[["web-development", "🌐 Eine Website"], ["game-development", "🎮 Ein Spiel"], ["backend", "🗄️ Einen Server"], ["ai", "📊 Ein KI-Modell"], ["security", "🔐 Sicherheit prüfen"]].map(([id, label]) => <button className="button secondary" key={id} onClick={() => openNextCourse(id)}>{label}</button>)}</div></section>}
        {!isQuiz && <div className="learn-help"><button className="text-button" onClick={() => { const next = Math.min(2, hint + 1); setHint(next); onHint(next); }}>Hinweis anzeigen</button>{hint > 0 && <p role="status">{hint === 1 ? activeLesson.objective : activeLesson.takeaway ?? `Sieh dir das Beispiel zu „${activeLesson.title}“ noch einmal an.`}</p>}</div>}
      </main>

      <aside className="lesson-sidebar"><section className="panel side-panel learn-outline"><div className="eyebrow">DEIN FORTSCHRITT</div><div className="course-progress"><div className="progress-line"><span style={{ width: `${courseProgress}%` }} /></div><span>{courseProgress}%</span></div><p>Jetzt: {activeLesson.title}</p><details><summary>Alle Lektionen ansehen</summary><ol className="lesson-list">{lessons.map((lesson, lessonIndex) => <li key={lesson.id} className={`${lesson.id === activeLesson.id ? "active" : ""} ${progress[lesson.id]?.completed ? "done" : ""}`}><button onClick={() => onSelect(lesson.id)} aria-current={lesson.id === activeLesson.id ? "step" : undefined}><span>{progress[lesson.id]?.completed ? "✓" : lessonIndex + 1}</span>{lesson.title}</button></li>)}</ol></details></section></aside>
    </div>
  </>;
}
