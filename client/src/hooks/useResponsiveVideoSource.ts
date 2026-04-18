import { useEffect, useState } from "react";

function isMobileViewport(breakpoint: number) {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoint;
}

export function useResponsiveVideoSource(
  desktopSrc: string,
  mobileSrc?: string,
  breakpoint = 768,
) {
  const [src, setSrc] = useState(() => {
    if (mobileSrc && isMobileViewport(breakpoint)) {
      return mobileSrc;
    }

    return desktopSrc;
  });

  useEffect(() => {
    const sync = () => {
      if (mobileSrc && isMobileViewport(breakpoint)) {
        setSrc(mobileSrc);
        return;
      }

      setSrc(desktopSrc);
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    window.addEventListener("orientationchange", sync, { passive: true });

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [breakpoint, desktopSrc, mobileSrc]);

  return src;
}
