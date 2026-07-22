# ClickUp Operating System — Phase 1 Blueprint

**The Monolith Project · Operational Command Center**
Status: Phase 1 (Blueprint). Workspace audit **pending ClickUp API access** — see §14.
Google Drive remains the permanent file repository; QuickBooks remains the accounting
system of record. ClickUp is the operational HQ only.

---

## 1. Proposed Workspace Architecture

One Workspace. Seven Spaces. Events live in Folders (one per event) created from the
Master Event Template.

```
MONOLITH HQ (Workspace)
│
├── 00 · EXECUTIVE COMMAND            (Space — restricted: owner + exec)
│   ├── Priorities & Initiatives      (List)
│   ├── Decisions Log                 (List)
│   ├── Weekly Operating Review       (List, recurring)
│   ├── Risks & Blockers              (List — auto-fed by automation)
│   └── Key Contacts                  (List — restricted fields)
│
├── 01 · EVENTS                       (Space)
│   ├── _MASTER EVENT TEMPLATE        (Folder template — §5)
│   ├── SUN(SETS) — House of Friends Preview — 2026-08-22   (Folder)
│   ├── SUN(SETS) — Joezi x Massuma (UK) — 2026-09-19            (Folder)
│   ├── MONOLITH — SPECIAL GUEST — 2026-08-01 [Date tentative]  (Folder)
│   └── Event Portfolio               (List — one task per event, drives
│                                      portfolio views + exec dashboard)
│
├── 02 · TALENT                       (Space — restricted: exec + talent buyer)
│   ├── Artist Database               (List — one task per artist, CRM fields)
│   └── Booking Pipeline              (List — one task per artist-per-event offer;
│                                      statuses = §3.2)
│
├── 03 · MARKETING & CONTENT          (Space)
│   ├── Campaigns                     (List — one task per campaign)
│   ├── Content Calendar              (List — one task per content piece;
│                                      statuses = §3.3; calendar view default)
│   └── Channel Library               (Doc — handles, links, specs per platform)
│
├── 04 · PARTNERSHIPS                 (Space — restricted: exec + sales owner)
│   └── Sponsor Pipeline              (List — statuses = §3.4)
│
├── 05 · FINANCE                      (Space — restricted: owner + finance)
│   ├── Payments & Invoices           (List — one task per payable/receivable)
│   ├── Event Budgets                 (List — one task per event, rollup fields)
│   └── Settlements                   (List — one per event)
│
└── 06 · KNOWLEDGE                    (Space — org-wide read)
    └── Docs hub (§9): playbooks, SOPs, venue DB, vendor DB, post-event reports
```

**Why Folders-per-event instead of Lists-per-event:** each event needs ~8 internal
lists (talent, production, marketing, ticketing, budget…). A Folder groups them,
duplicates cleanly from a Folder template, and keeps cross-event views possible at
the Space level.

**Duplicate-structure watchlist (to reconcile during audit):** any existing event
lists, artist trackers, or content calendars found in the current workspace get
mapped into this structure or explicitly retired — nothing deleted without approval.

---

## 2. Event Lifecycle (16 phases)

`Concept → Feasibility → Date/Venue Hold → Talent Development → Contracting →
Internal Confirmation → Campaign Prep → Public Announcement → On Sale →
Active Production → Final Advance → Event Week → Event Day → Settlement →
Post-Event Review → Archived`

Lives as the status set on the **Event Portfolio** list (one task per event).
Phase changes drive automations (§6).

---

## 3. Status Dictionary

### 3.1 Standard task statuses (all work lists)
`Open → In Progress → Blocked → In Review → Approved → Done` (+ `Cancelled`)

### 3.2 Booking Pipeline statuses
`Target → Researching → Availability Requested → Available → Offer Preparing →
Offer Submitted → Negotiating → Verbal Agreement → Contract Pending →
Contract Received → Deposit Required → Confirmed (Private) →
Cleared for Announcement → Announced → Completed` (+ `Declined / Unavailable / On Hold`)

**Hard rule (enforced by automation + checklist):** an artist cannot enter
*Cleared for Announcement* until three checkbox fields are ALL true:
`Contract Executed`, `Deposit Paid (or waived in writing)`, `Announcement Approved`.
The automation posts the blocker if any is missing.

