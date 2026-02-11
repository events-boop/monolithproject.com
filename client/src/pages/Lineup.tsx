import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { MapPin, Music, Sun, Headphones } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import RevealText from "@/components/RevealText";

type Series = "all" | "chasing-sunsets" | "untold-story" | "sunsets-radio";

interface Artist {
  id: string;
  name: string;
  role: string;
  origin: string;
  genre: string;
  image: string;
  series: "chasing-sunsets" | "untold-story" | "sunsets-radio";
}

interface ArtistEntry extends Omit<Artist, "series"> {
  series: ("chasing-sunsets" | "untold-story" | "sunsets-radio")[];
}

const artistEntries: ArtistEntry[] = [
  // Untold Story
  {
    id: "lazare",
    name: "LAZARE",
    role: "RESIDENT",
    origin: "PARIS, FR",
    genre: "MELODIC HOUSE",
    image: "/images/lazare-recap.png",
    series: ["untold-story"],
  },
  {
    id: "sabry",
    name: "SABRY",
    role: "RESIDENT",
    origin: "CHICAGO, US",
    genre: "DEEP HOUSE · TECHNO",
    image: "/images/untold-story.jpg",
    series: ["untold-story"],
  },
  {
    id: "autograf",
    name: "AUTOGRAF",
    role: "LIVE SET",
    origin: "CHICAGO, US",
    genre: "FUTURE HOUSE",
    image: "/images/autograf-recap.jpg",
    series: ["untold-story"],
  },
  {
    id: "deron",
    name: "DERON",
    role: "GUEST",
    origin: "GLOBAL",
    genre: "AFRO HOUSE · MELODIC",
    image: "/images/artist-joezi.png",
    series: ["untold-story"],
  },
  {
    id: "juany-bravo",
    name: "JUANY BRAVO",
    role: "GUEST",
    origin: "CHICAGO, US",
    genre: "AFRO HOUSE · GLOBAL HOUSE",
    image: "/images/untold-story.jpg",
    series: ["untold-story"],
  },
  {
    id: "haai",
    name: "HAAi",
    role: "HEADLINER",
    origin: "LONDON, UK",
    genre: "PSYCHEDELIC TECHNO",
    image: "/images/lazare-recap.png",
    series: ["untold-story"],
  },
  // Chasing Sun(Sets) — some also appear on Radio
  {
    id: "summers-uk",
    name: "SUMMERS UK",
    role: "GUEST",
    origin: "LONDON, UK",
    genre: "MELODIC HOUSE",
    image: "/images/chasing-sunsets.jpg",
    series: ["chasing-sunsets"],
  },
  {
    id: "chris-idh",
    name: "CHRIS IDH",
    role: "GUEST",
    origin: "PARIS, FR",
    genre: "ORGANIC HOUSE",
    image: "/images/artist-joezi.png",
    series: ["chasing-sunsets"],
  },
  {
    id: "benchek",
    name: "BENCHEK",
    role: "GUEST",
    origin: "BERLIN, DE",
    genre: "MELODIC TECHNO",
    image: "/images/chasing-sunsets.jpg",
    series: ["chasing-sunsets", "sunsets-radio"],
  },
  {
    id: "terranova",
    name: "TERRANOVA",
    role: "GUEST",
    origin: "BERLIN, DE",
    genre: "DEEP HOUSE · ELECTRONICA",
    image: "/images/autograf-recap.jpg",
    series: ["chasing-sunsets", "sunsets-radio"],
  },
  {
    id: "ewerseen",
    name: "EWERSEEN",
    role: "GUEST",
    origin: "AMSTERDAM, NL",
    genre: "AFRO HOUSE · ORGANIC",
    image: "/images/artist-joezi.png",
    series: ["chasing-sunsets", "sunsets-radio"],
  },
  {
    id: "joezi",
    name: "JOEZI",
    role: "GUEST",
    origin: "TEL AVIV, IL",
    genre: "AFRO HOUSE",
    image: "/images/artist-joezi.png",
    series: ["chasing-sunsets"],
  },
  // Radio-only
  {
    id: "radian",
    name: "RADIAN",
    role: "RADIO MIX",
    origin: "GLOBAL",
    genre: "MELODIC HOUSE · DEEP",
    image: "/images/radio-show.jpg",
    series: ["sunsets-radio"],
  },
];

// Flatten for display — each artist appears once, with primary series for badge color
const artists: Artist[] = artistEntries.map((a) => ({
  ...a,
  series: a.series[0],
}));

