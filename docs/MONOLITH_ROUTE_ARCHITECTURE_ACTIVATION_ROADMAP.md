# Monolith Route Architecture & Activation Roadmap

November 11 local follow-up: [history/status fixes and verification](LOCAL_HISTORY_FIXES_20261111.md)
supersede the historical coverage and October-calendar-redirect gaps described
in this earlier handoff. The changes are local and have not been deployed.

Handoff for Sol 6.1 and future UX/UI passes. Owner supplied November 10, 2026;
reconciled against local source the same day. This is a design and implementation
handoff, not authorization to enable gates, write production data, or deploy.

## Scope, revision, and evidence

- Canonical repository: `/Users/starkindustries/Downloads/monolith-project website`.
- Branch: `fix/pr0-chunk-recovery-hotfix`.
- Owner's initial reference snapshot: `4ab844be505dfb13680be8f74f9f453253706d64`.
- Earlier roadmap reconciliation: `118fd018e9538ac8379d207ced2fc62b2d5af424` → `c42d8a5b877779d36170e4537e68b0ba33dd8818`.
- **Current synced revision (`HEAD`):** `b353ff708c0b805cec06c53b70cb77ad9187a24c` (`feat(radio): rebuilt episode page, a new deck player, and all 13 Chasing Sunsets Radio covers`; `0 ahead / 0 behind` `origin/fix/pr0-chunk-recovery-hotfix`), **plus uncommitted local working-tree changes (not yet committed or pushed)** across 20 modified tracked files and untracked additions:
  - First Access CTA consolidation ([FIRST_ACCESS_CTA_MAP.md](FIRST_ACCESS_CTA_MAP.md)): `shared/events/public-cta.ts`, `client/src/lib/cta.ts`, `ConversionCTA.tsx`, `EventCountdown.tsx`, `ArtistsSection.tsx`, `NavigationMegamenu.tsx`, `UntoldVipLanding.tsx`, `client/src/styles/first-access.css`, `cta.test.ts`, `publishedState.test.ts` (all pending-date / First Access / Unlock Presale CTAs consolidate to `/newsletter` with `data-first-access="true"` bold emphasis).
  - Home & `/newsletter` UX additions: `Home.tsx`, `HomeEntryPoints.tsx`, `HomeUpcomingShows.tsx`, `HomeNextChapter.tsx`, `shared/home-next-chapter.ts`, `Newsletter.tsx`, `NewsletterSection.tsx`, `client/public/brand/sunsets-fm/`, `docs/design/owner-reference-20261110/` (adds `01 / Attend · 02 / Listen · 03 / First access` entry points, `2027 · More nights. More stories.` chapter preview linking existing permanent series hubs, and updated `/newsletter` with `SUNSETS.FM` radio signup strip).
  - Static prerender & permanence updates: `scripts/prerender_public_routes.mts` (adds `#next-chapter` and `/newsletter` critical HTML) and `AGENTS.md` (historical URL/static permanence policy).
  - Uncommitted navigation, bio & artwork assets: `Navigation.tsx`, `LinkBioPage.tsx`, `link-bio.css`, `LakeLanding.tsx`, `index.css`, and generated radio/open-network `.avif`/`.webp` assets in `client/public/images/generated/`.
- Recheck the exact branch `HEAD` and `git status` before implementation and **preserve all uncommitted edits**; none of these revisions is certified live.
- Sibling noted for coordination only:
  `/Users/starkindustries/Downloads/sunsets.fm` (`events-boop/sunsets.fm`). Its
  checkout, flags, PRs, deployment, and `/join` readiness were not verified here.
- “Implemented” below describes local source capability. Production environment
  settings, migrations, storage, provider delivery, deployed HTML, and live URLs
  remain unverified. Do not equate a rendered page or enabled badge with a live
  integration. No runtime changes, builds, migrations, provider calls, or releases
  were performed while preparing this handoff.

## Corrections to carry into the design pass

