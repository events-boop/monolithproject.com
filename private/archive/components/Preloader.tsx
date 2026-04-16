import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import KineticDecryption from "./KineticDecryption";
import { signalChirp } from "@/lib/SignalChirpEngine";

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

    // Hyper-fast boot sequence for zero-latency entry 
    let currentLog = 0;
    const interval = setInterval(() => {
      currentLog += 1;
      setLogIndex(currentLog);
      signalChirp.hover();
      if (currentLog === BOOT_LOGS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          signalChirp.boot();
          setBooted(true);
        }, 50);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Auto-enter after boot completes
  useEffect(() => {
    if (!booted) return;

    // Brief chromatic glow before exit
    setGlowPulse(true);
    containerControls.start({
      scale: 0.96,
      filter: "blur(4px) brightness(1.25)",
      transition: { duration: 0.8, ease: "easeOut" },
    });

    const exitTimer = setTimeout(() => {
      setEntered(true);
      sessionStorage.setItem("monolith-loaded-v2", "1");
      onComplete();
    }, 400);

    return () => clearTimeout(exitTimer);
  }, [booted, containerControls, onComplete]);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, scale: 1.1, filter: "brightness(5)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
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
                      ? "0 0 40px rgba(255,255,255,0.8)"
                      : "0 0 0px rgba(255,255,255,0)",
                  }}
                  className="font-heavy text-[clamp(2.5rem,6vw,8rem)] tracking-[-0.04em] uppercase relative z-10 flex flex-col"
                >
                  <KineticDecryption text="MONOLITH" />
                  <span className="font-monolith text-[clamp(1rem,3vw,3rem)] tracking-[0.3em] leading-none mix-blend-overlay mt-[-1%] text-white/50">
                    <KineticDecryption text="PROJECT" />
                  </span>
                </motion.div>

                {/* Chromatic aberration layers */}
                {glowPulse && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-x-0 top-0 text-red-500 font-heavy text-[clamp(2.5rem,6vw,8rem)] tracking-[-0.04em] uppercase mix-blend-screen translate-x-1 sm:translate-x-2 blur-[2px] z-0 flex flex-col"
                    >
                      <span>MONOLITH</span>
                      <span className="font-monolith text-[clamp(1rem,3vw,3rem)] tracking-[0.3em] leading-none opacity-50 mt-[-1%]">PROJECT</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-x-0 top-0 text-blue-500 font-heavy text-[clamp(2.5rem,6vw,8rem)] tracking-[-0.04em] uppercase mix-blend-screen -translate-x-1 sm:-translate-x-2 blur-[2px] z-0 flex flex-col"
                    >
                      <span>MONOLITH</span>
                      <span className="font-monolith text-[clamp(1rem,3vw,3rem)] tracking-[0.3em] leading-none opacity-50 mt-[-1%]">PROJECT</span>
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
