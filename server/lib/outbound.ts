import {
  SUNSETS_AUG22_TICKET_KEY,
  SUNSETS_JULY4_EVENT_SLUG,
  SUNSETS_JULY4_TICKET_KEY,
  SUNSETS_JULY4_TICKET_UTMS,
  SUNSETS_SEASON_PASS_TICKET_KEY,
  SUNSETS_SEP19_TICKET_KEY,
  getSunsetsTicketRouteMeta,
  isSunsetsJuly4TicketRoute,
} from "../../shared/events/sunsets-ticketing";

type OutboundGroup =
  | "tickets"
  | "waitlist"
  | "media"
  | "gallery"
  | "forms"
  | "social";
type QueryValue = string | string[] | null | undefined;
type QuerySource = URLSearchParams | Record<string, QueryValue | unknown>;

// Must be a public destination: the previous value was a posh.vip /owner/…
// admin URL that showed buyers a login wall when the env vars were unset.
const FALLBACK_POSH_URL = "https://monolithproject.com/tickets";
// Official Posh checkouts — published by the owner 2026-08-05. The env vars
// still win when set; these keep the rails live with zero env dependency.
const FALLBACK_SUNSETS_AUG22_POSH_URL =
  "https://posh.vip/e/chasing-sunsets-ii-house-of-friends-preview";
const FALLBACK_SUNSETS_SEP19_POSH_URL =
  "https://posh.vip/e/chasing-sunsets-iii-joezi-x-massuma";
const FALLBACK_LAYLO_URL = "https://laylo.com/monolithproject/m/IQ5HaR";
const FALLBACK_BENCHEK_LAYLO_URL = "https://laylo.com/monolithproject/vhX7ZX";
const FALLBACK_SUNSETS_RECAP_URL = "https://youtu.be/9R6XH7JZlJI";
const FALLBACK_SUNSETS_SOUNDCLOUD_URL =
  "https://soundcloud.com/chasing-sun-sets";
const FALLBACK_SUNSETS_GALLERY_URL =
  "https://khrysseesyou.pic-time.com/-chasingsunsets4thofjuly/gallery";
const FALLBACK_AUTOGRAF_MAR21_GALLERY_URL =
  "https://pogistudios.pixieset.com/monolithproject/";
// chasingsunsets.vip DNS is parked (not on Netlify), so falling back to it
// stranded VIP clicks on a parking page. The on-site /vip page is evergreen.
const FALLBACK_SUNSETS_VIP_URL = "https://monolithproject.com/vip";
const FALLBACK_INSTAGRAM_SUNSETS_URL =
  "https://instagram.com/chasingsunsets.music";
const FALLBACK_TIKTOK_URL = "https://tiktok.com/@monolithproject";
const FALLBACK_SPOTIFY_URL =
  "https://open.spotify.com/search/chasing%20sunsets";
