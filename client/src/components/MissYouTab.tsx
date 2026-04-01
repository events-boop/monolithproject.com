import { useEffect, useRef } from "react";

/**
 * MissYouTab: Monolith Tactical Recall Protocol
 * Glitches the browser tab title when the user leaves the environment.
 */
export default function MissYouTab() {
  const originalTitle = useRef(document.title);
  const glitchInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const glitchSequence = [
      "SIGNAL_LOST_044",
      "RECONNECT_RITE_01",
      "MONOLITH_OS_WAIT",
      "DATA_LEAK_DETECTION",
      "REJOIN_THE_ROOM"
    ];

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Save the dynamic route title
        originalTitle.current = document.title;
        
        let index = 0;
        glitchInterval.current = setInterval(() => {
            document.title = `[ ! ] ${glitchSequence[index % glitchSequence.length]}`;
            index++;
        }, 2000);
      } else {
        // Restore environment
        if (glitchInterval.current) clearInterval(glitchInterval.current);
        document.title = originalTitle.current;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (glitchInterval.current) clearInterval(glitchInterval.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
