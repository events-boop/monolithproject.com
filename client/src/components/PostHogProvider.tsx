import { useEffect } from "react";
import { useLocation } from "wouter";
import posthog from "../lib/posthog";
import { PostHogProvider as PHProvider } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const enabled = Boolean(import.meta.env.VITE_POSTHOG_KEY);

  useEffect(() => {
    if (!enabled) return;
    // Track SPA page views on route change.
    posthog.capture("$pageview");
  }, [enabled, location]);

  if (!enabled) return <>{children}</>;

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
