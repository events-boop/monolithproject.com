# Performance Budget

This repo now has a hard output budget check. The goal is simple: visual ambition is allowed, silent payload drift is not.

## Current guardrails

- `dist/public` total: `28 MB`
- All shipped JS: `1.6 MB`
- All shipped CSS: `360 KB`
- All shipped images: `18 MB`
- All shipped videos: `8 MB`
- Largest JS chunk: `210 KB`
- Largest CSS chunk: `340 KB`
- Largest image: `700 KB`
- Largest video: `4.6 MB`

## Commands

- `npm run build`
- `node scripts/bundle_report.mjs`
- `npm run budget:check`
- `npm run perf:report`

## Why this exists

Most of the recent fixes were runtime and layout fixes:

- less global interaction chrome
- fewer shell-wide effects
- more stable section and gallery primitives

Those fixes improve responsiveness and main-thread behavior, but they do not automatically remove heavy static media. The current build is still dominated by:

- `videos/hero-video-short.mp4`
- `videos/hero-video-1.mp4`
- several large hero/archive PNGs and JPGs

This check makes that drift visible in CI and during local review.

## Review rule

If `npm run budget:check` fails, either:

1. reduce the asset weight, or
2. make a deliberate decision to raise the budget in `performance-budget.json`

Do not let the budget drift casually.
