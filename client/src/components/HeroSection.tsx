import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, AudioLines, Sun, Ticket, Lock } from "lucide-react";
import { useEffect, useState, memo, useCallback } from "react";
import { useCountdown, padCountdown } from "@/hooks/useCountdown";
import VideoHeroSlider, { Slide } from "./VideoHeroSlider";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import JsonLd from "@/components/JsonLd";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import KineticDecryption from "./KineticDecryption";
import WordScrubReveal from "./ui/WordScrubReveal";
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
  isTicketOnSale,
} from "@/lib/siteExperience";
import { getEventCta, getEventDetailsHref } from "@/lib/cta";
import ConversionCTA from "./ConversionCTA";

const heroPosterImage = getResponsiveImage("heroMonolith");
const heroUntoldImage = getResponsiveImage("untoldStoryHero");
const heroSunsetsImage = getResponsiveImage("chasingSunsets");
const heroEranIntlImage = getResponsiveImage("eranHershInternational");
const heroEranPortraitImage = getResponsiveImage("eranHershPortraitReal");
const heroAutografImage = getResponsiveImage("autografRecap");

/** Each slide maps to an optional event for the banner. null = show the primary featured event. */
interface SlideBannerInfo {
  eventId: string | null;
  label: string;
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

/** Maps each slide index to the event it represents. null = use the hero featured event. */
const SLIDE_EVENT_MAP: SlideBannerInfo[] = [
  { eventId: null, label: "THE MONOLITH PROJECT" },        // 0: video
  { eventId: "us-s3e3", label: "ERAN HERSH" },             // 1: eran hersh international
  { eventId: "us-s3e3", label: "ERAN HERSH" },             // 2: eran hersh portrait
  { eventId: null, label: "UNTOLD STORY" },                 // 3: untold story
  { eventId: "css-jul04", label: "CHASING SUN(SETS)" },     // 4: chasing sunsets / july 4th
  { eventId: null, label: "AUTOGRAF" },                     // 5: autograf archive
];

const HERO_SUBHEAD =
  "Recurring music experiences, radio, and archive from Chicago.";

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

export default function HeroSection() {
  const featuredEvent = getExperienceEvent("hero");
  const eranEvent = getEventById("us-s3e3");
  const july4Event = getEventById("css-jul04");

  const [activeSlide, setActiveSlide] = useState(0);
  const handleSlideChange = useCallback((index: number) => setActiveSlide(index), []);

  // Resolve which event to show in the banner based on the active slide
  const slideInfo = SLIDE_EVENT_MAP[activeSlide] ?? SLIDE_EVENT_MAP[0];
  const bannerEvent = slideInfo.eventId
    ? getEventById(slideInfo.eventId)
    : featuredEvent;

  const targetDate = getEventStartTimestamp(bannerEvent);
  const { isExpired } = useCountdown(targetDate);
  const reduceMotion = useReducedMotion();
  const headline = bannerEvent?.headline || bannerEvent?.title || slideInfo.label;
  const eyebrow = getEventEyebrow(bannerEvent);
  const isJuly4thEvent = headline.toUpperCase().includes("JULY 4") || headline.toUpperCase().includes("INDEPENDENCE");

  const [headlineCycle, setHeadlineCycle] = useState("MONOLITH");

  useEffect(() => {
    setHeadlineCycle("MONOLITH");
  }, []);

  const structuredData = featuredEvent ? <JsonLd data={buildScheduledEventSchema(featuredEvent, "/")} /> : null;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, reduceMotion ? 0 : 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  return (
    <section id="hero" className="relative h-screen flex flex-col overflow-hidden bg-black">
      {structuredData}

      {/* Cinematic Background Layer — always video slider */}
      <motion.div style={{ y, opacity, scale }} className="absolute inset-0 z-0 h-[115%] -top-[7%] hero-bg">
        <VideoHeroSlider slides={HERO_SLIDES} onSlideChange={handleSlideChange} />
      </motion.div>

      {/* Architectural HUD Grid Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4vw_4vw]" />
        <motion.div
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>

      {/* Main Impact Visuals (Center Focused) — always MONOLITH branding */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center w-full pointer-events-none">
        <div className="w-full flex flex-col items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="mb-8 lg:mb-16 relative">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-px w-8 md:w-20 bg-white/10" />
              <h2 className="font-mono text-[11px] md:text-sm uppercase tracking-[0.8em] text-white/40">{getEventEyebrow(featuredEvent) || "Chicago Music Project"}</h2>
              <div className="h-px w-8 md:w-20 bg-white/10" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center justify-center text-white relative z-10">
            <motion.h1
              key={headlineCycle}
              className={cn(
                "font-heavy text-[clamp(2.5rem,15vw,14rem)] leading-[0.8] uppercase drop-shadow-[0_0_80px_rgba(255,255,255,0.08)] pointer-events-auto",
                headlineCycle === "JULY 4TH" ? "july-4th-gradient" : "text-white"
              )}
            >
              <KineticDecryption text={headlineCycle} />
            </motion.h1>
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "120%", opacity: 1 }} transition={{ delay: 0.8, duration: 2, ease: [0.16, 1, 0.3, 1] }} className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-6 lg:my-10" />
            <span className="font-mono text-[clamp(0.8rem,5vw,3rem)] leading-[1] tracking-[0.5em] uppercase text-white/90">PROJECT</span>
            <BrandTranslatorLabel className="mt-5" tone="neutral">Chicago Cultural House</BrandTranslatorLabel>
            <RevealText
              as="p"
              className="mt-8 text-white/50 max-w-lg font-mono text-[10px] md:text-sm tracking-[0.4em] uppercase text-center"
              delay={1.8}
              stagger={0.04}
            >
              {HERO_SUBHEAD}
            </RevealText>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM BANNER — syncs with active slide */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 w-full z-40 bg-black/50 backdrop-blur-2xl border-t border-white/8 hidden md:flex"
      >
        <div className="container mx-auto max-w-screen-2xl px-8 lg:px-12 py-4 flex items-center justify-between gap-8 pointer-events-auto">

          {/* LEFT: Event identity — changes with slide */}
          <div className="flex items-center gap-6 min-w-0">
            <div className="w-[2px] h-10 bg-primary/50 shrink-0" />
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase">
                  {bannerEvent?.date ?? "Coming Soon"}
                </span>
              </div>
              <h3 className={cn(
                "font-display text-lg lg:text-2xl font-[1000] uppercase tracking-tight leading-none truncate",
                isJuly4thEvent ? "july-4th-gradient" : "text-white"
              )}>
                {headline}
              </h3>
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/30 uppercase truncate">
                {eyebrow} {bannerEvent?.venue ? `@${bannerEvent.venue}` : ""}
              </span>
            </div>
          </div>

          {/* CENTER: Countdown (desktop only) */}
          {targetDate && !isExpired && (
            <div className="hidden lg:flex items-center gap-6 shrink-0">
              <div className="h-8 w-px bg-white/10" />
              <CountdownDisplay target={targetDate!} />
              <div className="h-8 w-px bg-white/10" />
            </div>
          )}

          {/* RIGHT: Dual event CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            {eranEvent && (
              <ConversionCTA
                event={eranEvent}
                size="md"
                showUrgency={true}
                variant={slideInfo.eventId === "us-s3e3" ? "primary" : "outline"}
              />
            )}
            {july4Event && (
              <ConversionCTA
                event={july4Event}
                size="md"
                showUrgency={true}
                variant={slideInfo.eventId === "css-jul04" || !slideInfo.eventId ? "primary" : "outline"}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* MOBILE HUD INTERFACE */}
      <div className="md:hidden absolute bottom-0 left-0 w-full p-4 z-40 bg-gradient-to-t from-black to-transparent pointer-events-none">
         <div className="flex flex-col gap-3 pointer-events-auto">
            {eranEvent && (
              <ConversionCTA
                event={eranEvent}
                size="lg"
                showUrgency={true}
                variant="outline"
              />
            )}
            {july4Event && (
              <ConversionCTA
                event={july4Event}
                size="lg"
                showUrgency={true}
              />
            )}
         </div>
      </div>
    </section>
  );
}
