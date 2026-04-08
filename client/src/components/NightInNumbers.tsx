import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const stats: { number: number; label: string; sublabel: string; suffix?: string }[] = [
  { number: 10, label: "Thousand+ People", sublabel: "And Growing", suffix: "K" },
  { number: 2, label: "Annual July 4th", sublabel: "Chicago Tradition" },
  { number: 22, label: "Artists Hosted", sublabel: "Across All Series" },
  { number: 4, label: "Seasons Deep", sublabel: "And Counting" },
];

function CountUp({ target, inView, delay = 0, suffix }: { target: number; inView: boolean; delay?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      const duration = 1800;
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, target, delay]);

  return <>{String(count).padStart(2, "0")}{suffix && <span className="text-[0.6em] align-top ml-1">{suffix}</span>}</>;
}

export default function NightInNumbers() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#050505] border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/[0.03]" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-white/[0.03]" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white/[0.03]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.08]">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col justify-between p-8 md:p-12 lg:p-16 group overflow-hidden cursor-default"
          >
            {/* Hover white flood from bottom */}
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />

            <div className="relative z-10">
              <div className="font-heavy text-[clamp(5rem,10vw,10rem)] leading-none tracking-tighter text-white group-hover:text-black transition-colors duration-500 tabular-nums">
                <CountUp target={stat.number} inView={isInView} delay={i * 120} suffix={stat.suffix} />
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 group-hover:border-black/20 transition-colors duration-500 flex flex-col gap-1">
              <p className="font-heavy text-xl md:text-2xl uppercase tracking-tighter text-white group-hover:text-black transition-colors duration-500">
                {stat.label}
              </p>
              <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-black/40 transition-colors duration-500">
                {stat.sublabel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
