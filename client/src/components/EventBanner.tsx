import { Ticket } from "lucide-react";
import { useLocation } from "wouter";
import { getEventBannerPayload, isEventBannerVisible } from "@/lib/eventBanner";

export default function EventBanner() {
  const [location] = useLocation();
  const payload = getEventBannerPayload();

  if (!payload || payload.status === "past" || !isEventBannerVisible(location)) return null;

  const items = Array(12).fill(payload.text);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-12 overflow-hidden border-b border-primary/35 shadow-[0_10px_35px_rgba(224,90,58,0.28)]">
      <a
        href={payload.ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open tickets for current featured event"
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/90"
      >
        <div
          className="h-full w-full flex items-center cursor-pointer relative overflow-hidden"
          style={
            payload.status === "live"
              ? { background: "linear-gradient(100deg, #ef4444 0%, #f97316 35%, #dc2626 70%, #fb7185 100%)" }
              : { background: "linear-gradient(100deg, #3b1812 0%, #8f3a24 30%, #e05a3a 65%, #f39c6b 100%)" }
          }
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_55%,rgba(255,255,255,0.28),transparent_30%),radial-gradient(circle_at_78%_45%,rgba(255,220,180,0.35),transparent_35%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/10" />
          <div className="flex animate-marquee-fast whitespace-nowrap">
            {items.map((t, i) => (
              <span key={i} className="relative z-10 inline-flex items-center">
                <span
                  className={`mx-7 text-[13px] leading-none font-mono tracking-[0.14em] uppercase ${
                    payload.status === "live" ? "text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" : "text-white/95 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                  }`}
                >
                  {payload.status === "live" && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-3 align-middle" />}
                  {t}
                </span>
                <Ticket className={`w-7 h-7 mx-3 opacity-95 ${payload.status === "live" ? "text-white" : "text-white/90"}`} />
              </span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
}
