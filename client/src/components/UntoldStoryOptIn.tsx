import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";

const SESSION_KEY = "us-optin-dismissed";

export default function UntoldStoryOptIn() {
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
                    source: "untold-story-optin",
                    tags: ["untold-story", "season-3"],
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
                        className="fixed inset-0 z-[90] bg-black/75 backdrop-blur-sm"
                        onClick={dismiss}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="us-optin-title"
                        initial={{ opacity: 0, y: 32, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[91] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="relative w-full max-w-md pointer-events-auto overflow-hidden"
                            style={{
                                background: "linear-gradient(145deg, #06060F 0%, #0D0820 60%, #06060F 100%)",
                                border: "1px solid rgba(139,92,246,0.25)",
                                boxShadow: "0 0 80px rgba(139,92,246,0.15), 0 32px 64px rgba(0,0,0,0.7)",
                            }}
                        >
                            {/* Top violet glow bar */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-80" />

                            {/* Background texture */}
                            <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />

                            {/* Radial glow */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[100px] pointer-events-none"
                                style={{ background: "rgba(139,92,246,0.12)" }}
                            />

                            {/* Close button */}
                            <button
                                onClick={dismiss}
                                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50"
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
                                        <div
                                            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                                            style={{
                                                background: "rgba(139,92,246,0.12)",
                                                border: "1px solid rgba(139,92,246,0.35)",
                                            }}
                                        >
                                            <UntoldButterflyLogo className="w-7 h-7 text-violet-400" />
                                        </div>
                                        <h2 className="font-display text-2xl text-white mb-2 tracking-wide">YOU'RE IN</h2>
                                        <p className="text-white/50 text-sm font-mono tracking-widest uppercase">
                                            The story will find you.
                                        </p>
                                        <button
                                            onClick={dismiss}
                                            className="mt-6 text-xs font-mono tracking-widest uppercase text-[#8B5CF6]/60 hover:text-[#8B5CF6] transition-colors"
                                        >
                                            Close
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Icon + kicker */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{
                                                    background: "rgba(139,92,246,0.12)",
                                                    border: "1px solid rgba(139,92,246,0.3)",
                                                }}
                                            >
                                                <UntoldButterflyLogo className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8B5CF6]/70">
                                                Untold Story · Season III
                                            </span>
                                        </div>

                                        {/* Headline */}
                                        <h2
                                            id="us-optin-title"
                                            className="font-serif italic text-3xl md:text-4xl text-white leading-[1.05] mb-3"
                                        >
                                            The Story<br />
                                            <span style={{ color: "#8B5CF6" }}>Continues</span>
                                        </h2>

                                        <p className="text-white/55 text-sm leading-relaxed mb-2">
                                            Late-night. Immersive. 360 sound. Season III is unfolding — be inside it before the doors open.
                                        </p>
                                        <p className="text-white/35 text-xs font-mono tracking-widest uppercase mb-7">
                                            Early access · Presale tickets · First to know
                                        </p>

                                        {/* Divider */}
                                        <div
                                            className="h-px mb-6"
                                            style={{
                                                background: "linear-gradient(to right, rgba(139,92,246,0.3), transparent)",
                                            }}
                                        />

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="your@email.com"
                                                required
                                                className="w-full px-4 py-3 text-sm text-white placeholder-white/25 bg-white/5 border transition-all focus-visible:outline-none"
                                                style={{ borderColor: "rgba(139,92,246,0.2)", borderRadius: 0 }}
                                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
                                                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)")}
                                            />

                                            {status === "error" && (
                                                <p className="text-red-400 text-xs font-mono">{errorMsg}</p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={status === "loading"}
                                                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-60"
                                                style={{
                                                    background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
                                                    color: "#ffffff",
                                                }}
                                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                                            >
                                                {status === "loading" ? (
                                                    <span className="animate-pulse">Joining...</span>
                                                ) : (
                                                    <>
                                                        Enter the Story
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        <p className="mt-4 text-center text-white/20 text-[10px] font-mono tracking-widest uppercase">
                                            No spam · Unsubscribe anytime
                                        </p>

                                        <button
                                            onClick={dismiss}
                                            className="mt-3 w-full text-center text-white/25 text-[10px] font-mono tracking-widest uppercase hover:text-white/45 transition-colors"
                                        >
                                            Maybe later
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Bottom violet glow bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
