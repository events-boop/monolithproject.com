import { useEffect, useState } from "react";
import { shouldEnableAmbientVideo } from "@/lib/runtimePerformance";

export function useAmbientVideoEnabled(minWidth = 640) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      setEnabled(shouldEnableAmbientVideo(minWidth));
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync, { passive: true });

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [minWidth]);

  return enabled;
}
