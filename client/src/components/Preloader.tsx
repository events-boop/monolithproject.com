import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";

const BOOT_LOGS = [
  "INITIALIZING SENSORY OVERLOAD [OK]",
  "CALIBRATING KINETIC OPTICS [OK]",
  "BYPASSING LINEAR TIME [OK]",
  "CONNECTING T0 THE MONOLITH...",
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [logIndex, setLogIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);

  const containerControls = useAnimation();

  useEffect(() => {
    const already = sessionStorage.getItem("monolith-loaded-v2");
    if (already) {
      setEntered(true);
      setTimeout(() => onComplete(), 50);
      return;
    }

    // Keep the first-load preloader short so content paints almost immediately.
    let currentLog = 0;
    const interval = setInterval(() => {
      currentLog += 1;
      setLogIndex(currentLog);
      if (currentLog === BOOT_LOGS.length - 1) {
        clearInterval(interval);
        setTimeout(() => setBooted(true), 120);
      }
    }, 110);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Auto-enter after boot completes
  useEffect(() => {
    if (!booted) return;

    // Brief chromatic glow before exit
    setGlowPulse(true);
    containerControls.start({
      scale: 0.96,
      filter: "blur(1.5px) brightness(1.15)",
      transition: { duration: 0.6, ease: "easeOut" },
    });

    const exitTimer = setTimeout(() => {
      setEntered(true);
      sessionStorage.setItem("monolith-loaded-v2", "1");
      setTimeout(() => onComplete(), 150);
    }, 260);

    return () => clearTimeout(exitTimer);
  }, [booted, containerControls, onComplete]);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, scale: 1.1, filter: "brightness(5)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] bg-[#050505] text-white flex items-center justify-center select-none overflow-hidden touch-none"
        >
          {/* Ambient Noise overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay pointer-events-none" />

          <motion.div
            animate={containerControls}
            className="w-full max-w-2xl px-8 flex flex-col items-center justify-center text-center relative z-10"
          >
            {/* Terminal Logs */}
            <div className="h-24 w-full flex flex-col items-start justify-end font-mono text-[10px] sm:text-xs text-primary/70 tracking-[0.2em] uppercase text-left mb-12 opacity-80">
              {BOOT_LOGS.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i <= logIndex ? 1 : 0, x: i <= logIndex ? 0 : -10 }}
                  transition={{ duration: 0.2 }}
                >
                  &gt; {log}
                </motion.div>
              ))}
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: booted ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: glowPulse ? 1.05 : 1,
                    textShadow: glowPulse
                      ? "0 0 30px rgba(255,255,255,0.8)"
                      : "0 0 0px rgba(255,255,255,0)",
                  }}
                  className="font-display text-4xl sm:text-6xl md:text-8xl tracking-tight uppercase relative z-10"
                >
                  MONOLITH PROJECT
                </motion.div>

                {/* Chromatic aberration layers */}
                {glowPulse && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 text-red-500 font-display text-4xl sm:text-6xl md:text-8xl tracking-tight uppercase mix-blend-screen translate-x-1 sm:translate-x-2 blur-[2px] z-0"
                    >
                      MONOLITH PROJECT
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 text-blue-500 font-display text-4xl sm:text-6xl md:text-8xl tracking-tight uppercase mix-blend-screen -translate-x-1 sm:-translate-x-2 blur-[2px] z-0"
                    >
                      MONOLITH PROJECT
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
