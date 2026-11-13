# Local Monolith UX verification — November 10, 2026

Follow-up: [November 11 fixes and verification](LOCAL_HISTORY_FIXES_20261111.md)
resolve the historical coverage, launch notice, and mobile player/wordmark issues
below. This document retains the earlier audit results.

Result: the current visual pass passes the checks below. The complete site still
has historical SEO and player issues to resolve before a release. Local only;
no commit, push, deployment, gated feature activation, or signup submission.

Canonical checkout: `/Users/starkindustries/Downloads/monolith-project website`.
Preview: `http://localhost:3002`.

## Verified

- TypeScript passes (`tsc --noEmit`, without source-generating npm hooks).
- Unit suite: 547 passed, 11 skipped; 59 test files passed, one skipped.
  The initial sandbox run could not bind API test sockets; the complete rerun
  with local socket access passed.
- Fresh Vite production build, static prerender, and server bundle pass.
- `npm run validate:events` passes for nine catalog events, with the recap
  warnings below. `npm run pixel:guard` passes against the fresh output.
- 32 route/viewport combinations: 20 routes at 390×844 and 12 at 1440×900.
  No uncaught page errors, broken rendered images, or horizontal page overflow
  were found in those checks. Screenshots of home, signup, bio pages, radio
  episode, and menu were inspected selectively.
- Axe checks restricted to `main` on `/newsletter`, `/untold`, and
  `/sunsets-links`, at both widths, report no WCAG A/AA violations. This is not
  a claim of full-site accessibility certification.
- Menu First Access navigation reaches `/newsletter` at both widths; SUNSETS.FM
  maps to `/sunsets-fm`, and House of Friends maps to `https://houseoffriends.vip/`.
- First Access links inspected on home, calendar, tickets, and the bio pages
  reach signup. Newsletter and music actions use their distinct hosted forms.
  The removed explanatory signup copy is absent from the client page and static
  newsletter HTML. No hosted form was submitted.
- 32/32 artist dossiers, 13/13 radio episodes, and 5/5 insights have static files.
  All artists and insights are in the built sitemap.
- JSON-LD in all 80 generated `index.html` files parses. Static and client
  canonicals match for the sampled routes where both exist; entity semantics
  across every historical record were not exhaustively verified.
- At both widths, explicitly starting the Benchek player and using the menu
  signup link preserves the selected audio track in the dock. Pause and close
  controls respond. No iframe mounts before the explicit player action. The
  cookie notice does not overlap the dock in the measured signup-page state,
  and declining persists `monolith_cookie_consent=declined`.
  Actual uninterrupted streaming and track-end behavior were not verified.

## Fixed during this check

Static prerender crashed because newer radio episodes lack entries in
`SUNSETS_EPISODE_URLS`. `scripts/prerender_public_routes.mts` now falls back to
the episode's existing `sunsetsUrl` or recording URL, with an appropriate link
label. It does not invent a SUNSETS.FM destination or change canonicals. A fresh
build verifies all 13 episode pages and contains no `href="undefined"` links.

## Remaining release issues

1. **Historical SEO coverage.** Eight of nine catalog event URLs are absent from
   the static output and sitemap. Six gallery-season routes are also absent;
   ten of eleven `/archive/<slug>` routes lack both. These groups overlap and
   must not be added together as unique history counts. Seven newer radio pages
   have static HTML but no sitemap entries. Preserve truthful event lifecycle,
   historical aliases, canonicals, and media-pending states when reconciling.
2. **October launch URL permanence.** `/events/css-oct10` and
   `/events/monolith-launch` still resolve to the calendar. Netlify config has
   forced 301s to `/schedule`; the local client also resolves there. This
   conflicts with the owner's history policy. Preserve a truthful never-held
   dossier rather than claiming a completed show.
3. **Recap receipts.** Event validation warns about missing `recapUrl` or
   `archiveSlug` for `us-s3e1`, `us-s3e3`, `mpr-kashmir-jul24`,
   `hof-kashmir-jul31`, `mpr-kashmir-aug15`, and `css-aug22`. Link only verified
   receipts; do not invent galleries or completed performances.
4. **Mobile player embed dimensions.** The dock iframe measures 0×60 at 390px
   because its wrapper uses `w-0 h-0`. This leaves the reported SoundCloud canvas
   issue unresolved. The third-party warning itself was not reproduced or
   attributed during this check.
5. **Consent timing — corrected November 11.** The 3-second deferred global
   module mount plus CookieConsent's 3.6-second timer already produce a nominal
   minimum of 6.6 seconds plus loading time. The original audit overlooked the
   first delay. Timing is unchanged. Decline was verified at both widths;
   acceptance was not exercised in this audit.
6. **Mobile radio wordmark.** The long radio header wordmark is visually clipped
   at 390px even though the document has no horizontal overflow.
7. **Open Network continuity.** Existing header/footer full-page navigation to
   `/open-network` remains. Moving it into SPA navigation is a separate owner
   decision; this check did not change that behavior.

## Scope and evidence

No Brevo receipt delivery, production database/storage configuration, ticket
checkout/webhooks, real phone autoplay/orientation, sponsor authentication, or
sealed release gate was activated or claimed verified. Other agents' pending
work and generated assets remain untouched.

Local machine-readable reports and screenshots are in
`/private/tmp/monolith-review-20261110/` (`report.json`, `static.json`,
`runtime.json`). Build/test logs are `/private/tmp/monolith-review-build.log`,
`/private/tmp/monolith-review-prerender.log`, and
`/private/tmp/monolith-review-unit.log`. Temporary evidence may not persist.
