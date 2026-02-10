import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, HTMLMotionProps } from "framer-motion";

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
    children?: React.ReactNode;
    className?: string;
    noBorder?: boolean;
}

export default function SpotlightCard({
    children,
    className = "",
    noBorder = false,
    ...props
}: SpotlightCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            className={`relative group rounded-xl ${!noBorder ? 'border border-white/10' : ''} bg-black/50 overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            {...props}
        >
            {/* Background Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.08),
              transparent 80%
            )
          `,
                }}
            />

            {/* Border Spotlight Glow */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-500 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(212, 165, 116, 0.15),
              transparent 40%
            )
          `,
                }}
            />

            <div className="relative h-full z-20">
                {children}
            </div>
        </motion.div>
    );
}
