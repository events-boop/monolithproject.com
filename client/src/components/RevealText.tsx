
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div" | "p";
  delay?: number;
  blurStrength?: number;
  stagger?: number;
}

export default function RevealText({
  children,
  className = "",
  as: Tag = "h2",
  delay = 0,
  blurStrength = 12,
  stagger = 0.03, // Slightly faster default
}: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const words = children.split(" ");

  // Auto-tune stagger for longer text
  const safeStagger = children.length > 50 ? 0.01 : stagger;

  return (
    <Tag ref={ref} className={cn("inline-block leading-tight", className)}>
      <span className="sr-only">{children}</span>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-pre-wrap">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              initial={{
                opacity: 0,
                y: 12,
                filter: `blur(${blurStrength}px)`,
                scale: 1.05
              }}
              animate={isInView ? {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                scale: 1
              } : {}}
              transition={{
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9], // Cinematic cubic-bezier
                delay: delay + (i * 0.1) + (j * safeStagger),
              }}
              className="inline-block will-change-transform"
            >
              {char}
            </motion.span>
          ))}
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
