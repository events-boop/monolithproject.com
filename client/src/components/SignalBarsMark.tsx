import { motion } from "framer-motion";

interface SignalBarsMarkProps {
  className?: string;
}

const bars = [
  { x: 9.5, restHeight: 14, peak: 1.08 },
  { x: 17.5, restHeight: 22, peak: 1.12 },
  { x: 25.5, restHeight: 18, peak: 1.1 },
  { x: 33.5, restHeight: 10, peak: 1.15 },
];

const BASELINE = 28;
const BAR_WIDTH = 5;

export default function SignalBarsMark({ className = "w-14 h-10" }: SignalBarsMarkProps) {
  return (
    <motion.svg
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ filter: "drop-shadow(0 0 10px rgba(232,184,109,0.45))" }}
    >
      {bars.map((bar, i) => (
        <motion.rect
          key={i}
          x={bar.x}
          y={BASELINE - bar.restHeight}
          width={BAR_WIDTH}
          height={bar.restHeight}
          rx={1}
          fill="#E8B86D"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: [0, bar.peak, 1],
            opacity: [0, 1, 0.9],
          }}
          transition={{
            duration: 1.4,
            delay: 0.1 + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.55, 1],
          }}
          style={{
            transformBox: "fill-box",
            transformOrigin: "center bottom",
          }}
        />
      ))}
      <motion.line
        x1="6"
        y1="28"
        x2="42"
        y2="28"
        stroke="#E8B86D"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeOpacity={0.45}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.45 }}
        transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
