import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hide the preloader after animation
        const timer = setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.style.opacity = "0";
                containerRef.current.style.pointerEvents = "none";
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ease-out"
        >
            <div className="relative text-center">
                {/* Animated geometric loader */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                        className="absolute inset-0 border-t-2 border-primary rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                        className="absolute inset-4 border-r-2 border-primary/50 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                        className="absolute inset-8 bg-primary/20 rounded-full blur-md"
                    />
                </div>

                {/* Counter or Text */}
                <div ref={textRef} className="overflow-hidden h-8">
                    <motion.div
                        animate={{ y: -100 }}
                        transition={{ duration: 2, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div className="h-8 flex items-center justify-center font-display text-2xl tracking-widest text-primary">INITIALIZING</div>
                        <div className="h-8 flex items-center justify-center font-display text-2xl tracking-widest text-primary">LOADING ASSETS</div>
                        <div className="h-8 flex items-center justify-center font-display text-2xl tracking-widest text-primary">MONOLITH PROJECT</div>
                        <div className="h-8 flex items-center justify-center font-display text-2xl tracking-widest text-primary">WELCOME</div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
