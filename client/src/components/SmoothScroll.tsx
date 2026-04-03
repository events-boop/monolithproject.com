import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Lenis from "lenis";

export default function SmoothScroll() {
  const [location] = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const hasHandledInitialLocationRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const conn = (navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }).connection;

    if (conn?.saveData) return;
    if (conn?.effectiveType && ["slow-2g", "2g"].includes(conn.effectiveType)) return;

    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
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
