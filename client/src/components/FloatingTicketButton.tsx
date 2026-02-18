import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Ticket } from "lucide-react";
import { useLocation } from "wouter";
import { POSH_TICKET_URL } from "@/data/events";
import { useRef, useState } from "react";

const themes = {
  default: {
    center: "bg-gradient-to-br from-[#E05A3A] to-[#C2422A]",
    ring: "bg-[conic-gradient(from_0deg,#E05A3A,#F07050,#C2422A,#E05A3A)]",
    shadow: "shadow-[0_0_30px_rgba(224,90,58,0.3)]",
    text: "fill-white",
    icon: "text-white",
  },
  violet: {
    center: "bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]",
    ring: "bg-[conic-gradient(from_0deg,#8B5CF6,#A78BFA,#6D28D9,#8B5CF6)]",
    shadow: "shadow-[0_0_30px_rgba(139,92,246,0.4)]",
    text: "fill-white",
    icon: "text-white",
  },
  warm: {
    center: "bg-gradient-to-br from-[#C2703E] to-[#8B4513]",
    ring: "bg-[conic-gradient(from_0deg,#C2703E,#E8B86D,#8B4513,#C2703E)]",
    shadow: "shadow-[0_0_30px_rgba(194,112,62,0.4)]",
    text: "fill-[#2C1810]",
    icon: "text-white",
  },
};

function getTheme(location: string) {
  if (location === "/story") return themes.violet;
  if (location === "/chasing-sunsets") return themes.warm;
  return themes.default;
}

export default function FloatingTicketButton() {
  const [location] = useLocation();
  const theme = getTheme(location);
  const text = "BOOK TICKETS · BOOK TICKETS · ";
  const reduceMotion = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3); // Strength of pull
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <a
      href={POSH_TICKET_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Book tickets"
      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-full"
    >
      <div
        className="fixed bottom-6 right-6 md:bottom-10 md:right-8 z-50 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center pointer-events-none"
      >
        {/* Interactive Container */}
        <motion.div
          ref={ref}
          className="relative w-20 h-20 md:w-28 md:h-28 cursor-pointer group pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ x: springX, y: springY }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Spinning text ring with metallic shine */}
          <div className="absolute inset-0 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 animate-shine pointer-events-none mix-blend-overlay" />
            <svg
              className={`w-full h-full ${reduceMotion ? "" : "animate-spin-slow"}`}
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <text className={`${theme.text} text-[10.5px] font-bold tracking-[0.15em] uppercase font-mono`}>
                <textPath href="#circlePath" startOffset="0%">
                  {text}
                </textPath>
              </text>
            </svg>
          </div>

          {/* Center circle with icon */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.center} shadow-inner border border-white/20 z-20`}>
              <Ticket className={`w-7 h-7 ${theme.icon} transition-transform duration-500 group-hover:rotate-[360deg]`} />
            </div>
          </div>

          {/* Rotating Gradient Background (Outer Ring) */}
          <div className={`absolute inset-0 rounded-full overflow-hidden -z-10 ${theme.shadow} opacity-70 group-hover:opacity-100 transition-opacity duration-500`}>
            <div className={`absolute inset-[-50%] ${theme.ring} animate-spin-slow`} />
          </div>
        </motion.div>
      </div>
    </a>
  );
}
