import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getPublicEvents } from "@/lib/siteData";

export function getEventById(id: string) {
  return getPublicEvents().find(e => e.id === id);
}

function getNextEvent(eventId?: string) {
  const upcomingEvents = getPublicEvents();
  if (eventId) {
    const specificEvent = getEventById(eventId);
    if (specificEvent) return specificEvent;
  }
  return upcomingEvents.find(e => e.ticketUrl && e.startsAt && new Date(e.startsAt) > new Date()) || upcomingEvents[0];
}

function parseEventDate(dateStr: string): Date {
  const months: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
  };
  const [monthName, dayStr] = dateStr.split(" ");
  const day = dayStr?.replace(",", "") ?? "1"; 
  // Use first 3 letters to match month signature
  const monthKey = monthName ? monthName.toUpperCase().substring(0, 3) : "JAN";
  const month = months[monthKey] ?? 0;
  const year = new Date().getFullYear();
  const d = new Date(year, month, parseInt(day) || 1, 20, 0, 0);
  // If in the past, push to next year
  if (d < new Date()) d.setFullYear(year + 1);
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

function Digit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <div className="relative overflow-hidden">
        <span className="font-heavy text-[clamp(2.5rem,8vw,8rem)] leading-none tracking-tighter text-white tabular-nums group-hover:text-primary transition-colors">
          {display}
        </span>
      </div>
      <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.35em] text-white/50">
        {label}
      </span>
    </div>
  );
}

function LiveClock({ targetDate }: { targetDate: string }) {
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
      <Digit value={timeLeft.days} label="Days" />
      <div className="font-heavy text-[clamp(2rem,6vw,7rem)] leading-none text-white/10 mb-6 md:mb-8 select-none" aria-hidden="true">:</div>
      <Digit value={timeLeft.hours} label="Hours" />
      <div className="font-heavy text-[clamp(2rem,6vw,7rem)] leading-none text-white/10 mb-6 md:mb-8 select-none" aria-hidden="true">:</div>
      <Digit value={timeLeft.minutes} label="Min" />
      <div className="font-heavy text-[clamp(2rem,6vw,7rem)] leading-none text-white/10 mb-6 md:mb-8 select-none" aria-hidden="true">:</div>
      <Digit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

export default function EventCountdown({ eventId }: { eventId?: string }) {
  const event = getNextEvent(eventId);

  if (!event) return null;

  const isSunsets = event.series === "chasing-sunsets";
  const seriesColor = isSunsets ? "#E8B86D" : event.series === "untold-story" ? "#22D3EE" : "#E05A3A";
  const [dateMonth, dateDay] = event.date.split(" ");

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
              <span className="font-mono text-[11px] md:text-sm uppercase tracking-[0.4em] text-white/40">
                Next Drop
              </span>
            </div>
            <div>
              <p className="font-mono text-[11px] md:text-sm uppercase tracking-[0.3em] mb-4 drop-shadow-md" style={{ color: seriesColor }}>
                {dateMonth} {dateDay}
              </p>
              <h3 className="font-heavy text-3xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white leading-none max-w-md drop-shadow-2xl">
                {event.title}
              </h3>
              {event.venue && (
                <p className="font-sans text-base md:text-lg text-white/50 mt-4 font-light italic">
                  {event.venue} // {event.location} // {event.dress || "Elevated Attire"}
                </p>
              )}

              {/* SS-Tier Scarcity & Dynamic Pricing */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {event.inventoryState === "low" && (
                  <div className="bg-red-500/20 text-red-500 px-3 py-1 border border-red-500/30 font-mono text-[10px] uppercase tracking-widest motion-safe:animate-pulse">
                    Inventory Capped // Floor Active
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
                  Inventory is capped to protect the room. Secure your access before phase change.
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
                  Table Reservations & Concierge Services
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
                  REGISTER FOR THE NEXT DROP →
                </span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            )}
          </div>

          {/* Right: Live countdown */}
          <div className="flex flex-1 justify-center lg:justify-end">
            <LiveClock targetDate={event.date} />
          </div>

        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-20" style={{ backgroundColor: seriesColor }} />
    </div>
  );
}
