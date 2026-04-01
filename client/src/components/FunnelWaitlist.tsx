import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, Sparkles, CheckCircle, ArrowRight, AlertCircle } from "lucide-react";
import { submitNewsletterLead } from "@/lib/api";

interface FunnelWaitlistProps {
    variant?: "default" | "chasing-sunsets" | "untold-story";
}

export default function FunnelWaitlist({ variant = "default" }: FunnelWaitlistProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const contentMap = {
        "default": {
            pill: "VIP Waitlist",
            titleTop: "Unlock Exclusive",
            titleBottom: "Pre-Sale Access",
            gradient: "from-[#E05A3A] to-[#E8B86D]",
            desc: "Join the inner circle. Get notified 24 hours before the general public when tables and Tier 1 tickets for our next season go live.",
            button: "sunset-gradient-btn",
            glow1: "bg-[#E05A3A]/10",
            glow2: "bg-[#8B5CF6]/10",
            bulletPoints: [
                "Guaranteed lowest ticket tiers",
                "Priority VIP table booking",
                "Exclusive lineup drops"
            ]
        },
        "chasing-sunsets": {
            pill: "Inner Circle",
            titleTop: "Unlock",
            titleBottom: "The Sunset",
            gradient: "from-[#C2703E] via-[#E8B86D] to-[#FBF5ED]",
            desc: "Join the Chasing Sun(Sets) Inner Circle. Gain first access to exclusive sunset events and secret destination announcements.",
            button: "sunset-gradient-btn",
            glow1: "bg-[#E8B86D]/10",
            glow2: "bg-[#C2703E]/10",
            bulletPoints: [
                "Early bird ticketing access",
                "Secret location drops",
                "Inner Circle community"
            ]
        },
        "untold-story": {
            pill: "Secret Access",
            titleTop: "Access",
            titleBottom: "The Untold",
            gradient: "from-[#8B5CF6] via-[#22D3EE] to-[#FBF5ED]",
            desc: "Step into the night with Untold Story. Receive encrypted coordinates, secret lineup drops, and backstage access before the masses.",
            button: "bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]",
            glow1: "bg-[#8B5CF6]/10",
            glow2: "bg-[#22D3EE]/10",
            bulletPoints: [
                "Encrypted location details",
                "Deep-house unreleased cuts",
                "Backstage and VIP entry"
            ]
        }
    };

    const content = contentMap[variant];

    const sourceMap = {
        "default": "funnel_waitlist",
        "chasing-sunsets": "funnel_waitlist_chasing",
        "untold-story": "funnel_waitlist_untold",
    } as const;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStatus("loading");
        setErrorMsg("");

        const [firstName, ...lastParts] = fullName.trim().split(" ");
        const lastName = lastParts.join(" ") || undefined;

        try {
            await submitNewsletterLead(
                {
                    email: email.trim(),
                    firstName: firstName || undefined,
                    lastName,
                    consent: true,
                    source: sourceMap[variant],
                    utmContent: phone.trim() ? "sms_interest" : undefined,
                },
                crypto.randomUUID(),
            );
            setStatus("success");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setStatus("error");
        }
    };

    return (
        <div className="w-full relative py-20 lg:py-32 overflow-hidden flex items-center justify-center">
            {/* Background Glows */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] ${content.glow1} rounded-full blur-[120px] pointer-events-none`} />
            <div className={`absolute bottom-0 right-0 w-[500px] h-[500px] ${content.glow2} rounded-full blur-[100px] pointer-events-none`} />

            <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass rounded-3xl p-1 md:p-2 border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Inner Border Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none rounded-3xl" />

                        <div className="grid lg:grid-cols-2 gap-0 lg:gap-8 rounded-[22px] overflow-hidden bg-[#0A0A0A]/50">
                            {/* Left Side: Copy & Value Prop */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C2703E] via-[#E8B86D] to-transparent lg:hidden" />
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#C2703E] via-[#E8B86D] to-transparent hidden lg:block" />

                                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/20 bg-white/5 w-fit">
                                    <Sparkles className="w-3.5 h-3.5 text-[#E8B86D]" />
                                    <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-white/80">
                                        {content.pill}
                                    </span>
                                </div>

                                <h2 className="font-display text-4xl lg:text-5xl uppercase tracking-wide text-white mb-4 leading-[1.1]">
                                    {content.titleTop} <br />
                                    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${content.gradient}`}>
                                        {content.titleBottom}
                                    </span>
                                </h2>

                                <p className="text-white/60 text-sm md:text-base mb-8 max-w-md">
                                    {content.desc}
                                </p>

                                <ul className="space-y-4 mb-2">
                                    {content.bulletPoints.map((perk, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-white/80 font-mono">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#E05A3A]" />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Side: The Funnel Form */}
                            <div className="p-8 lg:p-12 flex flex-col justify-center bg-black/20 border-t lg:border-t-0 lg:border-l border-white/5 relative z-10">
                                <AnimatePresence mode="wait">
                                    {status === "success" ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center text-center py-10"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                                            >
                                                <CheckCircle className="w-10 h-10 text-green-400" />
                                            </motion.div>
                                            <h3 className="font-display text-2xl uppercase text-white mb-2">You're On The List</h3>
                                            <p className="text-white/60 text-sm">
                                                Keep an eye on your inbox. We'll send your exclusive access link before the drop.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-4"
                                        >
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 ml-1">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        autoComplete="name"
                                                        placeholder="John Doe"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8B86D]/50 focus:bg-white/10 transition-all text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 ml-1">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                    <input
                                                        required
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        autoComplete="email"
                                                        placeholder="john@example.com"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8B86D]/50 focus:bg-white/10 transition-all text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-mono tracking-widest uppercase text-white/50 ml-1">Phone Number <span className="text-white/30 lowercase">(Optional)</span></label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        autoComplete="tel"
                                                        placeholder="+1 (555) 000-0000"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8B86D]/50 focus:bg-white/10 transition-all text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {status === "error" && errorMsg && (
                                                <p className="flex items-center gap-2 text-red-400 text-xs font-mono mt-1">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorMsg}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={status === "loading"}
                                                className={`w-full mt-4 ${content.button} text-white py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden`}
                                            >
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {status === "loading" ? "Processing..." : "Join Waitlist"}
                                                    {status !== "loading" && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                                </span>
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                                            </button>

                                            <p className="text-[10px] text-center text-white/40 mt-3 font-mono">
                                                By joining, you agree to our privacy policy. No spam, ever.
                                            </p>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
