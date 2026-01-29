/*
  DESIGN: Cosmic Mysticism - Event Countdown Timer
  - Large countdown display (Days, Hours, Minutes, Seconds)
  - Animated numbers
  - Golden accent color
*/

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetDate?: Date;
  eventName?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ 
  targetDate = new Date("2026-03-21T17:00:00"), // Default: Spring Equinox 2026
  eventName = "NEXT GATHERING"
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) return null;

  const timeUnits = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINUTES", value: timeLeft.minutes },
    { label: "SECONDS", value: timeLeft.seconds },
  ];

  return (
    <div className="text-center">
      {/* Event Label */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-muted-foreground text-sm tracking-ultra-wide uppercase mb-4"
      >
        — {eventName} —
      </motion.p>

      {/* Countdown Grid */}
      <div className="flex justify-center items-center gap-2 md:gap-4">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center"
          >
            {/* Number */}
            <div className="relative">
              <motion.span
                key={unit.value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground tabular-nums"
              >
                {String(unit.value).padStart(2, "0")}
              </motion.span>
            </div>
            
            {/* Label */}
            <span className="text-[10px] md:text-xs text-muted-foreground tracking-widest mt-1">
              {unit.label}
            </span>

            {/* Separator (except for last item) */}
            {index < timeUnits.length - 1 && (
              <span className="absolute hidden">:</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
