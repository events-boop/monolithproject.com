import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPublicEvents } from "@/lib/siteData";
import { getSeriesLabel, getEventVenueLabel } from "@/lib/siteExperience";

export function getEventById(id: string) {
  return getPublicEvents().find(e => e.id === id);
}

function getNextEvent(eventId?: string) {
  const upcomingEvents = getPublicEvents();
  if (eventId) {
    const specificEvent = getEventById(eventId);
    if (specificEvent) return specificEvent;
  }
  return upcomingEvents.find(e => e.startsAt && new Date(e.startsAt) > new Date()) || upcomingEvents[0];
}

function parseEventDate(dateStr: string): Date {
  if (!dateStr || dateStr.toUpperCase().includes("COMING") || dateStr.toUpperCase().includes("SOON") || dateStr.toUpperCase().includes("TBA")) {
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);
    return farFuture;
  }

  const months: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };
  
  const segments = dateStr.toUpperCase().split(/[\s,]+/);
  if (segments.length < 2) {
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);
    return farFuture;
  }

  const monthKey = segments[0].substring(0, 3);
  const month = months[monthKey] ?? 0;
  const day = parseInt(segments[1]) || 1;
  const yearStr = segments.find(s => s.length === 4 && !isNaN(parseInt(s)));
  const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();
  
  const d = new Date(year, month, day, 20, 0, 0);
  
  // If we parsed a date in the past but didn't have a year in the string, push to next year
  if (!yearStr && d < new Date()) d.setFullYear(year + 1);
  return d;
}

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

function Digit({ value, label, accentColor }: { value: number; label: string; accentColor: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <div className="relative overflow-hidden">
        <span className="font-heavy text-[clamp(3rem,9vw,9rem)] leading-none tracking-[-0.05em] text-white tabular-nums transition-colors">
          {display}
        </span>
      </div>
      <span
        className="font-mono text-[12px] md:text-[13px] uppercase tracking-[0.35em]"
        style={{ color: accentColor }}
      >
        {label}
      </span>
    </div>
  );
}

function LiveClock({ targetDate, accentColor }: { targetDate: string; accentColor: string }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(parseEventDate(targetDate))
  );

  useEffect(() => {
    const target = parseEventDate(targetDate);
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-end gap-2 md:gap-8" role="timer" aria-live="off" aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}>
      <Digit value={timeLeft.days} label="Days" accentColor={accentColor} />
      <div
        className="font-heavy text-[clamp(2.5rem,7vw,8rem)] leading-none mb-6 md:mb-8 select-none"
        style={{ color: `${accentColor}55` }}
        aria-hidden="true"
      >
        :
      </div>
      <Digit value={timeLeft.hours} label="Hours" accentColor={accentColor} />
      <div
        className="font-heavy text-[clamp(2.5rem,7vw,8rem)] leading-none mb-6 md:mb-8 select-none"
        style={{ color: `${accentColor}55` }}
        aria-hidden="true"
      >
        :
      </div>
      <Digit value={timeLeft.minutes} label="Min" accentColor={accentColor} />
      <div
        className="font-heavy text-[clamp(2.5rem,7vw,8rem)] leading-none mb-6 md:mb-8 select-none"
        style={{ color: `${accentColor}55` }}
        aria-hidden="true"
      >
        :
      </div>
      <Digit value={timeLeft.seconds} label="Sec" accentColor={accentColor} />
    </div>
  );
}

