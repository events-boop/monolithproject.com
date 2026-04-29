type OutboundGroup = "tickets" | "waitlist";
type QueryValue = string | string[] | null | undefined;
type QuerySource = URLSearchParams | Record<string, QueryValue | unknown>;

const FALLBACK_POSH_URL =
  "https://posh.vip/e/eran-hersh-untold-story-iv-the-360-experience-a-monolith-project";
const FALLBACK_LAYLO_URL = "https://laylo.com/monolithproject";
const OUTBOUND_TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

function readHttpsEnv(...keys: string[]) {
  for (const key of keys) {
    const rawValue = process.env[key]?.trim();
    if (!rawValue) continue;

    try {
      const url = new URL(rawValue);
      if (url.protocol === "https:") {
        return url.toString();
      }
    } catch {
      continue;
    }
  }

  return undefined;
}

const featuredTicketUrl = readHttpsEnv("POSH_TICKET_URL", "OUTBOUND_TICKETS_FEATURED_URL") || FALLBACK_POSH_URL;
const generalWaitlistUrl = readHttpsEnv("LAYLO_URL", "OUTBOUND_WAITLIST_GENERAL_URL") || FALLBACK_LAYLO_URL;

const ticketDestinations: Record<string, string> = {
  featured: featuredTicketUrl,
  "mp-autograf-mar21": readHttpsEnv("OUTBOUND_TICKETS_MP_AUTOGRAF_MAR21_URL") || featuredTicketUrl,
  "us-s3e3": readHttpsEnv("OUTBOUND_TICKETS_US_S3E3_URL") || featuredTicketUrl,
};

const waitlistDestinations: Record<string, string> = {
  general: generalWaitlistUrl,
  "monolith-project": readHttpsEnv("OUTBOUND_WAITLIST_MONOLITH_URL") || generalWaitlistUrl,
  "chasing-sunsets": readHttpsEnv("OUTBOUND_WAITLIST_CHASING_SUNSETS_URL") || generalWaitlistUrl,
  "untold-story": readHttpsEnv("OUTBOUND_WAITLIST_UNTOLD_STORY_URL") || generalWaitlistUrl,
};

export function resolveOutboundDestination(group: string, key: string) {
  const normalizedGroup = group.trim().toLowerCase() as OutboundGroup;
  const normalizedKey = key.trim().toLowerCase();

  if (normalizedGroup === "tickets") {
    return ticketDestinations[normalizedKey] || ticketDestinations.featured || null;
  }

  if (normalizedGroup === "waitlist") {
    return waitlistDestinations[normalizedKey] || waitlistDestinations.general || null;
  }

  return null;
}

function readQueryValue(source: QuerySource, key: string) {
  if (source instanceof URLSearchParams) {
    return source.get(key) || undefined;
  }

  const raw = source[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value : undefined;
}

export function decorateOutboundDestination(destination: string, source: QuerySource) {
  try {
    const url = new URL(destination);

    for (const param of OUTBOUND_TRACKING_PARAMS) {
      const value = readQueryValue(source, param)?.trim();
      if (value && !url.searchParams.has(param)) {
        url.searchParams.set(param, value.slice(0, 200));
      }
    }

    return url.toString();
  } catch {
    return destination;
  }
}
