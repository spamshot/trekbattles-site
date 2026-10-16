// Visit counter for TrekBattles (Cloudflare Pages Function).
// Needs a KV namespace bound to this Pages project as VISITS.
//   GET  /api/visit -> { count }
//   POST /api/visit -> increments, then { count }
// KV is eventually consistent and not atomic, so under heavy simultaneous traffic a few
// hits can be lost. Fine for a coming-soon counter.

const KEY = "total";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export async function onRequest({ request, env }) {
  if (!env.VISITS) return json({ error: "KV binding VISITS missing" }, 500);

  const current = parseInt((await env.VISITS.get(KEY)) ?? "0", 10) || 0;

  if (request.method === "GET") return json({ count: current });
  if (request.method !== "POST") return json({ error: "method not allowed" }, 405);

  const next = current + 1;
  await env.VISITS.put(KEY, String(next));
  return json({ count: next });
}
