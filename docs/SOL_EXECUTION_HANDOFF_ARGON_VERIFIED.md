# Sol Execution Handoff — Argon-Verified Monolith P0 → P2 Remediation Spec

**Target Repository:** `/Users/starkindustries/Downloads/monolith-project website`<br>
**Git Baseline:** `fix/pr0-chunk-recovery-hotfix` at `HEAD b353ff7` + **all uncommitted local working-tree changes (`22` modified files + `HomeEntryPoints.tsx`, `HomeNextChapter.tsx`, `docs/FIRST_ACCESS_CTA_MAP.md`, `docs/MONOLITH_ROUTE_ARCHITECTURE_ACTIVATION_ROADMAP.md`, `shared/home-next-chapter.ts`, brand/media assets)** — **DO NOT REVERT OR OVERWRITE**.<br>
**Final Sign-Off Authority:** `ARGON` (`All Models -> ARGON Final`)<br>
**Classification & Send Gate:** **All source code is classified — requires explicit `TRACI-13` sign-off before any export, zip, bundle, or external send.**<br>
**Companion Docs:** [AGENTS.md](../AGENTS.md), [MONOLITH_ROUTE_ARCHITECTURE_ACTIVATION_ROADMAP.md](MONOLITH_ROUTE_ARCHITECTURE_ACTIVATION_ROADMAP.md), [FIRST_ACCESS_CTA_MAP.md](FIRST_ACCESS_CTA_MAP.md)

> **Argon Reconciliation Notice:** Carbon reviewed the handoff packet without local disk access and drafted initial diffs. Before applying patches, **Argon verified Carbon's draft against live source files and corrected `7` breaking type/runtime mismatches** below. Follow the verified signatures here, not Carbon's unverified snippets.

---

## 0. Corrections to Carbon's Draft Diffs (Verified Against Live Code)

| Surface | Carbon Draft Assumption | Argon Live-Source Correction (Required for `tsc` / Runtime) |
|---|---|---|
| `client/src/components/Navigation.tsx#L289` | Assumed `<a href={ROUTES.openNetwork}>` JSX element | Line `289` is `handleNavClick`: `if (href.startsWith("/go/") \|\| href.startsWith(ROUTES.openNetwork)) { window.location.href = href; return; }`. Keep `/go/` full reload; remove only `\|\| href.startsWith(ROUTES.openNetwork)` so nav calls `setLocation(href)`. Also switch `Footer.tsx#L77` (`fullPage: true` off `Open Network`) while keeping `Footer.tsx#L175` helper clean for real external/fullPage routes. |
| `client/src/pages/Monolith.tsx#L261-L273` | Called `getEventCta("chasing-sunsets")` expecting `.headline` | `client/src/lib/cta.ts#L84-L102` accepts `(event?: Partial<ScheduledEvent> \| null)` and returns `{ label, href, tool, isExternal }` (no `headline`). Resolve the active Chasing Sun(Sets) catalogue item via `getPublicEvents()` or render clean between-shows `ROUTES.newsletter` / `"Get First Access"` copy. |
| `server/lib/outbound.ts#L325-L357` | Replaced signature with `(url, URLSearchParams, requestId)` | Actual signature is `decorateOutboundDestination(destination: string, source: QuerySource, route?: { group?: string; key?: string })` preserving `SUNSETS_JULY4_TICKET_UTMS` and `OUTBOUND_TRACKING_PARAMS`. Extend `route` cleanly (`handoffId?: string`) so `server/__tests__/outbound.test.ts` stays compatible. |
| `server/services/posh-webhook-store.ts#L240,L373` | Prefixed `orderKey = "posh:" + orderNumber` | Line `373` already builds `hashId("ticket_order", \`posh:\${eventId}:\${orderKey}\`)`. Key strictly by `orderNumber \|\| hash(...)` (removing `trackingLink` priority from `orderKey`) and keep `trackingLink` strictly as an attribution attribute + payload conflict log. |
| `server/services/meta-capi.ts` | Mixed `"purchase_posh_"` (Sec 3) and `"posh:"` (Sec P1) | Standardize deterministic `event_id` strictly to **`\`posh:\${orderNumber}\`**; add `sendPurchaseConversion` sharing `meta-capi.ts`'s `getConfig()` + hashing helpers, invoked only after settled `persistPoshWebhookPurchase`. |
| `client/public/sunsets/app.js#L106` | Called `window.MonolithTracking?.getSessionId?.()` | `tracking.js` exposes `window.sunsetsTracking` (no `getSessionId`), and Zod `sunsetsSubscriptionSchema` (`server/services/sunsets-subscriptions.ts#L15-L25`) currently strips unknown fields. Update `sunsetsSubscriptionSchema` + `saveSignupRequest` alongside `app.js` and use `localStorage`/`monolith` session key helper. |
| `client/src/pages/AdminDashboard.tsx#L76` | Removed only `\|\| "1234"` fallback | Leaving `import.meta.env.VITE_OPS_KEY` in client JS still leaks any configured key into the browser bundle. Replace the client passphrase compare with server-verified session/auth against `/api/ops/*` (`createAdminRouteGuard` / `OPS_ADMIN_SECRET`). |

