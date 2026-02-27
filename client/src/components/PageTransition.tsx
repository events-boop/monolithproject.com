import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    return (
        <div className="relative w-full overflow-hidden bg-background">
            {/* The cinematic curtain wipe in */}
            <motion.div
                className="fixed top-0 left-0 w-full h-full bg-charcoal z-[999] pointer-events-none flex items-center justify-center font-display text-[10vw] text-white overflow-hidden"
                initial={{ y: "0%" }}
                animate={{ y: "-100%" }}
                exit={{ y: "0%" }}
                transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            >
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="tracking-widest"
                >
                </motion.div>
            </motion.div>

            {/* The main content that scales in slightly behind the curtain */}
            <motion.div
                initial={{ y: 100, scale: 0.95, filter: "blur(10px)", opacity: 0 }}
                animate={{ y: 0, scale: 1, filter: "blur(0px)", opacity: 1 }}
                exit={{ y: -50, scale: 0.98, filter: "blur(5px)", opacity: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
