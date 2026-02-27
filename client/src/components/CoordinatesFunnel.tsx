import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Lock, Unlock, ArrowRight } from "lucide-react";

export default function CoordinatesFunnel() {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;
        setStatus("loading");
        // Simulate API request
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    return (
        <section className="relative w-full py-24 overflow-hidden bg-black flex items-center justify-center border-y border-white/5">
            {/* Target/Radar Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                <div className="w-[800px] h-[800px] rounded-full border border-white" />
                <div className="absolute w-[600px] h-[600px] rounded-full border border-white" />
                <div className="absolute w-[400px] h-[400px] rounded-full border border-white" />
                <div className="absolute w-[200px] h-[200px] rounded-full border border-white" />
                <div className="absolute w-full h-[1px] bg-white top-1/2 -translate-y-1/2" />
                <div className="absolute w-[1px] h-full bg-white left-1/2 -translate-x-1/2" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#22D3EE]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    >
                        <MapPin className="w-6 h-6 text-[#22D3EE]" />
                    </motion.div>

                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="font-display text-4xl md:text-5xl uppercase tracking-widest text-white mb-4"
                    >
                        Encrypted <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                            Coordinates Drops
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-white/60 text-sm md:text-base mb-10 max-w-lg font-mono leading-relaxed"
                    >
                        The venue remains classified until 2 hours before doors. Enter your number to receive the exact drop pinged straight to your device.
                    </motion.p>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="w-full max-w-md"
                    >
                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/5 border border-[#22D3EE]/20 rounded-2xl p-8 backdrop-blur-md"
                                >
                                    <Unlock className="w-8 h-8 text-[#22D3EE] mx-auto mb-4" />
                                    <h3 className="font-display text-xl uppercase tracking-wider text-white mb-2">Number Secured</h3>
                                    <p className="font-mono text-xs text-white/50">
                                        Transmission status: <span className="text-[#22D3EE]">PENDING SIGNAL</span> <br />
                                        Awaiting drop initiation.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onSubmit={handleSubmit}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/30 to-[#22D3EE]/30 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500" />
                                    <div className="relative flex items-center bg-black border border-white/20 rounded-full overflow-hidden p-1 Focus-within:border-white/40 transition-colors">
                                        <div className="pl-4 pr-3 flex items-center shrink-0">
                                            <Phone className="w-4 h-4 text-white/40" />
                                            <span className="font-mono text-white/40 text-sm ml-2">+1</span>
                                        </div>
                                        <input
                                            required
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="(555) 000-0000"
                                            className="w-full bg-transparent py-3.5 pr-4 text-white placeholder:text-white/20 focus:outline-none font-mono text-sm tracking-widest"
                                        />
                                        <button
                                            type="submit"
                                            disabled={status === "loading" || !phone}
                                            className="shrink-0 bg-white text-black px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#22D3EE] transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {status === "loading" ? "Syncing..." : "Connect"}
                                                {status !== "loading" && <Lock className="w-3.5 h-3.5 group-hover/btn:hidden" />}
                                                {status !== "loading" && <ArrowRight className="w-3.5 h-3.5 hidden group-hover/btn:block" />}
                                            </span>
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <p className="text-[10px] text-white/30 font-mono mt-4 tracking-widest uppercase">
                            Standard signal and transmission rates apply.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
