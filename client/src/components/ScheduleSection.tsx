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
  "chasing-sunsets": "/images/chasing-sunsets.jpg",
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
    <section ref={sectionRef} id="schedule" className="relative py-24 md:py-40 bg-[#EAEAEA] overflow-hidden border-t border-black/10">
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

      <div className="absolute inset-0 pointer-events-none opacity-40">
         <div className="absolute left-[5%] md:left-[8%] top-0 bottom-0 w-px bg-black/10" />
         <div className="absolute right-[5%] md:right-[8%] top-0 bottom-0 w-px bg-black/10" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[90rem] px-6">
        {/* Header Block */}
        <div className="mb-16 md:mb-24 flex flex-col gap-8 md:flex-row md:items-end justify-between border-b border-black/10 pb-12">
          <div className="relative">
             <span className="absolute -top-8 left-1 md:-top-12 md:left-2 font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-[#7F311D]/70 uppercase">Upcoming Series</span>
             <h2 className="font-heavy text-[clamp(3.2rem,12vw,9.5rem)] leading-[0.85] tracking-tight text-[#7F311D] uppercase drop-shadow-sm">
               <KineticDecryption text="SCHEDULE" />
             </h2>
             <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-black/50 pl-2 md:pl-6 border-l border-[#7F311D]/30 mt-6 max-w-sm">
               Start with the next date. The series and the room will tell you the rest.
             </p>
          </div>

          <div className="flex overflow-x-auto no-scrollbar max-w-full gap-1 p-1 bg-black/[0.03] border border-black/10 rounded-[2rem] md:rounded-full backdrop-blur-md z-20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)]">
            {months.map(month => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`relative shrink-0 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 ${activeMonth === month
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

        {/* List Header - HUD Style mapped to light mode */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-6 pt-4 text-[9px] uppercase tracking-[0.25em] font-mono text-black/40">
          <div className="col-span-2 pl-4">Date / Time</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-4 pl-4">Event / Series</div>
          <div className="col-span-2">Venue</div>
          <div className="col-span-3 text-right pr-8">Action</div>
        </div>

        {/* Polished Schedule List Component */}
        <div className="flex flex-col mb-12 rounded-[2rem] overflow-hidden border border-black/10 bg-white/60 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-24 border-b border-black/5">
              <span className="block font-heavy text-3xl text-black/30 mb-4 tracking-tight uppercase">No Events Found</span>
              <p className="font-mono text-[10px] text-black/40 uppercase tracking-widest">No matching events found for {activeMonth}</p>
            </div>
          ) : (
            filteredEvents.map((event, index) => {
              const isExpanded = expandedId === event.id;
              const [dateMonth, dateDay] = event.date.split(" ");
              const dayNumber = parseInt(dateDay) || "";

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group border-b border-black/[0.08] relative last:border-b-0"
                >
                  {/* Accent Highlight Bar on Left */}
                  <div className={`absolute top-0 bottom-0 left-0 w-[4px] bg-black opacity-0 transition-opacity duration-500 ${isExpanded ? 'opacity-10' : 'group-hover:opacity-10'}`} />

                  {/* Main Row */}
                  <div
                    className={`w-full relative z-10 transition-colors duration-500 group px-6 md:px-4 cursor-pointer ${isExpanded ? "bg-white/40" : "hover:bg-black/[0.02]"}`}
                    onClick={() => toggle(event.id)}
                  >
                    <div className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:items-center w-full text-left">
                      {/* Date Col */}
                      <div className="md:col-span-2 flex flex-col items-start gap-1 md:items-start md:gap-0 pl-0 md:pl-4">
                        <span className={cn(
                          "font-heavy text-3xl md:text-5xl transition-colors duration-500 whitespace-nowrap tracking-tighter",
                          (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "july-4th-gradient" : "text-black/80 group-hover:text-black"
                        )}>
                          {dayNumber ? `${dateMonth.substring(0, 3)} ${dayNumber}` : dateMonth}
                        </span>
                        <span className={cn(
                          "font-mono text-[10px] md:mt-2 tracking-[0.1em] uppercase",
                          (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "text-[#3366ff] opacity-100" : "text-black/50"
                        )}>
                          {event.time.split("—")[0]}
                        </span>
                      </div>

                      {/* Indicator Col */}
                      <div className="md:col-span-1 hidden md:flex flex-col items-center gap-4">
                        <div className={`w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-sm overflow-hidden relative group-hover:border-black/30 transition-colors duration-500`}>
                           <motion.div 
                              className={`absolute inset-0 opacity-10 ${(dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "bg-red-500" : seriesAccent[event.series]}`}
                              animate={{ opacity: [0.05, 0.15, 0.05] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                           />
                          <div className="relative flex h-2 w-2">
                            <span className={`absolute inline-flex h-full w-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-60 ${(dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "bg-red-600" : seriesAccent[event.series]}`} />
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${(dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "bg-red-600" : seriesAccent[event.series]}`} />
                          </div>
                        </div>
                      </div>

                      {/* Title Col */}
                      <div className="md:col-span-4 flex flex-col gap-2 pl-0 md:pl-4">
                        <h3 className={cn(
                          "font-heavy text-[clamp(1.8rem,4vw,2.8rem)] uppercase leading-[0.9] transition-all duration-500 tracking-tight",
                          (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "july-4th-gradient" : "text-black/80 group-hover:text-black"
                        )}>
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 md:mt-1">
                          <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 bg-black/5 border border-black/10 rounded-full ${seriesTextAccent[event.series]}`}>
                            {seriesLabels[event.series]}
                          </span>
                          {event.status === "on-sale" && (
                            <span className="text-[9px] font-black tracking-[0.18em] uppercase px-3 py-1 bg-black text-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
                              ON SALE
                            </span>
                          )}
                          {event.startingPrice && event.status !== "sold-out" && (
                            <span className="text-[9px] font-mono tracking-[0.2em] uppercase px-3 py-1 bg-transparent border border-black/10 text-black/60 rounded-full">
                              From ${event.startingPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Location Col */}
                      <div className="md:col-span-2 hidden md:flex flex-col">
                        <span className={cn(
                          "font-serif italic text-xl md:text-2xl leading-tight transition-colors duration-500",
                          (dateMonth.toUpperCase().startsWith("JUL") && (dayNumber === 4 || dayNumber === 5)) ? "july-4th-gradient !italic" : "text-black/70 group-hover:text-black"
                        )}>{event.venue}</span>
                        <span className="text-[9px] text-black/40 font-mono mt-1 tracking-widest uppercase">{event.location}</span>
                      </div>

                      {/* Action Col & Exposed Details */}
                      <div className="md:col-span-3 flex flex-col md:flex-row justify-end items-start md:items-center gap-4 md:pr-4 w-full mt-4 md:mt-0">
                         <div onClick={(e) => e.stopPropagation()} className="w-full md:w-auto z-20">
                           <ConversionCTA event={event} size="sm" showUrgency={false} className="w-full md:w-auto" />
                         </div>
                         <div className={`hidden md:flex flex-col items-center justify-center transition-all duration-300 ${isExpanded ? "text-primary" : "text-black/50 group-hover:text-black"}`}>
                            <span className="text-[9px] font-mono tracking-[0.2em] uppercase mb-1">Details</span>
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isExpanded ? "bg-black text-white border-black rotate-90" : "border-black/10 group-hover:border-black/30 bg-white group-hover:bg-black/5"}`}>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Dossier Details - Cinematic Content Expansion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4),transparent_100%)] border-t border-black/5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-10 py-10 md:py-16">
                          {/* Left Panel: Image Asset */}
                          <div className="md:col-span-3 hidden md:block">
                             <div className="aspect-[4/5] rounded-xl overflow-hidden border border-black/10 relative shadow-sm">
                                <img 
                                  src={event.image || seriesDefaultImage[event.series]} 
                                  alt={event.title} 
                                  className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-widest text-white/90 uppercase">Event Visual</span>
                             </div>
                          </div>

                          {/* Right Panel: Content Brief */}
                          <div className="md:col-span-9">
                            <div className="flex items-center gap-3 mb-6">
                               <div className="h-px w-12 bg-black/20" />
                               <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/60 font-bold">Event Details</span>
                            </div>
                            
                            <p className="text-xl md:text-2xl font-serif italic text-black/80 mb-10 max-w-3xl leading-relaxed">
                              {event.description || event.experienceIntro || "Join us for a night built on sound, intention, and proper scale."}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                              {/* Dossier Card: Lineup */}
                              <div className="p-6 bg-white/70 border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4 text-black/40">
                                  <Music className="w-4 h-4" />
                                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/60">Lineup</span>
                                </div>
                                <p className="font-heavy text-xl lg:text-2xl leading-[1.1] text-black uppercase tracking-tight drop-shadow-sm">{event.lineup || "To Be Announced"}</p>
                              </div>

                              {/* Dossier Card: Venue */}
                              <div className="p-6 bg-white/70 border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4 text-black/40">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/60">Venue</span>
                                </div>
                                <p className="font-heavy text-xl lg:text-2xl leading-[1.1] text-black uppercase tracking-tight drop-shadow-sm">{event.venue}</p>
                                <p className="text-[9px] text-black/50 mt-2 font-mono tracking-widest uppercase">{event.location}</p>
                              </div>

                              {/* Dossier Card: Time Details */}
                              <div className="p-6 bg-white/70 border border-black/5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4 text-black/40">
                                  <Clock className="w-4 h-4" />
                                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-black/60">Time</span>
                                </div>
                                <p className="font-mono text-sm font-bold text-black uppercase tracking-widest">{event.time}</p>
                                <p className="text-[9px] text-black/50 mt-2 font-mono tracking-widest uppercase">{[event.age, event.dress].filter(Boolean).join(" · ")}</p>
                              </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-wrap gap-4 items-center">
                              {event.ticketUrl ? (
                                <a 
                                  href={event.ticketUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onMouseEnter={() => preconnectGateway(event.ticketUrl!)}
                                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-black text-white font-bold text-[10px] tracking-[0.25em] uppercase hover:bg-black/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                >
                                  {CTA_LABELS.tickets}
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                              ) : (
                                <button disabled className="px-8 py-4 rounded-full border border-black/10 bg-black/5 text-black/40 font-bold text-[10px] tracking-[0.25em] uppercase cursor-not-allowed">
                                  Coming Soon
                                </button>
                              )}

                              <button
                                onClick={(e) => { e.stopPropagation(); downloadICS(event); }}
                                className="group inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-black/70 hover:text-black px-6 py-4 border border-black/20 rounded-full hover:bg-white shadow-sm hover:shadow transition-all"
                              >
                                <CalendarPlus className="w-4 h-4" />
                                Save Date
                              </button>

                              {event.tableReservationEmail && (
                                <a href={`mailto:${event.tableReservationEmail}`} className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-black/60 hover:text-black transition-colors ml-2 underline decoration-black/20 underline-offset-[6px]">
                                  Table Enquiry
                                </a>
                              )}
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

        {/* Footer actions */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-20 px-2 border-t border-black/10">
          <p className="text-black/50 text-[10px] font-mono uppercase tracking-[0.3em]">
             More dates are on the way. Keep watch.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/schedule">
              <span className="group inline-flex items-center gap-2 text-black font-bold text-[10px] tracking-[0.3em] uppercase transition-all hover:text-black cursor-pointer">
                View Full Schedule
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/newsletter">
              <span className="group inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase text-[#7F311D] hover:text-black transition-colors cursor-pointer">
                Get Early Access
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
