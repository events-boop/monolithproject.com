# Monolith / SUNSETS checkpoint — 2 November 2026

Canonical checkout: `/Users/starkindustries/Downloads/monolith-project website`.
Branch: `fix/upgrade-review-20261017`. Use `git log -1` for the local completion commit.
Local preview: `http://localhost:3001/`; native network page: `/radio`.

## Completed scope

- Replaced the old radio hub with the approved Open Network content in the original Monolith header/footer. Monolith is the parent; Chasing SUN(SETS) Radio is the origin; SUNSETS.FM is the broader discovery network.
- All 121 recordings use local cover files. The 13 Chasing recordings now use today's approved color artwork, including hero, player, and library appearances. Recording URLs remain matched to the source catalog.
- Featured Rafael B2B Brunello RAW CUTS set uses the official SoundCloud recording. Live play, seek, stop, and single-player behavior were verified. Track cues are explicitly partial and credited.
- Homepage has three slides: original Monolith, SUNSETS.FM/Diplo, and Chasing Radio. Includes pause/resume, manual controls, swipe, keyboard focus behavior, reduced motion, and offscreen/tab visibility handling.
- SUNSETS.FM launch signup routes to the existing Brevo `SUNSETS.FM Releases` hosted form (`shared/signup-forms.json`, radio audience). The form returned HTTP 200 and displayed its email-confirmation copy. No test subscription or message was sent. Subscriber delivery and list membership have not been verified inside Brevo.
- The postponed-event popup's automatic-opening code is removed. Ticket-holder information remains on event cards and the official event page.
- SUNSETS.FM's existing doorway now uses coming-soon language and links into the native network page. Corrected the missing h1 on populated archive galleries.

## Verification

- TypeScript passed; Vite build passed; public-route prerender checked before commit.
- 50 unit tests passed (scene routing, signup handoff, postponement publication).
- 15 browser checks passed across responsive carousel/signup, radio, and event-notice behavior. Sizes include 320, 390, 768, 1363/1440.
- Read-only review of 75 public routes: all HTTP 200, no broken image loads or JS page errors. Ten primary routes also checked at 390px without horizontal overflow or automatic event notices.
- One archive heading omission was fixed and rechecked. A local `/lake` analytics POST returned 403; page rendering worked. Investigate origin/proxy configuration before changing any security guard.
- Raw review: `public-site-review.json`; artwork/source receipts are beside this file.

## Release boundaries and open decisions

- Local work only. A commit does not mean pushed, merged, or deployed. Publication was not requested.
- The Diplo Antarctica video (`QtKGMfeyPUE`) returned YouTube embed error 150. The poster therefore says **Watch on YouTube** and opens the official video. Do not claim in-page playback works. A user preference is pending: retain Antarctica with that link, or choose another Diplo set with verified embedding and matching artwork.
- The site-wide existing asset budget exceeds its 28 MB target. Do not describe this as release-ready performance. Newly reused homepage artwork totals about 404 KB.
- Prior uncommitted work was backed up at `/private/tmp/monolith-network-20261102T223808Z`. Preserve remaining unstaged sitemap timestamps and unused `client/src/pages/chasing-radio.css`.

## Next review / polish ideas

1. Review the homepage's event hierarchy: the postponed JOEZI × MASSUMA card is still prominent. Consider a compact ticket-holder update with new show discovery carrying more visual weight. Keep approved date/refund facts intact.
2. Bring the six legacy episode tiles on `/sunsets-fm` into the same artwork and native listening flow as `/radio`; the current coming-soon gateway already points to the new page.
3. Resolve the Diplo inline-video choice, then test the selected recording on the deployed domain and mobile. Respect publisher playback restrictions.
4. Confirm Brevo launch messaging/list ownership with the owner. The current audience is music releases; adding launch-specific segmentation would need an intentional form/list update.
5. Reduce the existing public asset footprint before publishing. Audit file references first; do not delete media or unrelated artwork blindly.
6. Add a focused mobile accessibility/performance pass for the gallery, signup handoff, and main navigation, followed by preview-deploy verification when publication is requested.
