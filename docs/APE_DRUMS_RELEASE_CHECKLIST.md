# Ape Drums / July 31 / Release Checklist

Status: **sealed draft**. Do not release before the countersigned contract is confirmed.

## Endpoints

- Intended public endpoint: `https://monolithproject.com/apedrums`
- Local preview endpoint: `http://localhost:3001/sandbox/ape-drums`
- Production behavior while sealed: `/apedrums` resolves to the site 404 experience.
- The preview endpoint is development-only and cannot render in a production build.

## Traffic routing

- Posh SMS and Posh email: direct to the final Posh checkout URL.
- Public traffic from social, ads, and press: `/apedrums`, then direct to Posh from every ticket CTA.
- This campaign page contains no Laylo handoff.
- Existing site-wide Laylo rails are unchanged until a separate migration audits every active waitlist and redirect.

## Required release inputs

All required controls must resolve. If one is missing, the public route stays closed.

| Environment variable                    | Required value                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `VITE_APE_DRUMS_RELEASED`               | `true`                                                                                            |
| `VITE_APE_DRUMS_CONTRACT_COUNTERSIGNED` | `true`                                                                                            |
| `VITE_APE_DRUMS_TICKET_URL`             | `https://posh.vip/e/monolith-project-presents-ape-drums?u=erik&_t=mrzne6d7&os=ios&src=event_page` |
| `VITE_APE_DRUMS_DOORS`                  | Approved public doors line, such as `Doors 10:00 PM`                                              |
| `VITE_APE_DRUMS_HERO_IMAGE`             | Published `/images/...` path for approved July 31 art                                             |
| `VITE_APE_DRUMS_PROMO_IMAGE`            | Optional published `/images/...` path for the approved square cross-promo art                     |
| `VITE_APE_DRUMS_APPROVED_VIDEO_1_URL`   | Optional override for the owner-approved newest set                                               |
| `VITE_APE_DRUMS_APPROVED_VIDEO_2_URL`   | Optional override for the second owner-approved video                                             |
| `VITE_APE_DRUMS_APPROVED_VIDEO_3_URL`   | Optional override for the third owner-approved video                                              |
| `VITE_APE_DRUMS_APPROVED_VIDEO_4_URL`   | Optional override for the Major Lazer lineage video                                               |

The solo videos default to the owner-approved IDs `O94vKVHzamk`, `K_2PZkxuNLY`, and `bpG8KPCJ8EM`. The fourth defaults to the approved Major Lazer lineage video `Vyo-kk0wRw4`. All remain sealed from the production bundle until the compile-time release and contract flags are open.

Development preview reads the approved hero from `client/src/assets/private/ape-drums/ape-drums-july31-hero.png`. The approved production asset is published at `/images/events/ape-drums-july31-hero.png`; `VITE_APE_DRUMS_HERO_IMAGE` can override that path if the release art changes.

The square campaign art (`client/src/assets/private/ape-drums/ape-drums-july31-square.png` in development and `/images/events/ape-drums-july31-square.png` in production) powers the shared family cross-promo card that appears on sunsets.vip, untold.vip, and houseoffriends.vip the moment the release gate opens. `VITE_APE_DRUMS_PROMO_IMAGE` can override it. The card routes internally to `/apedrums` and disappears only when the next confirmed booking replaces the assignment in `client/src/content/familyPromo.ts`.

## Monday release sequence

1. Confirm the countersigned contract in writing.
2. Confirm the final artist spelling, event date, venue, age restriction, capacity, doors time, and Posh URL.
3. Confirm the approved hero art and mobile crop, publish its delivery asset, and set the final hero path.
4. Reconfirm the three solo videos and the Major Lazer lineage video.
5. Re-verify the supplied 58K Instagram and 3M monthly-listener audience snapshot.
6. Re-run the prohibited-language scan across the landing page, metadata, and campaign copy.
7. Add the environment variables above to the production site.
8. Build and verify that `/apedrums` renders and `/sandbox/ape-drums` does not.
9. Test all five ticket CTAs—header, hero, post-profile, post-video, and final details—on desktop and mobile. Each must open the same Posh checkout URL.
10. Confirm one PageView on load and one custom `OutboundTicketClick` plus internal ticket-intent event per CTA click. Confirm Posh alone fires AddToCart, InitiateCheckout, and Purchase after the handoff.
11. Publish the public social route only after the production URL passes the checks.

## Rollback

Set `VITE_APE_DRUMS_RELEASED=false` and redeploy. The public endpoint immediately returns to the 404 experience without removing the draft or its launch inputs.

## Content rules

- Treat **Friday, July 31, 2026 at Kashmir** as the locked event fact. Never identify the venue as Sound-Bar.
- Use “the biggest weekend of the Chicago summer” for seasonal context.
- Do not use festival-adjacency naming in the event name, metadata, artwork, captions, ads, or ticket copy.
- Use real ticket counts only. Never manufacture scarcity.
- Keep the post-event next-event line unassigned until the next confirmed booking is approved.
