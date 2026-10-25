import { randomUUID } from "node:crypto";
import pg from "pg";
import { verifyAccessToken } from "../lib/auth.mjs";

const { Pool } = pg;
let pool;

function getPool(env) {
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  if (!pool) {
    const production = env.NODE_ENV === "production";
    if (production && env.DATABASE_SSL !== "true") {
      throw new Error("DATABASE_SSL must be true in production");
    }
    const ca = getDatabaseCa(env, production);
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: true, ...(ca ? { ca } : {}) }
        : false,
      max: Number(env.DATABASE_POOL_SIZE ?? 1),
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      statement_timeout: 5_000,
      query_timeout: 5_000,
      application_name: "devpath-edgeone-api",
    });
  }
  return pool;
}

function getDatabaseCa(env, production) {
  const direct = env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");
  const encodedParts = [1, 2, 3, 4]
    .map((part) => env[`DATABASE_CA_CERT_B64_${part}`])
    .filter(Boolean);
  const ca = direct || (encodedParts.length
    ? Buffer.from(encodedParts.join(""), "base64").toString("utf8")
    : "");
  if (production && (!ca.includes("-----BEGIN CERTIFICATE-----") || !ca.includes("-----END CERTIFICATE-----"))) {
    throw new Error("A valid DATABASE_CA_CERT or DATABASE_CA_CERT_B64_1..4 is required in production");
  }
  return ca;
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin");
  if (!origin) return {};
  // Tauri's WebView uses one of these fixed local origins. Allow them here by
  // default so a missing Makers variable cannot make OAuth succeed and then
  // hide the account API response behind a browser-level "Failed to fetch".
  const allowed = new Set([
    "http://tauri.localhost",
    "https://tauri.localhost",
    "tauri://localhost",
    ...(env.CORS_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean),
  ]);
  if (origin === new URL(request.url).origin || allowed.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Vary": "Origin",
    };
  }
  return null;
}

async function identityFor(request, env) {
  try {
    return await verifyAccessToken(request.headers.get("authorization"), env);
  } catch {
    return false;
  }
}

async function withAccountContext(database, identity, operation) {
  const client = await database.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "SELECT set_config('devpath.oidc_issuer', $1, true), set_config('devpath.oidc_subject', $2, true)",
      [identity.issuer, identity.subject],
    );
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

