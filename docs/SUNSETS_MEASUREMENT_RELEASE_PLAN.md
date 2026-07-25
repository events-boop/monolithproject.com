# SUN(SETS) Measurement Release Plan

Date: July 24, 2026

Status: **strategy approved; measurement architecture pending live Posh verification**

## Ship sequence

### Ape Drums / today

- Publish the Monolith event page after the existing contract release gate is factually confirmed.
- Use Meta dataset `1049241148606250` and GA4 stream `G-DE8Z8VS263` in Posh's event-level Marketing settings.
- Generate and paste the Meta CAPI token directly inside Meta/Posh. Never place it in chat, source control, or a client-side environment variable.
- Run the live Posh Test Events proof below before spend.

### Before SUN(SETS) II / August 22

1. Monolith emits custom `OutboundTicketClick` for a Posh handoff. It does not emit `InitiateCheckout` for a link click.
2. Posh is the only owner of AddToCart, InitiateCheckout, and Purchase. Monolith's webhook stores orders for first-party reporting and does not send Purchase to Meta.
3. Reconcile by show and date using `/api/ops/sunsets-analytics?event_slug=<slug>&date_from=YYYY-MM-DD&date_to=YYYY-MM-DD`.
4. Use `ticketQuantity`, `refundedOrders`, `refundCents`, and net revenue for scaling decisions. `orders`/`purchases` remain order counts for backward compatibility.
5. Read the endpoint's `channels` split before judging paid performance. Paid, owned, earned, direct, and unknown traffic are classified from both UTM source and medium; paid medium takes precedence over source.
6. Establish the owned-audience holdout below before retargeting owned contacts.

### Post-August 22

- Align remaining GA4 custom names to the final ecommerce taxonomy.
- Automate the Posh export/webhook reconciliation and transaction-level join.
- Review consent architecture with counsel; treat the decision as a documented compliance workstream, not an implied analytics conclusion.

## Posh live Test Events proof

Use a test order or the lowest-risk refundable ticket path. Capture screenshots and timestamps for all four steps.

| Action                             | Expected Meta event | Owner                    | Pass condition                                                         |
| ---------------------------------- | ------------------- | ------------------------ | ---------------------------------------------------------------------- |
| Open the public Posh event page    | PageView            | Posh                     | One browser event in dataset `1049241148606250`                        |
| Select a ticket/add it to the cart | AddToCart           | Posh                     | One event with the correct event/ticket context                        |
| Enter the real checkout flow       | InitiateCheckout    | Posh                     | One event only after checkout actually begins                          |
| Complete the test order            | Purchase            | Posh browser + Posh CAPI | One deduplicated purchase with transaction ID, value, and USD currency |

Fail the proof if Monolith's outbound click appears as InitiateCheckout, if Purchase is duplicated, if the wrong dataset receives an event, or if value/currency/transaction ID are missing. Preserve the test order ID so it can be removed from performance reporting.

## Owned-audience incrementality holdout

A website-side random split is not a valid retargeting holdout because the person may already have received the ad. Split the owned audience before it enters Meta:

1. Create a stable random assignment for eligible Laylo/SMS/email contacts: 90% `retargeting_eligible`, 10% `paid_holdout`. Keep the assignment fixed through the event.
2. Upload or sync only `retargeting_eligible` to the paid retargeting audience. Explicitly exclude `paid_holdout` from every campaign and ad set for the show.
3. Send the same owned-channel messages and offers to both groups. The only designed difference is paid retargeting exposure.
4. Join Posh orders back to both groups using normalized first-party identifiers in the controlled reconciliation environment.
5. Compare buyer rate, ticket quantity per eligible contact, and net revenue per eligible contact. Report the lift and the raw denominators; do not substitute Meta last-click ROAS for incrementality.

If the owned list is too small for a useful randomized split, use a documented geographic or time-based holdout and keep the same exclusion rule. Never call a visitor-level post-click split a retargeting holdout.

## UTM rules

- Paid Meta: `utm_source=instagram|facebook`, `utm_medium=paid_social`
- Laylo/SMS: `utm_source=laylo`, `utm_medium=sms`
- Email: `utm_source=email`, `utm_medium=email`
- Monolith landing CTA: `utm_source=monolith_site`, `utm_medium=landing_cta`
- Organic social: platform source with `utm_medium=organic_social` or `organic_dm`
- Partners/listings: partner source with `utm_medium=referral` or `event_listing`

Do not use `social` for paid traffic. That collapses paid and owned/earned social into one bucket and defeats the reporting split.
