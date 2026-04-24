import { useState, useEffect } from "react";
import type { ScheduledEvent } from "@shared/events/types";
import { getPublicEvents } from "@/lib/siteData";
import {
  type EventWindowStatus,
  getSeriesLabel,
  getEventVenueLabel,
  getEventWindow,
  getEventWindowStatus,
  getEventById as getEventByIdShared,
} from "@/lib/siteExperience";
import { getEventOutlinePillToneClass, getEventPillToneClass } from "@/lib/ctaTone";

export function getEventById(id: string) {
  return getEventByIdShared(id);
}

function getNextEvent(eventId?: string) {
  const upcomingEvents = getPublicEvents();
  if (eventId) {
    const specificEvent = getEventById(eventId);
    if (specificEvent) return specificEvent;
  }
  return upcomingEvents.find(e => e.startsAt && new Date(e.startsAt) > new Date()) || upcomingEvents[0];
}

function resolveCountdownEvent(event?: ScheduledEvent | null, eventId?: string) {
  if (event) return event;
  return getNextEvent(eventId);
}

function getTimeLeft(target: Date | null) {
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
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
    <div className="flex flex-col items-center gap-2 min-w-0 shrink">
      <div className="relative overflow-hidden">
        <span className="font-heavy text-[clamp(2rem,8vw,9rem)] leading-none tracking-[-0.04em] text-white tabular-nums transition-colors">
          {display}
        </span>
      </div>
      <span
        className="font-mono text-[11px] md:text-[13px] uppercase tracking-[0.24em]"
        style={{ color: accentColor }}
      >
        {label}
      </span>
    </div>
  );
}

function CountdownStateCard({
  accentColor,
  eyebrow,
  detail,
}: {
  accentColor: string;
  eyebrow: string;
  detail: string;
}) {
  return (
    <div
      className="w-full max-w-[28rem] rounded-[1.75rem] border border-white/10 bg-black/25 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] ring-1 ring-inset ring-white/6 backdrop-blur-sm"
      role="status"
    >
      <span
        className="font-mono text-[11px] uppercase tracking-[0.26em]"
        style={{ color: accentColor }}
      >
        {eyebrow}
      </span>
      <p className="mt-4 font-heavy text-[clamp(1.75rem,4vw,3rem)] uppercase leading-[0.92] text-white">
        Countdown standby
      </p>
      <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-white/65">
        {detail}
      </p>
    </div>
  );
}

function LiveClock({
  target,
  accentColor,
  status,
}: {
  target: Date | null;
  accentColor: string;
  status: EventWindowStatus;
}) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    if (!target) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target?.getTime()]);

  if (status === "unscheduled") {
    return (
      <CountdownStateCard
        accentColor={accentColor}
        eyebrow="Schedule Locks Soon"
        detail="The countdown activates as soon as the exact event window is published."
      />
    );
  }

  if (status === "live") {
    return (
      <CountdownStateCard
        accentColor={accentColor}
        eyebrow="Live Now"
        detail="The room is active. Entry timing and on-site flow are now driving the experience."
      />
    );
  }

  if (status === "past") {
    return (
      <CountdownStateCard
        accentColor={accentColor}
        eyebrow="Chapter Complete"
        detail="This window has closed. Stay on the list for the next chapter and the next pricing move."
      />
    );
  }

  if (!target || !timeLeft) return null;

  return (
    <div className="flex items-end gap-1 sm:gap-3 md:gap-8 w-full max-w-full overflow-hidden" role="timer" aria-live="off" aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}>
      <Digit value={timeLeft.days} label="Days" accentColor={accentColor} />
      <div
        className="font-heavy text-[clamp(1.75rem,6vw,8rem)] leading-none mb-5 md:mb-8 select-none shrink-0"
        style={{ color: `${accentColor}55` }}
        aria-hidden="true"
      >
        :
      </div>
      <Digit value={timeLeft.hours} label="Hours" accentColor={accentColor} />
      <div
        className="font-heavy text-[clamp(1.75rem,6vw,8rem)] leading-none mb-5 md:mb-8 select-none shrink-0"
        style={{ color: `${accentColor}55` }}
        aria-hidden="true"
      >
        :
      </div>
      <Digit value={timeLeft.minutes} label="Min" accentColor={accentColor} />
      <div
        className="font-heavy text-[clamp(1.75rem,6vw,8rem)] leading-none mb-5 md:mb-8 select-none shrink-0"
        style={{ color: `${accentColor}55` }}
        aria-hidden="true"
      >
        :
      </div>
      <Digit value={timeLeft.seconds} label="Sec" accentColor={accentColor} />
    </div>
  );
}

type EventCountdownProps = {
  event?: ScheduledEvent | null;
  eventId?: string;
};

