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
  const error = callback.searchParams.get("error_description")
    ?? callback.searchParams.get("error")
    ?? fragmentParams.get("error_description")
    ?? fragmentParams.get("error");
  if (error) throw new Error("Supabase konnte die Anmeldung nicht bestätigen. Bitte starte sie erneut.");
  const code = callback.searchParams.get("code") ?? fragmentParams.get("code");
  if (!code) throw new Error("Der Anmelde-Code fehlt. Bitte starte die Anmeldung erneut.");
  const result = await supabase.auth.exchangeCodeForSession(code);
  if (result.error) throw new Error("Die Anmeldebestätigung ist abgelaufen oder wurde bereits verwendet. Bitte starte sie erneut.");
  return result.data.session;
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