export async function onRequest({ request, env = {}, uuid }) {
  const cors = corsHeaders(request, env);
  if (cors === null) return json({ error: "origin_not_allowed" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "") || "/";

  try {
    if (request.method === "GET" && path === "/api/health/live") {
      return json({ status: "ok" }, 200, cors);
    }

    const database = getPool(env);
    if (request.method === "GET" && path === "/api/health/ready") {
      await database.query("SELECT 1");
      return json({ status: "ready" }, 200, cors);
    }

    if (request.method === "GET" && path === "/api/v1/courses") {
      const result = await database.query(
        "SELECT c.id, c.slug, c.title, c.summary, c.category, c.language, c.level, r.version, r.manifest, r.content_sha256 FROM courses c JOIN LATERAL (SELECT version, manifest, content_sha256 FROM course_releases WHERE course_id = c.id AND published_at IS NOT NULL ORDER BY published_at DESC LIMIT 1) r ON TRUE WHERE c.published = TRUE ORDER BY c.category, c.title",
      );
      if (result.rowCount === 0) {
        const diagnostic = await database.query(`
          SELECT current_database() AS database_name,
                 current_user AS database_user,
                 inet_server_addr()::text AS database_server,
                 current_schema() AS current_schema,
                 EXISTS (SELECT 1 FROM public.courses WHERE id = 'programming-intro' AND published = TRUE) AS intro_course_visible,
                 EXISTS (SELECT 1 FROM public.course_releases WHERE course_id = 'programming-intro' AND published_at IS NOT NULL) AS intro_release_visible
        `);
        console.warn("CodeZone published catalog is empty", {
          requestId: request?.requestId ?? uuid ?? "unavailable",
          courseCount: result.rowCount,
          ...diagnostic.rows[0],
        });
      }
      // The catalog is read from mutable PostgreSQL metadata. Avoid serving an old
      // empty catalog from a browser or edge cache after a course is published.
      return json({ courses: result.rows }, 200, { ...cors, "Cache-Control": "no-store" });
    }

    const releaseMatch = path.match(/^\/api\/v1\/releases\/([^/]+)$/);
    if (request.method === "GET" && releaseMatch) {
      const platform = decodeURIComponent(releaseMatch[1]);
      const channel = url.searchParams.get("channel") ?? "alpha";
      const platforms = new Set(["windows-x64", "windows-arm64", "macos-arm64", "macos-x64", "linux-x64", "linux-arm64"]);
      if (!platforms.has(platform) || !["alpha", "beta", "stable"].includes(channel)) {
        return json({ error: "invalid_release_target" }, 400, cors);
      }
      const result = await database.query(
        "SELECT version, platform, channel, artifact_url, artifact_sha256, signature, minimum_version, mandatory, published_at FROM app_releases WHERE platform = $1 AND channel = $2 AND published_at IS NOT NULL ORDER BY published_at DESC LIMIT 1",
        [platform, channel],
      );
      if (!result.rowCount) return json({ error: "release_not_found" }, 404, cors);
      return json(result.rows[0], 200, { ...cors, "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
    }

    if (["GET", "PUT", "PATCH", "DELETE"].includes(request.method) && path === "/api/v1/me") {
      const identity = await identityFor(request, env);
      if (identity === false) return json({ error: "invalid_access_token" }, 401, cors);
      if (!identity) return json({ error: "authentication_required" }, 401, cors);

      if (request.method === "PUT") {
        const result = await withAccountContext(database, identity, async (client) => {
          await client.query(
            "INSERT INTO accounts (id, oidc_issuer, oidc_subject) VALUES ($1, $2, $3) ON CONFLICT (oidc_issuer, oidc_subject) DO NOTHING",
            [randomUUID(), identity.issuer, identity.subject],
          );
          return client.query(
            "SELECT id, created_at, profile FROM accounts WHERE oidc_issuer = $1 AND oidc_subject = $2 AND disabled_at IS NULL",
            [identity.issuer, identity.subject],
          );
        });
        if (!result.rowCount) return json({ error: "account_unavailable" }, 403, cors);
        return json({ id: result.rows[0].id, createdAt: result.rows[0].created_at, profile: result.rows[0].profile }, 200, cors);
      }

      if (request.method === "GET") {
        const result = await withAccountContext(database, identity, (client) => client.query(
          "SELECT id, created_at, profile FROM accounts WHERE oidc_issuer = $1 AND oidc_subject = $2 AND disabled_at IS NULL",
          [identity.issuer, identity.subject],
        ));
        if (!result.rowCount) return json({ error: "account_not_found" }, 404, cors);
        return json({ id: result.rows[0].id, createdAt: result.rows[0].created_at, profile: result.rows[0].profile }, 200, cors);
      }

      if (request.method === "PATCH") {
        const raw = await request.text();
        if (raw.length > 12_000) return json({ error: "profile_too_large" }, 413, cors);
        let body;
        try { body = JSON.parse(raw); } catch { return json({ error: "invalid_json" }, 400, cors); }
        const profile = body?.profile;
        if (!profile || typeof profile !== "object" || Array.isArray(profile)) return json({ error: "invalid_profile" }, 400, cors);
        const learnerName = typeof profile.learnerName === "string" ? profile.learnerName.trim() : "";
        const goal = typeof profile.goal === "string" ? profile.goal.trim() : "";
        const experience = profile.experience;
        const weeklySessions = profile.weeklySessions;
        const studyDays = profile.studyDays;
        const studyTime = profile.studyTime;
        const sessionMinutes = profile.sessionMinutes;
        if (!learnerName || learnerName.length > 32 || !goal || goal.length > 100 || !["new", "some", "experienced"].includes(experience)
          || !Number.isInteger(weeklySessions) || weeklySessions < 1 || weeklySessions > 7
          || !Array.isArray(studyDays) || studyDays.length !== weeklySessions || studyDays.some((day) => !Number.isInteger(day) || day < 0 || day > 6)
          || new Set(studyDays).size !== studyDays.length || typeof studyTime !== "string" || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(studyTime)
          || ![10, 15, 20, 30, 45, 60].includes(sessionMinutes) || profile.onboardingCompleted !== true) {
          return json({ error: "invalid_profile" }, 400, cors);
        }
        const safeProfile = { learnerName, goal, experience, weeklySessions, studyDays, studyTime, sessionMinutes, onboardingCompleted: true };
        const result = await withAccountContext(database, identity, (client) => client.query(
          "UPDATE accounts SET profile = $3::jsonb, updated_at = now() WHERE oidc_issuer = $1 AND oidc_subject = $2 AND disabled_at IS NULL RETURNING id, created_at, profile",
          [identity.issuer, identity.subject, JSON.stringify(safeProfile)],
        ));
        if (!result.rowCount) return json({ error: "account_not_found" }, 404, cors);
        return json({ id: result.rows[0].id, createdAt: result.rows[0].created_at, profile: result.rows[0].profile }, 200, cors);
      }

      if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json({ error: "account_deletion_not_configured" }, 503, cors);
      const deletedIdentity = await fetch(`${env.SUPABASE_URL.replace(/\/$/, "")}/auth/v1/admin/users/${encodeURIComponent(identity.subject)}`, {
        method: "DELETE",
        headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
        signal: AbortSignal.timeout(5_000),
      });
      if (!deletedIdentity.ok && deletedIdentity.status !== 404) return json({ error: "account_deletion_failed" }, 502, cors);
      await withAccountContext(database, identity, (client) => client.query(
        "DELETE FROM accounts WHERE oidc_issuer = $1 AND oidc_subject = $2", [identity.issuer, identity.subject],
      ));
      return json({ deleted: true }, 200, cors);
    }

    return json({ error: "not_found" }, 404, cors);
  } catch (error) {
    // Use Makers' request UUID so this failure can be found in Log Analysis.
    const requestId = request?.requestId ?? uuid ?? randomUUID();
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("CodeZone API request failed", {
      requestId,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorCode: error?.code,
      errorMessage: errorMessage.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted database URI]"),
    });
    return json({ error: "temporarily_unavailable", requestId }, 503, cors);
  }
}
