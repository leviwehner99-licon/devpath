import { useEffect, useMemo, useState } from "react";
import { clearState, exportState, loadState, saveState } from "./storage";
import { recommendNextLesson, reviewDate } from "./planner";
import { pilotCourse, type CourseLesson } from "./course";
import { initialState, type DevPathState, type SavedVersion, type View } from "./types";
import { CodeBase, Diploma, Learn, Onboarding, Settings, Studio, Today } from "./views";

const navigation: { id: View; label: string; icon: string }[] = [
  { id: "today", label: "Heute", icon: "◷" },
  { id: "learn", label: "Lernen", icon: "⌁" },
  { id: "studio", label: "Code Studio", icon: "⌘" },
  { id: "base", label: "Code Base", icon: "▤" },
  { id: "diploma", label: "Diplom", icon: "✧" },
];

export default function App() {
  const [state, setState] = useState<DevPathState>(initialState);
  const [stateLoaded, setStateLoaded] = useState(false);
  const [view, setView] = useState<View>("today");
  const [notice, setNotice] = useState("");
  const [runRequested, setRunRequested] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const recommendation = useMemo(() => recommendNextLesson(pilotCourse.lessons, state.progress), [state.progress]);
  const activeLesson = pilotCourse.lessons.find((lesson) => lesson.id === selectedLessonId) ?? recommendation.lesson;
  const lessonProgress = state.progress[activeLesson.id];
  const code = lessonProgress?.code ?? activeLesson.starterCode;
  const completedCount = pilotCourse.lessons.filter((lesson) => state.progress[lesson.id]?.completed).length;
  const progressPercent = Math.round(completedCount / pilotCourse.lessons.length * 100);

  useEffect(() => {
    loadState().then((loaded) => { setState(loaded); setShowOnboarding(!loaded.onboardingCompleted); }).catch(() => setNotice("Lokale Daten konnten nicht geladen werden.")).finally(() => setStateLoaded(true));
  }, []);

  useEffect(() => {
    if (!stateLoaded) return;
    const timer = window.setTimeout(() => {
      void saveState(state).catch(() => setNotice("Deine Änderung konnte lokal nicht gespeichert werden."));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [state, stateLoaded]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
    document.documentElement.dataset.motion = state.settings.reducedMotion ? "reduced" : "full";
  }, [state.settings]);

  const update = (patch: Partial<DevPathState>) => setState((current) => ({ ...current, ...patch }));

  const finishOnboarding = (values?: Pick<DevPathState, "goal" | "experience" | "weeklySessions" | "sessionMinutes">) => {
    setState((current) => ({ ...current, ...values, onboardingCompleted: true }));
    setShowOnboarding(false);
  };

  const saveCode = (lessonId: string, value: string | undefined) => setState((current) => {
    const previous = current.progress[lessonId];
    return {
      ...current,
      progress: {
        ...current.progress,
        [lessonId]: {
          completed: previous?.completed ?? false,
          code: value ?? "",
          updatedAt: new Date().toISOString(),
          attempts: previous?.attempts ?? 0,
          hintCount: previous?.hintCount ?? 0,
          confidence: previous?.confidence ?? 0,
          nextReviewAt: previous?.nextReviewAt,
        },
      },
    };
  });

  const markComplete = (lesson: CourseLesson, hintCount: number) => {
    const currentCode = state.progress[lesson.id]?.code ?? lesson.starterCode;
    if (!lesson.successPattern.test(currentCode)) {
      setNotice("Prüfe dein Ergebnis noch einmal. Das Lernziel ist im Code noch nicht erkennbar.");
      return;
    }
    const now = new Date();
    const confidence = Math.max(1, 5 - hintCount);
    const courseFinished = pilotCourse.lessons.every((item) => item.id === lesson.id || state.progress[item.id]?.completed);
    setState((current) => ({
      ...current,
      ...(courseFinished ? { courseCompletedAt: current.courseCompletedAt ?? now.toISOString() } : {}),
      progress: {
        ...current.progress,
        [lesson.id]: {
          completed: true,
          code: current.progress[lesson.id]?.code ?? lesson.starterCode,
          updatedAt: now.toISOString(),
          attempts: (current.progress[lesson.id]?.attempts ?? 0) + 1,
          hintCount,
          confidence,
          nextReviewAt: reviewDate(confidence, now),
        },
      },
    }));
    setSelectedLessonId(null);
    if (courseFinished) {
      setShowCompletion(true);
      setNotice("Du hast alle Lernziele des Pilotkurses erreicht. Dein lokales Diplom ist freigeschaltet.");
    } else setNotice("Lernziel abgeschlossen. Der Lernplan hat deinen nächsten Schritt ausgewählt.");
  };

  const saveVersion = (name: string, note: string) => {
    const version: SavedVersion = {
      id: crypto.randomUUID(),
      name,
      note,
      code,
      createdAt: new Date().toISOString(),
      lessonId: activeLesson.id,
    };
    update({ versions: [version, ...state.versions] });
    setNotice("Version lokal gespeichert.");
  };

  const restoreVersion = (version: SavedVersion) => {
    if (!window.confirm(`„${version.name}“ als aktuelle Arbeitsfassung laden? Die aktuelle Fassung bleibt in der Versionsliste erhalten, wenn du sie vorher speicherst.`)) return;
    saveCode(version.lessonId, version.code);
    setSelectedLessonId(version.lessonId);
    setNotice("Version in den Editor geladen. Speichere die aktuelle Fassung als neue Version, falls du sie behalten möchtest.");
  };

  const resetData = async () => {
    if (!window.confirm("Lokales Profil und Lernfortschritt auf diesem Gerät löschen?")) return;
    await clearState();
    setState(initialState);
    setSelectedLessonId(null);
    setNotice("Lokale Daten wurden gelöscht.");
  };

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Hauptnavigation">
      <div className="brand"><span className="brand-mark">d</span><span>devpath</span></div>
      <div className="nav-label">DEIN LERNRAUM</div>
      <nav>{navigation.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)} aria-current={view === item.id ? "page" : undefined}><span className="nav-icon" aria-hidden="true">{item.icon}</span>{item.label}</button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="local-state"><span className="status-dot" /> Lokal auf diesem Gerät</div>
      <button className={`nav-item ${view === "settings" ? "active" : ""}`} onClick={() => setView("settings")}><span className="nav-icon" aria-hidden="true">⚙</span>Einstellungen</button>
      <div className="sidebar-footer">DevPath · Phase 2 Alpha</div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs">DevPath <span>/</span> {navigation.find((item) => item.id === view)?.label ?? "Einstellungen"}</div><div className="topbar-right"><span className="connection"><span className="status-dot" /> Lokal zuerst</span><button className="avatar" aria-label="Profilname ändern" onClick={() => setView("settings")}>{state.learnerName.slice(0, 1).toUpperCase()}</button></div></header>
      <div className="page-content">
        {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Meldung schließen">×</button></div>}
        {!stateLoaded && <div className="loading-note" role="status">Dein Lernraum wird geöffnet …</div>}
        {stateLoaded && view === "today" && <Today state={state} progress={progressPercent} completedCount={completedCount} recommendation={recommendation} start={() => { setSelectedLessonId(recommendation.lesson.id); setView("learn"); }} edit={() => setView("settings")} />}
        {stateLoaded && view === "learn" && <Learn lessons={pilotCourse.lessons} activeLesson={activeLesson} progress={state.progress} courseProgress={progressPercent} code={code} onSelect={(id) => setSelectedLessonId(id)} onCode={(value) => saveCode(activeLesson.id, value)} onComplete={(hints) => markComplete(activeLesson, hints)} openStudio={() => setView("studio")} />}
        {stateLoaded && view === "studio" && <Studio lesson={activeLesson} code={code} onCode={(value) => saveCode(activeLesson.id, value)} onRun={() => setRunRequested(true)} onAsk={() => setNotice("Der Tutor verwendet lokale Kurs-Hinweise. Dein Code wird nicht übertragen.")} />}
        {stateLoaded && view === "base" && <CodeBase versions={state.versions} currentCode={code} onSave={saveVersion} onRestore={restoreVersion} />}
        {stateLoaded && view === "diploma" && <Diploma completedAt={state.courseCompletedAt} completedCount={completedCount} reducedMotion={state.settings.reducedMotion} />}
        {stateLoaded && view === "settings" && <Settings state={state} update={update} exportData={() => exportState(state)} clearData={() => { void resetData(); }} />}
      </div>
      {runRequested && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRunRequested(false); }}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="run-title"><div className="dialog-icon">⛨</div><h2 id="run-title">Ausführung wird noch geprüft</h2><p>Der Runner wird für dein System erst aktiviert, wenn seine Sandbox die Phase-2-Sicherheitsprüfung besteht. Bis dahin wird dein Code nicht gestartet.</p><div className="security-note"><strong>Dein Code bleibt lokal.</strong><br />Er wurde weder hochgeladen noch an einen KI-Dienst gesendet.</div><button className="button primary full" onClick={() => setRunRequested(false)}>Verstanden</button></section></div>}
      {showCompletion && <CompletionDialog reducedMotion={state.settings.reducedMotion} onClose={() => { setShowCompletion(false); setView("diploma"); }} />}
      {stateLoaded && showOnboarding && <Onboarding onFinish={finishOnboarding} onSkip={() => finishOnboarding()} />}
    </main>
  </div>;
}

function CompletionDialog({ reducedMotion, onClose }: { reducedMotion: boolean; onClose: () => void }) {
  const [seconds, setSeconds] = useState(10);
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);
  useEffect(() => { if (seconds === 0 || reducedMotion) onClose(); }, [seconds, reducedMotion, onClose]);
  return <div className="modal-backdrop"><section className={`dialog completion-dialog ${reducedMotion ? "reduced" : ""}`} role="dialog" aria-modal="true" aria-labelledby="completion-title"><div className="completion-sparkles" aria-hidden="true">✦　✧　✦</div><div className="dialog-icon diploma-icon">✧</div><h2 id="completion-title">Dein Lernpfad ist geschafft!</h2><p>Du hast alle Lernziele deiner ersten responsiven Webseite abgeschlossen.</p><div className="diploma-preview"><span>DEVPATH · LERNERFOLG</span><strong>HTML &amp; CSS<br />Grundlagen</strong><small>Lokales Abschlussdiplom</small></div><button className="button primary full" onClick={onClose}>{reducedMotion ? "Diplom ansehen" : `Weiter zum Diplom${seconds ? ` · ${seconds}s` : ""}`}</button><button className="text-button completion-skip" onClick={onClose}>Animation überspringen</button></section></div>;
}
