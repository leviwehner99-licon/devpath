import { useEffect, useMemo, useState } from "react";
import { clearState, exportState, loadState, saveState } from "./storage";
import { recommendNextLesson, reviewDate } from "./planner";
import { pilotCourse, type CourseLesson } from "./course";
import { initialState, type DevPathState, type SavedVersion, type View } from "./types";
import { CodeBase, Diploma, Learn, Onboarding, Settings, Studio, Today } from "./views";
import { createLocalProject, downloadProjectBundle, parseProjectBundle, safeProjectPath, validateProjectFiles } from "./projects";

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
  const activeProject = state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0];
  const activeFilePath = activeProject?.files[activeProject.activeFile] !== undefined ? activeProject.activeFile : Object.keys(activeProject?.files ?? {})[0] ?? "index.html";
  const projectCode = activeProject?.files[activeFilePath] ?? "";
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

  const updateProject = (projectId: string, change: (project: DevPathState["projects"][number]) => DevPathState["projects"][number]) => {
    setState((current) => ({ ...current, projects: current.projects.map((project) => project.id === projectId ? change(project) : project) }));
  };

  const updateProjectFile = (path: string, value: string | undefined) => {
    if (!activeProject) return;
    const content = value ?? "";
    try { validateProjectFiles({ ...activeProject.files, [path]: content }); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Datei kann nicht gespeichert werden."); return; }
    updateProject(activeProject.id, (project) => ({ ...project, files: { ...project.files, [path]: content }, updatedAt: new Date().toISOString() }));
    if (activeProject.linkedLessonId && activeProject.linkedLessonFile === path) saveCode(activeProject.linkedLessonId, content);
  };

  const openLessonInStudio = () => {
    const linked = state.projects.find((project) => project.linkedLessonId === activeLesson.id);
    if (linked) {
      setState((current) => ({ ...current, activeProjectId: linked.id, projects: current.projects.map((project) => project.id === linked.id && linked.linkedLessonFile ? { ...project, files: { ...project.files, [linked.linkedLessonFile]: code }, updatedAt: new Date().toISOString() } : project) }));
    } else {
      const path = activeLesson.language === "css" ? "styles.css" : "index.html";
      const project = createLocalProject(`Lektion · ${activeLesson.title}`, { [path]: code });
      project.language = activeLesson.language;
      project.linkedLessonId = activeLesson.id;
      project.linkedLessonFile = path;
      setState((current) => ({ ...current, projects: [project, ...current.projects], activeProjectId: project.id }));
    }
    setView("studio");
  };

  const createProject = (name: string) => {
    const project = createLocalProject(name, { "index.html": "<!doctype html>\n<html lang=\"de\">\n<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Neues Projekt</title></head>\n<body>\n  <main>\n    <h1>Mein neues Projekt</h1>\n  </main>\n</body>\n</html>\n", "styles.css": "body { font-family: system-ui, sans-serif; }\n" });
    setState((current) => ({ ...current, projects: [project, ...current.projects], activeProjectId: project.id }));
    setNotice(`Projekt „${project.name}“ wurde lokal angelegt.`);
  };

  const addProjectFile = (path: string) => {
    if (!activeProject) return;
    const safePath = safeProjectPath(path);
    if (!safePath) { setNotice("Dieser Dateiname ist nicht erlaubt. Verwende einen relativen Pfad ohne Geheimdateien oder Buildordner."); return; }
    if (activeProject.files[safePath] !== undefined) { setNotice("Diese Datei gibt es im Projekt bereits."); return; }
    try { validateProjectFiles({ ...activeProject.files, [safePath]: "" }); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Datei kann nicht angelegt werden."); return; }
    updateProject(activeProject.id, (project) => ({ ...project, files: { ...project.files, [safePath]: "" }, activeFile: safePath, updatedAt: new Date().toISOString() }));
    setNotice(`${safePath} wurde angelegt.`);
  };

  const deleteProjectFile = (path: string) => {
    if (!activeProject) return;
    if (Object.keys(activeProject.files).length <= 1) { setNotice("Die letzte Projektdatei kann nicht gelöscht werden."); return; }
    if (!window.confirm(`Datei „${path}“ aus diesem Projekt entfernen?`)) return;
    updateProject(activeProject.id, (project) => {
      const files = { ...project.files };
      delete files[path];
      return { ...project, files, activeFile: project.activeFile === path ? Object.keys(files)[0] : project.activeFile, updatedAt: new Date().toISOString() };
    });
    setNotice(`${path} wurde aus dem Projekt entfernt.`);
  };

  const renameProject = (projectId: string) => {
    const project = state.projects.find((item) => item.id === projectId);
    if (!project) return;
    const name = window.prompt("Neuer Projektname", project.name)?.trim().slice(0, 80);
    if (!name) return;
    updateProject(projectId, (current) => ({ ...current, name, updatedAt: new Date().toISOString() }));
    setNotice(`Projekt heißt jetzt „${name}“.`);
  };

  const importProject = async (file: File) => {
    try {
      const bundle = parseProjectBundle(await file.text());
      const project = createLocalProject(bundle.name, bundle.files);
      project.language = bundle.language;
      setState((current) => ({ ...current, projects: [project, ...current.projects], activeProjectId: project.id }));
      setView("studio");
      setNotice(`Projekt „${project.name}“ wurde lokal importiert.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Projekt konnte nicht importiert werden.");
    }
  };

  const removeProject = (projectId: string) => {
    if (state.projects.length <= 1) { setNotice("Das letzte Projekt kann nicht gelöscht werden. Lege zuerst ein anderes Projekt an."); return; }
    const project = state.projects.find((item) => item.id === projectId);
    if (!project || !window.confirm(`Projekt „${project.name}“ und alle dazugehörigen lokalen Versionen löschen?`)) return;
    const projects = state.projects.filter((item) => item.id !== projectId);
    setState((current) => ({ ...current, projects, activeProjectId: current.activeProjectId === projectId ? projects[0].id : current.activeProjectId, versions: current.versions.filter((version) => version.projectId !== projectId) }));
    setNotice(`Projekt „${project.name}“ wurde gelöscht.`);
  };

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
    if (!activeProject) return;
    const version: SavedVersion = {
      id: crypto.randomUUID(),
      name,
      note,
      code: projectCode,
      createdAt: new Date().toISOString(),
      lessonId: activeLesson.id,
      projectId: activeProject.id,
      files: { ...activeProject.files },
    };
    update({ versions: [version, ...state.versions] });
    setNotice("Version lokal gespeichert.");
  };

  const restoreVersion = (version: SavedVersion) => {
    if (!window.confirm(`„${version.name}“ wiederherstellen? DevPath legt vorher automatisch eine Sicherung deiner aktuellen Projektdateien an.`)) return;
    if (activeProject && version.projectId === activeProject.id && version.files) {
      setState((current) => {
        const project = current.projects.find((item) => item.id === activeProject.id);
        if (!project) return current;
        const backup: SavedVersion = { id: crypto.randomUUID(), name: "Sicherung vor Wiederherstellung", note: `Automatisch vor „${version.name}“ erstellt`, code: project.files[project.activeFile] ?? "", createdAt: new Date().toISOString(), lessonId: activeLesson.id, projectId: project.id, files: { ...project.files } };
        const restoredFiles = { ...version.files! };
        const progress = project.linkedLessonId && project.linkedLessonFile && restoredFiles[project.linkedLessonFile] !== undefined
          ? { ...current.progress, [project.linkedLessonId]: { ...(current.progress[project.linkedLessonId] ?? { completed: false, attempts: 0, hintCount: 0, confidence: 0 }), code: restoredFiles[project.linkedLessonFile], updatedAt: new Date().toISOString() } }
          : current.progress;
        return { ...current, progress, versions: [backup, ...current.versions], projects: current.projects.map((item) => item.id === project.id ? { ...item, files: restoredFiles, activeFile: restoredFiles[item.activeFile] !== undefined ? item.activeFile : Object.keys(restoredFiles)[0], updatedAt: new Date().toISOString() } : item) };
      });
      setNotice("Projektversion wiederhergestellt. Eine Sicherung des vorherigen Stands liegt in der Versionsgeschichte.");
    } else {
      setState((current) => {
        const previous = current.progress[version.lessonId];
        return { ...current, progress: { ...current.progress, [version.lessonId]: { completed: previous?.completed ?? false, code: version.code, updatedAt: new Date().toISOString(), attempts: previous?.attempts ?? 0, hintCount: previous?.hintCount ?? 0, confidence: previous?.confidence ?? 0, nextReviewAt: previous?.nextReviewAt } } };
      });
      setSelectedLessonId(version.lessonId);
      setView("learn");
      setNotice("Alte Einzeldatei-Version in der zugehörigen Lektion wiederhergestellt.");
    }
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
        {stateLoaded && view === "learn" && <Learn lessons={pilotCourse.lessons} activeLesson={activeLesson} progress={state.progress} courseProgress={progressPercent} code={code} onSelect={(id) => setSelectedLessonId(id)} onCode={(value) => saveCode(activeLesson.id, value)} onComplete={(hints) => markComplete(activeLesson, hints)} openStudio={openLessonInStudio} />}
        {stateLoaded && view === "studio" && activeProject && <Studio lesson={activeLesson} projects={state.projects} activeProject={activeProject} activeFile={activeFilePath} code={projectCode} onCode={updateProjectFile} onSelectProject={(projectId) => update({ activeProjectId: projectId })} onSelectFile={(path) => updateProject(activeProject.id, (project) => ({ ...project, activeFile: path }))} onCreateProject={createProject} onAddFile={addProjectFile} onDeleteFile={deleteProjectFile} onImportProject={importProject} onDeleteProject={removeProject} onRenameProject={renameProject} onExportProject={() => downloadProjectBundle(activeProject)} onRun={() => setRunRequested(true)} onAsk={() => setNotice("Der Tutor verwendet lokale Kurs-Hinweise. Dein Code wird nicht übertragen.")} />}
        {stateLoaded && view === "base" && activeProject && <CodeBase projects={state.projects} activeProject={activeProject} activeFile={activeFilePath} versions={state.versions.filter((version) => !version.projectId || version.projectId === activeProject.id)} currentCode={projectCode} onSelectProject={(projectId) => update({ activeProjectId: projectId })} onSave={saveVersion} onRestore={restoreVersion} onExport={() => downloadProjectBundle(activeProject)} />}
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
