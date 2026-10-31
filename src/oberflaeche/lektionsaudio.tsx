import { useEffect, useMemo, useRef, useState } from "react";
import type { CourseLesson } from "../kurse/course";
import { lessonNarration } from "../kurse/lektionserzaehlung";

type Playback = "idle" | "playing" | "paused" | "error";

export function LektionsAudio({ lesson, courseId }: { lesson: CourseLesson; courseId: string }) {
  const supported = typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined";
  const script = useMemo(() => lessonNarration(lesson, courseId), [lesson, courseId]);
  const [playback, setPlayback] = useState<Playback>("idle");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!supported) return;
    const synthesis = window.speechSynthesis;
    const updateVoices = () => setVoices(synthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("de")));
    updateVoices();
    synthesis.addEventListener("voiceschanged", updateVoices);
    return () => synthesis.removeEventListener("voiceschanged", updateVoices);
  }, [supported]);

  useEffect(() => {
    setPlayback("idle");
    return () => {
      if (supported) window.speechSynthesis.cancel();
      utteranceRef.current = null;
    };
  }, [lesson.id, supported]);

  function stop() {
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    setPlayback("idle");
  }

  function play() {
    document.querySelector<HTMLVideoElement>(".intro-video-player")?.pause();
    const synthesis = window.speechSynthesis;
    if (playback === "paused" && utteranceRef.current) {
      synthesis.resume();
      setPlayback("playing");
      return;
    }
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = "de-DE";
    utterance.rate = rate;
    utterance.voice = voices.find((voice) => voice.voiceURI === voiceUri) ?? voices[0] ?? null;
    utterance.onstart = () => { if (utteranceRef.current === utterance) setPlayback("playing"); };
    utterance.onend = () => { if (utteranceRef.current === utterance) { utteranceRef.current = null; setPlayback("idle"); } };
    utterance.onerror = (event) => {
      if (utteranceRef.current === utterance) {
        utteranceRef.current = null;
        setPlayback(event.error === "canceled" || event.error === "interrupted" ? "idle" : "error");
      }
    };
    utteranceRef.current = utterance;
    synthesis.speak(utterance);
  }

  return <section className="lesson-audio" aria-label="Audio-Erklärung dieser Lektion">
    <div className="lesson-audio-heading"><span className="lesson-audio-symbol" aria-hidden="true">♫</span><div><strong>Diese Lektion anhören</strong><small>Kurze Erklärung mit Beispiel und nächstem Schritt</small></div></div>
    {supported ? <>
      <div className="lesson-audio-controls">
        <button type="button" className="button secondary" onClick={play}>{playback === "paused" ? "Fortsetzen" : playback === "playing" ? "Neu starten" : "▶ Anhören"}</button>
        <button type="button" className="button secondary" disabled={playback !== "playing"} onClick={() => { window.speechSynthesis.pause(); setPlayback("paused"); }}>Pause</button>
        <button type="button" className="text-button" disabled={playback === "idle"} onClick={stop}>Stopp</button>
        <label>Tempo <select value={rate} onChange={(event) => setRate(Number(event.target.value))} aria-label="Sprechtempo"><option value={0.85}>Ruhig</option><option value={1}>Normal</option><option value={1.2}>Schnell</option></select></label>
        {voices.length > 1 && <label>Stimme <select value={voiceUri} onChange={(event) => setVoiceUri(event.target.value)} aria-label="Deutsche Stimme"><option value="">Standard</option>{voices.map((voice) => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name}</option>)}</select></label>}
      </div>
      <p className="lesson-audio-status" role="status">{playback === "playing" ? "Die Erklärung läuft. Stimme und Tempo ändern sich beim nächsten Start." : playback === "paused" ? "Die Erklärung ist pausiert." : playback === "error" ? "Die Sprachausgabe konnte nicht gestartet werden. Das Transkript steht unten." : voices.length === 0 ? "Die Sprachausgabe nutzt Stimmen deines Systems oder Browsers. Falls nichts zu hören ist, prüfe die verfügbaren deutschen Stimmen." : "Bereit zum Anhören."}</p>
    </> : <p className="lesson-audio-status">Auf diesem Gerät ist keine Sprachausgabe verfügbar. Du kannst das Transkript lesen.</p>}
    <details><summary>Gesprochenen Text anzeigen</summary><p>{script}</p></details>
  </section>;
}
