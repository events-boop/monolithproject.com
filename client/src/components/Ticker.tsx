import { Ticket, ArrowRight } from "lucide-react";
import { POSH_TICKET_URL, upcomingEvents } from "@/data/events";

const seriesAccent: Record<string, string> = {
  "chasing-sunsets": "text-[#E8B86D]",
  "untold-story": "text-[#22D3EE]",
  "monolith-project": "text-primary",
};

export default function Ticker() {
  // Build items from real events, duplicated for seamless loop
  const baseItems = upcomingEvents.length > 0
    ? upcomingEvents.map(e => ({
        label: e.title,
        date: e.date,
        series: e.series,
        ticketUrl: e.ticketUrl || POSH_TICKET_URL,
      }))
    : [
        { label: "Deron B2B Juany Bravo", date: "MAY 2026", series: "untold-story", ticketUrl: POSH_TICKET_URL },
        { label: "Lazare Sabry", date: "TBD 2026", series: "untold-story", ticketUrl: POSH_TICKET_URL },
        { label: "Autograf", date: "TBD 2026", series: "monolith-project", ticketUrl: POSH_TICKET_URL },
      ];

  const items = [...baseItems, ...baseItems, ...baseItems, ...baseItems];

  return (
    <a
      href={POSH_TICKET_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get tickets to upcoming Monolith events"
      className="group relative z-[100] block w-full cursor-pointer overflow-hidden border-y border-white/10 bg-[#050505] select-none"
      style={{ height: "52px" }}
    >
      {/* Gradient fade masks on edges */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #050505, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, #050505, transparent)" }} />

      <div className="flex overflow-hidden h-full items-center">
        <div className="flex w-max min-w-full shrink-0 animate-marquee items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
          {items.map((item, i) => (
            <div key={i} className="flex shrink-0 items-center gap-4 md:gap-6 px-8 md:px-12">
              <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/30">
                {item.date}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className={`font-heavy text-sm md:text-base uppercase tracking-tight ${seriesAccent[item.series] || "text-white/70"}`}>
                {item.label}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 inline-flex items-center gap-2">
                <Ticket className="w-3 h-3" /> Get Tickets
              </span>
              <ArrowRight className="w-3 h-3 text-white/20" />
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}

