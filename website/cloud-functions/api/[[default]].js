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
  const allowed = new Set((env.CORS_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean));
  if (origin === new URL(request.url).origin || allowed.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
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
      return json({ courses: result.rows }, 200, { ...cors, "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
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

    if ((request.method === "PUT" || request.method === "DELETE") && path === "/api/v1/me") {
      const identity = await identityFor(request, env);
      if (identity === false) return json({ error: "invalid_access_token" }, 401, cors);
      if (!identity) return json({ error: "authentication_required" }, 401, cors);

      if (request.method === "PUT") {
        const result = await database.query(
          "INSERT INTO accounts (id, oidc_issuer, oidc_subject) VALUES ($1, $2, $3) ON CONFLICT (oidc_issuer, oidc_subject) DO UPDATE SET updated_at = now() WHERE accounts.disabled_at IS NULL RETURNING id, created_at",
          [randomUUID(), identity.issuer, identity.subject],
        );
        if (!result.rowCount) return json({ error: "account_unavailable" }, 403, cors);
        return json({ id: result.rows[0].id, createdAt: result.rows[0].created_at }, 200, cors);
      }

      await database.query("DELETE FROM accounts WHERE oidc_issuer = $1 AND oidc_subject = $2", [identity.issuer, identity.subject]);
      return json({ deleted: true }, 200, cors);
    }

    return json({ error: "not_found" }, 404, cors);
  } catch (error) {
    // Use Makers' request UUID so this failure can be found in Log Analysis.
    const requestId = request?.requestId ?? uuid ?? randomUUID();
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("DevPath API request failed", {
      requestId,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorCode: error?.code,
      errorMessage: errorMessage.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted database URI]"),
    });
    return json({ error: "temporarily_unavailable", requestId }, 503, cors);
  }
}
