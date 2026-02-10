
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { useEffect } from "react";

export default function GridBackground() {
    // Reveal animation value (0 to 100)
    const revealProgress = useMotionValue(0);

    useEffect(() => {
        // Animate the reveal on mount
        animate(revealProgress, 100, {
            duration: 2.0,
            ease: [0.16, 1, 0.3, 1], // "Expo out" feel for a luxurious snap
        });
    }, []);

    // Create the dynamic mask gradient
    const maskImage = useMotionTemplate`radial-gradient(circle at center, black ${revealProgress}%, transparent ${revealProgress}%)`;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
            {/* Base Grid with Reveal Animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }} // Subtly visible to keep contrast high
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
                    backgroundSize: "4rem 4rem",
                    maskImage: maskImage,
                    WebkitMaskImage: maskImage,
                }}
            />

            {/* Subtle Grain Overlay - Cinematic Texture */}
            <div className="absolute inset-0 opacity-[0.04] bg-noise mix-blend-overlay" />

            {/* Vignette to focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
}
