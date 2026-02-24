import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUI, DrawerType } from "../../contexts/UIContext";
import { lazy, Suspense, useEffect, useRef, useCallback } from "react";
import MagneticButton from "../MagneticButton";

const FAQSection = lazy(() => import("../FAQSection"));
const NewsletterSection = lazy(() => import("../NewsletterSection"));
const ConnectSection = lazy(() => import("../ConnectSection"));

function DrawerContent({ type }: { type: DrawerType }) {
    switch (type) {
        case "faq":
            return <FAQSection />;
        case "newsletter":
            return <NewsletterSection />;
        case "contact":
            return <ConnectSection />;
        case "about":
            return (
                <div className="p-12 md:p-24 flex flex-col justify-center min-h-full">
                    <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4 text-primary">The Monolith Project</span>
                    <h2 className="font-display text-5xl md:text-7xl mb-8 uppercase text-white tracking-tight">Gathering<br />Should Feel<br />Shared.</h2>
                    <p className="text-white/70 max-w-xl text-lg leading-relaxed mb-6">
                        We believe music carries emotion. We believe getting together should be intentional. The Monolith Project is an underground events collective based in Chicago focused on curation over capacity, and rhythm over everything.
                    </p>
                    <div className="h-px w-24 bg-border my-12" />
                </div>
            );
        default:
            return null;
    }
}

export default function OffCanvasDrawer() {
    const { activeDrawer, closeDrawer } = useUI();
    const panelRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Lock body scroll when any drawer is active
    useEffect(() => {
        if (activeDrawer) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [activeDrawer]);

    // Escape key to close
    useEffect(() => {
        if (!activeDrawer) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDrawer();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [activeDrawer, closeDrawer]);

    // Focus trap + auto-focus close button on open
    useEffect(() => {
        if (!activeDrawer || !panelRef.current) return;
        closeButtonRef.current?.focus();

        const panel = panelRef.current;
        const onTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;
            const focusable = panel.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            );
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        window.addEventListener("keydown", onTab);
        return () => window.removeEventListener("keydown", onTab);
    }, [activeDrawer]);

    return (
        <AnimatePresence>
            {activeDrawer && (
                <div className="fixed inset-0 z-[110] flex justify-end" aria-modal="true" role="dialog">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
                        onClick={closeDrawer}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        ref={panelRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.8 }}
                        className="relative w-full max-w-2xl h-full shadow-2xl overflow-y-auto"
                        style={{
                            background: "linear-gradient(145deg, rgba(20,20,20,0.95), rgba(10,10,12,0.98))",
                            borderLeft: "1px solid rgba(255,255,255,0.08)"
                        }}
                    >
                        {/* Ambient Noise for Glass effect */}
                        <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay" />

                        <div className="sticky top-0 right-0 z-50 flex justify-end p-6">
                            <MagneticButton>
                                <button
                                    ref={closeButtonRef}
                                    onClick={closeDrawer}
                                    aria-label="Close drawer"
                                    className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </MagneticButton>
                        </div>

                        <div className="relative z-10 w-full">
                            <Suspense fallback={<div className="p-24 text-white/40 font-mono text-sm tracking-widest uppercase">Loading interface...</div>}>
                                <DrawerContent type={activeDrawer} />
                            </Suspense>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
