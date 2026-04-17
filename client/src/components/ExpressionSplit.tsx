import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { Sun, AudioLines, ArrowUpRight } from "lucide-react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { getResponsiveImage } from "../lib/responsiveImages";

const expressions = [
  {
    id: "sunsets",
    number: "01",
    label: "Branch / Open Air",
    title: "Chasing Sun(Sets)",
    tagline: "Golden hour. Open air. A room that breathes.",
    color: "#D4A574",
    image: "/images/chasing-sunsets-premium.webp",
    href: "/chasing-sunsets",
    icon: Sun,
  },
  {
    id: "untold",
    number: "02",
    label: "Branch / After Dark",
    title: "Untold Story",
    tagline: "When the light drops, the room changes shape.",
    color: "#E05A3A",
    image: "/images/untold-story-moody.webp",
    href: "/story",
    icon: UntoldButterflyLogo,
  },
  {
    id: "radio",
    number: "03",
    label: "Sun(Sets) · Global",
    title: "Sun(Sets) Radio",
    tagline: "Chicago, worldwide. The daytime room between nights.",
    color: "#E8B86D",
    image: "/images/radio-show-gear.webp",
    href: "/radio",
    icon: AudioLines,
  },
  {
    id: "archive",
    number: "04",
    label: "Archive",
    title: "Event Archive",
    tagline: "Photos, recaps, and recorded history.",
    color: "#E05A3A",
    image: "/images/hero-video-1-poster.jpg",
    href: "/archive",
    icon: ArrowUpRight,
  },
];

import { useUI } from "../contexts/UIContext";
import { getPublicEvents } from "../lib/siteData";

