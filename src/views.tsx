import { Fragment, lazy, Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import type { CourseLesson } from "./course";
import type { DevPathState, LessonProgress, LocalProject, SavedVersion } from "./types";
import { defaultStudyDays, studyTimeLabel, weekdays, type PlanRecommendation } from "./planner";
import { editorLanguage } from "./projects";

const MonacoEditor = lazy(async () => {
  await import("./monaco");
  return import("@monaco-editor/react");
});

function Editor(props: React.ComponentProps<typeof MonacoEditor>) {
  return <Suspense fallback={<div className="editor-loading" role="status">Code-Editor wird geladen …</div>}><MonacoEditor {...props} /></Suspense>;
}

function PageTitle({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="page-title-row"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{subtitle && <p className="page-subtitle">{subtitle}</p>}</div>{action}</div>;
}

export function Onboarding({ onFinish }: { onFinish: (values: { learnerName: string; goal: string; experience: DevPathState["experience"]; weeklySessions: number; studyDays: number[]; studyTime: string; sessionMinutes: number }) => Promise<{ ok: boolean; detail?: string }> }) {
  const [learnerName, setLearnerName] = useState("");
  const [goal, setGoal] = useState("Programmieren von Grund auf lernen");
  const [experience, setExperience] = useState<DevPathState["experience"]>("new");
  const [studyDays, setStudyDays] = useState<number[]>(defaultStudyDays(3));
  const [studyTime, setStudyTime] = useState("flexible");
  const [sessionMinutes, setSessionMinutes] = useState(20);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const toggleDay = (day: number) => {
    const next = studyDays.includes(day) ? studyDays.filter((value) => value !== day) : [...studyDays, day].sort();
    if (!next.length || next.length > 7) return;
    setStudyDays(next);
  };
  const submit = async () => {
    if (saving) return;
    if (!learnerName.trim()) {
      setSubmitError("Bitte gib zuerst deinen Namen ein, damit dein persönlicher Lehrplan erstellt werden kann.");
      return;
    }
    setSaving(true);
    setSubmitError("");
    try {
      const saved = await onFinish({ learnerName: learnerName.trim(), goal, experience, weeklySessions: studyDays.length, studyDays, studyTime, sessionMinutes });
      if (!saved.ok) setSubmitError(saved.detail ? `Der Lernplan konnte nicht gespeichert werden. Technische Ursache: ${saved.detail}` : "Der Lernplan konnte noch nicht gespeichert werden. Die Startabfrage bleibt geöffnet. Bitte versuche es erneut.");
    } catch {
      setSubmitError("Der Lernplan konnte gerade nicht erstellt werden. Deine Angaben sind noch da. Bitte versuche es erneut.");
    }
    finally { setSaving(false); }
  };
  const goals = [
    ["Programmieren von Grund auf lernen", "Grundlagen verstehen und Schritt für Schritt erste Programme schreiben."],
    ["Webseiten und Webanwendungen bauen", "Mit interaktiven Oberflächen und Browserprojekten starten."],
    ["Server und APIs entwickeln", "Backend, Datenbank und sichere Serverregeln verstehen."],
    ["Spiele entwickeln", "Spielregeln programmieren und mit einer Engine umsetzen."],
    ["Künstliche Intelligenz verstehen", "Daten, Modelltraining und Bewertung praktisch lernen."],
    ["IT-Sicherheit lernen", "Schwachstellen und Schutzmaßnahmen in eigenen Übungen prüfen."],
    ["Eigene Softwareprojekte umsetzen", "Programmieren lernen, um eine eigene Idee in Code zu verwandeln."],
    ["Mich auf den Berufseinstieg vorbereiten", "Grundlagen festigen und später ein Portfolio aufbauen."],
  ];
  return <div className="modal-backdrop onboarding-backdrop"><section className="dialog onboarding-dialog" role="dialog" aria-modal="true" aria-labelledby="onboarding-title"><div className="eyebrow">DEIN START · EINMALIG AUF DIESEM GERÄT</div><h2 id="onboarding-title">Dein Lernplan beginnt mit dir.</h2><p>Ein paar kurze Angaben helfen CodeZone, einen passenden Einstieg vorzuschlagen. Dein Profil, Lernplan, Code und Projekte bleiben lokal auf diesem Gerät.</p><label className="field-label">Wie dürfen wir dich nennen?<input className="text-input" autoFocus required maxLength={32} value={learnerName} onChange={(event) => { setLearnerName(event.target.value); setSubmitError(""); }} placeholder="Dein Name" /></label><fieldset className="goal-options"><legend className="field-label">Was möchtest du als Erstes erreichen?</legend>{goals.map(([value, description]) => <label className={`goal-option ${goal === value ? "selected" : ""}`} key={value}><input type="radio" name="learner-goal" value={value} checked={goal === value} onChange={() => setGoal(value)} /><span><strong>{value}</strong><small>{description}</small></span></label>)}</fieldset><label className="field-label">Wie viel Erfahrung hast du?<select className="text-input" value={experience} onChange={(event) => setExperience(event.target.value as DevPathState["experience"])}><option value="new">Ich fange gerade an</option><option value="some">Ich kenne schon Grundlagen</option><option value="experienced">Ich programmiere bereits regelmäßig</option></select></label><fieldset className="schedule-days"><legend className="field-label">An welchen Tagen passt Lernen für dich? <span className="field-note">{studyDays.length} {studyDays.length === 1 ? "Tag" : "Tage"} pro Woche ausgewählt</span></legend>{weekdays.map((day, index) => <label key={day}><input type="checkbox" checked={studyDays.includes(index)} disabled={studyDays.length === 1 && studyDays.includes(index)} onChange={() => toggleDay(index)} />{day}</label>)}</fieldset><fieldset className="time-of-day-options"><legend className="field-label">Zu welcher Tageszeit lernst du lieber?</legend><div className="time-of-day-grid">{[{ value: "flexible", title: "Flexibel", description: "Keine feste Zeit" }, { value: "morning", title: "Morgens", description: "Früh am Tag" }, { value: "afternoon", title: "Nachmittags", description: "Zwischen Mittag und Abend" }, { value: "evening", title: "Abends", description: "Später am Tag" }].map((option) => <label className={`time-of-day-option ${studyTime === option.value ? "selected" : ""}`} key={option.value}><input type="radio" name="study-time-of-day" value={option.value} checked={studyTime === option.value} onChange={() => setStudyTime(option.value)} /><span><strong>{option.title}</strong><small>{option.description}</small></span></label>)}</div><p className="field-note">Nur eine grobe Präferenz, kein fester Termin. Es gibt keine Benachrichtigungen.</p></fieldset><label className="field-label">Wie lange passt eine Einheit?<select className="text-input" value={sessionMinutes} onChange={(event) => setSessionMinutes(Number(event.target.value))}>{[10,15,20,30,45,60].map((value) => <option key={value} value={value}>{value} Minuten</option>)}</select></label>{submitError && <p className="onboarding-error" role="alert">{submitError}</p>}<div className="onboarding-actions"><button className="button primary" disabled={saving} onClick={() => void submit()}>{saving ? "Lehrplan wird erstellt …" : "Lehrplan erstellen →"}</button></div></section></div>;
}

export function Today({ courseTitle, courseLessonCount, state, progress, completedCount, recommendation, start, edit }: { courseTitle: string; courseLessonCount: number; state: DevPathState; progress: number; completedCount: number; recommendation: PlanRecommendation; start: () => void; edit: () => void }) {
  return <>
    <PageTitle eyebrow="MIT DEINEM LERNPFAD" title={`Schön, dass du da bist, ${state.learnerName}.`} subtitle="Ein kleiner Schritt bringt dich deinem Ziel näher." action={<button className="button secondary" onClick={edit}>Plan anpassen</button>} />
    <section className="hero-card"><div className="hero-copy"><div className="pill"><span className="pill-dot" /> {recommendation.isReview ? "KURZE WIEDERHOLUNG" : "DEIN NÄCHSTER SCHRITT"}</div><h2>{recommendation.lesson.title}</h2><p className="muted">{recommendation.lesson.language.toUpperCase()} · {recommendation.lesson.duration} Minuten</p><p className="objective">{recommendation.lesson.objective}</p><p className="recommendation-reason">Warum dieser Schritt? {recommendation.reason}</p><button className="button primary" onClick={start}>Lektion starten<span aria-hidden="true"> →</span></button></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="code-tile">&lt;/&gt;</div><div className="spark spark-a">✦</div><div className="spark spark-b">✳</div></div></section>
    <div className="dashboard-grid"><section className="panel plan-panel"><div className="panel-heading"><div><div className="eyebrow">DEIN RHYTHMUS</div><h2>Ein Plan, der zu dir passt</h2></div><span className="soft-icon">◷</span></div><p>Vorgeschlagen: <strong>{state.weeklySessions} Einheiten pro Woche</strong>, je etwa <strong>{state.sessionMinutes} Minuten</strong>.</p><div className="week-row">{["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day, index) => <div className="day" key={day}><span>{day}</span><i className={state.studyDays.includes(index) ? "planned" : ""} /></div>)}</div><p className="field-note">Deine Lerntage: {state.studyDays.map((day) => weekdays[day].slice(0, 2)).join(", ")} · bevorzugt {studyTimeLabel(state.studyTime)}. Es gibt keine Benachrichtigungen außerhalb der App.</p><button className="text-button" onClick={edit}>Lernrhythmus ändern <span>→</span></button></section>
      <section className="panel progress-panel"><div className="panel-heading"><div><div className="eyebrow">DEIN FORTSCHRITT</div><h2>Du machst das in deinem Tempo</h2></div><span className="soft-icon">✦</span></div><div className="progress-line"><span style={{ width: `${progress}%` }} /></div><div className="progress-meta"><span>{completedCount} von {courseLessonCount} Lernzielen abgeschlossen</span><strong>{progress}%</strong></div><p className="small-note">Pausen sind Teil des Lernens. Dein Lernplan bleibt lokal und lässt sich jederzeit ändern.</p></section></div>
    <section className="section-block"><div className="section-heading"><div><div className="eyebrow">DEIN LERNZIEL</div><h2>{state.goal}</h2></div><span className="course-chip">{completedCount}/{courseLessonCount} Schritte</span></div><div className="path-preview"><span className={`path-node ${completedCount ? "done" : "current"}`}>{completedCount ? "✓" : "1"}</span><div className="path-copy"><strong>{courseTitle}</strong><span>{courseLessonCount} praktische Lernziele im aktuellen Lernpfad</span></div><span className="path-duration">{courseLessonCount} Lernziele</span></div></section>
  </>;
}

export function Diploma({ course, completedAt, completedCount, reducedMotion }: { course: { title: string; lessons: CourseLesson[] }; completedAt?: string; completedCount: number; reducedMotion: boolean }) {
  const total = course.lessons.length;
  const earned = Boolean(completedAt) && completedCount === total;
  return <><PageTitle eyebrow="DEIN ERFOLG" title="Diplom" subtitle="Deine Lernnachweise bleiben auf diesem Gerät." />{earned ? <section className={`panel diploma-card ${reducedMotion ? "reduced" : ""}`}><div className="diploma-decoration" aria-hidden="true">✧</div><div className="eyebrow">CodeZone · LERNERFOLG</div><h2>{course.title}</h2><p>Verliehen für den Abschluss des Lernpfads „{course.title}“.</p><div className="diploma-seal">✓</div><div className="diploma-footer"><span>{new Date(completedAt!).toLocaleDateString()}</span><span>{completedCount} von {total} Lernzielen</span></div><p className="small-note">Dieses lokale Lerndiplom ist kein staatlich oder beruflich anerkanntes Zertifikat.</p></section> : <section className="panel diploma-locked"><div className="large-soft-icon">✧</div><h2>Dein Diplom wartet auf dich</h2><p>Schließe alle {total} Lernziele von „{course.title}“ ab. Bisher erreicht: {completedCount} von {total}.</p><div className="progress-line"><span style={{ width: `${Math.round(completedCount / total * 100)}%` }} /></div></section>}</>;
}

export function Learn({ courseTitle, lessons, activeLesson, progress, courseProgress, code, isReview = false, returnToTopic, onSelect, openLanguageCourse, onCode, onHint, onAttempt, onComplete, openStudio, theme = "light" }: { courseTitle: string; lessons: CourseLesson[]; activeLesson: CourseLesson; progress: Record<string, LessonProgress>; courseProgress: number; code: string; isReview?: boolean; returnToTopic?: { label: string; action: () => void }; onSelect: (id: string) => void; openLanguageCourse: (courseId: string) => void; onCode: (value: string | undefined) => void; onHint: (hintCount: number) => void; onAttempt: () => void; onComplete: (hintCount: number, passed: boolean, confidence: number) => void; openStudio: () => void; theme?: "light" | "dark" }) {
  const [hint, setHint] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRecallAnswer, setShowRecallAnswer] = useState(false);
  const [confidence, setConfidence] = useState(3);
  const [reviewStarted, setReviewStarted] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  useEffect(() => { setHint(0); setSelectedAnswer(null); setShowRecallAnswer(false); setConfidence(3); setReviewStarted(false); setShowExamples(false); }, [activeLesson.id, isReview]);
  const shownCode = isReview && !reviewStarted ? activeLesson.starterCode : code;
  const hasEditedStarter = shownCode.trim() !== activeLesson.starterCode.trim();
  const passed = activeLesson.practice === false
    ? selectedAnswer === activeLesson.knowledgeCheck?.correctIndex
    : hasEditedStarter && activeLesson.successPattern.test(shownCode);
  const examples = activeLesson.examples ?? (activeLesson.exampleCode
    ? [{ title: "Beispiel", code: activeLesson.exampleCode, note: "Lies den Code von oben nach unten und verfolge, welcher Wert jeweils entsteht." }]
    : []);
  const currentIndex = lessons.findIndex((lesson) => lesson.id === activeLesson.id);

  return <>
    <PageTitle eyebrow="DEIN LERNPFAD" title="Lernen" subtitle="Eine Lektion nach der anderen. Erst verstehen, dann üben." />
    <div className="learning-layout">
      <section className="lesson-main panel">
        <div className="lesson-meta"><span className="course-chip">{activeLesson.module ?? courseTitle}</span><span>LEKTION {currentIndex + 1} VON {lessons.length} · {activeLesson.duration} MIN</span></div>
        <h2>{activeLesson.title}</h2>
        {returnToTopic && <button className="button secondary" onClick={returnToTopic.action}>← Zurück zu {returnToTopic.label}</button>}
        {activeLesson.languageCourse && <section className="language-prerequisite lesson-language-link"><div className="eyebrow">SPRACHKURS DIREKT ERREICHEN</div><div className="language-link-copy"><div><h3>{activeLesson.languageCourse.title} lernen, dann hier anwenden</h3><p>{activeLesson.languageCourse.reason}</p></div><button className="button secondary" onClick={() => openLanguageCourse(activeLesson.languageCourse!.id)}>Zum {activeLesson.languageCourse.title}-Kurs →</button></div></section>}
        <ol className="learning-sequence" aria-label="Ablauf dieser Lektion"><li><span>1</span>Verstehen</li><li><span>2</span>Beispiel ansehen</li><li><span>3</span>Selbst anwenden</li><li><span>4</span>Ergebnis prüfen</li></ol>
        <div className="objective-card"><span className="objective-icon">◎</span><div><strong>Das lernst du hier</strong><p>{activeLesson.objective}</p></div></div>
        <section className="lesson-explanation"><div className="eyebrow">1 · VERSTEHEN</div><h3>Die Idee hinter dem Code</h3><p>{activeLesson.explanation}</p></section>
        {examples.length > 0 && <section className="lesson-examples"><div className="eyebrow">2 · AM BEISPIEL LERNEN</div><h3>Erst vermuten, dann prüfen</h3><p>Überlege kurz: Welche Eingabe wird verwendet und welches Ergebnis erwartest du? Öffne danach das Beispiel und vergleiche deine Vermutung.</p><button type="button" className="button secondary" aria-expanded={showExamples} onClick={() => setShowExamples((shown) => !shown)}>{showExamples ? "Beispiele ausblenden" : "Beispiele und Erklärung zeigen"}</button>{showExamples && examples.map((item, index) => <article className="lesson-example" key={item.title + index}><div className="lesson-example-heading"><strong>{item.title}</strong><span>{(item.language ?? activeLesson.language).toUpperCase()}</span></div><pre>{item.code}</pre><p>{item.note}</p>{item.walkthrough && <div className="code-walkthrough"><strong>Zeile für Zeile erklärt</strong><ol>{item.walkthrough.map((step, stepIndex) => <li key={`${stepIndex}-${step}`}><code>{item.code.split(/\r?\n/).filter((sourceLine) => sourceLine.trim())[stepIndex]}</code><span>{step}</span></li>)}</ol></div>}<p className="example-prediction"><strong>Ergebnis prüfen:</strong> Was kam hinein, was kam heraus und welche Zeile war entscheidend?</p></article>)}</section>}
        {activeLesson.resources && <section className="lesson-resources"><strong>Offizielle Anleitung und nächste Schritte</strong><ul>{activeLesson.resources.map((resource) => <li key={resource.url}><a href={resource.url} target="_blank" rel="noreferrer noopener">{resource.label} ↗</a></li>)}</ul></section>}
        {activeLesson.takeaway && <aside className="lesson-takeaway"><strong>Merke</strong><p>{activeLesson.takeaway}</p></aside>}
        {activeLesson.resultPreview && <section className="project-result-card"><div className="eyebrow">ABSCHLUSSPROJEKT · SICHTBARES ERGEBNIS</div><h3>{activeLesson.resultPreview.title}</h3><p>{activeLesson.resultPreview.summary}</p><ul>{activeLesson.resultPreview.checks.map((item) => <li key={item}>{item}</li>)}</ul><button className="button secondary" onClick={openStudio}>Eigenes Projekt im Code Studio ansehen →</button></section>}
        <section className="lesson-practice"><div className="exercise-heading"><div><div className="eyebrow">3 · JETZT DU</div><h3>{activeLesson.task}</h3></div><span className="local-badge">● lokal</span></div>
          {activeLesson.projectSteps && <div className="project-steps"><strong>Arbeite in diesen kleinen Schritten</strong><ol>{activeLesson.projectSteps.map((step) => <li key={step}>{step}</li>)}</ol>{activeLesson.acceptanceCriteria && <><strong className="acceptance-heading">Woran du den Erfolg erkennst</strong><ul>{activeLesson.acceptanceCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></>}</div>}
          {activeLesson.knowledgeCheck ? <div className="knowledge-check" role="group" aria-label={activeLesson.knowledgeCheck.question}>
            <p><strong>{activeLesson.knowledgeCheck.question}</strong></p>
            {activeLesson.knowledgeCheck.options.map((option, index) => <button key={option} className={`knowledge-option ${selectedAnswer === index ? (index === activeLesson.knowledgeCheck!.correctIndex ? "correct" : "incorrect") : ""}`} aria-pressed={selectedAnswer === index} onClick={() => { if (index !== selectedAnswer && index !== activeLesson.knowledgeCheck!.correctIndex) onAttempt(); setSelectedAnswer(index); }}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}
            {selectedAnswer !== null && <p className={`knowledge-feedback ${passed ? "correct" : "incorrect"}`} role="status">{passed ? "Richtig. " : "Noch nicht. "}{activeLesson.knowledgeCheck.explanation}</p>}
          </div> : <>
            <p className="practice-instructions">Nutze die Erklärung und Beispiele als Hilfe. Ändere den Startcode und prüfe, ob du die Aufgabe selbst erklären kannst.</p>
            <div className="mini-editor"><Editor height="260px" language={activeLesson.language} theme={theme === "dark" ? "vs-dark" : "vs"} value={shownCode} onChange={(value) => { setReviewStarted(true); onCode(value); }} options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on", automaticLayout: true, ariaLabel: `${activeLesson.language.toUpperCase()}-Aufgabe bearbeiten` }} /></div>
            <div className="lesson-check" role="status"><span className={passed ? "check-good" : "check-pending"}>{passed ? "✓" : "○"}</span>{passed ? "Deine eigene Bearbeitung enthält den erwarteten Baustein. Prüfe zusätzlich Beispiele und Randfälle." : !hasEditedStarter ? "Bearbeite den Startcode selbst. Die Aufgabe gilt nicht schon beim Öffnen als erledigt." : "Ergänze noch den passenden Baustein und vergleiche dein Ergebnis mit den Beispielen."}</div>
          </>}
        </section>
        <div className="hint-row"><button className="button secondary" onClick={() => { const next = Math.min(hint + 1, 2); setHint(next); onHint(next); }}>Hinweis {hint ? `(${hint}/2)` : "anzeigen"}</button>{activeLesson.practice !== false && <button className="text-button" onClick={openStudio}>Im Code Studio öffnen →</button>}</div>
        {hint > 0 && <div className="hint-box" role="status">{hint === 1 ? `Tipp: Lies zuerst die Erklärung zu „${activeLesson.title}“ und prüfe danach das erste Beispiel.` : `Vergleiche deinen Ansatz mit allen Beispielen. Achte besonders auf: ${activeLesson.takeaway ?? activeLesson.objective}`}</div>}
        <section className="retrieval-card" aria-label="Wissen aus dem Gedächtnis abrufen">
          <div className="eyebrow">5 · WISSEN FESTIGEN</div><p>{activeLesson.retrievalPrompt ?? "Rufe nach Erklärung und Übung die wichtigste Regel noch einmal aus dem Gedächtnis ab. Wenn du nichts notieren möchtest, kannst du direkt fortfahren."}</p>
          <textarea key={activeLesson.id} className="retrieval-answer" rows={2} aria-label="Deine Erinnerung oder Vermutung" placeholder="Stichworte reichen. Du kannst auch direkt weitermachen." />
          <button className="text-button" onClick={() => setShowRecallAnswer((shown) => !shown)}>{showRecallAnswer ? "Antwort schließen" : currentIndex > 0 ? "Mit der vorherigen Lektion vergleichen" : "Lernziel anzeigen"}</button>
          {showRecallAnswer && <p className="recall-answer" role="status">{activeLesson.retrievalAnswer ?? activeLesson.objective}</p>}
        </section>
        <section className="confidence-check"><strong>Wie sicher könntest du das morgen ohne Hilfe wiederholen?</strong><div role="group" aria-label="Sicherheit für die Wiederholung" className="confidence-options">{[{ value: 1, label: "Noch unsicher" }, { value: 3, label: "Teils sicher" }, { value: 5, label: "Sicher" }].map((item) => <button type="button" key={item.value} className={confidence === item.value ? "selected" : ""} aria-pressed={confidence === item.value} onClick={() => setConfidence(item.value)}>{item.label}</button>)}</div><small>Deine Einschätzung legt den nächsten Wiederholungstermin fest. Unsicher heißt nur: Wir üben es früher noch einmal.</small></section>
        <div className="lesson-footer"><span className="muted">{progress[activeLesson.id]?.completed ? "Bereits abgeschlossen · Wiederholung ist willkommen." : activeLesson.practice === false ? "Beantworte den Wissenscheck, um weiterzugehen." : "Der Strukturcheck ersetzt keinen Compiler oder vollständigen Test. Prüfe deinen Code zusätzlich selbst."}</span><button className="button primary" disabled={!passed} onClick={() => onComplete(hint, passed, confidence)}>{passed ? (progress[activeLesson.id]?.completed ? "Wiederholung abschließen" : "Lernziel abschließen") : "Erst Aufgabe bearbeiten"}</button></div>
      </section>
      <aside className="lesson-sidebar"><section className="panel side-panel"><div className="eyebrow">KURSÜBERSICHT</div><h3>{courseTitle}</h3><div className="course-progress"><div className="progress-line"><span style={{ width: `${courseProgress}%` }} /></div><span>{courseProgress}%</span></div><ol className="lesson-list">{lessons.map((lesson, index) => <Fragment key={lesson.id}>{lesson.module !== (index > 0 ? lessons[index - 1].module : undefined) && <li className="lesson-module-label">{lesson.module ?? "Lernweg"}</li>}<li className={`${lesson.id === activeLesson.id ? "active" : ""} ${progress[lesson.id]?.completed ? "done" : ""}`}><button onClick={() => onSelect(lesson.id)} aria-current={lesson.id === activeLesson.id ? "step" : undefined}><span>{progress[lesson.id]?.completed ? "✓" : index + 1}</span>{lesson.title}</button></li></Fragment>)}</ol></section></aside>
      <aside className="lesson-sidebar"><section className="panel side-panel"><div className="eyebrow">KURSÜBERSICHT</div><h3>{courseTitle}</h3><div className="course-progress"><div className="progress-line"><span style={{ width: `${courseProgress}%` }} /></div><span>{courseProgress}%</span></div><ol className="lesson-list">{lessons.map((lesson, index) => <Fragment key={lesson.id}>{lesson.module !== (index > 0 ? lessons[index - 1].module : undefined) && <li className="lesson-module-label">{lesson.module ?? "Lernweg"}</li>}<li className={`${lesson.id === activeLesson.id ? "active" : ""} ${progress[lesson.id]?.completed ? "done" : ""}`}><button onClick={() => onSelect(lesson.id)} aria-current={lesson.id === activeLesson.id ? "step" : undefined}><span>{progress[lesson.id]?.completed ? "✓" : index + 1}</span>{lesson.title}</button></li></Fragment>)}</ol></section>
      </aside>
    </div>
  </>;
}
export function Studio({ lesson, projects, activeProject, activeFile, code, onCode, onSelectProject, onCreateProject, onAddFile, onDeleteFile, onImportProject, onDeleteProject, onRenameProject, onExportProject, onRun, onAsk, onSelectFile, theme = "light" }: { lesson: CourseLesson; projects: LocalProject[]; activeProject: LocalProject; activeFile: string; code: string; onCode: (path: string, value: string | undefined) => void; onSelectProject: (projectId: string) => void; onSelectFile: (path: string) => void; onCreateProject: (name: string) => void; onAddFile: (path: string) => void; onDeleteFile: (path: string) => void; onImportProject: (file: File) => void; onDeleteProject: (projectId: string) => void; onRenameProject: (projectId: string) => void; onExportProject: () => void; onRun: () => void; onAsk: () => void; theme?: "light" | "dark" }) {
  const importRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);
  const runProject = () => { if (activeProject.files["index.html"] !== undefined || activeFile.toLowerCase().endsWith(".html")) setPreview(true); else onRun(); };
  const createProject = () => { const name = window.prompt("Wie soll das neue Projekt heißen?"); if (name?.trim()) onCreateProject(name); };
  const addFile = () => { const path = window.prompt("Relativer Dateipfad, zum Beispiel src/app.js oder styles.css"); if (path?.trim()) onAddFile(path); };
  return <>
    <PageTitle eyebrow="DEINE LOKALE ARBEITSFLÄCHE" title="Code Studio" subtitle="Mehrdateien-Projekte bleiben lokal auf diesem Gerät." action={<div className="studio-actions"><button className="button secondary" onClick={createProject}>Neues Projekt</button><button className="button secondary" onClick={() => importRef.current?.click()}>Projekt importieren</button><button className="button primary" onClick={runProject}>▶ Vorschau starten</button><input ref={importRef} hidden type="file" accept=".codezone-project.json,.devpath-project.json,.json,application/json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onImportProject(file); event.currentTarget.value = ""; }} /></div>} />
    <div className="studio-toolbar"><div className="project-title"><span className="file-icon">⌘</span><div><strong>{activeProject.name}</strong><span>{activeProject.language.toUpperCase()} · {Object.keys(activeProject.files).length} Dateien · lokal gespeichert</span></div></div><div className="studio-toolbar-actions"><label className="sr-only" htmlFor="active-project">Aktives Projekt</label><select id="active-project" className="text-input project-select" value={activeProject.id} onChange={(event) => onSelectProject(event.target.value)}>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select><button className="button secondary" onClick={() => onRenameProject(activeProject.id)}>Umbenennen</button><button className="button secondary" onClick={onExportProject}>Projekt exportieren</button><button className="button danger-outline" onClick={() => onDeleteProject(activeProject.id)}>Projekt löschen</button></div></div>
    <div className="studio-layout project-studio-layout"><section className="editor-panel panel project-editor"><aside className="project-tree" aria-label="Projektdateien"><div className="project-tree-heading"><strong>Dateien</strong><div><button className="text-button" onClick={addFile} aria-label="Datei anlegen">+ Datei</button><button className="text-button" disabled={Object.keys(activeProject.files).length <= 1} onClick={() => onDeleteFile(activeFile)} aria-label={`${activeFile} löschen`}>Löschen</button></div></div>{Object.keys(activeProject.files).sort((a, b) => a.localeCompare(b)).map((path) => <button className={`project-file ${path === activeFile ? "selected" : ""}`} key={path} onClick={() => onSelectFile(path)} aria-current={path === activeFile ? "page" : undefined}><span aria-hidden="true">{path.endsWith(".css") ? "◇" : path.endsWith(".html") ? "<>" : "▤"}</span>{path}</button>)}<p className="project-tree-note">Importe und Exporte enthalten nur Textdateien bis 5 MB. Geheimdateien und Buildordner sind gesperrt.</p></aside><div className="project-editor-main"><div className="editor-tab"><span className="html-icon">&lt;/&gt;</span> {activeFile}<span className="tab-close" aria-label="lokal gespeichert">●</span></div><Editor height="min(62vh, 620px)" language={editorLanguage(activeFile)} theme={theme === "dark" ? "vs-dark" : "vs"} value={code} onChange={(value) => onCode(activeFile, value)} options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", scrollBeyondLastLine: false, wordWrap: "on", automaticLayout: true, ariaLabel: `${activeFile} bearbeiten`, padding: { top: 14 } }} /></div></section><aside className="studio-side">{activeProject.linkedLessonId === lesson.id && <section className="panel task-panel"><div className="eyebrow">AKTIVE LERNAUFGABE</div><h2>{lesson.title}</h2><p>{lesson.objective}</p><button className="button secondary full" onClick={onAsk}>Hinweis zur Aufgabe</button></section>}<section className="panel task-panel"><div className="eyebrow">SICHERE CODEAUSFÜHRUNG</div><div className="safe-run"><span>⛨</span><div><strong>Runner-Freigabe ausstehend</strong><p>Code wird erst gestartet, wenn die Sandboxprüfung für dein System bestanden ist.</p></div></div><button className="button secondary full" onClick={runProject}>{activeProject.files["index.html"] !== undefined ? "Sichere HTML-Vorschau starten" : "Status anzeigen"}</button></section><section className="panel tutor-panel"><div className="tutor-header"><span className="tutor-spark">✦</span><div><strong>CodeZone Tutor</strong><span>Erklärt, statt ungefragt zu ändern</span></div></div><p>Hinweise basieren auf lokalen Kursinhalten. Im Phase-2-Grundgerüst werden keine Projektdateien an ein Modell gesendet.</p><div className="privacy-caption">Dein Code bleibt auf diesem Gerät.</div></section></aside></div>{preview && <div className="modal-backdrop preview-backdrop"><section className="dialog preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title"><div className="preview-heading"><div><div className="eyebrow">LOKAL · OHNE JAVASCRIPT</div><h2 id="preview-title">Vorschau: {activeProject.name}</h2></div><button className="button secondary" onClick={() => setPreview(false)}>Schließen</button></div><iframe title="Isolierte HTML-Vorschau" sandbox="" referrerPolicy="no-referrer" srcDoc={safePreviewDocument(activeProject.files)} /></section></div>}
  </>;
}

function safePreviewDocument(files: Record<string, string>): string {
  let html = files["index.html"] ?? Object.entries(files).find(([path]) => path.toLowerCase().endsWith(".html"))?.[1] ?? "<main><h1>Keine HTML-Datei gefunden</h1></main>";
  const css = (files["styles.css"] ?? files["style.css"] ?? "").replace(/<\/style/gi, "<\\/style");
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "").replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline' data:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-src 'none'">`;
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (match) => `${match}${csp}<style>${css}</style>`);
  return `<!doctype html><html><head><meta charset="UTF-8">${csp}<style>${css}</style></head><body>${html}</body></html>`;
}

export function CodeBase({ projects, activeProject, activeFile, versions, currentCode, onSelectProject, onSave, onRestore, onExport }: { projects: LocalProject[]; activeProject: LocalProject; activeFile: string; versions: SavedVersion[]; currentCode: string; onSelectProject: (projectId: string) => void; onSave: (name: string, note: string) => void; onRestore: (version: SavedVersion) => void; onExport: () => void }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, note.trim()); setName(""); setNote("");
  };
  const selectedVersion = versions.find((version) => version.id === selected);
  const selectedFileContents = selectedVersion?.files?.[activeFile] ?? selectedVersion?.code ?? "";
  const diff = selectedVersion ? makeLineDiff(selectedFileContents, currentCode) : [];
  return <>
    <PageTitle eyebrow="DEINE DATEIEN" title="Code Base" subtitle="Speichere wichtige Stände und kehre später zu ihnen zurück." />
    <div className="base-layout"><section className="panel base-panel"><div className="base-intro"><span className="large-soft-icon">▤</span><div><h2>{activeProject.name}</h2><p>{Object.keys(activeProject.files).length} lokale Dateien · ausgewählte Diff-Datei: {activeFile}</p></div><select className="text-input project-select" aria-label="Code-Base-Projekt" value={activeProject.id} onChange={(event) => onSelectProject(event.target.value)}>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select><button className="button secondary" onClick={onExport}>Projekt exportieren</button></div><div className="version-form"><label className="field-label">Versionsname<input className="text-input" value={name} maxLength={60} onChange={(event) => setName(event.target.value)} placeholder="z. B. Navigation fertig" /></label><label className="field-label">Notiz (optional)<input className="text-input" value={note} maxLength={180} onChange={(event) => setNote(event.target.value)} placeholder="Was hast du geändert?" /></label><button className="button primary" disabled={!name.trim()} onClick={save}>Projektversion speichern</button></div><div className="version-list"><h3>Versionsgeschichte <span>{versions.length}</span></h3>{versions.length === 0 ? <p className="empty-state">Noch keine Version gespeichert. Lege einen Stand an, bevor du größere Änderungen ausprobierst.</p> : versions.map((version, index) => <button className={`version-row ${selected === version.id ? "selected" : ""}`} key={version.id} onClick={() => setSelected(version.id)}><span className="version-number">{versions.length - index}</span><span className="version-details"><strong>{version.name}</strong><small>{version.note || "Ohne Notiz"} · {new Date(version.createdAt).toLocaleString()} · {version.files ? `${Object.keys(version.files).length} Dateien` : "Einzeldatei"}</small></span><span aria-hidden="true">›</span></button>)}</div></section><aside className="panel diff-panel"><div className="eyebrow">DIFF · {activeFile.toUpperCase()}</div><h3>{selectedVersion ? selectedVersion.name : "Aktuelle Fassung"}</h3><p>{selectedVersion ? "Rot markiert ist die gespeicherte Version, grün die aktuelle Fassung." : "Wähle eine Version, um Änderungen dieser Datei anzusehen und den ganzen Stand wiederherzustellen."}</p><pre className="diff-preview">{selectedVersion ? diff.map((line, index) => <span className={`diff-line ${line.kind}`} key={`${index}-${line.text}`}>{line.kind === "added" ? "+ " : line.kind === "removed" ? "− " : "  "}{line.text || " "}{"\n"}</span>) : currentCode}</pre>{selectedVersion && <button className="button secondary full" onClick={() => onRestore(selectedVersion)}>Ganzen Stand wiederherstellen</button>}</aside></div>
  </>;
}

export function Settings({ state, update, storageWritable, exportData, importData, clearData, onOpenSupport }: { state: DevPathState; update: (patch: Partial<DevPathState>) => void; storageWritable: boolean; exportData: () => void; importData: (file: File) => Promise<void>; clearData: () => void; onOpenSupport: () => void }) {
  const updateSettings = (patch: Partial<DevPathState["settings"]>) => update({ settings: { ...state.settings, ...patch } });
  const dataImportRef = useRef<HTMLInputElement>(null);

  return <>
    <div className="settings-layout">
      <nav className="settings-nav" aria-label="Einstellungsbereiche">
        <a href="#profil">Profil</a><a href="#lernen">Lernen</a><a href="#darstellung">Darstellung</a><a href="#datenschutz">Datenschutz</a><a href="#support">Support</a>
      </nav>
      <div className="settings-content">
        <section id="profil" className="panel settings-panel">
          <div className="eyebrow">PROFIL</div><h2>Wie sollen wir dich nennen?</h2>
          <label className="field-label" htmlFor="learner-name">Anzeigename</label>
          <input id="learner-name" className="text-input" maxLength={32} value={state.learnerName} onChange={(event) => update({ learnerName: event.target.value || "Lernende Person" })} />
          <div className="field-note">Der Anzeigename wird lokal auf diesem Gerät gespeichert.</div>
        </section>
        <section id="lernen" className="panel settings-panel">
          <div className="eyebrow">DEIN LERNRHYTHMUS</div><h2>Ein Plan, der zu deinem Alltag passt</h2>
          <fieldset className="schedule-days settings-schedule"><legend className="field-label">Deine Lerntage ({state.studyDays.length} pro Woche)</legend>{weekdays.map((day, index) => <label key={day}><input type="checkbox" checked={state.studyDays.includes(index)} disabled={state.studyDays.length === 1 && state.studyDays.includes(index)} onChange={(event) => { const next = event.target.checked ? [...state.studyDays, index].sort() : state.studyDays.filter((value) => value !== index); update({ studyDays: next, weeklySessions: next.length }); }} />{day}</label>)}</fieldset>
          <div className="field-grid">
            <label className="field-label">Bevorzugte Tageszeit<select className="text-input" value={state.studyTime} onChange={(event) => update({ studyTime: event.target.value })}><option value="flexible">Flexibel · keine feste Uhrzeit</option><option value="morning">Morgens</option><option value="afternoon">Nachmittags</option><option value="evening">Abends</option></select></label>
            <label className="field-label">Zeit pro Einheit<select className="text-input" value={state.sessionMinutes} onChange={(event) => update({ sessionMinutes: Number(event.target.value) })}>{[10, 15, 20, 30, 45, 60].map((minutes) => <option key={minutes} value={minutes}>etwa {minutes} Minuten</option>)}</select></label>
          </div>
          <label className="field-label">Dein Lernziel<input className="text-input" value={state.goal} maxLength={100} onChange={(event) => update({ goal: event.target.value })} /></label>
          <p className="field-note">Vorschläge werden aus deinen lokal gespeicherten Lernzielen und Übungsergebnissen gebildet. Die Tageszeit ist eine grobe Präferenz, kein Termin. CodeZone sendet keine Benachrichtigungen.</p>
        </section>
        <section id="darstellung" className="panel settings-panel">
          <div className="eyebrow">DARSTELLUNG</div><h2>Ruhig und gut lesbar</h2>
          <label className="field-label">Farbschema<select className="text-input" value={state.settings.theme} onChange={(event) => updateSettings({ theme: event.target.value as DevPathState["settings"]["theme"] })}><option value="system">Wie auf diesem Gerät</option><option value="light">Hell</option><option value="dark">Dunkel</option></select></label>
          <Toggle label="Bewegung reduzieren" checked={state.settings.reducedMotion} onChange={(value) => updateSettings({ reducedMotion: value })} />
        </section>
        <section id="datenschutz" className="panel settings-panel">
          <div className="eyebrow">DATENSCHUTZ</div><h2>Deine Daten bleiben deine</h2>
          <p className="settings-description">CodeZone verwendet in der Desktop-App keine Anmeldung. Profil, Lernstand, Code und Projekte bleiben lokal auf diesem Gerät.</p>
          <div className="toggle-row" aria-label="Fehlerberichte deaktiviert"><span><strong>Fehlerberichte</strong><small>In dieser Alpha deaktiviert. CodeZone überträgt keine Diagnoseberichte.</small></span><span className="local-badge">Deaktiviert</span></div>
          <p className="field-note">Der Export enthält Profil, Lernstand, Projektdateien und Code-Base-Versionen. Die Datei kann privaten Quelltext enthalten und sollte geschützt aufbewahrt werden.</p>
          {!storageWritable && <p className="storage-warning" role="status">Daten konnten nicht geladen werden. Export und Löschen sind gesperrt, bis du einen gültigen Datenexport wiederhergestellt hast.</p>}
          <div className="privacy-actions">
            <button className="button secondary" disabled={!storageWritable} onClick={exportData}>Daten exportieren</button>
            <button className="button secondary" onClick={() => dataImportRef.current?.click()}>Daten wiederherstellen</button>
            <input ref={dataImportRef} type="file" accept="application/json,.json" hidden onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void importData(file); event.currentTarget.value = ""; }} />
            <button className="button danger-outline" disabled={!storageWritable} onClick={clearData}>Lokale Daten löschen</button>
          </div>
        </section>
        <section className="panel settings-panel">
          <div className="eyebrow">TUTOR</div><h2>Lokale Lernhinweise</h2>
          <p className="settings-description">CodeZone nutzt die Erklärungen und Hinweisstufen aus dem installierten Kurs. Ein externes KI-Modell ist nicht verbunden.</p>
          <span className="local-badge">Code wird nicht übertragen</span>
        </section>
        <section id="support" className="panel settings-panel">
          <div className="eyebrow">SUPPORT</div><h2>Wir helfen dir weiter</h2>
          <p className="settings-description">Erstelle in CodeZone eine Supportnachricht an devpath.support@gmail.com. Es öffnet sich kein Browser.</p>
          <button className="button primary" type="button" onClick={onOpenSupport}>Supportnachricht verfassen</button>
          <p className="field-note">Bitte keine Passwörter, Zugangscodes, Quelltexte oder vollständigen Datenexporte senden.</p>
        </section>
      </div>
    </div>
  </>;
}

