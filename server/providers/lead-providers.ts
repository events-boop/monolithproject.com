import { createHash } from "crypto";
import { z } from "zod";
import { leadSchema, type LeadProvider } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { scrubEmail } from "../lib/security";
import { getBrevoBypassReason, getLayloBypassReason } from "../lib/env";

function getAttributionSource(lead: z.infer<typeof leadSchema>) {
  return lead.lastUtmSource || lead.utmSource || lead.source || "website";
}

function getLeadContextUrl(lead: z.infer<typeof leadSchema>) {
  return lead.pageUrl || lead.landingPageUrl || "https://monolithproject.com";
}

function getLayloApiToken() {
  return process.env.LAYLO_API_TOKEN?.trim() || process.env.LAYLO_API_KEY?.trim() || "";
}

function normalizeLayloPhone(phone?: string) {
  const trimmed = phone?.trim();
  if (!trimmed) return undefined;

  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  return trimmed;
}

export function shouldSyncLeadToLaylo(lead: z.infer<typeof leadSchema>) {
  const haystack = [
    lead.formType,
    lead.source,
    lead.funnelId,
    lead.offerId,
    lead.eventSeries,
    ...(lead.interestTags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return [
    "laylo",
    "lake_list",
    "first_access_signup",
    "sunsets_lake_list",
    "sunsets_radio_feature_drops",
    "chasing-sunsets",
  ].some((intent) => haystack.includes(intent));
}

export async function subscribeMailchimp(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const dc = process.env.MAILCHIMP_DC || apiKey?.split("-")[1];
  if (!apiKey || !listId || !dc) {
    throw new Error("MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID and MAILCHIMP_DC (or key suffix) are required");
  }

  const normalizedEmail = scrubEmail(lead.email);
  const subscriberHash = createHash("md5").update(normalizedEmail).digest("hex");
  const endpoint = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;
  const attributionSource = getAttributionSource(lead);
  const tags = ["monolith-project", attributionSource];
  if (lead.source && lead.source !== attributionSource) {
    tags.push(`placement:${lead.source}`);
  }

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    },
    body: JSON.stringify({
      email_address: normalizedEmail,
      status_if_new: "subscribed",
      status: "subscribed",
      merge_fields: {
        FNAME: lead.firstName || "",
        LNAME: lead.lastName || "",
      },
      tags,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    logEvent("provider.mailchimp_error", { status: response.status, detail: data.detail });
    throw new Error("Mailchimp subscription failed");
  }
}

export async function subscribeBeehiiv(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    throw new Error("BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID are required");
  }

  const endpoint = `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`;
  const attributionSource = getAttributionSource(lead);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email: scrubEmail(lead.email),
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: attributionSource,
      custom_fields: lead.firstName
        ? [{ name: "first_name", value: lead.firstName }]
        : [],
    }),
  });

  if (response.status === 409) {
    return;
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    logEvent("provider.beehiiv_error", { status: response.status, detail: data.message });
    throw new Error("Beehiiv subscription failed");
  }
}

export async function subscribeEmailOctopus(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.EMAILOCTOPUS_API_KEY;
  const listId = process.env.EMAILOCTOPUS_LIST_ID;
  if (!apiKey || !listId) {
    throw new Error("EMAILOCTOPUS_API_KEY and EMAILOCTOPUS_LIST_ID are required");
  }

  const endpoint = `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`;
  const attributionSource = getAttributionSource(lead);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      email_address: scrubEmail(lead.email),
      fields: {
        FirstName: lead.firstName || "",
        LastName: lead.lastName || "",
        Source: attributionSource,
      },
      status: "SUBSCRIBED",
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    if (data.error && data.error.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") return;
    logEvent("provider.emailoctopus_error", { status: response.status, detail: data.error?.message });
    throw new Error("EmailOctopus subscription failed");
  }
}

