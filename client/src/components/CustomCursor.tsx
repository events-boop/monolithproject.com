
import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Use motion values for raw position to feed into spring
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the movement
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Only activate on non-touch devices
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

        const moveCursor = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX - 10); // Center the 20px cursor
            mouseY.set(e.clientY - 10);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if hovering interactive element
            const isInteractive =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                window.getComputedStyle(target).cursor === "pointer";

            setIsHovered(!!isInteractive);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [isVisible, mouseX, mouseY]);

    if (!isVisible) return null;

    return (
        <>
            <style>{`
        @media (pointer: fine) {
          body, a, button, [role="button"] { cursor: none !important; }
        }
      `}</style>
            <motion.div
                className="fixed top-0 left-0 w-5 h-5 rounded-full border border-white pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: springX,
                    y: springY,
                }}
                animate={{
                    scale: isClicking ? 0.8 : isHovered ? 2.5 : 1,
                    backgroundColor: isHovered ? "white" : "transparent",
                }}
                transition={{
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                    backgroundColor: { duration: 0.2 }
                }}
            >
                {/* Inner dot just for non-hover state */}
                {!isHovered && (
                    <div className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full" />
                )}
            </motion.div>
        </>
    );
}
