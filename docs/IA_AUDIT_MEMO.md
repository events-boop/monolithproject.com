# IA Audit Memo

This document records the current Monolith Project information architecture and conversion rules.

## Canonical structure

- `Monolith` is the root project.
- `Chasing Sun(Sets)`, `Untold Story`, and `Radio Show` are the public branches.
- `Togetherness` is a single About-page concept, not a parallel brand or separate branch.

## Canonical routes and anchors

- `/about` is the main About route.
- `/about#togetherness` is the canonical Togetherness anchor.
- `/togetherness` remains a route alias that should land visitors on the Togetherness section inside About.
- `/about#vision` is reserved for the `How It Works` architecture section, not Togetherness.

## Navigation and footer rules

- Navigation and footer should both expose `About` and `Togetherness`.
- No surface should describe Togetherness as a separate product, series, or branch.

## Conversion rules

- Home: one primary path above the fold, one newsletter surface near the end.
- Chasing Sun(Sets): fixed ticket badge plus one funnel surface at the end. No duplicate closing conversion strip.
- Untold Story: one updates surface at the end. No stacked funnel plus ticker duplication.
- Tickets: one funnel surface only.
- Event detail pages: rely on global footer and floating ticket CTA instead of mounting page-local duplicates.

## Terminology rules

- Use `Tickets`, `Early Tickets`, `Final Tickets`, `Join Waitlist`, `Newsletter`, and `VIP Access`.
- Avoid legacy terms like `Founders Access`, `Inner Circle`, and `Ecosystem` on customer-facing surfaces unless intentionally retained for archival or internal contexts.
