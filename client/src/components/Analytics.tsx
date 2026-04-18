import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { queueMetaPixelPageview, scheduleMetaPixelInit } from "@/lib/metaPixel";
import { queuePostHogPageview, schedulePostHogInit } from "@/lib/posthog";
import { startWebVitalsReporting } from "@/lib/webVitals";
import {
  COOKIE_CONSENT_RESOLVED_EVENT,
  getCookieConsentState,
} from "@/lib/cookieConsent";

export default function Analytics() {
  const [location] = useLocation();
  const [consentState, setConsentState] = useState(getCookieConsentState);

  useEffect(() => {
    const handleConsentResolved = (event: Event) => {
      const nextState = (event as CustomEvent<"accepted" | "declined">).detail;
      setConsentState(nextState);
    };
    const handleStorage = () => {
      setConsentState(getCookieConsentState());
    };

    window.addEventListener(COOKIE_CONSENT_RESOLVED_EVENT, handleConsentResolved as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_RESOLVED_EVENT, handleConsentResolved as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (consentState !== "accepted") return;

    schedulePostHogInit();
    scheduleMetaPixelInit();
    startWebVitalsReporting();
  }, [consentState]);

  useEffect(() => {
    if (consentState !== "accepted") return;

    queuePostHogPageview();
    queueMetaPixelPageview();
  }, [consentState, location]);

  return null;
}
