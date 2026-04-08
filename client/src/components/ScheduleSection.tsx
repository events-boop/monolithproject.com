import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Clock, Music, MapPin, CalendarPlus } from "lucide-react";
import { Link } from "wouter";
import type { ScheduledEvent } from "../data/events";
import { getPublicEvents } from "@/lib/siteData";
import { useIntentPrefetch } from "@/hooks/useIntentPrefetch";
import { CTA_LABELS } from "@/lib/cta";
import ConversionCTA from "@/components/ConversionCTA";
import KineticDecryption from "./KineticDecryption";
import { cn } from "@/lib/utils";

// --- iCal Generator Helper ---
function downloadICS(event: ScheduledEvent) {
  const parseDateToArr = (dateStr: string) => {
    const [monthName, day] = dateStr.split(" ");
    const months: Record<string, number> = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
    const month = months[monthName.toUpperCase()] || 1;
    const year = new Date().getFullYear();
    const finalYear = (month < new Date().getMonth() + 1) ? year + 1 : year;
    return [finalYear, month, parseInt(day)];
  };

  const [year, month, day] = parseDateToArr(event.date);
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${year}${pad2(month)}${pad2(day)}`;

  const icsStr = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Monolith Project//EN
BEGIN:VEVENT
DTSTART;TZID=America/Chicago:${dateStr}T200000
DTEND;TZID=America/Chicago:${dateStr}T235900
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

const seriesAccent: Record<string, string> = {
  "chasing-sunsets": "bg-[#E8B86D]",
  "untold-story": "bg-[#22D3EE]",
  "monolith-project": "bg-primary",
};

const seriesTextAccent: Record<string, string> = {
  "chasing-sunsets": "text-[#8F5B0A]",
  "untold-story": "text-[#0E7490]",
  "monolith-project": "text-[#7F311D]",
};

const seriesLabels: Record<string, string> = {
  "chasing-sunsets": "SUN(SETS)",
  "untold-story": "UNTOLD",
  "monolith-project": "MONOLITH",
};

const seriesDefaultImage: Record<string, string> = {
  "chasing-sunsets": "/images/chasing-sunsets-premium.png",
  "untold-story": "/images/untold-story-juany-deron-v2.jpg",
  "monolith-project": "/images/artist-autograf.webp",
};

export default function ScheduleSection() {
  const upcomingEvents = getPublicEvents();
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
    <section ref={sectionRef} id="schedule" className="relative py-20 md:py-40 bg-[#EAEAEA] overflow-hidden border-t border-black/10">
      {/* 🏛️ ARCHITECTURAL GRID LAYER (PARALLAX ENABLED) */}
      <motion.div 
        style={{ y: gridY }}
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
      >
        <svg width="100%" height="100%">
          <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
             <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        </svg>
      </motion.div>

      {/* Side Guidelines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
         <div className="absolute left-[5%] md:left-[8%] top-0 bottom-0 w-px bg-black/10" />
         <div className="absolute right-[5%] md:right-[8%] top-0 bottom-0 w-px bg-black/10" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6">
        {/* Header Block */}
        <div className="mb-12 md:mb-24 flex flex-col gap-8 lg:flex-row lg:items-end justify-between border-b border-black/10 pb-8 md:pb-12">
          <div className="relative">
             <span className="absolute -top-6 left-1 md:-top-10 md:left-2 font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-[#7F311D]/70 uppercase">Upcoming Series</span>
             <h2 className="font-heavy text-[clamp(2.5rem,10vw,8.5rem)] leading-[0.85] tracking-tight text-[#7F311D] uppercase drop-shadow-sm">
               <KineticDecryption text="SCHEDULE" />
             </h2>
             <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-black/50 pl-2 md:pl-6 border-l border-[#7F311D]/30 mt-4 md:mt-6 max-w-[15rem] md:max-w-sm">
               Start with the next date. The series and the room will tell you the rest.
             </p>
          </div>

          <div className="flex overflow-x-auto no-scrollbar max-w-full gap-1 p-1 bg-black/[0.03] border border-black/10 rounded-full backdrop-blur-md z-20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)]">
            {months.map(month => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`relative shrink-0 px-4 md:px-6 py-2 md:py-3 rounded-full text-[9px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 ${activeMonth === month
                  ? "text-white shadow-sm"
                  : "text-black/50 hover:text-black"
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
        <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 pt-4 text-[9px] uppercase tracking-[0.25em] font-mono text-black/40">
          <div className="col-span-2 pl-4">Date / Time</div>
          <div className="col-span-1 text-center">Telemetry</div>
          <div className="col-span-4 pl-4">Event Identity</div>
          <div className="col-span-2">Venue</div>
          <div className="col-span-3 text-right pr-8">Action</div>
        </div>

        {/* Schedule Wrapper */}
        <div className="flex flex-col mb-12 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-black/10 bg-white/60 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20 md:py-32">
              <span className="block font-heavy text-2xl md:text-3xl text-black/30 mb-2 md:mb-4 tracking-tight uppercase">No Events Found</span>
              <p className="font-mono text-[9px] md:text-[10px] text-black/40 uppercase tracking-widest">No matching dates for {activeMonth}</p>
            </div>
          ) : (
            filteredEvents.map((event, index) => {
              const isExpanded = expandedId === event.id;
              const [dateMonth, dateDay] = event.date.split(" ");
              const dayNumber = parseInt(dateDay) || "";
              const shouldPing = event.recentlyDropped || event.status === "on-sale";

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group border-b border-black/[0.08] relative last:border-b-0"
                >
                  <div className={`absolute top-0 bottom-0 left-0 w-[4px] bg-black opacity-0 transition-opacity duration-500 ${isExpanded ? 'opacity-10' : 'group-hover:opacity-10'}`} />

                  {/* Main Event Row */}
                  <div
                    className={`w-full relative z-10 transition-colors duration-500 group px-4 sm:px-6 cursor-pointer ${isExpanded ? "bg-white/40" : "hover:bg-black/[0.02]"}`}
                    onClick={() => toggle(event.id)}
                  >
                    <div className="py-6 md:py-10 flex flex-col lg:grid lg:grid-cols-12 gap-5 md:gap-6 lg:items-center w-full text-left">
                      
                      {/* 📅 DATE (Top on mobile, left on desktop) */}
                      <div className="lg:col-span-2 flex items-center justify-between lg:justify-start lg:flex-col lg:items-start gap-2 lg:gap-1 pl-0 lg:pl-4">
                        <div className="flex flex-col">
                          <span className={cn(
                            "font-heavy text-2xl sm:text-3xl md:text-4xl lg:text-5xl transition-colors duration-500 whitespace-nowrap tracking-tighter leading-none",
                            (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "july-4th-gradient" : "text-black/80 group-hover:text-black"
                          )}>
                            {dayNumber ? `${dateMonth.substring(0, 3)} ${dayNumber}` : dateMonth}
                          </span>
                          <span className={cn(
                            "font-mono text-[10px] mt-1 tracking-[0.1em] uppercase block lg:hidden xl:block",
                            (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "text-[#3366ff]" : "text-black/50"
                          )}>
                            {event.time.split("—")[0]}
                          </span>
                        </div>
                        
                        {/* Mobile Ping Indicator (only on mobile) */}
                        {shouldPing && (
                          <div className="lg:hidden flex items-center gap-2 px-2 py-1 rounded-full bg-black/[0.04] border border-black/5">
                            <span className="relative flex h-2 w-2">
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${event.recentlyDropped ? "bg-cyan-500" : "bg-primary"}`} />
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${event.recentlyDropped ? "bg-cyan-500" : "bg-primary"}`} />
                            </span>
                            <span className="font-mono text-[8px] tracking-widest text-black/40 font-bold">
                              {event.recentlyDropped ? "NEW DROP" : "LIVE"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 📡 TELEMETRY (Desktop only) */}
                      <div className="lg:col-span-1 hidden lg:flex flex-col items-center gap-4">
                        {shouldPing && (
                          <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center bg-white shadow-sm overflow-hidden relative">
                             <motion.div 
                                className={`absolute inset-0 opacity-10 ${event.recentlyDropped ? "bg-cyan-500" : seriesAccent[event.series]}`}
                                animate={{ opacity: [0.05, 0.15, 0.05] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                             />
                            <div className="relative flex h-2 w-2">
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${event.recentlyDropped ? "bg-cyan-600" : seriesAccent[event.series]}`} />
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${event.recentlyDropped ? "bg-cyan-600" : seriesAccent[event.series]}`} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 🎫 EVENT IDENTITY */}
                      <div className="lg:col-span-4 flex flex-col gap-2 pl-0 lg:pl-4">
                        <h3 className={cn(
                          "font-heavy text-[clamp(1.4rem,5vw,2.5rem)] lg:text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[0.9] transition-all duration-500 tracking-tight",
                          (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "july-4th-gradient" : "text-black/80 group-hover:text-black"
                        )}>
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 bg-black/5 border border-black/10 rounded-full ${seriesTextAccent[event.series]}`}>
                            {seriesLabels[event.series]}
                          </span>
                          {event.recentlyDropped && (
                            <span className="text-[9px] font-black tracking-[0.18em] uppercase px-2.5 py-1 bg-cyan-500 text-white rounded-full shadow-sm">
                              NEW DROP
                            </span>
                          )}
                          {event.status === "on-sale" && !event.recentlyDropped && (
                            <span className="text-[9px] font-black tracking-[0.18em] uppercase px-2.5 py-1 bg-black text-white rounded-full shadow-sm">
                              ACTIVE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 📍 VENUE (Desktop only) */}
                      <div className="lg:col-span-2 hidden lg:flex flex-col">
                        <span className={cn(
                          "font-serif italic text-xl lg:text-2xl leading-tight transition-colors duration-500",
                          (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "july-4th-gradient !italic" : "text-black/70 group-hover:text-black"
                        )}>{event.venue}</span>
                        <span className="text-[9px] text-black/40 font-mono mt-0.5 tracking-widest uppercase">{event.location}</span>
                      </div>

                      {/* ⚡ ACTION (Full width on mobile) */}
                      <div className="lg:col-span-3 flex flex-row items-center justify-between lg:justify-end gap-4 lg:pr-4 w-full mt-2 lg:mt-0">
                         <div onClick={(e) => e.stopPropagation()} className="flex-1 lg:flex-none z-20">
                           <ConversionCTA event={event} size="sm" showUrgency={true} className="w-full md:w-auto" />
                         </div>
                         <div className={`flex flex-col items-center justify-center transition-all duration-300 ${isExpanded ? "text-primary" : "text-black/40 group-hover:text-black"}`}>
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${isExpanded ? "bg-black text-white border-black rotate-90" : "border-black/10 group-hover:border-black/30 bg-white"}`}>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                         </div>
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
                        className="overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.02),transparent_100%)] border-t border-black/5"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 px-6 md:px-10 py-10 lg:py-16">
                          
                          {/* Image Visual (Mobile: small crop, Desktop: full aspect) */}
                          <div className="lg:col-span-4 order-2 lg:order-1">
                             <div className="aspect-video lg:aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 relative shadow-md">
                                <img 
                                  src={event.image || seriesDefaultImage[event.series]} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover mix-blend-multiply opacity-95 transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-4 left-4 flex flex-col">
                                   <span className="font-mono text-[9px] tracking-widest text-white/90 uppercase mb-1">Visual Logic</span>
                                   <span className="font-heavy text-xs text-white uppercase tracking-tighter">{event.series.replace('-', ' ')}</span>
                                </div>
                             </div>
                          </div>

                          {/* Content Narrative */}
                          <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                               <div className="h-px w-8 md:w-16 bg-black/20" />
                               <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/60 font-black">Event Dossier</span>
                            </div>
                            
                            <p className="text-xl md:text-2xl lg:text-3xl font-serif italic text-black/80 mb-10 md:mb-12 max-w-3xl leading-snug">
                              {event.description || event.experienceIntro || "Join us for a night built on sound, intention, and proper scale."}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 lg:mb-12">
                              {/* Stat Card: Personnel */}
                              <div className="p-6 md:p-8 bg-white/80 border border-black/5 rounded-[1.5rem] shadow-sm">
                                <span className={cn(
                                  "font-mono text-[9px] uppercase tracking-[0.4em] mb-4 block",
                                  event.lineup ? "text-primary/70" : "text-black/30"
                                )}>Lineup Detail</span>
                                <p className="font-heavy text-xl md:text-2xl leading-tight text-black uppercase tracking-tight">{event.lineup || "Manifesting"}</p>
                              </div>

                              {/* Stat Card: Logistics */}
                              <div className="p-6 md:p-8 bg-white/80 border border-black/5 rounded-[1.5rem] shadow-sm">
                                <span className="font-mono text-[9px] uppercase tracking-[0.4em] mb-4 block text-black/30">Architecture</span>
                                <p className="font-heavy text-xl md:text-2xl leading-tight text-black uppercase tracking-tight">{event.venue}</p>
                                <p className="text-[10px] text-black/40 mt-3 font-mono tracking-widest uppercase">{event.time} @ {event.location}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center">
                              {event.ticketUrl ? (
                                <a 
                                  href={event.ticketUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onMouseEnter={() => preconnectGateway(event.ticketUrl!)}
                                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black text-white font-bold text-[10px] tracking-[0.25em] uppercase hover:bg-primary transition-all duration-300"
                                >
                                  {CTA_LABELS.tickets}
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                              ) : (
                                <button className="px-8 py-4 rounded-full border border-black/10 bg-black/5 text-black/30 font-bold text-[10px] tracking-[0.25em] uppercase cursor-default">
                                  Coordinates LockedSoon
                                </button>
                              )}

                              <button
                                onClick={(e) => { e.stopPropagation(); downloadICS(event); }}
                                className="group inline-flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] uppercase text-black/70 hover:text-black px-6 py-4 border border-black/10 rounded-full transition-all"
                              >
                                <CalendarPlus className="w-4 h-4" />
                                Save Date
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
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-20 px-4 border-t border-black/10">
          <p className="text-black/40 text-[9px] font-mono uppercase tracking-[0.4em]">
             New dates landing weekly. Stay synchronized.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/schedule">
              <span className="group inline-flex items-center gap-2 text-black font-black text-[10px] tracking-[0.3em] uppercase transition-all hover:text-primary cursor-pointer">
                Full Master Schedule
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/newsletter">
              <span className="group inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-[#7F311D] hover:text-black transition-colors cursor-pointer">
                Secure Early Pass
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
