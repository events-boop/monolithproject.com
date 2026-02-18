
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowRight, Clock, Music, MapPin } from "lucide-react";
import { Link } from "wouter";
import { upcomingEvents } from "../data/events";
import FloatingImage from "./FloatingImage";

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

export default function ScheduleSection() {
  const [expandedId, setExpandedId] = useState<string | null>(upcomingEvents[0]?.id || null);
  const [activeMonth, setActiveMonth] = useState<string>("ALL");
  const [hoveredEvent, setHoveredEvent] = useState<{ image: string; title: string } | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Only track mouse when an event row is hovered (was: global listener always firing)
  useEffect(() => {
    if (!hoveredEvent) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredEvent, mouseX, mouseY]);

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
    <section id="schedule" className="relative section-rhythm bg-paper text-charcoal overflow-hidden min-h-screen">
      <div className="absolute inset-0 atmo-surface-soft opacity-50 pointer-events-none" />

      {/* Floating Image Reveal */}
      <FloatingImage
        src={hoveredEvent?.image || "/images/hero-monolith.jpg"}
        alt={hoveredEvent?.title || "Event Image"}
        isVisible={!!hoveredEvent?.image}
        mouseX={mouseX}
        mouseY={mouseY}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-[95%] relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
          <h2 className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-tight-display text-charcoal uppercase">
            Schedule
          </h2>

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
        <div className="flex flex-col">
          {filteredEvents.map((event, index) => {
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
                onMouseEnter={() => event.image && setHoveredEvent({ image: event.image, title: event.title })}
                onMouseLeave={() => setHoveredEvent(null)}
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
                          <motion.span
                            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 bg-primary text-white rounded-full inline-flex items-center gap-1"
                            animate={{ scale: [1, 1.06, 1], opacity: [1, 0.85, 1] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                            ON SALE
                          </motion.span>
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

                {/* Expanded Details - Keeping existing rich content structure but styled for this new layout */}
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
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-charcoal/60 text-sm font-mono tracking-wide">
            More dates to be announced.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/schedule" asChild>
              <a className="btn-pill-dark">
                View Full Schedule
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </a>
            </Link>
            <Link href="/newsletter" asChild>
              <a className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:text-foreground transition-colors">
                Get Early Access
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </a>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
