import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sun, AudioLines, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import UntoldButterflyLogo from "../UntoldButterflyLogo";
import { useUI } from "@/contexts/UIContext";

const expressions = [
  {
    id: "sunsets",
    title: "Chasing Sun(Sets)",
    label: "Open Air",
    icon: Sun,
    color: "#D4A574",
    orbit: 180,
    speed: 0.2, 
    initialAngle: 45,
  },
  {
    id: "radio",
    title: "Radio Show",
    label: "Signal",
    icon: AudioLines,
    color: "#9178FF",
    orbit: 260,
    speed: -0.15,
    initialAngle: 180,
  },
  {
    id: "story",
    title: "Untold Story",
    label: "After Dark",
    icon: UntoldButterflyLogo,
    color: "#E05A3A",
    orbit: 340,
    speed: 0.1,
    initialAngle: 300,
  },
  {
    id: "archive",
    title: "Media & Insight",
    label: "Archive",
    icon: ArrowUpRight,
    color: "#FFFFFF",
    orbit: 420,
    speed: -0.1,
    initialAngle: 60,
  },
];

export default function CircularOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotation = useTransform(scrollYProgress, [0, 1], [0, 90]);

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 768 ? 0.6 : window.innerWidth < 1024 ? 0.75 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full max-w-full h-[540px] md:h-[900px] overflow-hidden select-none pointer-events-none"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-0">
        <defs>
          <linearGradient id="orbit-gradient-shared" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,165,116,0.05)_0%,transparent_70%)] opacity-50" />

      <div className="relative z-20 flex flex-col items-center justify-center">
        <motion.div
           animate={{ 
             boxShadow: ["0 0 20px rgba(255,255,255,0.05)", "0 0 40px rgba(255,255,255,0.15)", "0 0 20px rgba(255,255,255,0.05)"]
           }}
           transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-[#080808] border border-white/10 flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <span className="font-display text-4xl text-white tracking-tighter">M</span>
        </motion.div>
        <span className="ui-kicker mt-6 text-white/40">The Monolith</span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {expressions.map((exp) => (
          <OrbitCircle
            key={exp.id}
            expression={exp}
            scrollRotation={rotation}
            scale={scale}
          />
        ))}
      </div>
    </div>
  );
}

function OrbitCircle({ expression: exp, scrollRotation, scale }: { expression: any; scrollRotation: any; scale: number }) {
  const angle = useTransform(scrollRotation, (v: number) => v * exp.speed + exp.initialAngle);
  const radius = exp.orbit * scale;
  const x = useTransform(angle, (a) => Math.cos((a * Math.PI) / 180) * radius);
  const y = useTransform(angle, (a) => Math.sin((a * Math.PI) / 180) * radius);
  const Icon = exp.icon;
  const { setHoveredExpression } = useUI();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg className="absolute w-full h-full opacity-20 pointer-events-none">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="url(#orbit-gradient-shared)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 8"
          className="opacity-40"
        />
      </svg>

      <motion.div
        style={{ x, y }}
        className="absolute z-10 flex items-center gap-3 p-2 group pointer-events-auto"
        onMouseEnter={() => setHoveredExpression(exp.id === 'story' ? 'untold' : exp.id)}
        onMouseLeave={() => setHoveredExpression(null)}
      >
        <Link 
          href={`/${exp.id === 'story' ? 'story' : exp.id}`} 
          className="cursor-pointer"
          data-cursor-text="EXPLORE"
        >
          <div className="flex items-center gap-3 rounded-full border border-white/12 bg-black/40 backdrop-blur-md px-4 py-2.5 shadow-xl transition-all hover:border-white/20 hover:bg-black/80 hover:scale-105 active:scale-95">
            <div 
              className="flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full border border-white/10"
              style={{ backgroundColor: `${exp.color}15`, color: exp.color }}
            >
              {exp.id === 'story' ? <UntoldButterflyLogo className="h-3 w-3 lg:h-4 lg:w-4" /> : <Icon className="h-3 w-3 lg:h-4 lg:w-4" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] lg:text-[9px] uppercase tracking-[0.2em] opacity-40 leading-none mb-1">
                {exp.label}
              </span>
              <span className="font-display text-xs lg:text-sm uppercase tracking-wider text-white whitespace-nowrap">
                {exp.title}
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
