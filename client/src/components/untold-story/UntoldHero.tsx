import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import type { ScheduledEvent } from "@shared/events/types";
import ConversionCTA from "@/components/ConversionCTA";
import { getResponsiveImage } from "@/lib/responsiveImages";

const heroSlides = [
  getResponsiveImage("eranHershPortraitReal"),
  getResponsiveImage("eranHershInternational"),
  getResponsiveImage("untoldStoryHero"),
];

export default function UntoldHero({ event }: { event?: ScheduledEvent }) {
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);

  const headlineLines = event ? event.title.split(" ") : ["UNTOLD", "STORY"];
  const hasTickets = !!event?.ticketUrl && event?.status === "on-sale";

  return (
    <section className="relative screen-shell-stable flex flex-col justify-end pb-32 hero-shell-start px-6 overflow-hidden">
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
            <picture>
              {heroSlides[heroSlideIndex].sources?.map((source, i) => (
                <source key={i} {...source} />
              ))}
              <img
                src={heroSlides[heroSlideIndex].src}
                alt="Untold Story Atmosphere"
                fetchPriority={heroSlideIndex === 0 ? "high" : "auto"}
                loading={heroSlideIndex === 0 ? "eager" : "lazy"}
                className="w-full h-full object-cover object-[80%_center]"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Giant Butterfly (Elements of butterfly in the background) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-10 hidden lg:flex items-center justify-center opacity-40 mix-blend-screen overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <UntoldButterflyLogo className="w-full h-full text-[#22D3EE]/60" glow />
        </motion.div>
      </div>

      {/* Subtle cyan glow above the mask */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.25] blur-[120px] pointer-events-none z-10 bg-[#22D3EE]"
      />

      {/* Ordinary Content Layer */}
      <div className="container layout-wide relative z-30">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 flex flex-col"
          >
            <UntoldButterflyLogo className="w-20 h-20 mb-8 text-[#22D3EE]" glow />
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-untold-cyan">
                {event?.episode || "Series 02"}
              </span>
              <div className="h-px w-12 bg-white/20" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/50">{event?.location || "Chicago"}</span>
            </div>

            {/* Visible Title */}
            <motion.h1
              initial={{ filter: "blur(12px)", opacity: 0, y: 30 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="font-display text-[clamp(4rem,15vw,11rem)] leading-[0.85] uppercase text-white mb-8 tracking-tight-display drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
              {headlineLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.h1>
            <BrandTranslatorLabel className="mb-8" tone="nocturne">
              A Late-Night Monolith Series
            </BrandTranslatorLabel>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-10 w-full md:w-auto">
              <ConversionCTA
                event={event}
                size="lg"
                showUrgency={true}
              />
              <MagneticButton strength={0.22}>
                <a
                  href="#untold-records"
                  className="cta-ghost flex items-center justify-center px-8 py-4"
                >
                  View Records
                  <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>
            </div>

            <p className="max-w-xl text-white/80 text-xl leading-relaxed font-light mb-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              A late-night series built for deeper house music, tighter energy, and a more immersive dancefloor.
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
