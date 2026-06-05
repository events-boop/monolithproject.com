import { createHash } from "crypto";
import { logEvent } from "../lib/logging";

// Meta Conversions API (server-side). Sends a hashed, first-party copy of the
// on-site Lead conversion so signups dropped by ad blockers / ITP still reach
// Meta. No-ops unless META_CAPI_ACCESS_TOKEN is configured, and never throws
// into the request path.

function getConfig() {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!accessToken) return null;
  return {
    accessToken,
    graphVersion: process.env.META_GRAPH_API_VERSION?.trim() || "v21.0",
    testEventCode: process.env.META_CAPI_TEST_EVENT_CODE?.trim() || undefined,
  };
}

const LAKE_PIXEL_ID = "1049241148606250";

const metaCapiRuntimeStatus: {
  lastError: string | null;
  lastFailureAt: string | null;
  lastPixelId: string | null;
  lastSuccessAt: string | null;
} = {
  lastError: null,
  lastFailureAt: null,
  lastPixelId: null,
  lastSuccessAt: null,
};

export function isMetaCapiEnabled() {
  return Boolean(getConfig());
}

function getLakePixelId() {
  return process.env.META_LAKE_PIXEL_ID?.trim() || LAKE_PIXEL_ID;
}

function recordMetaCapiFailure(message: string, pixelId?: string) {
  metaCapiRuntimeStatus.lastError = message;
  metaCapiRuntimeStatus.lastFailureAt = new Date().toISOString();
  if (pixelId) metaCapiRuntimeStatus.lastPixelId = pixelId;
}

function recordMetaCapiSuccess(pixelId: string) {
  metaCapiRuntimeStatus.lastError = null;
  metaCapiRuntimeStatus.lastPixelId = pixelId;
  metaCapiRuntimeStatus.lastSuccessAt = new Date().toISOString();
}

export function getMetaCapiHealthStatus() {
  const config = getConfig();
  return {
    capi: Boolean(config),
    pixel_id: getLakePixelId(),
    graph_version: config?.graphVersion || process.env.META_GRAPH_API_VERSION?.trim() || "v21.0",
    test_event_code_enabled: Boolean(config?.testEventCode),
    last_error: metaCapiRuntimeStatus.lastError,
    last_failure_at: metaCapiRuntimeStatus.lastFailureAt,
    last_pixel_id: metaCapiRuntimeStatus.lastPixelId,
    last_success_at: metaCapiRuntimeStatus.lastSuccessAt,
  };
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

// Email, name, state: trim + lowercase before hashing (Meta normalization).
function hashNormalized(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return normalized ? sha256(normalized) : undefined;
}

// City: also strip internal whitespace and punctuation.
function hashCity(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase().replace(/[^a-z]/g, "");
  return normalized ? sha256(normalized) : undefined;
}

// Phone: digits only before hashing.
function hashPhone(value?: string | null) {
  if (!value) return undefined;
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? sha256(digits) : undefined;
}

// fbc is the click-id cookie value. If absent, reconstruct it from fbclid per
// Meta's `fb.<subdomainIndex>.<clickTimeMs>.<fbclid>` format.
function deriveFbc(eventTimeMs: number, fbc?: string, fbclid?: string) {
  if (fbc) return fbc;
  if (!fbclid) return undefined;
  return `fb.1.${eventTimeMs}.${fbclid}`;
}

export interface LeadConversionInput {
  eventId: string;
  // Required so each caller explicitly chooses the right Dataset/Pixel
  // instead of silently falling back to the wrong campaign.
  pixelId: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  eventSourceUrl?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  customData?: Record<string, unknown>;
}

export async function sendLeadConversion(input: LeadConversionInput): Promise<void> {
  const config = getConfig();
  if (!config) return;
  const pixelId = input.pixelId.trim();
  if (!pixelId) {
    recordMetaCapiFailure("Missing Meta Pixel/Dataset ID");
    logEvent("meta_capi.missing_pixel_id", { eventId: input.eventId });
    return;
  }

  const eventTimeMs = Date.now();

  const userData: Record<string, unknown> = {};
  const em = hashNormalized(input.email);
  if (em) userData.em = [em];
  const ph = hashPhone(input.phone);
  if (ph) userData.ph = [ph];
  const fn = hashNormalized(input.firstName);
  if (fn) userData.fn = [fn];
  const ln = hashNormalized(input.lastName);
  if (ln) userData.ln = [ln];
  const ct = hashCity(input.city);
  if (ct) userData.ct = [ct];
  const st = hashNormalized(input.state);
  if (st) userData.st = [st];
  if (input.clientIp && input.clientIp !== "unknown") {
    userData.client_ip_address = input.clientIp;
  }
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  const fbc = deriveFbc(eventTimeMs, input.fbc, input.fbclid);
  if (fbc) userData.fbc = fbc;

  const event: Record<string, unknown> = {
    event_name: "Lead",
    event_time: Math.floor(eventTimeMs / 1000),
    event_id: input.eventId,
    action_source: "website",
    user_data: userData,
  };
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;
  if (input.customData) event.custom_data = input.customData;

  const body: Record<string, unknown> = {
    data: [event],
    access_token: config.accessToken,
  };
  if (config.testEventCode) body.test_event_code = config.testEventCode;

  const url = `https://graph.facebook.com/${config.graphVersion}/${pixelId}/events`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      recordMetaCapiFailure(`HTTP ${response.status}: ${text.slice(0, 300)}`, pixelId);
      logEvent("meta_capi.lead_failed", {
        eventId: input.eventId,
        status: response.status,
        body: text.slice(0, 300),
      });
      return;
    }

    recordMetaCapiSuccess(pixelId);
    logEvent("meta_capi.lead_sent", { eventId: input.eventId });
  } catch (error) {
    recordMetaCapiFailure(
      error instanceof Error ? error.message : "Unknown Meta CAPI error",
      pixelId
    );
    logEvent("meta_capi.lead_error", {
      eventId: input.eventId,
      message: error instanceof Error ? error.message : "unknown",
    });
  }
}
