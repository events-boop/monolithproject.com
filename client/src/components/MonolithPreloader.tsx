import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KineticDecryption from "./KineticDecryption";
import { prefersReducedMotion } from "../lib/runtimePerformance";

const SESSION_KEY = "monolith-preloader-seen";

export default function MonolithPreloader() {
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return false;
    if (prefersReducedMotion()) return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    return true;
  });

  useEffect(() => {
    if (!active) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => setActive(false), 1200);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="monolith-preloader"
          aria-hidden="true"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#020202]"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(55% 45% at 50% 52%, rgba(224,90,58,0.35), transparent 72%)",
              opacity: 0.55,
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center gap-5"
          >
            <KineticDecryption
              text="MONOLITH"
              className="font-display text-[clamp(2.5rem,8vw,5.5rem)] tracking-[0.2em] text-white"
            />
            <div className="h-px w-16 bg-white/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.8em] text-white/40">
              The Monolith Project
            </span>
          </motion.div>
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-px w-24 overflow-hidden bg-white/8">
              <motion.div
                className="h-full bg-[#E05A3A]"
                initial={{ scaleX: 0, transformOrigin: "left center" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
