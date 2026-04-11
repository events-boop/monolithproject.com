import { motion } from "framer-motion";
import type { ScheduledEvent } from "@shared/events/types";
import { getExperienceEvent, getEventStartTimestamp, getSeriesColor } from "@/lib/siteExperience";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import ConversionCTA from "./ConversionCTA";
import { useCountdown } from "@/hooks/useCountdown";

function HUDDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex gap-1">
        {String(value).padStart(2, "0").split("").map((d, i) => (
          <div key={i} className="w-8 h-12 md:w-14 md:h-20 bg-white/5 border border-white/10 flex items-center justify-center font-heavy text-xl md:text-4xl text-white tabular-nums">
            {d}
          </div>
        ))}
      </div>
      <span className="font-mono text-[11px] md:text-sm uppercase tracking-[0.3em] text-white/30">{label}</span>
    </div>
  );
}

interface ConversionStripProps {
  event?: ScheduledEvent;
  tone?: "warm" | "nocturne";
}

export default function ConversionStrip({ event: providedEvent }: ConversionStripProps = {}) {
  const event = providedEvent ?? getExperienceEvent("ticket");
  const cta = getEventCta(event);
  const targetDate = getEventStartTimestamp(event);
  const timeLeft = useCountdown(targetDate);

  if (!event) return null;

  const themeColor = getSeriesColor(event.series) || "var(--primary)";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden border border-white/10 bg-black/60 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] group"
    >
      {/* Background Pixel Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="container layout-wide px-6 py-10 md:py-14 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-8">
          
          {/* LEFT: Signals & Headline */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-none text-[11px] font-bold uppercase tracking-[0.2em] text-black" style={{ backgroundColor: themeColor }}>
                {event.status === "on-sale" ? "Ticket Window" : "Next Event"}
              </span>
              <span className="px-2 py-1 rounded-none text-[11px] font-bold uppercase tracking-[0.2em] border border-white/20 text-white/60">
                Early Access
              </span>
            </div>
            <div>
              <h2 className="font-heavy text-3xl md:text-4xl uppercase tracking-tighter leading-[0.9] text-white">
                {cta.label === CTA_LABELS.tickets ? "TICKETS LIVE" : "NEXT EVENT"}<br />
                <span style={{ color: themeColor }}>{event.headline || "EVENT DETAILS COMING SOON"}</span>
              </h2>
              <p className="mt-4 font-sans text-sm text-white/40 leading-relaxed uppercase tracking-widest text-[10px]">
                {event.status === 'on-sale' ? "Inventory is capped to protect the room. Secure your access before phase change." : "Join the inner circle to hear about the next ticket window before the public release."}
              </p>
            </div>
          </div>

          {/* MIDDLE: HUD Timer */}
          <div className="flex items-center gap-4 md:gap-6 mx-auto lg:mx-0">
            <HUDDigit value={timeLeft.days} label="Days" />
            <div className="w-px h-12 bg-white/10 self-center hidden md:block" />
            <HUDDigit value={timeLeft.hours} label="Hours" />
            <HUDDigit value={timeLeft.minutes} label="Min" />
            <HUDDigit value={timeLeft.seconds} label="Sec" />
          </div>

          {/* RIGHT: Benefits & CTA */}
          <ConversionCTA 
            event={event}
            size="lg"
            showUrgency={true}
          />

        </div>
      </div>
    </motion.div>
  );
}
