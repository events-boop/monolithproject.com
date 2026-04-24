import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight, Plus } from "lucide-react";
import WordScrubReveal from "@/components/ui/WordScrubReveal";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import { CTA_LABELS } from "@/lib/cta";
import { signalChirp } from "@/lib/SignalChirpEngine";

// Crowdsauce-inspired Brutalist Cascade Layout Concept
const structuralManifesto = [
  { heavy: "WE REJECT", light: "ONE-OFF HYPE." },
  { heavy: "WE BUILD", light: "ENTIRE SEASONS." },
  { heavy: "CURATION", light: "OVER NOISE." },
  { heavy: "CHICAGO", light: "AT THE CENTER." },
  { heavy: "FOCUSED", light: "HOSPITALITY." },
];

const architectureExpressions = [
  {
    title: "The Monolith Project",
    label: "Project",
    description:
      "A Chicago-rooted music company connecting the shows, radio, artists, and community around them.",
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
    title: "Radio",
    label: "Radio",
    description:
      "Mixes, guest sessions, and conversations that keep the music moving between shows.",
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
                text="We built The Monolith Project to give nights more shape: stronger curation, better sound, sharper artists, and a crowd that wants more than a one-time event."
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
          <div className="lg:w-1/4">
            <div className="lg:sticky lg:top-32">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#d4a853] block mb-4">
                01 // THE STANDARD
              </span>
              <div className="w-full h-px bg-[#d4a853]/30 mb-8" />
            </div>
          </div>
          
          {/* Brutalist Cascade Block */}
          <div className="lg:w-3/4 flex flex-col pt-4 lg:pt-0">
            {structuralManifesto.map((line, i) => (
              <div key={i} className="mb-10 sm:mb-16 last:mb-0 flex flex-col group border-l-2 border-transparent hover:border-[#d4a853]/50 pl-0 hover:pl-6 transition-all duration-500">
                <span className="font-heavy text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.8] tracking-tighter uppercase text-white/95 mix-blend-difference group-hover:text-white transition-colors duration-500">
                  {line.heavy}
                </span>
                <span className="font-heavy text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.85] tracking-tight uppercase text-transparent transition-all duration-500" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.4)" }}>
                  {line.light}
                </span>
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
            <p className="max-w-2xl text-lg leading-relaxed text-white/70 font-light">
              Monolith ties together the open-air show, the late-night room, and the radio archive. Chasing Sun(Sets) carries golden hour and lakefront energy. Untold Story takes the night deeper. Radio keeps the artists and community connected between shows.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-10">
            {[
              {
                label: "The Standard",
                copy: "Monolith holds the line on curation, sound, hospitality, and follow-through.",
              },
              {
                label: "The Shows",
                copy: "Chasing Sun(Sets) and Untold Story give the audience two distinct ways into the world, with Radio extending it beyond the night.",
              },
              {
                label: "The Community",
                copy: "Artists, partners, and returning guests are what turn separate dates into a real scene.",
              },
            ].map((item) => (
              <div key={item.label} className="border border-white/10 bg-white/[0.03] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/75 mb-3">{item.label}</p>
                <p className="text-sm text-white/70 leading-relaxed">{item.copy}</p>
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
                One project. Three public expressions. Chasing Sun(Sets) leads the open-air season, Untold Story leads the late-night room, and Radio keeps the artists and culture moving between shows.
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
                               <a className="btn-text-action">
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
