# Monolith local polish and House 84 photo lookup

November 17, 2026. Historical local-work notes below. The approved changes were
subsequently published and checkpointed; see
[PRODUCTION_RELEASE_20261117.md](PRODUCTION_RELEASE_20261117.md) for current status.

## Priority 1: CAPI token

The production CAPI token for the primary Meta pixel ending in **6250** remains
unresolved. This design/photo pass did not change provider credentials or activate
tracking. See `PRODUCTION_RELEASE_20261116.md` for the preceding release record.

## Design refinements completed

- Preserved the existing artist index and editorial artist profile components;
  neither page was changed in this pass.
- Preserved Fable's glyph dividers and warm thank-you background.
- Fixed the footer engineering credit's narrow-phone clipping, wrapping,
  inherited spacing, and text contrast.
- Used the existing resolved standalone-page boundary to exclude the edge seam
  from all three campaign bios, including hostname roots and trailing slashes.
- Kept the scroll-lit glyphs while replacing 15 continuous animations with one
  gentle eight-second glow. Glyphs settle after their initial reveal.
- Detached scroll/resize work below 1280px, including when resizing from desktop
  to mobile; restored it when returning to desktop. Reduced motion removes the
  animation and glyph transitions.

## Verification

- TypeScript passed (`tsc --noEmit --incremental false`).
- Campaign routing and artist discovery tests: 8 passed in 2 files.
- Browser checks passed at 1440, 390, 360, and 320 pixels: credit contained in the
  viewport, no horizontal overflow, zero footer accessibility violations.
- Browser verified `/untold`, `/untold/`, `/sunsets-links`, and
  `/house-of-friends/links` without the seam. The three campaign hostnames were
  also tested using local-response interception; this is local behavior evidence,
  not production verification.
- Confirmed zero seam scroll updates on mobile, correct desktop/mobile resize
  cleanup, one settled desktop animation, and zero reduced-motion animations.
- Confirmed the editorial layout for all seven new profiles and Gene Farris.
- No browser page errors. `git diff --check` passed.
- Screenshots and report: `/private/tmp/monolith-fable-polish-20261117/`.

## Photo lookup: no verified matches yet

Searched for Sophia Georges, Amit Harris, Flare, Kaspian Brothers, Austin Ashtin,
Lexsan, and Deep State Disco, including spelling variants. No portrait has been
assigned or copied into the website because the search did not establish a match.

Read-only search locations included the mounted `/Volumes/House 84` photo,
artwork, event-document, Castaways DJ, download/archive, and relevant project
folders, plus `/Volumes/House84/SUNSETS_2026`. Checked the filenames inside 13
Monolith event ZIP archives without extraction. Searches excluded dependency
trees and avoided the recursive music-export archives.

The targeted Castaways collections contained 338 readable images with no
embedded descriptive labels. A broader scan read 809 images in `PHOTOS` and
`Artwork`; 50 carried descriptive metadata, but none matched the seven names.
These counts overlap and should not be added. Camera-numbered photographs may
contain the artists, but identities were not inferred from faces.

Useful collections for owner-assisted matching:

- `/Volumes/House 84/PHOTOS/Castaways 2026`
- `/Volumes/House 84/PHOTOS/HOUSE_84_Chasing_SunSets_S02EP002_Castaways_People`
- `/Volumes/House 84/04_Projects/Castaways DJs/DJs`

Search limitations: some archive entries were unreadable/missing, and all 107
image files in `PHOTOS/To Organize Soon` were confirmed zero bytes. No drive
repair, deletion, move, or source-photo modification was attempted. This lookup
does not establish that the portraits are absent from the entire drive.

The seven new artist records still have placeholder images, biography, origin,
and genre. Obtain a named source/EPK or owner-confirmed filename mapping before
replacing those fields. Their supplied event-history claims were not independently
validated in this pass. Preserve the existing 32 profiles and the current layout.

Unrelated email changes and the test-email script remain outside this work.

## Follow-up: temporary shadow boxes

At the owner's request, the seven pending portraits now use
`/images/artist-shadow-box.svg` instead of the repeated event photograph. The
static 1.4 KB asset provides a recessed dark frame and restrained auburn edge,
with no additional animation or image-generation dependency. Roster grid/list
and profile image alternative text identifies these as pending portraits. All
existing artist images and the editorial layout are preserved. This follow-up
is also local only, without a commit or deployment.

Follow-up verification passed: TypeScript, six existing artist-catalog tests,
formatting, and browser checks at 1440/390/360px. All seven shadow boxes loaded,
the roster still contains 39 artists, the desktop list works, and the existing
Gene Farris portrait still loads. No horizontal overflow or browser page errors.
Evidence: `/private/tmp/monolith-shadow-box-check-20261117/`.

## Follow-up: restored biography reveal

Restored the existing `WordScrubReveal` component on artist biographies. The
earlier layout pass had replaced it with a plain paragraph. The current type
size, spacing, biography copy, and pending-photo shadow boxes remain intact.
The shared component now also retains its target ref in reduced-motion mode,
where it displays plain text without the blur/translation effect.

Verified in local Chrome at 1440/390/360px: words progressively sharpen and
brighten while scrolling, all words finish at zero blur/full opacity, and
reduced-motion mode renders plain readable text. No horizontal overflow or
browser page errors; TypeScript and formatting passed. Evidence:
`/private/tmp/monolith-bio-effect-check-20261117/`. Local only; not deployed.