| Owner snapshot / proposed step | Source-verified correction or unresolved gap |
| --- | --- |
| Promote branch at `4ab844b` | Branch head at the refreshed review is `c42d8a5`. `4ab844b` adds shared link-in-bio pages; `b1e921d` keeps Calendar navigation in-app; `118fd01` removes the never-held October 10 launch record and redirects its two URLs to `/schedule`; `c42d8a5` adds an explicit September 19 Postponed badge to the bio link and Shows menu preview. Review the exact candidate, not a moving branch name. |
| `css-oct10` is a completed/past show | It never happened, per the owner correction recorded in `118fd01`. Current code removes it and redirects `/events/css-oct10` and `/events/monolith-launch`. This conflicts with the later policy requiring permanent historical dossiers and limiting 301s to duplicate consolidation. Reconcile before baseline release. Preserve the historical URL truthfully; never invent attendance, performance, or recap receipts. |
| Every historical entity is statically covered | Requirement, not current compliance. `buildEventRoutes()` uses `futureEvents`; `buildEventSitemapEntries()` explicitly excludes `past`. The prerender script does not enumerate all gallery collections/seasons. Close these gaps before claiming historical coverage. |
| Artist footprint | Local source has 32 roster IDs, 32 matching artist sitemap entries, and a prerender builder mapping every roster entry. This source comparison does not verify freshly built or deployed HTML. |
| Set `LEAD_PROVIDER=brevo` for `/sunsets` | That selects the legacy lead track. `/api/sunsets/subscriptions` selects `SUNSETS_SIGNUP_PROVIDER=brevo`; `SIGNUP_CAPTURE_MODE=database` takes precedence over provider delivery. |
| Audience OS public activation is removing one restriction | The adapter and receiver intentionally pin one controlled recipient. Keep that proof isolated. Public intake requires a separately reviewed contract, policy, processing behavior, integration, and release, not simply dropping `AUDIENCE_CONTROLLED_EMAIL` or turning on the controlled flag. |
| `/open-network` needs a new Wouter route | It already has `OpenNetworkTransition` in `App.tsx`. Header and footer force reloads despite the existing route. In-app continuity requires changing navigation behavior and verifying media handoff, not a new URL. |
| Ape Drums gate lives in `server/App.tsx` | It lives in `client/src/App.tsx`, with readiness in `client/src/lib/apeDrumsRelease.ts` and `artistShowRelease.ts`. |
| Opening Ape Drums always opens family promotion | Production promo additionally requires `!eventConcluded`. Default event date is July 31, 2026, already past at this review. Do not relaunch an old checkout or change its date to bypass retirement. The existing checklist's promo text needs reconciliation with this lifecycle logic. |
| Gate rollback is instantaneous | `VITE_*` changes affect a new build. Closing a flag takes effect only after successful rebuild/deployment; preserve historical URLs when designing any rollback for an already public page. |
| `/api/health` proves readiness | It reports liveness only. Guarded `/api/health/details` and `/api/ready` expose additional configuration/DB checks; even those do not prove end-to-end delivery. |
| Cookie banner appears at exactly 6.6 seconds | Source defers global modules for 3 seconds, then CookieConsent waits 3.6 seconds after mounting. Treat 6.6 seconds as a nominal minimum plus load/suspense time, not an exact timer guarantee. |
| SoundCloud mobile warning is verified here | The reported 0×0 `createPattern` warning is a QA reproduction target. No browser reproduction was performed for this handoff. |

## 1. Canonical route map and host surfaces

Keep route definitions, client transitions, preloading, CDN handling, server
handling, and static SEO aligned:

- [shared/routes.ts](../shared/routes.ts): canonical paths, aliases, hosts.
- [client/src/App.tsx](../client/src/App.tsx): Wouter routes and global providers.
- [client/src/lib/routePreload.tsx](../client/src/lib/routePreload.tsx): lazy chunks.
- [netlify.toml](../netlify.toml): deployed CDN rewrites and redirects.
- [server/routes/spa.ts](../server/routes/spa.ts): Express static/prerender serving
  and redirects. Missing assets must 404; `/api/*` must not fall through to HTML.

