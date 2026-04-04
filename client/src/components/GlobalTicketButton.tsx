import { useLocation } from "wouter";
import { ArrowUpRight, ArrowRight, Ticket } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { getSceneForPath } from "@/lib/scenes";
import { getExperienceEvent } from "@/lib/siteExperience";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import { useUI } from "@/contexts/UIContext";

export default function GlobalTicketButton() {
    const [location] = useLocation();
    const { setSensoryOverloadActive } = useUI();
    const scene = getSceneForPath(location);
    const featuredEvent = getExperienceEvent("ticket");
    const cta = getEventCta(featuredEvent);

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
    if (location === "/tickets") return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 md:bottom-12 md:right-12 md:left-auto z-[100] w-full md:w-auto">
            <div className="hidden md:block">
                <MagneticButton strength={0.16}>
                    <a
                        href={cta.href}
                        target={cta.isExternal ? "_blank" : undefined}
                        rel={cta.isExternal ? "noopener noreferrer" : undefined}
                        data-cursor-magnetic
                        data-cursor-text={cta.tool === 'posh' ? "BOOK" : "ACCESS"}
                        onMouseEnter={() => setSensoryOverloadActive(true)}
                        onMouseLeave={() => setSensoryOverloadActive(false)}
                        aria-label={`${cta.label} ${featuredEvent?.headline || featuredEvent?.title || "featured event"}`}
                        className={`group sensory-ticket-btn relative flex items-center gap-3 rounded-full bg-black/78 px-5 py-3.5 shadow-[0_18px_38px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(0,0,0,0.28)] ${theme.border}`}
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

                        <div className="relative z-10 min-w-[8.5rem]">
                            <span className="ui-chip block text-white/54">{cta.label}</span>
                            <span className="mt-1 block text-[13px] font-black uppercase tracking-[0.2em] text-white/92 transition-colors group-hover:text-white">
                                {featuredEvent?.headline || featuredEvent?.title || "Project Signal"}
                            </span>
                        </div>

                        <ArrowUpRight className="relative z-10 h-4 w-4 text-white/64 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white group-hover:scale-110" />
                    </a>
                </MagneticButton>
            </div>

            {/* Mobile Sticky Bar */}
            <div className="md:hidden w-full bg-black/90 backdrop-blur-xl border-t border-white/10 px-4 py-4 safe-bottom">
                 <a
                    href={cta.href}
                    target={cta.isExternal ? "_blank" : undefined}
                    rel={cta.isExternal ? "noopener noreferrer" : undefined}
                    className="flex items-center justify-between w-full h-14 bg-primary text-white px-6 font-black text-xs tracking-[0.24em] uppercase shadow-[0_10px_30px_rgba(224,90,58,0.3)] active:scale-[0.98] transition-transform"
                >
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/60 mb-0.5 tracking-widest">{cta.label}</span>
                        <span>{featuredEvent?.headline || featuredEvent?.title || "Access"}</span>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                </a>
            </div>
        </div>
    );
}
