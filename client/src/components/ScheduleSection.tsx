import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarPlus } from "lucide-react";
import { Link } from "wouter";
import type { ScheduledEvent } from "../data/events";
import { useIntentPrefetch } from "@/hooks/useIntentPrefetch";
import { CTA_LABELS, getEventDetailsHref } from "@/lib/cta";
import ConversionCTA from "@/components/ConversionCTA";
import KineticDecryption from "./KineticDecryption";
import ResponsiveImage from "./ResponsiveImage";
import { cn } from "@/lib/utils";
import { getSeriesColor, getSeriesColorOnLight, getEventWindow, getScheduledEvents } from "@/lib/siteExperience";
import { MONOLITH_ORANGE_ON_LIGHT } from "@/lib/brand";
import { trackTicketIntent } from "@/lib/api";
import { appendAttributionQueryParams } from "@/lib/attribution";
import { getEventPillToneClass } from "@/lib/ctaTone";

function formatIcsLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

function downloadICS(event: ScheduledEvent) {
  const { start, end } = getEventWindow(event);
  if (!start || !end) return;

  const icsStr = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Monolith Project//EN
BEGIN:VEVENT
DTSTART;TZID=America/Chicago:${formatIcsLocal(start)}
DTEND;TZID=America/Chicago:${formatIcsLocal(end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description || "The Monolith Project Event"}
LOCATION:${event.venue} — ${event.location}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsStr], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const seriesLabels: Record<string, string> = {
  "chasing-sunsets": "SUN(SETS)",
  "untold-story": "UNTOLD",
  "monolith-project": "MONOLITH",
};

const seriesDefaultImage: Record<string, string> = {
  "chasing-sunsets": "/images/chasing-sunsets-premium.webp",
  "untold-story": "/images/untold-story-juany-deron-v2.webp",
  "monolith-project": "/images/artist-autograf.webp",
};

function getStatusLabel(status: ScheduledEvent["status"]) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  return "PAST";
}

