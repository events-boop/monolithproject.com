import { useMotionValue, useMotionTemplate, motion } from "framer-motion";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface HeroSpotlightProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

export default function HeroSpotlight({
    children,
    className,
    spotlightColor = "rgba(255, 255, 255, 0.1)",
}: HeroSpotlightProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            // inline-block keeps sizing to the text content so we don't clip letters at large sizes
            className={cn("group relative inline-block overflow-hidden", className)}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                }}
            />
            {children}
        </div>
    );
}
