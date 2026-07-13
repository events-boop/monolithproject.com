import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowUpRight,
  ArrowRight,
  Ticket,
  Lock,
  MoonStar,
  Zap,
  Waves,
} from "lucide-react";
import MagneticButton from "./MagneticButton";
import { getExperienceEvent, getSeriesEvents } from "@/lib/siteExperience";
import { getEventCta } from "@/lib/cta";
import { getEventPillToneClass } from "@/lib/ctaTone";
import { ROUTES } from "@shared/routes";
import { appendAttributionQueryParams } from "@/lib/attribution";
import { trackAccessEvent } from "@/lib/api";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import {
  COOKIE_CONSENT_RESOLVED_EVENT,
  getCookieConsentState,
} from "@/lib/cookieConsent";

function shouldDelayFloatingCta(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/story" ||
    pathname === "/untold-story-deron-juany-bravo" ||
    pathname.startsWith("/untold-story/") ||
    pathname.startsWith("/chasing-sunsets") ||
    pathname.startsWith("/events/")
  );
}

export default function GlobalTicketButton() {
  usePublicSiteDataVersion();
  const [location] = useLocation();
  const [consentState, setConsentState] = useState(getCookieConsentState);
  const [showAfterHero, setShowAfterHero] = useState(
    () => !shouldDelayFloatingCta(location)
  );
  const sunsetsPath =
    location === "/chasing-sunsets" || location.startsWith("/chasing-sunsets");
  const untoldPath =
    location === "/story" || location.startsWith("/untold-story");
  const eventDetailsSlug = location.startsWith("/events/")
    ? location.slice("/events/".length).split(/[?#]/)[0]
    : null;

  // Series-aware event selection keeps the floating CTA aligned with the page the user is on.
  const featuredEvent = eventDetailsSlug
    ? getPublicEvents().find(
        event =>
          event.slug === eventDetailsSlug || event.id === eventDetailsSlug
      )
    : sunsetsPath
      ? getSeriesEvents("chasing-sunsets")[0] || getExperienceEvent("ticket")
      : untoldPath
        ? getSeriesEvents("untold-story")[0] || getExperienceEvent("ticket")
        : getExperienceEvent("ticket");

  const cta = getEventCta(featuredEvent);
  const ticketToneClass = getEventPillToneClass(featuredEvent);

  // Posh ticket CTAs route to the on-site /tickets page rather than the
  // /go/tickets Posh redirect (which falls back to the Lake List until the
  // Posh ticket URL is configured). Waitlist/presale CTAs are unchanged.
  const ctaHref = cta.tool === "posh" ? ROUTES.tickets : cta.href;
  const ctaIsExternal = cta.tool === "posh" ? false : cta.isExternal;
  const isHome = location === "/";
  const sunsetsVipHref = appendAttributionQueryParams("https://sunsets.vip");
  const untoldVipHref = appendAttributionQueryParams("https://untold.vip");

  const stateDot =
    featuredEvent?.status === "on-sale"
      ? { color: "#10B981", label: "Live", pulse: true }
      : featuredEvent?.status === "sold-out"
        ? { color: "#F43F5E", label: "Waitlist", pulse: false }
        : {
            color: "var(--scene-accent, #E05A3A)",
            label: "Upcoming",
            pulse: false,
          };

  const cursorTextByTool = {
    posh: "GET IN",
    laylo: "TICKETS",
    fillout: "RSVP",
  } as const;

  useEffect(() => {
    const handleConsentResolved = (event: Event) => {
      const nextState = (event as CustomEvent<"accepted" | "declined">).detail;
      setConsentState(nextState);
    };
    const handleStorage = () => {
      setConsentState(getCookieConsentState());
    };

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
    if (!shouldDelayFloatingCta(location)) {
      setShowAfterHero(true);
      return;
    }

    let rafId = 0;

    const syncVisibility = () => {
      rafId = 0;
      const threshold = Math.max(window.innerHeight * 0.72, 480);
      const nextVisible = window.scrollY > threshold;
      setShowAfterHero(current =>
        current === nextVisible ? current : nextVisible
      );
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(syncVisibility);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    syncVisibility();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [location]);

  const toolIcons = {
    posh: <Ticket className="h-4.5 w-4.5 text-white" />,
    laylo: <Lock className="h-4.5 w-4.5 text-white" />,
    fillout: <Zap className="h-4.5 w-4.5 text-white" />,
  };

  const trackSunsetsVipClick = () => {
    trackAccessEvent("event_card_click", {
      buttonName: "Floating Sunsets VIP",
      destinationUrl: sunsetsVipHref,
      pagePath: location || "/",
      eventSlug: featuredEvent?.slug || featuredEvent?.id,
      eventDate: featuredEvent?.date,
      channel: "site",
      source: "home_floating_cta",
    });
  };

  const trackUntoldVipClick = () => {
    trackAccessEvent("event_card_click", {
      buttonName: "Floating Untold VIP",
      destinationUrl: untoldVipHref,
      pagePath: location || "/",
      eventSlug: featuredEvent?.slug || featuredEvent?.id,
      eventDate: featuredEvent?.date,
      channel: "site",
      source: "home_floating_cta",
    });
  };

  // Keep the hero and consent flows focused before adding another conversion layer.
  if (
    location.startsWith("/chasing-sunsets") ||
    location === "/tickets" ||
    consentState === null ||
    !showAfterHero
  )
    return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-12 md:right-12 md:left-auto z-[100] w-full md:w-auto">
      <div className="hidden md:block">
        <div className="flex flex-col items-end gap-3">
          {isHome && (
            <div className="grid grid-cols-2 items-stretch gap-2">
              <MagneticButton strength={0.12} className="h-full">
                <a
                  href={sunsetsVipHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-magnetic
                  data-cursor-text="SUNSETS"
                  onClick={trackSunsetsVipClick}
                  aria-label="Open Sunsets VIP in a new tab"
                  className="floating-access-card floating-vip-card btn-pill-outline btn-pill-outline-sunsets btn-pill-compact group h-full w-full justify-start gap-3 px-4 py-3"
                >
                  <div
                    aria-hidden="true"
                    className="floating-access-card-icon flex h-9 w-9 items-center justify-center border border-[#E8B86D]/24 bg-[#E8B86D]/10 text-[#E8B86D]"
                  >
                    <Waves className="h-4 w-4" />
                  </div>
                  <div className="relative z-10 min-w-[5rem] text-left">
                    <span className="ui-chip text-[#E8B86D]/78">Daylight</span>
                    <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-colors group-hover:text-white">
                      SUNSETS.VIP
                    </span>
                  </div>
                  <ArrowUpRight className="relative z-10 h-4 w-4 text-[#E8B86D]/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#E8B86D]" />
                </a>
              </MagneticButton>

              <MagneticButton strength={0.12} className="h-full">
                <a
                  href={untoldVipHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-magnetic
                  data-cursor-text="UNTOLD"
                  onClick={trackUntoldVipClick}
                  aria-label="Open Untold VIP in a new tab"
                  className="floating-access-card floating-vip-card btn-pill-outline btn-pill-outline-untold btn-pill-compact group h-full w-full justify-start gap-3 px-4 py-3"
                >
                  <div
                    aria-hidden="true"
                    className="floating-access-card-icon flex h-9 w-9 items-center justify-center border border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                  >
                    <MoonStar className="h-4 w-4" />
                  </div>
                  <div className="relative z-10 min-w-[5rem] text-left">
                    <span className="ui-chip text-cyan-200/70">After Dark</span>
                    <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition-colors group-hover:text-white">
                      UNTOLD.VIP
                    </span>
                  </div>
                  <ArrowUpRight className="relative z-10 h-4 w-4 text-cyan-200/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-100" />
                </a>
              </MagneticButton>
            </div>
          )}

          <MagneticButton strength={0.16} className="w-full">
            <a
              href={ctaHref}
              target={ctaIsExternal ? "_blank" : undefined}
              rel={ctaIsExternal ? "noopener noreferrer" : undefined}
              data-cursor-magnetic
              data-cursor-text={cursorTextByTool[cta.tool]}
              aria-label={`${stateDot.label}: ${cta.label} ${featuredEvent?.headline || featuredEvent?.title || "featured event"}`}
              className={`${ticketToneClass} btn-pill-compact floating-access-card group w-full min-w-[18rem] justify-start gap-3 px-4 py-3.5`}
            >
              <div
                aria-hidden="true"
                className="floating-access-card-icon relative z-10 flex h-10 w-10 items-center justify-center border border-white/10"
                style={{
                  backgroundColor:
                    cta.tool === "posh"
                      ? "color-mix(in srgb, var(--scene-accent) 14%, rgba(255,255,255,0.02))"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                {toolIcons[cta.tool]}
              </div>

              <div className="relative z-10 min-w-[8.5rem]">
                <span className="ui-chip flex items-center gap-1.5 text-white/70">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${stateDot.pulse ? "animate-pulse motion-reduce:animate-none" : ""}`}
                    style={{
                      backgroundColor: stateDot.color,
                      boxShadow: stateDot.pulse
                        ? `0 0 8px ${stateDot.color}`
                        : undefined,
                    }}
                    aria-hidden="true"
                  />
                  {stateDot.label} · {cta.label}
                </span>
                <span className="mt-1 block text-[13px] font-semibold uppercase tracking-[0.2em] text-white/90 transition-colors group-hover:text-white">
                  {featuredEvent?.headline ||
                    featuredEvent?.title ||
                    "Next Night"}
                </span>
              </div>

              <ArrowUpRight className="relative z-10 h-4 w-4 text-white/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white group-hover:scale-110" />
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="safe-bottom w-full border-t border-white/10 bg-[#050506] px-4 py-4 shadow-[0_-16px_40px_rgba(0,0,0,0.42)] md:hidden">
        {isHome && (
          <div className="mb-2 grid grid-cols-2 gap-2">
            <a
              href={sunsetsVipHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackSunsetsVipClick}
              aria-label="Open Sunsets VIP in a new tab"
              className="btn-pill-outline btn-pill-outline-sunsets btn-pill-compact group min-w-0 justify-center gap-2 px-3"
            >
              <Waves aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] min-[380px]:text-[10px]">
                SUNSETS.VIP
              </span>
            </a>
            <a
              href={untoldVipHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackUntoldVipClick}
              aria-label="Open Untold VIP in a new tab"
              className="btn-pill-outline btn-pill-outline-untold btn-pill-compact group min-w-0 justify-center gap-2 px-3"
            >
              <MoonStar aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] min-[380px]:text-[10px]">
                UNTOLD.VIP
              </span>
            </a>
          </div>
        )}
        <a
          href={ctaHref}
          target={ctaIsExternal ? "_blank" : undefined}
          rel={ctaIsExternal ? "noopener noreferrer" : undefined}
          aria-label={`${stateDot.label}: ${cta.label} — ${featuredEvent?.headline || featuredEvent?.title || "Next Night"}`}
          className={`${ticketToneClass} btn-pill-wide group min-h-14 justify-between px-5 py-3`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${stateDot.pulse ? "animate-pulse motion-reduce:animate-none" : ""}`}
              style={{
                backgroundColor: stateDot.color,
                boxShadow: stateDot.pulse
                  ? `0 0 10px ${stateDot.color}`
                  : undefined,
              }}
              aria-hidden="true"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] mb-0.5 tracking-[0.25em] uppercase font-bold opacity-70">
                {stateDot.label} · {cta.label}
              </span>
              <span className="truncate text-xs font-semibold uppercase tracking-[0.2em]">
                {featuredEvent?.headline ||
                  featuredEvent?.title ||
                  "Next Night"}
              </span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 transition-transform group-active:translate-x-1 shrink-0" />
        </a>
      </div>
    </div>
  );
}
