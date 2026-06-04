import { getCookieConsentState } from "./cookieConsent";

// Dedicated Meta Pixel for the paid Sun(Sets) "Lake" campaign (sunsets.vip/lake).
// Kept separate from the brand pixel in metaPixel.ts so the campaign Dataset is
// never cross-contaminated. All events use `trackSingle` so that, on hosts where
// both pixels load (e.g. monolithproject.com/lake), the campaign events are
// scoped to this Dataset only. The id is hard-coded so marketing doesn't depend
// on env wiring; override with VITE_LAKE_PIXEL_ID if a swap is ever needed.
export const LAKE_PIXEL_ID =
  import.meta.env.VITE_LAKE_PIXEL_ID || "1049241148606250";
const LAKE_PIXEL_DEV_ENABLED =
  import.meta.env.VITE_LAKE_PIXEL_DEV_ENABLED === "true";

let pixelInitialized = false;

function isCampaignHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "sunsets.vip" ||
    host === "www.sunsets.vip" ||
    host === "monolithproject.com" ||
    host === "www.monolithproject.com"
  );
}

function isEnabled() {
  return (
    (import.meta.env.PROD || LAKE_PIXEL_DEV_ENABLED) &&
    isCampaignHost() &&
    Boolean(LAKE_PIXEL_ID) &&
    getCookieConsentState() !== "declined"
  );
}

function ensureFbq() {
  if (typeof window === "undefined") return false;

  if (!window.fbq) {
    const fbq = function (...args: any[]) {
      const self = fbq as any;
      if (self.callMethod) self.callMethod.apply(self, args);
      else self.queue.push(args);
    } as any;

    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];

    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript?.parentNode)
      firstScript.parentNode.insertBefore(script, firstScript);
    else document.head.appendChild(script);
  }

  if (!pixelInitialized) {
    const fbq = window.fbq;
    if (!fbq) return false;
    fbq("init", LAKE_PIXEL_ID);
    pixelInitialized = true;
  }

  return true;
}

export function trackLakePageView() {
  if (!isEnabled()) return;
  if (!ensureFbq()) return;
  window.fbq?.("trackSingle", LAKE_PIXEL_ID, "PageView");
}

// Fires the browser-side Lead with a shared eventID so Meta deduplicates it
// against the server-side CAPI Lead carrying the same id.
export function trackLakeLead(
  eventId: string,
  payload?: Record<string, unknown>
) {
  if (!isEnabled()) return false;
  if (!ensureFbq()) return false;

  window.fbq?.(
    "trackSingle",
    LAKE_PIXEL_ID,
    "Lead",
    {
      content_name: "First Access Signup - Chasing Sun(Sets)",
      content_category: "Waitlist",
      content_ids: ["laylo-sunsets-2026-07-04"],
      currency: "USD",
      value: 0,
      ...payload,
    },
    { eventID: eventId }
  );

  return true;
}
