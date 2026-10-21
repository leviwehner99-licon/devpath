import pg from "pg";

const { Pool } = pg;

export function createPool(env = process.env) {
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const ssl = env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : false;
  return new Pool({
    connectionString: env.DATABASE_URL,
    ssl,
    max: Number(env.DATABASE_POOL_SIZE ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 5_000,
    query_timeout: 5_000,
    application_name: "devpath-api",
  });
}
