/*
  DESIGN: Cosmic Mysticism - The Movement section
  - Brand philosophy and story
  - Asymmetric layout with geometric accents
*/

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function MovementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="movement"
      ref={ref}
      className="relative section-padding bg-background"
    >
      {/* Geometric accent line */}
      <div className="absolute left-0 top-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              01 — Programming & Curation
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide text-foreground mb-6">
              MORE THAN EVENTS.
              <br />
              <span className="text-primary">A MOVEMENT.</span>
            </h2>

            {/* Decorative element */}
            <div className="flex items-center gap-4 mt-8">
              <div className="w-16 h-[1px] bg-primary" />
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <circle cx="20" cy="20" r="18" />
                <circle cx="20" cy="20" r="8" />
                <line x1="20" y1="2" x2="20" y2="12" />
                <line x1="20" y1="28" x2="20" y2="38" />
                <line x1="2" y1="20" x2="12" y2="20" />
                <line x1="28" y1="20" x2="38" y2="20" />
              </svg>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-foreground/90 leading-relaxed">
              The Monolith Project exists to restore meaning to the spaces where we gather.
              In a world of fleeting moments and fractured attention, we create experiences
              that feel timeless, immersive, and emotionally resonant.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed">
              The Monolith is a metaphor — a portal, a frequency, a guide. Each chapter
              is part of a collective mythology, designed to unify communities through
              intentional sound, elevated design, and story-driven experiences.
            </p>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground italic">
                "We believe music carries emotion. We believe gathering should feel shared.
                We believe in rhythm, story, and togetherness."
              </p>
            </div>

            {/* Values */}
            <div className="flex flex-wrap gap-4 pt-4">
              {["Authenticity", "Togetherness", "Intention", "Artistry", "Timelessness"].map(
                (value, index) => (
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {value}
                  </motion.span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
