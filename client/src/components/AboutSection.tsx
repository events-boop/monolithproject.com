import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, Plus } from "lucide-react";
import WordScrubReveal from "@/components/ui/WordScrubReveal";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import { CTA_LABELS } from "@/lib/cta";
import { signalChirp } from "@/lib/SignalChirpEngine";

const manifestoLines = [
  "We build rooms worth returning to.",
  "We choose curation over noise.",
  "We treat atmosphere as substance, not decoration.",
  "We keep Chicago at the center.",
  "We build seasons, not one-off hype.",
  "We believe clarity is part of hospitality.",
];

const architectureExpressions = [
  {
    title: "The Monolith Project",
    label: "Umbrella",
    description:
      "The umbrella project: Chicago-rooted, music-first, and built to connect the nights, the archive, and the people around them.",
    href: "/",
    cta: CTA_LABELS.viewHome,
  },
  {
    title: "Chasing Sun(Sets)",
    label: "Open Air",
    description:
      "The warmer expression. Open-air rooms, daylight into dusk, and a more social pace built around movement and return.",
    href: "/chasing-sunsets",
    cta: CTA_LABELS.sunSets,
  },
  {
    title: "Radio Show",
    label: "Radio",
    description:
      "The Chasing Sun(Sets) Radio Show keeps the series active between events through mixes, guest sessions, and replayable episodes.",
    href: "/radio",
    cta: CTA_LABELS.radioHub,
  },
  {
    title: "Untold Story",
    label: "Late Night",
    description:
      "The closer, more intimate expression. A tighter room, deeper pacing, and a stronger sense of where the night is going.",
    href: "/story",
    cta: CTA_LABELS.untoldStory,
  },
];

