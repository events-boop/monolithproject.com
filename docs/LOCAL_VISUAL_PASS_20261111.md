# Local visual pass — November 11, 2026

This pass updates the home → calendar → First Access journey in the canonical
Monolith working tree. The approved implementation and this report are included
in the local checkpoint with the earlier history and CTA pass. No push, merge,
or deployment is included.

## Design and behavior

- Shared editorial tokens define ink, muted text, surfaces, borders, gold,
  corner radius, and section spacing without replacing series palettes.
- `ProgrammeLinks` gives home, calendar, and newsletter the same four permanent
  series entrances: Untold Story Season III, Chasing Sunsets IV, House of
  Friends, and SUNSETS.FM. Decorative linework distinguishes the series; the
  SUNSETS.FM card crops the approved master asset and preserves its waveform.
- The 2027 preview uses gold, lighter editorial typography, graphic cards, and
  the same bold signup action as First Access. Calendar replaces the old
  between-shows box with this preview whenever no event is on sale, while
  keeping the July 4 recap, radio archive, and ticket-holder information.
- Newsletter shares the series cards and signup button treatment. Music and
  event signup destinations remain separate, using the existing hosted forms.
- Home's SUNSETS.FM invitation uses the approved “One signal. Infinite
  connections.” line and removes the front-facing form-mechanics paragraph.
- The static home and calendar reuse the same season-preview renderer.
  Historical URLs, canonicals, schema, and sitemap coverage remain intact.

## Verification

- TypeScript passed.
- Fresh Vite build and public-route prerender passed.
- Event validation passed for 9 events, retaining the six existing warnings
  about missing verified recap/archive receipts. No receipts were invented.
- Historical guard passed for all 84 historical routes; pixel guard passed.
- Chrome checked home, calendar, and newsletter at 320, 390, 768, and 1440
  pixels: 12 combinations, no page overflow, broken HTML images, or page errors.
- Axe found no WCAG A/AA violations in the changed season sections at 390 and
  1440, or in newsletter's main content at those widths.
- All three pages expose the same four canonical series destinations. The
  signup links were inspected; no form was submitted or gated system enabled.

Screenshots and browser report are local under
`/private/tmp/monolith-visual-pass-20261111/`.

## Preview

- Home: <http://localhost:3002/#next-chapter>
- Calendar: <http://localhost:3002/schedule#next-chapter>
- First Access: <http://localhost:3002/newsletter>

This is the first visual consistency pass. Other bespoke series, informational,
and inquiry pages have not been redesigned in this pass.
