import { Ticket, ArrowRight } from "lucide-react";
import { POSH_TICKET_URL } from "@/data/events";
import { getPublicEvents } from "@/lib/siteData";

const seriesAccent: Record<string, string> = {
  "chasing-sunsets": "text-[#E8B86D]",
  "untold-story": "text-[#22D3EE]",
  "monolith-project": "text-primary",
};

export default function Ticker() {
  const upcomingEvents = getPublicEvents();
  // Build items from real events, duplicated for seamless loop
  const baseItems = upcomingEvents.length > 0
      ? upcomingEvents.map(e => ({
          label: e.title,
          date: e.date,
          series: e.series,
          status: e.status,
          inventory: e.inventoryState,
          ticketUrl: e.ticketUrl || POSH_TICKET_URL,
        }))
    : [
        { label: "Deron B2B Juany Bravo", date: "MAY 2026", series: "untold-story", status: "on-sale", inventory: "low", ticketUrl: POSH_TICKET_URL },
        { label: "Lazare Sabry", date: "TBD 2026", series: "untold-story", status: "coming-soon", inventory: "normal", ticketUrl: POSH_TICKET_URL },
        { label: "Autograf", date: "TBD 2026", series: "monolith-project", status: "on-sale", inventory: "low", ticketUrl: POSH_TICKET_URL },
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
              <span className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-white/70">
                {item.date}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className={`font-heavy text-sm md:text-base uppercase tracking-tight ${seriesAccent[item.series] || "text-white/70"}`}>
                {item.label}
              </span>
              <div className="w-1 h-1 rounded-full bg-white/10" />

              {/* SS-Tier Scarcity Signals */}
              {item.status === "sold-out" ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/10 text-white/50 border border-white/20 font-mono text-[9px] uppercase tracking-widest">
                    SOLD OUT
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/40">Join Waitlist</span>
                </div>
              ) : item.inventory === "low" ? (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-500 border border-red-500/30 font-mono text-[9px] uppercase tracking-widest animate-pulse">
                    LAST TICKETS
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/65 inline-flex items-center gap-2">
                    <Ticket className="w-3 h-3" /> Get Tickets
                  </span>
                </div>
              ) : (
                <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/65 inline-flex items-center gap-2">
                  <Ticket className="w-3 h-3" /> Get Tickets
                </span>
              )}
              <ArrowRight className="w-3 h-3 text-white/55 transition-transform group-hover:translate-x-1" />
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