| Domain/path | Component or handler | Source mode and design boundary |
| --- | --- | --- |
| `/` on monolithproject.com | `Home.tsx`, `HomeEntryPoints.tsx`, `HomeNextChapter.tsx` | Between-shows presentation uses verified past proof, radio, permanent `01/02/03` entry points, and `HOME_NEXT_CHAPTER` (`2027` season preview → existing series hubs + `/newsletter` First Access) when no event is on sale. Production state is unverified. |
| `/schedule`, `/events` | `Schedule.tsx` | Published catalogue and real lifecycle state; preserve September 19 postponed support. Pending-date `first-access` CTAs consolidate to `/newsletter`. October launch treatment remains under permanence reconciliation above. |
| `/events/:slug` | `EventDetails.tsx` | Permanent event dossiers; postponed events expose `#ticket-holder-support`. Never retire a URL by merely hiding a card. |
| `/tickets` | `Tickets.tsx` | Strict on-sale state; otherwise ticket-holder support and radio/newsletter alternatives. Note `Monolith.tsx` still retains a stale `/go/tickets/css-aug22` button to clean up. |
| `/untold-story`; `/story`, `/story/` aliases | `UntoldStory.tsx` | Netlify and Express implement HTTP 301 to canonical. Wouter `<Redirect>` is a client redirect, not an HTTP 301. |
| `/untold` / untold.vip root | `UntoldVipLanding.tsx` | Shared `components/link-bio/LinkBioPage.tsx`; compact bio links to newsletter, radio, network, calendar, and full series. |
| `/sunsets-links` / sunsets.vip root | `SunsetsVipBio.tsx` | Shared bio layout. Netlify redirects host root to Monolith's bio path; full ticket-holder guide remains `/sunsets`. |
| `/sunsets` | `scripts/templates/sunsets.html` → `client/public/sunsets/index.html` | Standalone static micro-app; generated `app.js` uses `/api/sunsets/subscriptions`. SPA fallback component also exists; verify direct and client entry separately. Edit templates, not only generated output. |
| `/chasing-sunsets`, `/chasing-sunsets-facts` | `ChasingSunsets.tsx`, `ChasingSunsetsFacts.tsx` | Series hub and facts destination; preserve consent-aware facts chip behavior. |
| `/lineup`, `/artists`, `/artists/:id` | `Lineup.tsx`, `ArtistProfile.tsx` | All 32 current artist dossiers remain permanent; roster expansion must update static output and sitemap coverage. |
| `/archive`, `/archive/:season`, `/chasing-sunsets/:season`, `/untold-story/:season` | `Archive.tsx`, `ArchiveGalleryPage.tsx` | Gallery registry: `client/src/data/galleryData.ts`. Include actual media and truthful pending-media states; full static coverage still required. |
| `/insights`, `/insights/:slug` | `Insights.tsx`, `InsightArticle.tsx` | Permanent editorial entries; preserve static body, canonical, and Article structured data. |
| `/radio`, `/radio/:slug`, `/sunsets-fm` | `Radio.tsx`, `RadioEpisode.tsx`, `RadioDeckPlayer.tsx`, `SunsetsFM.tsx` | Commit `b353ff7` rebuilds episode pages (`13` episodes in `radioEpisodes.ts` up from `6`) with `RadioDeckPlayer` sharing `GlobalAudioProvider` above route changes. Unpublished episode tracklists keep explicit unavailable copy rather than invented data. Preserve cross-domain radio canonical mapping and verify client/static parity. |
| `/open-network` | `OpenNetwork.tsx` | Existing Wouter route (`App.tsx`); `HomeHeroCarousel` uses `<Link>`, while `Navigation.tsx` and `Footer.tsx` (`fullPage: true`) force reloads that interrupt audio. Continuity change is recommended, not yet applied in navbar/footer. |
| `/partners`, `/press`, `/about`, `/monolith`, `/booking`, `/submit`, `/contact`, `/faq`, `/vip`, `/travel`, `/guide` | Respective `client/src/pages/*` | Public information/inquiry surfaces (`/vip` tables remain `inquiry_deposit_only` with explicit admission disclosures). Test each actual submission endpoint and configured email/CRM destination; rendering alone proves no delivery. Note `Monolith.tsx` retains an outdated August 22 `/go/tickets/css-aug22` CTA. |
| `/newsletter` | `Newsletter.tsx`, `NewsletterSection.tsx` | Working tree updates heading (`Be the first to know.` / `#newsletter-signup`), `SUNSETS.FM` radio list block (`hostedForms.radio`), `HOME_NEXT_CHAPTER` series links, and hosted Brevo URL from `shared/signup-forms.json`. DEV `?audience_preview=1` continues to mount controlled `MonolithSignupPreview` (`/api/audience-signup`). |
| `/house-of-friends`, `/house-of-friends/apply` | `HouseOfFriends.tsx`, `HouseOfFriendsApply.tsx` | Hub implemented; production intake fails closed without explicit open flag and required DB/storage/signing configuration. Keep apply noindex until launch criteria are satisfied. |
| `/apedrums`, `/sandbox/ape-drums` | `ApeDrumsLanding.tsx` | Production release/contract build gates; sandbox DEV-only. A rendered 404 experience is not proof of HTTP 404 status. Verify both. |
| `/sponsors` | `SponsorAccess.tsx`, sponsor API | Public noindex lock screen, private signed-cookie deck delivery. Missing configuration or deck fails closed at the API. |
| `/shop` | `Shop.tsx` | “COLLECTION 01 · In development”; launch subscription strip, no implemented cart/checkout. |
| `/alerts`, `/ambassadors` | Respective pages | Public destination surfaces; do not imply active SMS or program delivery from a card alone. |
| `/terms`, `/privacy`, `/cookies` | Respective pages | Keep disclosures consistent with the selected capture and tracking behavior. |
| `/lake`, `/tables`, legacy SUNSETS aliases, `/untold-story-deron-juany-bravo` | App, route constants, CDN/server | Preserve existing landings/aliases and query/hash behavior. `/tables` resolves to VIP. Audit HTTP and client behavior separately. |
| `/togetherness`, `/inner-circle`, `/the-monolith`, `/collective` | Alias map and App | Preserve canonical targets from `ROUTE_ALIASES`; do not create replacement versions. |
| `/monolith-ops`, `/sandbox/hero` | `AdminDashboard.tsx`, `ExperimentalHero.tsx` | DEV or `VITE_ENABLE_MONOLITH_OPS=true` controls client availability. Server admin authentication remains independently required. |
| `/go/:group/:key`, `/api/*`, `/404`, unknown paths | Outbound/API/SPA handling | Preserve real outbound targets and truthful unavailable states; assert HTTP status, not only page appearance. |

## 2. Activation roadmaps

### A. Show lifecycle and on-sale ticketing

Surfaces: home, schedule, tickets, event dossiers, FixedTicketBadge, and
GlobalTicketButton. Sources: [EVENT-PUBLISH-OS.md](EVENT-PUBLISH-OS.md),
`server/data/public-site-data.ts`, `shared/events/`, and
`scripts/validate_events.mts`.

1. Confirm countersigned artist agreement and approved date, venue, doors,
   ticketing, and flyer/square/OG assets. No negotiating artist names enter the
   catalogue. Preserve factual past/postponed/cancelled distinctions.
2. Set the event's valid checkout URL and only mark `gates.creativeReady`,
   `gates.poshLinked`, and `gates.trackingQA` true after their evidence exists.
   Validate the complete state; a UI badge grants no ticketing readiness.
3. Verify short links in `server/routes/outbound.ts` and Netlify, including
   `/go/tickets/*`, reach the intended checkout rather than a coming-soon hold.
