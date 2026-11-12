import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDatabase } from "../db/client";
import { leads } from "../db/schema";
import { readProvider } from "../lib/env";
import { honeypotFields } from "../lib/schemas";
import {
  brevoListId,
  brevoConfigured,
  isBrevoListReachable,
  subscribeBrevoList,
  BrevoSubscriptionError,
} from "../providers/brevo";
import { saveSignupRequest, signupCaptureAvailable } from "./signup-capture";

const schema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform(value => value.toLowerCase()),
  firstName: z.string().trim().min(1).max(80),
  city: z.string().trim().max(100).optional(),
  interests: z
    .array(z.enum(["chasing-sunsets", "untold-story", "house-of-friends"]))
    .min(1)
    .max(3),
  consent: z.literal(true),
  adult: z.literal(true),
  ...honeypotFields,
});

// This uses the existing public newsletter list, never the controlled Audience OS
// receiver or the distinct SUNSETS.FM music audience. Missing setup fails closed.
export async function firstAccessAvailable() {
  const listId = brevoListId(process.env.BREVO_LIST_ID);
  return (
    readProvider() === "brevo" &&
    brevoConfigured(listId) &&
    (await signupCaptureAvailable()) &&
    (await isBrevoListReachable(listId!))
  );
}

async function markDelivery(id: string, providerStatus: string) {
  try {
    await getDatabase()
      ?.update(leads)
      .set({ providerStatus })
      .where(eq(leads.id, id));
  } catch {
    // A status-write failure must not turn a confirmed provider subscription into
    // a claimed failure. The durable receipt remains available for reconciliation.
    console.warn("First Access delivery status needs reconciliation.");
  }
}

export async function submitFirstAccess(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success)
    return {
      status: 400,
      body: {
        ok: false,
        message: "Check your details and email consent, then try again.",
      },
    };
  if (!(await firstAccessAvailable()))
    return {
      status: 503,
      body: {
        ok: false,
        message:
          "Please use the secure signup link below to join First Access.",
      },
    };
  const data = parsed.data;
  let receipt: Awaited<ReturnType<typeof saveSignupRequest>>;
  try {
    receipt = await saveSignupRequest({
      email: data.email,
      firstName: data.firstName,
      audience: "newsletter",
      consent: true,
      source: "first_access_intake",
      details: {
        city: data.city || undefined,
        interestTags: Array.from(new Set(data.interests)),
        adultConfirmed: true,
        pagePath: "/newsletter",
        formVersion: "first-access-2027-v1",
      },
    });
  } catch {
    return {
      status: 503,
      body: {
        ok: false,
        message: "We couldn’t save your request. Please try again.",
      },
    };
  }
  try {
    await subscribeBrevoList({
      email: data.email,
      firstName: data.firstName,
      listId: brevoListId(process.env.BREVO_LIST_ID)!,
    });
    await markDelivery(receipt.id, "success");
    return {
      status: 200,
      body: {
        ok: true,
        state: "subscribed",
        message: "You’re on the First Access list.",
      },
    };
  } catch (error) {
    const suppressed =
      error instanceof BrevoSubscriptionError && error.code === "SUPPRESSED";
    await markDelivery(receipt.id, suppressed ? "suppressed" : "pending");
    return {
      status: suppressed ? 409 : 502,
      body: {
        ok: false,
        requestSaved: true,
        message: suppressed
          ? "This address couldn’t be subscribed. Contact events@monolithproject.com for help."
          : "Your request is saved, but we couldn’t confirm your email subscription. Please retry or use the secure signup link below.",
      },
    };
  }
}
