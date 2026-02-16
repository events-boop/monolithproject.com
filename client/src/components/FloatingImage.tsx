
import { motion, useSpring, MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

interface FloatingImageProps {
    src: string;
    alt: string;
    isVisible: boolean;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
    aspectRatio?: string; // e.g. "aspect-[4/5]" or "aspect-video"
}

export default function FloatingImage({
    src,
    alt,
    isVisible,
    mouseX,
    mouseY,
    aspectRatio = "aspect-[4/3]"
}: FloatingImageProps) {
    // Smooth springs for the image movement - slower/heavier than the cursor
    const springConfig = { damping: 20, stiffness: 200, mass: 0.8 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // Tilt effect based on velocity would be cool, but simple follow is S-tier enough for now.

    return (
        <motion.div
            style={{
                x,
                y,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
                zIndex: 50
            }}
            className="fixed top-0 left-0 hidden md:block"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.8,
                    rotate: isVisible ? 0 : 5 // Subtle rotation on exit
                }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className={`w-[280px] ${aspectRatio} rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 relative bg-charcoal`}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay" />
            </motion.div>
        </motion.div>
    );
}