4. Review active Posh/Laylo webhook configuration and signed-event handling.
   Public health is liveness only. Use authorized guarded readiness checks and
   actual end-to-end evidence. Per
   [SUNSETS_MEASUREMENT_RELEASE_PLAN.md](SUNSETS_MEASUREMENT_RELEASE_PLAN.md),
   Monolith owns custom OutboundTicketClick; Posh owns AddToCart,
   InitiateCheckout, and Purchase. Never emit checkout/purchase from an outbound
   click. Confirm the approved dataset, including owner-supplied pixel
   `1049241148606250`, during release QA rather than assuming its live setting.
5. Audit DB overrides before publishing. `mergeScheduledEvents` lets Neon rows
   override static records. `scripts/seed_events.mts` upserts catalogue fields;
   it is not a dry run, does not remove orphan rows, and does not synchronize
   every lifecycle/receipt field. It also catches errors without explicitly
   setting a failing process exit. Inspect the planned changes and verify the
   resulting `/api/site-data` records; a zero exit alone is insufficient.
6. Coordinate DB change and deployment so API, prerender, sitemap, structured
   data, and every CTA agree. These are separate systems, not an intrinsically
   atomic transaction. Run the required release checks below and verify live
   behavior before declaring the activation complete.

### B. Signup and waitlist tracks

Keep distinct audiences and distinct intake systems explicit. “Saved,”
“confirmation required,” “subscribed,” and “delivered” are different states.

#### B1. Static `/sunsets` subscriptions

- API: `server/routes/sunsets-subscriptions.ts`; behavior:
  `server/services/sunsets-subscriptions.ts`.
- Direct Brevo delivery requires `SUNSETS_SIGNUP_PROVIDER=brevo`,
  `BREVO_API_KEY`, Brevo bypass disabled, and distinct valid
  `SUNSETS_BREVO_EVENT_LIST_ID` / `SUNSETS_BREVO_RADIO_LIST_ID`. Legacy
  `LEAD_PROVIDER=brevo` does not select this integration. General newsletter
  capture has its own provider/list configuration.
- If `SIGNUP_CAPTURE_MODE=database`, the service saves consent in website
  `leads` storage and returns `state: "saved"` before attempting providers.
  This means awaiting provider sync, not a verified Brevo subscription.
- Brevo currently upserts contacts and verifies membership/suppression. This
  code does not itself implement a double-opt-in email flow. If DOI is part of
  the approved launch policy, implement and prove it; do not assume unspecified
  DOI environment variables will add it. Flodesk is a separate configured path.
- GET must report actual availability for event and radio audiences. Current
  successful subscription POSTs return 200; handle returned state, not merely
  HTTP success. Verify Netlify API rewrites/function packaging as well as local
  Express behavior.
- Hosted failover comes from `shared/signup-forms.json`; validate configured
  sibforms.com destinations and audience mapping. Mailto opens a draft and
  cannot prove signup or delivery. Preserve unchecked consent and no false
  success on unavailable providers, storage errors, offline state, or 429.

#### B2. Controlled Audience OS proof

Follow [AUDIENCE_SIGNUP.md](AUDIENCE_SIGNUP.md) and
`docs/audience-signup.env.example`. Server adapter:
`server/routes/audience-signup.ts`; native receiver:
`netlify/functions/audience-intake.ts`.

- Keep the separate `AUDIENCE_DATABASE_URL` boundary; never silently use legacy
  website `DATABASE_URL`. Verify receiver provenance, required schema/migrations
  001–016, and all active writers before a coordinated DB cutover.
- Controlled configuration includes `AUDIENCE_SIGNUP_CONTROLLED_ENABLED`,
  `AUDIENCE_INTAKE_URL`, `AUDIENCE_INTAKE_TOKEN`, `AUDIENCE_RELEASE_ID`,
  `AUDIENCE_CONTROLLED_EMAIL`, and `AUDIENCE_PAGE_PATH`; receiver scope also
  requires `AUDIENCE_WORKSPACE_ID`, `AUDIENCE_WEBSITE_ID`, and
  `AUDIENCE_SOURCE_ACCOUNT`. Keep secrets server-side, never `VITE_*`.
- Approve exact copy/disclosures, canonical origin and placement, immutable
  release, and the private controlled surface. Prove one authorized recipient,
  durable receipt, and same-ID retry without replacing the general newsletter.
- A receipt is raw intake, not subscription, fan onboarding, consent to all
  channels, or permission to send messages. Public intake needs a separately
  reviewed multi-recipient contract and downstream processing before production
  `/newsletter` switches away from the existing form.

#### B3. Sibling SUNSETS.FM `/join`

Owner identifies `VITE_EARLY_ACCESS_PUBLIC_ENABLED` and
`GEMINI-SIGNUP-PAGE-TASK.md` in the sibling repository. Verify these there with
its applicable instructions and review/release status. Any Monolith link to
`https://sunsets.fm/join` must have a verified working destination. No Monolith
build flag activates a separate repository, and this handoff does not authorize
its edits, merge, or deployment.

### C. Sealed artist page `/apedrums`

Sources: [APE_DRUMS_RELEASE_CHECKLIST.md](APE_DRUMS_RELEASE_CHECKLIST.md),
`client/src/App.tsx`, `apeDrumsRelease.ts`, `artistShowRelease.ts`, and
`client/src/content/familyPromo.ts`.

