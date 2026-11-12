# LOGIC & DESIGN PASS — First Access 2027 intake + status badge

**Record:** `~/Downloads/monolith-project website` · branch `fix/pr0-chunk-recovery-hotfix`
**Date:** 2026-11-12 · **Reviewer:** Hermes (DeepSeek)
**Scope:** the 14 dirty files, exercised in a real browser — not read off the source.

## 0. METHOD & COVERAGE

Server: `npm run dev` → Vite `http://localhost:3001`, API `:5001`, `DATABASE_URL` unset, so the
intake correctly reports itself unavailable and the design preview (`?intake_preview=1`) is the
only way into the flow. That is the same path the owner uses.

Walked, at 1440×900 and 390×844:
`/newsletter?intake_preview=1` step 0 → 1 → 2, validation failure, consent guard, submit failure;
`/schedule` and `/` for the badge swap. Measured live geometry and computed styles rather than
eyeballing screenshots. Screenshots were inspected at each step.

Gates were already run and are green (see `docs/reviews/DEEP-REVIEW-20261112.md` §0). This pass
looks only at what a green suite cannot see: behaviour under a real pointer, and how it looks.

---

## 1. VERDICT

The flow is coherent and the design is strong — the split card, the italic emphasis, the step
rail and the receipt summary all hold up in a browser. What does not hold up is the seam between
the new intake and the rest of the site: **a completed signup fires no conversion event**, the
availability check can hang forever, and the site's consent banner covers 44% of the primary
button at desktop width. None of these are visible in code review; all three are visible in five
minutes of use.

Fix order: L-01 (attribution), L-02 (a stuck first step), D-01 (the covered CTA).

---

## 2. LOGIC FINDINGS

### L-01 · A completed signup fires no Meta Lead · **High**
`client/src/components/MetaPixelGate.tsx:113-122` decides a form is the First Access form from the
submit button's text: it must contain `"first access"`, `"register"` or `"lake list"`, or the form
must sit inside `#lake-list` / `[data-form="lake-list"]`. The new form's submit button reads
**"Count me in"** (`FirstAccessIntake.tsx:631`), and the `<form>` carries no id or data attribute
(`:311-316`). No listener fires. `FirstAccessIntake` imports no analytics of its own.
Repro: complete the flow, watch `window.fbq` — nothing.
Harm: the page exists to generate a lead, and the lead is invisible to the pixel. Every signup
from this form is uncounted against the campaign that paid for it.
Fix: do **not** add "First Access" to the button — the same `submit` event fires on the
intermediate steps, so a text match would fire a lead for clicking *Continue* on step 1. Fire
`trackMetaPixelLead` explicitly after the 200 with `state: "subscribed"` (`FirstAccessIntake.tsx:157-165`).

### L-02 · The availability check can hang with no way out · **High**
`FirstAccessIntake.tsx:68-77` fetches `/api/first-access` with an `AbortController` that is only
aborted on unmount — there is no timeout. While `availability === "checking"` the UI renders
`"Getting your invitation ready…"` (`:295-299`) and **no** fallback link; the hosted form only
appears once the promise settles as `hosted` (`:300-305`).
Repro: throttle the dev server or block `/api/first-access`; the first screen sits on the spinner
indefinitely.
Harm: a cold lambda, a proxy stall or a dropped connection converts every visitor into a spinner
with no signup path. This is the failure mode most likely to be hit on launch day.
Fix: `AbortSignal.any([controller.signal, AbortSignal.timeout(4000)])`, and render the hosted link
alongside the spinner after ~1.5s.

### L-03 · Final-step errors do not move focus · **Medium**
`next()` focuses the first invalid control via `[aria-invalid=true]` (`:105-110`). `submit()`'s
consent/adult branch (`:121-126`) returns without moving focus — verified: after failing the last
step, `document.activeElement` is the submit button while both errors are rendered below the fold.
Harm: a keyboard or screen-reader user presses "Count me in", hears nothing change, and has no
pointer to the two unticked boxes above. The error text is `role="alert"` so it is announced, but
focus never lands where the fix is.
Fix: reuse the same `requestAnimationFrame` focus block in `submit()`.

### L-04 · GET can say ready, POST can still refuse · **Medium**
`firstAccessAvailable()` is evaluated on the GET (`routes/first-access.ts:10-23`) and again inside
`submitFirstAccess` (`services/first-access.ts:68`), and it includes a live Brevo list check whose
result is cached for 60 s (`providers/brevo.ts:78-108`). A visitor who starts the form on a cached
`ready` can be refused three steps later if the cache expired and the provider is unhappy.
Harm: the worst possible moment for a 503 — after the visitor has typed everything — and the
copy then pushes them to the hosted form, so the data is lost rather than queued.
Fix: same as DEEP-REVIEW F-05 — save first, mark `pending`, and never re-gate at submit.

### L-05 · The idempotency key is reused for retries · **Medium**
`FirstAccessIntake.tsx:142-144`: the key is regenerated only when the payload changes, so pressing
"Count me in" again after a 502 sends the *same* key. `leads.ts:125-129` replays a cached response
for a known key and sets `X-Idempotent-Replay`. The moment the server starts honouring the header
(F-03), a genuine retry will replay the cached failure instead of retrying.
Harm: latent today (the header is ignored), a trap the day someone wires it up.
Fix: mint a new key per explicit user-initiated retry, and keep the reuse for automatic retries.

### L-06 · 8 signups per 15 minutes, per instance · **Medium**
`routes/first-access.ts:26-32`. Eight is low for a launch — a shared connection (office, venue
wifi, a family on one NAT) locks out real people, and the message says "wait 15 minutes" without
saying how long is actually left.
Fix: raise it, key it on email as well as IP, and return `Retry-After`.

