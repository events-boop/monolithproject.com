type OutboundGroup =
  | "tickets"
  | "waitlist"
  | "media"
  | "gallery"
  | "forms"
  | "social";
type QueryValue = string | string[] | null | undefined;
type QuerySource = URLSearchParams | Record<string, QueryValue | unknown>;

const FALLBACK_POSH_URL =
  "https://posh.vip/owner/groups/6531870aeffdea89e97f7642/events/6a0b9cd3ad1a25534c3beed7/visuals";
const FALLBACK_LAYLO_URL = "https://laylo.com/monolithproject/luYXPr/details";
const FALLBACK_SUNSETS_RECAP_URL = "https://youtu.be/9R6XH7JZlJI";
const FALLBACK_SUNSETS_SOUNDCLOUD_URL =
  "https://soundcloud.com/chasing-sun-sets";
const FALLBACK_SUNSETS_GALLERY_URL =
  "https://khrysseesyou.pic-time.com/-chasingsunsets4thofjuly/gallery";
const FALLBACK_SUNSETS_VIP_URL = "https://chasingsunsets.vip";
const FALLBACK_INSTAGRAM_SUNSETS_URL =
  "https://instagram.com/chasingsunsets.music";
const FALLBACK_TIKTOK_URL = "https://tiktok.com/@monolithproject";
const FALLBACK_SPOTIFY_URL =
  "https://open.spotify.com/search/chasing%20sunsets";
const FALLBACK_X_URL = "https://x.com/monolithproject";
const OUTBOUND_TRACKING_PARAMS = [
  "session_id",
  "event_slug",
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

const featuredTicketUrl =
  readHttpsEnv("POSH_TICKET_URL", "OUTBOUND_TICKETS_FEATURED_URL") ||
  FALLBACK_POSH_URL;
const generalWaitlistUrl =
  readHttpsEnv("LAYLO_URL", "OUTBOUND_WAITLIST_GENERAL_URL") ||
  FALLBACK_LAYLO_URL;

const ticketDestinations: Record<string, string> = Object.assign(
  Object.create(null),
  {
    featured: featuredTicketUrl,
    "css-jul04":
      readHttpsEnv("OUTBOUND_TICKETS_CSS_JUL04_URL") || featuredTicketUrl,
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
      readHttpsEnv("OUTBOUND_WAITLIST_CHASING_SUNSETS_URL") ||
      generalWaitlistUrl,
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

function getOwnDestination(
  destinations: Record<string, string>,
  key: string
): string | null {
  if (Object.prototype.hasOwnProperty.call(destinations, key)) {
    return destinations[key] || null;
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
    return (
      getOwnDestination(ticketDestinations, normalizedKey) ||
      ticketDestinations.featured ||
      null
    );
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

export function decorateOutboundDestination(
  destination: string,
  source: QuerySource
) {
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
