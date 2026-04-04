import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import MagneticButton from "@/components/MagneticButton";
import { ScheduledEvent } from "@/data/events";
import ConversionCTA from "@/components/ConversionCTA";

const heroSlides = [
  "/images/untold-story-juany-deron.webp",
  "/images/untold-story-hero-post1.webp"
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
    <section className="relative min-h-screen flex flex-col justify-end pb-32 hero-shell-start px-6 overflow-hidden">
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
            <img
              src={heroSlides[heroSlideIndex]}
              alt="Untold Story Atmosphere"
              fetchPriority={heroSlideIndex === 0 ? "high" : "auto"}
              loading={heroSlideIndex === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover object-[80%_center]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Giant Butterfly (Elements of butterfly in the background) */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-10 hidden lg:flex items-center justify-center opacity-40 mix-blend-screen overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <UntoldButterflyLogo className="w-full h-full text-[#8B5CF6]/60" glow />
        </motion.div>
      </div>

      {/* Subtle purple glow above the mask */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.25] blur-[120px] pointer-events-none z-10 bg-[#8B5CF6]"
      />

      {/* Ordinary Content Layer */}
      <div className="container max-w-7xl mx-auto relative z-30">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 flex flex-col"
          >
            <UntoldButterflyLogo className="w-20 h-20 mb-8 text-[#8B5CF6]" glow />
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 w-full md:w-auto">
              <ConversionCTA 
                event={event}
                size="lg"
                showUrgency={true}
              />
              <span className="font-mono text-xs text-white/50 tracking-widest hidden sm:block">
                {event?.status === 'on-sale' ? "Tickets moving fast." : "Space is extremely limited."}
              </span>
            </div>

            <p className="max-w-xl text-white/80 text-xl leading-relaxed font-light mb-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              <span className="text-white font-medium drop-shadow-lg">Late night. Intimate rooms. 360 sound.</span> The story is told
              through the music — no narrative, no script, just what happens when the lights go down.
            </p>

            {heroSlides.length > 1 && (
              <div className="flex gap-2 relative z-30">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlideIndex(idx)}
                    className={`h-1 transition-all duration-500 rounded-full ${idx === heroSlideIndex ? "w-12 bg-[#8B5CF6]" : "w-4 bg-white/30 hover:bg-white/60"}`}
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
