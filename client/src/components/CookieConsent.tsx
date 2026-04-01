import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { X } from "lucide-react";

const STORAGE_KEY = "monolith_cookie_consent";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    const resolveConsent = (value: "accepted" | "declined") => {
        localStorage.setItem(STORAGE_KEY, value);
        window.dispatchEvent(new CustomEvent("monolith:cookie-consent-resolved", { detail: value }));
        setVisible(false);
    };

    useEffect(() => {
        // Small delay so it doesn't flash on first paint
        const timer = setTimeout(() => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setVisible(true);
            }
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    const accept = () => {
        resolveConsent("accepted");
    };

    const decline = () => {
        resolveConsent("declined");
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 48, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 48, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[9999] px-3 pb-3 md:px-6 md:pb-6"
                    style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}
                    role="region"
                    aria-label="Cookie consent"
                >
                    <div
                        className="max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto relative overflow-hidden rounded-[28px]"
                        style={{
                            background: "rgba(8,8,10,0.97)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
                        }}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

                        <button
                            onClick={decline}
                            aria-label="Dismiss cookie notice"
                            className="absolute top-3 right-3 z-10 p-1.5 text-white/30 hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col gap-3 p-3.5 sm:p-5 sm:pr-14">
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="hidden sm:block font-mono text-[9px] tracking-[0.3em] uppercase text-primary/70 mb-1.5">
                                    Cookie Notice
                                </p>
                                <p className="text-[12px] sm:text-sm text-white/60 leading-5 sm:leading-relaxed max-w-2xl">
                                    We use cookies for analytics. Continuing means you agree to our{" "}
                                    <Link href="/cookies" className="text-white/75 underline underline-offset-2 hover:text-white transition-colors">
                                        Cookie Policy
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="text-white/75 underline underline-offset-2 hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                    .
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
                                <button
                                    onClick={decline}
                                    className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/35 hover:text-white/60 transition-colors px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-full"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={accept}
                                    className="font-mono text-[9px] tracking-[0.25em] uppercase px-5 py-2 bg-primary text-white hover:bg-primary/85 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-full flex-1 sm:flex-none text-center"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
