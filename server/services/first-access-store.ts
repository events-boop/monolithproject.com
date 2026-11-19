import { createHash, randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { leads } from "../db/schema";
import { getDatabase } from "../db/client";
import {
  FIRST_ACCESS_ADULT_CONFIRMATION,
  FIRST_ACCESS_CONSENT_VERSION,
  FIRST_ACCESS_EMAIL_CONSENT,
} from "@shared/first-access";

export type FirstAccessResult = {
  status: number;
  body: {
    ok: boolean;
    state?: string;
    message: string;
    requestSaved?: boolean;
    retryAfterSec?: number;
  };
  replayed?: boolean;
};
export type FirstAccessDetails = {
  email: string;
  firstName: string;
  city?: string;
  interests: string[];
  consentVersion: typeof FIRST_ACCESS_CONSENT_VERSION;
};
export type FirstAccessReceipt = {
  id: string;
  fingerprint: string;
  listId: number;
  response?: FirstAccessResult;
};

function database() {
  const db = getDatabase();
  if (!db) throw new Error("First Access storage unavailable");
  return db;
}
export function firstAccessReceiptId(key: string) {
  return "first_access_" + createHash("sha256").update(key).digest("hex");
}
export function firstAccessFingerprint(data: FirstAccessDetails) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        city: data.city || "",
        interests: Array.from(new Set(data.interests)).sort(),
        consentVersion: data.consentVersion,
      })
    )
    .digest("hex");
}

export async function findFirstAccessReceipt(
  key: string
): Promise<FirstAccessReceipt | null> {
  const [row] = await database()
    .select({ id: leads.id, metadata: leads.metadata })
    .from(leads)
    .where(eq(leads.id, firstAccessReceiptId(key)))
    .limit(1);
  if (!row) return null;
  const metadata = row.metadata as Record<string, unknown>;
  if (
    metadata.captureKind !== "first-access-receipt-v1" ||
    typeof metadata.fingerprint !== "string" ||
    typeof metadata.providerListId !== "number"
  )
    throw new Error("First Access receipt requires reconciliation");
  return {
    id: row.id,
    fingerprint: metadata.fingerprint,
    listId: metadata.providerListId,
    response: metadata.completedResponse as FirstAccessResult | undefined,
  };
}

// One immutable consent/preferences receipt per operation. New preferences get a
// new receipt; neither an older newsletter receipt nor suppression is overwritten.
export async function createFirstAccessReceipt(
  key: string,
  data: FirstAccessDetails,
  listId: number
) {
  await database()
    .insert(leads)
    .values({
      id: firstAccessReceiptId(key),
      email: data.email,
      firstName: data.firstName,
      source: "first_access_intake",
      provider: "brevo",
      providerStatus: "pending",
      metadata: {
        captureKind: "first-access-receipt-v1",
        fingerprint: firstAccessFingerprint(data),
        audience: "newsletter",
        city: data.city || undefined,
        interestTags: Array.from(new Set(data.interests)).sort(),
        adultConfirmed: true,
        adultConfirmation: FIRST_ACCESS_ADULT_CONFIRMATION,
        consent: true,
        channelConsent: { email: true, sms: false, whatsapp: false },
        consentVersion: FIRST_ACCESS_CONSENT_VERSION,
        consentText: FIRST_ACCESS_EMAIL_CONSENT,
        consentRecordedAt: new Date().toISOString(),
        pagePath: "/newsletter",
        formVersion: "first-access-2027-v1",
        providerListId: listId,
        deliveryState: "awaiting_provider_sync",
      },
    })
    .onConflictDoNothing({ target: leads.id });
  const receipt = await findFirstAccessReceipt(key);
  if (!receipt) throw new Error("First Access receipt was not acknowledged");
  return receipt;
}

// The conditional UPDATE is the cross-instance lock. The lease outlives the
// provider's three bounded requests and recovers if a serverless worker dies.
export async function claimFirstAccessReceipt(id: string) {
  const leaseId = randomUUID();
  const [claimed] = await database()
    .update(leads)
    .set({
      providerStatus: "processing",
      metadata: sql`${leads.metadata} || jsonb_build_object('leaseId', ${leaseId}::text, 'leaseExpiresAt', now() + interval '60 seconds', 'deliveryState', 'processing')`,
    })
    .where(
      and(
        eq(leads.id, id),
        sql`(${leads.providerStatus} = 'pending' OR (${leads.providerStatus} = 'processing' AND (${leads.metadata}->>'leaseExpiresAt')::timestamptz <= now()))`
      )
    )
    .returning({ id: leads.id });
  return claimed ? leaseId : null;
}

export async function finishFirstAccessReceipt(
  id: string,
  leaseId: string,
  providerStatus: "success" | "suppressed" | "pending",
  result: FirstAccessResult
) {
  const terminal = providerStatus !== "pending";
  const metadata = {
    deliveryState: providerStatus === "success" ? "subscribed" : providerStatus,
    lastAttemptAt: new Date().toISOString(),
    ...(terminal
      ? { completedResponse: { status: result.status, body: result.body } }
      : {}),
  };
  const [updated] = await database()
    .update(leads)
    .set({
      providerStatus,
      metadata: sql`(${leads.metadata} - 'leaseId' - 'leaseExpiresAt') || ${JSON.stringify(metadata)}::jsonb`,
    })
    .where(
      and(
        eq(leads.id, id),
        eq(leads.providerStatus, "processing"),
        sql`${leads.metadata}->>'leaseId' = ${leaseId}`
      )
    )
    .returning({ id: leads.id });
  if (!updated) throw new Error("First Access lease is no longer owned");
}
