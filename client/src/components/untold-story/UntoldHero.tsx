import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import { POSH_TICKET_URL } from "@/data/events";
import { violet, cyan } from "./constants";

const heroSlides = ["/images/untold-story-hero-post1.webp"];

export default function UntoldHero() {
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end pb-32 pt-48 px-6 overflow-hidden">
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
              className="w-full h-full object-cover object-[80%_center]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060F] via-[#06060F]/40 to-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06060F] via-[#06060F]/60 to-transparent z-10" />
      </div>

      {/* Subtle purple glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[150px] pointer-events-none z-10"
        style={{ background: `radial-gradient(circle, ${violet}, transparent)` }}
      />

      <div className="container max-w-7xl mx-auto relative z-20">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <UntoldButterflyLogo className="w-20 h-20 mb-8 text-[#8B5CF6]" glow />
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: cyan }}>
                Series 02
              </span>
              <div className="h-px w-12 bg-white/20" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-white/50">Chicago</span>
            </div>

            <h1 className="font-display text-[clamp(4rem,15vw,11rem)] leading-[0.85] uppercase text-white mb-8 tracking-tight-display mix-blend-overlay opacity-90">
              UNTOLD
              <br />
              STORY
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <a href={POSH_TICKET_URL} target="_blank" rel="noopener noreferrer">
                <div
                  className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center gap-3 cursor-pointer text-white rounded-full"
                  style={{ background: `linear-gradient(135deg, ${violet}, ${cyan})` }}
                >
                  GET TICKETS <ArrowUpRight size={16} />
                </div>
              </a>
              <span className="font-mono text-xs text-white/50 tracking-widest hidden sm:block">
                Tickets moving fast.
              </span>
            </div>

            <p className="max-w-xl text-white/80 text-xl leading-relaxed font-light mb-10 drop-shadow-lg">
              <span className="text-white font-medium">Late night. Intimate rooms. 360 sound.</span> The story is told
              through the music — no narrative, no script, just what happens when the lights go down.
            </p>

            {heroSlides.length > 1 && (
              <div className="flex gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroSlideIndex(idx)}
                    className={`h-1 transition-all duration-500 rounded-full ${idx === heroSlideIndex ? "w-12 bg-white" : "w-4 bg-white/20 hover:bg-white/40"}`}
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
