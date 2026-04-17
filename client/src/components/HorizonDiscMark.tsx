import { motion, useReducedMotion } from "framer-motion";

interface HorizonDiscMarkProps {
  className?: string;
}

export default function HorizonDiscMark({ className = "w-12 h-12 sm:w-14 sm:h-14" }: HorizonDiscMarkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      initial="rest"
      animate="arrive"
    >
      <motion.line
        x1="6"
        y1="42"
        x2="58"
        y2="42"
        stroke="#E8B86D"
        strokeWidth="1.25"
        strokeLinecap="round"
        variants={
          reduceMotion
            ? {
                rest: { pathLength: 1, opacity: 0.85 },
                arrive: { pathLength: 1, opacity: 0.85 },
              }
            : {
                rest: { pathLength: 0, opacity: 0 },
                arrive: {
                  pathLength: 1,
                  opacity: [0, 0.35, 1, 0.85],
                  transition: {
                    pathLength: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 1.6, times: [0, 0.35, 0.7, 1], ease: "easeOut" },
                  },
                },
              }
        }
      />
      <motion.circle
        cx="32"
        cy={reduceMotion ? 32 : 42}
        r="10"
        fill="url(#horizonDisc)"
        variants={
          reduceMotion
            ? { rest: { cy: 32, opacity: 1 }, arrive: { cy: 32, opacity: 1 } }
            : {
                rest: { cy: 56, opacity: 0, scale: 0.9 },
                arrive: {
                  cy: 32,
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.25, duration: 1, ease: [0.22, 1, 0.36, 1] },
                },
              }
        }
        style={{ transformOrigin: "32px 42px", filter: "drop-shadow(0 0 10px rgba(232,184,109,0.55))" }}
      />
      <defs>
        <radialGradient id="horizonDisc" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FBF5ED" />
          <stop offset="55%" stopColor="#E8B86D" />
          <stop offset="100%" stopColor="#C2703E" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}
