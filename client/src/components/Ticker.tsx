import { Ticket } from "lucide-react";
import { POSH_TICKET_URL } from "@/data/events";

export default function Ticker() {
  const items = Array.from({ length: 12 });

  return (
    <a
      href={POSH_TICKET_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get tickets"
      className="block w-full overflow-hidden select-none h-[56px] flex items-center relative z-[100] cursor-pointer border-y border-primary/35 shadow-[0_10px_30px_rgba(224,90,58,0.2)]"
      style={{ background: "linear-gradient(100deg, #3b1812 0%, #8f3a24 30%, #e05a3a 65%, #f39c6b 100%)" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_50%,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_82%_50%,rgba(255,220,180,0.3),transparent_35%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/10" />
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap min-w-full shrink-0">
          {items.map((_, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0 px-12 group">
              <Ticket className="w-4.5 h-4.5 text-white/90 transition-colors relative z-10" />
              <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/95 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] relative z-10">
                GET TICKETS
              </span>
            </div>
          ))}
        </div>
        <div className="flex animate-marquee whitespace-nowrap min-w-full shrink-0" aria-hidden="true">
          {items.map((_, i) => (
            <div key={`clone-${i}`} className="flex items-center gap-3 shrink-0 px-12">
              <Ticket className="w-4.5 h-4.5 text-white/90" />
              <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/95 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
                GET TICKETS
              </span>
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