export default function ExpressionSplit() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { setHoveredExpression } = useUI();
  const allEvents = getPublicEvents();

  // Helper to find starting price for a series
  const getStartingPrice = (expId: string) => {
    const seriesMap: Record<string, string> = {
      'sunsets': 'chasing-sunsets',
      'untold': 'untold-story',
      'radio': 'radio',
    };
    const seriesId = seriesMap[expId];
    if (!seriesId) return null;
    
    const events = allEvents.filter(e => e.series === seriesId && e.startingPrice);
    if (!events.length) return null;
    
    // Return the minimum starting price
    const minPrice = Math.min(...events.map(e => e.startingPrice!));
    return minPrice;
  };

  const handleHoverStart = (id: string) => {
    setHoveredId(id);
    const normalizedId = id === "untold" ? "untold" : id === "sunsets" ? "sunsets" : "radio";
    setHoveredExpression(normalizedId as any);
  };

  const handleHoverEnd = () => {
    setHoveredId(null);
    setHoveredExpression(null);
  };

  return (
    <section className="relative split-panel-shell w-full overflow-hidden bg-black border-y border-white/10">
      <div className="split-panel-track">
        {expressions.map((exp, index) => (
          <motion.div
            key={exp.id}
            onHoverStart={() => handleHoverStart(exp.id)}
            onHoverEnd={handleHoverEnd}
            animate={{
              flex: hoveredId === exp.id ? 2 : hoveredId === null ? 1 : 0.8,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="split-panel-item relative group cursor-pointer overflow-hidden border-b border-white/10 last:border-0 lg:border-b-0 lg:border-r"
          >
            <Link href={exp.href} className="absolute inset-0 block h-full w-full" data-cursor-text="EXPLORE">
              {/* Background Image & Overlays */}
              <div className="absolute inset-0">
                <picture className="h-full w-full">
                  {getResponsiveImage(
                    exp.id === 'sunsets' ? 'chasingSunsets' :
                    exp.id === 'untold' ? 'untoldStoryPoster' :
                    exp.id === 'radio' ? 'radioShowGear' : 'videoPoster1',
                    "(min-width: 1024px) 25vw, 100vw"
                  ).sources.map((source, i) => (
                    <source key={i} {...source} />
                  ))}
                  <motion.img
                    src={exp.image}
                    alt={exp.title}
                    className="h-full w-full object-cover grayscale-[40%] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/60 transition-colors duration-500 group-hover:bg-black/40" />
                <div 
                  className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40"
                  style={{ background: `linear-gradient(to top, ${exp.color}44, transparent)` }}
                />
              </div>

              {/* Vertical Structural Label (Maja Style) */}
              <div className="absolute top-8 left-6 lg:top-12 lg:left-8 flex items-baseline gap-4 pointer-events-none">
                <span className="font-display text-3xl lg:text-5xl text-white/20 select-none">
                  {exp.number}
                </span>
                <span className="ui-kicker text-white/40 tracking-[0.3em] font-bold text-[10px] lg:text-[11px]">
                  {exp.label}
                </span>
              </div>

              {/* Content Holder */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12">
                <div className="max-w-md">
                   {/* Icon HUD - Only show on desktop hover or mobile active */}
                    <motion.div 
                     animate={{ 
                       y: hoveredId === exp.id ? 0 : 20,
                       opacity: (hoveredId === exp.id || hoveredId === null) ? 1 : 0 
                     }}
                     className="mb-4 lg:mb-8 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-none border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl"
                   >
                     {exp.id === 'untold' ? <UntoldButterflyLogo className="h-6 w-6 lg:h-8 lg:w-8 text-primary" /> : <exp.icon className="h-6 w-6 lg:h-8 lg:w-8" style={{ color: exp.color }} />}
                   </motion.div>

                       <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display text-3xl lg:text-5xl uppercase tracking-tight text-white leading-none">
                            {exp.title}
                          </h3>
                          {exp.id !== 'archive' && exp.id !== 'radio' && getStartingPrice(exp.id) && (
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              From <span className="text-white">${getStartingPrice(exp.id)}</span>
                            </span>
                          )}
                       </div>
                   
                   <motion.div
                     initial={false}
                     animate={{ 
                       height: (hoveredId === exp.id) ? "auto" : "0px",
                       opacity: hoveredId === exp.id ? 1 : 0,
                     }}
                     className="hidden lg:block overflow-hidden"
                   >
                     <p className="mt-6 font-serif italic text-xl lg:text-2xl text-white/80 leading-relaxed max-w-sm">
                       {exp.tagline}
                     </p>
                     
                     <div className="mt-8 flex items-center gap-4 text-white hover:text-white transition-colors">
                        <span className="ui-chip">
                          {exp.id === 'sunsets' ? 'Get Alerts First' :
                           exp.id === 'untold' ? 'Join The Story' :
                           exp.id === 'radio' ? 'Hear The Rooms' :
                           'See The Archive'}
                        </span>
                        <div className="h-10 w-10 flex items-center justify-center rounded-none border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300">
                           <ArrowUpRight className="h-5 w-5" />
                        </div>
                     </div>
                   </motion.div>
                </div>

                {/* Mobile Interaction Signal */}
                <div className="lg:hidden mt-6 flex items-center gap-3">
                  <div className="h-px w-6 bg-white/30" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
                    {exp.id === 'sunsets' ? 'Get Alerts First' :
                     exp.id === 'untold' ? 'Join The Story' :
                     'Open View'}
                  </span>
                </div>
              </div>

              {/* Inactive State Vertical Title (Maja Style) */}
              <motion.div
                animate={{ 
                  opacity: hoveredId === exp.id ? 0 : 1,
                  y: hoveredId === exp.id ? 40 : 0
                }}
                className="hidden lg:block absolute right-6 bottom-12 origin-bottom lg:right-auto lg:left-8 lg:bottom-12 lg:origin-bottom-left lg:-rotate-90 pointer-events-none whitespace-nowrap"
              >
                <span className="font-display text-2xl uppercase tracking-[0.2em] text-white/60">
                  {exp.title}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
