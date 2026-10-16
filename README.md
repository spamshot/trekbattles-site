# TrekBattles coming-soon site

Static page (`public/index.html`) plus a small Worker (`src/index.js`) that keeps the visit counter in
Cloudflare KV. No build step.

## Deploy (one time)

Cloudflare Workers with static assets: `public/` holds the page, `src/index.js` is the counter API, and
`wrangler.jsonc` ties them together (the `VISITS` KV namespace is created automatically on first deploy).

1. Push this repo to GitHub.
2. Cloudflare dashboard -> Workers & Pages -> Create application -> import the repo. Build command empty,
   deploy command `npx wrangler deploy`.
3. Worker -> Settings -> Domains & Routes -> add custom domain `trekbattles.com` and `www.trekbattles.com`.

## Make TrekBattle.com forward to TrekBattles.com

Do not add `trekbattle.com` to the Worker. Instead, in the `trekbattle.com` zone:

1. DNS: add an `A` record `@` -> `192.0.2.1` and a `CNAME` `www` -> `trekbattle.com`, both **Proxied** (orange cloud).
   These are dummy targets; the redirect fires before anything is fetched.
2. Rules -> Redirect Rules -> Create rule (Custom filter expression):
   `(http.host eq "trekbattle.com") or (http.host eq "www.trekbattle.com")`
   Then: Dynamic, expression `concat("https://trekbattles.com", http.request.uri.path)`, status 301,
   preserve query string on.
3. SSL/TLS -> Edge Certificates -> turn on Always Use HTTPS.

Every push to `main` redeploys the site automatically.

## Local preview

`npx wrangler dev` (the counter uses a local KV).
