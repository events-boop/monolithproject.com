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

| Environment variable                    | Required value                                       |
| --------------------------------------- | ---------------------------------------------------- |
| `VITE_APE_DRUMS_RELEASED`               | `true`                                               |
| `VITE_APE_DRUMS_CONTRACT_COUNTERSIGNED` | `true`                                               |
| `VITE_APE_DRUMS_TICKET_URL`             | Final `https://posh.vip/...` checkout URL            |
| `VITE_APE_DRUMS_DOORS`                  | Approved public doors line, such as `Doors 10:00 PM` |
| `VITE_APE_DRUMS_HERO_IMAGE`             | Approved `/images/...` path or HTTPS image URL       |
| `VITE_APE_DRUMS_APPROVED_VIDEO_1_URL`   | Optional override for the owner-approved newest set  |
| `VITE_APE_DRUMS_APPROVED_VIDEO_2_URL`   | One additional approved official YouTube URL         |
| `VITE_APE_DRUMS_APPROVED_VIDEO_3_URL`   | Optional third approved official YouTube URL         |

The first video defaults to the owner-approved set `O94vKVHzamk`. The route still requires one additional approved video before release.

## Monday release sequence

1. Confirm the countersigned contract in writing.
2. Confirm the final artist spelling, event date, venue, age restriction, capacity, doors time, and Posh URL.
3. Confirm the approved hero press image and mobile crop.
4. Confirm the supplied newest set and at least one additional official artist-channel YouTube link.
5. Re-verify the supplied 58K Instagram and 3M monthly-listener audience snapshot.
6. Re-run the prohibited-language scan across the landing page, metadata, and campaign copy.
7. Add the environment variables above to the production site.
8. Build and verify that `/apedrums` renders and `/sandbox/ape-drums` does not.
9. Test the hero, sticky-header, and bottom ticket CTAs on desktop and mobile. Each must open the same Posh checkout URL.
10. Confirm one PageView on load and one InitiateCheckout plus internal ticket-intent event per CTA click.
11. Publish the public social route only after the production URL passes the checks.

## Rollback

Set `VITE_APE_DRUMS_RELEASED=false` and redeploy. The public endpoint immediately returns to the 404 experience without removing the draft or its launch inputs.

## Content rules

- Use “the biggest weekend of the Chicago summer” for seasonal context.
- Do not use festival-adjacency naming in the event name, metadata, artwork, captions, ads, or ticket copy.
- Use real ticket counts only. Never manufacture scarcity.
- Keep the post-event next-event line unassigned until the next confirmed booking is approved.
