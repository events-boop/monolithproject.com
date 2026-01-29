
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "text">("default");
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;

            // Check for clickable elements
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer');

            // Check for text inputs
            const isText =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable ||
                window.getComputedStyle(target).cursor === 'text';

            if (isText) {
                setCursorVariant("text");
            } else if (isClickable) {
                setCursorVariant("hover");
            } else {
                setCursorVariant("default");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    const variants = {
        default: {
            height: 32,
            width: 32,
            backgroundColor: "rgba(255, 255, 255, 0)",
            border: "1px solid rgba(212, 165, 116, 0.5)", // Gold border
        },
        hover: {
            height: 64,
            width: 64,
            backgroundColor: "rgba(212, 165, 116, 0.1)",
            border: "1px solid rgba(212, 165, 116, 0.8)",
        },
        text: {
            height: 32,
            width: 2,
            backgroundColor: "rgba(212, 165, 116, 1)",
            border: "none",
            borderRadius: 0,
        }
    };

    return (
        <>
            {/* Main Dot - Always visible, blends */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#D4A574] pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Adaptive Ring/Shape */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                variants={variants}
                animate={cursorVariant}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
            />
        </>
    );
}