### 3.3 Content statuses
`Idea → Brief Needed → Brief Ready → In Production → Internal Review →
Artist Review → Revision Requested → Approved → Scheduled → Published →
Repurpose → Complete`

### 3.4 Sponsor Pipeline statuses
`Target → Contact Research → Outreach Preparing → Contacted → Meeting Scheduled →
Proposal Requested → Proposal Sent → Negotiating → Verbal Agreement →
Contract Pending → Confirmed → Activation In Progress → Fulfilled → Renewal`
(+ `Declined`)

### 3.5 Payment statuses (field, not list status)
`Not Due → Scheduled → Approval Needed → Approved → Paid → Overdue → Disputed`

---

## 4. Field Dictionary (canonical — no synonyms)

| Field | Type | Applies to | Notes |
|---|---|---|---|
| Brand | Dropdown | everywhere | Monolith / SUN(SETS) / Untold Story / House of Friends / Kashmir Residency |
| Event | Relationship → Event Portfolio | everywhere | single link field; never a free-text "event name" |
| Department | Dropdown | everywhere | Talent / Production / Marketing / Ticketing / Partnerships / Finance / Ops |
| Event Date | Date | portfolio, events | the show date; distinct from Due Date |
| External Deadline | Date | any | venue/agent/vendor-imposed dates |
| Approval Required | Checkbox | any | pairs with Approval Owner (people field) |
| Budget / Actual Cost / Revenue | Currency | finance, events | three fields only — variance is a Formula field, not a fourth entry field |
| Artist | Relationship → Artist Database | talent, marketing | |
| Venue / Vendor | Dropdown (managed) | production, finance | fed from Knowledge DB docs |
| Contract Status | Dropdown | talent, sponsors, venues | Not Started / Drafting / Sent / Redlines / Executed |
| Payment Status | Dropdown | finance, talent | §3.5 values |
| Doc Link | URL | any | Google Drive link — files stay in Drive |
| Risk Level | Dropdown | any | Low / Medium / High / Critical |
| Public/Internal | Dropdown | marketing, talent | guards announcement leaks |
| Next Action + Follow-up Date | Text + Date | CRM lists | the two fields that keep pipelines moving |

Talent-only: Agency, Agent, Manager, Contact Info (restricted), Genre, Home Market,
Offer Amount, Counter, Agreed Fee, Hospitality, Travel, Deposit Status, Balance
Status, Assets Received, Ticket Power (1–5), Strategic Fit (1–5).
Sponsor-only: Category, Package, Proposed Value, Cash Value, In-Kind Value,
Deliverables, Activation Requirements, Logo Received, Renewal Opportunity.
Ticketing-only: Capacity, Issued, Sold, Gross, Net, Avg Price, Comps, Sell-Through %,
Velocity (7-day), Paid Spend, CPP, CPL — updated by n8n sync (§7), not by hand.

---

## 5. Master Event Template (Folder template)

Lists inside every event Folder, each pre-loaded with task packages:

1. **Overview & Milestones** — event task (portfolio mirror), phase gates, run of show
2. **Talent** — lineup slots, booking links to Pipeline, hospitality, transportation
3. **Production & Venue** — stage/sound/light/laser/video/power, rentals, security,
   staffing, load-in → soundcheck → doors → curfew schedule, permits, insurance,
   weather contingency, emergency procedures, day-of contact sheet
4. **Marketing Campaign** — announcement timeline, flyer, socials, email/SMS, paid,
   influencers, partners, media, website/ticket-page updates
5. **Ticketing & Guest List** — tiers, promos, comps, guest list, VIP/tables,
   season-pass allocation; metrics fields synced from Posh
6. **Partnerships** — event-scoped sponsor deliverables + activations
7. **Budget & Payments** — budget lines, deposits, balances, settlement checklist
8. **Post-Event** — settlement, report, photos/video intake, lessons learned

Checklists scale by venue type: **Open-Air Lakefront** (Castaways profile: weather
plan mandatory, daylight curfew) vs **Club Room** (Kashmir/Hideaway profile:
sound-limit + curfew focus). Both ship as checklist templates.

Views per event Folder: List, Board (by status), Calendar, Timeline, Gantt
(dependencies on phase gates), Workload. Space-level: **Event Portfolio** view
(every event, phase, readiness, countdown).

