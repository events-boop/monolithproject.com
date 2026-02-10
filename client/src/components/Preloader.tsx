import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"dot" | "text" | "exit">("dot");

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem("monolith-loaded")) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase("text"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1100);
    const t3 = setTimeout(() => {
      sessionStorage.setItem("monolith-loaded", "1");
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Skip if already loaded
  if (sessionStorage.getItem("monolith-loaded")) return null;

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        key="preloader"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
        style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-3 h-3 bg-primary"
          />

          {/* Text */}
          <div className="overflow-hidden h-10">
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: phase === "dot" ? 40 : 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="font-display text-3xl tracking-wide text-foreground">
                THE MONOLITH PROJECT
              </span>
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "text" ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-[10px] text-muted-foreground tracking-[0.3em] uppercase"
          >
            Chicago Events Collective
          </motion.span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
