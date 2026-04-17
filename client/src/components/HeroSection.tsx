import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useEffect, useState, memo, useCallback, useRef } from "react";
import { useCountdown, padCountdown } from "@/hooks/useCountdown";
import VideoHeroSlider, { Slide } from "./VideoHeroSlider";
import JsonLd from "@/components/JsonLd";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import KineticDecryption from "./KineticDecryption";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { buildScheduledEventSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import RevealText from "./RevealText";
import {
  getEventById,
  getEventEyebrow,
  getEventStartTimestamp,
  getEventVenueLabel,
  getExperienceEvent,
  getSeriesEvents,
} from "@/lib/siteExperience";
import ConversionCTA from "./ConversionCTA";

const heroPosterImage = getResponsiveImage("videoPoster1");
const heroUntoldImage = getResponsiveImage("untoldStoryHero");
const heroSunsetsImage = getResponsiveImage("chasingSunsets");
const heroEranIntlImage = getResponsiveImage("eranHershInternational");
const heroEranPortraitImage = getResponsiveImage("eranHershPortraitReal");
const heroAutografImage = getResponsiveImage("autografRecap");

/** Each slide maps to banner metadata and an optional event context. */
interface SlideBannerInfo {
  eventId?: string;
  fallbackToFeaturedEvent?: boolean;
  label: string;
  eyebrow?: string;
  venueLabel?: string;
  dateLabel?: string;
}

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
    src: heroEranIntlImage.src,
    sources: heroEranIntlImage.sources,
    sizes: heroEranIntlImage.sizes,
    alt: "Eran Hersh",
    caption: "ERAN HERSH | MAY 16 2026",
  },
  {
    type: "image",
    src: heroEranPortraitImage.src,
    sources: heroEranPortraitImage.sources,
    sizes: heroEranPortraitImage.sizes,
    alt: "Eran Hersh",
    caption: "ERAN HERSH PORTRAIT",
  },
  {
    type: "image",
    src: heroUntoldImage.src,
    sources: heroUntoldImage.sources,
    sizes: heroUntoldImage.sizes,
    alt: "Untold Story Archive",
    caption: "ARCHIVE | UNTOLD STORY SEASON III",
  },
  {
    type: "image",
    src: heroSunsetsImage.src,
    sources: heroSunsetsImage.sources,
    sizes: heroSunsetsImage.sizes,
    alt: "Chasing Sun(Sets)",
    caption: "SUMMER '26 | CHASING SUN(SETS)",
  },
  {
    type: "image",
    src: heroAutografImage.src,
    sources: heroAutografImage.sources,
    sizes: heroAutografImage.sizes,
    alt: "Autograf Archive",
    caption: "ARCHIVE | SPECIAL EVENT AUTOGRAF",
  },
];

/** Maps each hero slide to the banner state it should drive. */
const SLIDE_EVENT_MAP: SlideBannerInfo[] = [
  { fallbackToFeaturedEvent: true, label: "THE MONOLITH PROJECT" }, // 0: video
  { eventId: "us-s3e3", label: "ERAN HERSH" }, // 1: eran hersh international
  { eventId: "us-s3e3", label: "ERAN HERSH" }, // 2: eran hersh portrait
  {
    label: "UNTOLD STORY",
    eyebrow: "Archive Signal",
    venueLabel: "Chicago Late-Night Series",
    dateLabel: "Season III Archive",
  }, // 3: untold story
  { eventId: "css-jul04", label: "CHASING SUN(SETS)" }, // 4: chasing sunsets / july 4th
  {
    label: "AUTOGRAF",
    eyebrow: "Archive Signal",
    venueLabel: "Special Event Archive",
    dateLabel: "Featured Archive",
  }, // 5: autograf archive
];

const HERO_SUBHEAD =
  "Monolith is the root. Chasing Sun(Sets) runs the daytime — rooftops in summer, the Radio Show worldwide. Untold Story runs the night. Same city, same standard, one project.";

const CountdownDisplay = memo(function CountdownDisplay({ target }: { target: number }) {
  const { days, hours, minutes, seconds } = useCountdown(target);

  return (
    <div className="flex items-center gap-4 tabular-nums">
      {[
        { value: days, label: "D" },
        { value: hours, label: "H" },
        { value: minutes, label: "M" },
        { value: seconds, label: "S" },
      ].map((unit, i) => (
        <div key={unit.label} className="flex flex-row items-center gap-1.5 leading-none">
          <span className="font-mono text-base md:text-lg font-[900] tracking-tighter text-white">
            {padCountdown(unit.value)}
          </span>
          <span className="font-mono text-[10px] font-bold text-white/30 pt-0.5">{unit.label}</span>
          {i < 3 && <span className="text-white/20 mx-0.5">:</span>}
        </div>
      ))}
    </div>
  );
});

