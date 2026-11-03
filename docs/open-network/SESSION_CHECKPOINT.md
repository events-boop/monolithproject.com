# Monolith / SUNSETS checkpoint — 2 November 2026

Canonical checkout: `/Users/starkindustries/Downloads/monolith-project website`.
Branch: `fix/upgrade-review-20261017`. Use `git log -1` for the local completion commit.
Local preview: `http://localhost:3001/`; radio archive: `/radio`; native network: `/open-network`.

## Completed scope

- Preserved the original radio hub structure at `/radio` and moved the approved Open Network content into its own native `/open-network` page, both with the Monolith header/footer. Monolith is the parent; Chasing SUN(SETS) Radio is the origin; SUNSETS.FM is the broader discovery network.
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

- Local commits plus draft preview only. A commit does not mean pushed, merged, or published to production. Production was verified as the September 21 deployment `6ab18065c7ef3b035f3a4e90`, which still opens the postponed-event popup. The automatic-opening fix is ready in this work. Do not call it live until publication and fresh-browser verification.
- The Diplo Antarctica video (`QtKGMfeyPUE`) returned YouTube embed error 150. The poster therefore says **Watch on YouTube** and opens the official video. Do not claim in-page playback works. A user preference is pending: retain Antarctica with that link, or choose another Diplo set with verified embedding and matching artwork.
- The site-wide existing asset budget exceeds its 28 MB target. Do not describe this as release-ready performance. Newly reused homepage artwork totals about 404 KB.
- Prior uncommitted work was backed up at `/private/tmp/monolith-network-20261102T223808Z`. Preserve remaining unstaged sitemap timestamps and unused `client/src/pages/chasing-radio.css`.

## Next review / polish ideas

1. Review the homepage's event hierarchy: the postponed JOEZI × MASSUMA card is still prominent. Consider a compact ticket-holder update with new show discovery carrying more visual weight. Keep approved date/refund facts intact.
2. All six legacy episode covers now match the new artwork by recording URL, including `/sunsets-fm`. Their existing episode links remain; consider a later listening-flow pass.
3. Resolve the Diplo inline-video choice, then test the selected recording on the deployed domain and mobile. Respect publisher playback restrictions.
4. Confirm Brevo launch messaging/list ownership with the owner. The current audience is music releases; adding launch-specific segmentation would need an intentional form/list update.
5. Reduce the existing public asset footprint before publishing. Audit file references first; do not delete media or unrelated artwork blindly.
6. Add a focused mobile accessibility/performance pass for the gallery, signup handoff, and main navigation, followed by preview-deploy verification when publication is requested.

## Post-commit visual pass

Site implementation committed as `d5392ee`.

- **Mobile calendar:** At 390px, the introduction plus stacked search/filter controls occupy nearly the full first screen. Tighten that spacing or collapse secondary filters so the first show is visible sooner. Keep the date/status facts unchanged.
- **Homepage priority:** Preserve the ticket-holder information, but consider a compact update treatment for the postponed show and give discovery/new confirmed shows more space.
- **Consistent listening path:** The six legacy SUNSETS.FM doorway tiles still use the older outbound episode flow. Bring their covers and actions into line with the newly approved radio page in a separate, focused pass.

The remaining working-tree changes after the site commit are pre-existing sitemap timestamps and the unused `client/src/pages/chasing-radio.css`; neither was discarded. The mobile About screenshot was captured during its cinematic entrance and is not evidence of a permanent blank/contrast defect; verify after settling before proposing a change.

## Radio naming correction

Owner confirmed: on Monolith, the radio experience is **Chasing Sunsets Radio — powered by sunsets.fm**. Lead with that name in the radio hub, homepage radio slide, and navigation. SUNSETS.FM keeps its separate page and launch slide. This wording describes the radio platform credit while preserving Monolith as the parent project.


## Final radio layout clarification and save point

- Owner requested the existing radio structure with new covers and a branding polish. `/radio` retains its featured deck, archive filters, six episodes, listening sections, and FAQ. `/open-network` retains the new 121-recording experience and Rafael B2B Brunello feature. `/sunsets-fm` stays separate.
- Matched the six radio cover files to the source catalog by exact SoundCloud URL. Covers display without crop/overlays. Updated episode branding, homepage/navigation links, canonical metadata, route preload, sitemap route source, and legacy network redirects.
- Removed timed featured-episode switching so a listener's chosen recording remains selected. Player loading stays user initiated.
- Preserved the old standalone network HTML under `private/archive/open-network/`; public media stays in place. The native app now owns `/open-network`.
- TypeScript and 50 focused unit checks passed. Seventeen browser checks passed for routing, responsive layouts, archive filtering, player selection, homepage/signup, and manual-only event notice. Final queue layout received an additional responsive check.
- Earlier hosted preview `https://6ae9332d87eb0ed44a7d8133--monolithproject.netlify.app` is superseded: it still has the network at `/radio`. Do not publish it.
- Updated draft preview build log: `/private/tmp/monolith-radio-refresh-preview.log`; canonical Netlify site ID `33d2ce42-1a25-4b67-a318-bdce495f5f47`. Read its final deploy URL after successful completion. Production remains unchanged unless a later verification explicitly records publication.
- Prebuild sitemap backup: `/private/tmp/monolith-radio-refresh-before-build-20261102/sitemap.xml`. Restore pre-existing timestamps after the build while retaining the new `/open-network` entry. Do not include unrelated sitemap timestamp changes or unused `client/src/pages/chasing-radio.css` in the commit.

## Still pending

1. Publish the verified updated preview and confirm the live homepage no longer auto-opens the weather notice.
2. Resolve Diplo in-page playback: the selected Antarctica video blocks embedding, so its poster currently opens the official YouTube page.
3. Verify a real Brevo signup reaches the intended list and confirmation flow; no test subscriber or email has been sent.
4. Reduce the pre-existing public-asset performance budget overage; preserve media until references are audited.
5. Optional next polish: compact postponed-show card, tighter mobile calendar controls, consistent legacy listening actions, and broader accessibility/performance work.
