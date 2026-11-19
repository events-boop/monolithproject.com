# Monolith: local design and engineering pass — November 16, 2026

Implemented in the canonical checkout. Local preview: http://127.0.0.1:5184/.
No commit, push, deployment, database mutation, provider activation, or real form submission was performed. Existing unrelated email work remains in the checkout.

The user approved the complete page-by-page improvement list, asked for a flatter Radio page, then selected the charcoal and illuminated etchings of the review map as the site's design direction.

## Visual direction

The shared system uses charcoal, cream typography, fine borders, open spacing, and an etched relief fading into the right side of selected heroes. Monolith uses auburn; Chasing Sunsets and Radio use warm coral; Untold Story uses violet; Open Network uses teal. House of Friends keeps its sage identity. The approved photography and brand marks remain.

`WorldEtching.tsx` shares one 88,494-byte WebP. Project colors use CSS variables and filters; photos are not recolored. Motion has a reduced-motion fallback. No new runtime dependency was added.

Artwork: `client/public/images/world-etchings.webp`.
Generation prompt and provenance: [etched-worlds-prompt-20261116.md](design/etched-worlds-prompt-20261116.md).

## Completed scope

| Page family                                    | Result                                                                                                                                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Artist profiles and index                      | Clear portraits with separate text, less mobile crowding, useful listening and saved actions; all 32 dossiers retained. Removed conditional hook ordering and misleading noninteractive play icons.                   |
| Archive and galleries                          | Larger photographic covers, series/year/verified venue filters, clear collections-in-edit labels, simpler gallery typography and spacing.                                                                             |
| Radio and episodes                             | One featured recording, compact searchable episode rows, working filters, open layouts, explicit selection/play handoff, smaller episode cover on phones. Unverified tracklist drafts remain out of public rendering. |
| Series worlds                                  | Warm lakefront and violet late-night identities, distinct etched light, clearer next-chapter actions, postponed support separated from future invitations.                                                            |
| Calendar and event dossiers                    | Pending proposals cannot become completed shows, sales, or borrowed recaps. Duplicate documented nights collapse in lists; underlying URLs remain. Postponed and never-held notices retained.                         |
| First Access                                   | Separate event and music choices linked to their respective hosted forms. Native intake gates preserved.                                                                                                              |
| VIP                                            | Between-shows invitation and host contact when no confirmed packages are available, replacing an unusable empty package flow.                                                                                         |
| Booking, contact, submission                   | Shorter mastheads, forms earlier in the journey, quieter containers, consistent navigation.                                                                                                                           |
| Partners and press                             | Existing event photography and permanent chapter links, honest asset-request labels, no unsupported delivery promise.                                                                                                 |
| Guide and travel                               | Venue-specific references, separate Hideaway/Alhambra addresses, no expired arrival schedule or unverified hotel discounts.                                                                                           |
| FAQ                                            | Search, empty state, clearer category behavior and a compact ticket-holder notice with full details available.                                                                                                        |
| Journal and facts                              | Functional topic selector, mobile heading fixes, readable articles and current status context alongside historical writing.                                                                                           |
| About and manifesto                            | Real event photography, clearer company introduction and distinct manifesto presentation.                                                                                                                             |
| House of Friends                               | Section navigation, tighter spacing, readable closed-intake state; gates stay closed.                                                                                                                                 |
| Ambassadors and alerts                         | Event-specific participation terms; alert choices lead to working hosted signup destinations.                                                                                                                         |
| Legal documents                                | Reading width and type, section navigation, dark header. Legal disclosure text retained.                                                                                                                              |
| Open Network and SUNSETS.FM                    | Teal atmosphere, shorter section rhythm, listening library earlier, coordination with the persistent radio transport.                                                                                                 |
| Shop, sponsor gate, recovery and bio utilities | Restrained headings/spacing, labeled sponsor access input and contact path; existing recovery destinations and gated states retained.                                                                                 |

The homepage's earlier larger hero, mobile artist-card spacing, 2026 artist/venue thank-you section, and removal of unconfirmed list entries are preserved. The new art and typography extend that approved work.

## Playback engineering

The persistent dock now owns the only SoundCloud transport, including on Radio routes. Page decks control that instance; route changes do not recreate it. Pause while connecting, seek/progress, close, source handoff, error reporting and explicit retries are covered. Starting an Open Network player pauses the dock; resuming the dock stops the local network player.

Actual SoundCloud verification on the featured recording reached 3,000 ms with one iframe and no page errors, then playback was stopped. This verifies that recording in the tested browser, not every recording or device. Deterministic browser checks cover navigation and competing-player coordination.

## Verification

- TypeScript: passed.
- Full unit suite: **640 passed**, 11 skipped across 70 files (69 passed, one skipped).
- Browser sweep: **128 routes/aliases × desktop and mobile = 256 captures**; zero page-load/JavaScript failures and zero document horizontal overflow.
- Interaction suite: **13/13 passed**, including additional 360px and 768px heading checks, radio selection/play/seek/navigation, archive year/venue/reset, journal filtering, FAQ search, venue addresses, signup separation, inactive VIP, pending-event truth, postponed support, and legal anchors.
- Real provider playback: featured SoundCloud clock advanced with one transport.
- Accessibility: 26 representative templates checked. No remaining owned violations in that sweep. One third-party YouTube `aria-prohibited-attr` violation inside the JOEZI embed remains outside site DOM control.
- Final targeted recheck covers Radio and the FAQ/contact/legal headers after the last visual refinements.
- Production client build and server bundle: passed.
- Static prerender and `validate:history`: 84 permanent historical routes verified, including all 32 artist profiles, with content, canonical/sitemap coverage, and truthful lifecycle states.
- `validate:events`: nine source catalogue records passed. The gate explicitly rejects sales/completed status and recap receipts on unconfirmed proposals.
- `pixel:guard`: passed.
- `git diff --check`: passed.