/** 
 * FloatingEventCard:
 * The immersive, interactive conversion point for the hero section.
 * Syncs with the active slide to feature live shows, radio episodes, or archives.
 */
function FloatingEventCard({ 
  event, 
  slideInfo,
  dateLabel,
  venueLabel,
  eyebrow,
  isJuly4thEvent,
  contextualFallbackAction
}: { 
  event?: any; 
  slideInfo: SlideBannerInfo;
  dateLabel: string;
  venueLabel?: string;
  eyebrow?: string;
  isJuly4thEvent: boolean;
  contextualFallbackAction?: { href: string; label: string };
}) {
  const headline = event?.headline || event?.title || slideInfo.label;
  const isLive = event?.status === "on-sale";
  const bgImage = event?.image || "/images/hero-monolith.webp";

  return (
    <motion.div
      key={headline}
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -20, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[420px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] group/card"
    >
      {/* Immersive Background Window */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-40 group-hover/card:scale-125 transition-transform duration-[2s]" 
          style={{ backgroundImage: `url(${bgImage})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col items-start gap-4">
        {/* Status Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {isLive && (
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              On Sale
            </span>
          )}
        </div>

        {/* Narrative Metadata */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] md:text-[10px] tracking-[0.3em] text-[var(--monolith-red)] uppercase font-bold">
              {eyebrow || "Latest Transmission"}
            </span>
          </div>
          <h3 className={cn(
            "font-display text-2xl md:text-3xl font-[1000] uppercase tracking-tighter leading-[0.9] text-white text-balance",
            isJuly4thEvent && "july-4th-gradient"
          )}>
            {headline}
          </h3>
          <div className="flex items-center gap-3 mt-1 opacity-60">
             <span className="font-mono text-[10px] md:text-[10px] tracking-[0.2em] text-white uppercase">
               {dateLabel} {venueLabel ? `// @${venueLabel}` : ""}
             </span>
          </div>
        </div>

        {/* CTA Engine */}
        <div className="w-full mt-4">
          {event ? (
            <ConversionCTA
              event={event}
              size="lg"
              showUrgency={false}
              variant="experiential"
              className="w-full"
            />
          ) : contextualFallbackAction ? (
            <Link href={contextualFallbackAction.href} asChild>
              <a className="flex h-12 w-full items-center justify-center rounded-none border border-white/20 bg-white text-[11px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-[var(--monolith-red)] hover:border-transparent">
                {contextualFallbackAction.label}
              </a>
            </Link>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const featuredEvent = getExperienceEvent("hero");

  const [activeSlide, setActiveSlide] = useState(0);
  const handleSlideChange = useCallback((index: number) => setActiveSlide(index), []);

  // Resolve which event to show in the banner based on the active slide
  const slideInfo = SLIDE_EVENT_MAP[activeSlide] ?? SLIDE_EVENT_MAP[0];
  const bannerEvent = slideInfo.fallbackToFeaturedEvent
    ? featuredEvent
    : slideInfo.eventId
      ? getEventById(slideInfo.eventId)
      : undefined;

  const sunsetsFallback = getSeriesEvents("chasing-sunsets")[0];
  const untoldFallback = getSeriesEvents("untold-story")[0];
  
  const targetDateFallback = slideInfo.label.includes("SUN(SETS)") 
    ? sunsetsFallback 
    : slideInfo.label.includes("UNTOLD") 
      ? untoldFallback 
      : featuredEvent;

  const targetDate = getEventStartTimestamp(bannerEvent) || getEventStartTimestamp(targetDateFallback);
  const { isExpired } = useCountdown(targetDate);
  const reduceMotion = useReducedMotion();
  const headline = bannerEvent?.headline || bannerEvent?.title || slideInfo.label;
  const eyebrow = bannerEvent ? getEventEyebrow(bannerEvent) : slideInfo.eyebrow;
  const dateLabel = bannerEvent?.date ?? slideInfo.dateLabel ?? "Coming Soon";
  const venueLabel = bannerEvent ? getEventVenueLabel(bannerEvent) : slideInfo.venueLabel;
  const isJuly4thEvent = headline.toUpperCase().includes("JULY 4") || headline.toUpperCase().includes("INDEPENDENCE");
  const contextualFallbackAction =
    !bannerEvent && activeSlide === 3
      ? { href: "/story", label: "Explore Untold Story" }
      : !bannerEvent && activeSlide === 5
        ? { href: "/archive", label: "See The Archive" }
        : undefined;

  const [headlineCycle, setHeadlineCycle] = useState("MONOLITH");

  useEffect(() => {
    setHeadlineCycle("MONOLITH");
  }, []);

  const structuredData = featuredEvent ? <JsonLd data={buildScheduledEventSchema(featuredEvent, "/")} /> : null;
  const heroRef = useRef<HTMLElement | null>(null);
  const heroInView = useInView(heroRef, { margin: "-20% 0px -20% 0px" });
  const idleMotion = !reduceMotion && heroInView;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, reduceMotion ? 0 : 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);
  const scale = useTransform(scrollY, [0, 300], [1, reduceMotion ? 1 : 1.05]);

  return (
    <div className="bg-black flex h-[100dvh] flex-col">
      <section
        ref={heroRef}
        id="hero"
        className="relative h-full overflow-hidden bg-black md:screen-shell-stable"
      >
        {structuredData}

        {/* Cinematic Background Layer — always video slider */}
        <motion.div style={{ y, opacity, scale }} className="absolute inset-0 z-0 h-[115%] -top-[7%] hero-bg">
          <VideoHeroSlider slides={HERO_SLIDES} onSlideChange={handleSlideChange} />
        </motion.div>

        {/* Architectural HUD Grid Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4vw_4vw]" />
          <motion.div
            animate={idleMotion ? { top: ["-10%", "110%"] } : { top: "-10%" }}
            transition={idleMotion ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0 }}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>

        {/* 
            FLOATING EXPERIENTIAL CARD (The "Dope" Card) 
            Positioned as a persistent, high-fidelity overlay.
        */}
        <div className="absolute inset-x-0 bottom-0 z-50 p-6 md:p-12 pointer-events-none flex justify-center md:justify-end md:bottom-auto md:top-[var(--shell-page-top-hero)] md:h-full md:items-center">
          <div className="pointer-events-auto">
             <FloatingEventCard 
                event={bannerEvent}
                slideInfo={slideInfo}
                dateLabel={dateLabel}
                venueLabel={venueLabel}
                eyebrow={eyebrow}
                isJuly4thEvent={isJuly4thEvent}
                contextualFallbackAction={contextualFallbackAction}
             />
          </div>
        </div>

        {/* Main Impact Visuals (Center Focused) — always MONOLITH branding */}
        <div className="absolute inset-0 z-30 flex w-full flex-col items-center justify-start px-6 pb-16 pt-[calc(var(--shell-page-top-hero)+2rem)] text-center pointer-events-none md:justify-center md:p-6 md:pr-[500px]">
          <div className="flex w-full flex-col items-center justify-start md:items-start md:text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="mb-6 relative md:mb-12">
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <h2 className="font-mono text-[11px] md:text-sm uppercase tracking-[0.8em] text-white/40">{getEventEyebrow(featuredEvent) || "Chicago Music Project"}</h2>
                <div className="h-px w-8 md:w-20 bg-white/10" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative z-10 flex flex-col items-center md:items-start text-white">
              <motion.h1
                key={headlineCycle}
                className={cn(
                  "font-heavy text-[clamp(2.5rem,15.5vw,11.5rem)] leading-[0.8] uppercase drop-shadow-[0_0_80px_rgba(255,255,255,0.08)] pointer-events-auto",
                  headlineCycle === "JULY 4TH" ? "july-4th-gradient" : "text-white"
                )}
              >
                <KineticDecryption text={headlineCycle} />
              </motion.h1>
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }} className="h-px bg-gradient-to-r from-white/30 to-transparent my-6 lg:my-8" />
              <span className="font-mono text-[clamp(0.8rem,5vw,2.5rem)] leading-[1] tracking-[0.5em] uppercase text-white/90">PROJECT</span>
              <BrandTranslatorLabel className="mt-5" tone="neutral">Root Architecture / Events / Radio / Research</BrandTranslatorLabel>
              <RevealText
                as="p"
                className="mt-6 max-w-sm text-center md:text-left font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 md:mt-8 md:max-w-md md:text-sm md:tracking-[0.4em]"
                delay={1.8}
                stagger={0.04}
              >
                {HERO_SUBHEAD}
              </RevealText>
            </motion.div>
          </div>
        </div>

        {/* Countdown HUD (Persistent Desktop) */}
        {targetDate && !isExpired && (targetDate - Date.now() < 31536000000) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute top-40 left-12 z-40 hidden xl:flex flex-col gap-4 text-left"
          >
            <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase italic">Synchronization Imminent</span>
            <CountdownDisplay target={targetDate!} />
          </motion.div>
        )}
      </section>
    </div>
  );
}

