import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowUpRight, ArrowRight, Ticket, Lock, Zap } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { getSceneForPath } from "@/lib/scenes";
import { getExperienceEvent, getSeriesEvents } from "@/lib/siteExperience";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import { useUI } from "@/contexts/UIContext";
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
    const { setSensoryOverloadActive } = useUI();
    const [consentState, setConsentState] = useState(getCookieConsentState);
    const [showAfterHero, setShowAfterHero] = useState(() => !shouldDelayFloatingCta(location));
    const scene = getSceneForPath(location);
    const sunsetsPath = location === "/chasing-sunsets" || location.startsWith("/chasing-sunsets");
    const untoldPath = location === "/story" || location.startsWith("/untold-story");
    const eventDetailsSlug = location.startsWith("/events/") ? location.slice("/events/".length).split(/[?#]/)[0] : null;

    // Series-aware event selection keeps the floating CTA aligned with the page the user is on.
    const featuredEvent = eventDetailsSlug
        ? getPublicEvents().find((event) => event.slug === eventDetailsSlug || event.id === eventDetailsSlug)
        : sunsetsPath
        ? (getSeriesEvents("chasing-sunsets")[0] || getExperienceEvent("ticket"))
        : untoldPath
            ? (getSeriesEvents("untold-story")[0] || getExperienceEvent("ticket"))
            : getExperienceEvent("ticket");
            
    const cta = getEventCta(featuredEvent);

    const stateDot = featuredEvent?.status === "on-sale"
        ? { color: "#10B981", label: "Live", pulse: true }
        : featuredEvent?.status === "sold-out"
            ? { color: "#F43F5E", label: "Waitlist", pulse: false }
            : { color: "var(--scene-accent, #E05A3A)", label: "Upcoming", pulse: false };

    const cursorTextByTool = {
        posh: "GET IN",
        laylo: "UNLOCK",
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

        window.addEventListener(COOKIE_CONSENT_RESOLVED_EVENT, handleConsentResolved as EventListener);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(COOKIE_CONSENT_RESOLVED_EVENT, handleConsentResolved as EventListener);
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
            setShowAfterHero((current) => (current === nextVisible ? current : nextVisible));
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

    const theme = {
        default: {
            border: "border-white/10 hover:border-primary/35",
        },
        violet: {
            border: "border-violet-400/18 hover:border-violet-400/42",
        },
        warm: {
            border: "border-[#E8B86D]/18 hover:border-[#E8B86D]/42",
        },
    }[scene.ticketTheme];

    const toolIcons = {
        posh: <Ticket className="h-4.5 w-4.5 text-white" />,
        laylo: <Lock className="h-4.5 w-4.5 text-white" />,
        fillout: <Zap className="h-4.5 w-4.5 text-white" />,
    };

    const toolMobileStyles = {
        posh: "bg-primary cta-posh",
        laylo: "cta-laylo py-5",
        fillout: "cta-fillout py-5"
    };

    // Keep the hero and consent flows focused before adding another conversion layer.
    if (location.startsWith("/chasing-sunsets") || location === "/tickets" || consentState === null || !showAfterHero) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-12 md:right-12 md:left-auto z-[100] w-full md:w-auto">
            <div className="hidden md:block">
                <MagneticButton strength={0.16}>
                    <a
                        href={cta.href}
                        target={cta.isExternal ? "_blank" : undefined}
                        rel={cta.isExternal ? "noopener noreferrer" : undefined}
                        data-cursor-magnetic
                        data-cursor-text={cursorTextByTool[cta.tool]}
                        onMouseEnter={() => setSensoryOverloadActive(true)}
                        onMouseLeave={() => setSensoryOverloadActive(false)}
                        aria-label={`${cta.label} ${featuredEvent?.headline || featuredEvent?.title || "featured event"}`}
                        className={`group sensory-ticket-btn relative flex items-center gap-3 rounded-full bg-black/78 px-5 py-3.5 shadow-[0_18px_38px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(0,0,0,0.28)] ${theme.border}`}
                    >
                        <div
                            className="absolute inset-0 rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                            style={{
                                background: `radial-gradient(circle at 12% 50%, ${cta.tool === 'posh' ? 'var(--scene-glow)' : 'rgba(255,255,255,0.1)'}, transparent 45%)`,
                            }}
                        />

                        <div
                            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
                            style={{ backgroundColor: cta.tool === 'posh' ? "color-mix(in srgb, var(--scene-accent) 14%, rgba(255,255,255,0.02))" : "rgba(255,255,255,0.05)" }}
                        >
                            {toolIcons[cta.tool]}
                        </div>

                        <div className="relative z-10 min-w-[8.5rem]">
                            <span className="ui-chip flex items-center gap-1.5 text-white/50">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${stateDot.pulse ? "animate-pulse" : ""}`}
                                    style={{ backgroundColor: stateDot.color, boxShadow: stateDot.pulse ? `0 0 8px ${stateDot.color}` : undefined }}
                                    aria-hidden="true"
                                />
                                {cta.label}
                            </span>
                            <span className="mt-1 block text-[13px] font-black uppercase tracking-[0.2em] text-white/90 transition-colors group-hover:text-white">
                                {featuredEvent?.headline || featuredEvent?.title || "Next Night"}
                            </span>
                        </div>

                        <ArrowUpRight className="relative z-10 h-4 w-4 text-white/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white group-hover:scale-110" />
                    </a>
                </MagneticButton>
            </div>

            {/* Mobile Sticky Bar */}
            <div className={`md:hidden w-full backdrop-blur-xl px-4 py-4 safe-bottom ${cta.tool === 'posh' ? 'bg-black/90 border-t border-white/10' : 'bg-[#0a0a0d]/95 border-t border-white/5'}`}>
                 <a
                    href={cta.href}
                    target={cta.isExternal ? "_blank" : undefined}
                    rel={cta.isExternal ? "noopener noreferrer" : undefined}
                    aria-label={`${cta.label} — ${featuredEvent?.headline || featuredEvent?.title || "Next Night"}`}
                    className={`flex items-center justify-between w-full h-14 px-6 text-white transition-all active:scale-[0.98] ${toolMobileStyles[cta.tool]}`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <span
                            className={`h-2 w-2 shrink-0 rounded-full ${stateDot.pulse ? "animate-pulse" : ""}`}
                            style={{ backgroundColor: stateDot.color, boxShadow: stateDot.pulse ? `0 0 10px ${stateDot.color}` : undefined }}
                            aria-hidden="true"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] mb-0.5 tracking-[0.25em] uppercase font-bold opacity-70">{cta.label}</span>
                            <span className="font-black text-xs tracking-[0.2em] uppercase truncate">{featuredEvent?.headline || featuredEvent?.title || "Next Night"}</span>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 transition-transform group-active:translate-x-1 shrink-0" />
                </a>
            </div>
        </div>
    );
}
