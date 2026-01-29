import { motion } from "framer-motion";
import { ArrowUpRight, Instagram, Calendar, MapPin } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { Link } from "wouter";

import Navigation from "@/components/Navigation";

export default function ChasingSunsets() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground selection:bg-[#D4A574] selection:text-black">
            <Navigation />

            {/* Hero Section - Golden Hour Theme */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4A574]/20 via-[#0a0a0a] to-[#0a0a0a] z-0" />

                {/* Animated Sun Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4A574]/10 rounded-full blur-[100px] animate-pulse-slow" />

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="block text-[#D4A574] font-mono text-sm tracking-[0.3em] mb-4 uppercase">
                            Series 01
                        </span>
                        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-white mb-6 drop-shadow-2xl">
                            Chasing<br />
                            <span className="text-[#D4A574] italic font-serif">Sun(Sets)</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-white/60 font-serif italic text-lg md:text-xl leading-relaxed">
                            "We chase the light until it fades. A collective ritual of golden hours, deep grooves, and open skies."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Upcoming Rituals (Schedule) */}
            <section className="py-24 container max-w-5xl mx-auto px-6">
                <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-6">
                    <h2 className="font-display text-4xl text-white">UPCOMING RITUALS</h2>
                    <span className="text-[#D4A574] font-mono text-xs tracking-widest mb-2">SEASON 2026</span>
                </div>

                <div className="space-y-4">
                    {/* Event Item 1 */}
                    <div className="group relative border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-8 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <div className="flex flex-col items-center justify-center w-16 h-16 border border-[#D4A574]/30 rounded-lg bg-[#D4A574]/5">
                                <span className="text-[#D4A574] text-xs font-bold uppercase">Jun</span>
                                <span className="text-white text-xl font-display font-medium">21</span>
                            </div>
                            <div>
                                <h3 className="text-2xl text-white font-display tracking-wide mb-1 group-hover:text-[#D4A574] transition-colors">SOLSTICE GATHERING</h3>
                                <div className="flex gap-4 text-white/50 text-sm font-mono uppercase">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> Rooftop Garden, Chicago</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> 16:00 - 22:00</span>
                                </div>
                            </div>
                        </div>
                        <MagneticButton className="w-full md:w-auto">
                            <button className="relative w-full md:w-auto px-8 py-3 bg-black/50 border border-white/20 text-[#D4A574] hover:bg-white/5 hover:border-[#D4A574] hover:shadow-[0_0_30px_rgba(212,165,116,0.15)] font-semibold tracking-widest text-xs uppercase rounded transition-all duration-300 flex items-center justify-center gap-2">
                                RSVP Now <ArrowUpRight size={14} />
                            </button>
                        </MagneticButton>
                    </div>

                    {/* Event Item 2 */}
                    <div className="group relative border border-white/10 bg-white/5 hover:bg-white/10 transition-colors p-8 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 opacity-60 hover:opacity-100">
                        <div className="flex items-start gap-6">
                            <div className="flex flex-col items-center justify-center w-16 h-16 border border-white/10 rounded-lg">
                                <span className="text-white/50 text-xs font-bold uppercase">Jul</span>
                                <span className="text-white text-xl font-display font-medium">19</span>
                            </div>
                            <div>
                                <h3 className="text-2xl text-white font-display tracking-wide mb-1">GOLDEN HOUR II</h3>
                                <div className="flex gap-4 text-white/50 text-sm font-mono uppercase">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> Secret Location</span>
                                    <span className="flex items-center gap-1"><Calendar size={12} /> 17:00 - 23:00</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-2 border border-white/10 text-white/30 text-xs uppercase tracking-widest rounded cursor-not-allowed">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </section>

            {/* Instagram / Connect */}
            <section className="py-24 bg-[#0F0F0F] border-t border-white/5">
                <div className="container max-w-6xl mx-auto px-6 text-center">
                    <Instagram className="w-8 h-8 text-[#D4A574] mx-auto mb-6" />
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-8">@MONOLITH.SUNSETS</h2>
                    <p className="text-white/50 max-w-xl mx-auto mb-12 font-serif italic text-lg">
                        "Capture the moment before the light disappears. Tag us to be featured in the Archive."
                    </p>

                    {/* Pseudo-Instagram Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-white/20 group-hover:text-[#D4A574] transition-colors">
                                    <ArrowUpRight className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
