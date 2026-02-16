import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Music, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SocialGrid from "@/components/SocialGrid";
import { upcomingEvents } from "@/data/events";
import SEO from "@/components/SEO";

const seriesAccent: Record<string, string> = {
  "chasing-sunsets": "bg-clay",
  "untold-story": "bg-primary",
  "monolith-project": "bg-white",
};

const seriesTextAccent: Record<string, string> = {
  "chasing-sunsets": "text-clay",
  "untold-story": "text-primary",
  "monolith-project": "text-charcoal",
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
    <div className="min-h-screen bg-paper text-charcoal relative overflow-hidden">
      <SEO
        title="Schedule"
        description="A curated season of sound, ritual, and connection from The Monolith Project."
      />
      <Navigation variant="light" />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 atmo-surface-soft opacity-50 pointer-events-none fixed" />

      <main className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-[95%]">

          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
            <div>
              <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-tight-display text-charcoal uppercase">
                Schedule
              </h1>
              <p className="font-mono text-sm tracking-[0.15em] text-charcoal/60 mt-6 uppercase max-w-md leading-relaxed ml-2">
                A curated season of sound, ritual, and connection.
              </p>
            </div>

            {/* Month Filters */}
            <div className="flex flex-wrap gap-2 md:gap-4 pb-2">
              {months.map(month => (
                <button
                  key={month}
                  onClick={() => setActiveMonth(month)}
                  className={`px-4 py-2 border rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${activeMonth === month
                    ? "bg-charcoal text-white border-charcoal"
                    : "border-charcoal/20 text-charcoal/60 hover:border-charcoal hover:text-charcoal"
                    }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {/* List Header (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-charcoal text-[10px] uppercase tracking-widest font-mono text-charcoal/50">
            <div className="col-span-2">Date / Time</div>
            <div className="col-span-1"></div> {/* Thumbnail space */}
            <div className="col-span-4">Event</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Event List */}
          <div className="flex flex-col mb-20">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 border-b border-charcoal">
                <p className="font-mono text-charcoal/50 uppercase tracking-widest">No events found for {activeMonth}</p>
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
                    className="group border-b border-charcoal relative"
                  >
                    {/* Main Row */}
                    <div
                      className="w-full relative z-10 hover:bg-charcoal/5 transition-colors duration-300 group"
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
                          <span className="font-display text-xl md:text-3xl text-charcoal">{dayNumber ? `${dateMonth.substring(0, 3)} ${dayNumber}` : dateMonth}</span>
                          <span className="font-mono text-xs text-charcoal/60 md:mt-1">{event.time.split("—")[0]}</span>
                        </div>

                        {/* Thumbnail Col */}
                        <div className="md:col-span-1 hidden md:flex justify-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${seriesAccent[event.series]} text-white`}>
                            {/* Simple Icon based on series */}
                            <div className="w-3 h-3 bg-current rounded-full animate-pulse" />
                          </div>
                        </div>

                        {/* Content Col */}
                        <div className="md:col-span-4 flex flex-col gap-1">
                          <h3 className="font-display text-3xl md:text-5xl uppercase leading-[0.9] text-charcoal group-hover:text-primary transition-colors duration-300">
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 border border-charcoal/10 rounded-full ${seriesTextAccent[event.series]}`}>
                              {seriesLabels[event.series]}
                            </span>
                            {event.status === "on-sale" && (
                              <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-primary text-white rounded-full">
                                ON SALE
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Location Col */}
                        <div className="md:col-span-3 hidden md:flex flex-col">
                          <span className="font-bold text-lg leading-tight">{event.venue}</span>
                          <span className="text-xs text-charcoal/60 font-mono mt-1">{event.location}</span>
                        </div>

                        {/* Action Col */}
                        <div className="md:col-span-2 flex justify-end items-center">
                          <div className={`w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-charcoal text-white rotate-90" : "group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-white"}`}>
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
                          className="overflow-hidden bg-charcoal/5"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4 md:px-0 py-8 md:py-12 border-t border-charcoal/10">
                            {/* Empty spacer for alignment */}
                            <div className="md:col-span-3 hidden md:block" />

                            {/* Content Area */}
                            <div className="md:col-span-9 pr-0 md:pr-12">
                              <p className="text-lg md:text-xl font-serif italic text-charcoal/80 mb-8 max-w-2xl">
                                {event.description || event.experienceIntro || "Join us for a ritual of sound and connection."}
                              </p>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {/* Lineup Block */}
                                <div className="p-6 bg-white border border-charcoal/5 rounded-none shadow-sm">
                                  <div className="flex items-center gap-2 mb-3 text-charcoal/40">
                                    <Music className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Lineup</span>
                                  </div>
                                  <p className="font-display text-xl leading-snug">{event.lineup || "To Be Announced"}</p>
                                </div>

                                {/* Venue Block */}
                                <div className="p-6 bg-white border border-charcoal/5 rounded-none shadow-sm">
                                  <div className="flex items-center gap-2 mb-3 text-charcoal/40">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Venue</span>
                                  </div>
                                  <p className="font-display text-xl leading-snug">{event.venue}</p>
                                  <p className="text-sm text-charcoal/60 mt-1">{event.location}</p>
                                </div>

                                {/* Details Block */}
                                <div className="p-6 bg-white border border-charcoal/5 rounded-none shadow-sm">
                                  <div className="flex items-center gap-2 mb-3 text-charcoal/40">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Details</span>
                                  </div>
                                  <p className="font-bold text-sm">{event.time}</p>
                                  <p className="text-sm text-charcoal/60">{event.age} · {event.dress}</p>
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
                                  <a href={`mailto:${event.tableReservationEmail}`} className="text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-primary underline decoration-1 underline-offset-4">
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

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-charcoal/10 pt-8">
            <p className="text-charcoal/60 text-sm font-mono tracking-wide">
              More dates to be announced specific to seasons.
            </p>
          </div>

        </div>
      </main>

      <SocialGrid />
      <Footer />
    </div>
  );
}
