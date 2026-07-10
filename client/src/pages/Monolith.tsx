import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import WordScrubReveal from "@/components/ui/WordScrubReveal";

const manifestoLines = [
  "We belong to the dusk and the deep.",
  "We assemble when the frequency aligns.",
  "We construct a temple of sound and shadow.",
  "We select curation over easy validation.",
  "We preserve Chicago as the epicentre of return.",
  "We are The Monolith Project.",
];

export default function Monolith() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.05]);

  return (
    <div
      ref={containerRef}
      className="bg-black text-white selection:bg-white/20 relative min-h-screen overflow-x-hidden"
    >
      <SEO
        title="The Monolith | Manifesto & Concept"
        description="The Monolith Project is the Chicago-rooted platform connecting Chasing Sun(Sets), Untold Story, and the spaces still taking form around them."
        absoluteTitle
        canonicalPath="/monolith"
      />

      {/* Film grain / ambient overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none mix-blend-overlay opacity-[0.04]">
        <div className="absolute inset-0 bg-noise" />
      </div>

      <Navigation variant="dark" brand="monolith" />

      <main id="main-content" tabIndex={-1}>
        {/* Parallax Hero Section */}
        <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="absolute inset-0 w-full h-full transform-gpu"
          >
            <div className="absolute inset-0 bg-black/60 z-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-20" />

            {/* Visual element representing the Monolith */}
            <ResponsiveImage
              src="/images/hero-monolith.webp"
              alt="The Monolith Core Visual"
              priority
              sizes="100vw"
              loading="eager"
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>

          {/* Central Cosmic Glow */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="w-[85vw] h-[85vw] md:w-[65vw] md:h-[65vw] bg-[radial-gradient(circle_at_center,rgba(224,90,58,0.3)_0%,rgba(139,92,246,0.15)_35%,transparent_70%)] rounded-full blur-[50px]"
            />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pt-20 px-8 text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="mb-8"
            >
              <BrandTranslatorLabel
                tone="neutral"
                className="px-4 py-2 border border-white/10 rounded-full backdrop-blur-md"
              >
                Launch Signal / Forthcoming
              </BrandTranslatorLabel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.6, delay: 0.3 }}
              className="flex flex-col items-center gap-6"
            >
              <h1 className="font-monolith text-[clamp(2.5rem,8vw,8rem)] font-light leading-none uppercase tracking-[0.16em] text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                THE MONOLITH
              </h1>

              <p className="max-w-lg text-[10px] md:text-[12px] font-mono uppercase tracking-[0.3em] text-white/60 leading-relaxed">
                The platform beneath the lakefront, the late-night room, and the
                chapters still taking form.
              </p>
            </motion.div>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="font-mono text-[9px] uppercase tracking-[0.45em] text-white/70 mb-3 animate-pulse">
                Scroll to enter
              </span>
              <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </section>

        {/* Section 1: The Concept */}
        <section
          className="relative py-36 px-6 z-30 border-b border-white/5"
          id="story"
        >
          <div className="layout-default">
            <div className="grid gap-16 lg:grid-cols-12 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary block mb-4">
                  01 / Concept
                </span>
                <h2 className="font-monolith text-4xl lg:text-5xl uppercase tracking-wider text-white leading-tight">
                  The Portal
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-10">
                <WordScrubReveal
                  text="Nightlife should be sacred."
                  className="font-serif text-[clamp(2rem,5vw,4.2rem)] leading-[1.05] uppercase text-white/90 text-balance"
                />
                <WordScrubReveal
                  text="We believe a club night is not an industry transaction; it is a collaborative ritual. When the sound is exact, when the light is minimal, and when the crowd enters with intention, the room transitions from space into frequency."
                  className="text-lg md:text-xl font-light leading-relaxed text-white/60 text-balance"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Manifesto */}
        <section
          className="relative py-36 px-6 z-30 bg-neutral-950 border-b border-white/5"
          id="manifesto"
        >
          <div className="layout-default">
            <div className="grid gap-16 lg:grid-cols-12 items-start">
              <div className="lg:col-span-4 sticky top-36">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary block mb-4">
                  02 / Pillars
                </span>
                <h2 className="font-monolith text-4xl lg:text-5xl uppercase tracking-wider text-white leading-tight">
                  The Manifesto
                </h2>
                <div className="w-12 h-px bg-primary/40 mt-8" />
              </div>
              <div className="lg:col-span-8 space-y-16 lg:space-y-24">
                {manifestoLines.map((line, i) => (
                  <div key={i}>
                    <WordScrubReveal
                      text={line}
                      className="font-serif font-light italic text-[clamp(1.8rem,4vw,3.5rem)] text-white/80 leading-snug"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The active world */}
        <section
          className="relative py-36 px-6 z-30 border-b border-white/5"
          id="vision"
        >
          <div className="layout-default">
            <div className="grid gap-16 lg:grid-cols-12 items-start">
              <div className="lg:col-span-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary block mb-4">
                  03 / Core Expression
                </span>
                <h2 className="font-monolith text-4xl lg:text-5xl uppercase tracking-wider text-white leading-tight">
                  The Platform
                </h2>
              </div>
              <div className="lg:col-span-8 space-y-12">
                <p className="text-xl md:text-2xl font-light leading-relaxed text-white/70">
                  The Monolith Project is not another event series. It is the
                  platform that gives two active expressions a shared world:
                </p>
                <div className="grid gap-8 sm:grid-cols-3">
                  {[
                    {
                      title: "Monolith Project",
                      desc: "The parent signal. A platform taking shape around rooms, people, and cultural memory.",
                      href: "/monolith#manifesto",
                      label: "Launch Signal",
                    },
                    {
                      title: "Chasing Sun(Sets)",
                      desc: "The open-air expression. Lakefront daylight, golden hour, and a season moving from Chapter I into II and III.",
                      href: "/chasing-sunsets",
                      label: "Daylight",
                    },
                    {
                      title: "Untold Story",
                      desc: "The after-dark expression. Four chapters deep, with a tighter room and deeper late-night focus.",
                      href: "/story",
                      label: "After Dark",
                    },
                  ].map(branch => (
                    <div
                      key={branch.title}
                      className="border border-white/5 bg-white/[0.01] p-8 hover:bg-white/[0.02] transition-colors flex flex-col justify-between min-h-[220px]"
                    >
                      <div>
                        <h3 className="font-display text-xl uppercase tracking-wider text-white mb-4">
                          {branch.title}
                        </h3>
                        <p className="text-xs text-white/60 leading-relaxed font-light mb-6">
                          {branch.desc}
                        </p>
                      </div>
                      <Link href={branch.href} asChild>
                        <a className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-primary hover:text-white transition-colors">
                          {branch.label}{" "}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Return */}
        <section className="relative py-44 px-6 z-30 text-center flex flex-col items-center justify-center">
          <div className="layout-default max-w-3xl flex flex-col items-center gap-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#d4a853]">
              Join The Frequency
            </span>

            <h2 className="font-serif text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] uppercase text-white/90">
              The Room <br /> Is Waiting
            </h2>

            <p className="text-sm md:text-base text-white/60 leading-relaxed font-light max-w-md">
              Join the Lake List for the next Chasing Sun(Sets) release, Untold
              Story coordinates, and the signals that arrive before the public.
            </p>

            <div className="mt-6">
              <MagneticButton strength={0.3}>
                <a
                  href="/go/lakelist"
                  className="btn-pill-monolith flex items-center justify-center gap-2 px-12 py-5 text-[11px] font-black uppercase tracking-[0.25em]"
                >
                  Join the Lake List <ArrowUpRight className="w-4 h-4" />
                </a>
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
