import { Ticket, ArrowUpRight } from "lucide-react";
import { POSH_TICKET_URL } from "@/data/events";
import { CTA_LABELS } from "@/lib/cta";

interface TicketTickerProps {
  className?: string;
}

export default function TicketTicker({ className = "" }: TicketTickerProps) {
  const primaryLabel = CTA_LABELS.tickets;
  const hoverLabel = CTA_LABELS.getTicketsNow;
  const href = POSH_TICKET_URL;
  const external = true;

  // Repeating pattern for the marquee
  const items = Array.from({ length: 12 }).map((_, i) => (
    <div key={i} className="flex items-center gap-6 px-4">
      <span className="font-mono text-[12px] tracking-[0.15em] uppercase whitespace-nowrap font-bold">
        {primaryLabel}
      </span>
      <Ticket className="w-4 h-4" />
      <span
        className="font-mono text-[12px] tracking-[0.15em] uppercase whitespace-nowrap font-bold text-transparent"
        style={{ WebkitTextStroke: "1px currentColor" }}
      >
        {CTA_LABELS.moveTogether}
      </span>
      <ArrowUpRight className="w-4 h-4" />
    </div>
  ));

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`block bg-primary text-white overflow-hidden h-12 relative group hover:bg-white hover:text-black transition-colors duration-500 cursor-pointer ${className}`}
      aria-label={`${primaryLabel} - ${CTA_LABELS.moveTogether}`}
    >
      <div className="flex h-full items-center animate-marquee group-hover:[animation-play-state:paused] w-fit">
        {/* Content duplicated for seamless loop */}
        <div className="flex items-center shrink-0">{items}</div>
        <div className="flex items-center shrink-0" aria-hidden="true">
          {items}
        </div>
      </div>

      {/* Hover overlay hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black text-white px-4 py-1 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold">
          {hoverLabel}
        </div>
      </div>
    </a>
  );
}