---

## 6. Automation Inventory

**Native ClickUp** (safe, reversible):
1. Event Folder created from template → task package dates auto-offset from Event Date
2. Booking → *Offer Submitted* → create follow-up task due +3 days
3. Booking → *Contract Received* → spawn "Collect deposit invoice" + "Request press
   assets" tasks
4. Deposit Paid checkbox → recompute readiness; if contract+deposit+approval all
   true → notify Marketing: "Artist cleared for announcement" (notification only —
   humans announce)
5. Event Date −30/−14/−7/−3/−1 → generate countdown checklists
6. Content → *Approved* → create per-channel publish tasks (tasks, not posts)
7. Any task → *Blocked* → notify event owner + copy to Risks & Blockers list
8. Payment task due in 5 days & not Paid → notify finance + owner
9. Event phase → *Settlement* → create settlement package tasks
10. Settlement done → create Lessons Learned review task
11. Payment > threshold (default **$1,000 — Erik to confirm**) → status forced
    through *Approval Needed*, assigned to Approval Owner

**Never automated:** public posts, artist announcements, payments, emails/SMS to
the outside world, financial account changes. Automations end at human-facing tasks.

**n8n (spec — external data in/out):**
- **Posh → ClickUp**: nightly + on-webhook sales sync into Ticketing fields
  (the site already receives Posh webhooks; n8n can subscribe to the same source)
- **sunsets.vip / untold.vip / houseoffriends.vip → ClickUp**: daily lead counts from
  the site's Neon DB (leads, link clicks, funnel metrics already captured)
- **Meta Ads → ClickUp**: daily spend/CPP/CPL per campaign into Ticketing fields
- **Flodesk / ManyChat / Laylo → ClickUp**: list-growth metrics (site rails currently
  point at **Laylo** — reconcile which platforms are canonical before wiring)
- **Airtable / Google Sheets**: one-way exports FROM ClickUp for reporting
- Direction of truth: ClickUp owns tasks/status; external systems own their own
  data (sales, spend, subscribers) and write INTO ClickUp read-only metric fields.

---

## 7. API & Integration Plan

- **Auth**: ClickUp personal API token (v2 API) initially; OAuth app if/when more
  seats need programmatic access.
- **Secret storage**: token lives at `~/.config/monolith/clickup_token` (chmod 600,
  outside all repos) for local agent use; in n8n as an n8n Credential. Never in
  code, docs, tasks, screenshots, or chat.
- **Env inventory** (`.env.example` placeholders, created with the integration
  scaffold): `CLICKUP_API_TOKEN`, `CLICKUP_WORKSPACE_ID`, `CLICKUP_SPACE_IDS`,
  `N8N_WEBHOOK_BASE`, `POSH_WEBHOOK_SECRET`, `META_ADS_TOKEN_PATH`,
  `NEON_READONLY_URL`.
- **Endpoints**: Workspaces/Spaces/Folders/Lists CRUD, Tasks CRUD, Custom Fields,
  Views, Webhooks (`taskUpdated`, `taskStatusUpdated`, `taskCreated`).
- **Rate limits**: 100 req/min/token — client uses a queue, exponential backoff on
  429, jittered retries (max 5).
- **Idempotency**: every synced object carries an `external_id` custom field
  (e.g. Posh order id, artist slug); upserts match on it — no duplicates.
- **Logging**: n8n execution log + a ClickUp "Integration Log" list for failures
  needing human eyes; errors never silently dropped.
- **Recovery**: all writes are additive or field-updates; nightly export of task
  JSON to Drive as the restore point.

---

## 8. Dashboards

- **Executive**: upcoming events w/ countdown + readiness, critical deadlines,
  overdue, blockers, booking pipeline snapshot, ticket sales vs capacity, revenue
  vs budget, sponsor pipeline value, workload.
- **Per-Event** (template): countdown, readiness score (weighted checklist rollup),
  talent/marketing/production status bars, sales pace, budget burn, open approvals,
  risks, day-of milestones.
- **Talent**: active offers, contracts pending, deposits due, missing assets,
  announcement clearance queue, follow-ups this week, committed fees total.
- **Marketing**: content calendar, pieces by status, approval bottlenecks, paid
  spend vs leads vs conversions, published-asset log.
