import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { X } from "lucide-react";

const STORAGE_KEY = "monolith_cookie_consent";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Small delay so it doesn't flash on first paint
        const timer = setTimeout(() => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setVisible(true);
            }
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, "accepted");
        setVisible(false);
    };

    const decline = () => {
        localStorage.setItem(STORAGE_KEY, "declined");
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[9999] px-3 pb-3 md:px-6 md:pb-6"
                    style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))" }}
                    role="dialog"
                    aria-label="Cookie consent"
                >
                    <div
                        className="max-w-4xl mx-auto relative overflow-hidden"
                        style={{
                            background: "rgba(10,10,10,0.92)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                        }}
                    >
                        {/* Top accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-5">
                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-primary/70 mb-1.5">
                                    Cookie Notice
                                </p>
                                <p className="text-sm text-white/55 leading-relaxed">
                                    We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our{" "}
                                    <Link href="/cookies">
                                        <a className="text-white/75 underline underline-offset-2 hover:text-white transition-colors">
                                            Cookie Policy
                                        </a>
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy">
                                        <a className="text-white/75 underline underline-offset-2 hover:text-white transition-colors">
                                            Privacy Policy
                                        </a>
                                    </Link>
                                    .
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <button
                                    onClick={decline}
                                    className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/35 hover:text-white/60 transition-colors px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={accept}
                                    className="font-mono text-[9px] tracking-[0.25em] uppercase px-5 py-2.5 bg-primary text-white hover:bg-primary/85 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                >
                                    Accept All
                                </button>
                                <button
                                    onClick={decline}
                                    aria-label="Close"
                                    className="p-1.5 text-white/25 hover:text-white/60 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
