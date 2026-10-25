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
export const authConfigurationIssue = authConfigured ? "" : "Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.";
export const authRedirectUrl = "codezone://auth/callback";
export const apiBaseUrl = (import.meta.env.VITE_DEVPATH_API_URL?.trim() || "https://devpath-dpxzcux4g6bz.edgeone.dev").replace(/\/$/, "");

export const supabase = authConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;

export async function openAuthCallback(url: string): Promise<Session | null> {
  if (!supabase) throw new Error("Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.");
  const callback = new URL(url);
  if (callback.protocol !== "codezone:" || callback.hostname !== "auth" || callback.pathname !== "/callback") {
    throw new Error("Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.");
  }
  const fragmentParams = new URLSearchParams(callback.hash.replace(/^#/, ""));
  const errorCode = callback.searchParams.get("error_code")
    ?? fragmentParams.get("error_code");
  const error = callback.searchParams.get("error_description")
    ?? callback.searchParams.get("error")
    ?? fragmentParams.get("error_description")
    ?? fragmentParams.get("error");
  if (error || errorCode) throw new Error("Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.");
  const code = callback.searchParams.get("code") ?? fragmentParams.get("code");
  if (!code) throw new Error("Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.");
  const result = await supabase.auth.exchangeCodeForSession(code);
  if (result.error) throw new Error("Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.");
  return result.data.session;
}

export async function accountRequest<T>(session: Session, method: "GET" | "PUT" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}/api/v1/me`, {
      method,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new Error("Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.");
  }
  if (!response.ok) {
    throw new Error("Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später erneut.");
  }
  return await response.json() as T;
}
