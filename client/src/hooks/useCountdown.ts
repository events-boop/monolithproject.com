import { useState, useEffect } from "react";

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const ZERO: CountdownValues = { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };

function calc(target: number): CountdownValues {
  const diff = Math.max(0, target - Date.now());
  if (diff === 0) return ZERO;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
}

/**
 * Shared countdown hook. Accepts a target timestamp (ms) and ticks every second.
 * Returns zeroed values with isExpired=true when target is null/undefined or in the past.
 */
export function useCountdown(target: number | null | undefined): CountdownValues {
  const [value, setValue] = useState<CountdownValues>(() =>
    target ? calc(target) : ZERO
  );

  useEffect(() => {
    if (!target || target <= Date.now()) {
      setValue(target ? calc(target) : ZERO);
      return;
    }

    // Immediate sync in case target changed
    setValue(calc(target));

    const id = setInterval(() => {
      const next = calc(target);
      setValue(next);
      if (next.isExpired) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [target]);

  return value;
}

/** Pad a number to two digits. */
export function padCountdown(n: number) {
  return String(n).padStart(2, "0");
}
