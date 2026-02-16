import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { violet, cyan, deepBg, cardBg, eventVisuals, lineupVisuals, untoldFaqs } from "./constants";

export default function UntoldContent() {
  return (
    <section className="py-24 px-6 border-t" style={{ background: cardBg, borderColor: `${violet}15` }}>
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 pb-6" style={{ borderBottom: `1px solid ${violet}20` }}>
          <div>
            <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-2" style={{ color: cyan }}>
              Season III · Episode II
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white">JUANY BRAVO B2B DERON</h2>
          </div>
          <span className="font-mono text-xs tracking-widest" style={{ color: violet }}>THE JUANY X DERON SHOW</span>
        </div>

        {/* Featured event card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
          style={{ border: `1px solid ${violet}30`, background: deepBg }}
        >
          {/* Glow accent */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] opacity-10 blur-[100px] pointer-events-none" style={{ background: violet }} />

          <div className="relative p-8 md:p-12">
            <div className="mb-10 overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
              <img
                src={eventVisuals.poster}
                alt="Juany Bravo b2b Deron featured event artwork"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <div className="overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
                <img src={eventVisuals.deron} alt="Deron portrait artwork" className="w-full h-auto object-cover" />
              </div>
              <div className="overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
                <img src={eventVisuals.juany} alt="Juany Bravo portrait artwork" className="w-full h-auto object-cover" />
              </div>
            </div>

            <p className="text-white/80 text-lg leading-relaxed max-w-3xl mb-10">
              A late-night journey through Afro and melodic house led by two of Chicago's finest selectors in an immersive 360° dancefloor experience.
            </p>

            {/* Event details grid */}
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-4" style={{ color: cyan }}>
              Event Details
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10" style={{ borderBottom: `1px solid ${violet}15` }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Date</span>
                </div>
                <p className="text-white text-sm font-medium">Friday, March 6, 2026</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Doors</span>
                </div>
                <p className="text-white text-sm font-medium">7:00 PM</p>
                <p className="text-white/40 text-xs">Main Experience: 9:00 PM - 2:00 AM</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Venue</span>
                </div>
                <p className="text-white text-sm font-medium">Alhambra Palace</p>
                <p className="text-white/40 text-xs">West Loop, Chicago</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2" style={{ color: `${violet}99` }}>
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] tracking-widest uppercase">Age</span>
                </div>
                <p className="text-white text-sm font-medium">21+ (Valid ID Required)</p>
              </div>
            </div>

            {/* The Experience */}
            <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
              The Vision
            </span>
            <p className="text-white/70 text-base leading-relaxed mb-6">
              Untold Story is for the energy givers — the storytellers.
              A 360° experience where the DJ becomes the narrator, and sound becomes the language. Every set is a chapter, every transition a moment, every drop a feeling shared between the booth and the dancefloor.
            </p>
            <p className="text-white/70 text-base leading-relaxed mb-6">
              This project was built as a gathering place — a space where people meet through movement, connection, and shared intention.
              Rooted in the ethos of The Monolith Project, Untold Story celebrates the deeper meaning behind DJing: the art of guiding a room, shaping emotion, and telling a story through sound.
            </p>
            <p className="text-white/90 text-lg font-display tracking-wide mb-8">
              Togetherness is the frequency. Music is the guide.
            </p>

            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                Core Elements
              </span>
              <div className="flex flex-wrap gap-3">
                {[
                  "Boiler Room-Style 360° Setup",
                  "Immersive Storytelling",
                  "Emerging Talent Showcase",
                  "Audio/Visual Documentation",
                  "Community Connection",
                ].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 text-xs font-mono tracking-widest uppercase text-white/80"
                    style={{ border: `1px solid ${violet}25`, background: `${violet}08` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Lineup */}
            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                Lineup
              </span>
              <p className="text-white text-lg font-display tracking-wide mb-2">
                JUANY BRAVO B2B DERON (Headliner)
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/60 text-sm">
                <span>Hashtom</span>
                <span className="text-white/20">·</span>
                <span>Rose</span>
                <span className="text-white/20">·</span>
                <span>Jerome</span>
                <span className="text-white/20">·</span>
                <span>b2b Kenbo</span>
                <span className="text-white/20">·</span>
                <span>Avo</span>
              </div>
              <p className="text-white/40 text-xs mt-2">Additional guests may be announced</p>
            </div>

            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                Artist Visuals
              </span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {lineupVisuals.map((artist) => (
                  <div key={artist.name} className="overflow-hidden rounded-xl border" style={{ borderColor: `${violet}25` }}>
                    <img src={artist.image} alt={`${artist.name} lineup image`} className="w-full aspect-[4/5] object-cover" />
                    <div className="px-3 py-2 bg-black/35">
                      <p className="text-white font-semibold text-sm">{artist.name}</p>
                      <p className="text-white/60 text-xs">{artist.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tables */}
            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
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

            {/* FAQ */}
            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                Frequently Asked Questions
              </span>
              <div className="space-y-3">
                {untoldFaqs.map(([q, a]) => (
                  <details key={q} className="border px-4 py-3" style={{ borderColor: `${violet}25` }}>
                    <summary className="cursor-pointer text-white font-medium">{q}</summary>
                    <p className="text-white/70 mt-2 text-sm">{a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="mb-10">
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
                Photo & Video Notice
              </span>
              <p className="text-white/70 text-sm">
                This event will be photographed and recorded for The Monolith Project, House of Friends, and partner marketing channels. By entering the venue, you consent to possible use of your likeness in event media.
              </p>
            </div>

            {/* Contact / Socials */}
            <div className="mt-10 pt-8" style={{ borderTop: `1px solid ${violet}15` }}>
              <span className="font-mono text-[10px] tracking-widest uppercase block mb-3" style={{ color: cyan }}>
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
