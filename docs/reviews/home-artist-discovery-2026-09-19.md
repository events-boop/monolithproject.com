# Homepage artist discovery — September 19, 2026

Published three portrait-led cards for JOEZI, MASSUMA and Gene Farris, using existing artist assets and approved event data. Each includes a short introduction, artist profile, full set and appearance link. The two finale cards say Postponed and lead to the published event update. Gene Farris links to his past Sun(Sets) II appearance.

## Validation

- TypeScript and production build passed, including campaign pixel guard.
- Six focused browser checks passed: 360, 390, 430, 768 and 1363 px layouts, responsive portraits, event labels and internal destinations.
- All three listening URLs returned HTTP 200; media playback was not tested.
- Production verified at 390 and 1363 px: three cards, correct statuses/destinations, no horizontal overflow.
- Desktop/mobile screenshots: `/tmp/artists-live-1363.png`, `/tmp/artists-live-390.png`. Isolated section captures hide fixed navigation and status alert; viewport captures preserve them at `/tmp/artists-live-1363-viewport.png` and `/tmp/artists-live-390-viewport.png`.

Production deploy: https://6aaec4d05b7bbc959c221b77--monolithproject.netlify.app

Direct Netlify publication continues the existing deployment workflow. GitHub source synchronization remains pending; no unrelated work was staged or committed.
