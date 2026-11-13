import { z } from "zod";
import { readProvider } from "../lib/env";
import { honeypotFields } from "../lib/schemas";
import { readHoneypotValue } from "../lib/honeypot";
import { FIRST_ACCESS_CONSENT_VERSION } from "@shared/first-access";
import {
  brevoListId,
  brevoConfigured,
  isBrevoListReachable,
  subscribeBrevoList,
  BrevoSubscriptionError,
} from "../providers/brevo";
import { signupCaptureAvailable } from "./signup-capture";
import {
  claimFirstAccessReceipt,
  createFirstAccessReceipt,
  findFirstAccessReceipt,
  finishFirstAccessReceipt,
  firstAccessFingerprint,
  type FirstAccessResult,
} from "./first-access-store";

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
  consentVersion: z.literal(FIRST_ACCESS_CONSENT_VERSION),
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

const storageUnavailable = (): FirstAccessResult => ({
  status: 503,
  body: {
    ok: false,
    message: "We couldn’t save your request. Please try again.",
  },
});
const inProgress = (): FirstAccessResult => ({
  status: 409,
  body: {
    ok: false,
    requestSaved: true,
    retryAfterSec: 2,
    message:
      "Your signup is being processed. Your details are saved; please try again shortly to check the result.",
  },
});
const changedRequest = (): FirstAccessResult => ({
  status: 409,
  body: {
    ok: false,
    message:
      "This signup reference belongs to different details. Refresh the form and try again.",
  },
});

export async function submitFirstAccess(
  input: unknown,
  idempotencyKey: string
): Promise<FirstAccessResult> {
  const parsed = schema.safeParse(input);
  if (
    !parsed.success ||
    readHoneypotValue(input) ||
    !/^[A-Za-z0-9_-]{16,128}$/.test(idempotencyKey)
  )
    return {
      status: 400,
      body: {
        ok: false,
        message:
          "Refresh the form, check your details and email consent, then try again.",
      },
    };
  const data = parsed.data;
  const fingerprint = firstAccessFingerprint(data);
  let receipt: Awaited<ReturnType<typeof findFirstAccessReceipt>>;
  try {
    receipt = await findFirstAccessReceipt(idempotencyKey);
  } catch {
    return storageUnavailable();
  }
  if (receipt && receipt.fingerprint !== fingerprint) return changedRequest();
  if (receipt?.response) return { ...receipt.response, replayed: true };
  if (!(await firstAccessAvailable()))
    return {
      status: 503,
      body: {
        ok: false,
        message:
          "Please use the secure signup link below to join First Access.",
      },
    };
  const listId = brevoListId(process.env.BREVO_LIST_ID)!;
  // Never silently replay a saved operation into a newly configured audience.
  if (receipt && receipt.listId !== listId)
    return {
      status: 503,
      body: {
        ok: false,
        requestSaved: true,
        message:
          "Your request needs a connection check. Please contact events@monolithproject.com for help.",
      },
    };
  let leaseId: string | null;
  try {
    receipt ??= await createFirstAccessReceipt(idempotencyKey, data, listId);
    // A concurrent insert may have won with another payload or completed already.
    if (receipt.fingerprint !== fingerprint) return changedRequest();
    if (receipt.response) return { ...receipt.response, replayed: true };
    if (receipt.listId !== listId)
      return {
        status: 503,
        body: {
          ok: false,
          requestSaved: true,
          message:
            "Your request needs a connection check. Please contact events@monolithproject.com for help.",
        },
      };
    leaseId = await claimFirstAccessReceipt(receipt.id);
    if (!leaseId) {
      const latest = await findFirstAccessReceipt(idempotencyKey);
      return latest?.response
        ? { ...latest.response, replayed: true }
        : inProgress();
    }
  } catch {
    return storageUnavailable();
  }
  let result: FirstAccessResult;
  let providerStatus: "success" | "suppressed" | "pending";
  try {
    await subscribeBrevoList({
      email: data.email,
      firstName: data.firstName,
      listId,
      skipExistingSubscription: true,
    });
    providerStatus = "success";
    result = {
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
    providerStatus = suppressed ? "suppressed" : "pending";
    result = {
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
  try {
    await finishFirstAccessReceipt(receipt.id, leaseId, providerStatus, result);
  } catch {
    // Receipt/consent already exists. A failed status write must not turn a
    // verified subscription into a claimed failure; the lease can recover.
    console.warn("First Access delivery status needs reconciliation.");
  }
  return result;
}
