import { useEffect, useState } from "react";
import { shouldEnableAmbientVideo } from "@/lib/runtimePerformance";

export function useAmbientVideoEnabled(minWidth = 640) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${minWidth}px)`);
    const sync = () => {
      setEnabled(shouldEnableAmbientVideo(minWidth));
    };

    sync();
    media.addEventListener("change", sync);
    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync, { passive: true });

    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [minWidth]);

  return enabled;
}
