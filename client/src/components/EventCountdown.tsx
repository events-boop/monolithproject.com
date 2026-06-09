import { useState, useEffect } from "react";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
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
import {
  getEventOutlinePillToneClass,
  getEventPillToneClass,
} from "@/lib/ctaTone";
import { getEventCta } from "@/lib/cta";
import { SUNSETS_PRELAUNCH_LOCKED } from "@/lib/sunsetsTicketing";

export function getEventById(id: string) {
  return getEventByIdShared(id);
}

function getNextEvent(eventId?: string) {
  const upcomingEvents = getPublicEvents();
  if (eventId) {
    const specificEvent = getEventById(eventId);
    if (specificEvent) return specificEvent;
  }
  return (
    upcomingEvents.find(e => e.startsAt && new Date(e.startsAt) > new Date()) ||
    upcomingEvents[0]
  );
}

function resolveCountdownEvent(
  event?: ScheduledEvent | null,
  eventId?: string
) {
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

function Digit({
  value,
  label,
  accentColor,
}: {
  value: number;
  label: string;
  accentColor: string;
}) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="min-w-0">
      <div className="relative grid h-14 w-full min-w-0 place-items-center overflow-hidden rounded-[0.7rem] border border-white/10 bg-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:h-20 md:h-[5.75rem]">
        <span
          className="pointer-events-none absolute inset-x-2 top-0 h-px opacity-70"
          style={{ backgroundColor: accentColor }}
        />
        <span className="hero-wordmark text-[1.75rem] leading-none tracking-[0] text-white tabular-nums transition-colors sm:text-[2.55rem] md:text-[3.15rem]">
          {display}
        </span>
      </div>
      <span
        className="mt-2 block text-center font-mono text-[9px] uppercase tracking-[0.2em] sm:text-[10px]"
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
      className="w-full max-w-[28rem] rounded-[0.85rem] border border-white/10 bg-black/25 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] ring-1 ring-inset ring-white/6 backdrop-blur-sm"
      role="status"
    >
      <span
        className="font-mono text-[11px] uppercase tracking-[0.26em]"
        style={{ color: accentColor }}
      >
        {eyebrow}
      </span>
      <p className="mt-4 hero-wordmark text-[clamp(1.75rem,4vw,3rem)] uppercase leading-[0.92] text-white">
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
    <div
      className="grid w-full max-w-full grid-cols-4 gap-2 sm:gap-3"
      role="timer"
      aria-live="off"
      aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
    >
      <Digit value={timeLeft.days} label="Days" accentColor={accentColor} />
      <Digit value={timeLeft.hours} label="Hours" accentColor={accentColor} />
      <Digit value={timeLeft.minutes} label="Min" accentColor={accentColor} />
      <Digit value={timeLeft.seconds} label="Sec" accentColor={accentColor} />
    </div>
  );
}

type EventCountdownProps = {
  event?: ScheduledEvent | null;
  eventId?: string;
};

export default function EventCountdown({
  event,
  eventId,
}: EventCountdownProps) {
  const resolvedEvent = resolveCountdownEvent(event, eventId);

  if (!resolvedEvent) return null;

  const isSunsets = resolvedEvent.series === "chasing-sunsets";
  const seriesColor = isSunsets
    ? "#E8B86D"
    : resolvedEvent.series === "untold-story"
      ? "#22D3EE"
      : "#E05A3A";
  const seriesLabel = getSeriesLabel(resolvedEvent.series);
  const countdownTitle = resolvedEvent.headline || resolvedEvent.title;
  const venueLabel = getEventVenueLabel(resolvedEvent);
  const eventWindow = getEventWindow(resolvedEvent);
  const windowStatus = getEventWindowStatus(resolvedEvent);
  const cta = getEventCta(resolvedEvent);
  const ctaIsExternal = /^https?:\/\//i.test(cta.href);
  const startingPrice =
    resolvedEvent.ticketTiers && resolvedEvent.ticketTiers.length > 0
      ? Math.min(...resolvedEvent.ticketTiers.map(t => t.price))
      : resolvedEvent.startingPrice;

  return (
    <div
      data-countdown-event-id={resolvedEvent.id}
      data-countdown-state={windowStatus}
      className={`relative w-full overflow-hidden px-4 py-8 transition-colors duration-700 bg-noise sm:px-6 md:py-12 ${isSunsets ? "bg-[#0b0907]" : "bg-[#070b0e]"}`}
    >
      <div className="container layout-wide relative z-10 transition-opacity">
        <div className="relative max-w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-[linear-gradient(135deg,rgba(69,12,38,0.92)_0%,rgba(25,18,20,0.96)_46%,rgba(92,26,53,0.9)_100%)] px-5 py-7 shadow-[0_28px_90px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-7 md:px-9 md:py-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-20 text-[18rem] font-black uppercase leading-none tracking-[0] text-white/[0.045] md:-right-8 md:text-[24rem]"
          >
            SUN
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/28 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,26,117,0.28),transparent_34%),radial-gradient(circle_at_88%_100%,rgba(232,184,109,0.16),transparent_35%)]"
          />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_auto] lg:items-center lg:gap-10 xl:gap-14">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-[0.35rem] bg-[#ff0f72] px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_rgba(255,15,114,0.24)]">
                  <Sparkles className="h-3 w-3" strokeWidth={2.4} />
                  First Access
                </span>
                {resolvedEvent.inventoryState === "low" && (
                  <span className="inline-flex items-center rounded-[0.35rem] border border-white/14 bg-white/[0.075] px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-white/72">
                    Limited Capacity
                  </span>
                )}
              </div>

              <div className="mt-6">
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/42">
                  {seriesLabel} / {resolvedEvent.date}
                </p>
                <h3 className="mt-3 max-w-[12ch] text-balance hero-wordmark text-[clamp(2.6rem,7vw,6rem)] uppercase leading-[0.88] tracking-[0] text-white drop-shadow-2xl">
                  {countdownTitle}
                </h3>
                <p
                  className="mt-4 max-w-3xl text-balance font-mono text-[clamp(1rem,2.2vw,1.55rem)] uppercase leading-tight tracking-[0.12em]"
                  style={{ color: seriesColor }}
                >
                  {venueLabel} · {resolvedEvent.time}
                </p>
                <p className="mt-4 max-w-full text-sm leading-relaxed text-white/62 md:max-w-[48rem] md:text-base">
                  {resolvedEvent.experienceIntro ||
                    resolvedEvent.description ||
                    "Join first access before the next public ticket window opens."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={cta.href}
                  target={ctaIsExternal ? "_blank" : undefined}
                  rel={ctaIsExternal ? "noopener noreferrer" : undefined}
                  className={`${cta.tool === "posh" ? getEventPillToneClass(resolvedEvent) : getEventOutlinePillToneClass(resolvedEvent)} group self-start`}
                >
                  <span className="font-mono text-xs font-black uppercase tracking-[0.24em]">
                    {cta.label}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    strokeWidth={2.4}
                  />
                </a>
                {startingPrice && !SUNSETS_PRELAUNCH_LOCKED ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    Entry from{" "}
                    <span className="font-black text-white">
                      ${startingPrice}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="w-full lg:w-[27rem] xl:w-[30rem]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/48">
                  <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Window Timer
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full shadow-[0_0_16px_currentColor] motion-safe:animate-pulse"
                  style={{ color: seriesColor, backgroundColor: seriesColor }}
                />
              </div>
              <LiveClock
                target={eventWindow.start}
                accentColor={seriesColor}
                status={windowStatus}
              />
              <p className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-white/38">
                First access receives lineup, table, and ticket-window updates
                before public release.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
