import { useEffect, useMemo, useState } from "react";
import { clearState, exportState, loadState, parseDataExport, saveState, setStorageProfileId } from "./storage";
import { recommendNextLesson, reviewDate } from "./planner";
import { initialState, type DevPathState, type SavedVersion, type View } from "./types";
import { CodeBase, Diploma, Learn, Onboarding, Settings, Studio, SupportDialog, Today } from "./views";
import { createLocalProject, downloadProjectBundle, parseProjectBundle, safeProjectPath, validateProjectFiles } from "./projects";
import { Icon, LogoMark } from "./ui";
import { Community, CourseLibrary, Curriculum, DashboardDiscover, Projects } from "./extra-views";
import { learningCourses, programmingCourse, type CourseLesson } from "./course";
import { recommendedCourse } from "./catalog";

const navigation: { id: View; label: string; icon: "today" | "learn" | "library" | "curriculum" | "studio" | "projects" | "community" | "base" | "diploma" }[] = [
  { id: "today", label: "Heute", icon: "today" },
  { id: "learn", label: "Lernen", icon: "learn" },
  { id: "library", label: "Bibliothek", icon: "library" },
  { id: "curriculum", label: "Lehrplan", icon: "curriculum" },
  { id: "studio", label: "Code Studio", icon: "studio" },
  { id: "projects", label: "Meine Projekte", icon: "projects" },
  { id: "community", label: "Community", icon: "community" },
  { id: "base", label: "Code Base", icon: "base" },
  { id: "diploma", label: "Diplom", icon: "diploma" },
];

function describeLocalSaveError(error: unknown): string {
  if (error instanceof Error) return error.message.slice(0, 300) || error.name;
  if (typeof error === "string") return error.slice(0, 300) || "Leere Fehlermeldung";
  if (error && typeof error === "object") {
    const message = "message" in error && typeof error.message === "string" ? error.message : undefined;
    if (message) return message.slice(0, 300);
    try { return JSON.stringify(error).slice(0, 300) || "Leeres Fehlerobjekt"; }
    catch { return Object.prototype.toString.call(error); }
  }
  return String(error).slice(0, 300) || "Unbekannter lokaler Speicherfehler";
}

function lessonFileName(language: string): string {
  const extensions: Record<string, string> = { html: "html", css: "css", javascript: "js", typescript: "ts", java: "java", python: "py", php: "php", cpp: "cpp", csharp: "cs", rust: "rs", sql: "sql", c: "c", kotlin: "kt", swift: "swift", plaintext: "md" };
  return `index.${extensions[language] ?? "txt"}`;
}

