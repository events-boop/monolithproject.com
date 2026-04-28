import { useRef, useEffect, useState } from "react";
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
  const numberColor = isDark ? "text-white/16" : "text-black/10";
  const labelColor = isDark ? "text-white/40" : "text-black/40";
  const lineColor = isDark ? "bg-white/12" : "bg-black/12";

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

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn(
        "group relative w-full overflow-hidden border-y transition-opacity duration-700",
        borderColor,
        isInView ? "opacity-100" : "opacity-0",
      )}
    >
      {glow && (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000",
            isInView ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            className="absolute inset-x-[-15%] inset-y-[-120%] blur-[140px] opacity-[0.12]"
            style={{
              background: `radial-gradient(circle at center, ${glow}, transparent 72%)`,
            }}
          />
        </div>
      )}

      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          isDark ? "bg-[#070707]/72" : "bg-[#F4ECD9]/90",
        )}
      />

      <div className="container layout-wide relative z-10 px-6">
        <div
          className={cn(
            "flex items-end justify-between gap-6 transition-all duration-300",
            dense ? "py-4 md:py-6" : "py-6 md:py-8 lg:py-9",
          )}
        >
          <div className="min-w-0">
            <h2
              className={cn(
                labelOverride || "section-kicker",
                labelColor,
                "group-hover:text-primary transition-colors duration-500",
              )}
            >
              {label || `Section ${number}`}
            </h2>
            <div className={cn("mt-4 h-px w-16", lineColor)} />
          </div>

          <div className="flex items-end gap-4 sm:gap-5">
            <span
              aria-hidden="true"
              className={cn(
                "font-display text-[clamp(3rem,9vw,5.75rem)] leading-[0.82] tracking-[-0.05em]",
                numberColor,
              )}
            >
              {number}
            </span>
            <span className={cn("section-kicker hidden pb-2 sm:block", labelColor)}>
              MONOLITH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
