import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, MapPin, Music, ArrowRight, Sun } from "lucide-react";
import { Link } from "wouter";
import GlobalListenerMap from "@/components/GlobalListenerMap";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import StickyPlayer from "@/components/StickyPlayer";
import RevealText from "@/components/RevealText";
import HeroSpotlight from "@/components/ui/HeroSpotlight";
import { BorderBeam } from "@/components/ui/BorderBeam";
import SEO from "@/components/SEO";

interface Track {
  title: string;
  artist: string;
  series: "sunsets" | "untold";
  duration: string;
  soundcloudUrl: string;
  embedUrl: string;
}

const tracks: Track[] = [
  {
    title: "Spécial NYE",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "58:23",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "TERRANOVA x CHASING SUN(SETS)",
    artist: "TERRANOVA",
    series: "sunsets",
    duration: "62:10",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/terranova",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/terranova&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Mix Vol.3",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "55:48",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "RADIAN x UNTOLD STORY",
    artist: "RADIAN",
    series: "untold",
    duration: "71:05",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/radianofc-set",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/radianofc-set&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Collab Mix Vol.2",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "48:32",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Live from Marbella EP02",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "64:17",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
];

type Filter = "all" | "sunsets" | "untold";

export default function Radio() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? tracks : tracks.filter((t) => t.series === filter);

  const handlePlay = (index: number) => {
    // Find real index in full tracks array
    const track = filtered[index];
    const realIndex = tracks.indexOf(track);
    setActiveTrack((current) => (current === realIndex ? null : realIndex));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Radio"
        description="Listen to curated sets and live recordings from The Monolith Project artists. The music doesn't stop when the show ends."
      />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Globe */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Rotating Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120vw] md:w-[60vw] aspect-square rounded-full border border-dashed border-primary/20 opacity-30 mix-blend-screen"
          />

          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl opacity-40 mix-blend-screen"
            style={{
              backgroundImage: "url('/images/radio-globe.png')",
              backgroundSize: "contain",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat"
            }}
          />

          {/* Signal Pings */}
          {[
            { top: "20%", left: "45%", delay: 0 },
            { top: "35%", left: "55%", delay: 2 },
            { top: "25%", left: "52%", delay: 4 },
            { top: "15%", left: "48%", delay: 1.5 },
            { top: "30%", left: "42%", delay: 3.5 },
          ].map((ping, i) => (
            <div key={i} className="absolute inset-0 pointer-events-none">
              <div
                className="absolute w-full max-w-5xl left-1/2 -translate-x-1/2 h-full"
              >
                <div className="absolute" style={{ top: ping.top, left: ping.left }}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{ duration: 3, repeat: Infinity, delay: ping.delay, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-primary/60 bg-primary/20"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: ping.delay }}
                    className="w-1 h-1 rounded-full bg-primary blur-[1px]"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Gradient overlays to blend it in */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-80" />
        </div>

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div>
            <RevealText as="span" className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-6" delay={0.1}>
              Mix Series
            </RevealText>
            <div className="mb-8">
              <HeroSpotlight className="-m-8 p-8" spotlightColor="rgba(255, 255, 255, 0.2)">
                <RevealText as="h1" className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.85] uppercase text-foreground drop-shadow-2xl" blurStrength={20} delay={0.2}>
                  RADIO
                </RevealText>
              </HeroSpotlight>
            </div>
            <RevealText as="p" className="max-w-lg text-muted-foreground text-lg leading-relaxed mix-blend-plus-lighter" delay={0.4} stagger={0.01}>
              Curated sets and live recordings from our artists and guests.
              The music doesn't stop when the show ends.
            </RevealText>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-8">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 pb-6 border-b border-border">
            {([
              { label: "ALL", value: "all" as Filter, icon: null },
              { label: "SUN(SETS)", value: "sunsets" as Filter, icon: <Sun className="w-3.5 h-3.5" /> },
              { label: "UNTOLD", value: "untold" as Filter, icon: <UntoldButterflyLogo className="w-4 h-4" /> },
            ]).map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 border rounded-full ${filter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
            <span className="ml-auto font-mono text-xs text-muted-foreground self-center">
              {filtered.length} SET{filtered.length !== 1 ? "S" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Track List */}
      <section className="px-6 pb-16">
        <div className="container max-w-6xl mx-auto">
          <div className="border-t border-border/50">
            {filtered.map((track, index) => {
              const realIndex = tracks.indexOf(track);
              const isActive = activeTrack === realIndex;
              return (
                <motion.button
                  key={track.soundcloudUrl}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  aria-pressed={isActive}
                  aria-label={`${isActive ? "Pause" : "Play"} ${track.title} by ${track.artist}`}
                  className={`group w-full text-left flex items-center gap-4 md:gap-6 py-5 px-4 border-b border-border/50 transition-colors cursor-pointer bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${isActive ? "bg-white/5" : "hover:bg-white/[0.03]"
                    }`}
                  onClick={() => handlePlay(index)}
                >
                  {/* Track number / play */}
                  <div className="w-8 flex items-center justify-center shrink-0">
                    <span className={`font-mono text-sm transition-opacity ${isActive ? "hidden" : "group-hover:hidden"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`${isActive ? "block" : "hidden group-hover:block"}`}>
                      {isActive ? (
                        <Pause className="w-4 h-4 text-primary" />
                      ) : (
                        <Play className="w-4 h-4 text-primary ml-0.5" />
                      )}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium truncate transition-colors ${isActive ? "text-primary" : "text-foreground"}`}>
                      {track.title}
                    </span>
                    <span className="block text-xs text-muted-foreground font-mono tracking-wide">
                      {track.artist}
                    </span>
                  </div>

                  {/* Series tag */}
                  <span className={`hidden md:block px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase border ${track.series === "sunsets"
                    ? "text-clay border-clay/30"
                    : "text-primary border-primary/30"
                    }`}>
                    {track.series === "sunsets" ? "SUN(SETS)" : "UNTOLD"}
                  </span>

                  {/* Duration */}
                  <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0">
                    {track.duration}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* SoundCloud link */}
          <div className="mt-6 flex items-center justify-between">
            <a
              href="https://soundcloud.com/chasing-sun-sets"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <span className="font-mono tracking-wide uppercase text-xs">All mixes on SoundCloud</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 py-20 bg-card border-t border-border">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
            <div>
              <RevealText as="span" className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-2" delay={0.1}>
                Global Reach
              </RevealText>
              <RevealText as="h2" className="font-display text-3xl md:text-4xl text-foreground" delay={0.2} blurStrength={10}>
                WHERE WE ARE
              </RevealText>
            </div>
            <span className="font-mono text-xs text-muted-foreground tracking-widest">
              4 ARTISTS · 8 CITIES
            </span>
          </div>

          <div className="border border-border bg-background p-6">
            <div className="h-[300px] md:h-[400px]">
              <GlobalListenerMap />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="container max-w-4xl mx-auto text-center">
          <RevealText as="h2" className="font-display text-4xl md:text-6xl text-foreground mb-4" blurStrength={12}>
            HEAR IT LIVE
          </RevealText>
          <RevealText as="p" className="text-muted-foreground max-w-md mx-auto mb-12" stagger={0.01} delay={0.2}>
            Every set gets recorded and added to the archive.
            Come to the show, hear it first.
          </RevealText>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tickets" asChild>
              <a className="group relative overflow-hidden px-10 py-4 bg-primary text-primary-foreground font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer rounded-full inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                GET TICKETS
                <BorderBeam size={60} duration={3} colorFrom="#ffffff" colorTo="#E8B86D" borderWidth={1.5} />
              </a>
            </Link>
            <Link href="/lineup" asChild>
              <a className="px-10 py-4 border border-border text-foreground font-display text-lg tracking-widest uppercase hover:border-primary hover:text-primary transition-colors cursor-pointer rounded-full inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                VIEW LINEUP
              </a>
            </Link>
          </div>
        </div>
      </section>

      <SlimSubscribeStrip title="SUBSCRIBE TO NEW MIXES" source="radio_strip" />
      <Footer />

      {/* Sticky player */}
      <StickyPlayer
        track={activeTrack !== null ? tracks[activeTrack] : null}
        onClose={() => setActiveTrack(null)}
      />
    </div>
  );
}
