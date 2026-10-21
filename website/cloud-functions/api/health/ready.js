import { getDatabase, logHealthFailure } from "../../lib/database.mjs";

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestGet({ env = {}, uuid }) {
  try {
    await getDatabase(env).query("SELECT 1");
    return json({ status: "ready" }, 200);
  } catch (error) {
    logHealthFailure(error, uuid);
    return json({ error: "temporarily_unavailable", requestId: uuid ?? "unavailable" }, 503);
  }
}
