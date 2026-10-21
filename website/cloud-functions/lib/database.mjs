import pg from "pg";

const { Pool } = pg;
let pool;

export function getDatabase(env) {
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

export function logHealthFailure(error, uuid) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("DevPath health check failed", {
    requestId: uuid,
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorCode: error?.code,
    errorMessage: message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted database URI]"),
  });
}
