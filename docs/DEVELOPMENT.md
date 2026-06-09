# Monolith Project — Developer Onboarding

## Architecture Overview

The Monolith Project website is a React 19 SPA backed by Express 4, deployed on Netlify with a Neon PostgreSQL database and Drizzle ORM.

```
client/src/   React 19 + Vite 7 + Tailwind CSS v4 + Framer Motion + Lenis scroll
server/       Express 4 + Drizzle ORM (runs as a Netlify Function in production)
shared/       Types, SEO constants, canonical routes, event/ticketing data
```

**Database:** Neon PostgreSQL (serverless), 28 tables built around a contacts-centric CRM model. The schema lives in `server/db/schema.ts` and migrations are managed via `drizzle-kit`.

**Infrastructure:** `netlify.toml` handles domain redirects (`themonolithproject.com` → `monolithproject.com`, `sunsets.vip` → `/sunsets`, etc.), CSP headers, immutable cache rules for static assets, and function routing (`/api/*` → Netlify Function, `/go/*` → API proxy).

**Edge Functions** in `netlify/edge-functions/`:
- `csp-nonce.js` — injects cryptographic nonces into script tags at the edge
- `source-map-guard.js` — blocks external access to `.map` files
- `media-hotlink-guard.js` — prevents hotlinking of images and videos from unauthorized origins

## Getting Started

```bash
npm install
cp .env.example .env
# Fill in DATABASE_URL and any API keys needed
npm run dev
```

The `dev` script (`scripts/dev.mjs`) starts the API server (Express on `127.0.0.1:5001`), waits for the port to be ready, then launches Vite on port 3001 with a proxy that forwards `/api/*` and `/go/*` to the API server. If an API server is already running on that port, it reuses it instead of spawning a new one.

```bash
npm run build     # generate images → Vite build → prerender routes → bundle server
npm run check     # TypeScript type checking (tsc --noEmit)
npm start         # production server (NODE_ENV=production node dist/index.js)
```

**Engine requirements:** Node 20–22, npm ≥10.

## Project Conventions

### Routes

All route paths are centralized in `shared/routes.ts`. Never hardcode path strings — import `ROUTES`, `routeArtist()`, `routeRadioEpisode()`, `routeEvent()`, etc. from `@shared/routes`. Route aliases (`/togetherness`, `/inner-circle`, etc.) are also defined there.

### Pre-launch Gates

Use `SUNSETS_PRELAUNCH_LOCKED` from `@shared/events/sunsets-ticketing` to gate ticket links and event details before public release. When `true`, ticket CTAs redirect to the Lake List signup instead of the Posh ticket page.

### Scene System

`client/src/lib/scenes.ts` provides path-based theming for the SPA. Each route resolves to a `SceneConfig` with accent colors, glow values, and brand identity:

| Path prefix    | Scene     | Accent   |
|----------------|-----------|----------|
| `/monolith`    | monolith  | #E05A3A  |
| `/story`, `/untold-story` | story | #8B5CF6 |
| `/sunsets`, `/chasing-sunsets` | sunsets | #C2703E |
| `/radio`       | radio     | #F43F5E  |
| `/newsletter`, `/contact`, `/faq` | paper | #8B5CF6 (light) |

### Utilities

Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for classname merging. Prettier is configured; TypeScript runs in strict mode.

## Prerender Pipeline

`scripts/prerender_public_routes.mts` runs after the Vite build to generate static HTML for every public route — 50+ pages including the homepage, static info pages, artist profiles, radio episodes, and individual event detail pages.

Each prerendered page receives:
- Full SEO meta tags (title, description, Open Graph, Twitter)
- Canonical URL
- JSON-LD structured data (`buildSitewideIdentitySchema`, `buildScheduledEventSchema`, `buildPodcastEpisodeSchema`, etc.)
- Critical CSS (the homepage gets inlined hero styles via `renderHomeCriticalStyle()`)
- `window.__MONOLITH_SITE_DATA__` preloaded for the SPA hydration handoff

**To add a new prerendered route:** Open `scripts/prerender_public_routes.mts` and add your route definition to `staticRoutes`, or extend the dynamic route builders (`buildArtistRoutes`, `buildRadioEpisodeRoutes`, `buildEventRoutes`). The script auto-discovers sitemap entries to catch any missing routes.

## CRM Pipeline

The CRM funnel processes leads through a chain of stages:

```
Form submission → Zod validation → Lead provider → CRM store → Airtable mirror → Meta CAPI
```

1. **Validation:** Zod schemas in `server/lib/schemas.ts` validate every form submission, including attribution payloads
2. **Idempotency:** `server/services/idempotency.ts` prevents duplicate leads with a dual-layer cache (in-memory Map + PostgreSQL `idempotency_keys` table), using a 24-hour TTL
3. **Lead provider:** Routes to your configured provider — Mailchimp, Beehiiv, ConvertKit, HubSpot, Brevo, EmailOctopus, or Laylo — based on the `LEAD_PROVIDER` env var
4. **CRM store:** `server/services/crm-store.ts` persists to Neon PostgreSQL (contacts-first model with related tables for form submissions, event interest, UTM sources, laylo signups, etc.)
5. **Airtable mirror:** Optional server-side sync to Airtable when `AIRTABLE_SYNC_ENABLED=true`
6. **Meta CAPI:** Server-side event forwarding to Meta Conversions API

