# FreshLink

Angular 22 app for [freshlink.tech](https://freshlink.tech): facility staff, food partners, and transport partners. Backend is Netlify Functions against Neon Postgres.

## Local development

```bash
npm install
npm run dev          # Netlify Dev — Angular on :4200, app at :8888
```

Open **http://localhost:8888**.

Neon is already linked (`summer-forest-70186154` / `production`). `neon deploy` or `neon env pull` writes `DATABASE_URL` into `.env`.

### Pilot logins (invite-only)

Password for all three: `Pilot2026!`

| Portal | Email |
|--------|--------|
| Facility | `dana@hopeharbor.org` |
| Food | `aisha@coresupply.org` |
| Transport | `marcus@greenroute.org` |
| Admin (`/admin`) | `carlos@northeasternsoftware.com` |

Re-seed with `npm run db:seed` if you wipe the database.

## Environment

Never commit `.env`. Copy `.env.example`.

| Variable | Where | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | local + Netlify | Neon pooled connection |
| `JWT_SECRET` | local + Netlify | Auth tokens |
| `API_TOKEN` + `CLOUDFLARE_URL` | **local only** | Cloudflare Workers AI for recommend-basket, impact-report, and optimize-routes while developing |
| `CLAUDE_ANTHROPIC_API_KEY` | **Netlify production** | Claude on the live site (optional `ANTHROPIC_MODEL_ID`, default `claude-haiku-4-5-20251001`) |
| `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | **Netlify production** | Live Cloudflare Turnstile on login. Dummy always-pass keys are used only when `NETLIFY_DEV=true` (`netlify dev`). |

If Claude is set, it is used. Otherwise Cloudflare. Otherwise a heuristic fallback. Cursor is not the app AI backend.

## Deploy to Netlify

1. Connect this repo and keep `netlify.toml` build settings (`npm run build`, publish `dist/freshlink/browser`, functions `netlify/functions`).
2. Site env: `DATABASE_URL`, `JWT_SECRET`, `CLAUDE_ANTHROPIC_API_KEY`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`. Do **not** add Cloudflare `API_TOKEN` / `CLOUDFLARE_URL` on production.
3. Attach custom domain `freshlink.tech`. Add `freshlink.tech` in the Turnstile widget hostname list. Local login does not need that list.
