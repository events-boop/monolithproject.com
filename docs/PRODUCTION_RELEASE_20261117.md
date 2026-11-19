# Production release — November 17, 2026

## Priority 1 — CAPI credential and delivery verification

**OPEN:** configure and verify the production CAPI token for primary Dataset/Pixel
`1049241148606250` (6250). Credential setup, dataset access, browser/server
deduplication, and a controlled test event remain outstanding. This release did
not change credentials or activate any provider, intake gate, or campaign.

## Published artifact

- Site: `monolithproject` (`33d2ce42-1a25-4b67-a318-bdce495f5f47`).
- Published deployment: `6afcc8a0ffbb0b79e8d27aa9`.
- Published at: `2026-11-17T21:44:03.182Z` (15:44 Chicago).
- Production: https://monolithproject.com/
- Immutable artifact: https://6afcc8a0ffbb0b79e8d27aa9--monolithproject.netlify.app
- Previous production / rollback: `6afba9504b2fd2df0b24f765`.
- The exact verified draft was promoted. The promotion script first confirmed
  that production still matched the recorded previous deployment.
- Source is captured in the local commit containing this record, based on
  `fe3af6b`. No Git source push was performed.

## Changes

- Seven newly added artist profiles use a shared 1.4 KB dark shadow-box asset
  while awaiting named portraits. Existing artist photography and the editorial
  layout remain intact. The roster contains 39 permanent artist profiles.
- Restored the biography's word-by-word focus reveal. Reduced-motion users get
  plain text; the shared component keeps its scroll target ref attached.
- Preserved the engraved thank-you texture and glyph dividers. Fixed the footer
  engineering credit's narrow-phone wrapping, spacing, and text contrast.
- The desktop edge effect settles to one gentle glow animation. Mobile does not
  run its scroll updates; reduced motion disables animation. All three campaign
  bio pages exclude the edge effect, including their hostname roots.
- Hosted verification caught a direct-navigation 404 at `/artists`: Netlify's
  unknown-artist wildcard intercepted the directory. Added exact 301 redirects
  from `/artists` and `/artists/` to the existing canonical `/lineup`, ahead of
  that wildcard, with matching Express behavior. Individual artist URLs remain
  permanent; unknown artist slugs still return 404. Added directory alias checks
  to the route smoke harness.

## Verification

- Production-context Netlify build, TypeScript, formatting, and diff checks pass.
- Final unit run: 641 passed, 11 skipped, across 69 passing test files and one
  skipped file. The initial sandboxed run could not run its local HTTP servers;
  the authorized run passed.
- Event validation and primary Pixel guard pass. All 91 historical routes retain
  static content, canonical metadata, sitemap coverage, and lifecycle state.
- Exact preview **and production**: 123 public static routes pass HTTP,
  canonical, and JSON-LD checks; 22 desktop/mobile template checks pass; three
  campaign bios render without JavaScript. Redirects, navigation, Radio search,
  and API health pass. No browser page errors.
- Exact preview **and production**: 22 focused checks pass for new assets,
  directory redirects, 39 artist cards/seven shadow boxes, biography progression,
  mobile footer bounds, motion reduction, and viewport-listener cleanup. Widths:
  1440, 390, 360, and 320px. Footer WCAG A/AA audit: zero violations.
- Live `sunsets.vip`, `untold.vip`, and `houseoffriends.vip`: six desktop/mobile
  checks pass, including canonical roots, www redirects, cross-links, no edge
  seam, and zero WCAG A/AA violations. House of Friends `/apply` remains available
  with its existing intake gate unchanged.
- The Netlify Lighthouse plugin still tests a local root that returns 404; this
  is not a hosted-site failure. A separate hosted mobile lab run on the visual
  candidate `6afcb141cd303ce771e69bab`, before the routing-only correction, scored
  performance 98/accessibility 100, LCP 1.9s and TBT 70ms. These are lab measurements
  of that candidate, not field metrics or a repeated audit of the final artifact.

## Boundaries and follow-up

- Real portraits and approved bios/origin/genre for Sophia Georges, Amit Harris,
  Flare, Kaspian Brothers, Austin Ashtin, Lexsan, and Deep State Disco remain
  pending. The owner approved temporary shadow boxes. No identity was inferred
  from unlabeled event photos. Existing supplied event-history entries were
  retained; their sourcing was not independently established in this design pass.
- Unrelated email-template changes and `scripts/send_test_email.mts` remain
  untouched and excluded from this commit. File hashes match the pre-release
  checkpoint, and the unrelated email modules are absent from packaged functions.
- No email was sent, real form submitted, database changed, source pushed, or
  Atlas build modified. Atlas 2.0 is a separate pending request requiring its
  preview URL/folder before comparison and implementation.

## Evidence

- Build/test/deploy logs and publication receipt: `.tmp/release-20261117/`.
- Full preview report: `/private/tmp/monolith-release-20261116/final-preview-20261117/report.json`.
- Full production report: `/private/tmp/monolith-release-20261116/production-20261117/report.json`.
- Focused preview/production reports and screenshots:
  `/private/tmp/monolith-release-20261117/{final-preview,production}/`.
- Campaign domains: `/private/tmp/monolith-release-20261117/domains/report.json`.
- Local media search and implementation history:
  [LOCAL_POLISH_PHOTO_LOOKUP_20261117.md](LOCAL_POLISH_PHOTO_LOOKUP_20261117.md).