- Build inclusion needs `VITE_APE_DRUMS_RELEASED=true` and
  `VITE_APE_DRUMS_CONTRACT_COUNTERSIGNED=true`. Runtime page readiness also
  validates approved checkout host, doors, hero, and at least two unique valid
  approved videos. Verify final assets/URLs, not just flags.
- Inputs include `VITE_APE_DRUMS_TICKET_URL`, `VITE_APE_DRUMS_DOORS`,
  `VITE_APE_DRUMS_HERO_IMAGE`, optional `VITE_APE_DRUMS_PROMO_IMAGE`,
  `VITE_APE_DRUMS_APPROVED_VIDEO_1_URL` through `_4_URL`, and
  `VITE_APE_DRUMS_EVENT_DATE` where legitimately approved.
- July 31, 2026 is historical. `FAMILY_PROMO` retires after the event concludes
  in production even if publicReady is true; DEV preview intentionally differs.
  Design the permanent archive path and historical CTA instead of presenting
  this as a fresh booking. Do not reopen an obsolete sale from this spec.
- Verify direct URL, actual HTTP status, production sandbox exclusion, assets,
  all CTAs, tracking, and family-host behavior on the exact build. Vite flag
  changes require rebuild and deployment. For any already published historical
  route, rollback must preserve its public history under the permanence policy.

### D. House of Friends creator intake

Follow [house-of-friends/APPLICATION_INTAKE.md](house-of-friends/APPLICATION_INTAKE.md).

1. Keep `HOF_APPLICATIONS_OPEN=false` while preparing private R2 storage, DB
   migration, terms, dates, eligibility, rights/retention policy, and reviewer
   workflow. Current intake contains 2026 / August 22 metadata; reconcile the
   actual approved cohort before reopening it. Do not invent a replacement URL.
2. Required runtime configuration: `DATABASE_URL`, `HOF_R2_ACCOUNT_ID`,
   `HOF_R2_ACCESS_KEY_ID`, `HOF_R2_SECRET_ACCESS_KEY`, `HOF_R2_BUCKET`, and
   `HOF_APPLICATION_SIGNING_SECRET`. Notification destinations are separate:
   `HOF_APPLICATION_WEBHOOK_URL` and/or `RESEND_API_KEY` plus `ADMIN_EMAIL`.
3. Review and apply `npm run hof:db:migrate` to the intended database. Configure
   a private bucket and run `npm run hof:storage:configure`; this writes bucket
   CORS and reads it back. It does not create the bucket or open intake.
   `HOF_ALLOWED_UPLOAD_ORIGINS` must name approved origins; avoid wildcard/public
   access. Prepare infrastructure before opening the flag.
4. Prove status → prepare → browser PUT → complete, including large audio,
   exact size verification, DB persistence, notification, expired sessions,
   missing media, rate limits, retry, withdrawal, and private access. A status
   endpoint reporting open checks configuration presence, not full readiness.
5. Only after approved launch criteria pass, enable the open flag and recheck
   production. Do not use newsletter hosted forms or mailto as a substitute for
   secure applicant/media submission. Keep noindex until public launch clearance.

### E. Confidential partner room

- Sources: `server/routes/sponsor.ts`, `server/services/sponsor-session.ts`.
- Configure `SPONSOR_ACCESS_PASSWORD`, `SPONSOR_SESSION_SECRET`, and a private
  deck at `SPONSOR_DECK_PATH` or the supported private-file fallback. The lock
  page may render while the API fails closed; confirm the deck is packaged
  privately and never placed in public static assets.
- Preserve noindex and server authorization. Verify wrong password, missing
  configuration, signed-cookie expiry/tampering, missing deck, and successful
  authorized download. A client unlock animation is not access control.

### F. Commerce, alerts, and operations

- **Shop:** Recommendation is to retain the Collection 01 holding page and
  truthful launch capture for this UX pass. A real store is a separate scope:
  approved products/SKUs, variants/inventory, pricing, payment sessions, order
  webhooks/idempotency, fulfilment, shipping/tax/returns, support, and proven
  end-to-end checkout. No dummy cart or checkout badge implies activation.
- **Alerts:** Preserve `/alerts` as an entry point while deciding its role.
  Consolidate with a permanent canonical route or explicit justified redirect,
  never silent deletion. No active SMS promise without an implemented provider,
  reviewed opt-in/disclosures, and channel-specific consent/delivery proof.
- **Ops:** Do not enable public UI by setting `VITE_ENABLE_MONOLITH_OPS` alone.
  Remove `AdminDashboard.tsx`'s client `VITE_OPS_KEY || "1234"` fallback; a
  bundled VITE key can never be a server secret. CMS and ops routers already
  use `createAdminRouteGuard`, which fails closed without `OPS_ADMIN_SECRET`.
  Preserve and test that enforcement; complete the authenticated admin flow and
  verify DB persistence/revision behavior before exposing controls.
- **Network/audio:** Recommend Wouter navigation to the existing
  `/open-network` route. Change both header and footer forced reload behavior;
  preserve GlobalAudioProvider above the router. Prove playing and paused state,
  position, back/forward, direct entry, mobile menu close/focus, and clean audio
  handoff when network media starts. SessionStorage restoration is not equivalent
  to uninterrupted playback. Keep full document navigation for actual external
  or standalone destinations where required.

