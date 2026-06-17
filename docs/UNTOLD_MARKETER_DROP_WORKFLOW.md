# Untold Story Marketer Drop Swap Workflow

## Purpose

Make `untold.vip` the stable public front door for Untold Story.

The domain should stay in the address bar and render the Untold Story experience directly. Ads, story links, QR codes, and organic posts can keep pointing at:

```text
https://untold.vip
```

The app handles the routing behind the scenes:

- `untold.vip/` renders the Untold Story page.
- `untold.vip/go/waitlist/untold-story` sends traffic to the active Untold waitlist/drop destination.
- UTM, ref, and click identifiers remain attached when the server forwards the user.

## The 3-Step Drop Swap

1. Get the new destination link.

   Use the live Laylo drop, ManyChat flow, or other approved Untold capture destination.

2. Update the Netlify environment variable.

   In Netlify, open the `monolithproject` site, then go to Site configuration -> Environment variables.

3. Save and trigger a production deploy.

   Once the deploy is live, the Untold waitlist rail points to the new destination without changing public links.

## Live Variable Map

| Rail                       | Public path                 | Netlify variable                               |
| -------------------------- | --------------------------- | ---------------------------------------------- |
| Untold Story front door    | `/` on `untold.vip`         | App-rendered Untold Story page                 |
| Untold Story waitlist/drop | `/go/waitlist/untold-story` | `OUTBOUND_WAITLIST_UNTOLD_STORY_URL`           |
| General fallback waitlist  | `/go/waitlist/general`      | `OUTBOUND_WAITLIST_GENERAL_URL` or `LAYLO_URL` |

If `OUTBOUND_WAITLIST_UNTOLD_STORY_URL` is unset, the route falls back to the general waitlist destination.

## Attribution Guarantee

The outbound router preserves campaign parameters when it forwards a user to the active destination.

Preserved parameters include:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
ref
fbclid
gclid
ttclid
msclkid
session_id
event_slug
```

## Post-Swap Smoke Tests

Run these after saving the env var and completing the Netlify deploy.

```bash
curl -I "https://untold.vip/?utm_source=meta&utm_medium=cpc&utm_campaign=untold_drop&utm_content=front_door&ref=ig_bio&fbclid=test"
```

```bash
curl -I "https://untold.vip/go/waitlist/untold-story?utm_source=meta&utm_medium=cpc&utm_campaign=untold_drop&utm_content=waitlist&ref=ig_dm&fbclid=test"
```

Expected result:

- `https://untold.vip/` loads the Untold Story page, not the Monolith homepage.
- The browser URL remains on `untold.vip`.
- The waitlist route redirects to the active Untold destination.
- The final destination URL still contains the UTM/ref/click parameters.

## Operating Rule

Keep public Untold links stable. Swap the drop destination in Netlify, deploy, and smoke test before pushing the link into ads or ManyChat.
