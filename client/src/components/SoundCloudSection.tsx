/*
  DESIGN: Cosmic Mysticism - SoundCloud Mixes Grid
  - Embedded SoundCloud players
  - 2x3 or 3x2 grid layout
  - Dark theme integration
*/

import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  trackUrl: string;
}

const tracks: Track[] = [
  {
    title: "Spécial NYE by BENCHEK",
    artist: "BENCHEK",
    trackUrl: "chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek"
  },
  {
    title: "TERRANOVA x CHASING SUN(SETS)",
    artist: "TERRANOVA",
    trackUrl: "chasing-sun-sets/terranova"
  },
  {
    title: "Chasing Sun(Sets) Mix Vol.3",
    artist: "EWERSEEN",
    trackUrl: "chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3"
  },
  {
    title: "RADIAN X UNTOLD STORY",
    artist: "RADIAN",
    trackUrl: "chasing-sun-sets/radianofc-set"
  },
  {
    title: "Collab Mix Vol.2",
    artist: "EWERSEEN",
    trackUrl: "chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2"
  },
  {
    title: "Live from Marbella EP02",
    artist: "BENCHEK",
    trackUrl: "chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella"
  }
];

function getSoundCloudEmbedUrl(trackUrl: string): string {
  return `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${trackUrl}&color=%23d4a853&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
}

export default function SoundCloudSection() {
  return (
    <section id="listen" className="relative py-24 md:py-32">
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
            <Headphones className="w-6 h-6 text-primary" />
            <span className="text-sm tracking-ultra-wide text-muted-foreground uppercase">
              Transmissions
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            LISTEN
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Curated mixes from our resident artists and guest selectors. 
            Global house, sunset energy, and intentional soundscapes.
          </p>
        </motion.div>

        {/* SoundCloud Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, index) => (
            <motion.div
              key={track.trackUrl}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* SoundCloud Embed */}
              <div className="aspect-square rounded-lg overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-colors">
                <iframe
                  width="100%"
                  height="100%"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={getSoundCloudEmbedUrl(track.trackUrl)}
                  title={track.title}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://soundcloud.com/chasing-sun-sets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="tracking-wide">View all on SoundCloud</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
