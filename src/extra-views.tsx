import { useMemo, useState } from "react";
import type { CatalogCourse } from "./catalog";
import { courseCatalog, recommendedCourse } from "./catalog";
import type { DevPathState, LocalProject } from "./types";
import { Icon } from "./ui";

function Title({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <header className="page-title-row"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="page-subtitle">{subtitle}</p></div></header>;
}

export function CourseLibrary({ openPilot }: { openPilot: () => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Alle");
  const filters = ["Alle", "Programmiersprachen", "Themenkurse"];
  const visible = useMemo(() => courseCatalog.filter((course) => {
    const searchable = `${course.title} ${course.description} ${course.tags.join(" ")}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (filter === "Alle" || (filter === "Programmiersprachen" ? course.category === "Programmiersprache" || course.tags.includes("Webentwicklung") : course.category === "Themenkurs"));
  }), [filter, query]);
  return <><Title eyebrow="KURSBIBLIOTHEK" title="Finde deinen nächsten Kurs" subtitle="Alle Lernpfade sind sichtbar. Der HTML- und CSS-Pilotkurs ist direkt verfügbar; weitere Inhalte werden schrittweise ergänzt."/><div className="catalog-controls"><label className="search-field"><Icon name="search"/><input aria-label="Kurse suchen" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kurse oder Themen suchen"/></label><div className="catalog-filters" role="group" aria-label="Kurse filtern">{filters.map((item) => <button key={item} className={`filter-chip ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="course-grid">{visible.map((course) => <CourseCard key={course.id} course={course} onOpen={openPilot}/>)}</div>{visible.length === 0 && <p className="empty-state">Keine passenden Kurse gefunden.</p>}</>;
}

export function DashboardDiscover({ state, completedCount, openLibrary, openCurriculum }: { state: DevPathState; completedCount: number; openLibrary: () => void; openCurriculum: () => void }) {
  const next = recommendedCourse(state);
  const localActivity = Object.entries(state.progress).reduce((sum, [id, item]) => sum + ((id.startsWith("html-") || id.startsWith("css-")) ? item.attempts : 0), 0);
  return <><section className="discovery-grid"><article className="panel discovery-card"><div className="eyebrow">EMPFEHLUNG FÜR DICH</div><h2>{next.title}</h2><p>{state.courseCompletedAt ? `Dein Lernziel „${state.goal}“ und dein bisheriger Fortschritt sprechen für diesen nächsten Schritt.` : "Dieser Pilotkurs passt zu deinem Lernziel und startet auf deinem aktuellen Erfahrungsniveau."}</p><button className="button secondary" onClick={next.status === "available" ? openCurriculum : openLibrary}>{next.status === "available" ? "Lehrplan öffnen" : "Kurs vormerken · Bibliothek öffnen"} →</button></article><article className="panel discovery-card"><div className="eyebrow">NEU IN DER BIBLIOTHEK</div><h2>Neue Lernpfade entdecken</h2><p>Backend, Sicherheit und KI sind bereits in der Übersicht sichtbar und werden als kommende Kurse gekennzeichnet.</p><button className="text-button" onClick={openLibrary}>Zur Bibliothek →</button></article><article className="panel discovery-card"><div className="eyebrow">DEIN AKTUELLER SCHWERPUNKT</div><h2>{completedCount ? "HTML & CSS" : "Dein erster Lernschritt"}</h2><p>{localActivity ? `${localActivity} Übungsversuche wurden ausschließlich auf diesem Gerät gezählt.` : "Deine lokalen Lernaktivitäten erscheinen hier, sobald du mit Übungen beginnst."}</p><small className="field-note">DevPath erhebt keine nutzerübergreifenden Popularitätsdaten.</small></article></section><section className="trend-note"><Icon name="spark"/><span><strong>Community-Trends</strong><small>Beliebte Kurse über alle Nutzer hinweg werden erst angezeigt, wenn eine freiwillige und datensparsame Statistikfunktion verfügbar ist.</small></span></section></>;
}

function CourseCard({ course, onOpen }: { course: CatalogCourse; onOpen: () => void }) {
  return <article className={`panel catalog-card ${course.status}`}><div className="catalog-card-top"><span className="catalog-glyph">{course.icon}</span><span className={`course-status ${course.status}`}>{course.status === "available" ? "Jetzt lernen" : "In Vorbereitung"}</span></div><div className="eyebrow">{course.category}</div><h2>{course.title}</h2><p>{course.description}</p><div className="catalog-card-footer"><span>{course.status === "available" ? "Lokaler Pilotkurs" : "Wird ergänzt"}</span><button className="text-button" onClick={course.status === "available" ? onOpen : undefined} disabled={course.status !== "available"}>{course.status === "available" ? "Kurs öffnen →" : "Demnächst"}</button></div></article>;
}

export function Curriculum({ state, completedCount, openLesson, openLibrary }: { state: DevPathState; completedCount: number; openLesson: (id: string) => void; openLibrary: () => void }) {
  return <><Title eyebrow="DEIN LEHRPLAN" title="Dein persönlicher Lernpfad" subtitle={`${state.studyDays.length} Einheiten pro Woche · etwa ${state.sessionMinutes} Minuten · bevorzugt um ${state.studyTime} Uhr`}/><section className="panel curriculum-hero"><span className="catalog-glyph">&lt;/&gt;</span><div><div className="eyebrow">AKTIVER LERNPFAD</div><h2>Deine erste responsive Webseite</h2><p>Der Plan richtet sich nach deinem Ziel „{state.goal}“ und passt sich an abgeschlossene Schritte, Wiederholungen und benötigte Hinweise an. Deine Lerndaten bleiben lokal.</p><div className="progress-line"><span style={{width:`${Math.round(completedCount / 7 * 100)}%`}}/></div><small>{completedCount} von 7 Lernzielen · {state.experience === "new" ? "Einsteigerpfad" : "angepasst an deine Vorkenntnisse"}</small></div></section><div className="curriculum-list">{courseCatalog[0] && <CurriculumLessons state={state} openLesson={openLesson}/>}</div><button className="button secondary" onClick={openLibrary}>Weitere Lernpfade ansehen</button></>;
}

function CurriculumLessons({ state, openLesson }: { state: DevPathState; openLesson: (id: string) => void }) {
  return <>{["Struktur mit HTML", "Texte und Überschriften", "Bilder und Links", "CSS: Farben und Schriften", "Abstände und Boxmodell", "Responsive Layouts", "Deine Infoseite fertigstellen"].map((title, index) => {
    const ids = ["html-structure", "html-headings", "html-links-images", "css-first-rules", "css-box-model", "css-flexbox", "responsive-project"];
    const progress = state.progress[ids[index]];
    return <button className={`curriculum-step ${progress?.completed ? "done" : ""}`} key={ids[index]} onClick={() => openLesson(ids[index])}><span className="step-index">{progress?.completed ? "✓" : index + 1}</span><span><strong>{title}</strong><small>{progress?.completed ? "Abgeschlossen" : `Etwa ${10 + index * 2} Minuten · ${index < 3 ? "HTML" : "CSS"}`}</small></span><Icon name="arrow"/></button>;
  })}</>;
}

export function Projects({ projects, open, create, manage }: { projects: LocalProject[]; open: () => void; create: () => void; manage: (id: string) => void }) {
  return <><Title eyebrow="DEINE ARBEITSFLÄCHE" title="Meine Projekte" subtitle="Verwalte, öffne und exportiere deine Projekte. Dateien bleiben lokal auf diesem Gerät."/><div className="project-manager-actions"><button className="button primary" onClick={create}>Neues Projekt</button><button className="button secondary" onClick={open}>Code Studio öffnen</button></div><div className="course-grid">{projects.map((project) => <article className="panel catalog-card" key={project.id}><div className="catalog-card-top"><span className="catalog-glyph">{project.language.toUpperCase()}</span><span className="course-status available">Lokal</span></div><h2>{project.name}</h2><p>{Object.keys(project.files).length} Dateien · zuletzt geändert {new Date(project.updatedAt).toLocaleDateString()}</p><div className="catalog-card-footer"><span>{project.language.toUpperCase()}</span><button className="text-button" onClick={() => manage(project.id)}>Im Studio öffnen →</button></div></article>)}</div></>;
}

const demoProjects = [{ title: "Wetter-Dashboard", language: "JavaScript", description: "Ein klares Dashboard-Konzept mit Karten und Statusanzeigen." }, { title: "Portfolio im Raster", language: "HTML · CSS", description: "Eine responsive Projektgalerie als Layout-Inspiration." }, { title: "Mini-Spiel: Reaktionszeit", language: "JavaScript", description: "Eine kleine Oberfläche für ein Reaktionsspiel." }];

export function Community({ copyToProject }: { copyToProject: (name: string, files: Record<string, string>) => void }) {
  return <><Title eyebrow="COMMUNITY · DEMO" title="Ideen, die weiterführen" subtitle="Vorschau mit Beispielen. Diese Demo-Inhalte stammen nicht von echten Nutzern und werden nicht veröffentlicht."/><div className="community-notice"><Icon name="community"/><span><strong>Lokale Demo</strong><small>Projekt teilen, Kommentare und Nutzerprofile sind noch nicht verbunden.</small></span></div><div className="course-grid">{demoProjects.map((project) => <article className="panel catalog-card community-card" key={project.title}><div className="community-art"><span>&lt;/&gt;</span><i/><i/><i/></div><div className="eyebrow">{project.language} · DEMO-PROJEKT</div><h2>{project.title}</h2><p>{project.description}</p><div className="catalog-card-footer"><span>Beispiel ansehen</span><button className="text-button" onClick={() => copyToProject(project.title, {"index.html":`<!doctype html>\n<html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${project.title}</title><link rel="stylesheet" href="styles.css"></head><body><main><h1>${project.title}</h1><p>${project.description}</p><button>Los geht's</button></main></body></html>`, "styles.css":"body{font-family:system-ui,sans-serif;margin:0;padding:4rem;background:#eef5ff;color:#17233c}main{max-width:48rem;margin:auto;padding:2rem;border-radius:2rem;background:white}button{padding:.8rem 1.2rem;border:0;border-radius:1rem;background:#2563eb;color:white}"})}>In mein Studio kopieren →</button></div></article>)}</div></>;
}
