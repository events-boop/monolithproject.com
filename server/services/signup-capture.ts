import { createHash } from "node:crypto";
import { z } from "zod";
import { getDatabase } from "../db/client";
import { leads } from "../db/schema";

// This mode collects consent durably without claiming provider delivery.
export function databaseSignupCaptureEnabled() {
  return process.env.SIGNUP_CAPTURE_MODE === "database";
}

const captureSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform(value => value.toLowerCase()),
  audience: z.enum(["newsletter", "event", "radio"]),
  consent: z.literal(true),
  source: z.string().trim().max(120).optional(),
  firstName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export async function signupCaptureAvailable() {
  const db = getDatabase();
  if (!db) return false;
  try {
    await db.select({ id: leads.id }).from(leads).limit(1);
    return true;
  } catch {
    return false;
  }
}

export async function saveSignupRequest(input: z.input<typeof captureSchema>) {
  const parsed = captureSchema.parse(input);
  const db = getDatabase();
  if (!db) throw new Error("Signup storage unavailable");
  // Stable across instances and retries; no migration or in-memory dedup needed.
  const id =
    "signup_" +
    createHash("sha256")
      .update(`${parsed.audience}:${parsed.email}`)
      .digest("hex");
  await db
    .insert(leads)
    .values({
      id,
      email: parsed.email,
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      source: parsed.source || `sunsets_${parsed.audience}`,
      provider: "brevo",
      providerStatus: "pending",
      metadata: {
        ...parsed.details,
        captureKind: "email-signup-v1",
        audience: parsed.audience,
        consent: true,
        channelConsent: { email: true, sms: false, whatsapp: false },
        consentVersion: "email-signup-2026-09-21",
        consentRecordedAt: new Date().toISOString(),
        deliveryState: "awaiting_provider_sync",
      },
    })
    .onConflictDoNothing({ target: leads.id });
  // A duplicate must not reset a delivered/suppressed record or overwrite its consent.
  return { id, state: "saved" as const };
}
