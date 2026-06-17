import { z } from "zod";
import { leadSchema, type LeadProvider } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { scrubEmail } from "../lib/security";

type Lead = z.infer<typeof leadSchema>;

export interface AirtableLeadMirrorInput {
  lead: Lead;
  provider: LeadProvider;
  requestId: string;
  idempotencyKey: string;
  submittedAt?: string;
}

interface AirtableSyncConfig {
  apiKey: string;
  baseId: string;
  leadsTable: string;
  apiBaseUrl: string;
}

const DEFAULT_AIRTABLE_API_BASE_URL = "https://api.airtable.com/v0";
const DEFAULT_TIMEOUT_MS = 4000;
const RAW_PAYLOAD_LIMIT = 8000;

function readEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function isExplicitlyDisabled() {
  const value = readEnv("AIRTABLE_SYNC_ENABLED").toLowerCase();
  return (
    value === "false" || value === "0" || value === "off" || value === "no"
  );
}

function readConfig(): AirtableSyncConfig | null {
  if (isExplicitlyDisabled()) return null;

  const apiKey = readEnv("AIRTABLE_API_KEY");
  const baseId = readEnv("AIRTABLE_BASE_ID");
  const leadsTable =
    readEnv("AIRTABLE_LEADS_TABLE_ID") || readEnv("AIRTABLE_LEADS_TABLE_NAME");

  if (!apiKey || !baseId || !leadsTable) {
    return null;
  }

  return {
    apiKey,
    baseId,
    leadsTable,
    apiBaseUrl:
      readEnv("AIRTABLE_API_BASE_URL") || DEFAULT_AIRTABLE_API_BASE_URL,
  };
}

export function isAirtableSyncEnabled() {
  return Boolean(readConfig());
}

function buildAirtableUrl(config: AirtableSyncConfig) {
  const apiBaseUrl = config.apiBaseUrl.replace(/\/+$/, "");
  return `${apiBaseUrl}/${encodeURIComponent(config.baseId)}/${encodeURIComponent(config.leadsTable)}`;
}

function compactFields(fields: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(fields).filter(
      ([, value]) => value !== undefined && value !== ""
    )
  );
}

function stringifyPayload(lead: Lead) {
  return JSON.stringify({
    ...lead,
    email: scrubEmail(lead.email),
  }).slice(0, RAW_PAYLOAD_LIMIT);
}

function buildLeadFields(input: AirtableLeadMirrorInput) {
  const { lead, provider, requestId, idempotencyKey } = input;
  const submittedAt = input.submittedAt || new Date().toISOString();

  return compactFields({
    Email: scrubEmail(lead.email),
    Phone: lead.phone,
    "First Name": lead.firstName,
    "Last Name": lead.lastName,
    "Instagram Handle": lead.instagramHandle,
    City: lead.city,
    State: lead.state,
    Source: lead.source || "website",
    "Form Type": lead.formType,
    "Funnel ID": lead.funnelId,
    "Offer ID": lead.offerId,
    "Event Interest": lead.eventInterest,
    "Event Series": lead.eventSeries,
    "Event Title": lead.eventTitle,
    "Interest Tags": lead.interestTags?.join(", "),
    "UTM Source": lead.utmSource,
    "UTM Medium": lead.utmMedium,
    "UTM Campaign": lead.utmCampaign,
    "UTM Content": lead.utmContent,
    "First UTM Source": lead.firstUtmSource,
    "Last UTM Source": lead.lastUtmSource,
    "Page URL": lead.pageUrl,
    "Landing Page URL": lead.landingPageUrl,
    Referrer: lead.referrer,
    "Referrer Domain": lead.referrerDomain || lead.firstReferrerDomain,
    "Session ID": lead.sessionId,
    Provider: provider,
    "Request ID": requestId,
    "Idempotency Key": idempotencyKey,
    "Submitted At": submittedAt,
    "Raw Payload": stringifyPayload(lead),
  });
}

export async function mirrorLeadToAirtable(
  input: AirtableLeadMirrorInput
): Promise<void> {
  const config = readConfig();
  if (!config) return;

  const url = buildAirtableUrl(config);
  const fields = buildLeadFields(input);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        typecast: true,
        records: [{ fields }],
      }),
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      logEvent("airtable.lead_mirror_failed", {
        requestId: input.requestId,
        status: response.status,
        body: body.slice(0, 300),
      });
      return;
    }

    logEvent("airtable.lead_mirrored", {
      requestId: input.requestId,
      source: input.lead.source || "website",
      formType: input.lead.formType || null,
    });
  } catch (error) {
    logEvent("airtable.lead_mirror_error", {
      requestId: input.requestId,
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}
