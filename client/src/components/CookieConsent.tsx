import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { X } from "lucide-react";
import {
    COOKIE_CONSENT_RESOLVED_EVENT,
    COOKIE_CONSENT_STORAGE_KEY,
} from "@/lib/cookieConsent";

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    const resolveConsent = (value: "accepted" | "declined") => {
        localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
        window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_RESOLVED_EVENT, { detail: value }));
        setVisible(false);
    };

    useEffect(() => {
        // Delay until the cinematic shell has had room to settle.
        const timer = setTimeout(() => {
            if (!localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)) {
                setVisible(true);
            }
        }, 3600);
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
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-4 right-4 z-[9999] w-auto max-w-[20rem] pointer-events-auto"
                    style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
                    role="region"
                    aria-label="Cookie consent"
                >
                    <div
                        className="relative overflow-hidden rounded-lg"
                        style={{
                            background: "rgba(8,8,10,0.86)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            boxShadow: "0 18px 44px rgba(0,0,0,0.28)",
                            backdropFilter: "blur(18px)",
                        }}
                    >
                        <button
                            onClick={decline}
                            aria-label="Dismiss cookie notice"
                            className="absolute right-2.5 top-2.5 z-10 rounded-full p-1 text-white/30 transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex flex-col gap-2.5 p-3 pr-8">
                            <div className="min-w-0">
                                <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-primary/75">
                                    Analytics Consent
                                </p>
                                <p className="mt-1 text-[11px] leading-relaxed text-white/60">
                                    We use lightweight analytics. <Link href="/cookies" className="text-white/75 underline underline-offset-2">Policy</Link>.
                                </p>
                            </div>

                            <div className="flex w-full items-center gap-2">
                                <button
                                    onClick={decline}
                                    className="btn-pill-outline btn-pill-compact"
                                >
                                    No Analytics
                                </button>
                                <button
                                    onClick={accept}
                                    className="btn-pill-monolith btn-pill-compact flex-1 sm:flex-none"
                                >
                                    Allow
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
