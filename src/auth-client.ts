import { createClient, type Session } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const placeholderKey = !supabaseAnonKey
  || /^(hier_den_|your[_ -]|replace[_ -]|changeme|placeholder)/i.test(supabaseAnonKey);
let validSupabaseUrl = false;
try {
  const parsedUrl = new URL(supabaseUrl ?? "");
  validSupabaseUrl = parsedUrl.protocol === "https:" && parsedUrl.hostname.endsWith(".supabase.co");
} catch {
  validSupabaseUrl = false;
}

export const authConfigured = validSupabaseUrl && !placeholderKey;
export const authConfigurationIssue = !validSupabaseUrl
  ? "Die Anmeldung ist auf diesem Gerät nicht verfügbar. Die CodeZone-App benötigt eine gültige Projektverbindung."
  : placeholderKey
    ? "Die Anmeldung ist auf diesem Gerät noch nicht eingerichtet. Für den Start der App muss der Beispielwert durch den öffentlichen Supabase-Schlüssel ersetzt und die App danach neu gebaut werden."
    : "";
export const authRedirectUrl = "codezone://auth/callback";
export const apiBaseUrl = (import.meta.env.VITE_DEVPATH_API_URL?.trim() || "https://devpath-dpxzcux4g6bz.edgeone.dev").replace(/\/$/, "");

export const supabase = authConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;

export async function openAuthCallback(url: string): Promise<Session | null> {
  if (!supabase) throw new Error("Die Kontoanmeldung ist derzeit nicht verfügbar.");
  const callback = new URL(url);
  if (callback.protocol !== "codezone:" || callback.hostname !== "auth" || callback.pathname !== "/callback") {
    throw new Error("Die Anmelde-Rückleitung ist ungültig.");
  }
  const fragmentParams = new URLSearchParams(callback.hash.replace(/^#/, ""));
  const errorCode = callback.searchParams.get("error_code")
    ?? fragmentParams.get("error_code");
  const error = callback.searchParams.get("error_description")
    ?? callback.searchParams.get("error")
    ?? fragmentParams.get("error_description")
    ?? fragmentParams.get("error");
  if (error || errorCode) throw new Error(readableCallbackError(`${errorCode ?? ""} ${error ?? ""}`));
  const code = callback.searchParams.get("code") ?? fragmentParams.get("code");
  if (!code) throw new Error("Der Anmelde-Code fehlt. Bitte starte die Anmeldung erneut.");
  const result = await supabase.auth.exchangeCodeForSession(code);
  if (result.error) throw new Error(readableCallbackError(`${result.error.code ?? ""} ${result.error.message}`));
  return result.data.session;
}

function readableCallbackError(reason: string): string {
  const normalized = reason.toLowerCase();
  if (normalized.includes("code_verifier") || normalized.includes("code verifier") || normalized.includes("flow_state") || normalized.includes("flow state")) {
    return "CodeZone hat den Rückruf geöffnet, aber der Sicherheitsnachweis passt nicht zu diesem App-Fenster. Starte Google-Anmeldung erneut aus genau diesem CodeZone-Fenster und schließe es bis zur Rückkehr nicht.";
  }
  if (normalized.includes("access_denied") || normalized.includes("user_cancelled") || normalized.includes("user canceled")) {
    return "Die Anmeldung wurde im Google-Fenster abgebrochen. Du kannst sie erneut starten.";
  }
  if (normalized.includes("expired") || normalized.includes("invalid_grant") || normalized.includes("already used")) {
    return "Der einmalige Anmeldecode ist abgelaufen oder wurde schon verwendet. Starte Google-Anmeldung erneut und öffne den Rückruf nur einmal.";
  }
  if (normalized.includes("fetch") || normalized.includes("network") || normalized.includes("timeout")) {
    return "CodeZone hat den Rückruf erhalten, konnte Supabase aber nicht erreichen. Prüfe die Internetverbindung und starte die Anmeldung erneut.";
  }
  return "CodeZone hat den Rückruf erhalten, aber Supabase konnte ihn nicht bestätigen. Starte die Anmeldung erneut.";
}

export async function accountRequest<T>(session: Session, method: "GET" | "PUT" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const response = await fetch(`${apiBaseUrl}/api/v1/me`, {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error("Deine Anmeldung ist abgelaufen. Bitte melde dich erneut an.");
    if (response.status === 403) throw new Error("Dieses CodeZone-Konto ist deaktiviert.");
    if (response.status === 404) throw new Error("Die Anmeldung war erfolgreich, aber der CodeZone-Kontodienst ist unter der eingestellten Projektadresse nicht erreichbar (HTTP 404).");
    if (response.status >= 500) throw new Error(`Die Anmeldung war erfolgreich, aber der CodeZone-Kontodienst ist vorübergehend nicht verfügbar (HTTP ${response.status}).`);
    throw new Error("Deine Kontodaten sind derzeit nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.");
  }
  return await response.json() as T;
}
