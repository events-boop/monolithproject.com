/**
 * cms_seed — one-time import of the approved static content sources into the
 * CMS document store (cms_documents/cms_revisions, migration 0007).
 *
 * Idempotent: a document that already has a published revision is skipped.
 * Every payload is validated against shared/cms/schemas.ts before insert;
 * any validation failure aborts the whole run without writing that document.
 *
 * Requires DATABASE_URL. Usage: npm run cms:seed
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { CMS_DOCUMENTS } from "../shared/cms/documents.js";
import { validateCmsPayload } from "../shared/cms/schemas.js";
import { FAQ_SITE } from "../shared/faqs.js";
import { FEATURED_EVENT_IDS } from "../server/data/public-site-data.js";
import { readPublicScheduledEvents } from "../server/db/scheduledEventsRepo.js";
import {
  getCmsDocument,
  listRevisionHistory,
  publishRevision,
  saveDraft,
} from "../server/db/cmsRepo.js";
import type { CmsDocumentKey } from "../shared/cms/documents.js";
import type { ScheduledEvent } from "../shared/events/types.js";

if (!process.env.DATABASE_URL) {
  console.error(
    "cms:seed requires DATABASE_URL. Set it in the environment or .env and retry."
  );
  process.exit(1);
}

/** JSONB-safe plain data (drops undefined, Dates, class instances). */
function toJsonPayload<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function buildPayload(key: CmsDocumentKey): Promise<unknown> {
  switch (key) {
    case "events.catalogue": {
      // Same merge path the public site uses: static EVENT_CATALOG with any
      // scheduled_events rows overlaid (see scheduledEventsRepo.ts).
      const merged = await readPublicScheduledEvents();
      const events = merged.map(event => {
        const { primaryCta: _derived, ...stored } = event;
        return stored;
      });
      return toJsonPayload({ events } satisfies { events: ScheduledEvent[] });
    }
    case "sunsets.publication":
      return JSON.parse(
        readFileSync(
          new URL("../shared/events/sunsets-page.json", import.meta.url),
          "utf8"
        )
      );
    case "faqs.site":
      return toJsonPayload(FAQ_SITE);
    case "home.featured":
      return toJsonPayload({ slots: FEATURED_EVENT_IDS });
    case "tracking.pixels":
      // Mirrors the IDs currently hardcoded across client/index.html,
      // client/public/sunsets/tracking.js, and the pixel helpers. No
      // behavior change until a consumer reads this document.
      return toJsonPayload({
        metaPixelId: "1049241148606250",
        metaBrandPixelId: "166134370742863",
        ga4MeasurementId: "G-DE8Z8VS263",
        notes: "Initial import of the production tracking IDs",
      });
  }
}

function summarize(key: CmsDocumentKey, payload: unknown): string {
  if (key === "events.catalogue") {
    return `${(payload as { events: unknown[] }).events.length} events`;
  }
  if (key === "faqs.site") {
    const faqs = payload as typeof FAQ_SITE;
    const items = faqs.categories.reduce(
      (count, category) => count + category.items.length,
      0
    );
    return `${faqs.categories.length} categories / ${items} items + ${faqs.home.length} home FAQs`;
  }
  if (key === "home.featured") {
    return `slots: ${Object.values(
      (payload as { slots: Record<string, string> }).slots
    ).join(", ")}`;
  }
  if (key === "tracking.pixels") {
    const tracking = payload as {
      metaPixelId: string;
      metaBrandPixelId: string | null;
      ga4MeasurementId: string;
    };
    return `meta ${tracking.metaPixelId}, brand ${tracking.metaBrandPixelId ?? "none"}, GA4 ${tracking.ga4MeasurementId}`;
  }
  const publication = payload as { name: string; status: string };
  return `${publication.name} (${publication.status})`;
}

async function main() {
  console.log("Seeding CMS documents...\n");

  let failures = 0;

  for (const definition of CMS_DOCUMENTS) {
    const key = definition.key;
    try {
      const detail = await getCmsDocument(key);
      if (detail !== null) {
        console.log(
          `• ${key} — existing document preserved; skipping initial seed`
        );
        continue;
      }

      const payload = await buildPayload(key);
      const validation = validateCmsPayload(key, payload);
      if (!validation.success) {
        failures += 1;
        console.error(
          `✗ ${key} — payload failed validation, aborting this document:`
        );
        validation.issues.forEach(issue => console.error(`    ${issue}`));
        continue;
      }

      // Only seed an empty base. A concurrent editor wins rather than being overwritten.
      const draft = await saveDraft(
        key,
        payload,
        null,
        "cms:seed initial import"
      );
      const publishedMeta = await publishRevision(key, draft.id, null);

      const revisions = await listRevisionHistory(key);
      console.log(
        `✓ ${key} (${definition.label}) — seeded revision ${publishedMeta.revision} as published (${revisions.length} revision total): ${summarize(key, payload)}`
      );
    } catch (error) {
      failures += 1;
      console.error(
        `✗ ${key} — seed failed: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  console.log("");
  if (failures > 0) {
    console.error(`cms:seed finished with ${failures} failure(s).`);
    process.exit(1);
  }
  console.log("cms:seed completed successfully.");
}

main();
