# Production release — November 16, 2026

Historical release record. The subsequent approved release is documented in
[PRODUCTION_RELEASE_20261117.md](PRODUCTION_RELEASE_20261117.md).

Published the owner-approved Monolith design, Radio, navigation, glyph artwork,
footer glow, and shared campaign bios at 2026-11-16 22:26:42 UTC.
Restored SUNSETS.FM navigation at 2026-11-17 01:27:59 UTC (November 16 in Chicago).

## Priority 1 — configure and verify production CAPI

Owner explicitly requested that this stay at the top of the follow-up list on
November 16, 2026. **OPEN: server-side CAPI delivery is not active.**

- [ ] Securely configure `META_CAPI_ACCESS_TOKEN` in Netlify's production runtime
  for the primary Dataset/Pixel `1049241148606250` (ending in 6250).
- [ ] Verify the token has access to that Dataset and the deployed runtime sees
  it; check supported lead paths, browser/server event-ID deduplication, and a
  controlled Meta test event before marking delivery working.
- [ ] Record verification evidence and clear any temporary test-event setting.

Do not mark this complete merely because browser Pixel tracking works or the
server fallback ID is correct. Never save the token in source, chat, or this
checkpoint. The credential was absent when inspected during this release.

## Saved release checkpoint

- Netlify site: `monolithproject` (`33d2ce42-1a25-4b67-a318-bdce495f5f47`).
- Current published deployment: `6afba9504b2fd2df0b24f765`.
- Immutable artifact: https://6afba9504b2fd2df0b24f765--monolithproject.netlify.app
- Production: https://monolithproject.com/radio/
- Campaign roots: https://sunsets.vip/, https://untold.vip/, https://houseoffriends.vip/.
- Previous deployment / rollback target: `6afb825979d2e7f291142396` (initial design release).
- Initial design release rollback target: `6afa070a7d997d290a7b7031`.
- Source: all website work is captured in the commit containing this record,
  based on `8d5e268`. No source push was performed.
  Existing unrelated email work remains untouched and is not imported into the
  deployed API bundle. No database writes, seed execution, signup submissions,
  provider activation, or launch-gate changes were performed.

## What shipped

The full design scope is recorded in `LOCAL_DESIGN_UPGRADE_20261116.md`. This
release adds a shared campaign-bio layout with coral Sunsets, violet Untold,
and sage House of Friends variants; refreshed titles and short bios; direct
cross-project links; and a SUNSETS.FM coming-soon card. All three domains stay
on their own hostname with matching static and client canonical metadata.
House of Friends' full program page and application route remain available.

The footer wordmark now uses a restrained CSS text-shadow halo with a stronger
desktop hover state, a smaller mobile effect, and reduced-motion support. This
replaces the wordmark mouse-follow handler and adds no image download or animation
loop. The existing scroll treatment remains. The supplied glyph artwork is a
149,374-byte WebP reused across the footer, navigation, menu, and campaign bios.

Radio cover art now uses the existing AVIF/WebP responsive-image pipeline at
160/320/640/1024px. All 104 variants referenced by the 13 active covers were
verified in the release. Their smallest AVIF derivatives total 61,196 bytes,
versus 4,426,190 bytes for their masters; originals remain preserved.

## Pixel and analytics

Owner confirmed `1049241148606250` as the primary Pixel/CAPI Dataset. Browser
tracking already used that ID. The generic server lead handler and future CMS
seed default now match it, replacing the old `166134370742863` fallback. The
release guard now checks both browser and server bundles for the retired ID.
Tests that explicitly exercise arbitrary or historical Dataset inputs remain
intact; no Meta account or Dataset was deleted.

Netlify's production context had no overrides for META_BRAND_PIXEL_ID,
META_PIXEL_ID, META_LAKE_PIXEL_ID, VITE_META_PIXEL_ID, or VITE_LAKE_PIXEL_ID.
The production META_CAPI_ACCESS_TOKEN was also absent: server-side CAPI delivery
is therefore inactive until that credential is securely configured. No secret
value was displayed or stored in this report. Google Analytics was opened in
Chrome; account reports were not inspected. The site's GA4 measurement ID is
`G-DE8Z8VS263`.

## SUNSETS.FM navigation restoration

The existing `/sunsets-fm` page was intact but lacked an explicit link in the
desktop Radio dropdown. Restored SUNSETS.FM alongside the radio series and
Open Network, added it to the mobile Radio chapter, restored a direct link on
its homepage hero slide, and added a permanent homepage entry beside Radio.
The four homepage entrances use four columns on desktop, two on tablet, and
one on mobile. Both existing destination pages and all radio episodes remain.

The production build, TypeScript, event validation, Pixel guard, all 84
historical-route checks, and 641 unit tests passed (11 tests skipped).
Thirteen focused checks passed on the exact preview and production release,
covering 1440/1024/768/390/360px layouts, working page links, keyboard activation,
mobile menu navigation, canonical metadata, and zero browser errors. The new
homepage entries and Radio dropdown have zero axe WCAG A/AA violations.
Netlify independently reports the current deployment ID above as published.

Evidence: `/private/tmp/monolith-sunsets-nav-20261116/preview/` and
`/private/tmp/monolith-sunsets-nav-20261116/production/`; build, test, and deployment
logs are saved alongside the initial release logs in `.tmp/release-20261116/`.

## Initial design release verification

- Production-context Netlify build, TypeScript, and whitespace checks passed.
- Unit tests: 641 passed, 11 skipped.
- Event validation, browser/server Pixel guard, and all 84 permanent historical
  routes passed static-content, canonical, sitemap, and lifecycle checks.
- Both immutable preview and production: 116 static routes, 22 desktop/mobile
  browser checks, three campaign pages with JavaScript disabled, navigation
  open/Escape dismissal, Radio search, and API health passed; no browser JS errors.
- Live campaign domains: six desktop/mobile checks passed, including their own
  canonical roots, www-to-apex 301s, all three cross-links, and zero axe WCAG
  A/AA violations. House of Friends `/apply` remains available without opening
  the intake gate.
- Permanent redirects verified: `/story` to `/untold-story`,
  `/events/monolith-launch` to the truthful `/events/css-oct10` dossier, and
  `/lake` to the existing `/sunsets/` destination.
- Production SoundCloud playback advanced to 3,000ms with exactly one player;
  pause succeeded afterward.
- Final mobile Lighthouse on the immutable Radio preview: 95/100 performance,
  2.52s simulated LCP, 1ms blocking time, and 0.00067 layout shift. This is a lab
  sample, not field-performance data. The Netlify Lighthouse plugin's local
  root probe returned 404; the separate hosted-page run supplied these results.
- Netlify's published deployment ID was independently verified after promotion.

## Evidence

- Release scripts, build/test logs, deploy receipts, and Lighthouse JSON:
  `.tmp/release-20261116/`.
- Preview: `/private/tmp/monolith-release-20261116/final-preview/report.json`.
- Production: `/private/tmp/monolith-release-20261116/production/report.json`.
- Live domains: `/private/tmp/monolith-release-20261116/domains/report.json`.
- Playback: `/private/tmp/monolith-release-20261116/production/playback.json`.
- Screenshots are adjacent to those reports. Earlier local QA remains preserved.
