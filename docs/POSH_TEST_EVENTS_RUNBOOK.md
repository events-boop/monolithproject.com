# Posh Purchase Proof — One-Page Runbook

**Date:** 2026-07-29 · **Gate for:** Aug 22 spend scaling · **Time budget:** ~2 hours, tonight
**Executes:** `docs/SUNSETS_MEASUREMENT_RELEASE_PLAN.md` → "Posh live Test Events proof" (pending since July 24)

Rule: run the whole thing even if a step is ambiguous. Imperfect evidence tonight beats a perfect plan tomorrow.

---

## Step 0 — Optimization-mode check (5 min, Ads Manager)

For each live ad set: **Ad set → Optimization & delivery → what does it optimize on?**

- [ ] **Purchase count (conversions, no value goal)** → price flag corrupts *reporting*. Hold is prudent.
- [ ] **Value / ROAS goal** → price flag corrupts *delivery*; Meta is steering toward cheap conversions now. Hold is urgent.

Record per ad set: name / optimization event / value optimization on-off.

## Step 1 — Open the actual recommendation (5 min, Events Manager)

Events Manager → dataset `1049241148606250` → the **"Send higher quality price data"** recommendation → open its detail.

- [ ] Screenshot it. Write down the **exact event + parameter** it names (Purchase? InitiateCheckout? `value`? `currency`?). Every later step targets this line.

## Step 2 — Controlled purchase (15–20 min)

Prep: Events Manager → dataset → **Test events** tab open · Meta Pixel Helper installed · Posh event page for the lowest-priced refundable ticket.

- [ ] Open the Posh event page → screenshot Test Events: `PageView`, `ViewContent`
- [ ] Add ticket → screenshot: `AddToCart` (correct ticket context)
- [ ] Begin checkout → screenshot: `InitiateCheckout` (fires *only now*, not at click)
- [ ] Complete purchase with a real card → screenshot: `Purchase`, **both browser and server copies, expanded**

## Step 3 — Pass/fail (the part everyone kept mixing up)

Dedup and reconciliation are **two different checks**. Grade them separately.

| Check | Pass condition | Result |
|---|---|---|
| Dedup | **Exactly one** Purchase counted; browser + server copies share `event_name` **and** `event_id` | ☐ |
| Value | `value` present on **both** copies, numeric, equals the real charge (not string, not 0) | ☐ |
| Currency | `currency: "USD"` on **both** copies | ☐ |
| Reconciliation | Posh order ID recorded; matches your order confirmation (does **not** need to equal `event_id`) | ☐ |
| $0 probe | If a free-RSVP path exists: does RSVP fire `Purchase` with `value: 0`? (Likely trigger of the price flag) | ☐ |

**Fail any → Posh support ticket tonight** with the Step 1 + Step 2 screenshots attached. Their payload, their fix.
**Pass all →** the flag is stale or $0-RSVP-driven; note which, and the revenue signal is trustworthy.

## Step 4 — Dataset recon (10 min, no toggling anything)

- [ ] **Settings → Integrations:** list every integration/app holding CAPI access to this dataset. This answers who sends `DropRSVP`, `CheckoutIntilize`, `page_view` — it cannot be answered from the repo.
- [ ] **Settings → Automatic Advanced Matching:** record current state. **Do not toggle** — consent review with counsel is still pending (measurement plan, post-Aug 22 section).
- [ ] Events Manager → each "Update recommended" event → write down the specific parameter requested.

## Step 5 — OutboundTicketClick reconciliation (5 min, your DB)

Meta shows **4** OutboundTicketClick events / 30 days, fired only from `ArtistShowLanding` + `SunsetsLinkBio` (code-verified). Get the true click volume:

```sql
-- Total ticket-handoff clicks, last 30 days (compare against Meta's 4)
SELECT count(*) AS posh_clicks_30d
FROM link_clicks
WHERE destination_url ILIKE '%posh.vip%'
  AND created_at >= now() - interval '30 days';

-- Per-surface breakdown: which pages drove the clicks Meta can't see
SELECT date_trunc('day', created_at)::date AS day,
       page_path, button_name, count(*) AS clicks
FROM link_clicks
WHERE destination_url ILIKE '%posh.vip%'
  AND created_at >= now() - interval '30 days'
GROUP BY 1, 2, 3
ORDER BY 1 DESC, 4 DESC;
```

- [ ] `posh_clicks_30d` ≫ 4 → **coverage gap confirmed**: fix = extend the `ArtistShowLanding` pattern (`onClick` fire + `target="_blank"`) to Tickets.tsx / Monolith.tsx / LakeLanding.tsx / HouseOfFriends.tsx (fix spec ready).
- [ ] `posh_clicks_30d` ≈ 4 → traffic bypasses landers entirely; ads land straight on Posh. Different problem: the landers aren't in the paid journey.

## Gate

Scale Aug 22 spend **only after Step 3 passes all rows**. Until then: spend steady, no new campaigns, no taxonomy/dataset/API work. Post-show: consent review, `external_id`, Graph version bump, brand-correct Lead labels, holdout execution.

---

*Bring back: Step 0 list, Step 1 screenshot, Step 2 payload screenshots, Step 3 table, Step 4 integration list, Step 5 query output. That's the complete evidence pack.*
