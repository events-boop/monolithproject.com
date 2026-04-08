import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function LiquidRippleTrail() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCount = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttling or only doing it every N pixels could be better, 
      // but for "God-Tier" we want it smooth and responsive.
      const newRipple = {
        id: rippleCount.current++,
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev.slice(-15), newRipple]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x,
              top: ripple.y,
              width: "120px",
              height: "120px",
              marginLeft: "-60px",
              marginTop: "-60px",
              borderRadius: "50%",
              // This uses the liquid-distortion filter defined in index.html or LiquidDistortion.tsx
              filter: "url(#liquid-distortion)",
              background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
