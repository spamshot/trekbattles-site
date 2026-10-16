// TrekBattles coming-soon Worker. Static files are served from ./public automatically;
// this code only runs for /api/* (see run_worker_first in wrangler.jsonc).
//   GET  /api/visit -> { count }
//   POST /api/visit -> increments, then { count }
// KV is eventually consistent and not atomic, so a few simultaneous hits can be lost.

const KEY = "total";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/visit") return json({ error: "not found" }, 404);

    const current = parseInt((await env.VISITS.get(KEY)) ?? "0", 10) || 0;
    if (request.method === "GET") return json({ count: current });
    if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

    const next = current + 1;
    await env.VISITS.put(KEY, String(next));
    return json({ count: next });
  },
};
