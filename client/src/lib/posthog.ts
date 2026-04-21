import { runWhenIdle } from "./idle";
import { hasAnalyticsConsent } from "./cookieConsent";
import { getAttributionPayload } from "./attribution";

type PostHogClient = (typeof import("posthog-js"))["default"];
type PostHogProperties = Record<string, string | number | boolean | null | undefined>;
type PendingCapture = {
  eventName: string;
  properties?: PostHogProperties;
};

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

let client: PostHogClient | null = null;
let loading: Promise<PostHogClient | null> | null = null;
let initScheduled = false;
let pendingPageview = false;
let pendingPageviewProperties: PostHogProperties | undefined;
const pendingCaptures: PendingCapture[] = [];

function isTrackingHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "monolithproject.com" ||
    host === "www.monolithproject.com" ||
    host === "themonolithproject.com" ||
    host === "www.themonolithproject.com"
  );
}

function isEnabled() {
  // Avoid penalizing Lighthouse / previews with analytics scripts.
  return import.meta.env.PROD && isTrackingHost() && Boolean(POSTHOG_KEY) && hasAnalyticsConsent();
}

function compactProperties(properties: PostHogProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ) as PostHogProperties;
}

function getPostHogAttributionProperties(): PostHogProperties {
  const attribution = getAttributionPayload();

  return compactProperties({
    session_id: attribution.sessionId,
    page_url: attribution.pageUrl,
    landing_page_url: attribution.landingPageUrl,
    referrer_domain: attribution.referrerDomain,
    first_referrer_domain: attribution.firstReferrerDomain,
    first_touch_at: attribution.firstTouchAt,
    last_touch_at: attribution.lastTouchAt,
    utm_source: attribution.utmSource,
    utm_medium: attribution.utmMedium,
    utm_campaign: attribution.utmCampaign,
    utm_term: attribution.utmTerm,
    utm_content: attribution.utmContent,
    first_utm_source: attribution.firstUtmSource,
    first_utm_medium: attribution.firstUtmMedium,
    first_utm_campaign: attribution.firstUtmCampaign,
    first_utm_term: attribution.firstUtmTerm,
    first_utm_content: attribution.firstUtmContent,
    last_utm_source: attribution.lastUtmSource,
    last_utm_medium: attribution.lastUtmMedium,
    last_utm_campaign: attribution.lastUtmCampaign,
    last_utm_term: attribution.lastUtmTerm,
    last_utm_content: attribution.lastUtmContent,
    gclid: attribution.gclid,
    fbclid: attribution.fbclid,
    ttclid: attribution.ttclid,
    msclkid: attribution.msclkid,
  });
}

function withAttributionProperties(properties?: PostHogProperties) {
  return compactProperties({
    ...getPostHogAttributionProperties(),
    ...compactProperties(properties || {}),
  });
}

function flushPendingCaptures(ph: PostHogClient) {
  if (pendingPageview) {
    ph.capture("$pageview", pendingPageviewProperties);
    pendingPageview = false;
    pendingPageviewProperties = undefined;
  }

  while (pendingCaptures.length > 0) {
    const capture = pendingCaptures.shift();
    if (!capture) continue;
    ph.capture(capture.eventName, capture.properties);
  }
}

async function loadPostHog(): Promise<PostHogClient | null> {
  if (!isEnabled()) return null;
  if (client) return client;
  if (loading) return loading;

  loading = import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY as string, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        // We'll track SPA route changes ourselves.
        capture_pageview: false,
      });
      client = posthog;
      flushPendingCaptures(posthog);
      return posthog;
    })
    .catch(() => null);

  return loading;
}

export function schedulePostHogInit() {
  if (initScheduled) return;
  if (!isEnabled()) return;
  initScheduled = true;

  runWhenIdle(() => {
    void loadPostHog().then((ph) => {
      if (!ph) return;
      flushPendingCaptures(ph);
    });
  }, 2500);
}

// Safe to call on every route change; if PostHog hasn't loaded yet we queue one.
export function queuePostHogPageview() {
  if (!isEnabled()) return;
  const properties = withAttributionProperties();
  pendingPageview = true;
  pendingPageviewProperties = properties;
  if (!client) return;

  client.capture("$pageview", properties);
  pendingPageview = false;
  pendingPageviewProperties = undefined;
}

export function capturePostHogEvent(eventName: string, properties?: PostHogProperties) {
  if (!isEnabled()) return;
  const enrichedProperties = withAttributionProperties(properties);

  if (client) {
    client.capture(eventName, enrichedProperties);
    return;
  }

  pendingCaptures.push({ eventName, properties: enrichedProperties });
  schedulePostHogInit();
}
