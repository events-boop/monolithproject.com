import { useEffect, useState } from "react";

export function useResponsiveVideoSource(
  desktopSrc: string,
  mobileSrc?: string,
  breakpoint = 768,
) {
  const [src, setSrc] = useState(() => {
    if (typeof window !== "undefined" && mobileSrc && window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches) {
      return mobileSrc;
    }
    return desktopSrc;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const sync = () => {
      if (mobileSrc) {
        setSrc(mediaQuery.matches ? mobileSrc : desktopSrc);
      } else {
        setSrc(desktopSrc);
      }
    };

    sync();
    mediaQuery.addEventListener("change", sync);

    return () => {
      mediaQuery.removeEventListener("change", sync);
    };
  }, [breakpoint, desktopSrc, mobileSrc]);

  return src;
}
