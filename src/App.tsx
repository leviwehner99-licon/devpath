import { useEffect, useMemo, useState } from "react";
import { clearState, exportState, loadState, parseDataExport, saveState, setStorageProfileId } from "./storage";
import { recommendNextLesson, reviewDate } from "./planner";
import { programmingCourse, type CourseLesson } from "./course";
import { initialState, type DevPathState, type SavedVersion, type View } from "./types";
import { CodeBase, Diploma, Learn, Onboarding, Settings, Studio, SupportDialog, Today } from "./views";
import { createLocalProject, downloadProjectBundle, parseProjectBundle, safeProjectPath, validateProjectFiles } from "./projects";
import { Icon, LogoMark } from "./ui";
import { Community, CourseLibrary, Curriculum, DashboardDiscover, Projects } from "./extra-views";
import { authConfigured, accountRequest, openAuthCallback, supabase } from "./auth-client";
import { AuthView, PasswordRecoveryView } from "./auth-view";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrent, onOpenUrl, register } from "@tauri-apps/plugin-deep-link";
import type { Session } from "@supabase/supabase-js";

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

export default function App() {
  const [state, setState] = useState<DevPathState>(initialState);
  const [stateLoaded, setStateLoaded] = useState(false);
  const [storageWritable, setStorageWritable] = useState(false);
  const [storageIssue, setStorageIssue] = useState("");
  const [view, setView] = useState<View>("today");
  const [notice, setNotice] = useState("");
  const [runRequested, setRunRequested] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [accountReady, setAccountReady] = useState(false);
  const [accountIssue, setAccountIssue] = useState("");
  const [accountRetry, setAccountRetry] = useState(0);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  const recommendation = useMemo(() => recommendNextLesson(programmingCourse.lessons, state.progress), [state.progress]);
  const activeLesson = programmingCourse.lessons.find((lesson) => lesson.id === selectedLessonId) ?? recommendation.lesson;
  const lessonProgress = state.progress[activeLesson.id];
  const code = lessonProgress?.code ?? activeLesson.starterCode;
  const activeProject = state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0];
  const activeFilePath = activeProject?.files[activeProject.activeFile] !== undefined ? activeProject.activeFile : Object.keys(activeProject?.files ?? {})[0] ?? "index.js";
  const projectCode = activeProject?.files[activeFilePath] ?? "";
  const completedCount = programmingCourse.lessons.filter((lesson) => state.progress[lesson.id]?.completed).length;
  const progressPercent = Math.round(completedCount / programmingCourse.lessons.length * 100);

  useEffect(() => {
    loadState().then((loaded) => { setState(loaded); }).catch(() => setStorageIssue("devpath konnte die gespeicherten Daten nicht lesen. Es werden keine Standarddaten darübergeschrieben. Öffne Einstellungen → Datenschutz und stelle einen zuvor erstellten Datenexport wieder her.")).finally(() => setStateLoaded(true));
  }, []);

  useEffect(() => {
    if (!authConfigured || !supabase) { setAuthReady(true); return; }
    let alive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (alive) setSession(nextSession);
      if (alive && event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
    });
    void supabase.auth.getSession().then(({ data }) => { if (alive) { setSession(data.session); setAuthReady(true); } });
    const handledAuthUrls = new Set<string>();
    const acceptUrl = (url: string) => {
      if (!alive || handledAuthUrls.has(url)) return;
      handledAuthUrls.add(url);
      if (handledAuthUrls.size > 8) handledAuthUrls.delete(handledAuthUrls.values().next().value as string);
      void openAuthCallback(url).catch(() => {
        if (alive) setAccountIssue("Die Anmeldung konnte nicht abgeschlossen werden. Bitte starte sie erneut.");
      });
    };
    let unlistenDeepLink: (() => void) | undefined;
    if (isTauri()) {
      void (async () => {
        await register("devpath").catch(() => {});
        const unlisten = await onOpenUrl((urls) => urls.forEach(acceptUrl));
        if (!alive) { unlisten(); return; }
        unlistenDeepLink = unlisten;
        const initialUrls = await getCurrent();
        initialUrls?.forEach(acceptUrl);
      })().catch(() => {
        if (alive) setAccountIssue("Die Anmeldung konnte nicht abgeschlossen werden. Bitte starte sie erneut.");
      });
    }
    return () => { alive = false; subscription.unsubscribe(); unlistenDeepLink?.(); };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    setAccountReady(false);
    setAccountIssue("");
    setStorageWritable(false);
    if (!session || !supabase) { setAccountReady(true); return; }
    let alive = true;
    void (async () => {
      try {
        const { data } = await supabase!.auth.getSession();
        const currentSession = data.session;
        if (!currentSession) return;
        const account = await accountRequest<{ id: string; profile: Record<string, unknown> }>(currentSession, "PUT");
        await setStorageProfileId(account.id);
        const localState = await loadState();
        const remoteProfile = account.profile ?? {};
        const completed = remoteProfile.onboardingCompleted === true;
        const hydrated = completed ? {
          ...localState,
          learnerName: typeof remoteProfile.learnerName === "string" ? remoteProfile.learnerName : localState.learnerName,
          goal: typeof remoteProfile.goal === "string" ? remoteProfile.goal : localState.goal,
          experience: (remoteProfile.experience === "some" || remoteProfile.experience === "experienced" ? remoteProfile.experience : "new") as DevPathState["experience"],
          weeklySessions: Number.isInteger(remoteProfile.weeklySessions) ? Number(remoteProfile.weeklySessions) : localState.weeklySessions,
          studyDays: Array.isArray(remoteProfile.studyDays) ? remoteProfile.studyDays.filter((day): day is number => Number.isInteger(day) && Number(day) >= 0 && Number(day) <= 6) : localState.studyDays,
          studyTime: typeof remoteProfile.studyTime === "string" ? remoteProfile.studyTime : localState.studyTime,
          sessionMinutes: Number.isInteger(remoteProfile.sessionMinutes) ? Number(remoteProfile.sessionMinutes) : localState.sessionMinutes,
          onboardingCompleted: true,
        } : { ...localState, onboardingCompleted: false, learnerName: initialState.learnerName };
        if (!alive) return;
        setState(hydrated);
        setShowOnboarding(!completed);
        setStorageWritable(true);
      } catch (error) {
        if (alive) setAccountIssue(error instanceof Error ? error.message : "Das Konto konnte nicht geladen werden.");
      } finally { if (alive) setAccountReady(true); }
    })();
    return () => { alive = false; };
  }, [authReady, session?.user.id, accountRetry]);

  useEffect(() => {
    if (!stateLoaded || !storageWritable) return;
    const timer = window.setTimeout(() => {
      void saveState(state).catch(() => setNotice("Deine Änderung konnte lokal nicht gespeichert werden."));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [state, stateLoaded, storageWritable]);

  useEffect(() => {
    if (!session || !accountReady || !storageWritable || !state.onboardingCompleted) return;
    const timer = window.setTimeout(() => {
      void supabase?.auth.getSession().then(({ data }) => {
        if (!data.session) return;
        return accountRequest(data.session, "PATCH", { profile: {
          learnerName: state.learnerName, goal: state.goal, experience: state.experience,
          weeklySessions: state.weeklySessions, studyDays: state.studyDays,
          studyTime: state.studyTime, sessionMinutes: state.sessionMinutes, onboardingCompleted: true,
        } });
      }).catch(() => setNotice("Dein Lernplanprofil konnte gerade nicht mit deinem Konto gespeichert werden."));
    }, 800);
    return () => window.clearTimeout(timer);
  }, [session?.user.id, accountReady, storageWritable, state.onboardingCompleted, state.learnerName, state.goal, state.experience, state.weeklySessions, state.studyDays, state.studyTime, state.sessionMinutes]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
    document.documentElement.dataset.motion = state.settings.reducedMotion ? "reduced" : "full";
  }, [state.settings]);

  const update = (patch: Partial<DevPathState>) => setState((current) => ({ ...current, ...patch }));

  const signOut = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setStorageWritable(false);
    setState(initialState);
  };

  const deleteAccount = async () => {
    if (!session || !window.confirm("Dein devpath-Konto, das gespeicherte Lernplanprofil und die lokalen Lern- und Projektdaten dieses Kontos werden gelöscht. Fortfahren?")) return;
    try {
      await accountRequest(session, "DELETE");
      await clearState();
      await signOut();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Das Konto konnte nicht gelöscht werden.");
    }
  };

  const finishOnboarding = async (values: Pick<DevPathState, "learnerName" | "goal" | "experience" | "weeklySessions" | "studyDays" | "studyTime" | "sessionMinutes">) => {
    const nextState = { ...state, ...values, learnerName: values.learnerName.trim(), onboardingCompleted: true };
    try {
      if (!session) throw new Error("Bitte melde dich an, bevor du deinen Lernplan speicherst.");
      await saveState(nextState);
      await accountRequest(session, "PATCH", { profile: { ...values, learnerName: values.learnerName.trim(), onboardingCompleted: true } });
      setState(nextState);
      setStorageWritable(true);
      setShowOnboarding(false);
    } catch {
      setNotice("Dein Lernplan konnte noch nicht gespeichert werden. Bitte versuche es erneut; die Startabfrage bleibt geöffnet.");
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
      const path = "index.js";
      const project = createLocalProject(`Lektion · ${activeLesson.title}`, { [path]: code });
      project.language = activeLesson.language;
      project.linkedLessonId = activeLesson.id;
      project.linkedLessonFile = path;
      setState((current) => ({ ...current, projects: [project, ...current.projects], activeProjectId: project.id }));
    }
    setView("studio");
  };

  const createProject = (name: string) => {
    const project = createLocalProject(name, { "index.js": "// Dein neues JavaScript-Projekt\nconsole.log(\"Hallo devpath\");\n" });
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

  const markComplete = (lesson: CourseLesson, hintCount: number, passed: boolean) => {
    const currentCode = state.progress[lesson.id]?.code ?? lesson.starterCode;
    if (!passed || !lesson.successPattern.test(currentCode)) {
      recordAttempt(lesson.id);
      setNotice("Prüfe dein Ergebnis noch einmal. Das Lernziel ist im Code noch nicht erkennbar.");
      return;
    }
    const now = new Date();
    const confidence = Math.max(1, 5 - hintCount);
    const courseFinished = programmingCourse.lessons.every((item) => item.id === lesson.id || state.progress[item.id]?.completed);
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
      setNotice("Du hast alle Lernziele des Einstiegskurses erreicht. Dein lokales Diplom ist freigeschaltet.");
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
    if (!window.confirm(`„${version.name}“ wiederherstellen? devpath legt vorher automatisch eine Sicherung deiner aktuellen Projektdateien an.`)) return;
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
    if (!storageWritable) { setNotice("Export ist gesperrt, weil devpath die gespeicherten Daten nicht lesen konnte."); return; }
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

  if (!stateLoaded || (authConfigured && !authReady)) return <div className="first-run-shell"><div className="loading-note" role="status">devpath wird sicher gestartet …</div></div>;
  if (!authConfigured) return <main className="auth-screen"><section className="auth-card"><div className="auth-brand"><LogoMark /><span>devpath</span></div><h1>Die Kontoanmeldung ist derzeit nicht verfügbar.</h1><p className="auth-description">Bitte versuche es später erneut oder wende dich an den devpath-Support.</p></section></main>;
  if (passwordRecovery) return <PasswordRecoveryView onFinished={() => setPasswordRecovery(false)} />;
  if (!session) return <AuthView onAuthenticated={() => { void supabase?.auth.getSession().then(({ data }) => setSession(data.session)); }} />;
  if (!accountReady) return <div className="first-run-shell"><div className="loading-note" role="status">Dein devpath-Konto wird geladen …</div></div>;
  if (accountIssue) return <div className="first-run-shell"><section className="panel auth-config-error"><div className="eyebrow">KONTO</div><h1>Deine Kontodaten konnten nicht geladen werden.</h1><p>Prüfe deine Internetverbindung und versuche es erneut.</p><div className="auth-recovery-actions"><button className="button primary" onClick={() => { setSession(null); void supabase?.auth.signOut(); }}>Abmelden</button><button className="button secondary" onClick={() => { setAccountIssue(""); setAccountReady(false); setAccountRetry((value) => value + 1); }}>Erneut versuchen</button></div></section></div>;
  if (!storageIssue && showOnboarding) return <div className="first-run-shell"><Onboarding onFinish={finishOnboarding} /></div>;

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Hauptnavigation">
      <div className="brand"><LogoMark/><span>devpath</span></div>
      <div className="nav-label">DEIN LERNRAUM</div>
      <nav>{navigation.map((item) => <button key={item.id} disabled={Boolean(storageIssue)} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)} aria-current={view === item.id ? "page" : undefined}><span className="nav-icon"><Icon name={item.icon}/></span>{item.label}</button>)}</nav>
      <div className="sidebar-spacer" />
      <div className="local-state"><span className="status-dot" /> Lokal auf diesem Gerät</div>
      <button className={`nav-item ${view === "settings" ? "active" : ""}`} onClick={() => setView("settings")}><span className="nav-icon"><Icon name="settings"/></span>Einstellungen</button>
      <button className="nav-item account-signout" onClick={() => void signOut()}><span className="nav-icon"><Icon name="settings"/></span>Abmelden</button>
      <div className="sidebar-footer">devpath · Phase 2 Alpha</div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumbs">devpath <span>/</span> {navigation.find((item) => item.id === view)?.label ?? "Einstellungen"}</div><div className="topbar-right"><span className="connection"><span className="status-dot" /> Lokal zuerst</span><button className="theme-switch" aria-label={`Zum ${state.settings.theme === "dark" ? "hellen" : "dunklen"} Farbschema wechseln`} onClick={() => update({ settings: { ...state.settings, theme: state.settings.theme === "dark" ? "light" : "dark" } })}>{state.settings.theme === "dark" ? "☀ Hell" : "◐ Dunkel"}</button><button className="avatar" aria-label="Profilname ändern" onClick={() => setView("settings")}>{state.learnerName.slice(0, 1).toUpperCase()}</button></div></header>
      <div className="page-content">
        {storageIssue && <section className="panel recovery-panel" role="alert"><strong>Lokale Daten nicht geladen</strong><p>{storageIssue}</p><button className="button secondary" onClick={() => setView("settings")}>Datenwiederherstellung öffnen</button></section>}
        {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Meldung schließen">×</button></div>}
        {!stateLoaded && <div className="loading-note" role="status">Dein Lernraum wird geöffnet …</div>}
        {stateLoaded && !storageIssue && view === "today" && <><Today state={state} progress={progressPercent} completedCount={completedCount} recommendation={recommendation} start={() => { setSelectedLessonId(recommendation.lesson.id); setView("learn"); }} edit={() => setView("settings")} /><DashboardDiscover state={state} completedCount={completedCount} openLibrary={() => setView("library")} openCurriculum={() => setView("curriculum")} /></>}
        {stateLoaded && !storageIssue && view === "library" && <CourseLibrary openCourse={() => { setView("curriculum"); }} />}
        {stateLoaded && !storageIssue && view === "curriculum" && <Curriculum state={state} completedCount={completedCount} openLesson={(id) => { setSelectedLessonId(id); setView("learn"); }} openLibrary={() => setView("library")} />}
        {stateLoaded && !storageIssue && view === "projects" && <Projects projects={state.projects} open={() => setView("studio")} create={() => { createProject("Mein neues Projekt"); setView("studio"); }} manage={(id) => { update({ activeProjectId: id }); setView("studio"); }} />}
        {stateLoaded && !storageIssue && view === "community" && <Community copyToProject={(name, files) => { const project = createLocalProject(name, files); setState((current) => ({ ...current, projects: [project, ...current.projects], activeProjectId: project.id })); setView("studio"); setNotice("Demo-Projekt wurde lokal in Code Studio kopiert."); }} />}
        {stateLoaded && !storageIssue && view === "learn" && <Learn lessons={programmingCourse.lessons} activeLesson={activeLesson} progress={state.progress} courseProgress={progressPercent} code={code} onSelect={(id) => setSelectedLessonId(id)} onCode={(value) => saveCode(activeLesson.id, value)} theme={state.settings.theme} onHint={(hints) => recordHint(activeLesson.id, hints)} onComplete={(hints, passed) => markComplete(activeLesson, hints, passed)} openStudio={openLessonInStudio} />}
        {stateLoaded && !storageIssue && view === "studio" && activeProject && <Studio lesson={activeLesson} projects={state.projects} activeProject={activeProject} activeFile={activeFilePath} code={projectCode} onCode={updateProjectFile} onSelectProject={(projectId) => update({ activeProjectId: projectId })} onSelectFile={(path) => updateProject(activeProject.id, (project) => ({ ...project, activeFile: path }))} theme={state.settings.theme} onCreateProject={createProject} onAddFile={addProjectFile} onDeleteFile={deleteProjectFile} onImportProject={importProject} onDeleteProject={removeProject} onRenameProject={renameProject} onExportProject={() => downloadProjectBundle(activeProject)} onRun={() => setRunRequested(true)} onAsk={() => setNotice("Der Tutor verwendet lokale Kurs-Hinweise. Dein Code wird nicht übertragen.")} />}
        {stateLoaded && !storageIssue && view === "base" && activeProject && <CodeBase projects={state.projects} activeProject={activeProject} activeFile={activeFilePath} versions={state.versions.filter((version) => !version.projectId || version.projectId === activeProject.id)} currentCode={projectCode} onSelectProject={(projectId) => update({ activeProjectId: projectId })} onSave={saveVersion} onRestore={restoreVersion} onExport={() => downloadProjectBundle(activeProject)} />}
        {stateLoaded && !storageIssue && view === "diploma" && <Diploma completedAt={state.courseCompletedAt} completedCount={completedCount} reducedMotion={state.settings.reducedMotion} />}
        {stateLoaded && view === "settings" && <Settings state={state} update={update} storageWritable={storageWritable} accountEmail={session.user.email ?? ""} exportData={exportLocalData} importData={importLocalData} clearData={() => { void resetData(); }} onOpenSupport={() => setShowSupport(true)} onSignOut={() => void signOut()} onDeleteAccount={() => void deleteAccount()} />}
      </div>
      {runRequested && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setRunRequested(false); }}><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="run-title"><div className="dialog-icon">⛨</div><h2 id="run-title">Ausführung wird noch geprüft</h2><p>Der Runner wird für dein System erst aktiviert, wenn seine Sandbox die Phase-2-Sicherheitsprüfung besteht. Bis dahin wird dein Code nicht gestartet.</p><div className="security-note"><strong>Dein Code bleibt lokal.</strong><br />Er wurde weder hochgeladen noch an einen KI-Dienst gesendet.</div><button className="button primary full" onClick={() => setRunRequested(false)}>Verstanden</button></section></div>}
      {showCompletion && <CompletionDialog reducedMotion={state.settings.reducedMotion} onClose={() => { setShowCompletion(false); setView("diploma"); }} />}
      {showSupport && <SupportDialog learnerName={state.learnerName} onClose={() => setShowSupport(false)} onNotice={setNotice} />}
      {stateLoaded && showOnboarding && <Onboarding onFinish={finishOnboarding} />}
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
  return <div className="modal-backdrop"><section className={`dialog completion-dialog ${reducedMotion ? "reduced" : ""}`} role="dialog" aria-modal="true" aria-labelledby="completion-title"><div className="completion-sparkles" aria-hidden="true">✦　✧　✦</div><div className="dialog-icon diploma-icon">✧</div><h2 id="completion-title">Dein Lernpfad ist geschafft!</h2><p>Du hast alle sieben Lektionen im Einstiegskurs abgeschlossen.</p><div className="diploma-preview"><span>devpath · Lernerfolg</span><strong>Programmier-<br />grundlagen</strong><small>Lokales Abschlussdiplom</small></div><button className="button primary full" onClick={onClose}>{reducedMotion ? "Diplom ansehen" : `Weiter zum Diplom${seconds ? ` · ${seconds}s` : ""}`}</button><button className="text-button completion-skip" onClick={onClose}>Animation überspringen</button></section></div>;
}
