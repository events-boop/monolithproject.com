import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Singleton Audio Context to prevent multiple instances
let audioCtx: AudioContext | null = null;

export default function SpatialAudioEngine() {
    const [isPlaying, setIsPlaying] = useState(false);
    const filterRef = useRef<BiquadFilterNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const initRef = useRef(false);

    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (initRef.current) return;
        initRef.current = true;

        // Create Master Volume
        const masterGain = audioCtx.createGain();
        masterGain.gain.value = 0; // start muted
        masterGain.connect(audioCtx.destination);
        gainRef.current = masterGain;

        // Create Deep Drone Oscillator (Sub Bass / Tension)
        const osc1 = audioCtx.createOscillator();
        osc1.type = "sawtooth";
        osc1.frequency.value = 55; // Deep A-note sub frequency

        const osc2 = audioCtx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = 54.5; // Slight detune for massive widening

        // Create Atmosphere Oscillator (High airy tension)
        const osc3 = audioCtx.createOscillator();
        osc3.type = "triangle";
        osc3.frequency.value = 110; 

        // Core Lowpass Filter (This will open and close on scroll)
        const lowpass = audioCtx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 200; // Muffled deeply by default
        lowpass.Q.value = 5; // Resonant peak
        filterRef.current = lowpass;

        // Routing
        osc1.connect(lowpass);
        osc2.connect(lowpass);
        osc3.connect(lowpass);
        lowpass.connect(masterGain);

        osc1.start();
        osc2.start();
        osc3.start();

        // Scroll Physics -> Filter Frequency mapping
        const handleScroll = () => {
            if (!filterRef.current || !audioCtx) return;
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            
            // Map scroll (0 to 1) exponentially to frequency (200Hz to 1200Hz)
            const targetFreq = 200 + Math.pow(scrollPercent, 2) * 1000;
            filterRef.current.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    };

    const toggleSound = () => {
        if (!initRef.current) initAudio();
        
        if (audioCtx?.state === "suspended") {
            audioCtx.resume();
        }

        const nextState = !isPlaying;
        setIsPlaying(nextState);

        if (gainRef.current && audioCtx) {
            // Smoothly fade the ambient drone in and out over 2 seconds (Luxurious UX)
            gainRef.current.gain.setTargetAtTime(nextState ? 0.08 : 0, audioCtx.currentTime, 0.5);
        }
    };

    return (
        <motion.button
            onClick={toggleSound}
            className="fixed bottom-8 left-8 z-[999999] group flex items-center gap-3 mix-blend-difference"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
        >
            <div className="flex items-center gap-[2px] h-3">
                {[1, 2, 3, 4].map((bar) => (
                    <motion.div
                        key={bar}
                        animate={{
                            height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%",
                        }}
                        transition={{
                            duration: 1 + bar * 0.2,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }}
                        className="w-[2px] bg-white rounded-full h-full opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                ))}
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 group-hover:text-white transition-colors mt-[1px]">
                {isPlaying ? "ATMOS: ON" : "ATMOS: OFF"}
            </span>
        </motion.button>
    );
}
