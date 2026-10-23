import { useState, type FormEvent } from "react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { authRedirectUrl, supabase } from "./auth-client";
import { LogoMark } from "./ui";

type AuthMode = "login" | "register" | "reset";

function GoogleMark() {
  return <svg className="google-mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6v5h6.6c3.9-3.6 6.1-8.8 6.1-14.7Z" />
    <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.5H5.8v5.2C9.2 39.5 16 44 24 44Z" />
    <path fill="#FBBC05" d="M12.6 27.6c-.4-1.2-.7-2.5-.7-3.6s.2-2.4.7-3.6v-5.2H5.8C4.3 18 3.5 20.9 3.5 24s.8 6 2.3 8.8l6.8-5.2Z" />
    <path fill="#EA4335" d="M24 9.5c3 0 5.7 1 7.9 3.1l5.9-5.9C34.1 3.4 29.5 1.5 24 1.5 16 1.5 9.2 6 5.8 13.2l6.8 5.2c1.6-4.9 6.1-8.9 11.4-8.9Z" />
  </svg>;
}

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
        if (!data.session) setMessage("Bitte bestätige deine E-Mail über den Link. devpath öffnet sich danach automatisch wieder.");
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
      setMessage("Die Anmeldung wurde im Browser geöffnet. Nach der Bestätigung öffnet sich devpath automatisch.");
    } catch {
      setError("Die Google-Anmeldung konnte nicht geöffnet werden. Bitte versuche es erneut.");
    } finally { setBusy(false); }
  };

  const title = mode === "register" ? "Dein Lernweg beginnt hier." : mode === "login" ? "Willkommen zurück." : "Passwort zurücksetzen.";
  return <main className="auth-screen">
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-brand"><LogoMark /><span>devpath</span></div>
      <div className="eyebrow">DEIN PERSÖNLICHER LERNPLATZ</div>
      <h1 id="auth-title">{title}</h1>
      <p className="auth-description">Erstelle ein Konto oder melde dich an. Dein Lernplan wird anschließend deinem devpath-Konto zugeordnet.</p>
      {mode !== "reset" && <div className="auth-social">
        <button className="button secondary auth-provider" disabled={busy} onClick={() => void social()}><GoogleMark /><span>Mit Google {mode === "register" ? "registrieren" : "anmelden"}</span></button>
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
      <p className="auth-privacy">E-Mail und Anbieter-Identität verwaltet Supabase Auth. Dein devpath-Konto speichert die Verknüpfung und deinen Lernplan. Lerncode bleibt lokal auf diesem Gerät.</p>
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
  return <main className="auth-screen"><section className="auth-card" aria-labelledby="password-recovery-title"><div className="auth-brand"><LogoMark /><span>devpath</span></div><div className="eyebrow">KONTO-SICHERHEIT</div><h1 id="password-recovery-title">Neues Passwort festlegen.</h1>{done ? <><p className="auth-description">Dein Passwort wurde aktualisiert. Du kannst devpath jetzt weiterverwenden.</p><button className="button primary auth-submit" onClick={onFinished}>Weiter zu devpath</button></> : <form className="auth-form" onSubmit={(event) => void submit(event)}><label className="field-label">Neues Passwort<input className="text-input" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="field-label">Passwort wiederholen<input className="text-input" type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{error && <p className="auth-message error" role="alert">{error}</p>}<button className="button primary auth-submit" disabled={busy}>{busy ? "Wird gespeichert …" : "Passwort aktualisieren"}</button></form>}</section></main>;
}
