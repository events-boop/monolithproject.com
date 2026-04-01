import { useLocation } from "wouter";
import { ArrowUpRight, Ticket } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { getSceneForPath } from "@/lib/scenes";
import { getExperienceEvent, getPrimaryTicketUrl } from "@/lib/siteExperience";
import { CTA_LABELS } from "@/lib/cta";
import { useUI } from "@/contexts/UIContext";

export default function GlobalTicketButton() {
    const [location] = useLocation();
    const { setSensoryOverloadActive } = useUI();
    const scene = getSceneForPath(location);
    const featuredEvent = getExperienceEvent("ticket");
    const ticketUrl = getPrimaryTicketUrl(featuredEvent);

    const theme = {
        default: {
            border: "border-white/12 hover:border-primary/35",
        },
        violet: {
            border: "border-violet-400/18 hover:border-violet-400/42",
        },
        warm: {
            border: "border-[#E8B86D]/18 hover:border-[#E8B86D]/42",
        },
    }[scene.ticketTheme];

    // Hide on ticket page
    if (location === "/tickets" || !ticketUrl) return null;

    return (
        <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[100] hidden md:block">
            <MagneticButton strength={0.16}>
                <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-magnetic
                    data-cursor-text="BOOK"
                    onFocus={() => setSensoryOverloadActive(true)}
                    onBlur={() => setSensoryOverloadActive(false)}
                    aria-label={`Open tickets for ${featuredEvent?.headline || featuredEvent?.title || "the featured event"}`}
                    className={`group sensory-ticket-btn relative flex items-center gap-3 rounded-full bg-black/78 px-4 py-3 shadow-[0_18px_38px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(0,0,0,0.28)] ${theme.border}`}
                >
                    <div
                        className="absolute inset-0 rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                            background: `radial-gradient(circle at 12% 50%, ${scene.glow}, transparent 45%)`,
                        }}
                    />

                    <div
                        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
                        style={{ backgroundColor: "color-mix(in srgb, var(--scene-accent) 14%, rgba(255,255,255,0.02))" }}
                    >
                        <Ticket className="h-4.5 w-4.5 text-white" />
                    </div>

                    <div className="relative z-10 min-w-[7rem]">
                        <span className="ui-chip block text-white/44">{CTA_LABELS.tickets}</span>
                        <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-white/88 transition-colors group-hover:text-white">
                            {CTA_LABELS.moveTogether}
                        </span>
                    </div>

                    <ArrowUpRight className="relative z-10 h-3.5 w-3.5 text-white/56 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white group-hover:scale-110" />
                </a>
            </MagneticButton>
        </div>
    );
}
