import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Music, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import SocialGrid from "@/components/SocialGrid";
import { upcomingEvents } from "@/data/events";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import { buildScheduleSchema } from "@/lib/schema";
import EntityBoostStrip from "@/components/EntityBoostStrip";

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

export default function Schedule() {
  // Use expandedId logic from ScheduleSection
  const [expandedId, setExpandedId] = useState<string | null>(upcomingEvents[0]?.id || null);
  const [activeMonth, setActiveMonth] = useState<string>("ALL");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Group events by month for the filter
  const months = ["ALL", ...Array.from(new Set(upcomingEvents.map(e => {
    return e.date.split(" ")[0].toUpperCase();
  })))];

  const filteredEvents = activeMonth === "ALL"
    ? upcomingEvents
    : upcomingEvents.filter(e => e.date.toUpperCase().startsWith(activeMonth));

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title="Chicago Event Schedule | Chasing Sun(Sets) + Monolith Project"
        description="Official schedule for Chasing Sun(Sets) and The Monolith Project in Chicago with event dates, venues, lineup details, and ticket links."
        canonicalPath="/schedule"
      />
      <JsonLd data={buildScheduleSchema(upcomingEvents)} />
      <Navigation />

      {/* Background Atmosphere */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1c1214] via-[#0d0f1a] to-[#1a1118] z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(224,90,58,0.25),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.2),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(232,184,109,0.08),transparent_100%)] z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-noise opacity-[0.08] mix-blend-overlay z-0 pointer-events-none" />

      <main className="relative pt-32 pb-20 z-10">
        <div className="container mx-auto px-4 md:px-8 max-w-[95%]">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
            <div>
              <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-tight-display text-foreground uppercase">
                Schedule
              </h1>
              <p className="font-mono text-sm tracking-[0.15em] text-muted-foreground mt-6 uppercase max-w-md leading-relaxed ml-2">
                A curated season of sound, ritual, and connection.
              </p>
            </div>

            {/* Month Filters */}
            <div className="flex flex-wrap gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-full pb-1">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => setActiveMonth(month)}
                  className={`relative px-5 py-2.5 rounded-full text-[10px] md:text-xs font-[800] tracking-[0.15em] uppercase transition-all duration-300 ${activeMonth === month
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {activeMonth === month && (
                    <motion.div
                      layoutId="schedule-active-tab"
                      className="absolute inset-0 bg-primary/90 rounded-full"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{month}</span>
                </button>
              ))}
            </div>
          </div>
          <EntityBoostStrip tone="light" className="mb-12 px-0" contextLabel="Schedule + Brand Navigation" />

          {/* List Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
            <div className="col-span-2">Date / Time</div>
            <div className="col-span-1"></div> {/* Thumbnail space */}
            <div className="col-span-4">Event</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Event List */}
          <div className="flex flex-col mb-20 rounded-3xl overflow-hidden border border-white/10 bg-white/10 shadow-[0_30px_60px_rgba(224,90,58,0.1)] backdrop-blur-3xl">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 border-b border-border">
                <p className="font-mono text-muted-foreground uppercase tracking-widest">No events found for {activeMonth}</p>
              </div>
            ) : (
              filteredEvents.map((event, index) => {
                const isExpanded = expandedId === event.id;
                const [dateMonth, dateDay] = event.date.split(" ");
                const dayNumber = parseInt(dateDay) || "";

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className="group border-b border-border relative"
                  >
                    {/* Main Row */}
                    <div
                      className="w-full relative z-10 hover:bg-transparent/5 transition-colors duration-300 group px-6 md:px-12"
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(event.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggle(event.id);
                        }
                      }}
                    >
                      <div className="py-6 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:items-center w-full text-left">
                        {/* Date Col */}
                        <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-3 md:gap-0">
                          <span className="font-display text-xl md:text-3xl text-foreground whitespace-nowrap">{dayNumber ? `${dateMonth.substring(0, 3)} ${dayNumber}` : dateMonth}</span>
                          <span className="font-mono text-xs text-muted-foreground md:mt-1">{event.time.split("—")[0]}</span>
                        </div>

                        {/* Thumbnail Col */}
                        <div className="md:col-span-1 hidden md:flex justify-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${seriesAccent[event.series]} text-white`}>
                            {/* S-Tier Radar Pulse Indicator */}
                            <div className="relative flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-current opacity-75" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-current" />
                            </div>
                          </div>
                        </div>

                        {/* Content Col */}
                        <div className="md:col-span-4 flex flex-col gap-1">
                          <h3 className="font-display text-3xl md:text-5xl uppercase leading-[0.9] text-foreground group-hover:text-primary transition-colors duration-300">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-border rounded-full ${seriesTextAccent[event.series]}`}>
                              {seriesLabels[event.series]}
                            </span>
                            {event.status === "on-sale" && (
                              <span className="text-[11px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 bg-primary text-white rounded-full shadow-[0_8px_16px_rgba(224,90,58,0.22)]">
                                ON SALE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Location Col */}
                        <div className="md:col-span-3 hidden md:flex flex-col">
                          <span className="font-bold text-lg leading-tight">{event.venue}</span>
                          <span className="text-xs text-muted-foreground font-mono mt-1">{event.location}</span>
                        </div>

                        {/* Action Col */}
                        <div className="md:col-span-2 flex justify-end items-center">
                          <div className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-foreground text-background rotate-90" : "group-hover:border-border group-hover:bg-foreground group-hover:text-background"}`}>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                          className="overflow-hidden bg-transparent/10"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-8 md:py-12 border-t border-white/5">
                            {/* Empty spacer for alignment */}
                            <div className="md:col-span-3 hidden md:block" />

                            {/* Content Area */}
                            <div className="md:col-span-9 pr-0 md:pr-12">
                              <p className="text-lg md:text-xl font-serif italic text-foreground/80 mb-8 max-w-2xl">
                                {event.description || event.experienceIntro || "Join us for a ritual of sound and connection."}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {/* Lineup Block */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur-md">
                                  <div className="flex items-center gap-2 mb-3 text-foreground/40">
                                    <Music className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Lineup</span>
                                  </div>
                                  <p className="font-display text-xl leading-snug">{event.lineup || "To Be Announced"}</p>
                                </div>

                                {/* Venue Block */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur-md">
                                  <div className="flex items-center gap-2 mb-3 text-foreground/40">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Venue</span>
                                  </div>
                                  <p className="font-display text-xl leading-snug">{event.venue}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                                </div>

                                {/* Details Block */}
                                <div className="p-6 bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur-md">
                                  <div className="flex items-center gap-2 mb-3 text-foreground/40">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Details</span>
                                  </div>
                                  <p className="font-bold text-sm">{event.time}</p>
                                  <p className="text-sm text-muted-foreground">{event.age} · {event.dress}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-4 items-center">
                                {event.ticketUrl ? (
                                  <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-coral text-white border-2 border-primary hover:bg-transparent hover:text-primary">
                                    Buy Tickets
                                    <ArrowRight className="w-4 h-4" />
                                  </a>
                                ) : (
                                  <button disabled className="btn-pill-dark opacity-50 cursor-not-allowed">
                                    Coming Soon
                                  </button>
                                )}
                                {event.tableReservationEmail && (
                                  <a href={`mailto:${event.tableReservationEmail}`} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary underline decoration-1 underline-offset-4">
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
              })
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border pt-8">
            <p className="text-muted-foreground text-sm font-mono tracking-wide">
              More dates to be announced specific to seasons.
            </p>
          </div>
        </div>
      </main>

      <SocialGrid />
    </div>
  );
}
