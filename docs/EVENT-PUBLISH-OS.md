# Event Publish OS

One record powers everything. Posh is the checkout. The site is the world.
`server/data/public-site-data.ts` (`EVENT_CATALOG`) is the source of truth.

## The Two Laws

1. **No event ships a state we didn't approve.** Status can't move past its
   gates — `npm run validate:events` runs first in every build and fails the
   deploy on a violation.
2. **No unconfirmed name ever enters this repo.** Open negotiations (rates,
   agents, artists in play) never get typed into the catalog — not even
   flagged as unconfirmed. A name goes into a `lineup` string only when the
   deal is papered.

## How Status Controls the Site

| Status | Lists / homepage | Direct event page | Ticket CTA | Search |
|---|---|---|---|---|
| `draft` | hidden | hidden | none | invisible |
| `hidden` | hidden | resolves | none | not prerendered |
| `coming-soon` | visible | resolves | "Join the Lake List" | indexed |
| `on-sale` | visible | resolves | "Get Tickets" → Posh | indexed |
| `sold-out` | visible | resolves | sold out / SMS list | indexed |
| `past` | archive | resolves | "Relive It" → archiveSlug/recapUrl | indexed |

You never hand-edit a page to change event state. You change the record,
push, and the build rebuilds the world.

## The Gates (enforced by `scripts/validate_events.mts`)

- `on-sale` / `sold-out` → **build fails** unless `gates.trackingQA`,
  `gates.poshLinked`, and `gates.creativeReady` are all `true` (and
  `ticketUrl` is set for `on-sale`).
- `draft` with a `ticketUrl` → **build fails**.
- Event window ended more than a day ago but status isn't `past` →
  **build fails**. (This is the rule that catches a stale "on-sale" July 4.)
- `past` without `archiveSlug`/`recapUrl` → warning. The recap page is the
  sponsor receipt.

## The Flow (per event)

1. **Add record** to `EVENT_CATALOG`, status `draft`.
2. **Creative ready** — flyer/square/story/OG done → flip `gates.creativeReady`.
3. **Posh draft** — create checkout, paste URL into `ticketUrl` → flip `gates.poshLinked`.
4. **Preview** — status `hidden`, check the page at its slug.
5. **Announce** — status `coming-soon`; Lake List CTA everywhere.
6. **Tickets live** — pass tracking QA → flip `gates.trackingQA`, status `on-sale`.
7. **Sell through** — status `sold-out`.
8. **Archive** — status `past`, add `archiveSlug` (gallery collection) or
   `recapUrl`.

## The DB caveat (important)

Production `/api/site-data` merges the Neon `scheduled_events` table **over**
the static catalog (`mergeScheduledEvents` — DB rows win). After changing a
record's status in the catalog, re-run the seed so the DB matches:

```
npx tsx scripts/seed_events.mts   # requires DATABASE_URL
```

Prerendered HTML and SEO artifacts come from the static catalog at build
time, so those update on deploy either way — but the live API will keep
serving the old state until the seed runs.
