import * as React from "react";
import { useLocation } from "wouter";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { signalChirp } from "@/lib/SignalChirpEngine";

export default function AmbientAudioEngine() {
    const [audioAllowed, setAudioAllowed] = React.useState(false);
    const audioCtxRef = React.useRef<AudioContext | null>(null);
    const filterRef = React.useRef<BiquadFilterNode | null>(null);
    const gainRef = React.useRef<GainNode | null>(null);
    const [location] = useLocation();

    // Initialize Web Audio Engine
    React.useEffect(() => {
        if (!audioAllowed) return;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 3); // Very subtle sub-bass
        masterGain.connect(ctx.destination);
        gainRef.current = masterGain;

        // Sub-Bass Drone Oscillator
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // Deep Low A
        
        // Secondary harmonic
        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(110, ctx.currentTime); // One octave higher

        // Low-pass filter tied to scroll
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(200, ctx.currentTime); // Start muffled
        filter.Q.value = 1.5;
        filterRef.current = filter;

        // Routing
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();

        return () => {
            masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
            setTimeout(() => {
                osc1.stop();
                osc2.stop();
                ctx.close();
            }, 1000);
        };
    }, [audioAllowed]);

    // Scroll mapping to Filter frequency
    React.useEffect(() => {
        if (!audioAllowed || !filterRef.current || !audioCtxRef.current) return;

        const handleScroll = () => {
            const y = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(Math.max(y / docHeight, 0), 1);
            
            // Map 0-1 to 100Hz - 800Hz
            const targetFreq = 100 + (scrollPercent * 700);
            
            // Smoothly ramp filter frequency
            const ctx = audioCtxRef.current;
            if (ctx) {
                filterRef.current?.frequency.linearRampToValueAtTime(targetFreq, ctx.currentTime + 0.1);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial position

        return () => window.removeEventListener("scroll", handleScroll);
    }, [audioAllowed, location]);

    const toggleAudio = () => {
        signalChirp.click();
        if (audioAllowed) {
            // Fade out smoothly
            if (audioCtxRef.current && gainRef.current) {
                gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1);
                setTimeout(() => setAudioAllowed(false), 1000);
            } else {
                setAudioAllowed(false);
            }
        } else {
            setAudioAllowed(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[99] hidden md:block">
            <MagneticButton strength={0.3}>
                <button
                    onClick={toggleAudio}
                    onMouseEnter={() => signalChirp.hover()}
                    aria-label={audioAllowed ? "Mute Ambient Architecture" : "Enable Ambient Architecture"}
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-700 backdrop-blur-xl ${
                        audioAllowed 
                            ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_20px_rgba(224,90,58,0.2)]" 
                            : "border-white/10 bg-black/40 text-white/40 hover:text-white/80 hover:border-white/30"
                    }`}
                >
                    <AnimatePresence mode="wait">
                        {audioAllowed ? (
                            <motion.div
                                key="playing"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                                <Volume2 className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="muted"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <VolumeX className="w-5 h-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </MagneticButton>
        </div>
    );
}
