import { useEffect, useRef, useState } from "react";

type Chapter = { id: string; title: string; start: number };
type VideoIndex = { duration: number; chapters: Chapter[] };

const asset = (name: string) => `${import.meta.env.BASE_URL}videos/${name}`;
const timeLabel = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;

export function Einstiegsvideo({ lessonId }: { lessonId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState<VideoIndex | null>(null);
  const [open, setOpen] = useState(lessonId === "program-output");
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(asset("einstieg-kapitel.json"), { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Kapitel fehlen"); return response.json() as Promise<VideoIndex>; })
      .then(setIndex)
      .catch((reason) => { if (reason?.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, []);

  useEffect(() => { videoRef.current?.pause(); }, [lessonId]);

  function seek(start: number) {
    const video = videoRef.current;
    if (!video) return;
    setOpen(true);
    video.currentTime = start;
    setCurrentTime(start);
    void video.play().catch(() => setError(true));
  }

  const currentChapter = index?.chapters.reduce((current, chapter) => currentTime >= chapter.start ? chapter : current, index.chapters[0]);

  return <section className="intro-video-section" aria-label="Animationsvideo zum Einstiegskurs">
    <div className="intro-video-summary"><span aria-hidden="true">▶</span><div><strong>Einstieg als Animationsvideo</strong><small>Alle 13 Lektionen · Kapitel, Sprecherstimme und Untertitel · 15 Minuten</small></div></div>
    <details open={open} onToggle={(event) => { setOpen(event.currentTarget.open); if (!event.currentTarget.open) videoRef.current?.pause(); }}>
      <summary>{open ? "Video einklappen" : "Video und Kapitel öffnen"}</summary>
      <div className="intro-video-inner">
        <video ref={videoRef} className="intro-video-player" controls preload="metadata" playsInline poster={asset("einstieg-poster.png")} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onPlay={() => window.speechSynthesis?.cancel()} onError={() => setError(true)}>
          <source src={asset("einstieg-programmierung.mp4")} type="video/mp4" />
          <track kind="captions" src={asset("einstieg-programmierung.vtt")} srcLang="de" label="Deutsch" default />
          Dein Gerät kann dieses Video nicht abspielen.
        </video>
        {error && <p className="intro-video-error" role="status">Das Video konnte nicht geladen werden. Die einzelnen Lektionen und ihre Audio-Erklärungen bleiben verfügbar.</p>}
        {index && <><div className="intro-video-current">Jetzt: <strong>{currentChapter?.title}</strong><span>{timeLabel(currentTime)} / {timeLabel(index.duration)}</span></div>{index.chapters.some((chapter) => chapter.id === lessonId) && <button className="text-button intro-video-lesson-jump" type="button" onClick={() => seek(index.chapters.find((chapter) => chapter.id === lessonId)!.start)}>Zum Abschnitt dieser Lektion →</button>}<div className="intro-video-chapters" aria-label="Videokapitel">{index.chapters.map((chapter, chapterIndex) => <button type="button" key={chapter.id} className={currentChapter?.id === chapter.id ? "active" : ""} aria-current={currentChapter?.id === chapter.id ? "true" : undefined} onClick={() => seek(chapter.start)}><span>{(chapterIndex + 1).toString().padStart(2, "0")}</span><strong>{chapter.title}</strong><small>{timeLabel(chapter.start)}</small></button>)}</div></>}
      </div>
    </details>
  </section>;
}
