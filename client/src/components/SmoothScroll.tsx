
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "wouter";

export default function SmoothScroll() {
    const [location] = useLocation();
    const lenisRef = useRef<Lenis | null>(null);
    const reqIdRef = useRef<number | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential easing
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            reqIdRef.current = requestAnimationFrame(raf);
        }

        reqIdRef.current = requestAnimationFrame(raf);

        return () => {
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // Reset scroll on route change
    useEffect(() => {
        // We can rely on wouter/browser default behavior, 
        // or force lenis to scroll to top.
        lenisRef.current?.scrollTo(0, { immediate: true });
    }, [location]);

    return null;
}