export async function subscribeBrevo(lead: z.infer<typeof leadSchema>) {
  const bypassReason = getBrevoBypassReason();
  if (bypassReason) {
    logEvent("provider.brevo_bypassed", {
      reason: bypassReason,
      source: lead.source || "website",
      emailHash: createHash("sha256").update(scrubEmail(lead.email)).digest("hex").slice(0, 12),
    });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY?.trim() || "";
  const endpoint = "https://api.brevo.com/v3/contacts";
  const attributionSource = getAttributionSource(lead);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email: scrubEmail(lead.email),
      updateEnabled: true,
      attributes: {
        FIRSTNAME: lead.firstName || "",
        LASTNAME: lead.lastName || "",
        SOURCE: attributionSource,
      },
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Ignore if contact already exists (error code duplicate_parameter usually)
    if (data.code === "duplicate_parameter") return;
    logEvent("provider.brevo_error", { status: response.status, detail: data.message });
    throw new Error("Brevo subscription failed");
  }
}

export async function subscribeLaylo(lead: z.infer<typeof leadSchema>) {
  const bypassReason = getLayloBypassReason();
  if (bypassReason) {
    logEvent("provider.laylo_bypassed", {
      reason: bypassReason,
      source: lead.source || "website",
      emailHash: createHash("sha256").update(scrubEmail(lead.email)).digest("hex").slice(0, 12),
    });
    return;
  }

  const endpoint = process.env.LAYLO_API_URL?.trim() || "https://laylo.com/api/graphql";
  const apiToken = getLayloApiToken();
  const normalizedEmail = scrubEmail(lead.email);
  const phoneNumber = normalizeLayloPhone(lead.phone);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      query: `
        mutation SubscribeToUser($email: String, $phoneNumber: String) {
          subscribeToUser(email: $email, phoneNumber: $phoneNumber)
        }
      `,
      variables: {
        email: normalizedEmail,
        phoneNumber: phoneNumber || null,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || Array.isArray(data.errors)) {
    logEvent("provider.laylo_error", {
      status: response.status,
      detail: Array.isArray(data.errors) ? data.errors[0]?.message : undefined,
    });
    throw new Error("Laylo subscription failed");
  }

  logEvent("provider.laylo_subscribed", {
    source: lead.source || "website",
    phoneProvided: Boolean(phoneNumber),
    emailHash: createHash("sha256").update(normalizedEmail).digest("hex").slice(0, 12),
  });
}

export async function subscribeConvertKit(lead: z.infer<typeof leadSchema>) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!apiKey || !formId) {
    throw new Error("CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID are required");
  }

  const endpoint = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;
  const attributionSource = getAttributionSource(lead);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      email: scrubEmail(lead.email),
      first_name: lead.firstName || undefined,
      fields: {
        source: attributionSource,
      },
    }),
  });

  if (response.status === 200 || response.status === 201 || response.status === 409) {
    return;
  }

  const data = await response.json().catch(() => ({}));
  logEvent("provider.convertkit_error", { status: response.status, detail: data.message });
  throw new Error("ConvertKit subscription failed");
}

export async function subscribeHubSpot(lead: z.infer<typeof leadSchema>) {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;
  if (!portalId || !formId) {
    throw new Error("HUBSPOT_PORTAL_ID and HUBSPOT_FORM_ID are required");
  }

  const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
  const fields = [
    { name: "email", value: scrubEmail(lead.email) },
    ...(lead.firstName ? [{ name: "firstname", value: lead.firstName }] : []),
    ...(lead.lastName ? [{ name: "lastname", value: lead.lastName }] : []),
  ];

  const contextUrl = getLeadContextUrl(lead);
  const context = {
    pageUri: contextUrl,
    pageName: lead.source || getAttributionSource(lead),
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields, context }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    logEvent("provider.hubspot_error", { status: response.status, detail: data.inlineMessage || data.message });
    throw new Error("HubSpot submission failed");
  }
}

export async function subscribeLead(provider: LeadProvider, lead: z.infer<typeof leadSchema>) {
  if (provider === "disabled") return;
  if (provider === "mailchimp") return subscribeMailchimp(lead);
  if (provider === "beehiiv") return subscribeBeehiiv(lead);
  if (provider === "hubspot") return subscribeHubSpot(lead);
  if (provider === "brevo") return subscribeBrevo(lead);
  if (provider === "emailoctopus") return subscribeEmailOctopus(lead);
  if (provider === "laylo") return subscribeLaylo(lead);
  return subscribeConvertKit(lead);
}
