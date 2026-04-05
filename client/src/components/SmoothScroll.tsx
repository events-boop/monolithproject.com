import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Lenis from "lenis";
import { shouldEnableSmoothScroll } from "@/lib/runtimePerformance";

export default function SmoothScroll() {
  const [location] = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const hasHandledInitialLocationRef = useRef(false);

  useEffect(() => {
    if (!shouldEnableSmoothScroll()) return;

    const lenis = new Lenis({
        duration: 0.95,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
    });

    lenisRef.current = lenis;
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on location change
  useEffect(() => {
    if (!hasHandledInitialLocationRef.current) {
      hasHandledInitialLocationRef.current = true;
      return;
    }

    if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
    } else {
        window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}
