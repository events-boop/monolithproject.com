import {
  databaseSignupCaptureEnabled,
  signupCaptureAvailable,
  saveSignupRequest,
} from "./signup-capture";
import {
  brevoListId,
  isBrevoListReachable,
  brevoConfigured,
  subscribeBrevoList,
  BrevoSubscriptionError,
} from "../providers/brevo";
import { z } from "zod";

export const sunsetsSubscriptionSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform(value => value.toLowerCase()),
  audience: z.enum(["event", "radio"]),
  consent: z.literal(true),
  website: z.string().max(200).optional(),
});
type Audience = "event" | "radio";
function config(audience: Audience) {
  if (process.env.SUNSETS_SIGNUP_PROVIDER === "brevo") {
    const event = brevoListId(process.env.SUNSETS_BREVO_EVENT_LIST_ID);
    const radio = brevoListId(process.env.SUNSETS_BREVO_RADIO_LIST_ID);
    if (!brevoConfigured(event) || !brevoConfigured(radio) || event === radio)
      return null;
    return {
      provider: "brevo" as const,
      listId: (audience === "event" ? event : radio)!,
    };
  }
  const key = process.env.SUNSETS_FLODESK_API_KEY?.trim();
  const event = process.env.SUNSETS_FLODESK_EVENT_SEGMENT?.trim();
  const radio = process.env.SUNSETS_FLODESK_RADIO_SEGMENT?.trim();
  // Explicit opt-in isolates this integration from existing site lead providers.
  if (
    process.env.SUNSETS_SIGNUP_PROVIDER !== "flodesk" ||
    !key ||
    !event ||
    !radio ||
    event === radio
  )
    return null;
  return {
    provider: "flodesk" as const,
    key,
    segment: audience === "event" ? event : radio,
  };
}
export function sunsetsSubscriptionAvailability() {
  return { event: Boolean(config("event")), radio: Boolean(config("radio")) };
}
export async function subscribeSunsets(input: unknown) {
  const parsed = sunsetsSubscriptionSchema.safeParse(input);
  if (!parsed.success || parsed.data.website)
    return {
      status: 400,
      body: {
        ok: false,
        message: "Enter a valid email address and check the email consent box.",
      },
    };
  if (databaseSignupCaptureEnabled()) {
    try {
      await saveSignupRequest({
        ...parsed.data,
        source: `sunsets_${parsed.data.audience}`,
      });
      return {
        status: 200,
        body: {
          ok: true,
          state: "saved",
          message:
            parsed.data.audience === "event"
              ? "Your request for show updates is saved."
              : "Your request for SUNSETS.FM releases is saved.",
        },
      };
    } catch {
      return {
        status: 503,
        body: {
          ok: false,
          message: "We couldn’t save your signup. Please try again shortly.",
        },
      };
    }
  }
  const settings = config(parsed.data.audience);
  if (!settings)
    return {
      status: 503,
      body: {
        ok: false,
        message:
          "Email signup is not available yet. Check this page for event updates.",
      },
    };
  try {
    if (settings.provider === "brevo") {
      await subscribeBrevoList({
        email: parsed.data.email,
        listId: settings.listId,
      });
      return {
        status: 200,
        body: {
          ok: true,
          state: "subscribed",
          message:
            parsed.data.audience === "event"
              ? "You’re on the show-update list."
              : "You’re on the SUNSETS.FM release list.",
        },
      };
    }
    // Flodesk upserts by email, so repeat submissions do not create duplicate people.
    // Only the chosen segment is added. No purchase/Lead events or PII in analytics.
    const response = await fetch("https://api.flodesk.com/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(settings.key + ":").toString("base64"),
        "User-Agent": "Monolith Sunsets (monolithproject.com)",
      },
      body: JSON.stringify({
        email: parsed.data.email,
        segment_ids: [settings.segment],
        double_optin: true,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Provider unavailable");
    const subscriber = await response.json();
    if (
      !subscriber?.id ||
      !subscriber.segments?.some(
        (s: { id: string }) => s.id === settings.segment
      )
    )
      throw new Error("Unverified segment");
    if (subscriber.status === "unconfirmed")
      return {
        status: 200,
        body: {
          ok: true,
          state: "confirmation_required",
          message:
            "Check your inbox to confirm your email subscription. You are not subscribed until you confirm.",
        },
      };
    if (subscriber.status === "active")
      return {
        status: 200,
        body: {
          ok: true,
          state: "subscribed",
          message:
            parsed.data.audience === "event"
              ? "You’re on the show-update list. If you signed up before, your existing subscription is up to date."
              : "You’re on the SUNSETS.FM list. If you signed up before, your existing subscription is up to date.",
        },
      };
    return {
      status: 409,
      body: {
        ok: false,
        message:
          "This address could not be subscribed. Contact events@monolithproject.com for help.",
      },
    };
  } catch (error) {
    if (error instanceof BrevoSubscriptionError && error.code === "SUPPRESSED")
      return {
        status: 409,
        body: {
          ok: false,
          message:
            "This address could not be subscribed. Contact events@monolithproject.com for help.",
        },
      };
    // Never expose provider payloads, API credentials, or submitted email in errors/logs.
    return {
      status: 502,
      body: {
        ok: false,
        message:
          "We couldn’t confirm your signup. Please try again shortly or contact events@monolithproject.com.",
      },
    };
  }
}

export async function checkedSunsetsSubscriptionAvailability() {
  if (databaseSignupCaptureEnabled()) {
    const ready = await signupCaptureAvailable();
    return { event: ready, radio: ready };
  }
  const availability = sunsetsSubscriptionAvailability();
  if (process.env.SUNSETS_SIGNUP_PROVIDER !== "brevo") return availability;
  const check = async (audience: Audience) => {
    const settings = config(audience);
    return (
      settings?.provider === "brevo" &&
      (await isBrevoListReachable(settings.listId))
    );
  };
  const [event, radio] = await Promise.all([check("event"), check("radio")]);
  return { event, radio };
}