### G. Owner-locked product rules, bundle security, and attribution (synced post-c42d8a5)

These locked product, security, and attribution decisions govern Carbon/Sol
remediation passes alongside Sections A–F:

1. **Owner-Locked Product Map Decisions (`A1`–`A4`):**
   - **A1 (`postponed` vs `rescheduled`):** Keep `css-sep19` explicitly
     `postponed` (date/venue unconfirmed; 30-day refund window paused until
     confirmed), distinct from `rescheduled` and completed `past` history, with
     per-SKU `offer_state`.
   - **A2 (`/vip` tables):** Keep VIP tables as `inquiry_deposit_only` paths on
     `/vip` with explicit per-tier admission disclosure across Small (`2–6`),
     Medium (`7–10`), and Large (`11–15 @ $2,000+ min`).
   - **A3 (`/shop` & July 4 proof metrics):** Keep `/shop` as `"COLLECTION 01
     · In development"` waitlist capture (`SlimSubscribeStrip`) for v1, and
     cleanly separate July 4 paid admission capacity (`1,200 guest admissions`
     in `server/data/public-site-data.ts`) from total gathering footfall
     (`2,800 attendees` in recap copy).
   - **A4 (FANS360 transition authority):** Monolith website + Posh webhooks
     emit normalized offer transitions (`{ previous_state, new_state, offer_id,
     weekend_id, source, timestamp }`) + fan receipts to `FANS360` first while
     FANS360 only models 3 event lifecycle states (`SCHEDULED | ACTIVE_ON_SALE |
     SOLD_OUT`).
2. **Server-Side Bundle Security Boundary (`MONO-IDEA-012` — verified in source):**
   - Public browser Vite JS must receive ONLY public copy, imagery, sanitized
     display projections (`priceLabel`, `available`, resolved CTA href), and
     public schema — never internal presale access codes, revenue projections,
     allocation caps, or internal ops fallbacks.
   - Currently `client/src/lib/sunsetsTicketing.ts` and
     `client/src/components/ChasingSunsetsTicketing.tsx` still import
     `SUNSETS_JULY4_FIRST_ACCESS_CODE` and `SUNSETS_JULY4_REVENUE` from
     `shared/events/sunsets-ticketing.ts` into the client bundle, and
     `client/src/pages/AdminDashboard.tsx` still retains `import.meta.env.VITE_OPS_KEY || "1234"`.
   - Keep Monolith/FANS360 application code strictly 100% first-party (no
     external comparator names in codebase or client bundles).
3. **Remaining Stale CTA & Meta/Posh Attribution Fixes (verified in source):**
   - `client/src/pages/Monolith.tsx` still retains an outdated `Buy Tickets —
     August 22` link to `/go/tickets/css-aug22`; align it with `First Access` /
     `public-cta.ts` rules.
   - `server/services/posh-webhook-store.ts` keys `orderKey` as
     `trackingLink || orderNumber || ...` instead of unique `('posh',
     orderNumber)`.
   - `server/routes/outbound.ts`, `server/routes/tracking.ts`,
     `client/src/lib/metaPixel.ts`, and `client/src/components/Analytics.tsx`:
     unify Meta Pixel ID to `1049241148606250`, align consent checks (`!==
     "accepted"` vs `!== "declined"`), carry `linkClicks.id` (`handoff_id`) +
     ad click IDs (`fbclid`/`gclid`/`ttclid`/`msclkid`) across `/go/*`, and add
     server-side Meta CAPI `Purchase` with deterministic `event_id = "posh:" +
     orderNumber`.

## 3. UX/UI multi-state acceptance matrix

Design and verify at 390×844 and 1440×900; include keyboard access, focus,
reduced motion, readable status text, safe-area insets, and long-content cases.
These are acceptance requirements; visual/browser verification remains pending.

