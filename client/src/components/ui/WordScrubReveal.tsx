import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";

// Pre-reveal opacity floor. Kept high enough that white text clears WCAG AA
// (~9:1 on the near-black background) at every frame of the scrub, so the
// audited contrast score is deterministic. The blur + translate carry the
// reveal motion, not opacity.
const REVEAL_OPACITY_FLOOR = 0.7;

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
  const opacity = useTransform(progress, range, [REVEAL_OPACITY_FLOOR, 1]);
  const y = useTransform(progress, range, [8, 0]);
  const filter = useTransform(progress, range, ["blur(8px)", "blur(0px)"]);

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className="mr-[0.25em] mb-[0.1em] will-change-[opacity,transform,filter] word-scrub-word"
    >
      {children}
    </motion.span>
  );
}

export default function WordScrubReveal({
  text,
  className = "",
}: WordScrubRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 50%"],
  });

  // Reduced-motion: render the text plainly at full opacity, no scrub animation.
  if (prefersReducedMotion) {
    return <div className={className}>{text}</div>;
  }

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