export function SupportDialog({ learnerName, onClose, onNotice }: { learnerName: string; onClose: () => void; onNotice: (message: string) => void }) {
  const [name, setName] = useState(learnerName);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);

  const draft = `An: devpath.support@gmail.com\nBetreff: CodeZone Support: ${subject.trim()}\n\nVon: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`;
  const prepare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrepared(true);
    setCopied(false);
  };
  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
    } catch {
      onNotice("CodeZone konnte die Nachricht nicht in die Zwischenablage kopieren. Markiere sie im Entwurf und kopiere sie manuell.");
    }
  };

  return <div className="modal-backdrop support-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="dialog support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-title">
      <button className="support-close" type="button" aria-label="Fenster schließen" onClick={onClose}>×</button>
      <div className="dialog-icon" aria-hidden="true">✉</div>
      <div className="eyebrow">CodeZone Support</div>
      <h2 id="support-title">Wie können wir helfen?</h2>
      <p className="support-recipient">Empfänger: <strong>devpath.support@gmail.com</strong></p>
      {!prepared ? <form onSubmit={prepare}>
        <label className="field-label">Dein Name<input className="text-input" required maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="field-label">Deine E-Mail-Adresse<input className="text-input" type="email" required maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@beispiel.de" /></label>
        <label className="field-label">Betreff<input className="text-input" required minLength={3} maxLength={120} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Worum geht es?" /></label>
        <label className="field-label">Nachricht<textarea className="text-input support-message" required minLength={10} maxLength={5000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Beschreibe kurz, was passiert ist und welche Schritte dazu geführt haben." /></label>
        <p className="field-note">CodeZone sendet diese Nachricht noch nicht automatisch. Du kannst sie hier vorbereiten und kopieren; der direkte Versand wird erst aktiviert, wenn der Maildienst eingerichtet und freigegeben ist. Bitte keine Passwörter, Zugangscodes, Quelltexte oder Datenexporte einfügen.</p>
        <div className="support-actions"><button className="button secondary" type="button" onClick={onClose}>Abbrechen</button><button className="button primary" type="submit">Nachricht vorbereiten</button></div>
      </form> : <>
        <label className="field-label">E-Mail-Entwurf<textarea className="text-input support-message support-draft" readOnly value={draft} /></label>
        <p className="field-note">Der Entwurf wurde in CodeZone erstellt. Der Versanddienst ist noch nicht eingerichtet; deshalb wurde noch keine E-Mail versendet.</p>
        <div className="support-actions"><button className="button secondary" type="button" onClick={() => setPrepared(false)}>Zurück zum Entwurf</button><button className="button primary" type="button" onClick={() => void copyDraft()}>{copied ? "Entwurf kopiert ✓" : "Entwurf kopieren"}</button></div>
      </>}
    </section>
  </div>;
}

