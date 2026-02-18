import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, ArrowRight } from "lucide-react";

const SESSION_KEY = "cs-optin-dismissed";

export default function ChasingSunsetsOptIn() {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Show after a short delay, once per session
    useEffect(() => {
        if (sessionStorage.getItem(SESSION_KEY)) return;
        const id = setTimeout(() => setVisible(true), 900);
        return () => clearTimeout(id);
    }, []);

    const dismiss = () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    source: "chasing-sunsets-optin",
                    tags: ["chasing-sunsets", "2026-season"],
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.ok) {
                setErrorMsg(data?.error?.message || "Something went wrong. Try again.");
                setStatus("error");
            } else {
                setStatus("success");
                sessionStorage.setItem(SESSION_KEY, "1");
            }
        } catch {
            setErrorMsg("Network error. Please try again.");
            setStatus("error");
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
                        onClick={dismiss}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cs-optin-title"
                        initial={{ opacity: 0, y: 32, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-md pointer-events-auto overflow-hidden"
                            style={{
                                background: "linear-gradient(145deg, #1A0F00 0%, #2C1810 60%, #1A0A00 100%)",
                                border: "1px solid rgba(232,184,109,0.25)",
                                boxShadow: "0 0 80px rgba(232,184,109,0.12), 0 32px 64px rgba(0,0,0,0.6)",
                            }}
                        >
                            {/* Top gold glow bar */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8B86D] to-transparent opacity-80" />

                            {/* Background texture */}
                            <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />

                            {/* Radial glow */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
                                style={{ background: "rgba(232,184,109,0.12)" }} />

                            {/* Close button */}
                            <button
                                onClick={dismiss}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="relative px-8 pt-10 pb-8">
                                {status === "success" ? (
                                    /* Success state */
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-6"
                                    >
                                        <div className="w-14 h-14 rounded-full border border-[#E8B86D]/40 flex items-center justify-center mx-auto mb-5"
                                            style={{ background: "rgba(232,184,109,0.1)" }}>
                                            <Sun className="w-7 h-7 text-[#E8B86D]" />
                                        </div>
                                        <h2 className="font-display text-2xl text-white mb-2 tracking-wide">YOU'RE IN</h2>
                                        <p className="text-white/60 text-sm font-mono tracking-widest uppercase">
                                            See you at golden hour.
                                        </p>
                                        <button
                                            onClick={dismiss}
                                            className="mt-6 text-xs font-mono tracking-widest uppercase text-[#E8B86D]/60 hover:text-[#E8B86D] transition-colors"
                                        >
                                            Close
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* Default opt-in state */
                                    <>
                                        {/* Icon + kicker */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ background: "rgba(232,184,109,0.15)", border: "1px solid rgba(232,184,109,0.3)" }}>
                                                <Sun className="w-5 h-5 text-[#E8B86D]" />
                                            </div>
                                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E8B86D]/70">
                                                Chasing Sun(Sets) · 2026 Season
                                            </span>
                                        </div>

                                        {/* Headline */}
                                        <h2 id="cs-optin-title" className="font-display text-3xl md:text-4xl text-white leading-[1.05] mb-3 tracking-wide uppercase">
                                            Golden Hour<br />
                                            <span style={{ color: "#E8B86D" }}>Is Coming Back</span>
                                        </h2>

                                        <p className="text-white/60 text-sm leading-relaxed mb-2">
                                            Rooftop shows. Sunset sets. The 2026 season is being built right now.
                                        </p>
                                        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-7">
                                            Get early access · Presale tickets · First to know
                                        </p>

                                        {/* Divider */}
                                        <div className="h-px mb-6" style={{ background: "linear-gradient(to right, rgba(232,184,109,0.3), transparent)" }} />

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="your@email.com"
                                                    required
                                                    className="w-full px-4 py-3 text-sm text-white placeholder-white/30 bg-white/5 border focus-visible:outline-none focus-visible:ring-2 transition-all"
                                                    style={{
                                                        borderColor: "rgba(232,184,109,0.2)",
                                                        borderRadius: 0,
                                                    }}
                                                    onFocus={(e) => e.currentTarget.style.borderColor = "rgba(232,184,109,0.6)"}
                                                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(232,184,109,0.2)"}
                                                />
                                            </div>

                                            {status === "error" && (
                                                <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={status === "loading"}
                                                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-60"
                                                style={{
                                                    background: "linear-gradient(135deg, #E8B86D, #C2703E)",
                                                    color: "#1A0F00",
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                                            >
                                                {status === "loading" ? (
                                                    <span className="animate-pulse">Joining...</span>
                                                ) : (
                                                    <>
                                                        Get Early Access
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        {/* Footer note */}
                                        <p className="mt-4 text-center text-white/25 text-[10px] font-mono tracking-widest uppercase">
                                            No spam · Unsubscribe anytime
                                        </p>

                                        {/* Skip link */}
                                        <button
                                            onClick={dismiss}
                                            className="mt-3 w-full text-center text-white/30 text-[10px] font-mono tracking-widest uppercase hover:text-white/50 transition-colors"
                                        >
                                            Maybe later
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Bottom gold glow bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8B86D]/30 to-transparent" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
