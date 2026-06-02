import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trackMetaPixelLead } from "@/lib/metaPixel";
import {
  COOKIE_CONSENT_RESOLVED_EVENT,
  getCookieConsentState,
} from "@/lib/cookieConsent";

export function isLakeCampaignPath(pathname: string) {
  const normalized = pathname.toLowerCase();
  return normalized === "/lake" || normalized.startsWith("/lake/");
}

export function isFirstAccessLeadAnchor(anchor: HTMLAnchorElement) {
  if (anchor.hasAttribute("data-campaign-lead")) return false;

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
  const lakeCampaignPath = isLakeCampaignPath(location);

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

  // Pixel init + PageView are owned solely by Analytics.tsx to avoid double-firing.
  // This component only handles Lead conversion events.

  // Lead on anchor click (e.g. "Get First Access" links)
  useEffect(() => {
    if (lakeCampaignPath) return;

    const handleClick = (event: MouseEvent) => {
      if (consentState === 'declined') return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || !isFirstAccessLeadAnchor(anchor)) return;

      trackMetaPixelLead({
        event_source_url: window.location.href,
        source: 'first_access_cta',
      });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [consentState, lakeCampaignPath]);

  // Lead on Lake List form submit (Register for First Access button)
  useEffect(() => {
    if (lakeCampaignPath) return;

    const handleFormSubmit = (event: SubmitEvent) => {
      if (consentState === 'declined') return;
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      // Only fire for the lake-list / first-access form — identified by
      // its submit button text or the form's proximity to #lake-list.
      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const btnText = submitBtn?.textContent?.toLowerCase() || '';
      const isLakeListForm =
        btnText.includes('first access') ||
        btnText.includes('register') ||
        btnText.includes('lake list') ||
        form.closest('#lake-list') !== null ||
        form.closest('[data-form="lake-list"]') !== null;
      if (!isLakeListForm) return;
      trackMetaPixelLead({
        event_source_url: window.location.href,
        source: 'lake_list_form_submit',
        content_name: 'sunsets_july4_firstaccess',
      });
    };

    document.addEventListener('submit', handleFormSubmit, { capture: true });
    return () => {
      document.removeEventListener('submit', handleFormSubmit, { capture: true });
    };
  }, [consentState, lakeCampaignPath]);

  return null;
}
