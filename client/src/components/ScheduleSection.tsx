import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Clock, Shirt, Music, MapPin } from "lucide-react";
import { Link } from "wouter";
import { upcomingEvents } from "../data/events";
import { trackTicketIntent } from "@/lib/api";
import EditorialHeader from "./EditorialHeader";

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
  const reduceMotion = useReducedMotion();

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="schedule" className="relative section-rhythm bg-paper text-charcoal overflow-hidden">
      <div className="absolute inset-0 atmo-surface-soft opacity-95 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_84%_22%,rgba(224,90,58,0.18),transparent_36%),radial-gradient(circle_at_50%_78%,rgba(139,92,246,0.12),transparent_42%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0.08)_42%,rgba(255,255,255,0.22)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.2),transparent_28%,transparent_72%,rgba(255,255,255,0.14))] pointer-events-none" />
      <div className="container max-w-5xl mx-auto px-5 md:px-6">

        <EditorialHeader
          kicker="Program"
          title="Schedule"
          rightMeta="Season 01 · 2026"
          dark
        />

        {/* Event rows */}
        <div className="border-t border-charcoal/25 rounded-2xl overflow-hidden shadow-[0_18px_46px_rgba(0,0,0,0.11)] bg-[linear-gradient(155deg,rgba(255,255,255,0.33),rgba(255,255,255,0.14))] backdrop-blur-[2px]">
          {upcomingEvents.map((event, index) => {
            const isExpanded = expandedId === event.id;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: reduceMotion ? 0 : index * 0.04, duration: 0.2 }}
                className={`border-b border-charcoal/20 transition-colors duration-300 ${isExpanded
                  ? "bg-[linear-gradient(120deg,rgba(255,255,255,0.5),rgba(255,255,255,0.16))]"
                  : "hover:bg-[linear-gradient(120deg,rgba(255,255,255,0.38),rgba(255,255,255,0.1))]"
                  }`}
              >
                {/* Main row — click to expand */}
                <button
                  type="button"
                  onClick={() => toggle(event.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`schedule-details-${event.id}`}
                  className="group py-6 md:py-8 px-4 md:px-5 cursor-pointer w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">

                    {/* Episode + Series + Status */}
                    <div className="flex items-center gap-3 md:w-52 shrink-0">
                      <div className={`w-2 h-2 rounded-full ${seriesAccent[event.series]} ${event.status === "on-sale" ? "animate-pulse" : ""}`} />
                      <div className="flex flex-col">
                        <span className={`font-display text-lg leading-none ${seriesTextAccent[event.series]} tracking-wide`}>
                          {event.episode}
                        </span>
                        <span className="font-display text-base leading-none text-charcoal tracking-wide uppercase">
                          {seriesLabels[event.series]}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <span className={`font-display transition-all duration-300 shrink-0 group-hover:text-charcoal ${isExpanded
                      ? "text-3xl md:text-4xl text-primary md:w-62"
                      : "text-xl md:text-2xl text-primary md:w-54"
                      }`}>
                      {event.date}
                    </span>

                    {/* Title */}
                    <span className={`font-display transition-all duration-300 group-hover:text-primary ${isExpanded
                      ? "text-3xl md:text-4xl text-charcoal flex-1"
                      : "text-xl md:text-2xl text-charcoal/95 flex-1"
                      }`}>
                      {event.title}
                    </span>

                    {/* Status badge + Venue + Inline CTA */}
                    <div className="flex items-center gap-3 shrink-0">
                      {event.status === "on-sale" && event.ticketUrl ? (
                        <a
                          href={event.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="group/ticket inline-flex items-center gap-2 px-4 py-1.5 border border-primary/70 rounded-full bg-primary text-white text-[10px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(224,90,58,0.48)] hover:bg-primary/90 transition-all"
                        >
                          <span className="relative flex h-2 w-2 mr-0.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-85"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-200"></span>
                          </span>
                          TICKETS
                          <ArrowRight className="w-3 h-3 transition-transform group-hover/ticket:translate-x-0.5" />
                        </a>
                      ) : event.status === "on-sale" ? (
                        <span className="px-3 py-0.5 text-[10px] font-bold tracking-widest uppercase border border-primary/40 rounded-full text-primary">
                          ON SALE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase border border-border text-charcoal/60">
                          COMING SOON
                        </span>
                      )}
                      <span className="hidden md:inline font-mono text-xs text-charcoal/60 tracking-wide md:text-right md:w-44">
                        {event.venue} — {event.location}
                      </span>
                    </div>

                    {/* Expand arrow */}
                    <div className="hidden md:block ml-6 shrink-0">
                      <ChevronDown className={`w-5 h-5 text-charcoal/55 group-hover:text-primary transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`schedule-details-${event.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-2 px-4 md:px-5 md:pr-6 md:pl-40">
                        {/* Description */}
                        {event.description && (
                          <p className="text-charcoal text-base font-medium leading-relaxed mb-8 max-w-3xl rounded-xl border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(255,255,255,0.52))] backdrop-blur-sm px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.1)]">
                            {event.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                          <div className="space-y-1 rounded-xl border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(255,255,255,0.48))] backdrop-blur-sm p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center gap-2 text-charcoal/60">
                              <Clock className="w-3 h-3" />
                              <span className="ui-chip">Time</span>
                            </div>
                            <p className="text-charcoal text-base font-bold">{event.time}</p>
                            {event.doors && (
                              <p className="text-charcoal/65 text-xs">Doors: {event.doors}</p>
                            )}
                            {event.mainExperience && (
                              <p className="text-charcoal/65 text-xs">Main Experience: {event.mainExperience}</p>
                            )}
                          </div>

                          <div className="space-y-1 rounded-xl border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(255,255,255,0.48))] backdrop-blur-sm p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                            <div className="flex items-center gap-2 text-charcoal/60">
                              <MapPin className="w-3 h-3" />
                              <span className="ui-chip">Venue</span>
                            </div>
                            <p className="text-charcoal text-base font-bold">{event.venue}</p>
                            <p className="text-charcoal/65 text-xs">{event.location}</p>
                          </div>

                          {event.format && (
                            <div className="space-y-1 rounded-xl border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(255,255,255,0.48))] backdrop-blur-sm p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                              <div className="flex items-center gap-2 text-charcoal/60">
                                <Music className="w-3 h-3" />
                                <span className="ui-chip">Format</span>
                              </div>
                              <p className="text-charcoal text-base font-bold">{event.format}</p>
                            </div>
                          )}

                          {event.dress && (
                            <div className="space-y-1 rounded-xl border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(255,255,255,0.48))] backdrop-blur-sm p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
                              <div className="flex items-center gap-2 text-charcoal/60">
                                <Shirt className="w-3 h-3" />
                                <span className="ui-chip">Dress Code</span>
                              </div>
                              <p className="text-charcoal text-base font-bold">{event.dress}</p>
                            </div>
                          )}
                        </div>

                        {event.sound && (
                          <div className="mb-8">
                            <span className="ui-chip text-charcoal/60 block mb-2">
                              Sound
                            </span>
                            <p className="text-charcoal text-base font-bold">{event.sound}</p>
                          </div>
                        )}

                        {event.lineup && (
                          <div className="mb-8">
                            <span className="ui-chip text-charcoal/60 block mb-2">
                              Lineup
                            </span>
                            <p className="text-charcoal text-base font-bold">{event.lineup}</p>
                          </div>
                        )}

                        {event.experienceIntro && (
                          <div className="mb-8">
                            <span className="ui-chip text-charcoal/60 block mb-2">
                              The Experience
                            </span>
                            <p className="text-charcoal text-sm leading-relaxed">{event.experienceIntro}</p>
                          </div>
                        )}

                        {event.whatToExpect && event.whatToExpect.length > 0 && (
                          <div className="mb-8">
                            <span className="ui-chip text-charcoal/60 block mb-2">
                              What to Expect
                            </span>
                            <ul className="space-y-2">
                              {event.whatToExpect.map((item) => (
                                <li key={item} className="text-charcoal text-sm leading-relaxed">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {event.tablePackages && event.tablePackages.length > 0 && (
                          <div className="mb-8">
                            <span className="ui-chip text-charcoal/60 block mb-2">
                              Tables & Bottle Service
                            </span>
                            <ul className="space-y-2">
                              {event.tablePackages.map((item) => (
                                <li key={item} className="text-charcoal text-sm leading-relaxed">• {item}</li>
                              ))}
                            </ul>
                            {event.tableReservationEmail && (
                              <p className="text-sm mt-2">
                                Reservations:{" "}
                                <a href={`mailto:${event.tableReservationEmail}`} className="text-primary underline">
                                  {event.tableReservationEmail}
                                </a>
                              </p>
                            )}
                          </div>
                        )}

                        {event.faqs && event.faqs.length > 0 && (
                          <div className="mb-8">
                            <span className="ui-chip text-charcoal/60 block mb-2">
                              FAQ
                            </span>
                            <div className="space-y-2">
                              {event.faqs.map((faq) => (
                                <details key={faq.q} className="border border-charcoal/20 px-3 py-2 rounded-lg bg-white/45">
                                  <summary className="cursor-pointer text-sm font-semibold">{faq.q}</summary>
                                  <p className="text-sm text-charcoal/85 mt-2 leading-relaxed">{faq.a}</p>
                                </details>
                              ))}
                            </div>
                          </div>
                        )}

                        {event.photoNotice && (
                          <div className="mb-8">
                            <span className="ui-chip text-charcoal/60 block mb-2">
                              Photo & Video Notice
                            </span>
                            <p className="text-charcoal text-sm leading-relaxed">{event.photoNotice}</p>
                          </div>
                        )}

                        {event.eventNotice && (
                          <p className="text-xs font-mono tracking-wide text-charcoal/60 mb-8">
                            {event.eventNotice}
                          </p>
                        )}

                        <div className="flex items-center gap-4">
                          {event.ticketUrl ? (
                            <a
                              href={event.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-pill-coral group/btn"
                              onClick={() => {
                                void trackTicketIntent("schedule_section", event.id);
                              }}
                            >
                              Get Tickets
                              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                          ) : (
                            <Link href="/tickets">
                              <a className="btn-pill group/btn">
                                {event.status === "on-sale" ? "Get Tickets" : "Notify Me"}
                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                              </a>
                            </Link>
                          )}
                          {event.age && (
                            <span className="ui-chip text-charcoal/60">{event.age} · VALID ID REQUIRED</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note — links to newsletter */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-charcoal/60 text-sm font-mono tracking-wide">
            More dates to be announced.
          </p>
          <a
            href="#newsletter"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:text-foreground transition-colors"
          >
            Get Early Access
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
