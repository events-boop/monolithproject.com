import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, MapPin, Music, Sun } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { POSH_TICKET_URL } from "@/data/events";
import { ARTISTS } from "@/data/artists";
import EditorialHeader from "./EditorialHeader";
import KineticDecryption from "./KineticDecryption";

interface Artist {
  id: string;
  name: string;
  role: string;
  origin: string;
  genre: string;
  image: string;
}

const SUNSETS_ROSTER_IDS = ["autograf", "chus"] as const;
const UNTOLD_ROSTER_IDS = ["haai", "lazare"] as const;

const SUNSETS_ROSTER: Artist[] = SUNSETS_ROSTER_IDS.map((id) => ARTISTS[id]);
const UNTOLD_ROSTER: Artist[] = UNTOLD_ROSTER_IDS.map((id) => ARTISTS[id]);

function ArtistCard({ artist, accentColor, delay }: { artist: Artist; accentColor: string; delay: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const artistId = artist.id.toUpperCase().substring(0, 3);
  
  return (
    <Link href={`/artists/${artist.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="ui-card group relative h-[320px] md:h-[380px] cursor-pointer overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500"
      >
        {/* Architectural Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 25H100M0 50H100M0 75H100M25 0V100M50 0V100M75 0V100" stroke="white" strokeWidth="0.1" fill="none" />
           </svg>
        </div>

        {/* Telemetry HUD - Top Left */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-0.5">
          <span className="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase">Signal // {artistId}</span>
          <div className="flex items-center gap-1.5">
            <div className={`h-1 w-1 rounded-full animate-pulse ${accentColor === "clay" ? "bg-clay" : "bg-primary"}`} />
            <span className="font-mono text-[10px] text-white/60 tracking-widest uppercase">{artist.role}</span>
          </div>
        </div>

        {/* Scan Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%]" />

        {/* Image Core */}
        <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
          <ResponsiveImage
            src={artist.image}
            alt={artist.name}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700" />
          <div className={`absolute inset-0 opacity-20 ${accentColor === "clay" ? "bg-[radial-gradient(circle_at_18%_18%,#E8B86D,transparent_40%)]" : "bg-[radial-gradient(circle_at_82%_18%,#22D3EE,transparent_40%)]"}`} />
        </div>

        {/* Content HUD - Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-20 flex flex-col">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase mb-1">Dossier // 0{delay * 10 + 1}</span>
              <div className="min-h-[2.5rem] flex items-center">
                <KineticDecryption 
                  text={artist.name} 
                  className={`font-heavy text-3xl md:text-4xl text-white uppercase tracking-tighter leading-none ${accentColor === "clay" ? "group-hover:text-clay" : "group-hover:text-primary"} transition-colors duration-500`}
                />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-colors duration-500">
              <ArrowRight className="w-4 h-4 text-white opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-500" />
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1">Origin</span>
              <span className="font-mono text-[10px] text-white/70 uppercase flex items-center gap-1.5 tracking-tighter">
                <MapPin size={10} className="text-white/30" /> {artist.origin}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-1">Signature</span>
              <span className="font-mono text-[10px] text-white/70 uppercase flex items-center gap-1.5 tracking-tighter">
                <Music size={10} className="text-white/30" /> {artist.genre}
              </span>
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-0 right-0 w-8 h-8 opacity-20 pointer-events-none">
          <div className="absolute top-4 right-4 w-[1px] h-3 bg-white" />
          <div className="absolute top-4 right-4 w-3 h-[1px] bg-white" />
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
      <div className="container layout-default px-6">
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
              <div className="btn-pill-untold group">
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