| Surface | Required states | Constraints / evidence |
| --- | --- | --- |
| Global bottom layer | Cold visit: delayed CookieConsent. Consent resolved plus playing audio off-radio: StickyPlayer and facts chip. Unresolved consent plus audio: raised consent. On-sale desktop: ticket affordances with audio conflict suppression. Include paused audio too. | No overlapping actionable fixed rectangles at either viewport; derive offsets from actual player height rather than assuming `bottom-20` always fits. Verify accept and decline both resolve preference. Reproduce the reported 0×0 SoundCloud canvas warning and classify third-party versus app-owned causes before claiming a fix. |
| Home, Schedule, Tickets, EventDetails | Between shows; postponed; details pending; genuinely on sale; sold out; completed archive; cancelled/never-held notice where applicable. | Between shows uses owner-approved July 4 proof (“10-hour gathering · 2,800 attendees”) only where supported, with radio and First Access. Postponed: “POSTPONED — NEW DATE TO BE CONFIRMED” and reachable ticket-holder update. Pending: GET FIRST ACCESS. On sale: valid configured GET TICKETS. Sold out: waitlist only when capture works. No negotiating artist names or false checkout tracking. |
| Link-in-bio parity | `/sunsets-links` and `/untold`: compact mobile stack, one status badge, one primary action, secondary radio/calendar/network links, socials, optional eligible family promo. | Keep `/sunsets` ticket-holder guide and `/untold-story` full hub reachable. Test intended single-screen presentation, text zoom, longer copy, and actual scroll needs; do not clip support to force a one-screen aesthetic. |
| Radio deck and persistent bar | Unloaded facade → FEATURED EPISODE. Explicit Load the player → active playback / NOW SPINNING. Paused → FEATURED EPISODE in deck and PAUSED in dock. Off-radio dock with play/pause and close. | No media iframe before explicit user action. Preserve position on in-app navigation. Safe teardown when React 19 detaches iframe and `contentWindow` is null. Verify paused state, track switch, return to radio, close, embed failure, and network media handoff. |
| `/sunsets`, legacy `/newsletter`, controlled preview, `/shop` launch capture | Available/closed; idle enabled; invalid fields; submitting with aria-busy; saved; confirmation required; subscribed; duplicate/retry; suppressed address; 429; unavailable; offline. | Preserve event/radio/newsletter distinctions. Separate unchecked choices where required. Show only the success actually established by the selected backend. Hosted form and mailto alternatives must match audience; mailto is a draft, never a completed subscription. |
| House of Friends application | Closed; ready; validation; preparing; uploading photo/audio with progress; completing; submitted reference; expired session; retry; 429; unavailable/offline. | Submission requirements and optional marketing choice remain separate. Never report received before media verification/storage completion; preserve private uploads. No generic newsletter/mailto substitution for application completion. |
| Sponsor room and ops | Locked; submitting; invalid credentials; unconfigured; unavailable deck/data; authorized; expired session; denied API mutation. | Server enforcement is authoritative. Keep sponsor confidentiality/noindex and prevent private credentials or documents entering client bundles/static output. |

## 4. SEO and historical permanence are release gates

Follow the [standing repository rules](../AGENTS.md). A UX pass may improve
navigation and presentation without changing permanent entity identity.

- No redesign versions such as `/v2` or `/-2027`. Existing dated event/season
  URLs identify history and remain permanent. Use HTTP 301 only for approved
  duplicate consolidation with matching canonical and internal-link updates.
- Keep all 32 current artist dossiers and append newly contracted/performed
  artists after shows wrap. Do not remove past artists from static output.
- Keep actual past events, recaps, archives, insights, radio episodes, and gallery
  seasons as meaningful static HTML. Preserve postponed/cancelled/never-held
  truth without inventing performance receipts. The October launch conflict is
  unresolved; this document does not approve its deletion or redirect.
- Expand prerender and sitemap enumeration over all public historical entities,
  while keeping draft/private/noindex routes excluded. Do not feed private
  catalogue entries into a generic sitemap merely to increase coverage.
- Compare generated HTML canonicals, client SEO.tsx, JSON-LD lifecycle, sitemap,
  and HTTP redirects. Preserve existing intentional cross-domain radio canonical
  mappings; reconcile indexability and canonical ownership rather than blindly
  forcing every episode to self-canonicalize.

## 5. Owner decision register and recommended sequence

All activation decisions below remain pending. Recommendations are not approval.

| Decision | Recommendation | Evidence needed before activation |
| --- | --- | --- |
| Promote between-shows baseline | First release candidate, after source/SEO/security reconciliation. Do not promote `4ab844b` or `c42d8a5` blindly; review `b353ff7` + uncommitted working-tree diff (`HomeEntryPoints`, `HomeNextChapter`, `FIRST_ACCESS_CTA_MAP`, `prerender_public_routes.mts`). | Pin exact SHA; resolve October historical URL treatment (`RETIRED_NEVER_HAPPENED`); strip client bundle leaks (`sunsetsTicketing.ts`, `ChasingSunsetsTicketing.tsx`, `AdminDashboard.tsx`) & stale `Monolith.tsx` CTA; close historical static/sitemap gaps; complete release checks and live comparison. |
| Brevo / public waitlist | Second, as a small, proven capture release. Keep controlled Audience OS separate. | Select capture versus provider delivery explicitly; prove intended list, consent, suppression, retry, error UX, and actual receipt/subscription status. |
| Audience OS public intake | Defer public rollout; maintain isolated controlled proof. | Approved public contract and copy, scoped receiver, schema/cutover plan, downstream processing, and reviewed production component. |
| `/apedrums` flags | Keep sealed pending an explicit historical-publication decision; do not reopen an old sale. | Contract/publication clearance, archive behavior, actual status, metadata and static coverage, updated checklist. |
| HOF applications | Keep closed until the actual cohort and end-to-end storage/review workflow are ready. | Approved intake terms/dates, private R2/DB, media proof, notifications, applicant handling, and owner activation decision. |
| Shop | Keep “Collection 01 · In development” plus verified launch capture during UX pass. | Owner approval for any separate commerce scope before transactional launch. |
| Open Network audio continuity | Use the existing Wouter route for internal navigation. | Navigation/media QA, desktop/mobile behavior, preserved canonical URL and direct-load static HTML. |

### Suggested Sol 6.1 kickoff prompt

Copy the following with the full handoff. This prompt authorizes the requested
local UX/UI work when the owner dispatches it; it does not record approval of
pending production activations.

