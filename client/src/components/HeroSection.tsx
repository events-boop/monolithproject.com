import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, AudioLines, Sun, Ticket, Lock, Zap } from "lucide-react";
import { useEffect, useState, memo } from "react";
import VideoHeroSlider, { Slide } from "./VideoHeroSlider";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { BorderBeam } from "./ui/BorderBeam";
import JsonLd from "@/components/JsonLd";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
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
import { getEventCta, getEventDetailsHref } from "@/lib/cta";

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
    description: "The late-night series where the room gets tighter and the sound gets deeper.",
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
    label: "Radio",
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
  "Recurring music experiences, radio, and archive from Chicago.";

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

  const cta = getEventCta(featuredEvent);

  const secondaryCtaLabel = hasLiveTickets ? "Event Details" : featuredEvent?.status === 'coming-soon' ? "Explore The Series" : "Event Schedule";
  const secondaryCtaHref = hasLiveTickets ? getEventDetailsHref(featuredEvent) : "/schedule";

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
        {featuredEvent?.image ? (
          <div className="absolute inset-0 bg-cover bg-center brightness-75 transition-all duration-1000" style={{ backgroundImage: `url(${featuredEvent.image})` }} />
        ) : (
          <VideoHeroSlider slides={HERO_SLIDES} />
        )}
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
        
        {/* ACTIVE DASH HIJACK */}
        {featuredEvent && hasLiveTickets ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center text-white relative z-10 w-full max-w-7xl mx-auto pointer-events-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(224,90,58,0.8)]" />
              <span className="font-mono text-xs uppercase tracking-[0.5em] text-primary">Tickets Active</span>
            </div>
            
            <h1 className="font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.85] uppercase tracking-tighter text-white drop-shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              {headline}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-white/70 mt-8 mb-12">
              <span>{venueLabel}</span>
              <span className="hidden md:inline-block w-px h-3 bg-white/30" />
              <span>{featuredEvent.date}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
              <MagneticButton strength={0.4}>
                <a
                  href={cta.href}
                  target={cta.isExternal ? "_blank" : undefined}
                  rel={cta.isExternal ? "noopener noreferrer" : undefined}
                  className={`group relative flex items-center justify-center gap-4 px-12 py-5 md:py-6 text-[14px] md:text-[15px] font-black tracking-[0.2em] uppercase transition-all duration-500 w-full sm:w-auto rounded-none ${cta.tool === 'posh' ? 'bg-primary text-white hover:bg-white hover:text-black shadow-[0_0_40px_rgba(224,90,58,0.4)]' : 'bg-white text-black hover:bg-primary hover:text-white'}`}
                >
                  {cta.label}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <Link href={secondaryCtaHref} className="cta-ghost group relative flex items-center justify-center gap-3 px-8 py-5 md:py-6 text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-500 w-full sm:w-auto backdrop-blur-xl bg-black/40 border border-white/10 hover:bg-white/10">
                   {secondaryCtaLabel}
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* BRAND DASH PRESERVED (when NO active event) */}
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-8 lg:mb-16 relative">
              <div className="flex items-center gap-4 justify-center">
                <div className="h-px w-8 md:w-20 bg-white/10" />
                <h2 className="font-mono text-[11px] md:text-sm uppercase tracking-[0.8em] text-white/40">{eyebrow || "Chicago Music Project"}</h2>
                <div className="h-px w-8 md:w-20 bg-white/10" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center justify-center text-white relative z-10">
              <div className="relative">
                <motion.h1 className="font-heavy text-[clamp(3.8rem,15vw,14rem)] tracking-[-0.03em] leading-[0.8] text-white uppercase drop-shadow-[0_0_80px_rgba(255,255,255,0.08)] pointer-events-auto">
                  <KineticDecryption text="MONOLITH" />
                </motion.h1>
              </div>
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "120%", opacity: 1 }} transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }} className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-6 lg:my-10" />
              <span className="font-monolith text-[clamp(0.8rem,5vw,3rem)] leading-[1] tracking-[0.5em] uppercase text-white/90 pl-[0.5em]">PROJECT</span>
              <BrandTranslatorLabel className="mt-5" tone="neutral">Chicago Cultural House</BrandTranslatorLabel>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.4 }}
          className="mt-16 flex flex-col items-center w-full px-4"
        >
          {!featuredEvent?.image && (
            <>
              <div className="text-[11px] md:text-base uppercase tracking-[0.22em] text-white/60 leading-relaxed font-mono max-w-2xl mx-auto mb-10 text-center px-4">
                <WordScrubReveal text={HERO_SUBHEAD} />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto w-full">
                <MagneticButton strength={typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 0.4}>
                  <a href={cta.href} target={cta.isExternal ? "_blank" : undefined} rel={cta.isExternal ? "noopener noreferrer" : undefined} data-cursor-magnetic data-cursor-text={cta.tool === 'posh' ? "RSVP" : "ACCESS"} className={`group relative flex items-center justify-center gap-4 px-10 py-5 text-[12px] sm:text-[13px] md:text-[14px] transition-all duration-500 w-full sm:w-auto rounded-none ${cta.tool === 'posh' ? 'cta-posh' : cta.tool === 'laylo' ? 'cta-laylo' : 'cta-fillout'}`}>
                    <span className="relative z-10 flex items-center gap-3">
                      {cta.tool === 'posh' ? <Ticket className="w-4 h-4" /> : cta.tool === 'laylo' ? <Lock className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      {cta.label}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>
                </MagneticButton>
                <MagneticButton strength={0.25}>
                  <Link href={secondaryCtaHref} className="cta-ghost group relative flex items-center justify-center gap-3 px-8 py-4 transition-all duration-500 w-full sm:w-auto">
                    <span className="relative z-10 flex items-center gap-2">
                      {secondaryCtaLabel}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </MagneticButton>
              </div>
            </>
          )}
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
                <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20">Countdown:</span>
                <CountdownDisplay target={targetDate} />
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