function Toggle({ label, detail, checked, onChange }: { label: string; detail?: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="toggle-row"><span><strong>{label}</strong>{detail && <small>{detail}</small>}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="toggle-ui" aria-hidden="true" /></label>;
}

function makeLineDiff(oldText: string, newText: string): { kind: "same" | "added" | "removed"; text: string }[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");
  if (oldLines.length > 1000 || newLines.length > 1000) return [{ kind: "same", text: "Diff nicht verfügbar: Datei hat mehr als 1000 Zeilen." }];
  const width = newLines.length + 1;
  const table = new Uint16Array((oldLines.length + 1) * width);
  for (let i = oldLines.length - 1; i >= 0; i--) {
    for (let j = newLines.length - 1; j >= 0; j--) {
      const offset = i * width + j;
      table[offset] = oldLines[i] === newLines[j]
        ? table[(i + 1) * width + j + 1] + 1
        : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
    }
  }
  const result: { kind: "same" | "added" | "removed"; text: string }[] = [];
  let i = 0; let j = 0;
  while (i < oldLines.length && j < newLines.length) {
    if (oldLines[i] === newLines[j]) { result.push({ kind: "same", text: oldLines[i++] }); j++; }
    else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) result.push({ kind: "removed", text: oldLines[i++] });
    else result.push({ kind: "added", text: newLines[j++] });
  }
  while (i < oldLines.length) result.push({ kind: "removed", text: oldLines[i++] });
  while (j < newLines.length) result.push({ kind: "added", text: newLines[j++] });
  return result;
}


