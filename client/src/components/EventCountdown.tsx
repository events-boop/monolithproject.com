import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { upcomingEvents } from "@/data/events";

export function getEventById(id: string) {
  return upcomingEvents.find(e => e.id === id);
}

function getNextEvent(eventId?: string) {
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
        <span className="font-heavy text-[clamp(3.5rem,8vw,8rem)] leading-none tracking-tighter text-white tabular-nums">
          {display}
        </span>
      </div>
      <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/30">
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
    <div className="flex items-end gap-4 md:gap-8">
      <Digit value={timeLeft.days} label="Days" />
      <div className="font-heavy text-[clamp(3rem,6vw,7rem)] leading-none text-white/20 mb-6 md:mb-8 select-none">:</div>
      <Digit value={timeLeft.hours} label="Hours" />
      <div className="font-heavy text-[clamp(3rem,6vw,7rem)] leading-none text-white/20 mb-6 md:mb-8 select-none">:</div>
      <Digit value={timeLeft.minutes} label="Min" />
      <div className="font-heavy text-[clamp(3rem,6vw,7rem)] leading-none text-white/20 mb-6 md:mb-8 select-none">:</div>
      <Digit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

export default function EventCountdown({ eventId }: { eventId?: string }) {
  const event = getNextEvent(eventId);

  if (!event) return null;

  const isSunsets = event.series === "chasing-sunsets";
  const isUntold = event.series === "untold-story";
  const accentBg = isSunsets ? "bg-[#E8B86D]" : isUntold ? "bg-[#22D3EE]" : "bg-primary";
  const accentText = isSunsets ? "text-[#E8B86D]" : isUntold ? "text-[#22D3EE]" : "text-primary";
  const [dateMonth, dateDay] = event.date.split(" ");

  return (
    <div className="relative w-full bg-[#050505] border-t border-white/10 overflow-hidden">
      {/* Ambient glow related to series */}
      <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-[0.07] pointer-events-none ${accentBg}`} />

      <div className="container max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-24">

          {/* Left: Event context */}
          <div className="flex flex-col gap-6 shrink-0">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-none animate-pulse ${accentBg}`} />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
                Next Event
              </span>
            </div>
            <div>
              <p className={`font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 ${accentText}`}>
                {dateMonth} {dateDay}
              </p>
              <h3 className="font-heavy text-3xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white leading-none max-w-md">
                {event.title}
              </h3>
              {event.venue && (
                <p className="font-sans text-base md:text-lg text-white/40 mt-4 font-light">
                  {event.venue} — {event.location}
                </p>
              )}

              {/* Scarcity signal */}
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">Capacity</span>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.3em] font-bold ${accentText}`}>73% Claimed</span>
                </div>
                <div className="w-full h-[3px] bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className={`h-full origin-left ${accentBg}`}
                    style={{ width: "73%" }}
                  />
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Limited entry · Chicago, IL
                </p>
              </div>
            </div>
            {event.ticketUrl ? (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-12 px-8 py-5 bg-white text-black border border-white hover:bg-black hover:text-white hover:border-white/20 transition-all duration-500 self-start"
              >
                <span className="font-mono font-bold text-xs uppercase tracking-[0.25em]">Secure Your Place</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            ) : (
              <a
                href="/newsletter"
                className={`group inline-flex items-center justify-between gap-12 px-10 py-6 border ${isSunsets ? 'border-[#E8B86D] text-[#E8B86D]' : isUntold ? 'border-[#22D3EE] text-[#22D3EE]' : 'border-primary text-primary'} hover:bg-white hover:text-black transition-all duration-500 self-start relative overflow-hidden`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${accentBg}`} />
                <span className="font-mono font-black text-sm md:text-base uppercase tracking-[0.35em] drop-shadow-sm">
                  Join The Inner Circle
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
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${accentBg} opacity-20`} />
    </div>
  );
}
