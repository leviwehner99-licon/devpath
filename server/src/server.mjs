import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { randomUUID } from "node:crypto";
import { createPool } from "./db.mjs";
import { verifyAccessToken } from "./auth.mjs";

const app = Fastify({
  logger: { redact: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie"] },
  bodyLimit: 16 * 1024,
  trustProxy: process.env.TRUST_PROXY === "true",
  requestTimeout: 10_000,
});
const pool = createPool();
const allowedOrigins = new Set((process.env.CORS_ORIGINS ?? "").split(",").map((item) => item.trim()).filter(Boolean));

await app.register(cors, {
  credentials: false,
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(null, false);
  },
});
await app.register(rateLimit, { max: 120, timeWindow: "1 minute" });

app.get("/health/live", async () => ({ status: "ok" }));
app.get("/health/ready", async (_request, reply) => {
  try {
    await pool.query("SELECT 1");
    return { status: "ready" };
  } catch {
    return reply.code(503).send({ error: "temporarily_unavailable" });
  }
});

app.get("/v1/courses", async (_request, reply) => {
  const result = await pool.query(
    "SELECT c.id, c.slug, c.title, c.summary, c.category, c.language, c.level, r.version, r.manifest, r.content_sha256 FROM courses c JOIN LATERAL (SELECT version, manifest, content_sha256 FROM course_releases WHERE course_id = c.id AND published_at IS NOT NULL ORDER BY published_at DESC LIMIT 1) r ON TRUE WHERE c.published = TRUE ORDER BY c.category, c.title",
  );
  reply.header("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  return { courses: result.rows };
});

app.get("/v1/releases/:platform", async (request, reply) => {
  const { platform } = request.params;
  const channel = request.query.channel ?? "alpha";
  const allowedPlatforms = new Set(["windows-x64", "windows-arm64", "macos-arm64", "macos-x64", "linux-x64", "linux-arm64"]);
  if (!allowedPlatforms.has(platform) || !["alpha", "beta", "stable"].includes(channel)) {
    return reply.code(400).send({ error: "invalid_release_target" });
  }
  const result = await pool.query(
    "SELECT version, platform, channel, artifact_url, artifact_sha256, signature, minimum_version, mandatory, published_at FROM app_releases WHERE platform = $1 AND channel = $2 AND published_at IS NOT NULL ORDER BY published_at DESC LIMIT 1",
    [platform, channel],
  );
  if (!result.rowCount) return reply.code(404).send({ error: "release_not_found" });
  reply.header("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  return result.rows[0];
});

app.put("/v1/me", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
  let identity;
  try {
    identity = await verifyAccessToken(request.headers.authorization);
  } catch {
    return reply.code(401).send({ error: "invalid_access_token" });
  }
  if (!identity) return reply.code(401).send({ error: "authentication_required" });
  const accountId = randomUUID();
  const result = await pool.query(
    "INSERT INTO accounts (id, oidc_issuer, oidc_subject) VALUES ($1, $2, $3) ON CONFLICT (oidc_issuer, oidc_subject) DO UPDATE SET updated_at = now() WHERE accounts.disabled_at IS NULL RETURNING id, created_at",
    [accountId, identity.issuer, identity.subject],
  );
  if (!result.rowCount) return reply.code(403).send({ error: "account_unavailable" });
  return { id: result.rows[0].id, createdAt: result.rows[0].created_at };
});

app.delete("/v1/me", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
  let identity;
  try {
    identity = await verifyAccessToken(request.headers.authorization);
  } catch {
    return reply.code(401).send({ error: "invalid_access_token" });
  }
  if (!identity) return reply.code(401).send({ error: "authentication_required" });
  await pool.query("DELETE FROM accounts WHERE oidc_issuer = $1 AND oidc_subject = $2", [identity.issuer, identity.subject]);
  return { deleted: true };
});

app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error, requestId: request.id }, "request failed");
  if (error.statusCode && error.statusCode < 500) return reply.code(error.statusCode).send({ error: "request_rejected" });
  return reply.code(500).send({ error: "internal_error", requestId: request.id });
});

const port = Number(process.env.PORT ?? 8080);
try {
  await app.listen({ host: process.env.HOST ?? "127.0.0.1", port });
} catch (error) {
  app.log.error(error);
  await pool.end();
  process.exit(1);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await app.close();
    await pool.end();
    process.exit(0);
  });
}
