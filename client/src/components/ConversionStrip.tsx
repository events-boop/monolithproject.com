import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { getExperienceEvent, isTicketOnSale } from "@/lib/siteExperience";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import ConversionCTA from "./ConversionCTA";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function parseEventDate(dateStr: string): Date {
  const months: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };
  const [monthName, day] = dateStr.split(" ");
  const month = months[monthName?.toUpperCase()] ?? 0;
  const year = new Date().getFullYear();
  const d = new Date(year, month, parseInt(day) || 1, 20, 0, 0);
  if (d < new Date()) d.setFullYear(year + 1);
  return d;
}

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

export default function ConversionStrip() {
  const event = getExperienceEvent("ticket");
  const cta = getEventCta(event);
  const [timeLeft, setTimeLeft] = useState(() => 
    event ? getTimeLeft(parseEventDate(event.date)) : null
  );

  useEffect(() => {
    if (!event) return;
    const target = parseEventDate(event.date);
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [event]);

  if (!event || !timeLeft) return null;

  const isSunsets = event.series === "chasing-sunsets";
  const themeColor = isSunsets ? "#E8B86D" : "#22D3EE";
  const themeBg = isSunsets ? "bg-[#E8B86D]" : "bg-[#22D3EE]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full overflow-hidden border border-white/10 bg-black/60 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] group"
    >
      {/* Background Pixel Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="container max-w-7xl mx-auto px-6 py-10 md:py-14 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-8">
          
          {/* LEFT: Signals & Headline */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded-none text-[11px] font-bold uppercase tracking-[0.2em] text-black ${themeBg}`}>
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
                {event.status === 'on-sale' ? "Limited inventory available. Book early while tickets are live." : "Join the newsletter to hear about the next ticket window before the public release."}
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
            showUrgency={false}
          />

        </div>
      </div>
    </motion.div>
  );
}