// Filter: "all" shows each artist once; series filters show artists tagged with that series
function filterArtists(filter: Series): Artist[] {
  if (filter === "all") return artists;
  return artistEntries
    .filter((a) => a.series.includes(filter))
    .map((a) => ({ ...a, series: filter }));
}

const filters: { label: string; value: Series; icon?: React.ReactNode }[] = [
  { label: "ALL", value: "all" },
  { label: "CHASING SUN(SETS)", value: "chasing-sunsets", icon: <Sun className="w-3.5 h-3.5" /> },
  { label: "UNTOLD STORY", value: "untold-story", icon: <UntoldButterflyLogo className="w-4 h-4" /> },
  { label: "SUN(SETS) RADIO", value: "sunsets-radio", icon: <Headphones className="w-3.5 h-3.5" /> },
];

export default function Lineup() {
  const [activeFilter, setActiveFilter] = useState<Series>("all");

  const filtered = filterArtists(activeFilter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-12 px-6">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              Season 01 — 2026
            </span>
            <RevealText
              as="h1"
              className="font-display text-6xl md:text-8xl lg:text-9xl text-foreground mb-6"
            >
              LINEUP
            </RevealText>
            <p className="text-muted-foreground text-lg max-w-xl">
              The artists behind The Monolith Project. Two series, one community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-12 sticky top-10 z-40">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 py-4 border-b border-border">
            {filters.map((f) => {
              const isActive = activeFilter === f.value;
              const styleMap: Record<string, { border: string; bg?: React.CSSProperties }> = {
                "chasing-sunsets": { border: "text-white border-[#C2703E]", bg: { background: "linear-gradient(135deg, #C2703E, #E8B86D)" } },
                "untold-story": { border: "text-white border-[#8B5CF6]", bg: { background: "linear-gradient(135deg, #8B5CF6, #22D3EE)" } },
                "sunsets-radio": { border: "text-white border-[#D4A574]", bg: { background: "linear-gradient(135deg, #C2703E, #D4A574)" } },
              };
              const match = styleMap[f.value];
              const activeStyles = match?.border ?? "bg-primary text-primary-foreground border-primary";
              const activeBg = match?.bg;

              return (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 border rounded-full ${isActive
                      ? activeStyles
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                  style={isActive ? activeBg : undefined}
                >
                  {f.icon}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artist Grid */}
      <section className="px-6 pb-24">
        <div className="container max-w-6xl mx-auto">
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((artist) => (
                <motion.div
                  key={artist.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/artists/${artist.id}`}>
                    <div className="group relative aspect-[3/4] cursor-pointer overflow-hidden border border-border hover:border-primary/50 transition-colors duration-500">
                      {/* Image */}
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                        <img
                          src={artist.image}
                          alt={artist.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>

                      {/* Series badge */}
                      <div className="absolute top-3 left-3 z-10">
                        {artist.series === "chasing-sunsets" ? (
                          <Sun className="w-3.5 h-3.5 text-clay opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : artist.series === "sunsets-radio" ? (
                          <Headphones className="w-3.5 h-3.5 text-[#D4A574] opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <UntoldButterflyLogo className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-end">
                        <span className={`font-mono text-[9px] tracking-widest uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${artist.series === "untold-story" ? "text-primary" : "text-clay"
                          }`}>
                          {artist.role}
                        </span>
                        <h3 className={`font-display text-xl md:text-2xl text-white mb-1 transition-colors duration-300 ${artist.series === "untold-story" ? "group-hover:text-primary" : "group-hover:text-clay"
                          }`}>
                          {artist.name}
                        </h3>
                        <div className="flex gap-3 text-[9px] font-mono text-white/40 group-hover:text-white/70 transition-colors">
                          <span className="flex items-center gap-1">
                            <MapPin size={8} /> {artist.origin}
                          </span>
                          <span className="hidden md:flex items-center gap-1">
                            <Music size={8} /> {artist.genre}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Count */}
          <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground tracking-widest">
              {filtered.length} ARTIST{filtered.length !== 1 ? "S" : ""}
            </span>
            <Link href="/booking">
              <div className="group flex items-center gap-3 text-foreground hover:text-primary transition-colors cursor-pointer">
                <span className="font-bold tracking-widest uppercase text-xs">Want to Play?</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <SlimSubscribeStrip title="GET LINEUP DROPS FIRST" source="lineup_strip" />
      <Footer />
    </div>
  );
}
