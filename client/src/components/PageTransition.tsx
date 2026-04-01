import { motion } from "framer-motion";

interface PageTransitionProps {
    children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    return (
        <div className="relative w-full bg-background min-h-screen">
            {/* Cinematic Page Resolve (Simplified for stability) */}
            <motion.div
                className="relative w-full min-h-screen overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>

            {/* Subtle Overlay Resolve (Bypass Grid Shutter) */}
            <motion.div
                className="fixed inset-0 z-[900] bg-black pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
        </div>
    );
}

