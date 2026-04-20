import { useRef, useEffect, useMemo, useState } from "react";
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
  const [isInView, setIsInView] = useState(false);

  const isDark = dark !== false;
  const borderColor = isDark ? "border-white/10" : "border-black/10";
  const numColor = isDark ? "text-white/20" : "text-black/6";
  const labelColor = isDark ? "text-white/40" : "text-black/40";
  const lineColor = isDark ? "bg-white/8" : "bg-black/10";

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        signalChirp.hover();
        observer.disconnect();
      },
      { rootMargin: "-100px 0px -100px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const dataSegments = useMemo(() =>
    Array.from({ length: 12 }).map(() =>
      `${(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, "0").toUpperCase()}`
    ), [number]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`w-full relative border-t border-b ${borderColor} overflow-hidden group transition-opacity duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}
    >
      {/* Massive bleed number — architectural background mark */}
      <div
        className={`absolute -left-4 md:-left-8 top-1/2 font-heavy leading-none select-none pointer-events-none z-0 ${numColor}`}
        aria-hidden="true"
      >
        <span className="text-[clamp(8rem,28vw,24rem)] drop-shadow-[0_0_80px_rgba(255,255,255,0.02)]">
          {number}
        </span>
      </div>

      <div aria-hidden="true" className="absolute inset-0 opacity-[0.03] pointer-events-none font-mono text-[10px] truncate whitespace-nowrap overflow-hidden select-none">
          {dataSegments.map((segment, i) => (
             <div key={i} className="flex gap-12 mb-1 animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>
                {segment}
             </div>
          ))}
      </div>

      {/* 🔮 ATMOSPHERIC GLOW */}
      {glow && (
        <div
           className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${isInView ? "opacity-100" : "opacity-0"}`}
        >
           <div 
             className="absolute inset-x-[-20%] inset-y-[-100%] blur-[120px] opacity-[0.14]"
             style={{
               background: `radial-gradient(circle at center, ${glow}, transparent 70%)`
             }}
           />
        </div>
      )}

      {/* 📟 PULSING SCANLINE */}
      <div
         className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none opacity-[0.15] z-10"
      />

      <div className="container layout-wide px-6 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          dense ? "py-4 md:py-6 lg:py-7" : "py-6 md:py-8 lg:py-10"
        )}>
          {/* Left: Label */}
          <div className="flex items-center gap-6">
            <h2 className={labelOverride || `font-mono text-[11px] md:text-sm uppercase tracking-[0.5em] ${labelColor} group-hover:text-primary transition-colors duration-500`}>
              {label || `Section ${number}`}
            </h2>
          </div>

          {/* Right: Precise number marker */}
          <span className={`font-mono text-[11px] md:text-sm uppercase tracking-[0.5em] ${labelColor} opacity-50`}>
            {number} —
          </span>
        </div>
      </div>

      {/* Animated reveal line at bottom */}
      <div
        className={`absolute bottom-0 left-0 w-full h-px origin-left ${lineColor} group-hover:bg-primary transition-[transform,background-color] duration-1000 ${isInView ? "scale-x-100" : "scale-x-0"}`}
      />
    </div>
  );
}

