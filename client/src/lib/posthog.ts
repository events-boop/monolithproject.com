import { runWhenIdle } from "./idle";

type PostHogClient = (typeof import("posthog-js"))["default"];

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

let client: PostHogClient | null = null;
let loading: Promise<PostHogClient | null> | null = null;
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
  // Avoid penalizing Lighthouse / previews with analytics scripts.
  return import.meta.env.PROD && isTrackingHost() && Boolean(POSTHOG_KEY);
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
      if (!pendingPageview) return;
      ph.capture("$pageview");
      pendingPageview = false;
    });
  }, 2500);
}

// Safe to call on every route change; if PostHog hasn't loaded yet we queue one.
export function queuePostHogPageview() {
  if (!isEnabled()) return;
  pendingPageview = true;
  if (!client) return;

  client.capture("$pageview");
  pendingPageview = false;
}