- **Finance**: budgets by event, outstanding deposits, upcoming balances, unpaid
  invoices, projected vs actual profit, variance by event.

---

## 9. Knowledge Space (Docs)

Company overview · Brand architecture (Monolith parent → SUN(SETS) daylight →
Untold after-dark → House of Friends artist door → Kashmir residency) · Brand
standards · Event playbook · Artist booking SOP (incl. the announcement-gate rule) ·
Marketing playbook · Production playbook · Sponsorship playbook · Venue database ·
Vendor database · Contact directory · Post-event reports · Lessons learned.
Heavy files (contracts, insurance, hi-res art, video, settlements) = **Drive links
only**.

---

## 10. Permission Matrix

| Group | Exec | Events | Talent | Mktg | Partners | Finance | Knowledge |
|---|---|---|---|---|---|---|---|
| Owner/Admin | Full | Full | Full | Full | Full | Full | Full |
| Exec leadership | Full | Full | Full | View | Full | View | Full |
| Event manager | — | Full | View* | Edit | View | View* | Edit |
| Talent buyer | — | Edit | Full | — | — | View* | Edit |
| Marketing | — | Edit | View* (no fees/contacts) | Full | — | — | Edit |
| Creative | — | Comment | — | Edit | — | — | View |
| Production | — | Edit (production lists) | — | — | — | — | Edit |
| Finance | — | View | View fees | — | View | Full | Edit |
| Venue/partner | — | Single-folder guest | — | — | — | — | — |
| Contractor | — | Assigned tasks only | — | Edit assigned | — | — | View |
| Read-only stakeholder | View dashboards | View | — | — | — | — | View |

\* fee amounts, personal contact info, and negotiation notes restricted via
restricted custom fields + private lists. Contracts/financials/credentials never
leave restricted Spaces.

---

## 11. Naming Standards

- Folders/events: `[BRAND] — [EVENT NAME] — [YYYY-MM-DD]`
- Tasks: start with an action verb (`Finalize special-guest contract`)
- Docs: `[AREA] · [NAME] · vN`
- No emojis in structural names; statuses and dashboards may use color instead.

---

## 12. Initial Event Seeding (with placeholders)

| Event | Date | Status flags |
|---|---|---|
| SUN(SETS) — House of Friends Preview | 2026-08-22 | Venue: Castaways. Lineup: **Needs confirmation** (site shows TBA). Tickets: Posh page pending |
| SUN(SETS) — Joezi x Massuma (UK) | 2026-09-19 | Venue: Castaways. Special guests: **Needs confirmation** |
| MONOLITH — Special Guest (Kashmir) | 2026-07-31 **or** 2026-08-01 | **Date tentative** — portfolio task carries both holds until confirmed. Booking: **Awaiting contract** |
| Untold Story next chapter | TBD | Concept phase |
| House of Friends discovery | rolling | Applications flow live at houseoffriends.vip/apply |
| Monolith launch | 2026-10-10 | Per site catalog — **Needs confirmation** as an operating event |

Nothing tentative is ever marked publicly confirmed.

---

## 13. Phase Plan

1. **Audit & Blueprint** — this doc + live workspace audit (blocked on access)
2. **Core build** — Spaces, Lists, statuses, fields, Docs skeleton
3. **Event template** — build + pilot on SUN(SETS) 2026-09-19 (real but least
   time-pressured); uncertain data marked *Needs confirmation*
4. **Automations** — native first, then n8n specs
5. **Dashboards**
6. **QA** — template duplication, status transitions, automation dry-runs,
   permission boundary checks, mobile pass

## 14. Blocked / Needs Erik

1. **ClickUp access** — create a personal API token (ClickUp → Settings → Apps) and
   save it OUTSIDE chat: `echo "pk_…" > ~/.config/monolith/clickup_token && chmod 600 ~/.config/monolith/clickup_token`
2. Payment-approval threshold (default proposal: $1,000)
3. Canonical email/SMS platforms (brief says Flodesk/ManyChat; site rails run Laylo)
4. Kashmir/special-guest final date (Jul 31 vs Aug 1)
5. Aug 22 lineup + Posh URLs (also blocks the site's on-sale flip)
6. Who besides Erik gets Exec-level access; initial team roster for permission groups
7. n8n hosting (existing instance? or provision one)