### L-07 · Browser Back leaves the flow · **Low**
Step state is component-local (`useState(0)`, `:52`); nothing is pushed to history. Pressing Back
on step 2 exits `/newsletter` instead of returning to step 1.
Fix: `history.pushState` per step, or accept it and make the in-form Back button the obvious path.

### L-08 · Success is terminal · **Low**
`success` (`:252-282`) replaces the form. Refresh returns to step 0 with empty fields; there is no
"add someone else", no "what happens next", and no privacy link on the success screen.
Fix: one line — "We'll email `x` when dates drop" — plus a link.

---

## 3. DESIGN FINDINGS

### D-01 · The consent banner covers 44% of the primary CTA · **High**
Measured at 1440×900: banner `position: fixed`, `bottom-4 right-4`, `z-9999`, **320×134 at
(1104, 750)**; primary button **490×54 at (828, 808)**. Intersection 214×54 px = **44% of the
button**, including the right-hand arrow. The error panel that appears after a failed submit sits
under it too, so the recovery links are partly hidden at the exact moment they are needed.
Repro: any step, desktop width, banner not yet dismissed.
Fix: reserve bottom space while the banner is present (`padding-bottom: 150px` on the intake main,
or offset the form actions), or make the banner dismiss into a corner chip.

### D-02 · On mobile the proposition disappears · **High**
At 390×844 the storytelling panel is 209 px tall and contains only the wordmark, the
`FIRST ACCESS / 2027` eyebrow and *"You're invited."* — the two headline lines and the subcopy are
computed `display: none` (`.access-desktop-line` ×2 and `.access-story-copy p`).
Harm: the one screen that has to sell 2027 carries a three-word fragment on the device most
people will see it on. The desktop layout argues; the mobile layout labels.
Fix: keep one line at mobile (stack "Good music. Your people." above the italic) or replace with a
purpose-written short line, and keep the subcopy.

### D-03 · The marketing panel drifts while you type · **Medium**
Measured headline top: **472 → 447 → 445** across steps 0→1→2, because the panel is centred against
a card whose height changes (794 → 743 → 740). A 27 px jump between screens reads as a rendering
glitch in peripheral vision.
Fix: `align-items: start` on the layout with a fixed top offset, or pin the story block with
`position: sticky; top:` so it does not re-centre per step.

### D-04 · 9 px type, three pixels under the house floor · **Medium**
`.access-form-kicker` is 9 px/600 and `.access-privacy` is 9 px/400 — computed live in the browser
(`getComputedStyle`, step 2 of the preview).
The repo set an 11 px floor in `8113870` ("style: polish pass — 11px text floor"). Contrast is
**not** the problem — 5.2:1 and 4.78:1 on `#f2efe6`, both above AA — the size is.
Fix: 11 px on both, matching the rest of the site.

### D-05 · Two checkbox idioms in one flow · **Medium**
The world selector uses a custom card with a drawn check (`.access-choice-check`); the consent step
falls back to **native** checkboxes flush against the text (`:525-562`). The legally load-bearing
controls are the ones that look least designed, and they sit right above the CTA.
Fix: reuse the card treatment at a smaller size, or style the native box to match.

### D-06 · The step rail hides under the fixed header after advancing · **Low**
On mobile, `next()` scrolls the new `<h2>` to the top (`:79-84`); measured heading top after
Continue = **128 px**, which leaves the progress rail (above the heading) behind the fixed nav.
Fix: scroll to the form shell top minus header height, not to the heading.

### D-07 · Placeholder truncates at mobile · **Low**
"Chicago, or wherever you call home" clips to "…call hom" at 390 px.
Fix: shorten to "Chicago, or wherever".

### D-08 · The flagship badge state is the default colour · **Low**
On `/` and `/schedule` the badge renders at **10 px**: `postponed` in amber `rgb(255,211,151)`,
`first-access` in the fallback blue `rgb(179,223,245)` — the same blue as an unconfigured status,
because `event-status-badge.css` defines no `[data-status="first-access"]` rule.
Fix: give the 2027 state its own colour, and lift the badge to 11 px to match D-04.

---

## 4. WHAT HOLDS UP

- The split-card composition and the sans-headline / italic-serif-emphasis pairing are strong at
  desktop and clearly deliberate.
- The step rail's underline-progress reads correctly at a glance, and each step's kicker
  ("FIND YOUR FREQUENCY" / "MAKE IT PERSONAL" / "ONE LAST THING") does real work.
- The receipt summary (name, email, city, selected worlds as tags) is the right shape for a
  three-step form: the user can see exactly what they are about to send.
- The failure panel offers two recovery routes (secure signup, email the team) and does not lose
  the typed data. That is better than most forms ship.
- The badge swap itself is a genuine improvement: one vocabulary, one component, and the
  postponed amber survives the swap (verified live: `rgb(255,211,151)`).

---

## 5. FIX LIST (value per hour)

1. Fire the Meta Lead on `state: "subscribed"` — one call in the success path. **L-01**
2. Add a 4 s timeout plus an immediate hosted-form fallback. **L-02**
3. Reserve space for the consent banner. **D-01**
4. Reuse the focus block in `submit()`. **L-03**
5. Save before re-gating availability. **L-04** / DEEP-REVIEW F-05
6. Restore one headline line + subcopy at mobile. **D-02**
7. Pin the story panel against card-height changes. **D-03**
8. 9 px → 11 px on kicker and privacy. **D-04**
9. Style the consent checkboxes to match the world cards. **D-05**
10. Mint a new idempotency key on explicit retry. **L-05**

---

*Every measurement above was taken in the running app at the stated viewport; every code claim
cites `path:line`.*
