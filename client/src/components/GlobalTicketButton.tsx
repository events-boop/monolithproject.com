import { useLocation } from "wouter";
import { Ticket } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { POSH_TICKET_URL } from "@/data/events";
import { useUI } from "@/contexts/UIContext";

export default function GlobalTicketButton() {
    const [location] = useLocation();
    const { setSensoryOverloadActive } = useUI();

    // Hide on ticket page
    if (location === "/tickets") return null;

    return (
        <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-[100] hidden md:block">
            <MagneticButton strength={0.4}>
                <a
                    href={POSH_TICKET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setSensoryOverloadActive(true)}
                    onMouseLeave={() => setSensoryOverloadActive(false)}
                    className="group block relative w-20 h-20 rounded-full bg-black/80 backdrop-blur-xl border border-white/15 flex items-center justify-center shadow-2xl overflow-hidden hover:scale-110 hover:border-primary/50 transition-all duration-500 cursor-pointer sensory-ticket-btn"
                >
                    {/* Glowing Orb Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,90,58,0.2),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_50%_50%,rgba(224,90,58,0.4),transparent_70%)] transition-all duration-500" />

                    <div className="relative z-10 flex flex-col items-center gap-1 group-hover:-translate-y-1 transition-transform duration-300">
                        <Ticket className="w-6 h-6 text-white group-hover:text-primary transition-colors duration-300" />
                        <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -bottom-4 whitespace-nowrap">
                            TICKETS
                        </span>
                    </div>

                    {/* Border Rotation */}
                    <div className="absolute inset-0 border border-white/0 rounded-full group-hover:border-t-primary/80 group-hover:border-r-primary/30 group-hover:rotate-180 transition-all duration-1000 ease-out" />
                </a>
            </MagneticButton>
        </div>
    );
}
