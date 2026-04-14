import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  initialDelay?: number;
  staggerDelay?: number;
  duration?: number;
  preserveWhitespace?: boolean;
}

export default function SplitText({ 
  text, 
  className, 
  initialDelay = 0.1, 
  staggerDelay = 0.025,
  duration = 0.85,
  preserveWhitespace = true
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  // Split text into characters.
  const characters = text.split("");

  return (
    <span ref={ref} className={cn("inline-block overflow-hidden relative", className)} style={{ whiteSpace: preserveWhitespace ? "pre-wrap" : "normal" }}>
      {characters.map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          initial={{ opacity: 0, y: "130%", rotateZ: 2, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: "0%", rotateZ: 0, scale: 1 } : {}}
          transition={{
            duration: duration,
            ease: [0.22, 1, 0.36, 1], // luxe ease
            delay: initialDelay + index * staggerDelay,
          }}
          className={cn(
            "inline-block will-change-transform origin-bottom",
            char === " " ? "w-[0.25em]" : ""
          )}
        >
          {char === " " && preserveWhitespace ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
