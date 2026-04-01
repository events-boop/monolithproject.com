import * as React from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { signalChirp } from "@/lib/SignalChirpEngine";

export default function CustomCursor() {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isClicking, setIsClicking] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(false);
    const [cursorText, setCursorText] = React.useState("");
    const [cursorImage, setCursorImage] = React.useState("");

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Ultra-smooth architectural spring physics
    const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    React.useEffect(() => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;

        const moveCursor = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = () => {
            setIsClicking(true);
            signalChirp.click();
        };
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const imageElement = target.closest('[data-cursor-image]');
            if (imageElement) {
                setCursorImage(imageElement.getAttribute('data-cursor-image') || "");
                if (!isHovered) signalChirp.hover();
                setIsHovered(true);
                return;
            } else {
                setCursorImage("");
            }

            const textElement = target.closest('[data-cursor-text]');
            if (textElement) {
                setCursorText(textElement.getAttribute('data-cursor-text') || "");
                setIsHovered(true);
                return;
            }

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

    const hasText = cursorText.length > 0;
    const hasImage = cursorImage.length > 0;
    const isExpanded = isHovered || hasText || hasImage;

    // Architectural sizing logic
    const size = hasImage ? 240 : hasText ? 60 : isHovered ? 40 : 10;

    return (
        <React.Fragment>
            <style>{`
        @media (pointer: fine) {
          body, a, button, [role="button"], input, textarea, select { cursor: none !important; }
        }
      `}</style>

            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center rounded-full overflow-hidden"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    mixBlendMode: !isExpanded ? "difference" : "normal",
                    backdropFilter: isHovered && !hasImage ? "blur(10px) brightness(1.1)" : "none",
                    WebkitBackdropFilter: isHovered && !hasImage ? "blur(10px) brightness(1.1)" : "none",
                    width: size,
                    height: size,
                }}
                animate={{
                    backgroundColor: hasText || hasImage ? "white" : isHovered ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 1)",
                    border: isHovered && !hasText && !hasImage ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
                    scale: isClicking ? 0.9 : 1,
                }}
                transition={{
                    scale: { type: "spring", stiffness: 400, damping: 30 },
                    backgroundColor: { duration: 0.15 },
                    width: { type: "spring", stiffness: 350, damping: 28 },
                    height: { type: "spring", stiffness: 350, damping: 28 },
                }}
            >
                <AnimatePresence>
                    {hasText && !hasImage && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-black font-mono text-[9px] font-bold tracking-widest uppercase absolute z-20"
                        >
                            {cursorText}
                        </motion.span>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {hasImage && (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            src={cursorImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover rounded-full z-10"
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div
                animate={{ 
                    scale: [1, 2],
                    opacity: [0.15, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                style={{ x: mouseX, y: mouseY }}
                className="fixed top-0 left-0 w-20 h-20 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[99998]"
            />
        </React.Fragment>
    );
}