export default function EventCountdown({ eventId }: { eventId?: string }) {
  const event = getNextEvent(eventId);

  if (!event) return null;

  const isSunsets = event.series === "chasing-sunsets";
  const seriesColor = isSunsets ? "#E8B86D" : event.series === "untold-story" ? "#22D3EE" : "#E05A3A";
  const seriesLabel = getSeriesLabel(event.series);
  const countdownTitle = event.headline || event.title;
  const venueLabel = getEventVenueLabel(event);

  return (
    <div className={`relative w-full overflow-hidden transition-colors duration-700 bg-noise ${isSunsets ? 'bg-[#120f0a]' : 'bg-[#0a0f12]'}`}>
      {/* Dynamic Series Gradient Glow */}
      <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-[0.12] pointer-events-none transition-all duration-1000 ${isSunsets ? 'bg-orange-500/40' : 'bg-cyan-500/40'}`} />
      <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.08] pointer-events-none transition-all duration-1000 ${isSunsets ? 'bg-amber-600/30' : 'bg-indigo-600/30'}`} />

      <div className="container layout-wide px-6 py-16 md:py-24 relative z-10 transition-opacity">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-24">

          {/* Left: Event context */}
          <div className="flex flex-col gap-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-none motion-safe:animate-pulse" style={{ backgroundColor: seriesColor }} />
              <span className="font-mono text-[12px] md:text-sm uppercase tracking-[0.4em] text-white/40">
                Next Event
              </span>
            </div>
            <div>
              <p
                className="font-heavy text-[clamp(2.6rem,7vw,5.8rem)] uppercase tracking-[0.08em] leading-[0.88] mb-3"
                style={{ color: seriesColor }}
              >
                {seriesLabel}
              </p>
              <h3 className="font-heavy text-[clamp(3.3rem,9vw,8.4rem)] uppercase tracking-[-0.05em] text-white leading-[0.86] max-w-4xl drop-shadow-2xl">
                {countdownTitle}
              </h3>
              <p
                className="mt-5 font-mono text-[clamp(1rem,2.2vw,1.65rem)] uppercase tracking-[0.34em] drop-shadow-md"
                style={{ color: seriesColor }}
              >
                {event.date}
              </p>
              {event.venue && (
                <p className="font-sans text-lg md:text-xl text-white/55 mt-4 font-light italic max-w-2xl">
                  {venueLabel} // {event.dress || "Elevated Attire"}
                </p>
              )}

              {/* SS-Tier Scarcity & Dynamic Pricing */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {event.inventoryState === "low" && (
                  <div className="bg-red-500/20 text-red-500 px-3 py-1 border border-red-500/30 font-mono text-[10px] uppercase tracking-widest motion-safe:animate-pulse">
                    Limited Capacity
                  </div>
                )}
                {event.ticketTiers && event.ticketTiers.length > 0 && (
                  <div className="font-mono text-xs uppercase tracking-widest text-white/60">
                    Admission from <span className="text-white font-bold">${Math.min(...event.ticketTiers.map(t => t.price))}</span>
                  </div>
                )}
              </div>

              {event.location && (
                <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Capacity is limited to keep the room comfortable. Secure entry before pricing changes.
                </p>
              )}
            </div>
            {event.ticketUrl ? (
              <div className="flex flex-col gap-4">
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between gap-12 px-8 py-5 bg-white text-black border border-white hover:bg-black hover:text-white hover:border-white/20 transition-all duration-500 self-start"
                >
                  <span className="font-mono font-bold text-xs uppercase tracking-[0.25em]">Secure Your Entry</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
                {/* Concierge VIP pathway */}
                <a 
                  href="https://wa.me/message/MONOLITH" 
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/80 transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                  Table Reservations & VIP
                </a>
              </div>
            ) : (
              <a
                href="/newsletter"
                className="group inline-flex items-center justify-between gap-12 px-10 py-6 border hover:bg-white hover:text-black transition-all duration-500 self-start relative overflow-hidden"
                style={{ borderColor: seriesColor, color: seriesColor }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: seriesColor }} />
                  <span className="font-mono font-black text-sm md:text-base uppercase tracking-[0.35em] drop-shadow-sm">
                    GET THE NEXT DATE →
                  </span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            )}
          </div>

          {/* Right: Live countdown */}
          <div className="flex flex-1 justify-center lg:justify-end">
            <LiveClock targetDate={event.date} accentColor={seriesColor} />
          </div>

        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-20" style={{ backgroundColor: seriesColor }} />
    </div>
  );
}
