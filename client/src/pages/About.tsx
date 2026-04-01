import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import SmartImage from "@/components/SmartImage";
import TextSpotlightReveal from "@/components/ui/TextSpotlightReveal";
import WordScrubReveal from "@/components/ui/WordScrubReveal";
import MagneticButton from "@/components/MagneticButton";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { CTA_LABELS } from "@/lib/cta";

const manifestoLines = [
  "We build rooms worth returning to.",
  "We choose curation over noise.",
  "We treat atmosphere as substance, not decoration.",
  "We keep Chicago in the center of the story.",
  "We build chapters, not one-off hype.",
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
    label: "Signal",
    description:
      "The Chasing Sun(Sets) Radio Show extends the taste behind the room through mixes, artist sessions, and recurring listening signals.",
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

const aboutCollectiveImage = getResponsiveImage("artistsCollective");

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);

  return (
    <div ref={containerRef} className="bg-[#050505] text-white selection:bg-white/20 relative">
      <SEO
        title="About The Monolith Project | Chicago Music World"
        description="Learn how The Monolith Project connects recurring Chicago nights, Chasing Sun(Sets), the Chasing Sun(Sets) Radio Show, and Untold Story through one standard of curation, atmosphere, and hospitality."
        canonicalPath="/about"
      />

      {/* Ambient noise overlay */}
      <div className="fixed inset-0 z-[100] pointer-events-none mix-blend-overlay opacity-[0.03]">
        <div className="absolute inset-0 bg-noise" />
      </div>

      <Navigation variant="dark" brand="monolith" />

      {/* Hero Section */}
      <section className="relative h-[100svh] w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 w-full h-full transform-gpu"
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-transparent to-[#050505] z-20" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
            poster="/images/hero-monolith.jpg"
          >
            <source src="/videos/hero-video-short.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Ambient sun/aura behind the text */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen opacity-60">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,rgba(145,120,255,0.15)_30%,transparent_70%)] rounded-none blur-[40px]"
          />
        </div>

        {/* The Regular Content Layer */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center h-full pt-16 px-6 text-center w-full pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute top-1/4"
          >
            <h2 className="font-mono text-xs md:text-sm uppercase tracking-[0.5em] text-white/70">
              The Monolith Project
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.45 }}
            className="flex flex-col items-center justify-center gap-6"
          >
            <motion.h1
              initial={{ filter: "blur(12px)", opacity: 0, scale: 0.95 }}
              animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-heavy text-[clamp(2.8rem,15vw,12rem)] tracking-[-0.03em] leading-[0.8] text-white uppercase drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-[95vw] break-words"
            >
              MONOLITH
            </motion.h1>

            <p className="max-w-xl text-center text-[11px] uppercase tracking-[0.22em] text-white/68 md:text-base">
              A Chicago-rooted cultural house built through nights, series, and sound.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/50 mb-4 animate-pulse">
              Scroll the world
            </span>
            <div className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Philosophy / Story Section */}
      <section className="relative py-40 px-6 z-30" id="story">
        <div className="max-w-5xl mx-auto">
            <div className="space-y-16">
              <div>
                <WordScrubReveal 
                  text="We are tired of disposable nights." 
                  className="font-serif text-[clamp(2.4rem,6vw,5.5rem)] tracking-tight uppercase leading-[0.95] text-white/90 text-balance"
                />
              </div>
              <div>
                <WordScrubReveal 
                  text="Too much of nightlife is built to be consumed once and forgotten fast. The room becomes backdrop. The music becomes texture. The ticket becomes the whole story." 
                  className="font-serif text-[clamp(1.4rem,3.5vw,2.8rem)] leading-[1.2] text-white/80 max-w-4xl text-balance"
                />
              </div>
              <div className="mt-8">
                <WordScrubReveal 
                  text="We built The Monolith Project to hold onto what usually disappears: curation, atmosphere, continuity, and the feeling that a night can belong to something larger than itself." 
                  className="font-serif text-[clamp(1.2rem,3vw,2.4rem)] leading-[1.3] text-[#D4A574] italic drop-shadow-md text-balance"
                />
              </div>
            </div>
        </div>
      </section>

      {/* The Manifesto */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 z-30 bg-[#0a0a0a] border-y border-white/[0.05]" id="manifesto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,168,83,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
          <div className="lg:w-1/3">
            <div className="sticky top-40">
              <span className="ui-kicker block text-[#d4a853] mb-4">Core Principles</span>
              <h2 className="font-display text-5xl md:text-8xl text-white mb-6 uppercase leading-none tracking-tight drop-shadow-md">Manifesto</h2>
              <div className="w-16 h-[2px] bg-[#d4a853]/40 shadow-[0_0_15px_rgba(212,168,83,0.3)]" />
            </div>
          </div>
          <div className="lg:w-2/3 space-y-12 md:space-y-20 pt-8 lg:pt-0">
            {manifestoLines.map((line, i) => (
              <div key={i} className="mb-0 overflow-hidden">
                <WordScrubReveal 
                  text={line} 
                  className="font-serif font-light italic text-[clamp(2.2rem,5vw,5rem)] text-white/90 leading-[1.1] text-balance"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four-Part Architecture */}
      <section className="relative px-6 py-32 md:py-48 z-30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(224,90,58,0.05),transparent_40%),radial-gradient(circle_at_84%_74%,rgba(139,92,246,0.05),transparent_40%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/3 sticky top-40"
            >
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px w-8 bg-primary/50" />
                 <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/80">Architecture</span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] uppercase text-white mb-8">
                Four expressions.<br />
                <span className="text-white/20">One standard.</span>
              </h2>
              <p className="text-lg leading-relaxed text-white/40 font-light max-w-sm">
                The Monolith Project holds the umbrella. Chasing Sun(Sets), the Radio Show, and Untold Story carry the distinct temperatures of the night.
              </p>
            </motion.div>

            <div className="lg:w-2/3 grid gap-px bg-white/[0.03] border border-white/[0.03] rounded-none overflow-hidden">
              {architectureExpressions.map((expression, index) => (
                <motion.div
                  key={expression.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#050505]"
                >
                  <Link
                    href={expression.href}
                    className="group flex flex-col md:flex-row md:items-center gap-8 p-10 md:p-14 transition-all duration-700 hover:bg-white/[0.01]"
                  >
                    <div className="flex-1">
                      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-primary/60 mb-4 block group-hover:text-primary transition-colors">
                        {expression.label}
                      </span>
                      <h3 className={`uppercase leading-[0.9] text-white transition-all duration-700 group-hover:tracking-wider ${
                        expression.label === "Open Air" ? "font-sunsets text-[2rem] md:text-[2.8rem]" :
                        expression.label === "Late Night" ? "font-untold text-[2rem] md:text-[2.8rem]" :
                        expression.label === "Signal" ? "font-radio text-[1.8rem] md:text-[2.4rem]" :
                        "font-monolith text-[2.2rem] md:text-[3rem]"
                      }`}>
                        {expression.title}
                      </h3>
                      <p className="mt-6 text-base leading-relaxed text-white/30 group-hover:text-white/60 transition-all duration-700 max-w-xl">
                        {expression.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end gap-6">
                       <div className="h-12 w-12 rounded-none border border-white/5 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-700">
                          <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-all duration-700 group-hover:scale-110" />
                       </div>
                       <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 group-hover:text-white transition-all duration-700">
                          {expression.cta}
                       </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enter the Collective */}
      <section className="relative h-screen flex flex-col items-center justify-center z-30 overflow-hidden" id="concept">
        <div className="absolute inset-0 z-0">
          <SmartImage
            src={aboutCollectiveImage.src}
            alt="The Collective"
            sources={aboutCollectiveImage.sources}
            sizes={aboutCollectiveImage.sizes}
            loading="lazy"
            decoding="async"
            containerClassName="absolute inset-0 bg-transparent"
            className="w-full h-full object-cover opacity-30 filter grayscale-[80%] blur-[2px] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]" />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <MagneticButton strength={0.4}>
              <a href="/schedule" data-cursor-text="JOIN" className="group inline-block w-full max-w-[95vw]">
                <h2 className="font-display text-[clamp(2.4rem,8vw,11rem)] tracking-[-0.03em] group-hover:tracking-normal transition-all duration-700 ease-out text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-[0.8] uppercase mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] text-balance">
                  Enter The
                  <br />
                  Collective
                </h2>
              </a>
            </MagneticButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 max-w-xl text-center ui-meta text-[#d4a853] transition-all hover:drop-shadow-[0_0_8px_rgba(212,168,83,0.8)] md:text-sm"
          >
            View the next nights, explore the series, or start with the room that feels like yours.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
