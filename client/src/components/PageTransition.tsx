import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { shouldEnablePageTransitions } from "@/lib/runtimePerformance";

interface PageTransitionProps {
    children: React.ReactNode;
}

let hasCompletedInitialPageLoad = false;

export default function PageTransition({ children }: PageTransitionProps) {
    const [transitionsEnabled] = useState(() => shouldEnablePageTransitions());
    const [isTransitioning, setIsTransitioning] = useState(
        transitionsEnabled && hasCompletedInitialPageLoad,
    );

    useEffect(() => {
        if (!transitionsEnabled) return;
        if (!hasCompletedInitialPageLoad) {
            hasCompletedInitialPageLoad = true;
            return;
        }

        const timer = setTimeout(() => setIsTransitioning(false), 420);
        return () => clearTimeout(timer);
    }, [transitionsEnabled]);

    if (!transitionsEnabled || !isTransitioning) {
        return <div className="relative w-full bg-background min-h-screen overflow-hidden">{children}</div>;
    }

    return (
        <div className="relative w-full bg-background min-h-screen overflow-hidden">
            <motion.div
                className="relative w-full min-h-screen"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>

            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        className="fixed inset-0 z-[999] bg-[#050505] flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ 
                            y: "-100%",
                            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 }
                        }}
                    >
                        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
                        <motion.div 
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.04, opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                        >
                           <div className="w-12 h-16 border border-white/20 relative">
                              <motion.div 
                                 className="absolute inset-x-0 bottom-0 bg-primary"
                                 initial={{ height: 0 }}
                                 animate={{ height: "70%" }}
                                 transition={{ duration: 0.32, ease: "easeOut" }}
                              />
                           </div>
                           <span className="font-mono text-[9px] uppercase tracking-[0.6em] text-white/40">Resolving World</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[900] bg-white pointer-events-none"
                initial={{ opacity: 0.08 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            />
        </div>
    );
}
