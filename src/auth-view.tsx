import { useState, type FormEvent } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { authRedirectUrl, supabase } from "./auth-client";
import { LogoMark } from "./ui";

type AuthMode = "login" | "register" | "reset";

export function AuthView({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<AuthMode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || busy) return;
    setBusy(true); setMessage(""); setError("");
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: authRedirectUrl });
        if (error) throw error;
        setMessage("Wenn diese Adresse registriert ist, kommt eine E-Mail zum Zurücksetzen des Passworts.");
        return;
      }
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: authRedirectUrl } });
        if (error) throw error;
        if (!data.session) setMessage("Bitte bestätige deine E-Mail über den Link. DevPath öffnet sich danach automatisch wieder.");
        else onAuthenticated();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        onAuthenticated();
      }
    } catch {
      setError("Die Anmeldung konnte nicht abgeschlossen werden. Prüfe deine Eingaben oder versuche es später erneut.");
    } finally { setBusy(false); }
  };

  const social = async () => {
    if (!supabase || busy) return;
    setBusy(true); setMessage(""); setError("");
    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: authRedirectUrl, skipBrowserRedirect: true, scopes: "openid email profile" },
      });
      if (authError) throw authError;
      if (!data.url) throw new Error("Die Google-Anmeldung ist derzeit nicht verfügbar.");
      await openUrl(data.url);
      setMessage("Die Anmeldung wurde im Browser geöffnet. Kehre nach der Bestätigung zu DevPath zurück.");
    } catch {
      setError("Die Google-Anmeldung konnte nicht geöffnet werden. Bitte versuche es erneut.");
    } finally { setBusy(false); }
  };

  const title = mode === "register" ? "Dein Lernweg beginnt hier." : mode === "login" ? "Willkommen zurück." : "Passwort zurücksetzen.";
  return <main className="auth-screen">
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-brand"><LogoMark /><span>DevPath</span></div>
      <div className="eyebrow">DEIN PERSÖNLICHER LERNPLATZ</div>
      <h1 id="auth-title">{title}</h1>
      <p className="auth-description">Erstelle ein Konto oder melde dich an. Dein Lernplan wird anschließend deinem DevPath-Konto zugeordnet.</p>
      {mode !== "reset" && <div className="auth-social">
        <button className="button secondary auth-provider" disabled={busy} onClick={() => void social()}><span className="provider-g">G</span> Mit Google {mode === "register" ? "registrieren" : "anmelden"}</button>
      </div>}
      {mode !== "reset" && <div className="auth-divider"><span>oder mit E-Mail</span></div>}
      <form onSubmit={(event) => void submit(event)} className="auth-form">
        <label className="field-label">E-Mail-Adresse<input className="text-input" type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@beispiel.de" /></label>
        {mode !== "reset" && <label className="field-label">Passwort<input className="text-input" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mindestens 8 Zeichen" /></label>}
        {error && <p className="auth-message error" role="alert">{error}</p>}
        {message && <p className="auth-message" role="status">{message}</p>}
        <button className="button primary auth-submit" type="submit" disabled={busy}>{busy ? "Einen Moment …" : mode === "register" ? "Konto erstellen" : mode === "login" ? "Anmelden" : "Link zum Zurücksetzen senden"}</button>
      </form>
      <div className="auth-switch">
        {mode === "register" ? <><span>Schon ein Konto?</span><button className="text-button" onClick={() => { setMode("login"); setError(""); setMessage(""); }}>Anmelden</button></> : mode === "login" ? <><span>Noch kein Konto?</span><button className="text-button" onClick={() => { setMode("register"); setError(""); setMessage(""); }}>Konto erstellen</button></> : <button className="text-button" onClick={() => { setMode("login"); setError(""); setMessage(""); }}>Zurück zur Anmeldung</button>}
        {mode === "login" && <button className="text-button" onClick={() => { setMode("reset"); setError(""); setMessage(""); }}>Passwort vergessen?</button>}
      </div>
      <p className="auth-privacy">E-Mail und Anbieter-Identität verwaltet Supabase Auth. Dein DevPath-Konto speichert die Verknüpfung und deinen Lernplan. Lerncode bleibt lokal auf diesem Gerät.</p>
    </section>
  </main>;
}

export function PasswordRecoveryView({ onFinished }: { onFinished: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || busy) return;
    if (password !== confirmation) { setError("Die Passwörter stimmen nicht überein."); return; }
    setBusy(true); setError("");
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setDone(true);
    } catch { setError("Das Passwort konnte nicht aktualisiert werden. Bitte prüfe deine Verbindung und versuche es erneut."); }
    finally { setBusy(false); }
  };
  return <main className="auth-screen"><section className="auth-card" aria-labelledby="password-recovery-title"><div className="auth-brand"><LogoMark /><span>DevPath</span></div><div className="eyebrow">KONTO-SICHERHEIT</div><h1 id="password-recovery-title">Neues Passwort festlegen.</h1>{done ? <><p className="auth-description">Dein Passwort wurde aktualisiert. Du kannst DevPath jetzt weiterverwenden.</p><button className="button primary auth-submit" onClick={onFinished}>Weiter zu DevPath</button></> : <form className="auth-form" onSubmit={(event) => void submit(event)}><label className="field-label">Neues Passwort<input className="text-input" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="field-label">Passwort wiederholen<input className="text-input" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{error && <p className="auth-message error" role="alert">{error}</p>}<button className="button primary auth-submit" disabled={busy}>{busy ? "Wird gespeichert …" : "Passwort aktualisieren"}</button></form>}</section></main>;
}
