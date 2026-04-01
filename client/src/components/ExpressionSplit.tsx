import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { Sun, AudioLines, ArrowUpRight } from "lucide-react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";

const expressions = [
  {
    id: "sunsets",
    number: "01",
    label: "Open Air",
    title: "Chasing Sun(Sets)",
    tagline: "Golden hour. Open air. A room that breathes.",
    color: "#D4A574",
    image: "/images/chasing-sunsets.jpg",
    href: "/chasing-sunsets",
    icon: Sun,
  },
  {
    id: "untold",
    number: "02",
    label: "After Dark",
    title: "Untold Story",
    tagline: "When the light drops, the room changes shape.",
    color: "#E05A3A",
    image: "/images/untold-story.jpg",
    href: "/story",
    icon: UntoldButterflyLogo,
  },
  {
    id: "radio",
    number: "03",
    label: "Signal",
    title: "Radio Show",
    tagline: "The collective record. Guest sessions and signal.",
    color: "#FFFFFF",
    image: "/images/radio-show.jpg",
    href: "/radio",
    icon: AudioLines,
  },
];

import { useUI } from "@/contexts/UIContext";

export default function ExpressionSplit() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { setHoveredExpression } = useUI();

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
    <section className="relative min-h-screen lg:h-[80vh] lg:min-h-[600px] w-full overflow-hidden bg-black border-y border-white/10">
      <div className="flex h-full w-full flex-col lg:flex-row">
        {expressions.map((exp, index) => (
          <motion.div
            key={exp.id}
            onHoverStart={() => handleHoverStart(exp.id)}
            onHoverEnd={handleHoverEnd}
            animate={{
              flex: hoveredId === exp.id ? 2 : hoveredId === null ? 1 : 0.8,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`relative group h-[33.33vh] lg:h-full cursor-pointer overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 last:border-0`}
          >
            <Link href={exp.href} className="absolute inset-0 block h-full w-full" data-cursor-text="EXPLORE">
              {/* Background Image & Overlays */}
              <div className="absolute inset-0">
                <motion.img
                  src={exp.image}
                  alt={exp.title}
                  className="h-full w-full object-cover grayscale-[40%] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
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

                   <h3 className="font-display text-3xl lg:text-5xl uppercase tracking-tight text-white leading-none">
                     {exp.title}
                   </h3>
                   
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
                        <span className="ui-chip">Enter Expression</span>
                        <div className="h-10 w-10 flex items-center justify-center rounded-none border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300">
                           <ArrowUpRight className="h-5 w-5" />
                        </div>
                     </div>
                   </motion.div>
                </div>

                {/* Mobile Interaction Signal */}
                <div className="lg:hidden mt-6 flex items-center gap-3">
                  <div className="h-px w-6 bg-white/30" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">Intercept Signal</span>
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
