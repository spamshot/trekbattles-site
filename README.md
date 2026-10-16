# TrekBattles coming-soon site

Static page (`index.html`) plus one Pages Function (`functions/api/visit.js`) that keeps the visit counter in
Cloudflare KV. No build step.

## Deploy (one time)

1. **Put this folder in its own GitHub repo** (e.g. `trekbattles-site`). Do not push it inside the Fieldops repo.
   ```bash
   cd trekbattles-site
   git init -b main && git add . && git commit -m "Coming soon page"
   # create an empty repo on GitHub, then:
   git remote add origin https://github.com/<you>/trekbattles-site.git
   git push -u origin main
   ```
2. **Cloudflare dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git**, pick the repo.
   Framework preset: None. Build command: leave empty. Build output directory: `/`.
3. **KV for the counter:** Storage & Databases -> KV -> Create namespace `trekbattles-visits`.
   Then in the Pages project: Settings -> Bindings -> Add -> KV namespace -> variable name `VISITS`
   -> choose that namespace (add it for Production, and Preview if you want). Redeploy once.
4. **Custom domain:** Pages project -> Custom domains -> add `trekbattles.com` (and `www.trekbattles.com`).
   Cloudflare creates the DNS records because the domain is on your account.

## Make TrekBattle.com forward to TrekBattles.com

Do not add `trekbattle.com` to the Pages project. Instead, in the `trekbattle.com` zone:

1. DNS: add an `A` record `@` -> `192.0.2.1` and a `CNAME` `www` -> `trekbattle.com`, both **Proxied** (orange cloud).
   These are dummy targets; the redirect fires before anything is fetched.
2. Rules -> Redirect Rules -> Create rule (Custom filter expression):
   `(http.host eq "trekbattle.com") or (http.host eq "www.trekbattle.com")`
   Then: Dynamic, expression `concat("https://trekbattles.com", http.request.uri.path)`, status 301,
   preserve query string on.
3. SSL/TLS -> Edge Certificates -> turn on Always Use HTTPS.

Every push to `main` redeploys the site automatically.

## Local preview

`npx wrangler pages dev . --kv VISITS` (the counter works locally against a temporary KV).
