import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Instagram, Sparkles, Copy, CheckCircle, ArrowRight, Gift } from "lucide-react";

export default function GiveawayFunnel() {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const [copied, setCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        // Simulate API request
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText("https://monolithproject.com/win/ref-x89f2a");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-black flex items-center justify-center border-y border-white/10">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#E8B86D]/20 to-[#E05A3A]/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#8B5CF6]/10 to-[#22D3EE]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto rounded-[2rem] p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent relative"
                >
                    {/* Inner dark card */}
                    <div className="bg-black/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden grid lg:grid-cols-5 relative">

                        {/* Left Side: Prize Details */}
                        <div className="lg:col-span-3 p-8 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/5 relative">
                            <div className="absolute top-0 left-0 w-[150px] h-[150px] bg-white/5 blur-[50px] rounded-full pointer-events-none" />

                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/20 bg-white/5">
                                <Gift className="w-3.5 h-3.5 text-[#E8B86D]" />
                                <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-[#E8B86D]">
                                    Ultimate Event Experience
                                </span>
                            </div>

                            <h2 className="font-display text-4xl lg:text-5xl uppercase tracking-widest text-white mb-6 leading-tight">
                                Win <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">The Weekend</span>
                            </h2>

                            <p className="text-white/70 text-sm md:text-base mb-8 max-w-md">
                                Enter now for a chance to win the ultimate Monolith Project experience for you and a friend. We're flying one lucky winner out for our biggest show yet.
                            </p>

                            <div className="space-y-4 font-mono text-sm">
                                {[
                                    "2x VIP Backstage Passes",
                                    "Flights & Hotel Accommodations",
                                    "Meet & Greet with Headliners",
                                    "Exclusive Merch Pack"
                                ].map((perk, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <Sparkles className="w-3.5 h-3.5 text-white/60" />
                                        </div>
                                        <span className="text-white/80">{perk}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: The Viral Funnel Form */}
                        <div className="lg:col-span-2 p-8 lg:p-12 relative flex flex-col justify-center bg-white/[0.02]">
                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20"
                                        >
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                        </motion.div>

                                        <h3 className="font-display text-2xl uppercase text-white mb-2">You're Entered!</h3>
                                        <p className="text-sm text-white/60 mb-8 font-mono">
                                            Want to increase your chances?
                                        </p>

                                        <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-left mb-6 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                <Gift className="w-24 h-24" />
                                            </div>
                                            <h4 className="text-white font-mono text-sm mb-2 uppercase tracking-widest">Viral Multiplier</h4>
                                            <p className="text-white/50 text-xs mb-4">
                                                Share your unique invite link below. When 3 friends enter, you get <strong>10 extra entries</strong> automatically.
                                            </p>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value="monolithproject.com/win/ref-x89f2a"
                                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white/70 font-mono outline-none"
                                                />
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="shrink-0 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-colors"
                                                >
                                                    {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <h3 className="font-display text-2xl uppercase text-white mb-1">Enter to Win</h3>
                                            <p className="text-xs font-mono text-white/50 mb-6 uppercase tracking-widest">Takes 30 seconds</p>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Your Name"
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="relative">
                                                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                <input
                                                    type="text"
                                                    placeholder="@instagram_handle"
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === "loading"}
                                            className="w-full mt-4 bg-white text-black py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group"
                                        >
                                            {status === "loading" ? "Submitting..." : "Drop My Name"}
                                            {status !== "loading" && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                        </button>

                                        <p className="text-[10px] text-center text-white/30 font-mono pt-2">
                                            Must be 21+ to enter. Winner selected randomly next month.
                                        </p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}
