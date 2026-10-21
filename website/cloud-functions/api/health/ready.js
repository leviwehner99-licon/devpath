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

export async function onRequestGet({ request, env = {}, uuid }) {
  const requestId = request?.requestId ?? uuid ?? "unavailable";
  try {
    await getDatabase(env).query("SELECT 1");
    return json({ status: "ready" }, 200);
  } catch (error) {
    logHealthFailure(error, requestId);
    return json({ error: "temporarily_unavailable", requestId }, 503);
  }
}