export default function App() {
  const [state, setState] = useState<DevPathState>(initialState);
  const [stateLoaded, setStateLoaded] = useState(false);
  const [storageWritable, setStorageWritable] = useState(false);
  const [storageIssue, setStorageIssue] = useState("");
  const [storageIssueDetails, setStorageIssueDetails] = useState("");
  const [view, setView] = useState<View>("today");
  const [notice, setNotice] = useState("");
  const [runRequested, setRunRequested] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  const effectiveTheme = state.settings.theme === "system"
    ? systemPrefersDark ? "dark" : "light"
    : state.settings.theme;

  const activeCourse = learningCourses.find((course) => course.id === state.activeCourseId) ?? programmingCourse;
  const recommendation = useMemo(() => recommendNextLesson(activeCourse.lessons, state.progress), [activeCourse, state.progress]);
  const activeLesson = activeCourse.lessons.find((lesson) => lesson.id === selectedLessonId) ?? recommendation.lesson;
  const lessonProgress = state.progress[activeLesson.id];
  const code = lessonProgress?.code ?? activeLesson.starterCode;
  const activeProject = state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0];
  const activeFilePath = activeProject?.files[activeProject.activeFile] !== undefined ? activeProject.activeFile : Object.keys(activeProject?.files ?? {})[0] ?? "index.js";
  const projectCode = activeProject?.files[activeFilePath] ?? "";
  const completedCount = activeCourse.lessons.filter((lesson) => state.progress[lesson.id]?.completed).length;
  const progressPercent = Math.round(completedCount / activeCourse.lessons.length * 100);

  const loadLocalState = async () => {
    setStorageIssue("");
    setStorageIssueDetails("");
    try {
      const loaded = await loadState();
      setState(loaded);
      setShowOnboarding(!loaded.onboardingCompleted);
      setStorageWritable(true);
    } catch (error) {
      console.error("CodeZone could not load its local learning database.", error);
      setStorageWritable(false);
      setStorageIssue("CodeZone konnte den lokalen Lernstand nicht öffnen. Die Daten werden nicht überschrieben. Du kannst zwischen den Menüs wechseln; Änderungen bleiben jedoch ungespeichert, bis der Speicher wieder geöffnet wurde.");
      setStorageIssueDetails(error instanceof Error ? error.message.slice(0, 500) : "Unbekannter lokaler Speicherfehler.");
      // The old profile remains untouched. Immediately open the questionnaire
      // against a separate local profile so the learner can recover gracefully.
      void startFreshOnboarding(false);
    } finally {
      setStateLoaded(true);
    }
  };

  useEffect(() => { void loadLocalState(); }, []);

  useEffect(() => {
    if (!stateLoaded || !storageWritable) return;
    const timer = window.setTimeout(() => {
      void saveState(state).catch(() => setNotice("Deine Änderung konnte lokal nicht gespeichert werden."));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [state, stateLoaded, storageWritable]);


  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const syncPreference = () => setSystemPrefersDark(preference.matches);
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
    document.documentElement.dataset.motion = state.settings.reducedMotion ? "reduced" : "full";
  }, [effectiveTheme, state.settings.reducedMotion]);

  const update = (patch: Partial<DevPathState>) => setState((current) => ({ ...current, ...patch }));

  const finishOnboarding = async (values: Pick<DevPathState, "learnerName" | "goal" | "experience" | "weeklySessions" | "studyDays" | "studyTime" | "sessionMinutes">): Promise<{ ok: boolean; detail?: string }> => {
    const profile = { ...state, ...values, learnerName: values.learnerName.trim() };
    const nextState = { ...profile, activeCourseId: recommendedCourse(profile).id, onboardingCompleted: true };
    try {
      await saveState(nextState);
      setState(nextState);
      setStorageWritable(true);
      setStorageIssue("");
      setStorageIssueDetails("");
      setShowOnboarding(false);
      return { ok: true };
    } catch (error) {
      setStorageWritable(false);
      console.error("Could not save the onboarding plan to the local database.", error);
      return { ok: false, detail: describeLocalSaveError(error) };
    }
  };

  const startFreshOnboarding = async (clearIssue = true) => {
    const freshId = `local-${crypto.randomUUID()}`;
    try {
      await setStorageProfileId(freshId);
    } catch {
      setNotice("Die neue Abfrage konnte nicht gestartet werden. Bitte starte die App neu und versuche es erneut.");
      return;
    }
    setState(initialState);
    setView("today");
    if (clearIssue) {
      setStorageIssue("");
      setStorageIssueDetails("");
    }
    setShowOnboarding(true);
    setStorageWritable(true);
    setStateLoaded(true);
    try {
      await saveState(initialState);
    } catch {
      setStorageWritable(false);
      setNotice("Die neue Abfrage ist geöffnet. Der Speicher ist noch nicht erreichbar; Antworten werden erst nach erfolgreichem Speichern übernommen.");
    }
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
      const path = lessonFileName(activeLesson.language);
      const project = createLocalProject(`Lektion · ${activeLesson.title}`, { [path]: code });
      project.language = activeLesson.language;
      project.linkedLessonId = activeLesson.id;
      project.linkedLessonFile = path;
      setState((current) => ({ ...current, projects: [project, ...current.projects], activeProjectId: project.id }));
    }
    setView("studio");
  };

  const createProject = (name: string) => {
    const project = createLocalProject(name, { "index.js": "// Dein neues JavaScript-Projekt\nconsole.log(\"Hallo CodeZone\");\n" });
    project.language = "javascript";
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

  const recordHint = (lessonId: string, hintCount: number) => setState((current) => {
    const previous = current.progress[lessonId];
    return { ...current, progress: { ...current.progress, [lessonId]: { completed: previous?.completed ?? false, code: previous?.code ?? "", updatedAt: new Date().toISOString(), attempts: previous?.attempts ?? 0, hintCount: Math.max(previous?.hintCount ?? 0, hintCount), confidence: previous?.confidence ?? 0, nextReviewAt: previous?.nextReviewAt } } };
  });

  const recordAttempt = (lessonId: string) => setState((current) => {
    const previous = current.progress[lessonId];
    return { ...current, progress: { ...current.progress, [lessonId]: { completed: previous?.completed ?? false, code: previous?.code ?? "", updatedAt: new Date().toISOString(), attempts: (previous?.attempts ?? 0) + 1, hintCount: previous?.hintCount ?? 0, confidence: previous?.confidence ?? 0, nextReviewAt: previous?.nextReviewAt } } };
  });

  const markComplete = (lesson: CourseLesson, hintCount: number, passed: boolean, selfRating = 3) => {
    const currentCode = state.progress[lesson.id]?.code ?? lesson.starterCode;
    if (!passed || (lesson.practice !== false && !lesson.successPattern.test(currentCode))) {
      recordAttempt(lesson.id);
      setNotice("Prüfe dein Ergebnis noch einmal. Das Lernziel ist im Code noch nicht erkennbar.");
      return;
    }
    const now = new Date();
    const confidence = Math.max(1, Math.min(5, Math.round(selfRating)));
    const courseFinished = activeCourse.lessons.every((item) => item.id === lesson.id || state.progress[item.id]?.completed);
    setState((current) => ({
      ...current,
      ...(courseFinished ? { courseCompletedAt: current.courseCompletedAt ?? now.toISOString(), courseCompletions: { ...current.courseCompletions, [activeCourse.id]: current.courseCompletions[activeCourse.id] ?? now.toISOString() } } : {}),
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
      setNotice(`Du hast alle Lernziele von „${activeCourse.title}“ erreicht. Dein lokales Diplom ist freigeschaltet.`);
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
    if (!window.confirm(`„${version.name}“ wiederherstellen? CodeZone legt vorher automatisch eine Sicherung deiner aktuellen Projektdateien an.`)) return;
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
    if (!storageWritable) { setNotice("Löschen ist gesperrt, weil die gespeicherten Daten nicht geladen werden konnten."); return; }
    if (!window.confirm("Lokales Profil und Lernfortschritt auf diesem Gerät löschen?")) return;
    try {
      await clearState();
      setState(structuredClone(initialState));
      setShowOnboarding(true);
      setSelectedLessonId(null);
      setNotice("Lokale Daten wurden gelöscht.");
    } catch {
      setNotice("Lokale Daten konnten nicht gelöscht werden. Es wurde nichts weiter geändert.");
    }
  };

  const exportLocalData = () => {
    if (!storageWritable) { setNotice("Export ist gesperrt, weil CodeZone die gespeicherten Daten nicht lesen konnte."); return; }
    try { exportState(state); setNotice("Datenexport wurde erstellt. Bewahre die Datei geschützt auf; sie enthält deinen Lernstand und Projektcode."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Datenexport konnte nicht erstellt werden."); }
  };

  const importLocalData = async (file: File) => {
    if (file.size > 50_000_000) { setNotice("Der Datenexport ist größer als 50 MB."); return; }
    try {
      const imported = parseDataExport(await file.text());
      const projectCount = imported.projects.length;
      const versionCount = imported.versions.length;
      const completedCount = Object.values(imported.progress).filter((item) => item.completed).length;
      if (!window.confirm(`Dieser Export enthält ${projectCount} Projekte, ${versionCount} gespeicherte Versionen und ${completedCount} abgeschlossene Lernziele. Er ersetzt dein aktuelles lokales Profil, den Lernstand, Projekte und Versionen. Fortfahren?`)) return;
      await saveState(imported);
      setState(imported);
      setStorageWritable(true);
      setStorageIssue("");
      setShowOnboarding(false);
      setSelectedLessonId(null);
      setNotice("Datenexport wurde geprüft und auf diesem Gerät wiederhergestellt.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Datenexport konnte nicht importiert werden. Deine bisherigen Daten wurden nicht ersetzt.");
    }
  };

  if (!stateLoaded) return <div className="first-run-shell"><div className="loading-note" role="status">CodeZone wird gestartet …</div></div>;

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Hauptnavigation">
      <div className="brand"><LogoMark/><span>CodeZone</span></div>
      <div className="nav-label">DEIN LERNRAUM</div>
      <nav>{navigation.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)} aria-current={view === item.id ? "page" : undefined}><span className="nav-icon"><Icon name={item.icon}/></span>{item.label}</button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="local-state"><span className="status-dot" /> Lokal auf diesem Gerät</div>
      <button className={`nav-item ${view === "settings" ? "active" : ""}`} onClick={() => setView("settings")}><span className="nav-icon"><Icon name="settings"/></span>Einstellungen</button>
      <div className="sidebar-footer">CodeZone · Phase 2 Alpha</div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs">CodeZone <span>/</span> {navigation.find((item) => item.id === view)?.label ?? "Einstellungen"}</div><div className="topbar-right"><span className="connection"><span className="status-dot" /> Lokal zuerst</span><button className="theme-switch" aria-label={`Zum ${effectiveTheme === "dark" ? "hellen" : "dunklen"} Farbschema wechseln`} onClick={() => update({ settings: { ...state.settings, theme: effectiveTheme === "dark" ? "light" : "dark" } })}>{effectiveTheme === "dark" ? "☀ Hell" : "◐ Dunkel"}</button><button className="avatar" aria-label="Profilname ändern" onClick={() => setView("settings")}>{state.learnerName.slice(0, 1).toUpperCase()}</button></div></header>
      <div className="page-content">
        {storageIssue && <section className="panel recovery-panel" role="alert"><strong>Lernstand konnte nicht geöffnet werden</strong><p>{storageIssue}</p><div className="recovery-actions"><button className="button secondary" onClick={() => { setStateLoaded(false); void loadLocalState(); }}>Erneut versuchen</button><button className="button secondary" onClick={() => setView("settings")}>Einstellungen und Datenimport öffnen</button><button className="button primary" onClick={() => { void startFreshOnboarding(); }}>Neue Startabfrage beginnen</button></div>{storageIssueDetails && <details className="storage-error-details"><summary>Lokale Fehlerdetails anzeigen</summary><code>{storageIssueDetails}</code></details>}</section>}
        {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Meldung schließen">×</button></div>}
        {!stateLoaded && <div className="loading-note" role="status">Dein Lernraum wird geöffnet …</div>}
        {stateLoaded && view === "today" && <><Today courseTitle={activeCourse.title} courseLessonCount={activeCourse.lessons.length} state={state} progress={progressPercent} completedCount={completedCount} recommendation={recommendation} start={() => { setSelectedLessonId(recommendation.lesson.id); setView("learn"); }} edit={() => setView("settings")} /><DashboardDiscover course={activeCourse} state={state} completedCount={completedCount} openLibrary={() => setView("library")} openCurriculum={() => setView("curriculum")} /></>}
        {stateLoaded && view === "library" && <CourseLibrary openCourse={(courseId) => { update({ activeCourseId: courseId }); setSelectedLessonId(null); setView("curriculum"); }} />}
        {stateLoaded && view === "curriculum" && <Curriculum course={activeCourse} state={state} completedCount={completedCount} recommendation={recommendation} openLesson={(id) => { setSelectedLessonId(id); setView("learn"); }} openLibrary={() => setView("library")} />}
        {stateLoaded && view === "projects" && <Projects projects={state.projects} open={() => setView("studio")} create={() => { createProject("Mein neues Projekt"); setView("studio"); }} manage={(id) => { update({ activeProjectId: id }); setView("studio"); }} />}
        {stateLoaded && view === "community" && <Community copyToProject={(name, files) => { const project = createLocalProject(name, files); setState((current) => ({ ...current, projects: [project, ...current.projects], activeProjectId: project.id })); setView("studio"); setNotice("Demo-Projekt wurde lokal in Code Studio kopiert."); }} />}
        {stateLoaded && view === "learn" && <Learn courseTitle={activeCourse.title} lessons={activeCourse.lessons} activeLesson={activeLesson} progress={state.progress} courseProgress={progressPercent} code={code} onSelect={(id) => setSelectedLessonId(id)} openLanguageCourse={(courseId) => { update({ activeCourseId: courseId }); setSelectedLessonId(`${courseId}-orientation`); setView("learn"); }} onCode={(value) => saveCode(activeLesson.id, value)} theme={effectiveTheme} onHint={(hints) => recordHint(activeLesson.id, hints)} onComplete={(hints, passed, confidence) => markComplete(activeLesson, hints, passed, confidence)} openStudio={openLessonInStudio} />}
        {stateLoaded && view === "studio" && activeProject && <Studio lesson={activeLesson} projects={state.projects} activeProject={activeProject} activeFile={activeFilePath} code={projectCode} onCode={updateProjectFile} onSelectProject={(projectId) => update({ activeProjectId: projectId })} onSelectFile={(path) => updateProject(activeProject.id, (project) => ({ ...project, activeFile: path }))} theme={effectiveTheme} onCreateProject={createProject} onAddFile={addProjectFile} onDeleteFile={deleteProjectFile} onImportProject={importProject} onDeleteProject={removeProject} onRenameProject={renameProject} onExportProject={() => downloadProjectBundle(activeProject)} onRun={() => setRunRequested(true)} onAsk={() => setNotice("Der Tutor verwendet lokale Kurs-Hinweise. Dein Code wird nicht übertragen.")} />}
        {stateLoaded && view === "base" && activeProject && <CodeBase projects={state.projects} activeProject={activeProject} activeFile={activeFilePath} versions={state.versions.filter((version) => !version.projectId || version.projectId === activeProject.id)} currentCode={projectCode} onSelectProject={(projectId) => update({ activeProjectId: projectId })} onSave={saveVersion} onRestore={restoreVersion} onExport={() => downloadProjectBundle(activeProject)} />}
        {stateLoaded && view === "diploma" && <Diploma course={activeCourse} completedAt={state.courseCompletions[activeCourse.id] ?? (activeCourse.id === "programming-intro" ? state.courseCompletedAt : undefined)} completedCount={completedCount} reducedMotion={state.settings.reducedMotion} />}
        {stateLoaded && view === "settings" && <Settings state={state} update={update} storageWritable={storageWritable} exportData={exportLocalData} importData={importLocalData} clearData={() => { void resetData(); }} onOpenSupport={() => setShowSupport(true)} />}
      </div>
      {runRequested && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRunRequested(false); }}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="run-title"><div className="dialog-icon">⛨</div><h2 id="run-title">Ausführung wird noch geprüft</h2><p>Der Runner wird für dein System erst aktiviert, wenn seine Sandbox die Phase-2-Sicherheitsprüfung besteht. Bis dahin wird dein Code nicht gestartet.</p><div className="security-note"><strong>Dein Code bleibt lokal.</strong><br />Er wurde weder hochgeladen noch an einen KI-Dienst gesendet.</div><button className="button primary full" onClick={() => setRunRequested(false)}>Verstanden</button></section></div>}
      {showCompletion && <CompletionDialog courseTitle={activeCourse.title} lessonCount={activeCourse.lessons.length} reducedMotion={state.settings.reducedMotion} onClose={() => { setShowCompletion(false); setView("diploma"); }} />}
      {showSupport && <SupportDialog learnerName={state.learnerName} onClose={() => setShowSupport(false)} onNotice={setNotice} />}
      {stateLoaded && showOnboarding && <Onboarding onFinish={finishOnboarding} />}
    </main>
  </div>;
}

function CompletionDialog({ courseTitle, lessonCount, reducedMotion, onClose }: { courseTitle: string; lessonCount: number; reducedMotion: boolean; onClose: () => void }) {
  const [seconds, setSeconds] = useState(10);
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);
  useEffect(() => { if (seconds === 0 || reducedMotion) onClose(); }, [seconds, reducedMotion, onClose]);
  return <div className="modal-backdrop"><section className={`dialog completion-dialog ${reducedMotion ? "reduced" : ""}`} role="dialog" aria-modal="true" aria-labelledby="completion-title"><div className="completion-sparkles" aria-hidden="true">✦　✧　✦</div><div className="dialog-icon diploma-icon">✧</div><h2 id="completion-title">Dein Lernpfad ist geschafft!</h2><p>Du hast alle {lessonCount} Lektionen im Kurs „{courseTitle}“ abgeschlossen.</p><div className="diploma-preview"><span>CodeZone · Lernerfolg</span><strong>{courseTitle}</strong><small>Lokales Abschlussdiplom</small></div><button className="button primary full" onClick={onClose}>{reducedMotion ? "Diplom ansehen" : `Weiter zum Diplom${seconds ? ` · ${seconds}s` : ""}`}</button><button className="text-button completion-skip" onClick={onClose}>Animation überspringen</button></section></div>;
}
