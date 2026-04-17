import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const COORDINATES: Record<string, string> = {
  "/": "41.8781° N, 87.6298° W",
  "/about": "41.8827° N, 87.6233° W",
  "/schedule": "41.8889° N, 87.6339° W",
  "/archive": "41.8757° N, 87.6189° W",
  "/radio": "41.8919° N, 87.6051° W",
  "/story": "41.8800° N, 87.6400° W",
  "/chasing-sunsets": "41.8842° N, 87.6214° W",
  "fallback": "41.8781° N, 87.6298° W"
};

const SECTOR_IDS: Record<string, string> = {
  "/": "PRIMARY_CORE",
  "/about": "HISTORY_ARCHIVE",
  "/schedule": "TEMPORAL_GRID",
  "/archive": "COLLECTIVE_MEM",
  "/radio": "SIGNAL_RELAY",
  "/story": "GHOST_CIRCUIT",
  "/chasing-sunsets": "SOLAR_STATION",
  "fallback": "MONOLITH_OPS"
};

export default function CoordinateHUD() {
  const [location] = useLocation();
  const [coords, setCoords] = useState(COORDINATES["/"]);
  const [sector, setSector] = useState(SECTOR_IDS["/"]);

  useEffect(() => {
    // Exact match or fallback to closest parent or default
    const currentCoords = COORDINATES[location] || COORDINATES["fallback"];
    const currentSector = SECTOR_IDS[location] || SECTOR_IDS["fallback"];
    
    setCoords(currentCoords);
    setSector(currentSector);
  }, [location]);

  return (
    <div className="fixed bottom-8 left-8 z-[100] hidden lg:flex flex-col gap-1 pointer-events-none mix-blend-difference">
      <AnimatePresence mode="wait">
        <motion.div
          key={location}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.6, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-3">
             <div className="w-1 h-3 bg-white/40" />
             <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white">
               {coords}
             </span>
          </div>
          <div className="flex items-center gap-3 pl-4">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 whitespace-nowrap">
              SECTOR: {sector}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
