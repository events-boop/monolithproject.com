import { createHash } from "crypto";
import { z } from "zod";
import { leadSchema, type LeadProvider } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { scrubEmail } from "../lib/security";

function getAttributionSource(lead: z.infer<typeof leadSchema>) {
  return lead.lastUtmSource || lead.utmSource || lead.source || "website";
}

function getLeadContextUrl(lead: z.infer<typeof leadSchema>) {
  return lead.pageUrl || lead.landingPageUrl || "https://monolithproject.com";
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
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is required");
  }

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
  if (provider === "mailchimp") return subscribeMailchimp(lead);
  if (provider === "beehiiv") return subscribeBeehiiv(lead);
  if (provider === "hubspot") return subscribeHubSpot(lead);
  if (provider === "brevo") return subscribeBrevo(lead);
  if (provider === "emailoctopus") return subscribeEmailOctopus(lead);
  return subscribeConvertKit(lead);
}
