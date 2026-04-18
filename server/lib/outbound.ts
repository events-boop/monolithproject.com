type OutboundGroup = "tickets" | "waitlist";

const FALLBACK_POSH_URL =
  "https://posh.vip/e/untold-storyseason-iii-episode-ivautograf-alhambra-palace-west-loop-chicago-friday-march-21-2026";
const FALLBACK_LAYLO_URL = "https://laylo.com/monolithproject";

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
