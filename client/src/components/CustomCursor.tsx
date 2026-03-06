import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [cursorText, setCursorText] = useState("");
    const [cursorImage, setCursorImage] = useState("");

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring physics configuration for the heavy trailing effect (Premium feel)
    const springConfig = { damping: 28, stiffness: 300, mass: 0.8 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

        const moveCursor = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            // Adjust center offset dynamically based on scale logic, but keep raw coords here
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const imageElement = target.closest('[data-cursor-image]');
            if (imageElement) {
                setCursorImage(imageElement.getAttribute('data-cursor-image') || "");
                setIsHovered(true);
                return;
            } else {
                setCursorImage("");
            }

            // Look for custom text to inject into the cursor ring
            const textElement = target.closest('[data-cursor-text]');
            if (textElement) {
                setCursorText(textElement.getAttribute('data-cursor-text') || "");
                setIsHovered(true);
                return;
            }

            // Standard interactive elements
            const isInteractive =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                window.getComputedStyle(target).cursor === "pointer";

            setIsHovered(!!isInteractive);
            setCursorText("");
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

    // Derived states
    const hasText = cursorText.length > 0;
    const hasImage = cursorImage.length > 0;
    const isExpanded = isHovered || hasText || hasImage;

    // Dynamic sizing (Make it massive for pictures, normal for text)
    const size = hasImage ? 280 : hasText ? 80 : isHovered ? 50 : 16;
    const offset = size / 2;

    return (
        <>
            <style>{`
        @media (pointer: fine) {
          body, a, button, [role="button"], input, textarea, select { cursor: none !important; }
        }
      `}</style>

            {/* Main Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference flex items-center justify-center rounded-full overflow-hidden"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: size,
                    height: size,
                }}
                animate={{
                    backgroundColor: isExpanded ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
                    border: isExpanded ? "0px solid transparent" : "2px solid rgba(255, 255, 255, 1)",
                    scale: isClicking ? 0.8 : 1,
                }}
                transition={{
                    scale: { type: "spring", stiffness: 400, damping: 28 },
                    backgroundColor: { duration: 0.2 },
                    border: { duration: 0.2 },
                    width: { type: "spring", stiffness: 300, damping: 25 },
                    height: { type: "spring", stiffness: 300, damping: 25 },
                }}
            >
                {/* Injected Text */}
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: hasText && !hasImage ? 1 : 0, scale: hasText && !hasImage ? 1 : 0.5 }}
                    className="text-black font-display text-[10px] font-bold tracking-widest uppercase absolute z-20"
                >
                    {cursorText}
                </motion.span>

                {/* Injected Image for Artist Hover */}
                {hasImage && (
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        src={cursorImage}
                        alt="cursor visual"
                        className="absolute inset-0 w-full h-full object-cover rounded-full z-10"
                    />
                )}

                {/* Inner dot just for non-hover minimal state */}
                {!isExpanded && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full"
                    />
                )}
            </motion.div>
        </>
    );
}