**Rate limiting** is per-route, Postgres-backed (`server/db/rate-limit.ts`) with an in-memory fallback if the database is unreachable.

## Attribution / UTM Tracking

`client/src/lib/attribution.ts` implements first-touch + last-touch attribution:

- On page load, `initAttributionTracking()` captures the current URL, referrer, and all UTM/clid parameters
- On SPA navigation, `syncAttributionForNavigation()` updates the last-touch timestamp and refreshes acquisition signals if present
- Attribution data is stored in `sessionStorage` under `monolith:attribution:v1`
- `getAttributionPayload()` flattens first-touch and last-touch into a single payload
- `appendAttributionQueryParams()` stamps UTM params onto outbound links so attribution flows through the CRM funnel

The payload flows into API request headers and is persisted through the entire CRM pipeline — form submissions, link clicks, page views, and ticket orders all carry UTM source, medium, campaign, and referrer data.

## How to Add a New Event Series

Follow the Sun(Sets) pattern:

1. **Define constants** in `shared/events/` — event slugs, dates, ticket tiers, lineup arrays, UTM presets (see `shared/events/sunsets-ticketing.ts` for the full pattern)
2. **Create the page component** in `client/src/pages/` — lazy-load it in `App.tsx` and wrap with the appropriate scene
3. **Add routes** to `shared/routes.ts` using the `ROUTES` constants object and any dynamic route builders
4. **Add the page route** to `client/src/App.tsx` in the `<Switch>` block
5. **Add prerender entries** in `scripts/prerender_public_routes.mts`
6. **Add redirects** to `netlify.toml` if the series has a vanity domain (e.g., `sunsets.vip` → `/sunsets`)
7. **Add `GO_GROUPS`** entries in `shared/routes.ts` for campaign short-link routing
8. **Add outbound URL env vars** for ticket/waitlist links in `.env.example`

## Environment Variables

See `.env.example` in the repo root for the full inventory. Key groups:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `RESEND_API_KEY` | Transactional email via Resend |
| `LEAD_PROVIDER` | CRM lead destination (`disabled`, `mailchimp`, `beehiiv`, `convertkit`, `hubspot`, `brevo`, `emailoctopus`, `laylo`) |
| `OPS_ADMIN_SECRET` | Gate for `/api/ops/*` admin routes (fail-closed if unset) |
| `POSH_WEBHOOK_SECRET` | Posh ticket webhook verification |
| `LAYLO_WEBHOOK_SECRET` | Laylo signup webhook verification |
| `AIRTABLE_SYNC_ENABLED` | Toggle Airtable mirror (`true`/`false`) |
| `META_CAPI_ACCESS_TOKEN` | Meta Conversions API token |
| `VITE_ENABLE_MONOLITH_OPS` | Enable dev admin dashboard (`true`/`false`) |
| `OUTBOUND_TICKETS_CSS_JUL04_URL` | Sun(Sets) July 4 Posh ticket page (shows "coming soon" fallback when unset) |
| `SITE_DATA_RATE_LIMIT` | Rate limit tuning for public site-data endpoint (default 600) |

## Testing

| Command | Tool | Scope |
|---------|------|-------|
| `npm run test:unit` | Vitest | Server unit tests: schemas, idempotency, lead providers, CRM store, outbound routing |
| `npm run test:e2e` | Playwright | 68 tests: smoke, campaign hardening, responsive layout, crawl, visual regression |
| `npm run check` | TypeScript (`tsc --noEmit`) | Full-project type checking |
| `npm run lhci` | Lighthouse CI | Performance audit (configured in `lighthouserc.json`) |

## Quality Gates

The `predev`, `prebuild`, `precheck`, and `pretest:unit` hooks all run:

1. `scripts/sync_hardening_constants.mjs` — syncs honeypot field names, CSP values, and security tokens to `shared/generated/`
2. `npm run seo:sync` — syncs SEO artifacts (sitemap, robots, structured data manifests)

**Performance budgets** are enforced via `scripts/check_performance_budget.mjs`, which reads thresholds from `performance-budget.json` and validates against `dist/public`. Run `npm run bundle:report` (`scripts/bundle_report.mjs`) for a gzipped size breakdown of all output assets.

## Additional Resources

- `docs/API.md` — API endpoint catalog
- `docs/UI_PLAYBOOK.md` — Agent operating guide (living document)
- `docs/IA_AUDIT_MEMO.md` — Information architecture rules
- `docs/SUNSETS_MARKETER_DROP_WORKFLOW.md` — Sun(Sets) campaign ops
- `docs/UNTOLD_MARKETER_DROP_WORKFLOW.md` — Untold Story campaign ops
- `docs/PRODUCTION_HARDENING.md` — Production hardening checklist
- `docs/PERFORMANCE_BUDGET.md` — Performance budget documentation
- `docs/MONOLITH_COPY_SYSTEM.md` — Brand copy and voice guidelines