---

## 1. Execution Scope: P0 (Apply Immediately — Pure Security, Broken CTA & Data Integrity)

All P0 changes touch zero visual design choices from `b353ff7` + uncommitted Sol UX work and obey `AGENTS.md` URL permanence:

### P0.1 — Server-Side Bundle Security Split (`MONO-IDEA-012`)
1. Move internal commercial/access exports out of browser-reachable `shared/events/sunsets-ticketing.ts` into server-only module **`server/events/sunsets-ticketing-internal.ts`** (never imported from `client/` or `shared/`):
   - `SUNSETS_JULY4_FIRST_ACCESS_CODE`
   - `SUNSETS_JULY4_REVENUE`
   - Internal strategy metadata (`purpose`, `timing`, internal ticket quantity caps `quantityLabel` on unpublished tiers in `SUNSETS_JULY4_ADMISSION_TIERS`)
2. Keep public display projection cleanly in shared/client (`PublicTicketTierCard` fields `{ id, name, priceLabel, description, features, icon, available, highlight }`, resolved `/go/*`, `/vip`, `/newsletter` CTAs, and `A3` public proof facts distinguishing `1,200` paid admissions capacity vs `2,800` gathering attendees).
3. Update imports in:
   - `client/src/lib/sunsetsTicketing.ts#L17-L54`
   - `client/src/components/ChasingSunsetsTicketing.tsx#L19-L59,L253` (remove direct presale access code tile/reference and `SUNSETS_JULY4_REVENUE` import)
   - `client/src/components/SunsetsLinkBioComponents.tsx#L43,L114`
   - `shared/events/sunsets-ticketing.ts` (keep server-safe re-exports or isolate server consumers `server/routes/outbound.ts`, `server/routes/webhooks.ts`, `server/data/public-site-data.ts` cleanly)
4. Remove `import.meta.env.VITE_OPS_KEY || "1234"` from `client/src/pages/AdminDashboard.tsx#L76`; gate `/monolith-ops` actions strictly via server auth (`createAdminRouteGuard`).
5. **Hard Gate Verification:** After `npm run build`, grep `dist/public/assets/` to prove **zero** matches for the presale access code, internal revenue target literals, or `"1234"` ops fallback.

### P0.2 — Stale August 22 CTA Removal (`MONO-IDEA-001`)
- Update `client/src/pages/Monolith.tsx#L261-L273`: remove hardcoded `"SUN(SETS) II lands August 22 at Castaways — tickets are live now"` and `<a href="/go/tickets/css-aug22">Buy Tickets — August 22</a>`. Resolve via active catalog/first-access helper (`getEventCta(featuredSunsetsEvent)` -> `/newsletter` between shows).
- Check `client/src/pages/HouseOfFriends.tsx#L488` and `client/src/components/LiveTickets.tsx#L18` for any remaining `css-aug22` active checkout wording while preserving historical `/events/css-aug22` archive dossier links cleanly.

### P0.3 — Posh Order Key, Outbound `handoff_id` & Lead Pixel Unification (`MONO-IDEA-009`/`011`)
1. **`server/services/posh-webhook-store.ts#L240-L247,L405-L455`:**
   - Replace `const orderKey = trackingLink || orderNumber || ...` with `orderNumber || hash(...)` so shared campaign `tracking_link` URLs never collide across buyers.
   - Store `trackingLink` inside `normalized` metadata / attribution classification (`PAID_ATTRIBUTED` when `handoff_id`, click IDs, or paid campaign link match; `SELLER_ONLY` otherwise).
   - Emit structured warning log on unexpected conflict mutation (`onConflictDoUpdate`) for an existing `orderKey`.
