# Monolith approved design release — November 12, 2026

## Published release

- Production: https://monolithproject.com
- Source revision: `3a3edfc7f58d69d67645ccb0b6effb181aa5f319` on
  `fix/pr0-chunk-recovery-hotfix`.
- Netlify deployment: `6af55344188087aa0ff3c842`.
- Published at: `2026-11-12T06:19:09.607Z`.
- Deploy details:
  https://app.netlify.com/projects/monolithproject/deploys/6af55344188087aa0ff3c842
- Previous production: `6af3651c9257d9c5a896624e`, published November 10.

The owner approved the design work and requested that it appear on the live
site. A production-context build was uploaded as a draft, verified, then that
exact artifact was published. The source branch was not pushed. Build-generated
sitemap lastmod dates advanced to November 12; this checkpoint records them.

## Included work

The release includes the five previously local commits: public history and
First Access consolidation; the 2027 series/collection design; preserved
responsive media and handoff work; the Monolith parent page and Lake List
refresh; and uppercase 2027 collective branding.

The 2027 masthead reads **THE MONOLITH PROJECT COLLECTIVE**. Cards read
**UNTOLD STORY**, **CHASING SUN(SETS)**, **HOUSE OF FRIENDS**, and **SUNSETS.FM**.

## Verification

- Fresh Netlify production-context build succeeded.
- Event validator: 9 events pass; six pre-existing missing recap/archive receipt
  warnings remain. History validator: all 84 historical route checks pass.
- Public pixel guard passes. TypeScript and the prior full unit suite passed
  before upload (556 tests passed, 11 skipped).
- Both the uploaded draft and the production domain pass 89 static route
  requests: meaningful headings, matching canonicals, valid JSON-LD, preserved
  indexability, the truthful never-held launch notice, and postponement notice.
- `/story` and `/events/monolith-launch` return their intended 301 redirects.
- Chrome at 390 and 1440 pixels on both draft and production verifies uppercase
  2027 branding, no horizontal overflow, First Access navigation to `/newsletter`,
  hosted signup destinations, and no iframe loaded before interaction. No page
  errors occurred in those flows.
- Live `/api/health` returns `{"ok":true}`. The public event feed returns data;
  no current record has a configured live checkout URL.

The first draft route sweep encountered three temporary fetch failures. Direct
requests returned 200; a complete repeat with connection retries passed all 89
routes. No archive source change was needed.

Local evidence:

- `/private/tmp/monolith-approved-release-preview-20261111.log`
- `/private/tmp/monolith-release-preview-20261111/report.json`
- `/private/tmp/monolith-release-production-20261111/report.json`
- Screenshots beside both reports: `2027-390.png`, `2027-1440.png`, and newsletter
  screenshots at the same widths.

## Remaining limits and follow-up

- Signup verification covered navigation and destinations; no subscriber was
  submitted and email delivery was not tested.
- Production still has legacy unconfirmed placeholder records including
  `mp-launch-001`, `css-002`, and `us-002`. Pending confirmation suppresses their
  old dates in calendar presentation. Review these records with the owner;
  this release did not write or delete production data.
- Six completed events still need verified recap/gallery receipts. Do not
  invent them or delete their permanent dossiers.
- Real-phone audio continuity and native Open Network navigation remain separate
  follow-up work. Gated systems and release flags were not activated.
