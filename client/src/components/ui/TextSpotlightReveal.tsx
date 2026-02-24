import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface TextSpotlightRevealProps {
    children: React.ReactNode;
    className?: string;
    spotlightSize?: number;
    baseOpacity?: number;
}

export default function TextSpotlightReveal({
    children,
    className = "",
    spotlightSize = 350,
    baseOpacity = 0.15,
}: TextSpotlightRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
        mouseX.set(-1000);
        mouseY.set(-1000);
    };

    return (
        <div
            ref={ref}
            className={`relative group ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            data-cursor-text="REVEAL"
        >
            {/* The base, barely-visible text */}
            <div
                className="pointer-events-none select-none"
                style={{ opacity: baseOpacity }}
            >
                {children}
            </div>

            {/* The vividly revealed text hidden by the mask */}
            <motion.div
                className="absolute inset-0 pointer-events-none select-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                style={{
                    maskImage: useMotionTemplate`radial-gradient(
                        ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
                        black 15%,
                        transparent 80%
                    )`,
                    WebkitMaskImage: useMotionTemplate`radial-gradient(
                        ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
                        black 15%,
                        transparent 80%
                    )`,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