export default function ScheduleSection() {
  const upcomingEvents = getScheduledEvents();
  const { preconnectGateway } = useIntentPrefetch();
  const [expandedId, setExpandedId] = useState<string | null>(upcomingEvents[0]?.id || null);
  const [activeMonth, setActiveMonth] = useState<string>("ALL");

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const months = ["ALL", ...Array.from(new Set(upcomingEvents.map(e => e.date.split(" ")[0].toUpperCase())))];

  const filteredEvents = activeMonth === "ALL"
    ? upcomingEvents
    : upcomingEvents.filter(e => e.date.toUpperCase().startsWith(activeMonth));

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0px", "50px"]);

  return (
    <section ref={sectionRef} id="schedule" className="relative overflow-hidden border-t border-black/10 bg-[#ECEBE6] py-20 md:py-40">
      {/* 🏛️ ARCHITECTURAL GRID LAYER (PARALLAX ENABLED) */}
      <motion.div 
        style={{ y: gridY }}
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
      >
        <svg width="100%" height="100%">
          <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        </svg>
      </motion.div>

      {/* Side Guidelines */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
         <div className="absolute left-[5%] md:left-[8%] top-0 bottom-0 w-px bg-black/12" />
         <div className="absolute right-[5%] md:right-[8%] top-0 bottom-0 w-px bg-black/12" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6">
        {/* Header Block */}
        <div className="mb-12 flex flex-col justify-between gap-8 border-b border-black/15 pb-8 md:mb-24 md:pb-12 lg:flex-row lg:items-end">
          <div className="relative">
             <span
               className="absolute -top-6 left-1 font-mono text-[11px] font-black uppercase tracking-[0.38em] md:-top-10 md:left-2"
               style={{ color: `${MONOLITH_ORANGE_ON_LIGHT}b3` }}
             >
               Season Schedule
             </span>
             <h2
               className="font-heavy text-[clamp(2.5rem,10vw,8.5rem)] leading-[0.85] tracking-tight uppercase drop-shadow-sm"
               style={{ color: MONOLITH_ORANGE_ON_LIGHT }}
             >
               <KineticDecryption text="THE 2026 SEASON" />
             </h2>
             <p
               className="mt-4 max-w-[18rem] border-l pl-3 font-mono text-[11px] font-bold uppercase leading-6 tracking-[0.24em] text-black/70 md:mt-6 md:max-w-md md:pl-6"
               style={{ borderColor: `${MONOLITH_ORANGE_ON_LIGHT}4D` }}
             >
               Open-air days, late rooms, and tightly capped releases across one Chicago season.
             </p>
          </div>

          <div className="z-20 flex max-w-full gap-1 overflow-x-auto rounded-full border border-black/15 bg-white/55 p-1 shadow-[inset_0_1px_4px_rgba(0,0,0,0.06),0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md no-scrollbar">
            {months.map(month => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`relative shrink-0 min-h-[var(--tap-target-min)] px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[11px] md:text-xs font-bold tracking-[0.16em] uppercase transition-all duration-500 ${activeMonth === month
                  ? "text-white shadow-sm"
                  : "text-black/65 hover:text-black"
                  }`}
              >
                {activeMonth === month && (
                  <motion.div
                    layoutId="schedule-section-active-tab"
                    className="absolute inset-0 bg-black rounded-full"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* List Header - HUD Style (Hidden on Mobile) */}
        <div className="hidden grid-cols-12 gap-4 pb-4 pt-4 font-mono text-[10px] font-black uppercase tracking-[0.25em] text-black/55 lg:grid">
          <div className="col-span-2 pl-4">Date / Time</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-4 pl-4">Event Identity</div>
          <div className="col-span-2">Venue</div>
          <div className="col-span-3 text-right pr-8">Action</div>
        </div>

        {/* Schedule Wrapper */}
        <div className="mb-12 flex flex-col overflow-hidden rounded-3xl border border-black/15 bg-white/75 shadow-[0_24px_70px_rgba(0,0,0,0.09),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl md:rounded-[2rem]">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 md:py-32">
              <span className="mb-2 block font-heavy text-2xl uppercase tracking-tight text-black/45 md:mb-4 md:text-3xl">No Events Found</span>
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-black/60">No matching dates for {activeMonth}</p>
            </div>
          ) : (
            filteredEvents.map((event, index) => {
              const isExpanded = expandedId === event.id;
              const [dateMonth, dateDay] = event.date.split(" ");
              const dayNumber = parseInt(dateDay) || "";
              const shouldPing = event.recentlyDropped || event.status === "on-sale";
              const detailsHref = getEventDetailsHref(event);
              const isJulyHoliday =
                dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5);
              const seriesAccent = getSeriesColorOnLight(event.series);

              return (
                <motion.div
                  key={event.id}
                  className="group relative border-b border-black/10 last:border-b-0"
                >
                  <div
                    className={`absolute bottom-0 left-0 top-0 w-[4px] opacity-0 transition-opacity duration-500 ${isExpanded ? "opacity-100" : "group-hover:opacity-100"}`}
                    style={{ backgroundColor: seriesAccent }}
                  />

                  {/* Main Event Row */}
                  <div
                    className={`group relative z-10 w-full px-4 transition-colors duration-500 sm:px-6 ${isExpanded ? "bg-white/55" : "hover:bg-black/[0.025]"}`}
                  >
                    <div className="py-6 md:py-10 flex flex-col lg:grid lg:grid-cols-12 gap-5 md:gap-6 lg:items-center w-full text-left">
                      
                      {/* 📅 DATE (Top on mobile, left on desktop) */}
                      <div className="lg:col-span-2 flex items-center justify-between lg:justify-start lg:flex-col lg:items-start gap-2 lg:gap-1 pl-0 lg:pl-4">
                        <div className="flex flex-col">
                          <span className={cn(
                            "font-heavy text-2xl font-black uppercase leading-none tracking-tight text-black/85 transition-colors duration-500 group-hover:text-black sm:text-3xl md:text-4xl lg:text-5xl"
                          )}
                          style={{ color: isJulyHoliday ? seriesAccent : undefined }}
                          >
                            {dayNumber ? `${dateMonth.substring(0, 3).toUpperCase()} ${dayNumber}` : dateMonth.toUpperCase()}
                          </span>
                          <span className={cn(
                            "mt-1 block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-black/65 lg:hidden xl:block"
                          )}>
                            {event.time.split("—")[0]}
                          </span>
                        </div>
                        
                        {/* Mobile Ping Indicator (only on mobile) */}
                        {shouldPing && (
                          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.055] px-2 py-1 lg:hidden">
                            <span className="relative flex h-2 w-2">
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${event.recentlyDropped ? "bg-cyan-500" : "bg-primary"}`} />
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${event.recentlyDropped ? "bg-cyan-500" : "bg-primary"}`} />
                            </span>
                            <span className="font-mono text-[10px] font-black tracking-widest text-black/60">
                              {event.recentlyDropped ? "NEW DROP" : "LIVE"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 📡 TELEMETRY (Desktop only) */}
                      <div className="lg:col-span-1 hidden lg:flex flex-col items-center gap-4">
                        {shouldPing && (
                          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white shadow-sm">
                             <motion.div
                                className="absolute inset-0 opacity-10"
                                style={{
                                  backgroundColor: event.recentlyDropped ? "#06B6D4" : getSeriesColor(event.series),
                                }}
                                animate={{ opacity: [0.05, 0.15, 0.05] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                             />
                            <div className="relative flex h-2 w-2">
                              <span
                                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                                style={{
                                  backgroundColor: event.recentlyDropped ? "#0891B2" : getSeriesColor(event.series),
                                }}
                              />
                              <span
                                className="relative inline-flex rounded-full h-2 w-2"
                                style={{
                                  backgroundColor: event.recentlyDropped ? "#0891B2" : getSeriesColor(event.series),
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 🎫 EVENT IDENTITY */}
                      <div className="lg:col-span-4 flex flex-col gap-2 pl-0 lg:pl-4">
                        <h3 className={cn(
                          "font-heavy text-[clamp(1.45rem,5vw,2.55rem)] font-black uppercase leading-[0.9] tracking-tight text-black/85 transition-colors duration-500 group-hover:text-black lg:text-[clamp(1.9rem,4vw,2.9rem)]"
                        )}
                        style={{ color: isJulyHoliday ? seriesAccent : undefined }}
                        >
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className="rounded-full border border-black/10 bg-black/[0.055] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
                            style={{ color: getSeriesColorOnLight(event.series) }}
                          >
                            {seriesLabels[event.series]}
                          </span>
                          {event.recentlyDropped && (
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2.5 py-1 bg-cyan-500 text-white rounded-full shadow-sm">
                              NEW DROP
                            </span>
                          )}
                          <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2.5 py-1 bg-black text-white rounded-full shadow-sm">
                            {getStatusLabel(event.status)}
                          </span>
                        </div>
                      </div>

                      {/* 📍 VENUE (Desktop only) */}
                      <div className="lg:col-span-2 hidden lg:flex flex-col">
                        <span className={cn(
                          "font-serif text-xl font-semibold italic leading-tight text-black/78 transition-colors duration-500 group-hover:text-black lg:text-2xl"
                        )}>{event.venue}</span>
                        <span className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-black/58">{event.location}</span>
                      </div>

                      {/* ⚡ ACTIONS (Full width on mobile) */}
                      <div className="lg:col-span-3 flex flex-wrap items-center justify-between lg:justify-end gap-3 lg:pr-4 w-full mt-2 lg:mt-0">
                         <div className="flex-1 min-w-[11rem] lg:flex-none z-20">
                           <ConversionCTA event={event} size="sm" showUrgency={true} className="schedule-section-cta w-full md:w-auto" />
                         </div>
                         <button
                           type="button"
                           onClick={() => toggle(event.id)}
                           aria-expanded={isExpanded}
                           className={`${isExpanded ? "btn-pill-outline-dark" : "btn-pill-dark"} btn-pill-compact`}
                         >
                           {isExpanded ? "Hide Preview" : "Quick View"}
                           <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                         </button>
                      </div>

                    </div>
                  </div>

                  {/* Portfolio Reveal Expansion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden border-t border-black/10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.035),transparent_100%)]"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 px-6 md:px-10 py-10 lg:py-16">
                          
                          {/* Image Visual (Mobile: small crop, Desktop: full aspect) */}
                          <div className="lg:col-span-4 order-2 lg:order-1">
                             <div className="relative aspect-video overflow-hidden rounded-2xl border border-black/15 shadow-[0_18px_45px_rgba(0,0,0,0.16)] lg:aspect-[4/5]">
                                <ResponsiveImage
                                  src={event.image || seriesDefaultImage[event.series]}
                                  alt={event.title}
                                  sizes="(min-width: 1024px) 33vw, 100vw"
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-4 flex flex-col">
                                   <span className="font-heavy text-xs text-white uppercase tracking-tighter">{event.series.replace('-', ' ')}</span>
                                </div>
                             </div>
                          </div>

                          {/* Content Narrative */}
                          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                               <div className="h-px w-8 bg-black/30 md:w-16" />
                               <span className="font-mono text-[11px] font-black uppercase tracking-[0.28em] text-black/70">Event Dossier</span>
                            </div>
                            
                            <p className="mb-10 max-w-3xl font-serif text-xl italic leading-snug text-black/86 md:mb-12 md:text-2xl lg:text-3xl">
                              {event.description || event.experienceIntro || "Join us for a night built on sound, intention, and proper scale."}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 lg:mb-12">
                              {/* Stat Card: Personnel */}
                              <div className="rounded-3xl border border-black/10 bg-white/88 p-6 shadow-[0_14px_36px_rgba(0,0,0,0.07)] md:p-8">
                                <span className={cn(
                                  "font-mono text-[10px] uppercase tracking-[0.4em] mb-4 block",
                                  event.lineup ? "text-primary/85" : "text-black/60"
                                )}>Lineup Detail</span>
                                <p className="font-heavy text-xl uppercase leading-tight tracking-tight text-black md:text-2xl">{event.lineup || "Lineup Release Pending"}</p>
                              </div>

                              {/* Stat Card: Logistics */}
                              <div className="rounded-3xl border border-black/10 bg-white/88 p-6 shadow-[0_14px_36px_rgba(0,0,0,0.07)] md:p-8">
                                <span className="mb-4 block font-mono text-[10px] font-black uppercase tracking-[0.4em] text-black/62">Location Frame</span>
                                <p className="font-heavy text-xl uppercase leading-tight tracking-tight text-black md:text-2xl">{event.venue}</p>
                                <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-black/62">{event.time} @ {event.location}</p>
                              </div>
                            </div>
 
                            <div className="flex flex-wrap gap-4 items-center">
                              {event.ticketUrl ? (
                                <a 
                                  href={event.ticketUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => {
                                    const attributedHref = appendAttributionQueryParams(event.ticketUrl!);
                                    void trackTicketIntent("schedule_quick_view", event.id, attributedHref);
 
                                    if (attributedHref !== event.ticketUrl) {
                                      e.preventDefault();
                                      window.open(attributedHref, "_blank", "noopener,noreferrer");
                                    }
                                  }}
                                  onMouseEnter={() => preconnectGateway(event.ticketUrl!)}
                                  className={`${getEventPillToneClass(event)} btn-pill-monolith btn-pill-compact group`}
                                >
                                  {CTA_LABELS.tickets}
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                              ) : (
                                <button className="btn-pill-disabled btn-pill-compact">
                                  Release Details Soon
                                </button>
                              )}
 
                              <Link href={detailsHref} asChild>
                                <a className="btn-pill-outline btn-pill-outline-dark btn-pill-compact group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
                                  Open Event Page
                                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                              </Link>
 
                              <button
                                onClick={() => downloadICS(event)}
                                className="btn-pill-outline btn-pill-outline-dark btn-pill-compact group"
                              >
                                <CalendarPlus className="w-4 h-4" />
                                Add To Calendar
                              </button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Global Action Bar */}
        <div className="relative z-20 flex flex-col gap-6 border-t border-black/15 px-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.32em] text-black/62">
             New dates land as rooms lock in.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/schedule">
              <span className="btn-text-action btn-text-action-dark group cursor-pointer">
                See All Dates
                <ArrowRight />
              </span>
            </Link>
            <Link href="/newsletter">
              <span className="btn-pill-neutral group cursor-pointer">
                Get Event Updates
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
