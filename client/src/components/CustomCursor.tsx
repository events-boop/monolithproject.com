import * as React from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { signalChirp } from "@/lib/SignalChirpEngine";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isClicking, setIsClicking] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [cursorText, setCursorText] = React.useState("");
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const coreX = useSpring(mouseX, { damping: 28, stiffness: 420, mass: 0.35 });
  const coreY = useSpring(mouseY, { damping: 28, stiffness: 420, mass: 0.35 });
  const ringX = useSpring(mouseX, { damping: 32, stiffness: 260, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 32, stiffness: 260, mass: 0.5 });

  React.useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;

    const root = document.documentElement;
    root.dataset.desktopChrome = "true";

    const updateHoverState = (target: HTMLElement | null) => {
      if (!target) {
        setIsHovered(false);
        setCursorText("");
        return;
      }

      const textElement = target.closest("[data-cursor-text]") as HTMLElement | null;
      const magneticElement = target.closest("[data-cursor-magnetic]") as HTMLElement | null;
      const interactiveElement = target.closest(
        'a, button, [role="button"], input, textarea, select, summary, [data-cursor-interactive]',
      ) as HTMLElement | null;

      const nextText = textElement?.getAttribute("data-cursor-text") || "";
      const isInteractive = !!textElement || !!magneticElement || !!interactiveElement;

      setCursorText(nextText);
      setIsHovered(isInteractive);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setIsVisible(true);

      const target = event.target as HTMLElement | null;
      let x = event.clientX;
      let y = event.clientY;

      const magneticElement = target?.closest("[data-cursor-magnetic]") as HTMLElement | null;
      if (magneticElement) {
        const rect = magneticElement.getBoundingClientRect();
        x += (rect.left + rect.width / 2 - x) * 0.18;
        y += (rect.top + rect.height / 2 - y) * 0.18;
      }

      mouseX.set(x);
      mouseY.set(y);
      root.style.setProperty("--mouse-x", `${x}px`);
      root.style.setProperty("--mouse-y", `${y}px`);
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      updateHoverState(event.target as HTMLElement | null);
    };

    const handlePointerDown = () => {
      setIsClicking(true);
      signalChirp.click();
    };

    const handlePointerUp = () => setIsClicking(false);
    const handlePointerLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
      setCursorText("");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
      delete root.dataset.desktopChrome;
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  const hasText = cursorText.length > 0;
  const ringSize = hasText ? 88 : isHovered ? 42 : 28;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: hasText ? 0.96 : isHovered ? 0.9 : 0.55,
          scale: isClicking ? 0.92 : 1,
          borderColor: hasText ? "rgba(255,255,255,0.88)" : isHovered ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.18)",
          backgroundColor: hasText ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.04)",
        }}
        transition={{
          scale: { type: "spring", stiffness: 320, damping: 24 },
          opacity: { duration: 0.16 },
          backgroundColor: { duration: 0.16 },
          borderColor: { duration: 0.16 },
          width: { type: "spring", stiffness: 320, damping: 26 },
          height: { type: "spring", stiffness: 320, damping: 26 },
        }}
      >
        <AnimatePresence>
          {hasText ? (
            <motion.span
              key={cursorText}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center px-3 text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-black"
            >
              {cursorText}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] h-2.5 w-2.5 rounded-full bg-white"
        style={{
          x: coreX,
          y: coreY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
        animate={{
          opacity: isHovered ? 0.92 : 1,
          scale: isClicking ? 0.7 : hasText ? 0 : isHovered ? 1.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      />
    </>
  );
}