2. **`server/lib/outbound.ts#L325-L357` & `server/routes/outbound.ts#L249-L256`:**
   - Extend optional `route` parameter with `handoffId?: string`, appending `handoff_id` when present (preserving existing callers/tests in `server/__tests__/outbound.test.ts`).
   - Pass `handoffId: requestId` from `server/routes/outbound.ts` so Posh URLs carry `linkClicks.id` alongside `OUTBOUND_TRACKING_PARAMS` (`session_id`, UTMs, `fbclid`, `gclid`, `ttclid`, `msclkid`).
3. **`server/routes/leads.ts#L43-L46`:**
   - Unify fallback Pixel/Dataset ID from `"166134370742863"` onto `"1049241148606250"` (check `scripts/cms_seed.mts` and `server/__tests__/meta-capi.test.ts` + `crm`/`cms` tests for intentional dataset expectations before modifying tests).

---

## 2. Execution Scope: P1 (Owner Sign-Off Checkpoints Marked)

1. **Server Meta CAPI `Purchase` (`server/services/meta-capi.ts` & `server/routes/webhooks.ts`):**
   - Extract shared CAPI POST sender helper from `sendLeadConversion` (`L126-L213`).
   - Add `sendPurchaseConversion` firing ONLY from verified settled Posh orders (`shouldPersistRevenue(status) && !isFullyReversed`), with `event_id: \`posh:\${orderNumber}\``, `pixelId: getLakePixelId()`, `currency: "USD"`, `value: netRevenue / 100` (or `subtotalCents / 100` when zero refund), hashed `em`/`ph`/`fn`/`ln`/`fbc`/`fbp`, and `attribution_scope: "PAID_ATTRIBUTED" | "SELLER_ONLY"`. *(Requires `META_CAPI_ACCESS_TOKEN` & `POSH_WEBHOOK_SECRET` in runtime env + owner confirmation on `SELLER_ONLY` vs `PAID_ATTRIBUTED` filtering.)*
2. **Consent Gate Parity & `/sunsets` Attribution (`client/src/components/Analytics.tsx`, `client/src/lib/metaPixel.ts#L51`, `client/public/sunsets/tracking.js#L16,L68`, `client/public/sunsets/app.js#L106`, `server/services/sunsets-subscriptions.ts#L15-L25`):**
   - *(Owner Confirm Required)* Align `metaPixel.ts#L51` and `/sunsets/tracking.js#L16` to strict opt-in (`consent === "accepted"`), matching `Analytics.tsx#L40,L48`, removing unconsented fire on undecided visits.
   - Expand `sunsetsSubscriptionSchema` (`sunsets-subscriptions.ts`) + `saveSignupRequest` to accept optional attribution metadata (`sessionId`, `utmSource`, `utmMedium`, `utmCampaign`, `utmContent`, `utmTerm`, `fbclid`, `gclid`) and send them from `client/public/sunsets/app.js#L106` (read from `localStorage` / `location.search`, NOT non-existent `window.MonolithTracking`).
3. **`/open-network` Audio Continuity (`Navigation.tsx#L289`, `Footer.tsx#L77`):**
   - *(Owner Confirm Required)* Remove `|| href.startsWith(ROUTES.openNetwork)` from `Navigation.tsx#L289` and `fullPage: true` from `Footer.tsx#L77` so `GlobalAudioProvider` stays alive across `/radio` <-> `/open-network`; verify playing/paused state, direct entry, back/forward, and media handoff at `390×844` and `1440×900`.
4. **Historical Prerender, Gallery Seasons & `css-oct10` Permanence (`scripts/prerender_public_routes.mts`, `shared/seo/public-seo.js`):**
   - Preserve uncommitted `#next-chapter` & `/newsletter` updates in `prerender_public_routes.mts`.
   - Expand `buildEventRoutes()` & `buildEventSitemapEntries()` to include executed `past` event dossiers and gallery seasons (`/chasing-sunsets/:season`, `/untold-story/:season`, `/archive/:season`) while explicitly excluding unheld `/events/css-oct10` / `/events/monolith-launch` (`RETIRED_NEVER_HAPPENED` -> `301 /schedule`) or documenting final owner decision cleanly.

---

