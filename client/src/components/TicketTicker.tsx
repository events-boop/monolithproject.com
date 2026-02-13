import { Ticket, ArrowUpRight } from "lucide-react";
import { POSH_TICKET_URL } from "@/data/events";

interface TicketTickerProps {
    className?: string;
}

export default function TicketTicker({ className = "" }: TicketTickerProps) {
    // Repeating pattern for the marquee
    const items = Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 px-4">
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase whitespace-nowrap font-bold">
                Get Tickets
            </span>
            <Ticket className="w-4 h-4" />
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase whitespace-nowrap font-bold text-transparent" style={{ WebkitTextStroke: "1px currentColor" }}>
                Join The Ritual
            </span>
            <ArrowUpRight className="w-4 h-4" />
        </div>
    ));

    return (
        <a
            href={POSH_TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-primary text-white overflow-hidden h-12 relative group hover:bg-white hover:text-black transition-colors duration-500 cursor-pointer ${className}`}
            aria-label="Get Tickets - Join The Ritual"
        >
            <div className="flex h-full items-center animate-marquee group-hover:[animation-play-state:paused] w-fit">
                {/* Content duplicated for seamless loop */}
                <div className="flex items-center shrink-0">
                    {items}
                </div>
                <div className="flex items-center shrink-0" aria-hidden="true">
                    {items}
                </div>
            </div>

            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-black text-white px-4 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold">
                    Book Now
                </div>
            </div>
        </a>
    );
}
