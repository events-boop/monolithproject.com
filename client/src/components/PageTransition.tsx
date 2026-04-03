import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface PageTransitionProps {
    children: React.ReactNode;
}

let hasCompletedInitialPageLoad = false;

export default function PageTransition({ children }: PageTransitionProps) {
    const [isTransitioning, setIsTransitioning] = useState(hasCompletedInitialPageLoad);

    useEffect(() => {
        if (!hasCompletedInitialPageLoad) {
            hasCompletedInitialPageLoad = true;
            return;
        }

        const timer = setTimeout(() => setIsTransitioning(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (!isTransitioning) {
        return <div className="relative w-full bg-background min-h-screen overflow-hidden">{children}</div>;
    }

    return (
        <div className="relative w-full bg-background min-h-screen overflow-hidden">
            <motion.div
                className="relative w-full min-h-screen"
                initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>

            {/* Cinema-Grade Shutter Reveal */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        className="fixed inset-0 z-[999] bg-[#050505] flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ 
                            y: "-100%",
                            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }
                        }}
                    >
                        {/* Ambient Static Overlay */}
                        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
                        
                        {/* Central Logo Resolver */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                           <div className="w-12 h-16 border border-white/20 relative">
                              <motion.div 
                                 className="absolute inset-x-0 bottom-0 bg-primary"
                                 initial={{ height: 0 }}
                                 animate={{ height: "70%" }}
                                 transition={{ duration: 0.5, ease: "easeOut" }}
                              />
                           </div>
                           <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-white/40">Resolving World</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle Post-Resolve Glow */}
            <motion.div
                className="fixed inset-0 z-[900] bg-white pointer-events-none"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            />
        </div>
    );
}
