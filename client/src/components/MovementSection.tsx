import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import RevealText from "./RevealText";
import KineticDecryption from "./KineticDecryption";
import { getResponsiveImage } from "@/lib/responsiveImages";

const lazareImage = getResponsiveImage("lazareCarbonCenter", "(min-width: 1024px) 44vw, 60vw");

const movementPaths = [
  {
    href: "/chasing-sunsets",
    label: "Open Air",
    title: "Chasing Sun(Sets)",
    description:
      "The open-air series. Golden-hour pacing, warmer rooms, and music that moves from daylight into dusk with ease.",
    toneClass: "border-clay/20 bg-clay/10 text-clay",
  },
  {
    href: "/story",
    label: "After Dark",
    title: "Untold Story",
    description:
      "The late-night series. Closer rooms, deeper sound, and a more intimate kind of tension once the light drops.",
    toneClass: "border-primary/20 bg-primary/10 text-primary",
  },
  {
    href: "/radio",
    label: "Radio",
    title: "Radio Show",
    description:
      "The listening side of the project. Mixes and artist sessions that extend the taste behind the room between events.",
    toneClass: "border-white/15 bg-white/[0.06] text-white/76",
  },
] as const;

export default function MovementSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.15, 0.15, 0]);

  return (
    <section
      id="movement"
      ref={ref}
      className="relative py-24 md:py-40 bg-black overflow-hidden border-t border-white/10"
    >
      {/* 🖼️ ARCHITECTURAL PARALLAX BACKDROP */}
      <motion.div 
        style={{ y: imageY, opacity: imageOpacity }}
        className="absolute inset-x-0 -top-1/4 h-[150%] pointer-events-none z-0 overflow-hidden"
      >
        <img 
          src="/images/lazare-carbon-center.jpg" 
          className="w-full h-full object-cover grayscale opacity-60 mix-blend-overlay scale-110 blur-[2px]"
          alt=""
        />
      </motion.div>

      {/* Sanjaya-style ambient glow & depth layers */}
      <div className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50" />
      <div className="absolute bottom-[-20%] left-[10%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen opacity-30" />
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />

      {/* Background Grid Lines (Sanjaya structural aesthetic) */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute left-[8%] md:left-[10%] top-0 bottom-0 w-px bg-white/10" />
         <div className="absolute right-[8%] md:right-[10%] top-0 bottom-0 w-px bg-white/10" />
      </div>

      <div className="container layout-wide px-6 relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-start">
          
          {/* LEFT: Massive Bleeding Stacked Typography */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8 md:mb-12">
               <div className="h-px w-12 bg-primary/70" />
               <span className="font-mono text-[11px] md:text-sm uppercase tracking-[0.4em] text-primary/95 font-bold">The Project</span>
            </div>
            
            <h2 className="font-heavy text-[clamp(4rem,9.5vw,9.5rem)] leading-[0.8] tracking-tight uppercase text-white flex flex-col mb-12">
              <span className="text-white/25">CHICAGO</span>
              <span className="text-white"><KineticDecryption text="ROOTED" /></span>
              <span className="text-primary mt-1">ROOMS.</span>
            </h2>

            {/* Glass Information Panel */}
            <div className="backdrop-blur-md bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-none relative overflow-hidden group">
               {/* Subtle Holo gradient reveal on hover */}
               <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/[0.07] to-primary/0 translate-y-full group-hover:translate-y-[-20%] transition-transform duration-[1.5s] ease-out pointer-events-none" />
               
               <p className="font-sans text-xl md:text-2xl text-white/80 leading-relaxed font-light relative z-10">
                 The Monolith Project is a Chicago music project built through recurring events, clear series, and an archive that stays visible after the night ends.
               </p>
               
               <div className="mt-8 pt-8 border-t border-white/10 relative z-10 flex flex-col gap-4">
                 <p className="font-mono text-[11px] md:text-sm tracking-[0.3em] uppercase text-white/45 mb-1">
                   Artists scheduled for 2026:
                 </p>
                 <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {[
                      { name: "DERON B2B JUANY BRAVO", color: "text-[#22D3EE]" },
                      { name: "LAZARE SABRY", color: "text-[#22D3EE]" },
                      { name: "AUTOGRAF", color: "text-primary" },
                      { name: "ERAN HERSH", color: "text-primary" }
                    ].map((artist) => (
                      <span key={artist.name} className={`font-heavy text-xl md:text-2xl uppercase tracking-tighter drop-shadow-sm ${artist.color}`}>
                        {artist.name}
                      </span>
                    ))}
                    <span className="font-heavy text-xl md:text-2xl uppercase tracking-tighter text-white/20">
                      + MORE TBA
                    </span>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* RIGHT: Sanjaya Glass Panel Interaction Stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {movementPaths.map((path, index) => {
               // Determine specific holo glow based on the series
               const isSunsets = path.title.includes("Sun(Sets)");
               const isStory = path.title.includes("Story");
               const glowClass = isSunsets 
                  ? "bg-sunsets-gold shadow-[0_0_20px_rgba(232,184,109,0.5)]" 
                  : isStory 
                     ? "bg-untold-cyan shadow-[0_0_20px_rgba(34,211,238,0.5)]" 
                     : "bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]";
               const accentText = isSunsets ? "text-sunsets-gold" : isStory ? "text-untold-cyan" : "text-white";

               return (
                  <Link key={path.title} href={path.href} className="group relative block outline-none">
                     {/* Glass container with holo border edge */}
                     <div className="relative p-8 md:p-10 rounded-none border border-white/5 bg-white/[0.015] backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/15">
                        
                        {/* Kinetic Holo Top Edge */}
                        <div className={`absolute top-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${glowClass}`} />

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                           <div className="flex flex-col gap-4 max-w-[85%]">
                              <span className={`font-mono text-[11px] md:text-xs uppercase tracking-[0.3em] font-bold text-white/35 group-hover:${accentText} transition-colors duration-500`}>
                                 {path.label}
                              </span>
                              <h3 className="font-heavy text-3xl md:text-[2.5rem] tracking-tight uppercase leading-none text-white drop-shadow-md">
                                 {path.title}
                              </h3>
                              <p className="font-sans text-sm md:text-base text-white/50 leading-relaxed mt-2 blend-luminosity transition-colors group-hover:text-white/70">
                                 {path.description}
                              </p>
                           </div>
                           
                           <div className="shrink-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-none border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-500">
                              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white/30 group-hover:text-primary transition-all duration-500 transform group-hover:-rotate-45 group-hover:scale-110" />
                           </div>
                        </div>
                     </div>
                  </Link>
               );
            })}
            
            {/* Ambient Signoff block */}
            <div className="mt-4 p-8 md:p-10 rounded-none border border-white/5 bg-[radial-gradient(ellipse_at_top_right,rgba(224,90,58,0.08),transparent_60%)] relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30" />
               <p className="font-mono text-[11px] md:text-sm text-white/50 leading-loose uppercase tracking-[0.25em] pl-4">
                 "Monolith exists to build nights that feel connected to something larger than themselves."
               </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
