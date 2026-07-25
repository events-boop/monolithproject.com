# Ape Drums Popup and 23K Audience Review

Date: July 24, 2026

Status: **measurement fix committed but not deployed; Ape Posh CAPI credential configured; Purchase proof pending; popup concept quarantined pending factual and rights approval**

## Executive read

The 23,000-person pool is valuable, but its source, retention window, overlap, and recency must be known before budget is assigned. Build the audiences as separate definitions, but do not automatically turn every definition into a separate ad set. With a capped budget and a seven-day sales window, excessive ad-set fragmentation can starve delivery and learning.

The likely starting structure for July 31 is:

- Purchasers: suppression audience and future seed; not a general acquisition ad set.
- Highest-intent warm audience: recent site visitors, ticket clickers, checkout starters, and meaningful video viewers, excluding purchasers.
- Remaining warm audience: broader recent engagers, excluding both purchasers and the high-intent audience.
- Light-touch viewers: held out initially; activate only if high-intent delivery saturates and verified downstream economics support expansion.

The exact split depends on what the 23,000 represents. A 365-day Instagram-engager pool, a 30-day site-visitor pool, and a 50%-video-viewer pool are not interchangeable.

## Corrections to the proposed media plan

1. July 31, 2026 is **Friday**, not Thursday. Do not ship `this Thursday` creative.
2. Do not assume four warm ad sets are superior to one broad warm ad set. Meta's current guidance favors consolidating similar ad sets because fragmentation gives each ad set fewer opportunities to learn.
3. Create high/mid/light audiences for analysis and exclusions, then start July 31 with no more than two warm delivery ad sets unless spend and conversion volume support more.
4. Do not claim a purchaser or engager lookalike will beat interest targeting `9 times out of 10`. Test it. Seed quality, match rate, geography, and conversion volume determine the result.
5. Confirm whether August 22 is being sold as `SUN(SETS) II`, `House of Friends`, or a documented combination. The campaign must not switch identities between the ad and landing page.
6. Treat the reported 1,000 InitiateCheckout events as **1,000 event fires**, not automatically 1,000 unique people. Verify event source URL, browser/server split, event IDs, and repeat-click behavior in Events Manager.

Meta references:

- Simplified ad-set structure: https://www.facebook.com/business/ads/ad-set-structure
- Performance marketing and learning: https://www.facebook.com/business/ads/performance-marketing
- Custom and lookalike audiences: https://www.facebook.com/help/157306091096340
- Conversions API: https://www.facebook.com/business/help/AboutConversionsAPI

## Measurement state at review time

- Commit `4d8d233` replaces Monolith-side outbound `InitiateCheckout` calls with custom `OutboundTicketClick` and adds a production-build regression guard.
- The fix is **not live** until the canonical site is deployed. Historical false InitiateCheckout data remains historical and must be separated using the deployment timestamp.
- Monolith's CAPI implementation sends Lead only. It does not send Purchase.
- Posh is the intended owner of AddToCart, InitiateCheckout, and Purchase, with browser/server events deduplicated by shared event ID.
- Before the July 24 Posh configuration update, public browser inspection found Posh's platform tags (`151398092578382` and `G-DZ7K8XBXS7`) and did not find Monolith's dataset `1049241148606250` or GA4 stream `G-DE8Z8VS263` in the Ape page.
- Before a new credential was generated, Meta described the dataset's Conversions API connection as `Active` with `Last received 6 hours ago`. That proves some server connection activity, not that Purchase was healthy or that the activity belonged to Ape Drums.

## July 24 Posh configuration update

Configuration completed at approximately **2026-07-24 22:19 CDT**:

- The Ape Drums event's Posh Marketing settings already contained Meta dataset/pixel `1049241148606250` and GA4 measurement ID `G-DE8Z8VS263`; its CAPI access-token field was empty.
- A new direct-integration Meta CAPI token was generated without the optional Dataset Quality API permission and transferred directly from the authenticated Meta UI to the authenticated Posh UI. The credential was not printed, copied into chat, written to disk, or committed.
- Posh displayed `Access token saved`. Navigating away and back confirmed that the token persisted.
- A fresh load of the public Ape Drums Posh page then contained both Monolith identifiers, in addition to Posh's platform identifiers.
- No purchase or test order was placed. This update proves configuration and browser-tag presence; it does **not** yet prove that Posh sends a correctly valued, deduplicated server-side Purchase to this dataset.
- The local Monolith event rename remains undeployed and therefore cannot explain a live Events Manager change. Any event observed immediately after this configuration should be attributed and inspected by connection method before drawing conclusions.
- A canonical-code search found none of the reported legacy event names `PurchaseInitiated`, `CheckoutIntilize`, or `CheckoutPaymentFilled`. If those events appear in Meta, they are emitted by Posh, another integration, or an older deployed asset—not the current canonical source tree.

