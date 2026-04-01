import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { eventVisuals, lineupVisuals, untoldFaqs } from "./constants";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SmartImage from "@/components/SmartImage";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { ScheduledEvent } from "@/data/events";

const untoldPosterImage = getResponsiveImage("untoldStoryPoster");

export default function UntoldContent({ event }: { event?: ScheduledEvent }) {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <section id="untold-event" className="scroll-shell-target py-24 px-6 border-t bg-untold-card-solid border-untold-violet-15">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 pb-6 border-b border-untold-violet-20">
          <div>
            <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-2 text-untold-cyan">
              {event?.subtitle || "Season III"}
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white">{event?.headline || event?.title || "UNTOLD STORY"}</h2>
          </div>
          <span className="font-mono text-xs tracking-widest text-untold-violet">{event?.episode || "Chapter"}</span>
        </div>

        {/* Featured event card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden border border-untold-violet-30 bg-untold-deep-solid"
        >
          {/* Glow accent */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-10 blur-[100px] pointer-events-none bg-[#8B5CF6]" />

          <div className="relative p-8 md:p-12">
            <div className="mb-10 overflow-hidden rounded-xl border border-untold-violet-25">
              <SmartImage
                src={untoldPosterImage.src}
                alt={`${event?.title} featured event artwork`}
                sources={untoldPosterImage.sources}
                sizes={untoldPosterImage.sizes}
                containerClassName="bg-transparent"
                className="w-full h-auto object-cover"
              />
            </div>

            <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-10">
              {event?.description || "A late-night journey through Afro and melodic house led by Chicago's finest selectors in an immersive 360° dancefloor experience."}
            </p>

            {/* Event details grid */}
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-4 text-untold-cyan">
              Event Details
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-untold-violet-15">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-untold-violet-99">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Date</span>
                </div>
                <p className="text-white text-sm font-medium">{event?.date || "TBD"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-untold-violet-99">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Doors</span>
                </div>
                <p className="text-white text-sm font-medium">{event?.doors || (event?.time ? event.time.split("—")[0].trim() : "9:00 PM")}</p>
                {event?.mainExperience && (
                    <p className="text-white/40 text-xs">Main Experience: {event.mainExperience}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-untold-violet-99">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Venue</span>
                </div>
                <p className="text-white text-sm font-medium">{event?.venue || "Venue Reveal Soon"}</p>
                <p className="text-white/40 text-xs">{event?.location || "Chicago, IL"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-untold-violet-99">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Age</span>
                </div>
                <p className="text-white text-sm font-medium">{event?.age || "21+ (Valid ID Required)"}</p>
              </div>
            </div>

            {/* The Experience */}
            <span className="font-mono text-[10px] tracking-widest uppercase block mb-3 text-untold-cyan">
              The Vision
            </span>
            <p className="text-white/70 text-base leading-relaxed mb-6">
              {event?.experienceIntro || "Untold Story is for the energy givers — the storytellers. A 360° experience where the DJ becomes the narrator, and sound becomes the language. Every set is a chapter, every transition a moment, every drop a feeling shared between the booth and the dancefloor."}
            </p>
            {!event?.experienceIntro && (
              <p className="text-white/70 text-base leading-relaxed mb-6">
                This project was built as a gathering place — a space where people meet through movement, connection, and shared intention. Rooted in the ethos of The Monolith Project, Untold Story celebrates the deeper meaning behind DJing: the art of guiding a room, shaping emotion, and telling a story through sound.
              </p>
            )}
            <p className="text-white/90 text-lg font-display tracking-wide mb-8">
              Togetherness is the frequency. Music is the guide.
            </p>

            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3 text-untold-cyan">
                Core Elements
              </span>
              <div className="flex flex-wrap gap-3">
                {(event?.whatToExpect || [
                  "Boiler Room-Style 360° Setup",
                  "Immersive Storytelling",
                  "Emerging Talent Showcase",
                  "Audio/Visual Documentation",
                  "Community Connection",
                ]).map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 text-xs font-mono tracking-widest uppercase text-white/80 border border-untold-violet-25 bg-untold-violet-08"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Lineup */}
            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3 text-untold-cyan">
                Lineup
              </span>
              <p className="text-white text-lg font-display tracking-wide mb-2">
                {event?.lineup || "Lineup drops soon."}
              </p>
            </div>

            {/* Tables */}
            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3 text-untold-cyan">
                Tables & Bottle Service
              </span>
              <p className="text-white/70 mb-4">All tables include bottle service and priority treatment throughout the night.</p>
              <div className="space-y-3 text-white/80">
                <p>Standard Table (up to 5 guests): $300 — Includes 1 standard bottle</p>
                <p>Gold Table (up to 5 guests): $500 — Includes 1 premium bottle + elevated placement</p>
                <p>Platinum Table (up to 5 guests): $750 — Includes 1 premium bottle, closest DJ proximity, priority service</p>
                <p className="text-white/60">Additional Bottles: Standard: $150 | Premium: $200 | Top Shelf: $250</p>
                <p className="text-white/70">Table Reservations: <a className="underline" href="mailto:events@monolithproject.com">events@monolithproject.com</a></p>
              </div>
            </div>

            {/* FAQ Toggle */}
            <div className="mb-10">
              <button
                onClick={() => setFaqOpen(!faqOpen)}
                className="w-full flex items-center justify-between p-6 md:p-8 rounded-2xl bg-white text-[#0B0C10] hover:bg-gray-100 transition-all duration-300 font-display text-xl md:text-2xl uppercase tracking-wide group shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]"
              >
                <span>Frequently Asked Questions</span>
                <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <div className={`relative w-4 h-4 transition-transform duration-500 origin-center ${faqOpen ? "rotate-180" : "rotate-0"}`}>
                    <span className={`absolute top-1/2 left-0 w-4 h-[2px] bg-black -translate-y-1/2 transition-transform duration-500`} />
                    <span className={`absolute top-0 left-1/2 w-[2px] h-4 bg-black -translate-x-1/2 transition-transform duration-500 ${faqOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
                  </div>
                </span>
              </button>

              <AnimatePresence>
                {faqOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-4">
                      {untoldFaqs.map(([q, a], idx) => (
                        <motion.details
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + (idx * 0.05), duration: 0.4 }}
                          key={q}
                          className="border px-6 py-5 rounded-xl border-untold-violet-25 bg-black/20 backdrop-blur-sm group cursor-pointer"
                        >
                          <summary className="text-white font-medium list-none flex items-center justify-between outline-none">
                            <span className="pr-4">{q}</span>
                            <span className="text-untold-cyan group-open:rotate-45 transition-transform duration-300 flex-shrink-0">
                              <span className="block w-3 h-[2px] bg-current relative">
                                <span className="block w-[2px] h-3 bg-current absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-open:opacity-0 transition-opacity" />
                              </span>
                            </span>
                          </summary>
                          <p className="text-white/70 mt-4 text-sm leading-relaxed border-t border-white/10 pt-4">{a}</p>
                        </motion.details>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notice */}
            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3 text-untold-cyan">
                Photo & Video Notice
              </span>
              <p className="text-white/70 text-sm">
                This event will be photographed and recorded for The Monolith Project, House of Friends, and partner marketing channels. By entering the venue, you consent to possible use of your likeness in event media.
              </p>
            </div>

            {/* Contact / Socials */}
            <div className="mt-10 pt-8 border-t border-untold-violet-15">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3 text-untold-cyan">
                Connect
              </span>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <span className="text-white/40 uppercase tracking-wider text-[10px] w-20">Inquiries</span>
                  <a href="mailto:events@monolithproject.com" className="hover:text-white transition-colors border-b border-white/20 hover:border-white">
                    events@monolithproject.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <span className="text-white/40 uppercase tracking-wider text-[10px] w-20">Follow</span>
                  <a href="https://instagram.com/monolithproject.events" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors border-b border-white/20 hover:border-white">
                    @TheMonolithProject.events
                  </a>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-[10px] text-white/30 font-mono tracking-wider uppercase">
                <span>#UNTOLDSTORY</span>
                <span>#CHASINGSUNSETS</span>
                <span>#CHICAGO</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
