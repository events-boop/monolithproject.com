import { motion, useReducedMotion } from "framer-motion";

interface UntoldButterflyLogoProps {
  className?: string;
  glow?: boolean;
  animateIn?: boolean;
}

const wingPaths = [
  "M58 50 C55 38, 45 18, 28 12 C16 8, 6 14, 8 26 C10 36, 18 44, 30 48 C38 50, 50 50, 58 50Z",
  "M58 50 C52 54, 40 62, 28 68 C18 73, 10 72, 10 64 C10 56, 18 52, 30 50 C42 48, 52 49, 58 50Z",
  "M62 50 C65 38, 75 18, 92 12 C104 8, 114 14, 112 26 C110 36, 102 44, 90 48 C82 50, 70 50, 62 50Z",
  "M62 50 C68 54, 80 62, 92 68 C102 73, 110 72, 110 64 C110 56, 102 52, 90 50 C78 48, 68 49, 62 50Z",
];

const antennaePaths = [
  "M60 42 C58 36, 52 30, 48 26",
  "M60 42 C62 36, 68 30, 72 26",
];

const restGlow = "drop-shadow(0 0 12px rgba(120, 200, 255, 0.6)) drop-shadow(0 0 4px rgba(120, 200, 255, 0.3))";
const brightGlow = "drop-shadow(0 0 22px rgba(120, 200, 255, 0.85)) drop-shadow(0 0 8px rgba(120, 200, 255, 0.55))";

export default function UntoldButterflyLogo({
  className = "w-16 h-16",
  glow = false,
  animateIn = false,
}: UntoldButterflyLogoProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animateIn && !reduceMotion;
  const baseStyle = glow ? { filter: restGlow } : undefined;

  return (
    <motion.svg
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={baseStyle}
      initial={shouldAnimate && glow ? { filter: restGlow } : false}
      animate={shouldAnimate && glow ? { filter: [restGlow, brightGlow, restGlow] } : undefined}
      transition={{ duration: 1.8, ease: "easeOut", delay: 0.9, times: [0, 0.55, 1] }}
    >
      {wingPaths.map((d, i) => (
        <motion.path
          key={`wing-${i}`}
          d={d}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
          animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            pathLength: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.07 },
            opacity: { duration: 0.3, delay: 0.1 + i * 0.07 },
          }}
        />
      ))}
      <motion.line
        x1="60"
        y1="42"
        x2="60"
        y2="72"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
        animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      {antennaePaths.map((d, i) => (
        <motion.path
          key={`ant-${i}`}
          d={d}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
          animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.45, delay: 0.7 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </motion.svg>
  );
}
