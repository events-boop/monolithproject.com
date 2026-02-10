import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function MovementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="movement"
      ref={ref}
      className="relative section-padding bg-sand overflow-hidden"
    >
      <div className="absolute inset-0 atmo-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.08),transparent_34%),radial-gradient(circle_at_82%_78%,rgba(224,90,58,0.12),transparent_36%)] pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute right-0 top-0 bottom-0 w-[52%] opacity-[0.06] blur-[1px]"
          style={{
            backgroundImage:
              "linear-gradient(to left, rgba(255,255,255,0.16), rgba(255,255,255,0.08) 22%, transparent 68%), url('/images/autograf-recap.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="absolute left-0 bottom-0 h-[44%] w-[44%] opacity-[0.05] blur-[0.8px]"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgba(255,255,255,0.18), transparent 55%), url('/images/lazare-recap.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-serif italic text-lg text-clay mb-4 block">
              What we're building
            </span>
            <h2 className="font-display text-section-title tracking-wide text-charcoal mb-6">
              NOT JUST EVENTS.
              <br />
              <span className="text-clay">A COLLECTIVE.</span>
            </h2>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link href="/#schedule">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-pill-dark"
                >
                  See Upcoming Events
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </a>
              </Link>
              <Link href="/about">
                <a className="group inline-flex items-center gap-2 text-xs text-stone hover:text-clay transition-colors font-bold tracking-widest uppercase cursor-pointer">
                  Our Story
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </a>
              </Link>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <p className="text-lg text-charcoal/90 leading-relaxed">
              The Monolith Project is an events collective out of Chicago. We put on shows
              where the music matters, the crowd is part of it, and you leave feeling like
              you were actually there — not just watching through a screen.
            </p>

            <p className="text-base text-stone leading-relaxed">
              Two event series run under the collective. Chasing Sun(Sets) brings sunset
              rooftop energy with afro house and organic sounds. Untold Story goes deep —
              late-night, intimate, 360-degree sound where the DJ tells the story.
            </p>

            <div className="pt-6 border-t border-charcoal/10 rounded-xl bg-white/25 backdrop-blur-[2px] px-4 pb-4">
              <p className="font-serif italic text-lg text-charcoal/70 leading-relaxed">
                "We believe music carries emotion. We believe gathering should feel shared.
                We believe in rhythm, story, and togetherness."
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {["Community", "Music", "Togetherness", "Chicago", "Real Moments"].map(
                (value, index) => (
                  <motion.span
                    key={value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-charcoal/20 text-stone hover:border-clay hover:text-clay transition-colors"
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