export default function EventCountdown({ event, eventId }: EventCountdownProps) {
  const resolvedEvent = resolveCountdownEvent(event, eventId);

  if (!resolvedEvent) return null;

  const isSunsets = resolvedEvent.series === "chasing-sunsets";
  const seriesColor = isSunsets ? "#E8B86D" : resolvedEvent.series === "untold-story" ? "#22D3EE" : "#E05A3A";
  const seriesLabel = getSeriesLabel(resolvedEvent.series);
  const countdownTitle = resolvedEvent.headline || resolvedEvent.title;
  const venueLabel = getEventVenueLabel(resolvedEvent);
  const eventWindow = getEventWindow(resolvedEvent);
  const windowStatus = getEventWindowStatus(resolvedEvent);

  return (
    <div
      data-countdown-event-id={resolvedEvent.id}
      data-countdown-state={windowStatus}
      className={`relative w-full overflow-hidden transition-colors duration-700 bg-noise ${isSunsets ? 'bg-[#120f0a]' : 'bg-[#0a0f12]'}`}
    >
      {/* Dynamic Series Gradient Glow */}
      <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-[0.12] pointer-events-none transition-all duration-1000 ${isSunsets ? 'bg-orange-500/40' : 'bg-cyan-500/40'}`} />
      <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.08] pointer-events-none transition-all duration-1000 ${isSunsets ? 'bg-amber-600/30' : 'bg-indigo-600/30'}`} />

      <div className="container layout-wide px-6 py-16 md:py-24 relative z-10 transition-opacity">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-24">

          {/* Left: Event context */}
          <div className="flex flex-col gap-6 shrink-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="w-2 h-2 rounded-none motion-safe:animate-pulse" style={{ backgroundColor: seriesColor }} />
              <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.26em] text-white/45">
                Next Event
              </span>
              <span aria-hidden="true" className="h-px w-6 bg-white/15" />
              <span
                className="font-mono text-[11px] md:text-xs uppercase tracking-[0.24em]"
                style={{ color: seriesColor }}
              >
                {seriesLabel}
              </span>
            </div>
            <div>
              <h3 className="font-heavy text-[clamp(2.6rem,8vw,8.4rem)] uppercase tracking-[-0.04em] text-white leading-[0.86] max-w-4xl drop-shadow-2xl">
                {countdownTitle}
              </h3>
              <p
                className="mt-5 font-mono text-[clamp(1rem,2.2vw,1.65rem)] uppercase tracking-[0.3em] drop-shadow-md"
                style={{ color: seriesColor }}
              >
                {resolvedEvent.date}
              </p>
              {resolvedEvent.venue && (
                <p className="font-sans text-lg md:text-xl text-white/50 mt-4 font-light italic max-w-2xl">
                  {venueLabel} // {resolvedEvent.dress || "Elevated Attire"}
                </p>
              )}

              {/* SS-Tier Scarcity & Dynamic Pricing */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {resolvedEvent.inventoryState === "low" && (
                  <div className="bg-red-500/20 text-red-500 px-3 py-1 border border-red-500/30 font-mono text-[11px] uppercase tracking-[0.18em] motion-safe:animate-pulse">
                    Limited Capacity
                  </div>
                )}
                {resolvedEvent.ticketTiers && resolvedEvent.ticketTiers.length > 0 && (
                  <div className="font-mono text-xs uppercase tracking-widest text-white/60">
                    Admission from <span className="text-white font-bold">${Math.min(...resolvedEvent.ticketTiers.map(t => t.price))}</span>
                  </div>
                )}
              </div>

              {resolvedEvent.location && (
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
                  Capacity is limited to keep the room comfortable. Secure entry before pricing changes.
                </p>
              )}
            </div>
            {resolvedEvent.ticketUrl ? (
              <div className="flex flex-col gap-4">
                <a
                  href={resolvedEvent.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${getEventPillToneClass(resolvedEvent)} group self-start`}
                >
                  <span className="font-mono font-bold text-xs uppercase tracking-[0.25em]">Secure Your Entry</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
                {/* Concierge VIP pathway */}
                <a 
                  href="https://wa.me/message/MONOLITH" 
                  className="btn-text-action"
                >
                  Table Reservations & VIP
                </a>
              </div>
            ) : (
              <a
                href="/newsletter"
                className={`${getEventOutlinePillToneClass(resolvedEvent)} group self-start`}
                >
                  <span className="font-mono font-black text-sm md:text-base uppercase tracking-[0.3em] drop-shadow-sm">
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
            <LiveClock target={eventWindow.start} accentColor={seriesColor} status={windowStatus} />
          </div>

        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] opacity-20" style={{ backgroundColor: seriesColor }} />
    </div>
  );
}