export default function AboutSection() {
  const [expandedArchitecture, setExpandedArchitecture] = useState<string | null>(null);

  const toggleArchitecture = (title: string) => {
    signalChirp.click();
    setExpandedArchitecture(expandedArchitecture === title ? null : title);
  };

  return (
    <div className="w-full text-white">
      {/* Philosophy / Story Section */}
      <section className="relative py-16 px-6 z-30" id="story">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12 md:space-y-16">
            <div>
              <BrandTranslatorLabel tone="neutral" className="mb-6">
                Our Story
              </BrandTranslatorLabel>
              <WordScrubReveal
                text="We are tired of forgettable nights."
                className="font-serif text-[clamp(2rem,5vw,4.5rem)] tracking-tight uppercase leading-[0.95] text-white/90 text-balance"
              />
            </div>
            <div>
              <WordScrubReveal
                text="Too much nightlife is built to be consumed once and forgotten by morning. The room becomes backdrop. The music becomes texture. The ticket becomes the whole story."
                className="font-serif text-[clamp(1.2rem,3vw,2.4rem)] leading-[1.2] text-white/80 text-balance"
              />
            </div>
            <div className="mt-8">
              <WordScrubReveal
                text="We built The Monolith Project as an ecosystem to keep what usually disappears visible: curation, uncompromised sound, continuity, and the architecture of a perfect night."
                className="font-serif text-[clamp(1.1rem,2.8vw,2.2rem)] leading-[1.3] text-[#D4A574] italic drop-shadow-md text-balance"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Manifesto */}
      <section className="relative py-24 px-6 md:px-12 z-30 bg-[#0a0a0a] border-y border-white/[0.05]" id="manifesto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,168,83,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-24">
              <span className="ui-kicker block text-[#d4a853] mb-3">The Standard</span>
              <h2 className="font-display text-4xl md:text-6xl text-white mb-6 uppercase leading-none tracking-tight drop-shadow-md">Manifesto</h2>
              <div className="w-16 h-[2px] bg-[#d4a853]/40 shadow-[0_0_15px_rgba(212,168,83,0.3)]" />
            </div>
          </div>
          <div className="lg:w-2/3 space-y-10 md:space-y-16">
            {manifestoLines.map((line, i) => (
              <div key={i} className="mb-0 overflow-hidden">
                <WordScrubReveal
                  text={line}
                  className="font-serif font-light italic text-[clamp(1.8rem,4vw,4rem)] text-white/90 leading-[1.1] text-balance"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Togetherness */}
      <section className="relative px-6 py-24 z-30 border-b border-white/10 bg-[#070707]" id="vision">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <BrandTranslatorLabel tone="neutral" className="mb-6">
              Togetherness
            </BrandTranslatorLabel>
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,4.8rem)] leading-[0.92] uppercase text-white mb-6">
              Different rooms.
              <br />
              Same people returning.
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-white/68 font-light">
              Togetherness is the part that makes Monolith more than separate pages. Chasing Sun(Sets), Untold Story, and the Radio Show are different expressions, but the point is continuity: the same city, the same standard, and a crowd that keeps finding each other across formats.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-10">
            {[
              {
                label: "The Root",
                copy: "Monolith holds the standard: curation, sound, continuity, and hospitality.",
              },
              {
                label: "The Branches",
                copy: "Each branch does a different job: open-air, late-night, and replayable audio between nights.",
              },
              {
                label: "The Return",
                copy: "The same people move between them, which is how the project becomes a real community instead of isolated drops.",
              },
            ].map((item) => (
              <div key={item.label} className="border border-white/10 bg-white/[0.03] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/75 mb-3">{item.label}</p>
                <p className="text-sm text-white/68 leading-relaxed">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four-Part Architecture */}
      <section className="relative px-6 py-24 z-30 overflow-hidden" id="architecture">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(224,90,58,0.05),transparent_40%),radial-gradient(circle_at_84%_74%,rgba(139,92,246,0.05),transparent_40%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/3 lg:sticky lg:top-24"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-6 bg-primary/50" />
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">How It Works</span>
              </div>
              <h2 className="font-display text-[clamp(2.2rem,4vw,4rem)] leading-[0.9] uppercase text-white mb-6">
                Four parts.<br />
                <span className="text-white/20">One project.</span>
              </h2>
              <p className="text-base leading-relaxed text-white/40 font-light max-w-sm">
                The Monolith Project is the parent brand. Chasing Sun(Sets), the Radio Show, and Untold Story each play a clear role inside it.
              </p>
            </motion.div>

            <div className="lg:w-2/3 flex flex-col border-t border-white/10 w-full">
              {architectureExpressions.map((expression) => {
                const isExpanded = expandedArchitecture === expression.title;
                return (
                  <div
                    key={expression.title}
                    className="w-full border-b border-white/10 flex flex-col group backdrop-blur-sm"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleArchitecture(expression.title)}
                      onMouseEnter={() => signalChirp.hover()}
                      className="w-full text-left py-8 md:py-10 flex items-center justify-between hover:bg-white/[0.01] transition-all duration-500 focus-visible:outline-none focus-visible:bg-white/[0.03]"
                    >
                      <div className="flex-1 pr-6">
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3 block group-hover:text-primary transition-colors">
                          {expression.label}
                        </span>
                        <h3 className={`uppercase leading-[0.9] text-white transition-all duration-700 group-hover:translate-x-2 ${
                            expression.label === "Open Air" ? "font-sunsets text-2xl md:text-4xl" :
                            expression.label === "Late Night" ? "font-untold text-2xl md:text-4xl" :
                            expression.label === "Signal" ? "font-radio text-2xl md:text-4xl" :
                            "font-monolith text-2xl md:text-4xl"
                        }`}>
                          {expression.title}
                        </h3>
                      </div>

                      <div className="h-10 w-10 shrink-0 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                        <motion.div
                          animate={{ rotate: isExpanded ? 45 : 0 }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Plus className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" />
                        </motion.div>
                      </div>
                    </button>

                    {/* Category Content */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-10 pt-2">
                             <p className="text-lg md:text-xl leading-relaxed text-white/60 font-light max-w-xl mb-8">
                                {expression.description}
                             </p>
                             <Link href={expression.href} asChild>
                               <a className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-mono text-[10px] tracking-widest uppercase">
                                 {expression.cta}
                                 <ArrowUpRight className="w-3 h-3" />
                               </a>
                             </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