const FALLBACK_X_URL = "https://x.com/monolithproject";
const OUTBOUND_TRACKING_PARAMS = [
  "session_id",
  "event_slug",
  "ref",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "promo",
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

const featuredTicketUrl =
  readHttpsEnv("POSH_TICKET_URL", "OUTBOUND_TICKETS_FEATURED_URL") ||
  FALLBACK_POSH_URL;
const generalWaitlistUrl =
  readHttpsEnv(
    "OUTBOUND_LAYLO_URL",
    "LAYLO_URL",
    "OUTBOUND_WAITLIST_GENERAL_URL"
  ) || FALLBACK_LAYLO_URL;

const ticketDestinations: Record<string, string | null> = Object.assign(
  Object.create(null),
  {
    featured: featuredTicketUrl,
    // SUN(SETS) July 4 — resolves to null when env is unset so the route
    // can serve a clean "Tickets coming soon" page instead of silently
    // redirecting to the featured fallback.
    [SUNSETS_JULY4_TICKET_KEY]:
      readHttpsEnv(
        "OUTBOUND_TICKETS_CSS_JUL04_URL",
        "NEXT_PUBLIC_POSH_SUNSETS_JULY4_URL"
      ) ?? null,
    [SUNSETS_AUG22_TICKET_KEY]:
      readHttpsEnv("OUTBOUND_TICKETS_CSS_AUG22_URL") ||
      FALLBACK_SUNSETS_AUG22_POSH_URL,
    [SUNSETS_SEP19_TICKET_KEY]:
      readHttpsEnv("OUTBOUND_TICKETS_CSS_SEP19_URL") ||
      FALLBACK_SUNSETS_SEP19_POSH_URL,
    // Season Pass — null until the Posh season-pass URL is wired, so the route
    // shows "coming soon" rather than redirecting to a single-date event.
    [SUNSETS_SEASON_PASS_TICKET_KEY]:
      readHttpsEnv("OUTBOUND_TICKETS_SEASON_PASS_URL") ?? null,
    "mp-autograf-mar21":
      readHttpsEnv("OUTBOUND_TICKETS_MP_AUTOGRAF_MAR21_URL") ||
      featuredTicketUrl,
    "us-s3e3":
      readHttpsEnv("OUTBOUND_TICKETS_US_S3E3_URL") || featuredTicketUrl,
  }
);

const waitlistDestinations: Record<string, string> = Object.assign(
  Object.create(null),
  {
    general: generalWaitlistUrl,
    "monolith-project":
      readHttpsEnv("OUTBOUND_WAITLIST_MONOLITH_URL") || generalWaitlistUrl,
    "chasing-sunsets":
      readHttpsEnv(
        "OUTBOUND_WAITLIST_CHASING_SUNSETS_URL",
        "OUTBOUND_LAYLO_SUNSETS_URL",
        "OUTBOUND_LAYLO_URL"
      ) || generalWaitlistUrl,
    "sunsets-manychat":
      readHttpsEnv("OUTBOUND_WAITLIST_SUNSETS_MANYCHAT_URL") ||
      generalWaitlistUrl,
    benchek:
      readHttpsEnv("OUTBOUND_WAITLIST_BENCHEK_URL") ||
      FALLBACK_BENCHEK_LAYLO_URL,
    "untold-story":
      readHttpsEnv("OUTBOUND_WAITLIST_UNTOLD_STORY_URL") || generalWaitlistUrl,
  }
);

const mediaDestinations: Record<string, string> = Object.assign(
  Object.create(null),
  {
    "sunsets-recap":
      readHttpsEnv("OUTBOUND_MEDIA_SUNSETS_RECAP_URL", "YOUTUBE_RECAP_URL") ||
      FALLBACK_SUNSETS_RECAP_URL,
    "sunsets-soundcloud":
      readHttpsEnv(
        "OUTBOUND_MEDIA_SUNSETS_SOUNDCLOUD_URL",
        "SOUNDCLOUD_SUNSETS_URL"
      ) || FALLBACK_SUNSETS_SOUNDCLOUD_URL,
  }
);

const galleryDestinations: Record<string, string> = Object.assign(
  Object.create(null),
  {
    "chasing-sunsets":
      readHttpsEnv(
        "OUTBOUND_GALLERY_CHASING_SUNSETS_URL",
        "PICTIME_CHASING_SUNSETS_URL"
      ) || FALLBACK_SUNSETS_GALLERY_URL,
    "autograf-mar21":
      readHttpsEnv("OUTBOUND_GALLERY_AUTOGRAF_MAR21_URL") ||
      FALLBACK_AUTOGRAF_MAR21_GALLERY_URL,
  }
);

const formDestinations: Record<string, string> = Object.assign(
  Object.create(null),
  {
    "sunsets-vip":
      readHttpsEnv(
        "OUTBOUND_FORMS_SUNSETS_VIP_URL",
        "FILLOUT_SUNSETS_VIP_URL"
      ) || FALLBACK_SUNSETS_VIP_URL,
  }
);

const socialDestinations: Record<string, string> = Object.assign(
  Object.create(null),
  {
    "instagram-sunsets":
      readHttpsEnv(
        "OUTBOUND_SOCIAL_INSTAGRAM_SUNSETS_URL",
        "INSTAGRAM_SUNSETS_URL"
      ) || FALLBACK_INSTAGRAM_SUNSETS_URL,
    tiktok:
      readHttpsEnv("OUTBOUND_SOCIAL_TIKTOK_URL", "TIKTOK_URL") ||
      FALLBACK_TIKTOK_URL,
    spotify:
      readHttpsEnv("OUTBOUND_SOCIAL_SPOTIFY_URL", "SPOTIFY_URL") ||
      FALLBACK_SPOTIFY_URL,
    x: readHttpsEnv("OUTBOUND_SOCIAL_X_URL", "X_URL") || FALLBACK_X_URL,
    // WhatsApp community invite links get rotated/revoked, so the destination
    // stays env-driven. Falls back to the general Laylo waitlist until
    // OUTBOUND_SOCIAL_WHATSAPP_URL is set.
    whatsapp:
      readHttpsEnv("OUTBOUND_SOCIAL_WHATSAPP_URL", "WHATSAPP_COMMUNITY_URL") ||
      generalWaitlistUrl,
  }
);

const FORBIDDEN_KEYS = new Set([
  "__proto__",
  "constructor",
  "tostring",
  "valueof",
  "hasownproperty",
  "isprototypeof",
  "propertyisenumerable",
  "tolocalestring",
]);

// Sentinel value returned when a ticket destination is explicitly set to null
// (env var missing) so the route can show a "Tickets coming soon" page.
export const TICKETS_COMING_SOON = "__coming_soon__" as const;

function getOwnDestination(
  destinations: Record<string, string | null>,
  key: string
): string | null {
  if (Object.prototype.hasOwnProperty.call(destinations, key)) {
    const value = destinations[key];
    // Explicitly null means "coming soon" — return sentinel instead of falling through.
    if (value === null) return TICKETS_COMING_SOON;
    return value || null;
  }
  return null;
}

export function resolveOutboundDestination(group: string, key: string) {
  const normalizedGroup = group.trim().toLowerCase() as OutboundGroup;
  const normalizedKey = key.trim().toLowerCase();

  if (FORBIDDEN_KEYS.has(normalizedKey)) {
    return null;
  }

  if (normalizedGroup === "tickets") {
    const dest = getOwnDestination(ticketDestinations, normalizedKey);
    // If the key was found but explicitly null, return the sentinel — do not
    // fall through to the featured URL so the caller can show a coming-soon page.
    if (dest === TICKETS_COMING_SOON) return TICKETS_COMING_SOON;

    if (getSunsetsTicketRouteMeta(normalizedGroup, normalizedKey)) {
      return dest;
    }

    return dest || ticketDestinations.featured || null;
  }

  if (normalizedGroup === "waitlist") {
    return (
      getOwnDestination(waitlistDestinations, normalizedKey) ||
      waitlistDestinations.general ||
      null
    );
  }

  if (normalizedGroup === "media") {
    return getOwnDestination(mediaDestinations, normalizedKey);
  }

  if (normalizedGroup === "gallery") {
    return getOwnDestination(galleryDestinations, normalizedKey);
  }

  if (normalizedGroup === "forms") {
    return getOwnDestination(formDestinations, normalizedKey);
  }

  if (normalizedGroup === "social") {
    return getOwnDestination(socialDestinations, normalizedKey);
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

function truncateTrackingParam(value: string, maxLength = 200) {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, maxLength);
  const lastAmpersand = truncated.lastIndexOf("&");
  if (lastAmpersand > 0) {
    return truncated.slice(0, lastAmpersand);
  }

  const lastPercent = truncated.lastIndexOf("%");
  if (lastPercent >= 0 && truncated.length - lastPercent < 3) {
    return truncated.slice(0, lastPercent);
  }

  return truncated;
}

export function decorateOutboundDestination(
  destination: string,
  source: QuerySource,
  route?: { group?: string; key?: string }
) {
  try {
    const url = new URL(destination);
    const isSunsetsTicket =
      route?.group && route?.key
        ? isSunsetsJuly4TicketRoute(route.group, route.key)
        : false;

    if (isSunsetsTicket) {
      for (const [key, value] of Object.entries(SUNSETS_JULY4_TICKET_UTMS)) {
        url.searchParams.set(key, value);
      }
      if (!url.searchParams.has("event_slug")) {
        url.searchParams.set("event_slug", SUNSETS_JULY4_EVENT_SLUG);
      }
    }

    for (const param of OUTBOUND_TRACKING_PARAMS) {
      const value = readQueryValue(source, param)?.trim();
      if (value && !url.searchParams.has(param)) {
        url.searchParams.set(param, truncateTrackingParam(value));
      }
    }

    return url.toString();
  } catch {
    return destination;
  }
}
