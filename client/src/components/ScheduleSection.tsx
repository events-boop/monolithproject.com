import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Music, MapPin, CalendarPlus } from "lucide-react";
import { Link } from "wouter";
import { upcomingEvents, type ScheduledEvent } from "../data/events";
import { CTA_LABELS } from "@/lib/cta";
import WordScrubReveal from "@/components/ui/WordScrubReveal";

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
  link.setAttribute("download", `${event.title.replace(/\\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const seriesGlow: Record<string, string> = {
  "chasing-sunsets": "group-hover:bg-[#E8B86D]",
  "untold-story": "group-hover:bg-[#22D3EE]",
  "monolith-project": "group-hover:bg-primary",
};

const seriesTextAccent: Record<string, string> = {
  "chasing-sunsets": "text-[#E8B86D] group-hover:drop-shadow-[0_0_15px_rgba(232,184,109,0.5)]",
  "untold-story": "text-[#22D3EE] group-hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]",
  "monolith-project": "text-primary group-hover:drop-shadow-[0_0_15px_rgba(224,90,58,0.5)]",
};

const seriesLabels: Record<string, string> = {
  "chasing-sunsets": "SUN(SETS)",
  "untold-story": "UNTOLD",
  "monolith-project": "MONOLITH",
};

export default function ScheduleSection() {
  const [expandedId, setExpandedId] = useState<string | null>(upcomingEvents[0]?.id || null);
  const [activeMonth, setActiveMonth] = useState<string>("ALL");

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Group events by month
  const months = ["ALL", ...Array.from(new Set(upcomingEvents.map(e => {
    return e.date.split(" ")[0].toUpperCase();
  })))];

  const filteredEvents = activeMonth === "ALL"
    ? upcomingEvents
    : upcomingEvents.filter(e => e.date.toUpperCase().startsWith(activeMonth));

  return (
    <section id="schedule" className="relative py-24 md:py-40 bg-[#EAEAEA] overflow-hidden border-t border-black/10">
      {/* Brutalist Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
         <div className="absolute left-[5%] md:left-[8%] top-0 bottom-0 w-px bg-black/10" />
         <div className="absolute right-[5%] md:right-[8%] top-0 bottom-0 w-px bg-black/10" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[90rem] px-6">

        {/* Header Block */}
        <div className="mb-16 md:mb-24 flex flex-col gap-8 md:flex-row md:items-end md:justify-between border-b border-black/10 pb-12">
          <div className="flex flex-col gap-4 max-w-2xl">
            <WordScrubReveal 
              text="SCHEDULE" 
              className="font-heavy text-[clamp(4.5rem,10vw,9.5rem)] leading-[0.85] tracking-tight text-[#7F311D] uppercase drop-shadow-sm" 
            />
            <p className="font-mono text-xs lg:text-[11px] uppercase tracking-[0.3em] text-black/70 pl-1 mt-2">
              Start with the next date. The series and the room will tell you the rest.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3 pb-2 z-20">
            {months.map(month => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`px-6 py-3 border rounded-none text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-500 hover:border-black/40 ${activeMonth === month
                  ? "bg-black text-white border-black"
                  : "bg-transparent border-black/20 text-black/75 hover:bg-black/5 hover:text-black"
                  }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="flex flex-col gap-0 border-t border-black/20 relative z-20">
          <div className="hidden grid-cols-12 gap-4 border-b border-black/20 px-4 py-4 text-[9px] font-mono uppercase tracking-[0.3em] text-black/65 md:grid">
            <div className="col-span-3">Date / Time</div>
            <div className="col-span-5 pl-8">Event</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="flex flex-col">
          {filteredEvents.length === 0 ? (
            <div className="py-16 px-4 md:px-10 border-b border-black/15 flex items-center gap-6">
              <div className="w-1.5 h-12 bg-black/10" />
              <div>
                <p className="font-heavy text-2xl uppercase text-black/65 tracking-tighter">No Events Scheduled For {activeMonth}.</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/60 mt-2">More dates incoming — get early access to be first.</p>
              </div>
            </div>
          ) : filteredEvents.map((event, index) => {
            const isExpanded = expandedId === event.id;
            const [dateMonth, dateDay] = event.date.split(" ");
            const dayNumber = parseInt(dateDay) || "";
            const isSunsets = event.series === "chasing-sunsets";
            const isStory = event.series === "untold-story";
            const glowClass = isSunsets ? "bg-[#E8B86D]" : isStory ? "bg-[#22D3EE]" : "bg-primary";
            const dateColorClass = isSunsets ? "text-[#8F5B0A]" : isStory ? "text-[#0E7490]" : "text-[#7F311D]";
            const hoverAccentText = isSunsets ? "group-hover:text-[#8F5B0A]" : isStory ? "group-hover:text-[#0E7490]" : "group-hover:text-[#7F311D]";

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`group relative overflow-hidden transition-colors duration-500 border-b border-black/15 last:border-b-0 ${
                  isExpanded ? "bg-white" : "hover:bg-white/40"
                }`}
              >
                {/* Brutalist Color Accent Edge (Left Side) */}
                <div className={`absolute top-0 bottom-0 left-0 w-[6px] opacity-0 transition-all duration-500 ${isExpanded ? 'opacity-100' : 'group-hover:opacity-100'} ${glowClass}`} />

                <div
                  className="relative z-10 w-full cursor-pointer px-4 md:px-0"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggle(event.id)}
                  data-cursor-text="VIEW"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(event.id);
                    }
                  }}
                >
                  <div className="grid w-full grid-cols-1 gap-6 py-8 md:py-12 md:grid-cols-12 md:items-center">
                    {/* Date Column */}
                    <div className="md:col-span-3 flex md:flex-col items-center md:items-start md:pl-10 gap-4 md:gap-0">
                      <span className={`font-heavy text-4xl md:text-5xl lg:text-7xl ${dateColorClass} tracking-tighter leading-none whitespace-nowrap`}>{dayNumber ? `${dateMonth.substring(0, 3)} ${dayNumber}` : dateMonth}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/70 md:mt-2 whitespace-nowrap">{event.time.split("—")[0]}</span>
                    </div>

                    {/* Main Title Column */}
                    <div className="md:col-span-5 flex flex-col gap-2 md:pl-8 pr-4 border-l border-black/10 md:border-none">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <span className={`text-[9px] font-bold tracking-[0.3em] uppercase ${isSunsets ? 'text-[#8F5B0A]' : isStory ? 'text-[#0E7490]' : 'text-[#7F311D]'}`}>
                          {seriesLabels[event.series]}
                        </span>
                        {event.status === "on-sale" && (
                          <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-black px-2 py-0.5 border border-black/30 rounded-full">
                            ON SALE
                          </span>
                        )}
                      </div>
                      <h3 className={`font-heavy text-[clamp(2.2rem,4vw,3.5rem)] uppercase leading-[0.9] text-black transition-all duration-500 ${hoverAccentText}`}>
                        {event.title}
                      </h3>
                    </div>

                    {/* Location Column */}
                    <div className="md:col-span-3 hidden md:flex flex-col gap-1 pr-4 border-l border-black/10 pl-8">
                      <span className="font-serif italic text-2xl leading-tight text-black/90">{event.venue}</span>
                      <span className="text-[10px] text-black/65 font-mono tracking-widest uppercase mt-1">{event.location}</span>
                    </div>

                    {/* Action Icon */}
                    <div className="md:col-span-1 hidden md:flex justify-end items-center pr-4">
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${isExpanded ? "bg-black text-white border-black rotate-90" : "border-black/20 text-black/40 group-hover:border-black/60 group-hover:text-black group-hover:scale-110"}`}>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details - Clean Architectural White Space */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                      className="overflow-hidden border-t border-black/10 bg-transparent"
                    >
                      <div className="grid grid-cols-1 gap-12 px-6 py-10 md:grid-cols-12 md:px-8 md:py-12 relative z-20">
                        <div className="md:col-span-3 hidden md:block border-r border-black/10 pr-8">
                          {/* Aesthetic Filler spacer for structural grid feel */}
                          <div className="w-full h-full flex items-end opacity-20 relative">
                             <div className="w-12 h-px bg-black/40 absolute bottom-0 left-0" />
                          </div>
                        </div>

                        <div className="md:col-span-9 pr-0 md:pl-8">
                          <p className="text-xl md:text-3xl font-serif font-light text-black/80 mb-12 max-w-4xl leading-tight text-balance">
                            {event.description || event.experienceIntro || "Join us for a night built on sound, intention, and proper scale."}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                            <div className="bg-[#EAEAEA]/50 border border-black/10 p-6 rounded-none relative overflow-hidden group/detail">
                              <div className="absolute inset-x-0 bottom-0 h-px w-0 bg-black/30 group-hover/detail:w-full transition-all duration-500" />
                              <div className="flex items-center gap-3 mb-4 text-black/40">
                                <Music className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Lineup</span>
                              </div>
                              <p className="font-heavy text-2xl md:text-3xl uppercase leading-[0.9] text-black drop-shadow-sm">{event.lineup || "To Be Announced"}</p>
                            </div>

                            <div className="bg-[#EAEAEA]/50 border border-black/10 p-6 rounded-none relative overflow-hidden group/detail">
                              <div className="absolute inset-x-0 bottom-0 h-px w-0 bg-black/30 group-hover/detail:w-full transition-all duration-500" />
                              <div className="flex items-center gap-3 mb-4 text-black/40">
                                <MapPin className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Location</span>
                              </div>
                              <p className="font-heavy text-2xl md:text-3xl uppercase leading-[0.9] text-black drop-shadow-sm">{event.venue}</p>
                              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50 mt-3">{event.location}</p>
                            </div>

                            <div className="bg-[#EAEAEA]/50 border border-black/10 p-6 rounded-none relative overflow-hidden group/detail">
                              <div className="absolute inset-x-0 bottom-0 h-px w-0 bg-black/30 group-hover/detail:w-full transition-all duration-500" />
                              <div className="flex items-center gap-3 mb-4 text-black/40">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Details</span>
                              </div>
                              <p className="font-heavy text-2xl md:text-3xl uppercase leading-[0.9] text-black drop-shadow-sm">{event.time}</p>
                              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/50 mt-3">{event.age} · {event.dress}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 items-center">
                            {event.ticketUrl ? (
                              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-none bg-black text-white font-bold text-[10px] tracking-[0.25em] uppercase hover:bg-transparent hover:text-black border border-transparent hover:border-black transition-all duration-300">
                                {CTA_LABELS.tickets}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </a>
                            ) : (
                              <button disabled className="px-8 py-4 rounded-none border border-black/20 text-black/30 font-bold text-[10px] tracking-[0.25em] uppercase cursor-not-allowed">
                                Coming Soon
                              </button>
                            )}

                            <button
                              onClick={() => downloadICS(event)}
                              className="group inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-black/70 hover:text-black px-6 py-4 border border-black/20 rounded-none hover:bg-black/5 transition-colors"
                            >
                              <CalendarPlus className="w-4 h-4" />
                              Save Date
                            </button>

                            {event.tableReservationEmail && (
                              <a href={`mailto:${event.tableReservationEmail}`} className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-black/60 hover:text-black transition-colors">
                                Book a Table
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
          })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-20">
          <p className="text-black/65 text-[10px] uppercase tracking-[0.3em] font-mono pl-4">
            More dates to be announced.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/schedule" asChild>
              <a className="group inline-flex items-center gap-3 px-6 py-3 rounded-none border border-black/30 text-black font-bold text-[9px] tracking-[0.25em] uppercase transition-all hover:bg-black hover:text-white">
                View Full Schedule
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
            <Link href="/newsletter" asChild>
              <a className="group inline-flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] uppercase text-[#7F311D] hover:text-black transition-colors">
                Get Early Access
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
