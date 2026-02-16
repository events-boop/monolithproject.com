import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { verifySponsorAccess } from "@/lib/api";
import SEO from "@/components/SEO";

export default function SponsorAccess() {
    const [password, setPassword] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setIsVerifying(true);
        try {
            await verifySponsorAccess(password);
            setIsUnlocked(true);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Invalid access code.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
            <SEO
                title="Partner Access"
                description="Confidential partner materials for The Monolith Project."
                noIndex
            />
            <Navigation activeSection="partnerships" />


            <div className="container relative z-10 min-h-screen flex flex-col items-center justify-center py-20">

                <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                        /* LOCK SCREEN */
                        <motion.div
                            key="lock"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                            className="max-w-md w-full border border-border p-12 text-center"
                        >
                            <div className="w-16 h-16 bg-primary/5 border border-primary/30 flex items-center justify-center mx-auto mb-8">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>

                            <h1 className="font-display text-3xl text-foreground mb-2">PARTNER ACCESS</h1>
                            <p className="text-muted-foreground text-sm mb-8 tracking-wide">
                                ENTER ACCESS TOKEN FOR SPONSORSHIP MATERIALS
                            </p>

                            <form onSubmit={handleUnlock} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrorMessage("");
                                        }}
                                        placeholder="ACCESS CODE"
                                        className="w-full bg-background/50 border border-white/10 rounded-sm px-4 py-3 text-center tracking-[0.5em] text-lg focus:outline-none focus:border-primary/50 transition-colors uppercase placeholder:tracking-normal placeholder:text-sm"
                                    />
                                    {errorMessage && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute -bottom-6 left-0 right-0 text-xs text-red-400 font-mono mt-2"
                                        >
                                            {errorMessage}
                                        </motion.p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isVerifying}
                                    className="w-full bg-primary text-primary-foreground font-display text-lg tracking-widest uppercase py-3 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group rounded-full disabled:opacity-50"
                                >
                                    <span>{isVerifying ? "Checking..." : "Unlock"}</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        /* UNLOCKED CONTENT */
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-4xl w-full"
                        >
                            <div className="text-center mb-16">
                                <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
                                    Confidential
                                </span>
                                <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">
                                    CHASING SUN(SETS)
                                </h1>
                                <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                                    2026 Sponsorship & Partnership Framework
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Deck Download */}
                                <div className="group relative p-8 border border-border hover:border-primary/30 transition-all duration-500">
                                    <div className="h-full flex flex-col">
                                        <div className="w-12 h-12 bg-primary/5 border border-primary/30 flex items-center justify-center mb-6">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-display text-2xl text-foreground mb-2">Sponsorship Deck</h3>
                                        <p className="text-muted-foreground text-sm mb-8 flex-grow">
                                            Comprehensive overview of The Monolith Project, audience demographics, and tiered partnership opportunities (PDF).
                                        </p>
                                        <a
                                            href="/api/sponsor-deck"
                                            className="w-full py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-medium rounded-full"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download PDF
                                        </a>
                                    </div>
                                </div>

                                {/* Rate Card */}
                                <div className="group relative p-8 border border-border hover:border-primary/30 transition-all duration-500">
                                    <div className="h-full flex flex-col">
                                        <div className="w-12 h-12 bg-primary/5 border border-primary/30 flex items-center justify-center mb-6">
                                            <Lock className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="font-display text-2xl text-foreground mb-2">Rate Card</h3>
                                        <p className="text-muted-foreground text-sm mb-8 flex-grow">
                                            Detailed inventory pricing for experiential activations, digital reach, and hospitality packages (Confidential).
                                        </p>
                                        <button
                                            onClick={() => toast.info("Inventory Locked", {
                                                description: "Rate card inventory is currently being revised for Q3 2026."
                                            })}
                                            className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-medium rounded-full"
                                        >
                                            <Download className="w-4 h-4" />
                                            View Inventory
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-muted-foreground mt-12 font-mono opacity-50">
                                INTERNAL USE ONLY • DO NOT DISTRIBUTE
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
}
