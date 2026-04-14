import { useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "wouter";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Instagram, Globe, MapPin, Music, Play, ArrowRight, Share2, Camera } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import WordScrubReveal from "@/components/ui/WordScrubReveal";
import MagneticButton from "@/components/MagneticButton";
import { ARTISTS } from "@/data/artists";
import { CTA_LABELS } from "@/lib/cta";
import { getSeriesEvents } from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import type { ScheduledEvent } from "@/data/events";
import { buildArtistSchema } from "@/lib/schema";


const LEGACY_ID_MAP: Record<string, string> = {
  "1": "haai",
  "3": "lazare",
  "4": "chus",
  "5": "autograf",
  "joezi": "chus",
};

function resolveArtistId(id: string | undefined) {
  if (!id) return undefined;
  if (ARTISTS[id]) return id;
  const legacy = LEGACY_ID_MAP[id];
  if (legacy && ARTISTS[legacy]) return legacy;
  return undefined;
}

export default function ArtistProfile() {
  usePublicSiteDataVersion();
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const resolvedId = resolveArtistId(id);
  const artist = resolvedId ? ARTISTS[resolvedId] : undefined;
  const canonicalArtistPath = resolvedId ? `/artists/${resolvedId}` : id ? `/artists/${id}` : "/lineup";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroImageY = useTransform(scrollYProgress, [0, 0.5], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);

  useEffect(() => {
    if (!id || !resolvedId) return;
    if (id === resolvedId) return;
    setLocation(`/artists/${resolvedId}`, { replace: true });
  }, [id, resolvedId, setLocation]);

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <SEO title="Artist Not Found" description="We couldn't find that artist profile." />
        <Navigation />
        <section className="h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[10px] tracking-[0.5em] text-white/30 uppercase mb-4">404 / Page Not Found</p>
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.9] uppercase mb-10">Profile Not Found</h1>
          <Link href="/lineup" asChild>
            <a className="btn-pill-coral">Back to Lineup</a>
          </Link>
        </section>
      </div>
    );
  }

  const primarySeries = artist.series[0];
  const isWarmSeries = primarySeries === "chasing-sunsets";
  const accentColor = isWarmSeries ? "#E8B86D" : primarySeries === "untold-story" ? "#22D3EE" : "#E05A3A";
  const accentClass = isWarmSeries ? "text-clay" : primarySeries === "untold-story" ? "text-primary" : "text-primary-foreground";
  
  const mappedSeries = (primarySeries === "sunsets-radio" ? "monolith-project" : primarySeries) as ScheduledEvent["series"];
  const nextSeriesEvent = getSeriesEvents(mappedSeries)[0];

  const primaryAction =
    primarySeries === "untold-story"
      ? { href: "/tickets", label: CTA_LABELS.tickets }
      : { href: "/schedule", label: CTA_LABELS.schedule };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      <SEO 
        title={artist.name} 
        description={artist.bio} 
        canonicalPath={canonicalArtistPath} 
        schemaData={buildArtistSchema(artist, canonicalArtistPath)}
      />

      
      {/* Cinematic Navigation Shell */}
      <div className="fixed top-0 left-0 right-0 z-[100] transition-opacity duration-500">
        <Navigation variant="dark" />
      </div>

      {/* Hero Section: Parallax & Kinetic Fill */}
      <section className="relative h-[100svh] w-full flex items-end overflow-hidden pb-12 md:pb-32 px-4 md:px-6">
        <motion.div 
          style={{ y: heroImageY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0 h-[140%] w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent opacity-60 z-10" />
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover object-center filter saturate-[0.8] brightness-[0.85]"
          />
        </motion.div>

        <div className="container layout-wide relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 mb-4">
              <motion.span 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.7 }}
                 className={`font-mono text-[10px] tracking-[0.5em] uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md`}
                 style={{ color: accentColor, borderColor: `${accentColor}33` }}
              >
                {primarySeries.replace("-", " ")}
              </motion.span>
            </div>

            <h1 className="font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.8] uppercase mb-4 md:mb-6">
              {artist.name}
            </h1>

            {/* Premium Role Designation Under Name */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-8 md:mb-12 relative"
            >
              {artist.role === "HEADLINER" ? (
                <div className="flex flex-col gap-1">
                  <span className="font-heavy text-[clamp(1.25rem,3vw,2.5rem)] tracking-[0.3em] text-white uppercase leading-none">
                    Headliner Status
                  </span>
                  <span className="font-mono text-[9px] md:text-[10px] tracking-[0.5em] text-white/30 uppercase">
                    Featured booking in the Monolith roster
                  </span>
                </div>
              ) : artist.role === "RESIDENT" ? (
                <div className="flex flex-col gap-6 md:gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="font-heavy text-[clamp(1.75rem,5vw,4rem)] tracking-[0.05em] text-white uppercase leading-[0.9]">
                      Monolith Resident Artist
                    </span>
                    <div className="flex items-center gap-3 md:gap-4 mt-2">
                       <div className="h-px w-8 md:w-12 bg-white/40" />
                       <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] text-white uppercase font-bold">
                         Core resident
                       </span>
                    </div>
                  </div>

                  {/* High-Prestige Residency Metadata HUD Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 pt-6 border-t border-white/10 max-w-3xl">
                     <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] text-white/40 uppercase">Residency</span>
                        <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase">Season 01</span>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] text-white/40 uppercase">Artist Role</span>
                        <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase">Resident</span>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] text-white/40 uppercase">Based In</span>
                        <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase truncate">{artist.origin.split(',')[0]} / {artist.origin.split(',')[1]?.trim() || 'Global'}</span>
                     </div>
                     <div className="flex flex-col gap-1.5">
                        <span className="font-mono text-[8px] md:text-[9px] tracking-[0.3em] text-white/40 uppercase">Status</span>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)] animate-pulse" />
                           <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase">Active resident</span>
                        </div>
                     </div>
                  </div>
                </div>
              ) : (
                <span className="font-mono text-[10px] tracking-[0.5em] text-white/50 uppercase">
                  {artist.role}
                </span>
              )}
            </motion.div>

            <div className="flex flex-wrap items-center gap-10 md:gap-16">
              <div className="flex items-center gap-8">
                 <div className="flex flex-col gap-1">
                   <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase lowercase-none">Based In</span>
                   <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                     <MapPin className="w-3 h-3 opacity-40" /> {artist.origin}
                   </span>
                 </div>
                 <div className="flex flex-col gap-1">
                   <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase lowercase-none">Sound</span>
                   <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                     <Music className="w-3 h-3 opacity-40" /> {artist.genre}
                   </span>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                <MagneticButton strength={0.25}>
                  <Link href={primaryAction.href} asChild>
                    <a className={`px-10 py-5 rounded-full font-bold text-[10px] tracking-[0.4em] uppercase transition-all duration-500 overflow-hidden group relative flex items-center gap-3 backdrop-blur-xl bg-white text-black hover:bg-black hover:text-white border-white`}>
                      {primaryAction.label}
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </a>
                  </Link>
                </MagneticButton>

                {artist.socials.instagram && (
                  <MagneticButton strength={0.3}>
                    <a href={artist.socials.instagram} target="_blank" className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md hover:bg-white hover:text-black transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                  </MagneticButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-10 flex flex-col items-center gap-4 hidden md:flex"
        >
          <span className="font-mono text-[10px] tracking-[0.5em] text-white/20 uppercase vertical-rl">The Roster</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* Main Content: Bento Glass System */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container layout-wide grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Content — Story & Tracks */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-32">
            
            {/* About Section */}
            <div className="space-y-12">
               <div className="flex items-center gap-4 text-white/20">
                 <span className="font-mono text-[10px] tracking-[0.4em] uppercase">01 / Concept</span>
                 <div className="h-px w-20 bg-current" />
               </div>
               <WordScrubReveal 
                  text={artist.bio}
                  className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-white/80 font-light text-balance"
               />
               <div className="flex flex-wrap gap-2 pt-6">
                 {artist.tags.map(tag => (
                   <span key={tag} className="px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.02] font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white hover:border-white/20 transition-all cursor-default">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>

            {/* Previous Sets Section */}
            {artist.previousSets && artist.previousSets.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-white/20">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase">02 / Recorded Rituals</span>
                  <div className="h-px w-20 bg-current" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {artist.previousSets.map((set, i) => (
                    <motion.a
                      key={set.title}
                      href={set.url}
                      target="_blank"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-[#E8B86D] uppercase">{set.date}</span>
                        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                      <h5 className="font-display text-2xl uppercase tracking-widest text-white mb-2">{set.title}</h5>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">Live Recording</p>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {artist.gallery && artist.gallery.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-white/20">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                    {artist.previousSets?.length ? "03" : "02"} / Live Gallery
                  </span>
                  <div className="h-px w-20 bg-current" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {artist.gallery.map((photo, i) => (
                    <motion.div
                      key={photo.src}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative overflow-hidden rounded-2xl border border-white/5 group cursor-pointer ${
                        i === 0 ? "col-span-2 row-span-2" : ""
                      }`}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-700 filter saturate-[0.85] group-hover:saturate-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="font-mono text-[9px] tracking-[0.3em] text-white/70 uppercase">{photo.alt}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Tracks Section */}
            <div className="space-y-12">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/20">
                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                      {artist.gallery?.length ? (artist.previousSets?.length ? "04" : "03") : "03"} / Selected Records
                    </span>
                    <div className="h-px w-20 bg-current" />
                  </div>
               </div>
               <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                  {artist.tracks.map((track, i) => (
                    <div 
                      key={track.title}
                      className="group flex items-center justify-between p-8 bg-[#050505] hover:bg-white/[0.02] transition-colors duration-500 cursor-pointer"
                    >
                      <div className="flex items-center gap-8">
                        <span className="font-mono text-xs text-white/20 group-hover:text-primary transition-colors">{(i+1).toString().padStart(2, '0')}</span>
                        <div className="flex flex-col gap-1">
                          <span className="text-xl md:text-2xl font-display uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">{track.title}</span>
                          <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase lowercase-none">{artist.name} · MONOLITH SELECT</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-xs text-white/20">{track.duration}</span>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                          <Play className="w-4 h-4 text-white/40 group-hover:text-black fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Content — Sidebar Glass Bento */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">
            
            {/* Next Ritual Card */}
            <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <Share2 className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
               </div>
               <span className="ui-kicker text-white/40 mb-2 block lowercase-none">Next Event</span>
               <h4 className="font-display text-4xl uppercase tracking-widest text-white mb-10 leading-none">
                 What&apos;s<br/>Next
               </h4>
               
               <div className="space-y-8 border-y border-white/5 py-10 mb-10">
                  {[
                    { label: "Series", value: primarySeries === "untold-story" ? "Untold Story" : "Chasing Sun(Sets)" },
                    { label: "Date", value: nextSeriesEvent?.date || "August 2026" },
                    { label: "Venue", value: nextSeriesEvent?.venue || "Reveal TBA" },
                    { label: "City", value: nextSeriesEvent?.location || "Chicago, IL" },
                  ].map(spec => (
                    <div key={spec.label} className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase lowercase-none">{spec.label}</span>
                      <span className="font-mono text-sm uppercase tracking-widest text-white/80">{spec.value}</span>
                    </div>
                  ))}
               </div>

               <Link href={primaryAction.href} asChild>
                 <a className={`w-full py-6 rounded-full flex items-center justify-center gap-3 font-bold text-[10px] tracking-[0.4em] uppercase transition-all duration-500 cursor-pointer overflow-hidden group bg-transparent border border-white/10 text-white hover:bg-white hover:text-black`}>
                    {primaryAction.label}
                    <ArrowRight className="w-4 h-4" />
                 </a>
               </Link>
            </div>

            {/* Connection Card */}
            <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
               <span className="ui-kicker text-white/40 mb-8 block lowercase-none">Follow</span>
               <div className="grid grid-cols-2 gap-4">
                  <a href={artist.socials.instagram} target="_blank" className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white group transition-all duration-500">
                    <Instagram className="w-6 h-6 text-white/40 group-hover:text-black transition-colors mb-3" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 group-hover:text-black transition-colors uppercase">Instagram</span>
                  </a>
                  <a href={artist.socials.website} target="_blank" className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white group transition-all duration-500">
                    <Globe className="w-6 h-6 text-white/40 group-hover:text-black transition-colors mb-3" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 group-hover:text-black transition-colors uppercase">Official Site</span>
                  </a>
               </div>
            </div>

          </div>

        </div>
      </section>

      <section className="pt-24">
        <EntityBoostStrip tone="dark" className="pb-12 border-t border-white/5 bg-[#050505]" />
      </section>
    </div>
  );
}
