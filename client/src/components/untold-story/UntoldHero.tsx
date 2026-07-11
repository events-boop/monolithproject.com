import { useState, useEffect, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import type { ScheduledEvent } from "@shared/events/types";
import ConversionCTA from "@/components/ConversionCTA";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { getEventWindowStatus } from "@/lib/siteExperience";
import SplitText from "@/components/ui/SplitText";
import ResponsiveImage from "@/components/ResponsiveImage";

const heroSlides = [
  getResponsiveImage("untoldStoryPoster"),
  getResponsiveImage("untoldStoryHero"),
];

export default function UntoldHero({ event }: { event?: ScheduledEvent }) {
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const inView = useInView(heroRef, { margin: "-20% 0px -20% 0px" });
  const reduceMotion = useReducedMotion();
  const idleMotion = !reduceMotion && inView;

  useEffect(() => {
    if (heroSlides.length <= 1 || !idleMotion) return;
    const timer = window.setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [idleMotion]);

  const headlineLines = ["UNTOLD", "STORY"];
  const featuredHeadline = event?.headline || event?.title;
  const isArchiveMode = !event || getEventWindowStatus(event) === "past";

  return (
    <section
      ref={heroRef}
      className="untold-etched-hero relative screen-shell-stable flex flex-col justify-center sm:justify-end pb-16 sm:pb-32 pt-24 sm:pt-0 hero-shell-start px-6 overflow-hidden min-h-[100dvh]"
    >
      {/* Full Screen Background Rotator */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlideIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <ResponsiveImage
              src={heroSlides[heroSlideIndex].src}
              sources={heroSlides[heroSlideIndex].sources}
              sizes={heroSlides[heroSlideIndex].sizes}
              alt="Untold Story Atmosphere"
              fetchPriority={heroSlideIndex === 0 ? "high" : "auto"}
              loading={heroSlideIndex === 0 ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover object-[80%_center]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Giant Butterfly (Elements of butterfly in the background) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-10 hidden lg:flex items-center justify-center opacity-40 mix-blend-screen overflow-hidden">
        <motion.div
          animate={
            idleMotion
              ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={
            idleMotion
              ? { duration: 8, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
        >
          <UntoldButterflyLogo
            className="w-full h-full text-[#22D3EE]/60"
            glow
          />
        </motion.div>
      </div>

      {/* Subtle cyan glow above the mask */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.25] blur-[120px] pointer-events-none z-10 bg-[#22D3EE]" />

      {/* Ordinary Content Layer */}
      <div className="container layout-wide relative z-30 mt-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 flex flex-col"
          >
            <UntoldButterflyLogo
              className="w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 text-[#22D3EE]"
              glow
              animateIn
            />
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-untold-cyan">
                {isArchiveMode ? "Four Chapters / Archive" : event?.episode}
              </span>
              <div className="h-px w-8 sm:w-12 bg-white/20" />
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/70">
                {event?.location || "Chicago"}
              </span>
            </div>

            {/* Visible Title */}
            <h1 className="untold-hero-title font-display text-[clamp(3.5rem,12vw,10.25rem)] leading-[0.85] uppercase text-white mb-6 sm:mb-8 tracking-tight-display drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              {headlineLines.map((line, i) => (
                <SplitText
                  key={i}
                  text={line}
                  className="block"
                  initialDelay={0.2 + i * 0.15}
                />
              ))}
            </h1>
            {isArchiveMode ? (
              <p className="max-w-2xl font-display text-[clamp(1.2rem,3vw,2.1rem)] leading-[0.98] uppercase text-[#22D3EE] mb-6 sm:mb-8 drop-shadow-[0_0_18px_rgba(0,0,0,0.75)] hyphens-none break-keep">
                Four chapters deep. The archive stays open.
              </p>
            ) : featuredHeadline ? (
              <p className="max-w-2xl font-display text-[clamp(1.2rem,3vw,2.1rem)] leading-[0.98] uppercase text-[#22D3EE] mb-6 sm:mb-8 drop-shadow-[0_0_18px_rgba(0,0,0,0.75)] hyphens-none break-keep">
                {featuredHeadline}
              </p>
            ) : null}
            <BrandTranslatorLabel className="mb-6 sm:mb-8" tone="nocturne">
              A Late-Night Monolith Series
            </BrandTranslatorLabel>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-10 w-full md:w-auto">
              {isArchiveMode ? (
                <MagneticButton strength={0.28}>
                  <a
                    href="#untold-records"
                    className="btn-pill-untold btn-pill-wide"
                  >
                    Enter the Archive
                    <ArrowRight size={14} />
                  </a>
                </MagneticButton>
              ) : (
                <ConversionCTA event={event} size="lg" showUrgency={true} />
              )}
              <MagneticButton strength={0.22}>
                <a
                  href={isArchiveMode ? "#untold-updates" : "#untold-records"}
                  className="cta-ghost group"
                >
                  {isArchiveMode ? "Get Untold Updates" : "View Records"}
                  <ArrowRight
                    size={14}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </a>
              </MagneticButton>
            </div>

            <p className="max-w-xl text-white/80 text-xl leading-relaxed font-light mb-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              {isArchiveMode
                ? "A late-night series built for deeper house music, tighter rooms, and a more immersive dancefloor. The next coordinates arrive when the room is right."
                : "A late-night series built for deeper house music, tighter energy, and a more immersive dancefloor."}
            </p>

            {heroSlides.length > 1 && (
              <div className="flex gap-2 relative z-30">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlideIndex(idx)}
                    className={`h-1 transition-all duration-500 rounded-full ${idx === heroSlideIndex ? "w-12 bg-[#22D3EE]" : "w-4 bg-white/30 hover:bg-white/60"}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