## 3. Execution Scope: P2 (FANS360 Transition Bridge & Gate Activations — Separate Approvals)

- **Locked Decision `A4` (`AUDIENCE_DATABASE_URL`):** Emit normalized `{ previous_state, new_state, offer_id, weekend_id, source, timestamp }` + Posh fan receipts from Monolith `server/` first into FANS360 while FANS360 only models 3 event lifecycle states (`SCHEDULED | ACTIVE_ON_SALE | SOLD_OUT`). Keep website `DATABASE_URL` and `AUDIENCE_DATABASE_URL` strictly isolated.
- Keep `/shop` waitlist-only (`A3`), `/vip` `inquiry_deposit_only` with admission disclosures (`A2`), `css-sep19` `postponed` distinct from `rescheduled` (`A1`), and keep gated launches (`/apedrums`, `/house-of-friends/apply`, public Audience OS) disabled unless explicitly authorized with readiness evidence.

---

## 4. Mandatory Validation & Argon Final Return Gate

Every Sol commit candidate MUST pass and return outputs to **`ARGON`** before push/deploy:

1. `npm run check` (`tsc --noEmit`)
2. `npm run validate:events`
3. `npm run pixel:guard`
4. `npm run test:unit` (include new/updated unit tests for sanitized ticketing projection, `posh:${orderNumber}` key uniqueness, `handoff_id` outbound preservation, and `sendPurchaseConversion`)
5. `npm run build` + verify generated static HTML (`dist/public/artists/*/index.html`, `/events/*`, `/newsletter`, `/schedule`) AND confirm zero presale code / revenue / `"1234"` leaks in `dist/public/assets/*.js`.
6. Desktop (`1440×900`) & mobile (`390×844`) Playwright/browser evidence preserving `b353ff7` + uncommitted `HomeEntryPoints`, `HomeNextChapter`, `FIRST_ACCESS_CTA_MAP`, and `RadioDeckPlayer`.

---

## 5. Copy-Paste Kickoff Prompt for Sol

```text
Work ONLY inside `/Users/starkindustries/Downloads/monolith-project website` at current HEAD `b353ff7` + uncommitted working tree (preserve all uncommitted files — do NOT reset or revert them).

Read first:
- AGENTS.md
- docs/MONOLITH_ROUTE_ARCHITECTURE_ACTIVATION_ROADMAP.md
- docs/FIRST_ACCESS_CTA_MAP.md
- docs/SOL_EXECUTION_HANDOFF_ARGON_VERIFIED.md

Execute P0 first (using Argon's verified signatures in Section 0 of `docs/SOL_EXECUTION_HANDOFF_ARGON_VERIFIED.md`, NOT Carbon's unverified snippets), keeping zero outside brands in runtime code and preserving all permanent URLs and historical dossiers:
1. [P0.1 MONO-IDEA-012] Move `SUNSETS_JULY4_FIRST_ACCESS_CODE`, `SUNSETS_JULY4_REVENUE`, and internal tier strategy metadata to `server/events/sunsets-ticketing-internal.ts`; project sanitized public display fields to `client/src/lib/sunsetsTicketing.ts`, `ChasingSunsetsTicketing.tsx`, and `SunsetsLinkBioComponents.tsx`; strip client `VITE_OPS_KEY` / `"1234"` check in `AdminDashboard.tsx#L76` in favor of server admin auth.
2. [P0.2 MONO-IDEA-001] Replace hardcoded Aug 22 CTA in `Monolith.tsx#L261-273` with active event / First Access `/newsletter` resolution via `getEventCta`.
3. [P0.3 MONO-IDEA-009/011] Fix `posh-webhook-store.ts#L240` `orderKey` collision (`orderNumber || hash(...)`, never `trackingLink`), extend `decorateOutboundDestination` (`server/lib/outbound.ts#L325`) with `handoffId` from `server/routes/outbound.ts`, and unify `server/routes/leads.ts#L43-46` default Pixel ID onto `1049241148606250`.

Stop before enabling P1 consent/CAPI changes or `/open-network` routing changes unless owner confirms, then run `npm run check`, `npm run validate:events`, `npm run pixel:guard`, `npm run test:unit`, and `npm run build` (verifying zero presale code/revenue/ops key strings in `dist/public/assets/`). Report exact SHA, changed files, and command results back to ARGON for final gate sign-off.
```
