/*
  DESIGN: S-Tier Roster - Character Select Interface
  - Interactive "Player Cards"
  - Grayscale to Gold/Color transitions
  - Data-rich hover states (Tech-Noir)
*/

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Disc, Sparkles, MapPin, Music } from "lucide-react";
import MagneticButton from "./MagneticButton";

const ROSTER = [
  {
    id: "1",
    name: "HAAi",
    role: "HEADLINER",
    origin: "LONDON, UK",
    genre: "PSYCHEDELIC TECHNO",
    image: "bg-zinc-800", // Placeholder for actual image
    colSpan: "md:col-span-2"
  },
  {
    id: "5",
    name: "AUTOGRAF",
    role: "LIVE SET",
    origin: "CHICAGO, US",
    genre: "FUTURE HOUSE",
    image: "bg-neutral-900",
    colSpan: "md:col-span-1"
  },
  {
    id: "3",
    name: "LAZARE",
    role: "RESIDENT",
    origin: "PARIS, FR",
    genre: "MELODIC HOUSE",
    image: "bg-zinc-900",
    colSpan: "md:col-span-1"
  },
  {
    id: "4",
    name: "JOEZI",
    role: "GUEST",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    image: "bg-neutral-800",
    colSpan: "md:col-span-2"
  },
];

export default function ArtistsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="artists"
      ref={ref}
      className="relative py-32 bg-[#050505] overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4A574]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-6xl mx-auto relative z-10 px-6">
        {/* Header - Split Layout */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-[#D4A574]" />
              <span className="font-mono text-xs text-[#D4A574] tracking-[0.3em] uppercase">The Collective</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl text-white tracking-tight">
              SONIC<br />ARCHITECTS
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md text-right md:text-left"
          >
            <p className="text-white/60 font-serif italic text-lg leading-relaxed">
              "We curate sounds that bridge the gap between the ancient and the future. A roster of visionaries."
            </p>
          </motion.div>
        </div>

        {/* The Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-24">
          {ROSTER.map((artist, i) => (
            <Link key={artist.id} href={`/artists/${artist.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className={`group relative h-[400px] ${artist.colSpan} cursor-pointer overflow-hidden border border-white/10 bg-[#111] hover:border-[#D4A574]/50 transition-colors duration-500`}
              >
                {/* Background Image/Placeholder */}
                <div className={`absolute inset-0 ${artist.image} transition-all duration-700 group-hover:scale-105`}>
                  {/* Gradient Overlay - Defaults to heavy dark, lightens on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />

                  {/* Gold tint interaction */}
                  <div className="absolute inset-0 bg-[#D4A574] mix-blend-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                </div>

                {/* Content Layer */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top: Role Tag */}
                  <div className="flex justify-between items-start translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="font-mono text-[10px] border border-[#D4A574]/30 text-[#D4A574] px-2 py-1 rounded uppercase tracking-widest bg-black/50 backdrop-blur-md">
                      {artist.role}
                    </span>
                    <ArrowUpRight className="text-white w-6 h-6" />
                  </div>

                  {/* Bottom: Name & Data */}
                  <div>
                    <h3 className="font-display text-4xl md:text-5xl text-white mb-2 group-hover:text-[#D4A574] transition-colors duration-300">
                      {artist.name}
                    </h3>

                    {/* Tech Data Reveal */}
                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                      <div className="pt-4 border-t border-white/20 flex gap-6 text-xs font-mono text-white/70">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-[#D4A574]" />
                          {artist.origin}
                        </div>
                        <div className="flex items-center gap-2">
                          <Music size={12} className="text-[#D4A574]" />
                          {artist.genre}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Footer / Call to Action */}
        <div className="flex flex-col items-center justify-center pt-12 border-t border-white/10">
          <Sparkles className="w-8 h-8 text-[#D4A574] mb-6 animate-pulse-slow" />
          <h3 className="font-display text-2xl text-white mb-8 text-center">JOIN THE ROSTER</h3>

          <Link href="/connect">
            <MagneticButton strength={0.3} className="group relative">
              <div className="absolute inset-0 rounded-full bg-[#D4A574]/10 border border-[#D4A574]/30 shadow-[0_0_20px_rgba(212,165,116,0.1)] transition-all duration-300 group-hover:bg-[#D4A574] group-hover:border-[#D4A574] group-hover:shadow-[0_0_40px_rgba(212,165,116,0.4)]" />
              <div className="relative flex items-center gap-3 px-10 py-4 bg-transparent">
                <Disc className="w-4 h-4 text-[#D4A574] group-hover:text-black transition-colors" />
                <span className="font-bold tracking-widest uppercase text-xs text-[#D4A574] group-hover:text-black transition-colors">Submit Your Sound</span>
              </div>
            </MagneticButton>
          </Link>
        </div>

      </div>
    </section >
  );
}
