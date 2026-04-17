import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/contexts/UIContext";

export default function SensoryOverloadOverlay() {
    const { isSensoryOverloadActive } = useUI();

    if (!isSensoryOverloadActive) return null;

    return (
        <div className="fixed inset-0 z-[100001] pointer-events-none select-none mix-blend-overlay">
            {/* 🎞️ SCANLINE INTERRUPTER */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_50%)] bg-[length:100%_4px] opacity-10"
            />

            {/* ⚡ CHROMATIC JITTER */}
            <motion.div
                animate={{ 
                    x: [0, -4, 4, -2, 2, 0],
                    y: [0, 2, -2, 1, -1, 0],
                    opacity: [0.1, 0.4, 0.2, 0.3, 0.15]
                }}
                transition={{ duration: 0.15, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/5 mix-blend-screen"
            />
            <motion.div
                animate={{ 
                    x: [0, 4, -4, 2, -2, 0],
                    y: [0, -2, 2, -1, 1, 0],
                    opacity: [0.1, 0.3, 0.2, 0.4, 0.1]
                }}
                transition={{ duration: 0.12, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500/5 mix-blend-screen"
            />

            {/* 📡 NOISE BURST */}
            <div className="absolute inset-0 opacity-[0.04]">
                <svg width="100%" height="100%">
                    <filter id="noiseFilter">
                        <feTurbulence 
                            type="fractalNoise" 
                            baseFrequency="0.65" 
                            numOctaves="3" 
                            stitchTiles="stitch" 
                        />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* 📽️ SVG DISTORTION GATE (Links to global cinematic-glitch) */}
            <div className="absolute inset-0 backdrop-grayscale-[0.5] backdrop-brightness-110" style={{ filter: "url(#cinematic-glitch)" }} />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div 
                    animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [0.3, 0.7, 0.4, 0.8, 0.5] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    className="text-[10vw] font-bold text-white/20 font-mono select-none pointer-events-none"
                >
                    SENSORY_OVERLOAD
                </motion.div>
            </div>
        </div>
    );
}