## Misplaced popup work

The following uncommitted files were found in the Fairgrounds repository, not the canonical Monolith checkout:

- `/Users/starkindustries/Documents/GitHub/Fairgrounds-dev/public/images/lola-popup-ape-drums.jpg`
- `/Users/starkindustries/Documents/GitHub/Fairgrounds-dev/src/components/LolaPopupFrame.tsx`
- `/Users/starkindustries/Documents/GitHub/Fairgrounds-dev/src/pages/sunsets.tsx`
- `/Users/starkindustries/Documents/GitHub/Fairgrounds-dev/src/pages/untold-story.tsx`
- `/Users/starkindustries/Documents/GitHub/Fairgrounds-dev/src/components/MonolithSeoLanding.tsx`

Repository policy prohibits building, testing, or committing Monolith public-site work from that checkout. The files were reviewed read-only and left untouched.

## Popup review findings

The optional `afterHero` slot is structurally reasonable, and the responsive two-column frame is a workable visual concept. It is not ready to port as written:

1. `LolaPopupFrame` renders unconditionally and bypasses the Ape Drums contract/release gate.
2. The public headline `The Lola Pop-Up Weekend` is not part of the currently approved canonical fact set. The confirmed venue is Kashmir, and the flyer itself says West Loop rather than Lola.
3. `Weekend` implies more than the single Friday event currently described.
4. The flyer includes Bacardí, Patrón, and Kashmir marks. Confirm sponsorship, logo-use rights, ordering, and required legal language before publishing those marks across multiple properties.
5. The large frame has no ticket CTA or tracked internal route, despite occupying a prime conversion position.
6. The canonical site already contains a release-gated Ape Drums family promo on `/sunsets`, `untold.vip`, and House of Friends. A larger frame should replace or intentionally complement it, not create an unmeasured duplicate.
7. Any canonical implementation should use the responsive image pipeline, route to `/apedrums` with placement attribution, emit `OutboundTicketClick` only on the Posh handoff, and remain absent from production bundles until the release and contract flags are open.

## Canonical popup preparation

The visual frame was subsequently prepared in the canonical checkout with the following safeguards:

- It returns nothing while the shared Ape Drums family promotion is release-gated.
- Its CTA routes internally to `/apedrums`; only the later Posh handoff owns `OutboundTicketClick`.
- It replaces the compact family card on the SUN(SETS) and Untold pages instead of creating duplicate Ape Drums promos. House of Friends retains the compact family card.
- It uses the existing optimized responsive artwork and has direct component coverage.
- The `Lola Pop-Up Weekend` public name and the marks shown in the flyer remain human approval items before the production release flags are opened.

## Required decisions before porting the popup

- Confirm `Lola Pop-Up Weekend` is approved public naming, or replace it with the locked Ape Drums/Kashmir language.
- Confirm the sponsor marks are cleared for website use.
- Choose whether the frame appears on `/sunsets`, `/story`, `untold.vip`, or only selected campaign properties.
- Choose whether it replaces the existing family card.
- Confirm the artist contract countersignature and authorize the production Netlify upload.

## Next measurement proof

1. Deploy the committed outbound-event fix and record the exact timestamp.
2. Treat the Ape Posh credential and browser-tag installation as configured; do not rotate the token unless it is exposed or rejected.
3. Using a legitimate zero-dollar test path or the first real order, prove PageView, AddToCart, real InitiateCheckout, and one deduplicated Purchase in Meta Test Events/Overview. Confirm value, currency, event ID, browser/server connection method, and Event Match Quality.
4. Break down the historical 1,000 InitiateCheckout fires by event source URL and browser/server connection method.
5. Report pre-deploy and post-deploy periods separately; do not reinterpret the historical fires as real checkout starts.
6. Identify the 23,000 pool by source, event, retention window, and overlap before launching or building lookalikes.
