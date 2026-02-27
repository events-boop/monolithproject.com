
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
            duration: 1.1, // Reduced from 1.4 for a snappier feel while maintaining physics stability
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.05,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        // CSS Hook
        document.documentElement.classList.add('lenis', 'lenis-smooth');

        lenis.on('scroll', (e: any) => {
            // Expose velocity for skew effects
            document.documentElement.style.setProperty('--scroll-velocity', e.velocity);
        });

        // Idle-aware RAF: stop the loop when Lenis is done animating, resume on input
        let running = false;

        function raf(time: number) {
            lenis.raf(time);
            if (lenis.isScrolling) {
                reqIdRef.current = requestAnimationFrame(raf);
            } else {
                running = false;
                reqIdRef.current = null;
            }
        }

        function wake() {
            if (running) return;
            running = true;
            reqIdRef.current = requestAnimationFrame(raf);
        }

        // Kick-start on user input — covers wheel, touch, keyboard scroll
        const opts: AddEventListenerOptions = { passive: true };
        window.addEventListener("wheel", wake, opts);
        window.addEventListener("touchstart", wake, opts);
        window.addEventListener("keydown", wake, opts);
        lenis.on("scroll", wake);

        // Initial kick
        wake();

        return () => {
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            window.removeEventListener("wheel", wake);
            window.removeEventListener("touchstart", wake);
            window.removeEventListener("keydown", wake);
            document.documentElement.classList.remove('lenis', 'lenis-smooth');
            lenis.destroy();
            lenisRef.current = null;
        };
    }, [reduceMotion]);

    // Reset scroll on route change (including reduced-motion users, where Lenis is disabled).
    useEffect(() => {
        if (reduceMotion) {
            window.scrollTo(0, 0);
            return;
        }
        lenisRef.current?.scrollTo(0, { immediate: true });
    }, [location, reduceMotion]);

    return null;
}
