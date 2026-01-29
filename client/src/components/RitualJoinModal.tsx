import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { toast } from "sonner";

interface RitualJoinModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RitualJoinModal({ isOpen, onClose }: RitualJoinModalProps) {
    const [step, setStep] = useState<"input" | "success">("input");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setStep("success");
            // Reset after a delay or let user close
        }, 1500);
    };

    const handleClose = () => {
        setStep("input");
        setEmail("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-md bg-[#0a0a0a] border border-[#D4A574]/30 pointer-events-auto relative overflow-hidden"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4A574] to-transparent" />
                            <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#D4A574]/10 rounded-full blur-3xl pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="p-8 md:p-12 text-center">
                                <AnimatePresence mode="wait">
                                    {step === "input" ? (
                                        <motion.div
                                            key="input"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <h2 className="font-display text-3xl md:text-4xl text-white mb-2 uppercase tracking-wide">
                                                Enter the Frequency
                                            </h2>
                                            <p className="font-serif text-[#D4A574] italic mb-8">
                                                "The ritual begins before the first beat drops."
                                            </p>

                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="YOUR EMAIL"
                                                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-4 text-center tracking-widest uppercase focus:outline-none focus:border-[#D4A574] transition-colors"
                                                    />
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#D4A574] group-focus-within:w-full transition-all duration-500" />
                                                </div>

                                                <MagneticButton>
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="w-full bg-[#D4A574] text-black font-bold uppercase tracking-[0.2em] py-4 hover:bg-white transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        {isLoading ? (
                                                            <span className="animate-pulse">Connecting...</span>
                                                        ) : (
                                                            <>
                                                                Initiate <ArrowRight size={16} />
                                                            </>
                                                        )}
                                                    </button>
                                                </MagneticButton>
                                            </form>

                                            <p className="mt-6 text-[10px] text-white/30 uppercase tracking-widest">
                                                Join 12,402 others in the Monolith
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center justify-center py-8"
                                        >
                                            <div className="w-16 h-16 rounded-full border-2 border-[#D4A574] flex items-center justify-center mb-6 text-[#D4A574]">
                                                <Check size={32} />
                                            </div>
                                            <h3 className="font-display text-2xl text-white uppercase tracking-widest mb-2">
                                                Signal Received
                                            </h3>
                                            <p className="text-white/50 font-serif italic mb-8">
                                                You are now part of the inner circle. Watch your inbox.
                                            </p>
                                            <MagneticButton>
                                                <button
                                                    onClick={handleClose}
                                                    className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                                                >
                                                    Return to Site
                                                </button>
                                            </MagneticButton>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
