import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useMemo } from "react";
import { signalChirp } from "@/lib/SignalChirpEngine";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  id?: string;
  number: string;
  label?: string;
  dark?: boolean;
  glow?: string;
  labelOverride?: string;
  dense?: boolean;
}

export default function SectionDivider({ id, number, label, dark, glow, labelOverride, dense }: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const isDark = dark !== false;
  const borderColor = isDark ? "border-white/8" : "border-black/10";
  const numColor = isDark ? "text-white/6" : "text-black/6";
  const labelColor = isDark ? "text-white/40" : "text-black/40";
  const lineColor = isDark ? "bg-white/8" : "bg-black/10";

  // Aggressive parallax for the large architectural number
  const yParallax = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const xParallax = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const glowX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
        signalChirp.hover();
    }
  }, [isInView]);

  const dataSegments = useMemo(() =>
    Array.from({ length: 12 }).map(() =>
      `0x${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0").toUpperCase()}`
    ), [number]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      id={id}
      className={`w-full relative border-t border-b ${borderColor} overflow-hidden group`}
    >
      {/* Massive bleed number — architectural background mark */}
      <motion.div
        style={{ y: yParallax, x: xParallax }}
        className={`absolute -left-4 md:-left-8 top-1/2 font-heavy leading-none select-none pointer-events-none z-0 ${numColor}`}
        aria-hidden="true"
      >
        <span className="text-[clamp(8rem,28vw,24rem)] drop-shadow-[0_0_80px_rgba(255,255,255,0.02)]">
          {number}
        </span>
      </motion.div>

      <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none font-mono text-[10px] truncate whitespace-nowrap overflow-hidden select-none">
          {dataSegments.map((segment, i) => (
             <div key={i} className="flex gap-12 mb-1 animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
                {segment}
             </div>
          ))}
      </div>

      {/* 🔮 ATMOSPHERIC GLOW */}
      {glow && (
        <motion.div
           style={{ opacity: glowOpacity, x: glowX }}
           className="absolute inset-0 pointer-events-none z-0"
        >
           <div 
             className="absolute inset-x-[-20%] inset-y-[-100%] blur-[120px] opacity-[0.14]"
             style={{
               background: `radial-gradient(circle at center, ${glow}, transparent 70%)`
             }}
           />
        </motion.div>
      )}

      {/* 📟 PULSING SCANLINE */}
      <motion.div 
         animate={{ y: ["0%", "400%", "0%"] }}
         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
         className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none opacity-[0.15] z-10"
      />

      <div className="container layout-wide px-6 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          dense ? "py-4 md:py-6 lg:py-7" : "py-6 md:py-8 lg:py-10"
        )}>
          {/* Left: Label */}
          <div className="flex items-center gap-6">
            <span className={labelOverride || `font-mono text-[11px] md:text-sm uppercase tracking-[0.5em] ${labelColor} group-hover:text-primary transition-colors duration-500`}>
              {label || `Section ${number}`}
            </span>
          </div>

          {/* Right: Precise number marker */}
          <span className={`font-mono text-[11px] md:text-sm uppercase tracking-[0.5em] ${labelColor} opacity-50`}>
            {number} —
          </span>
        </div>
      </div>

      {/* Animated reveal line at bottom */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`absolute bottom-0 left-0 w-full h-px origin-left ${lineColor} group-hover:bg-primary transition-colors duration-1000`}
      />
    </motion.div>
  );
}


