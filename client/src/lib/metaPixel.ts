import { runWhenIdle } from "./idle";
import { getCookieConsentState } from "./cookieConsent";

interface FbqFunction {
  (...args: unknown[]): void;
  callMethod?: { apply: (thisArg: FbqFunction, args: unknown[]) => void };
  queue: unknown[][];
  push?: FbqFunction;
  loaded?: boolean;
  version?: string;
}

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: unknown;
  }
}

// Keep this default in code so marketing doesn't depend on env wiring.
// Override with VITE_META_PIXEL_ID if needed.
const DEFAULT_PIXEL_ID = "1049241148606250";
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || DEFAULT_PIXEL_ID;

let initScheduled = false;
let pendingPageview = false;

function isTrackingHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "monolithproject.com" ||
    host === "www.monolithproject.com" ||
    host === "themonolithproject.com" ||
    host === "www.themonolithproject.com" ||
    host === "sunsets.vip" ||
    host === "www.sunsets.vip" ||
    host === "untold.vip" ||
    host === "www.untold.vip" ||
    host === "houseoffriends.vip" ||
    host === "www.houseoffriends.vip"
  );
}

function isEnabled() {
  // Avoid penalizing Lighthouse / previews with third-party tags.
  return (
    import.meta.env.PROD &&
    isTrackingHost() &&
    Boolean(PIXEL_ID) &&
    getCookieConsentState() !== "declined"
  );
}

function ensureFbq(pixelId: string) {
  if (typeof window === "undefined") return;
  if (window.fbq) return;

  const fbq: FbqFunction = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  };

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

  fbq("init", pixelId);
}

export function scheduleMetaPixelInit() {
  if (initScheduled) return;
  if (!isEnabled()) return;
  initScheduled = true;

  runWhenIdle(() => {
    ensureFbq(PIXEL_ID as string);
    if (!pendingPageview) return;
    window.fbq?.("track", "PageView");
    pendingPageview = false;
  }, 3500);
}

// Safe to call on every route change; if fbq isn't ready yet we queue one.
export function queueMetaPixelPageview() {
  if (!isEnabled()) return;
  pendingPageview = true;
  if (!window.fbq) return;

  window.fbq("track", "PageView");
  pendingPageview = false;
}

export function trackMetaPixelLead(payload?: Record<string, unknown>) {
  if (!isEnabled()) return false;

  ensureFbq(PIXEL_ID as string);
  window.fbq?.("track", "Lead", {
    content_name: "First Access Signup - Chasing Sun(Sets)",
    content_category: "Waitlist",
    content_ids: ["laylo-sunsets-2026-07-04"],
    currency: "USD",
    value: 0,
    ...payload,
  });

  return true;
}
