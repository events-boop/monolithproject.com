import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, AudioLines, Sun, Ticket } from "lucide-react";
import { useEffect, useState, memo } from "react";
import VideoHeroSlider, { Slide } from "./VideoHeroSlider";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { BorderBeam } from "./ui/BorderBeam";
import JsonLd from "@/components/JsonLd";
import MagneticButton from "@/components/MagneticButton";
import KineticDecryption from "./KineticDecryption";
import WordScrubReveal from "./ui/WordScrubReveal";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { buildScheduledEventSchema } from "@/lib/schema";
import {
  getEventEyebrow,
  getEventStartTimestamp,
  getEventVenueLabel,
  getExperienceEvent,
  getPrimaryTicketUrl,
  isTicketOnSale,
} from "@/lib/siteExperience";
import {
  getHeroEventStatusLabel,
  getHomePrimaryCtaLabel,
  getHomeSecondaryCtaLabel,
} from "@/lib/cta";

const heroPosterImage = getResponsiveImage("chasingSunsets");
const heroUntoldImage = getResponsiveImage("untoldStoryHero");
const heroSunsetsImage = getResponsiveImage("chasingSunsets");

const HERO_SLIDES: Slide[] = [
  {
    type: "video",
    src: "/videos/hero-video-1.mp4",
    poster: heroPosterImage.src,
    posterSources: heroPosterImage.sources,
    posterSizes: heroPosterImage.sizes,
    caption: "THE MONOLITH PROJECT (LIVE)",
  },
  {
    type: "image",
    src: heroUntoldImage.src,
    sources: heroUntoldImage.sources,
    sizes: heroUntoldImage.sizes,
    alt: "Juany Bravo x Deron",
    caption: "JUANY BRAVO B2B DERON | UNTOLD STORY",
  },
  {
    type: "image",
    src: "/images/lazare-recap.webp",
    alt: "Lazare at Monolith Project",
    credit: "JP Quindara",
    caption: "LAZARE | MONOLITH PROJECT",
  },
  {
    type: "image",
    src: heroSunsetsImage.src,
    sources: heroSunsetsImage.sources,
    sizes: heroSunsetsImage.sizes,
    alt: "Chasing Sun(Sets)",
    caption: "CHASING SUN(SETS)",
  },
  {
    type: "image",
    src: "/images/autograf-recap.jpg",
    alt: "Autograf live set",
    credit: "TBA",
    caption: "AUTOGRAF | LIVE SET",
  },
];

const COLLECTIVE_PATHS = [
  {
    description: "Open-air rooms built for warmth, rhythm, and daylight turning into dusk.",
    href: "/chasing-sunsets",
    icon: Sun,
    label: "Open Air",
    title: "Chasing Sun(Sets)",
    tone: "sun",
  },
  {
    description: "The closer chapter where the room narrows and the sound gets deeper.",
    href: "/story",
    icon: UntoldButterflyLogo,
    label: "After Dark",
    title: "Untold Story",
    tone: "story",
  },
  {
    description: "Mixes and artist sessions that keep the taste moving between nights.",
    href: "/radio",
    icon: AudioLines,
    label: "Signal",
    title: "Radio Show",
    tone: "radio",
  },
] as const;

const HERO_SUPPORT_LINES = [
  "Music nights",
  "built with taste",
  "and rooms worth returning to.",
 ] as const;

const HERO_PROOF_CHIPS = ["Chicago-rooted", "Music-first", "Room-led"] as const;

const HERO_SUBHEAD =
  "A Chicago-rooted music world built through recurring nights, distinct series, and a radio signal that keeps the taste alive between them.";

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

  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const CountdownDisplay = memo(function CountdownDisplay({ target }: { target: number }) {
  const { days, hours, minutes, seconds } = useCountdown(target);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      data-testid="hero-countdown"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.45, delay: reduceMotion ? 0 : 0.4 }}
      className="flex items-center gap-5 md:gap-8 w-fit rounded-none border border-white/10 px-6 py-4 shadow-2xl bg-black/60 backdrop-blur-xl md:px-8 md:py-5"
    >
      {[
        { value: days, label: "DAYS", highlight: true },
        { value: hours, label: "HRS", highlight: false },
        { value: minutes, label: "MIN", highlight: false },
        { value: seconds, label: "SEC", highlight: false },
      ].map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span className={`font-display text-4xl md:text-5xl font-[900] tracking-tighter tabular-nums ${unit.highlight ? "text-primary" : "text-white/90"}`}>
            {pad(unit.value)}
          </span>
          <span className={`mt-1 font-mono text-[10px] font-bold tracking-[0.3em] ${unit.highlight ? "text-primary/80" : "text-white/60"}`}>
            {unit.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
});

