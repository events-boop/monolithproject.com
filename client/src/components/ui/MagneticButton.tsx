import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number;
}

export default function MagneticButton({
    children,
    className = "",
    strength: _strength = 0,
}: MagneticButtonProps) {
    return (
        <motion.div
            className={`inline-block ${className}`}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0 }}
        >
            {children}
        </motion.div>
    );
}
