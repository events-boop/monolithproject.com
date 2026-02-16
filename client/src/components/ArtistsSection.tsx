import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, MapPin, Music, Sun } from "lucide-react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { POSH_TICKET_URL } from "@/data/events";
import EditorialHeader from "./EditorialHeader";

interface Artist {
  id: string;
  name: string;
  role: string;
  origin: string;
  genre: string;
  image: string;
}

const SUNSETS_ROSTER: Artist[] = [
  {
    id: "autograf",
    name: "AUTOGRAF",
    role: "LIVE SET",
    origin: "CHICAGO, US",
    genre: "FUTURE HOUSE",
    image: "/images/autograf-recap.jpg",
  },
  {
    id: "chus",
    name: "CHUS",
    role: "GUEST",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    image: "/images/artist-chus.webp",
  },
];

const UNTOLD_ROSTER: Artist[] = [
  {
    id: "haai",
    name: "HAAi",
    role: "HEADLINER",
    origin: "LONDON, UK",
    genre: "PSYCHEDELIC TECHNO",
    image: "/images/artist-haai.webp",
  },
  {
    id: "lazare",
    name: "LAZARE",
    role: "RESIDENT",
    origin: "PARIS, FR",
    genre: "MELODIC HOUSE",
    image: "/images/lazare-recap.webp",
  },
];

function ArtistCard({ artist, accentColor, delay }: { artist: Artist; accentColor: string; delay: number }) {
  return (
    <Link href={`/artists/${artist.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay }}
        className="ui-card group relative h-[300px] md:h-[360px] cursor-pointer overflow-hidden border border-white/20 hover:border-current"
        style={{ color: `var(--${accentColor})` }}
      >
        {/* Image */}
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className={`absolute inset-0 ${accentColor === "clay" ? "bg-[radial-gradient(circle_at_18%_18%,rgba(194,112,62,0.18),transparent_34%)]" : "bg-[radial-gradient(circle_at_82%_18%,rgba(224,90,58,0.2),transparent_34%)]"}`} />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_42%)]" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className={`ui-chip ${accentColor === "clay" ? "text-clay" : "text-primary"} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
              {artist.role}
            </span>
          </div>

          <div>
            <h3 className={`ui-heading font-display text-2xl md:text-3xl text-white mb-1 ${accentColor === "clay" ? "group-hover:text-clay" : "group-hover:text-primary"} transition-colors duration-300`}>
              {artist.name}
            </h3>
            <div className="flex gap-3 text-[9px] font-mono text-white/70 group-hover:text-white/90 transition-colors">
              <span className="flex items-center gap-1">
                <MapPin size={10} /> {artist.origin}
              </span>
              <span className="flex items-center gap-1">
                <Music size={10} /> {artist.genre}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function ArtistsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="artists"
      ref={ref}
      className="relative section-rhythm bg-background overflow-hidden"
    >
      <div className="absolute inset-0 atmo-surface opacity-70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(34,211,238,0.09),transparent_32%),radial-gradient(circle_at_88%_80%,rgba(224,90,58,0.12),transparent_36%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.22)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="container max-w-6xl mx-auto px-6">
        <EditorialHeader
          kicker="Lineup"
          title="The Roster"
          description="The artists who have played with us and who we're bringing to Chicago."
        />

        {/* Chasing Sun(Sets) */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sun className="w-4 h-4 text-clay" />
            <span className="font-display text-lg tracking-wide text-clay uppercase">
              Chasing Sun(Sets)
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUNSETS_ROSTER.map((artist, i) => (
              <ArtistCard key={artist.id} artist={artist} accentColor="clay" delay={0.1 * i} />
            ))}
          </div>
        </div>

        {/* Untold Story */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <UntoldButterflyLogo className="w-5 h-5 text-primary" />
            <span className="font-display text-lg tracking-wide text-primary uppercase">
              Untold Story
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {UNTOLD_ROSTER.map((artist, i) => (
              <ArtistCard key={artist.id} artist={artist} accentColor="primary" delay={0.1 * i} />
            ))}
          </div>
        </div>

          {/* CTAs — consumer + artist */}
        <div className="border-t border-border pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/lineup" asChild>
              <a className="btn-pill group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                <span>See Full Lineup</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </Link>
            <a href={POSH_TICKET_URL} target="_blank" rel="noopener noreferrer">
              <div className="btn-pill-coral group border-primary/60 shadow-[0_0_24px_rgba(224,90,58,0.2)]">
                <span>See Them Live</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          </div>
          <Link href="/booking" asChild>
            <a className="group flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
              <span className="font-mono tracking-widest uppercase text-xs">Artist? Send Us Your Mix</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
