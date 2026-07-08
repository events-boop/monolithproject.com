/**
 * Event Publish OS — build gate.
 *
 * Runs before every build (npm run validate:events). If an event's status
 * violates its gates, the deploy FAILS: the site cannot ship a state that
 * was not approved. This is the 11-point QA checklist as law, not memory.
 *
 * Rules:
 *   1. on-sale / sold-out  → all gates passed (creativeReady, trackingQA,
 *      poshLinked) and a ticketUrl present. Money states must be proven.
 *   2. draft               → no ticketUrl (no accidental checkout paths).
 *   3. event window ended  → status must be "past" within 24h of endsAt.
 *      (This is the rule that catches a stale July 4 still "on-sale".)
 *   4. past                → warn when no archiveSlug/recapUrl; the recap
 *      is the sponsor receipt.
 *
 * NOTE (Law #2): open negotiations — artists in play, rates, agents — never
 * enter this repo at all, not even flagged as unconfirmed. A name goes into
 * a lineup string only when the deal is papered.
 */

import { upcomingEvents } from "../server/data/public-site-data";
import type { ScheduledEvent } from "../shared/events/types";

const MONEY_STATUSES = new Set(["on-sale", "sold-out"]);
const PAST_GRACE_MS = 24 * 60 * 60 * 1000;

const errors: string[] = [];
const warnings: string[] = [];

function eventEndTimestamp(event: ScheduledEvent): number | null {
  const explicitEnd = event.endsAt ? Date.parse(event.endsAt) : NaN;
  if (!Number.isNaN(explicitEnd)) return explicitEnd;
  const start = event.startsAt ?? event.date;
  const parsedStart = start ? Date.parse(start) : NaN;
  if (Number.isNaN(parsedStart)) return null;
  // No explicit end: assume the event is over 24h after it starts.
  return parsedStart + PAST_GRACE_MS;
}

const now = Date.now();

for (const event of upcomingEvents) {
  const tag = `[${event.id} → ${event.status}]`;
  const gates = event.gates;

  // Rule 1: money states must be proven.
  if (MONEY_STATUSES.has(event.status)) {
    if (!gates) {
      errors.push(`${tag} is ${event.status} but has no gates record`);
    } else {
      if (!gates.trackingQA)
        errors.push(`${tag} tickets live but tracking QA not passed`);
      if (!gates.poshLinked)
        errors.push(`${tag} tickets live but Posh checkout not linked`);
      if (!gates.creativeReady)
        errors.push(`${tag} tickets live but creative not ready`);
    }
    if (event.status === "on-sale" && !event.ticketUrl) {
      errors.push(`${tag} on-sale with no ticketUrl`);
    }
  }

  // Rule 2: drafts stay clean.
  if (event.status === "draft" && event.ticketUrl) {
    errors.push(`${tag} draft event carries a ticketUrl — remove it or change status`);
  }

  // Rule 3: finished events must be archived.
  const end = eventEndTimestamp(event);
  if (
    end !== null &&
    now > end + PAST_GRACE_MS &&
    event.status !== "past" &&
    event.status !== "draft"
  ) {
    errors.push(
      `${tag} ended ${new Date(end).toISOString().slice(0, 10)} but status is still "${event.status}" — flip it to "past"`
    );
  }

  // Rule 4: past events should point at their archive.
  if (event.status === "past" && !event.archiveSlug && !event.recapUrl) {
    warnings.push(
      `${tag} past event with no archiveSlug or recapUrl — the recap is the booking receipt`
    );
  }
}

for (const warning of warnings) console.warn(`⚠️  ${warning}`);

if (errors.length) {
  console.error("\n❌ EVENT PUBLISH OS — BUILD BLOCKED\n");
  for (const error of errors) console.error(`  • ${error}`);
  console.error(
    "\nFix the record in server/data/public-site-data.ts or change the status.\n"
  );
  process.exit(1);
}

console.log(
  `✅ Event Publish OS — ${upcomingEvents.length} events validated clean.`
);
