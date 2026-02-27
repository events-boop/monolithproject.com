
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

interface GlitchTextProps {
    children: React.ReactNode;
    className?: string;
}

export default function GlitchText({ children, className = "" }: GlitchTextProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="relative z-10">{children}</span>

            {/* Glitch Layer 1 - Cyan Shift */}
            {isHovered && (
                <motion.span
                    className="absolute inset-0 z-0 text-cyan-400 opacity-70 mix-blend-screen"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{
                        x: [-2, 2, -1, 0],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: 0.2,
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                        repeatDelay: 0.1
                    }}
                >
                    {children}
                </motion.span>
            )}

            {/* Glitch Layer 2 - Red Shift */}
            {isHovered && (
                <motion.span
                    className="absolute inset-0 z-0 text-red-500 opacity-70 mix-blend-screen"
                    initial={{ x: 0, opacity: 0 }}
                    animate={{
                        x: [2, -2, 1, 0],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: 0.2,
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                        repeatDelay: 0.15
                    }}
                >
                    {children}
                </motion.span>
            )}
        </div>
    );
}
