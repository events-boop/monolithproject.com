
import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number; // How strong the magnetic pull is (default: 0.5)
    onClick?: () => void;
}

export default function MagneticButton({
    children,
    className = "",
    strength = 0.5,
    onClick
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for the magnetic effect
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // Cache the bounding rect on mouseenter — avoids layout thrash per mousemove
    const rectRef = useRef<DOMRect | null>(null);

    const handleMouseEnter = () => {
        if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = rectRef.current;
        if (!rect) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        x.set((e.clientX - centerX) * strength);
        y.set((e.clientY - centerY) * strength);
    };

    const handleMouseLeave = () => {
        rectRef.current = null;
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick?.()}
            style={{ x: springX, y: springY }}
            className={`cursor-pointer ${className}`}
            whileTap={{ scale: 0.97 }}
        >
            {children}
        </motion.div>
    );
}