Production deployment, external form delivery, restricted sponsor access, and unopened application gates are not asserted by these local checks. Local API runs without database persistence and lead delivery; production data has not been changed.

## Evidence and restart

- Review map: `/private/tmp/monolith-all-pages-20261116/upgrade-review.html` (original audit captures retained; links now open the upgraded preview).
- Original map snapshot: `/private/tmp/monolith-all-pages-20261116/upgrade-review-baseline.html`.
- Full route evidence: `/private/tmp/monolith-full-upgrade-final-20261116/report.json`.
- Colorway contact sheet: `/private/tmp/monolith-full-upgrade-final-20261116/final-worlds.jpg`.
- Final visual touchups: `/private/tmp/monolith-refinement-final-20261116/`.
- Interaction and provider evidence: `/private/tmp/monolith-interactions-20261116/`.
- Build/test logs and pre-pass working-tree snapshot: `.tmp/full-design-pass-20261116/`.
- Local frontend 5184 proxies the local API on 5183. The prior 5182 preview remains available separately and uses its previous API proxy.

Unverified legacy tracklists require approved source material before publication. Native signup/application/sponsor activation remains governed by the existing route activation roadmap; this design pass does not change those decisions.

## Toolbar and continuous artwork follow-up

- Desktop navigation, dropdown directories, homepage quick links, central slide selector, and entry links now use the shared charcoal/cream typography and project accents. Mobile slide labels remain visible with 44px controls.
- Homepage etching opacity reduced exactly 20% (0.48 to 0.384 desktop; 0.18 to 0.144 mobile). A single persistent layer fades across the hero and survives slide changes; the Network and Radio slides use their project hues. Screen blending removes the artwork's rectangular matte.
- Navigation now separates real page links from explicit dropdown buttons. Unique IDs, Arrow Down entry, Escape/focus return, timer cleanup, and a pointer bridge keep the dropdowns usable. Radio links no longer duplicate Terranova under misleading episode labels.
- Follow-up verification: TypeScript and `git diff --check` pass. All 15 focused browser checks pass, covering five dropdowns, keyboard and pointer behavior, internal navigation, homepage quick links, all four slides, mobile menu, 360/390/768/1280/1440px layouts, project pages, and no JavaScript errors. The opened Radio dropdown has zero axe violations.
- Evidence: `/private/tmp/monolith-toolbar-20261116/results.json` and adjacent screenshots. Scoped QA source and before-edit snapshots are under `.tmp/full-design-pass-20261116/`.
- Preview remains local at http://127.0.0.1:5184/. No commit, push, or deployment performed.

## Final polish and supplied glyph wall

Owner requested the final typography, hero hierarchy, and navigation pass, then supplied `Monolith Glyph Wall.png` for the footer, navigation frame, and hamburger menu.

- Replaced remaining serif display treatments in the homepage Radio/Network slides, Network sections and listening mockup, menu, and footer signature with the shared display family. Existing series wordmarks and poster artwork remain intact.
- Narrowed the persistent homepage etching field and moved its strongest illumination away from the headline; retained the previously requested 20% opacity reduction and continuous slide layer.
- Reduced header visual weight with plain icon controls, a compact Calendar action, consistent type, and retained 44px targets. Removed duplicated mobile menu Search/Saved controls and ensured its quick links meet the same target height.
- Integrated the supplied artwork using `GlyphBackdrop.tsx`: strongest in the footer, softer in the menu, and a faint right-edge trace in the navigation frame. Fades/tints use CSS and adapt to the existing project palette; the decorative images are hidden from assistive technology and cannot block interaction. Footer imagery loads lazily.
- Source image: `/Users/starkindustries/Downloads/Monolith Glyph Wall.png`, 939 × 1675px, 2,255,331 bytes. WebP delivery copy: `client/public/images/monolith-glyph-wall.webp`, same dimensions, 149,374 bytes. Converted with the repository's Sharp dependency at quality 82; no generated replacement, geometry change, or new runtime dependency.
- Validation: TypeScript passed; 45 focused layout/interaction checks across 360/390/768/1280/1440px passed, followed by all 15 toolbar regression checks. Footer and open menu each have zero axe violations at 1440px and 390px; mobile footer expansion/link navigation, artwork loading, menu dismissal, and Network heading bounds pass. No browser JavaScript errors. `git diff --check` passed.
- Evidence: `/private/tmp/monolith-final-polish-20261116/results.json`, `art-results.json`, and adjacent screenshots; final toolbar evidence remains in `/private/tmp/monolith-toolbar-20261116/`. QA source and pre-edit snapshots are in `.tmp/final-polish-20261116/`.
- Local preview only: http://127.0.0.1:5184/. No commit, push, deployment, form submission, or provider activation.

## Production follow-up

The approved design and subsequent campaign-bio, footer-glow, Radio-image, and
primary-Pixel corrections were published on November 16, 2026. The local-only
status statements above describe earlier checkpoints; see
[the production release record](PRODUCTION_RELEASE_20261116.md) for the exact
deployment, live URLs, verification, and remaining CAPI configuration requirement.
