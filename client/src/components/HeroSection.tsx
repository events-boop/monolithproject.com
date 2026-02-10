import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ArrowDown, Sun, Volume2, VolumeX, Ticket } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { POSH_TICKET_URL } from "@/data/events";
import GlitchText from "./GlitchText";

// March 6, 2026 — Untold Story S3·E2 at 7:00 PM CT
const TARGET_DATE = new Date("2026-03-06T19:00:00-06:00").getTime();

function useCountdown(target: number) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isExpired: diff === 0 };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function HeroSection() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(TARGET_DATE);
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShouldLoadVideo(true), 500);
    return () => window.clearTimeout(id);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Full-bleed video background */}
      <div className="absolute inset-0 z-0">
        {shouldLoadVideo ? (
          <video
            ref={videoRef}
            src="/videos/hero-video-1.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            poster="/images/hero-monolith.jpg"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/images/hero-monolith.jpg"
            alt=""
            decoding="async"
            className="w-full h-full object-cover"
          />
        )}
        {/* Balanced overlays: brighter center, protected edges for legibility */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,0,0,0.2),rgba(0,0,0,0.5)_78%,rgba(0,0,0,0.6)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(224,90,58,0.16),transparent_35%),radial-gradient(circle_at_85%_35%,rgba(139,92,246,0.14),transparent_38%)]" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Editorial left-aligned content */}
      <div className="relative z-20 flex-1 flex flex-col justify-between px-6 md:px-12 lg:px-20 pb-16 md:pb-24 pt-40">

        {/* Upper zone — title + subtitle */}
        <div className="mt-auto mb-auto pt-8 md:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 1, delay: reduceMotion ? 0 : 0.3 }}
            className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] uppercase text-white mb-4 tracking-tight-display"
          >
            <div className="relative inline-block translate-y-2 md:translate-y-3">
              <GlitchText className="block text-white leading-none">MONOLITH</GlitchText>
            </div>
            <span className="block text-[0.48em] text-white/65 leading-none tracking-[0.24em] mt-0">PROJECT</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 1, delay: reduceMotion ? 0 : 0.5 }}
            className="font-serif italic text-xl md:text-2xl text-white/80 max-w-lg"
          >
            Built on music, community, and showing up for each other.
          </motion.p>
          <div className="mt-6 h-px w-36 bg-gradient-to-r from-primary/70 to-transparent" />
        </div>

        {/* Lower zone — event info + CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16">

          {/* Left: metadata + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.8, delay: reduceMotion ? 0 : 0.7 }}
            className="space-y-6"
          >
            {/* Event info */}
            {!isExpired && (
              <a href={POSH_TICKET_URL} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 ui-meta text-white/90">
                  <span className="accent-story font-bold">Untold Story S3·E2</span>
                  <span className="text-white/35">—</span>
                  <span className="text-primary font-bold">March 6, 2026</span>
                  <span className="text-white/35">—</span>
                  <span className="text-white/80">Alhambra Palace, Chicago</span>
                  <span className="text-white/70 group-hover:text-primary transition-colors">→</span>
                </div>
              </a>
            )}

            {!isExpired && (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/45 bg-primary/12 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="ui-chip text-primary">Limited Tickets On Sale</span>
              </div>
            )}

            {isExpired && (
              <Link href="/story">
                <a className="group flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-mono text-xs tracking-widest uppercase text-primary group-hover:text-white transition-colors">
                    Untold Story S3·E2 — View Recap →
                  </span>
                </a>
              </Link>
            )}

            {/* Pill CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={POSH_TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill relative overflow-hidden group border-primary bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                {!reduceMotion && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-200%] group-hover:animate-[shine_1s_ease-in-out_infinite]" />
                )}
                <Ticket className="w-3.5 h-3.5" />
                Get Tickets
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="#movement"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("movement")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-pill border-white/40 bg-black/20 text-white/90 hover:text-white hover:border-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Explore
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Series links */}
            <div className="flex items-center gap-4">
              <Link href="/chasing-sunsets">
                <a className="group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/70">
                  <Sun className="w-4.5 h-4.5 text-clay" />
                  <span className="ui-meta text-white/80 group-hover:text-clay transition-colors">
                    Chasing Sun(Sets)
                  </span>
                </a>
              </Link>
              <Link href="/story">
                <a className="group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                  <UntoldButterflyLogo className="w-5 h-5 accent-story" />
                  <span className="ui-meta text-white/80 group-hover:accent-story transition-colors">
                    Untold
                  </span>
                </a>
              </Link>
            </div>

            {/* Metadata */}
            <div className="ui-meta bg-gradient-to-r from-white/70 via-white to-white/75 bg-clip-text text-transparent">
              Chicago Events Collective · Est. 2025
            </div>
          </motion.div>

          {/* Right: Countdown */}
          {!isExpired && (
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.45, delay: reduceMotion ? 0 : 0.4 }}
              className="flex items-center gap-3 md:gap-4"
            >
              {[
                { value: days, label: "DAYS", highlight: true },
                { value: hours, label: "HRS", highlight: false },
                { value: minutes, label: "MIN", highlight: false },
                { value: seconds, label: "SEC", highlight: false },
              ].map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <span className={`font-display text-3xl md:text-4xl tabular-nums ${unit.highlight ? "text-primary" : "text-white/90"}`}>
                    {pad(unit.value)}
                  </span>
                  <span className={`font-mono text-[8px] tracking-[0.3em] mt-1 ${unit.highlight ? "text-primary/70" : "text-white/45"}`}>
                    {unit.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mute toggle — bottom right */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute hero video" : "Mute hero video"}
        className="absolute bottom-8 right-6 md:right-8 z-30 p-3 border border-white/10 rounded-full bg-black/20 backdrop-blur-sm text-white/40 hover:text-white hover:border-white/30 transition-all"
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </section>
  );
}
