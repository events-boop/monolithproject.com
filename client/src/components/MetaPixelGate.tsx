import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  queueMetaPixelPageview,
  scheduleMetaPixelInit,
  trackMetaPixelLead,
} from "@/lib/metaPixel";
import {
  COOKIE_CONSENT_RESOLVED_EVENT,
  getCookieConsentState,
} from "@/lib/cookieConsent";

function isFirstAccessLeadAnchor(anchor: HTMLAnchorElement) {
  const href = `${anchor.getAttribute("href") || ""} ${anchor.href || ""}`.toLowerCase();
  const label = anchor.textContent?.toLowerCase() || "";
  const ariaLabel = anchor.getAttribute("aria-label")?.toLowerCase() || "";
  const combinedLabel = `${label} ${ariaLabel}`;

  const isWaitlistHref =
    href.includes("/go/waitlist/chasing-sunsets") ||
    href.includes("laylo.com") ||
    href.includes("laylo") ||
    href.includes("first-access") ||
    href.includes("first_access");

  const isFirstAccessLabel =
    combinedLabel.includes("first access") ||
    combinedLabel.includes("lake list") ||
    combinedLabel.includes("laylo") ||
    combinedLabel.includes("waitlist");

  return isWaitlistHref && isFirstAccessLabel;
}

export default function MetaPixelGate() {
  const [location] = useLocation();
  const [consentState, setConsentState] = useState(getCookieConsentState);

  useEffect(() => {
    const handleConsentResolved = (event: Event) => {
      const nextState = (event as CustomEvent<"accepted" | "declined">).detail;
      setConsentState(nextState);
    };
    const handleStorage = () => setConsentState(getCookieConsentState());

    window.addEventListener(
      COOKIE_CONSENT_RESOLVED_EVENT,
      handleConsentResolved as EventListener
    );
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        COOKIE_CONSENT_RESOLVED_EVENT,
        handleConsentResolved as EventListener
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (consentState === "declined") return;
    scheduleMetaPixelInit();
    queueMetaPixelPageview();
  }, [consentState, location]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (consentState === "declined") return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !isFirstAccessLeadAnchor(anchor)) return;

      trackMetaPixelLead({
        event_source_url: window.location.href,
        source: "first_access_cta",
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [consentState]);

  return null;
}