function useIsExpired(target: number) {
  const [expired, setExpired] = useState(Date.now() >= target);

  useEffect(() => {
    if (expired) return;
    const remaining = target - Date.now();
    if (remaining <= 0) {
      setExpired(true);
      return;
    }
    const id = setTimeout(() => setExpired(true), remaining);
    return () => clearTimeout(id);
  }, [target, expired]);

  return expired;
}

export default function HeroSection() {
  const featuredEvent = getExperienceEvent("hero");
  const targetDate = getEventStartTimestamp(featuredEvent);
  const ticketUrl = getPrimaryTicketUrl(featuredEvent);
  const hasLiveTickets = isTicketOnSale(featuredEvent);
  const isExpired = useIsExpired(targetDate ?? 0);
  const reduceMotion = useReducedMotion();
  const headline = featuredEvent?.headline || featuredEvent?.title || "The Monolith Project";
  const eyebrow = getEventEyebrow(featuredEvent);
  const venueLabel = getEventVenueLabel(featuredEvent);
  
  const structuredData = featuredEvent ? <JsonLd data={buildScheduledEventSchema(featuredEvent, "/")} /> : null;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, reduceMotion ? 0 : 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);
  
  const primaryCtaLabel = hasLiveTickets ? getHomePrimaryCtaLabel(true) : featuredEvent?.status === 'coming-soon' ? "Join Priority Access" : getHomePrimaryCtaLabel(false);
  const secondaryCtaLabel = hasLiveTickets ? getHomeSecondaryCtaLabel(true) : featuredEvent?.status === 'coming-soon' ? "Event Details" : getHomeSecondaryCtaLabel(false);
  
  const primaryCtaHref = hasLiveTickets ? ticketUrl : featuredEvent?.status === 'coming-soon' ? (featuredEvent.series === 'chasing-sunsets' ? '/chasing-sunsets' : '/story') : "/schedule";
  const secondaryCtaHref = hasLiveTickets ? "/schedule" : featuredEvent?.status === 'coming-soon' ? (featuredEvent.series === 'chasing-sunsets' ? '/chasing-sunsets' : '/story') : "/insights";

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      {structuredData}
      
      {/* 🌊 NEURAL DRIFT BACKGROUND (Absolute Zero) */}
      <style>{`
        @keyframes neural-drift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .neural-drift-gradient {
          background: linear-gradient(-45deg, rgba(0,0,0,0), rgba(224,90,58,0.02), rgba(0,0,0,0), rgba(34,211,238,0.02));
          background-size: 400% 400%;
          animation: neural-drift 15s ease infinite;
        }
      `}</style>
      <div className="absolute inset-0 z-[1] neural-drift-gradient pointer-events-none" />

      {/* Cinematic Background Layer */}
      <motion.div style={{ y, opacity, scale }} className="absolute inset-0 z-0 h-[115%] -top-[7%] hero-bg">
        <VideoHeroSlider slides={HERO_SLIDES} />
      </motion.div>

      {/* Architectural HUD Grid Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4vw_4vw]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ["-10%", "110%"] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" 
        />
      </div>

      {/* Main Impact Visuals (Center Focused) */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center h-full pt-[22vh] lg:pt-0 px-6 text-center w-full pointer-events-none">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 lg:mb-16 relative"
        >
          <div className="flex items-center gap-4 justify-center">
             <div className="h-px w-8 md:w-20 bg-white/10" />
             <h2 className="font-mono text-[11px] md:text-sm uppercase tracking-[0.8em] text-white/40">
               {eyebrow || "Chicago-Rooted Event World"} / System Active
             </h2>
             <div className="h-px w-8 md:w-20 bg-white/10" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center text-white relative z-10"
        >
          {/* Kinetic Fragmented Typography */}
          <div className="relative">
                <motion.h1
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="font-heavy text-[clamp(2.8rem,15vw,13rem)] tracking-[-0.03em] leading-[0.8] text-white uppercase drop-shadow-[0_0_80px_rgba(255,255,255,0.08)] pointer-events-auto"
                >
                  <KineticDecryption text="MONOLITH" />
                </motion.h1>
          </div>
          
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "120%", opacity: 1 }}
            transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-6 lg:my-10" 
          />
          
          <span className="font-monolith text-[clamp(0.8rem,5vw,3rem)] leading-[1] tracking-[0.5em] uppercase text-white/90 pl-[0.5em]">
            PROJECT
          </span>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 2, delay: 1.4 }}
           className="mt-16 flex flex-col items-center w-full px-4"
        >
           {/* Primary Hero Signal Box */}
           {featuredEvent && (
              <div className="mb-14 flex flex-col items-center gap-6 p-8 border border-white/5 bg-white/[0.02] rounded-none backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-4">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(224,90,58,0.8)]" />
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] text-primary/90">Next Open-Air Signal</span>
                  </div>
                  <h2 className="font-display text-[clamp(1.8rem,5vw,4.5rem)] leading-none uppercase tracking-widest text-white drop-shadow-2xl">
                     {headline}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[11px] md:text-xs uppercase tracking-[0.4em] text-white/40">
                     <span className="text-white/70">{venueLabel}</span>
                     <span className="hidden md:inline-block w-px h-3 bg-white/10" />
                     <span className="text-white/70">{featuredEvent.date}</span>
                  </div>
              </div>
           )}

           <div className="text-[11px] md:text-base uppercase tracking-[0.22em] text-white/60 leading-relaxed font-mono max-w-2xl mx-auto mb-10 text-center px-4">
             <WordScrubReveal text={HERO_SUBHEAD} />
           </div>
           
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto w-full">
              <MagneticButton strength={typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 0.4}>
                <a
                  href={primaryCtaHref as string}
                  target={hasLiveTickets ? "_blank" : undefined}
                  data-cursor-magnetic
                  data-cursor-text={hasLiveTickets ? "RSVP" : "ACCESS"}
                  className="group relative flex items-center justify-center gap-4 px-10 py-5 text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase tracking-[0.28em] sm:tracking-[0.32em] text-white w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-primary/90 rounded-none transition-transform duration-500 group-hover:scale-105" />
                  <span className="relative z-10 flex items-center gap-3">
                    <Ticket className="w-4 h-4" />
                    {primaryCtaLabel}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </MagneticButton>

              <MagneticButton strength={0.25}>
                <Link
                  href={secondaryCtaHref}
                  className="group relative flex items-center justify-center gap-4 px-10 py-5 text-[12px] sm:text-[13px] md:text-[14px] font-black uppercase tracking-[0.28em] sm:tracking-[0.32em] text-white/82 hover:text-white transition-colors w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {secondaryCtaLabel}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </MagneticButton>
           </div>
        </motion.div>
      </div>

      {/* Subtle Bottom Signal */}
      <div className="absolute inset-x-0 bottom-12 z-40 px-6 pointer-events-none">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-end gap-8">
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 2.2 }}
             className="hidden md:flex gap-6"
           >
              {COLLECTIVE_PATHS.map((path) => (
                <Link key={path.title} href={path.href} className="group pointer-events-auto">
                  <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20 group-hover:text-primary transition-colors">
                    {path.title}
                  </span>
                </Link>
              ))}
           </motion.div>

           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 2.4 }}
             className="hidden md:block pointer-events-auto"
           >
              {!isExpired && targetDate ? (
                <div className="flex items-baseline gap-4">
                   <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20">Sequence Timer:</span>
                   <CountdownDisplay target={targetDate} />
                </div>
              ) : null}
           </motion.div>
        </div>
      </div>
    </section>
  );
}