```text
Work on the Monolith Project website in:
/Users/starkindustries/Downloads/monolith-project website

Read AGENTS.md and docs/MONOLITH_ROUTE_ARCHITECTURE_ACTIVATION_ROADMAP.md first (alongside docs/FIRST_ACCESS_CTA_MAP.md).
HEAD is b353ff7 (plus active uncommitted working-tree changes across HomeEntryPoints.tsx, HomeNextChapter.tsx, shared/home-next-chapter.ts, Newsletter.tsx, Navigation.tsx, prerender_public_routes.mts, AGENTS.md, and public-cta.ts). Verify the current branch, exact HEAD, dirty paths, and any newer instructions before making changes. Preserve all uncommitted work and report new source differences instead of resetting to an older snapshot.

Implement the UX/UI pass one area at a time using the handoff's route map and
multi-state matrix. Start with the between-shows homepage, schedule, tickets,
and permanent event support states. Preserve Monolith's identity, the radio
archive, and the distinct roles of Radio, Open Network, and SUNSETS.FM.

Keep permanent canonical URLs and all historical artist/event/archive/radio/
insight/season pages. No /v2 or redesign-year replacement paths. Preserve all
32 current artist dossiers and meaningful static HTML; expand prerender and
sitemap coverage for public past events and gallery seasons. Match static
canonicals and JSON-LD to the client. October 10 never happened: reconcile
the current removal/calendar redirects with the permanence requirement
without inventing a past performance or recap. Preserve September 19's
postponed status and reachable ticket-holder update, including bio/menu chips.

Use current backend state for every CTA. Do not display a working checkout,
subscription, application, SMS channel, or storefront merely by changing a
badge. Keep the legacy newsletter, Sunsets event/radio capture, controlled
Audience OS proof, and sibling SUNSETS.FM /join as separate integration tracks.
Represent saved, confirmation-required, subscribed, unavailable, and offline
states accurately; preserve unchecked channel-specific consent where required.

Recommended direction, pending owner decisions: prepare a verified between-
shows baseline first, then a bounded, proven waitlist release. Keep /shop as
Collection 01 / In development with truthful launch capture. Use the existing
Wouter /open-network route for internal audio continuity and verify header,
footer, history, direct entry, and media handoff. Do not assume these
recommendations authorize production activation.

Do not enable Audience OS public intake, Brevo sending/automation, Ape Drums
release flags, HOF applications, commerce, or ops exposure without the owner's
specific activation decision and the corresponding readiness evidence. Do not
run production seeds, migrations, R2 configuration, or deployments from this
design prompt. Keep the sibling repository untouched unless separately scoped.
The historical July 31 Ape Drums page must not become a new on-sale campaign.

Verify all designed states at 390x844 and 1440x900. Check fixed-layer geometry,
keyboard/focus behavior, reduced motion, facade-only media before user action,
playing/paused audio continuity, embed cleanup, support links, and form errors.
For a release candidate, run npm run validate:events and npm run pixel:guard,
build the exact candidate, and inspect generated static HTML, sitemap,
canonical/JSON-LD parity, and real HTTP redirects/statuses. Document outstanding
checks rather than claiming success for untested states.

Deliver the changed paths, reviewable preview and desktop/mobile evidence,
validation results, unresolved activation decisions, and an exact candidate
SHA when one exists. Separate local, preview, committed/pushed, merged,
deployed, and live-verified states. Do not push a production release from this
prompt alone.
```

## 6. Release verification and completion record

Every release must run `npm run validate:events` and `npm run pixel:guard`.
Also build the exact candidate and verify the output, with changes scoped to the
authorized release. Do not run seed/migration/CORS scripts as read-only checks.

Required release evidence:

1. Exact checkout, branch, SHA, changed paths, included flags, and rollback target.
2. State/CTA agreement between catalogue, live `/api/site-data`, and direct HTML.
3. Fresh `dist/public/artists/*/index.html` coverage for every roster entry;
   meaningful static bodies and canonical/JSON-LD parity for all historical
   event, archive, insight, radio, and season URLs; complete sitemap comparison.
4. Actual HTTP status and Location checks for canonical/legacy/gated routes on
   the deployment host; client redirects are not substitutes for HTTP 301s.
5. Desktop/mobile screenshots and interaction evidence for the full matrix,
   including fixed-layer geometry and persistent audio navigation.
6. For each activated integration, authorized end-to-end proof and honest success
   state. Keep tokens, applicant information, and recipient details out of logs,
   public artifacts, screenshots, and the handoff.
7. Separate local validation, preview, pushed/merged source, production deploy,
   and live verification. Report the production URL only after observing it.

Handoff preparation completed: route/source review synced through `b353ff7` +
active uncommitted working-tree diff (`FIRST_ACCESS_CTA_MAP.md`,
`HomeEntryPoints.tsx`, `HomeNextChapter.tsx`, `RadioDeckPlayer.tsx`,
`prerender_public_routes.mts`, `AGENTS.md`), locked decisions `A1–A4`,
`MONO-IDEA-012` bundle leak findings, and Meta/Posh CAPI attribution gaps.
Outstanding: bundle-security & attribution fixes, implementation gaps above,
owner activation decisions, fresh build, browser matrix, production
environment/DB/provider checks, and live release proof.
