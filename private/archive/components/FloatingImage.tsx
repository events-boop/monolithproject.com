
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
    const springConfig = { damping: 25, stiffness: 220, mass: 1.2 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    // We can also extract velocity for tilt, but let's keep it highly grounded
    return (
        <motion.div
            style={{
                x,
                y,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
                zIndex: 0 // Place it behind the text content
            }}
            className="fixed top-0 left-0 hidden md:block"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{
                    opacity: isVisible ? 0.8 : 0,
                    scale: isVisible ? 1 : 0.8,
                    rotate: isVisible ? 0 : 3,
                    filter: isVisible ? "blur(0px)" : "blur(10px)"
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`w-[480px] h-[580px] rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 relative bg-charcoal`}
            >
                <img
                    src={src}
                    alt={alt}
                    style={{ filter: 'url(#liquid-distortion) grayscale(100%)' }}
                    className="w-full h-full object-cover mix-blend-luminosity will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </motion.div>
        </motion.div>
    );
}
