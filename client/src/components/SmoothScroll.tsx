
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "wouter";
import { useReducedMotion } from "framer-motion";

export default function SmoothScroll() {
    const [location] = useLocation();
    const lenisRef = useRef<Lenis | null>(null);
    const reqIdRef = useRef<number | null>(null);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        if (reduceMotion) return;
        // S-Tier Scrolling - Optimized for cinematic feel
        const lenis = new Lenis({
            duration: 1.4, // Slightly longer for luxurious feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            // Infinite scroll feel
        });

        lenisRef.current = lenis;

        // CSS Hook
        document.documentElement.classList.add('lenis', 'lenis-smooth');

        lenis.on('scroll', (e: any) => {
            // Expose velocity for skew effects
            document.documentElement.style.setProperty('--scroll-velocity', e.velocity);
        });

        function raf(time: number) {
            lenis.raf(time);
            reqIdRef.current = requestAnimationFrame(raf);
        }

        reqIdRef.current = requestAnimationFrame(raf);

        return () => {
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            document.documentElement.classList.remove('lenis', 'lenis-smooth');
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [reduceMotion]);

    // Reset scroll on route change
    useEffect(() => {
        // We can rely on wouter/browser default behavior, 
        // or force lenis to scroll to top.
        lenisRef.current?.scrollTo(0, { immediate: true });
    }, [location]);

    return null;
}
