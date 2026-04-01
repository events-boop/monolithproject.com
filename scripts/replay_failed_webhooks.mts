import { eq, inArray } from "drizzle-orm";
import { getDatabase } from "../server/db/client";
import { bookingInquiries, contactSubmissions } from "../server/db/schema";

const WEBHOOK_TIMEOUT_MS = 8_000;
const kindArg = process.argv.find((arg) => arg.startsWith("--kind="))?.split("=")[1] ?? "all";
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="))?.split("=")[1] ?? "50";
const limit = Number.parseInt(limitArg, 10);

function readLimit() {
  if (Number.isFinite(limit) && limit > 0) return limit;
  return 50;
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned status ${response.status}`);
  }
}

async function replayContactSubmissions() {
  const db = getDatabase();
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL || process.env.BOOKING_WEBHOOK_URL;
  if (!db) throw new Error("DATABASE_URL is required to replay contact submissions.");
  if (!webhookUrl) throw new Error("CONTACT_WEBHOOK_URL or BOOKING_WEBHOOK_URL is required to replay contact submissions.");

  const rows = await db
    .select()
    .from(contactSubmissions)
    .where(inArray(contactSubmissions.webhookStatus, ["pending", "failed"]))
    .limit(readLimit());

  let delivered = 0;
  let failed = 0;

  for (const row of rows) {
    const metadata = (row.metadata || {}) as Record<string, unknown>;
    const receivedAt = typeof metadata.receivedAt === "string" ? metadata.receivedAt : row.createdAt;
    const requestId =
      typeof metadata.requestId === "string" ? metadata.requestId : `replay-contact-${row.id}`;

    try {
      await postJson(webhookUrl, {
        name: row.name,
        email: row.email,
        subject: row.subject,
        message: row.message,
        requestId,
        receivedAt,
        type: "contact_form",
      });

      delivered += 1;
      await db
        .update(contactSubmissions)
        .set({
          webhookStatus: "success",
          metadata: {
            ...metadata,
            deliveryState: "delivered",
            lastReplayAt: new Date().toISOString(),
            lastReplayError: null,
          },
        })
        .where(eq(contactSubmissions.id, row.id));
    } catch (error) {
      failed += 1;
      await db
        .update(contactSubmissions)
        .set({
          webhookStatus: "failed",
          metadata: {
            ...metadata,
            deliveryState: "queued",
            lastReplayAt: new Date().toISOString(),
            lastReplayError: error instanceof Error ? error.message : "Unknown error",
          },
        })
        .where(eq(contactSubmissions.id, row.id));
    }
  }

  console.log(`contact: delivered=${delivered} failed=${failed}`);
}

async function replayBookingInquiries() {
  const db = getDatabase();
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
  if (!db) throw new Error("DATABASE_URL is required to replay booking inquiries.");
  if (!webhookUrl) throw new Error("BOOKING_WEBHOOK_URL is required to replay booking inquiries.");

  const rows = await db
    .select()
    .from(bookingInquiries)
    .where(inArray(bookingInquiries.webhookStatus, ["pending", "failed"]))
    .limit(readLimit());

  let delivered = 0;
  let failed = 0;

  for (const row of rows) {
    const metadata = (row.metadata || {}) as Record<string, unknown>;
    const receivedAt = typeof metadata.receivedAt === "string" ? metadata.receivedAt : row.createdAt;
    const requestId =
      typeof metadata.requestId === "string" ? metadata.requestId : `replay-booking-${row.id}`;

    try {
      await postJson(webhookUrl, {
        name: row.name,
        email: row.email,
        entity: row.entity,
        type: row.type,
        location: row.location,
        message: row.message,
        requestId,
        receivedAt,
      });

      delivered += 1;
      await db
        .update(bookingInquiries)
        .set({
          webhookStatus: "success",
          metadata: {
            ...metadata,
            deliveryState: "delivered",
            lastReplayAt: new Date().toISOString(),
            lastReplayError: null,
          },
        })
        .where(eq(bookingInquiries.id, row.id));
    } catch (error) {
      failed += 1;
      await db
        .update(bookingInquiries)
        .set({
          webhookStatus: "failed",
          metadata: {
            ...metadata,
            deliveryState: "queued",
            lastReplayAt: new Date().toISOString(),
            lastReplayError: error instanceof Error ? error.message : "Unknown error",
          },
        })
        .where(eq(bookingInquiries.id, row.id));
    }
  }

  console.log(`booking: delivered=${delivered} failed=${failed}`);
}

async function main() {
  if (kindArg === "all" || kindArg === "contact") {
    await replayContactSubmissions();
  }

  if (kindArg === "all" || kindArg === "booking") {
    await replayBookingInquiries();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
