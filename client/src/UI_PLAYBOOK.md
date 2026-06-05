# The Monolith Project UI Playbook

Last updated: 2026-05-31

This is a living operating guide for agents working on the public Monolith site.
It is not a static roadmap, not a backlog, and not permission to rebuild old
concepts. If this document conflicts with the current repo, production behavior,
or a newer user request, the current repo and newer request win.

## 1. Agent Ground Rules

Before changing UI, verify current state:

1. Run `git status --short --branch`.
2. Read the route/component you are about to change.
3. Check recent intent with `git log -5 --oneline`.
4. Treat this playbook as guidance, not as a task list.

Do not implement historical ideas from this file unless the user asks for them
again in the current thread. Do not revert newer work because an older section
describes a different direction.

When you complete a major UI direction change, update this playbook in the same
PR/commit so the next agent does not work from stale context.

## 2. Current Site Direction

The public site is a premium event and conversion site, not a full-screen
experimental app by default. Favor clear ticket paths, signup capture, event
trust, fast load, strong SEO, and polished interaction over abstract interface
experiments.

Current production priorities:

- `/sunsets` is the official Sun(Sets) mobile-first ticket, QR, Season Pass,
  and Lake List wrapper.
- `sunsets.vip` mirrors `/sunsets` on the vanity host. Use
  `https://sunsets.vip/sunsets` as the canonical SEO/QR destination; legacy
  `/lake` and `/sunsets/lake` URLs should fold into `/sunsets` while preserving
  campaign query params.
- The Lake List form should remain real CRM/CAPI-ready capture through
  `/api/leads`, not local-only UI state.
- Sun(Sets) ticket traffic should use the tracked chapter rails:
  `/go/tickets/css-jul04`, `/go/tickets/css-aug22`, and
  `/go/tickets/css-sep19`.
- Recap, radio, social, VIP, and partner actions should use existing tracked
  outbound/internal paths.
- The experimental hero belongs in the gated sandbox until explicitly promoted.

## 3. SEO And Rendering Reality

This is still a Vite/React app, but it already has build-time prerendering for
known public routes. Do not recommend Prerender.io as the default fix.

The build flow is:

`vite build` -> `scripts/prerender_public_routes.mts` -> static route HTML in
`dist/public`.

Keep bot-facing prerender entries aligned with the live React routes. When a
route gets a new public purpose, update both the React page and its prerender
metadata/copy.

Current SEO expectations:

- Route-specific title, description, canonical, OG/Twitter tags.
- JSON-LD where it genuinely fits: events, FAQ, podcast/radio, artist pages.
- Sitemap and IndexNow routes should reflect real public destinations.
- Avoid duplicate-domain content. Use explicit canonical URLs and 301s to keep
  vanity-domain campaign rails consolidated to their active public route.

## 4. Design Principles

The site should feel cinematic, but usable first.

Prefer:

- Actual event/product visuals over generic gradients.
- Clear first-viewport signal for the event, series, artist, or action.
- One dominant CTA per conversion surface.
- Dense but readable operational surfaces for dashboards/admin pages.
- Mobile-first layouts for flyer/bio/QR destinations.
- Strong focus states, keyboard access, and readable contrast.
- Existing components, tracking helpers, and route patterns.

Avoid:

- Rebuilding the entire site into an anti-scroll canvas without explicit user
  approval.
- Decorative effects that make ticket/signup paths harder to understand.
- Removing focus-visible rings or accessibility affordances for visual cleanup.
- Placeholder copy like "asset space" in public UI.
- Treating old dates, old headliners, or old CTAs as still current.
- New third-party services unless they solve a present, verified problem.

## 5. Current Feature Notes

Sun(Sets):

- `/sunsets` is now the main public destination for Lake List signup, July 4
  ticket access, chapters, artist drops, recap video, radio, VIP, and partners.
- The React route is `client/src/pages/SunsetsLinkBio.tsx`.
- The prerender route copy lives in `scripts/prerender_public_routes.mts`.
- If the user changes offer language, update both places.

Hero / Monolith object:

- There is no committed production monolith video/3D asset unless the repo
  actually contains one.
- A CSS/image fallback is acceptable. Do not claim a real rendered asset exists.
- Sandbox-first is the safe path for major hero changes.

Meta CAPI:

- Server-side CAPI is present and no-ops without `META_CAPI_ACCESS_TOKEN`.
- Do not expose the token client-side.
- Lead conversion behavior has test coverage in `server/__tests__/meta-capi.test.ts`.

Airtable:

- Airtable is a mirror, not the source of truth.
- Website forms should continue through `/api/leads`; do not wire client forms
  directly to Airtable.
- The optional mirror is server-side and no-ops unless `AIRTABLE_API_KEY`,
  `AIRTABLE_BASE_ID`, and `AIRTABLE_LEADS_TABLE_ID` or
  `AIRTABLE_LEADS_TABLE_NAME` are configured.

DNS / Domains:

- Netlify redirect rules are code-side only.
- A vanity domain must still resolve to Netlify through DNS before the redirect
  can work publicly.

## 6. How This File Stays Fresh

Update this playbook when:

- A route changes public purpose.
- A new event becomes the dominant CTA.
- A sandbox feature is promoted to production.
- A third-party integration becomes live.
- A recommendation is discovered to be obsolete.

Use small edits. Replace stale instructions instead of appending contradictory
ones. If an idea is only a concept, label it as a concept and include the date.

## 7. Future Concepts Parking Lot

These are not active tasks. They require a fresh user decision before work:

- Full spatial/canvas homepage architecture.
- Site-wide audio-reactive UI.
- WebGL image trails.
- Global magnetic cursor behavior.
- Middleware prerendering or migration to a full SSG framework.

Only revisit these if the current user explicitly asks for that direction.
