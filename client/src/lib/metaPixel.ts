import { runWhenIdle } from "./idle";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: unknown;
  }
}

// Keep this default in code so marketing doesn't depend on env wiring.
// Override with VITE_META_PIXEL_ID if needed.
const DEFAULT_PIXEL_ID = "166134370742863";
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
    host === "www.themonolithproject.com"
  );
}

function isEnabled() {
  // Avoid penalizing Lighthouse / previews with third-party tags.
  return import.meta.env.PROD && isTrackingHost() && Boolean(PIXEL_ID);
}

function ensureFbq(pixelId: string) {
  if (typeof window === "undefined") return;
  if (window.fbq) return;

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
  if (firstScript?.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
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

