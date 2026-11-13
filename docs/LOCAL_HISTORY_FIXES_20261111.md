# Monolith history and status fixes — November 11, 2026

Implemented and verified locally. Nothing committed, pushed, merged, or deployed.
Other pending work is preserved.

## Event truth and permanent URLs

- `/events/css-oct10` is a permanent, indexable notice stating that the
  October 10, 2026 launch did not take place. It is not an upcoming show or a
  completed performance. `/events/monolith-launch` is a genuine duplicate and
  permanently redirects to the notice. The canonical notice no longer redirects
  to the calendar. No historical event pages are deleted.
- A stale database launch row is excluded from the marketed event catalogue;
  this does not delete database records or remove the public notice.
- September 19 remains postponed, with the original date, the approved notice,
  ticket-holder support, no checkout offer, and no invented replacement date.
  Static and client event metadata share the same copy helper.
- Past catalog events retain their dossiers, and existing ID aliases remain
  readable with the same canonical URL as the client. Past dossiers carry
  archive copy and do not sell tickets.
- Removed a stale nested July 4 ticket offer from the afterparty's structured
  data. Its parent event now links to the permanent July 4 dossier rather than
  the September guide.
- Monolith's organization graph explicitly connects Chasing Sun(Sets) and
  Untold Story as its brands.

## Static history coverage

| Registry                  | Meaningful static HTML              | Sitemap                |
| ------------------------- | ----------------------------------- | ---------------------- |
| Artist dossiers           | 32/32                               | 32/32                  |
| Radio episodes            | 13/13                               | 13/13                  |
| Catalog events            | 9/9, plus historical ID aliases     | 9/9 canonical entities |
| Insights                  | 5/5                                 | 5/5                    |
| Archive collections       | 11/11                               | 11/11                  |
| Series gallery paths      | 8/8, including all six season paths | 8/8                    |
| Never-held October launch | Permanent canonical notice          | Included               |

These route groups overlap in content. They are not counts of unique shows.
Media-pending galleries retain their actual available artwork/media and honest
preparation notices; missing recaps are not fabricated.

`npm run validate:history` now checks the actual build output and is part of
`npm run build`. It verifies 84 historical routes, static entity content,
indexability, canonicals, sitemap coverage, JSON-LD parsing, and event state. It
rejects checkout offers on past/postponed records and misrepresentation of the
never-held launch as a performance.

Static and Express sitemaps use the same public registries, so newly added
artists, recordings, archives, and insights are discovered automatically.

## Mobile fixes

- SoundCloud's dock iframe measures 320×60 at 390px, replacing the zero-width
  iframe. It remains mounted while navigating to signup, and pause/close work.
- The radio wordmark fits in the mobile header using a compact two-line lockup.
- Cookie timing was already nominally 6.6 seconds (3 seconds before module
  mounting, then 3.6 seconds). It is unchanged; the earlier QA report is corrected.
- At 390×844 and 1440×900, the unresolved cookie banner does not overlap the
  dock on signup. Decline persists. No iframe mounts before explicit playback.

## Verification

- TypeScript passes.
- Full unit suite: 556 passed, 11 skipped; 60 test files passed, one skipped.
- Fresh Vite build, prerender, server bundle, event validator, history guard,
  and public pixel guard pass.
- 112 generated index files; JSON-LD parses. No coverage gaps or static/client
  canonical mismatches were found in the checked registries and route samples.
- 32 mobile/desktop route checks report no page errors, broken rendered images,
  or horizontal overflow. Scoped signup/bio accessibility checks pass.
- Compiled Express server checks verify the launch alias 301s, notice and
  postponed page content, historical dossiers and galleries, and exact sitemap
  URL parity with the static file.

Local evidence: `/private/tmp/monolith-review-20261111/` (reports, screenshots,
runtime checks, compiled-server checks). Build/prerender/test logs:
`/private/tmp/monolith-history-*-20261111.log`.

## Remaining work and limits

- Six event validator warnings still require verified recap/archive receipts:
  `us-s3e1`, `us-s3e3`, `mpr-kashmir-jul24`, `hof-kashmir-jul31`,
  `mpr-kashmir-aug15`, and `css-aug22`. Their event dossiers are preserved.
- The existing full-page Open Network navigation is unchanged.
- Actual uninterrupted audio, track-end behavior, real-phone autoplay, signup
  delivery, production database state, and recrawling are not verified here.
- The public search index returned older conflicting homepage/event snapshots.
  Local fixes do not establish that the deployed site or index has changed.
  All gated systems remain unchanged; no production data is written.
