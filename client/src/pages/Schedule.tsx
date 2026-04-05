import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Music, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import SocialGrid from "@/components/SocialGrid";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import { buildScheduleSchema } from "@/lib/schema";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { Link } from "wouter";
import {
  getPrimaryTicketUrl,
  getScheduledEvents,
  isTicketOnSale,
} from "@/lib/siteExperience";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import ConversionCTA from "@/components/ConversionCTA";
import { usePublicSiteDataVersion } from "@/lib/siteData";

const seriesAccent: Record<string, string> = {
  "chasing-sunsets": "bg-clay",
  "untold-story": "bg-primary",
  "monolith-project": "bg-transparent",
};

const seriesTextAccent: Record<string, string> = {
  "chasing-sunsets": "text-clay",
  "untold-story": "text-primary",
  "monolith-project": "text-foreground",
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

export default function Schedule() {
  usePublicSiteDataVersion();
  const scheduleEvents = getScheduledEvents();
  const [expandedId, setExpandedId] = useState<string | null>(scheduleEvents[0]?.id || null);
  const [activeMonth, setActiveMonth] = useState<string>("ALL");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [starredIds, setStarredIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("monolith-starred-rites");
    if (saved) setStarredIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("monolith-starred-rites", JSON.stringify(starredIds));
  }, [starredIds]);

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Group events by month for the filter
  const months = ["ALL", ...Array.from(new Set(scheduleEvents.map(e => {
    return e.date.split(" ")[0].toUpperCase();
  })))];

  const filteredEvents = (() => {
    let events = scheduleEvents;
    if (activeMonth === "MY_LINEUP") {
        events = events.filter(e => starredIds.includes(e.id));
    } else if (activeMonth !== "ALL") {
        events = events.filter(e => e.date.toUpperCase().startsWith(activeMonth));
    }
    return events;
  })();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title="Chicago Event Schedule | Chasing Sun(Sets) + Monolith Project"
        description="Official schedule for Chasing Sun(Sets) and The Monolith Project in Chicago with event dates, venues, lineup details, and ticket links."
        canonicalPath="/schedule"
      />
      <JsonLd data={buildScheduleSchema(scheduleEvents)} />
      <Navigation />

      {/* Background Atmosphere */}
      <div className="fixed inset-0 bg-[#020202] z-0" />
      
      {/* Cinematic Background Image Projection */}
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            key={hoveredImage}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(40px)" }}
            animate={{ opacity: 0.45, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(40px)" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <img 
              src={hoveredImage} 
              alt="Background Projection" 
              className="w-full h-full object-cover opacity-60 grayscale-[60%] mix-blend-screen"
            />
            {/* Architectural Vignette Masks */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#020202]/40 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(224,90,58,0.18),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.12),transparent_50%)] z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-noise opacity-[0.05] mix-blend-overlay z-0 pointer-events-none" />

      <main className="relative page-shell-start pb-24 z-10">
        <div className="container mx-auto px-4 md:px-8 max-w-[96%]">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-28 gap-10">
            <div className="relative">
              <span className="absolute -top-12 left-2 font-mono text-[10px] tracking-[0.4em] text-primary/60 uppercase">The Series / 2026 Archive</span>
              <h1 className="font-display text-[clamp(4.5rem,14vw,12rem)] leading-[0.82] tracking-tight-display text-foreground uppercase">
                Schedule
              </h1>
              <p className="font-mono text-xs md:text-sm tracking-[0.2em] text-muted-foreground mt-8 uppercase max-w-sm leading-relaxed ml-2 border-l border-primary/20 pl-6">
                Upcoming Monolith events, organized by month and series.
              </p>
            </div>

            {/* Month Filters - Glassmorphic Architectural Style */}
            <div className="flex flex-wrap gap-1 p-1.5 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-xl">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => setActiveMonth(month)}
                  className={`relative px-6 py-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 ${activeMonth === month
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {activeMonth === month && (
                    <motion.div
                      layoutId="schedule-active-tab-page"
                      className="absolute inset-0 bg-primary/95 rounded-full shadow-[0_4px_20px_rgba(224,90,58,0.3)]"
                      transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{month}</span>
                </button>
              ))}

              <button
                onClick={() => setActiveMonth("MY_LINEUP")}
                className={`relative px-6 py-3 rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 ${activeMonth === "MY_LINEUP"
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                  {activeMonth === "MY_LINEUP" && (
                    <motion.div
                      layoutId="schedule-active-tab-page"
                      className="absolute inset-0 bg-primary/95 rounded-full shadow-[0_4px_20px_rgba(224,90,58,0.3)]"
                      transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">My Lineup</span>
              </button>
            </div>
          </div>

          <EntityBoostStrip tone="light" className="mb-16 px-0 opacity-80" contextLabel="The Seasonal Record" />

          {/* List Header - HUD Style */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-white/5 text-[9px] uppercase tracking-[0.25em] font-mono text-muted-foreground/50">
            <div className="col-span-2 pl-4">Chronology / Time</div>
            <div className="col-span-1 text-center">Protocol</div>
            <div className="col-span-4">Experience / Series</div>
            <div className="col-span-3">Venue / Coordinates</div>
            <div className="col-span-2 text-right pr-12">Action</div>
          </div>

          {/* Event List */}
          <div className="flex flex-col mb-24 rounded-3xl overflow-hidden border border-white/[0.08] bg-white/[0.01] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-32 border-b border-white/5">
                <span className="block font-display text-4xl text-muted-foreground mb-4 opacity-30">Empty Archive</span>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">No matching events found for sequence {activeMonth}</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => {
                const isExpanded = expandedId === event.id;
                const [dateMonth, dateDay] = event.date.split(" ");
                const dayNumber = parseInt(dateDay) || "";

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="group border-b border-white/[0.05] relative"
                  >
                    {/* Main Row - Premium Interaction Surface */}
                    <div
                      className="w-full relative z-10 hover:bg-white/[0.03] transition-all duration-700 group px-6 md:px-4"
                      role="button"
                      tabIndex={0}
                      data-cursor-image={event.image || seriesDefaultImage[event.series]}
                      onMouseEnter={() => setHoveredImage(event.image || seriesDefaultImage[event.series] || null)}
                      onMouseLeave={() => setHoveredImage(null)}
                      onClick={() => toggle(event.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(event.id);
                        }
                      }}
                    >
                      <div className="py-8 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:items-center w-full text-left">
                        {/* Date Col - Architectural Presentation */}
                        <div className="md:col-span-2 flex flex-col items-start gap-1 md:items-start md:gap-0 pl-0 md:pl-4">
                          <span className="font-display text-2xl md:text-4xl text-foreground/90 group-hover:text-foreground transition-colors duration-500 whitespace-nowrap tracking-tighter">
                            {dayNumber ? `${dateMonth.substring(0, 3)} ${dayNumber}` : dateMonth}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground/40 md:mt-2 tracking-[0.1em] group-hover:text-primary/60 transition-colors duration-500 uppercase">
                            {event.time.split("—")[0]} CST
                          </span>
                        </div>

                        {/* Thumbnail/Indicator Col - Active Radar + Star */}
                        <div className="md:col-span-1 hidden md:flex flex-col items-center gap-4">
                          <button 
                            onClick={(e) => toggleStar(event.id, e)}
                            className={`w-8 h-8 flex items-center justify-center transition-colors ${starredIds.includes(event.id) ? "text-primary" : "text-white/20 hover:text-white/40"}`}
                          >
                             <div className={`w-2 h-2 rounded-full ${starredIds.includes(event.id) ? "bg-primary animate-pulse shadow-[0_0_10px_rgba(224,90,58,0.8)]" : "bg-current"}`} />
                          </button>
                          
                          <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/40 overflow-hidden relative group-hover:border-primary/30 transition-colors duration-500`}>
                             <motion.div 
                                className={`absolute inset-0 opacity-20 ${seriesAccent[event.series]}`}
                                animate={{ opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                             />
                            <div className="relative flex h-2 w-2">
                              <span className={`absolute inline-flex h-full w-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-75 ${seriesTextAccent[event.series] === 'text-foreground' ? 'bg-primary' : seriesTextAccent[event.series].replace('text-', 'bg-')}`} />
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${seriesTextAccent[event.series] === 'text-foreground' ? 'bg-primary' : seriesTextAccent[event.series].replace('text-', 'bg-')}`} />
                            </div>
                          </div>
                        </div>

                        {/* Title Col - Impact Focus */}
                        <div className="md:col-span-4 flex flex-col gap-2">
                          <h3 className="font-display text-[clamp(1.8rem,5vw,3.6rem)] uppercase leading-[0.88] text-foreground/80 group-hover:text-foreground transition-all duration-500 tracking-tight-display">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 md:mt-1">
                            <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full ${seriesTextAccent[event.series]}`}>
                              {seriesLabels[event.series]}
                            </span>
                            {isTicketOnSale(event) && (
                              <motion.span 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-[9px] font-black tracking-[0.18em] uppercase px-3 py-1 bg-primary text-white rounded-full shadow-[0_8px_20px_rgba(224,90,58,0.25)]"
                              >
                                TICKETS ACTIVE
                              </motion.span>
                            )}
                          </div>
                        </div>

                        {/* Location Col - Minimal Detail */}
                        <div className="md:col-span-3 hidden md:flex flex-col">
                          <span className="font-display text-xl leading-tight text-foreground/60 transition-colors duration-500 group-hover:text-foreground/90 uppercase tracking-wide">{event.venue}</span>
                          <span className="text-[10px] text-muted-foreground/30 font-mono mt-2 tracking-widest uppercase">{event.location}</span>
                        </div>

                        {/* Action Col - Directional Arrow */}
                        <div className="md:col-span-2 flex justify-end items-center md:pr-10">
                          <div className={`w-12 h-12 rounded-full border border-white/5 flex items-center justify-center transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isExpanded ? "bg-white text-black rotate-90" : "group-hover:border-primary/40 group-hover:bg-primary group-hover:text-white"}`}>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dossier Details - Cinematic Reveal */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_70%)]"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 px-6 md:px-12 py-12 md:py-20 border-t border-white/[0.05]">
                            {/* Visual Asset / Map Mock / Graphic */}
                            <div className="md:col-span-3 hidden md:block">
                               <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 relative group-inner">
                                  <img 
                                    src={event.image || seriesDefaultImage[event.series]} 
                                    alt={event.title} 
                                    className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                  <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-widest text-white/40 uppercase">Vessel Record {event.id}</span>
                               </div>
                            </div>

                            {/* Content Brief Area */}
                            <div className="md:col-span-9 pr-0 md:pr-12">
                              <div className="flex items-center gap-3 mb-8">
                                 <div className="h-px w-12 bg-primary/40" />
                                 <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary/80 font-bold">Experience Briefing</span>
                              </div>
                              
                              <p className="text-2xl md:text-3xl font-display italic text-foreground/90 mb-12 max-w-3xl leading-[1.3] tracking-tight">
                                {event.description || event.experienceIntro || "Join us for a night built on sound, architectural presence, and the record we leave behind."}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {/* Lineup Dossier Card */}
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md relative overflow-hidden group/card hover:border-white/10 transition-colors duration-500">
                                  <div className="flex items-center gap-3 mb-5 text-muted-foreground/30">
                                    <Music className="w-4 h-4" />
                                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Sonic Roster</span>
                                  </div>
                                  <p className="font-display text-2xl leading-[1.1] text-foreground uppercase">{event.lineup || "To Be Announced"}</p>
                                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover/card:w-full transition-all duration-700" />
                                </div>

                                {/* Venue Dossier Card */}
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md relative overflow-hidden group/card hover:border-white/10 transition-colors duration-500">
                                  <div className="flex items-center gap-3 mb-5 text-muted-foreground/30">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Spatial Vector</span>
                                  </div>
                                  <p className="font-display text-2xl leading-[1.1] text-foreground uppercase">{event.venue}</p>
                                  <p className="text-[10px] text-muted-foreground/40 mt-3 font-mono tracking-widest uppercase">{event.location}</p>
                                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover/card:w-full transition-all duration-700" />
                                </div>

                                {/* Details Dossier Card */}
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md relative overflow-hidden group/card hover:border-white/10 transition-colors duration-500">
                                  <div className="flex items-center gap-3 mb-5 text-muted-foreground/30">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Timing / Logic</span>
                                  </div>
                                  <p className="font-mono text-sm font-bold text-foreground/90 uppercase tracking-widest">{event.time}</p>
                                  <p className="text-[10px] text-muted-foreground/40 mt-3 font-mono tracking-widest uppercase">{event.age} // {event.dress}</p>
                                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover/card:w-full transition-all duration-700" />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-6 items-center">
                                <ConversionCTA 
                                  event={event}
                                  size="lg"
                                  showUrgency={true}
                                />
                                {event.tableReservationEmail && (
                                  <a href={`mailto:${event.tableReservationEmail}`} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-primary transition-all duration-500 underline decoration-white/10 underline-offset-[12px] decoration-1 hover:decoration-primary/50">
                                    TABLE ENQUIRIES
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
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

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-t border-white/5 pt-16">
            <div className="flex flex-col gap-2">
               <p className="text-muted-foreground/40 text-[10px] font-mono tracking-[0.2em] uppercase">
                Further sequences to be decrypted specific to seasonal windows.
               </p>
               <p className="text-muted-foreground/20 text-[9px] font-mono tracking-widest italic uppercase">Monolith Project Record: {new Date().getFullYear()} // v1.0.4</p>
            </div>
            <div className="flex items-center gap-8">
               <Link href="/newsletter" className="font-mono text-[10px] tracking-[0.4em] text-primary/70 hover:text-primary uppercase transition-colors">Join SMS Updates</Link>
               <Link href="/vip" className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground/40 hover:text-foreground uppercase transition-colors">Request VIP Access</Link>
            </div>
          </div>
        </div>
      </main>

      <SocialGrid />
    </div>
  );
}
