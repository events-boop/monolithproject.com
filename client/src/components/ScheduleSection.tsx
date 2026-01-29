/*
  DESIGN: Cosmic Mysticism - Season 2026 Schedule
  - Timeline-style event listing
  - Upcoming gatherings with dates, venues, and series info
  - Nepenthe-inspired episode naming
*/

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

import { upcomingEvents, ScheduledEvent } from "../data/events";

const seriesColors = {
  "chasing-sunsets": "text-amber-400 border-amber-400/30 bg-amber-400/10",
  "untold-story": "text-purple-400 border-purple-400/30 bg-purple-400/10"
};

const seriesLabels = {
  "chasing-sunsets": "CHASING SUN(SETS)",
  "untold-story": "UNTOLD STORY"
};

const statusStyles = {
  "on-sale": "bg-green-500/20 text-green-400 border-green-500/30",
  "coming-soon": "bg-primary/20 text-primary border-primary/30",
  "sold-out": "bg-red-500/20 text-red-400 border-red-500/30"
};

const statusLabels = {
  "on-sale": "ON SALE",
  "coming-soon": "COMING SOON",
  "sold-out": "SOLD OUT"
};

export default function ScheduleSection() {
  return (
    <section id="schedule" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-sm tracking-ultra-wide text-muted-foreground uppercase">
              The Journey Ahead
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            SEASON 2026
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Mark your calendar. Each gathering is a chapter in our collective story.
          </p>
        </motion.div>

        {/* Events Timeline */}
        <div className="max-w-3xl mx-auto space-y-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Timeline connector */}
              {index < upcomingEvents.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-px bg-border -mb-6 hidden md:block" />
              )}

              <div className="flex gap-6">
                {/* Timeline dot */}
                <div className="hidden md:flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${seriesColors[event.series]}`}>
                    <span className="text-xs font-bold">{event.episode.split('E')[1]}</span>
                  </div>
                </div>

                {/* Event Card */}
                <div className="flex-1 bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    {/* Series Badge */}
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-medium tracking-wider rounded-full border ${seriesColors[event.series]}`}>
                        {seriesLabels[event.series]}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {event.episode}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 text-xs font-medium tracking-wider rounded-full border ${statusStyles[event.status]}`}>
                      {statusLabels[event.status]}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h3 className="font-display text-2xl md:text-3xl text-foreground mb-4">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.venue} • {event.location}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  {event.status === "on-sale" ? (
                    <Link href="/tickets">
                      <a className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors">
                        <span>Get Tickets</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </Link>
                  ) : (
                    <button
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted-foreground rounded-full text-sm font-medium tracking-wide hover:border-primary/50 hover:text-foreground transition-colors"
                      onClick={() => {
                        const newsletter = document.getElementById("newsletter");
                        if (newsletter) newsletter.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <span>Notify Me</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* More Events Coming */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-sm tracking-wider">
            More chapters to be announced. Join the frequency to stay updated.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
