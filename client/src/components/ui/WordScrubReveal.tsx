import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface WordScrubRevealProps {
  text: string;
  className?: string;
}

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const filter = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className="mr-[0.25em] mb-[0.1em] will-change-[opacity,transform,filter]"
    >
      {children}
    </motion.span>
  );
}

export default function WordScrubReveal({ text, className = "" }: WordScrubRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 50%"],
  });

  const words = text.split(" ");
  const step = 1 / words.length;

  return (
    <div ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i * step;
        const end = start + step;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </div>
  );
}
