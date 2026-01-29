import { motion } from "framer-motion";
import { Link } from "wouter";
import MagneticButton from "@/components/MagneticButton";
import { ArrowDown } from "lucide-react";

import Navigation from "@/components/Navigation";

export default function UntoldStory() {
    return (
        <div className="min-h-screen bg-[#000] text-foreground selection:bg-white selection:text-black">
            <Navigation />

            {/* Hero / Cover */}
            <section className="relative h-screen flex flex-col items-center justify-center p-6 border-b border-white/10">
                <div className="max-w-4xl mx-auto text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <h1 className="font-display text-7xl md:text-9xl tracking-tighter text-white mb-8">
                            THE<br />UNTOLD
                        </h1>
                        <p className="font-serif text-2xl md:text-3xl text-white/60 italic max-w-2xl mx-auto leading-relaxed">
                            "We are not just building a brand.<br />We are remembering a future that hasn't happened yet."
                        </p>
                    </motion.div>
                </div>

                {/* Scroll Hint */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ArrowDown className="w-6 h-6" />
                </motion.div>
            </section>

            {/* Chapter 1: The Origin */}
            <section className="py-32 px-6 border-b border-white/10">
                <div className="max-w-3xl mx-auto">
                    <span className="block text-xs font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">Chapter 01 — The Origin</span>
                    <div className="prose prose-invert prose-lg md:prose-xl">
                        <p className="text-white/80 font-serif leading-loose">
                            It started in a warehouse in 2024. Not with a bang, but with a frequency. We noticed that the modern world was becoming increasingly disconnected, despite being more "online" than ever. The ritual of gathering—truly gathering—had been lost to screens and VIP tables.
                        </p>
                        <p className="text-white/80 font-serif leading-loose">
                            The Monolith was conceived as an answer to this fragmentation. A singular point of gravity. A totem that pulls us back together.
                        </p>
                    </div>
                </div>
            </section>

            {/* Chapter 2: The Methodology */}
            <section className="py-32 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center border-b border-white/10">
                <div className="aspect-[3/4] bg-white/5 rounded-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 text-white text-xs font-mono uppercase">
                        Fig 1.1 — The Structure
                    </div>
                </div>
                <div>
                    <span className="block text-xs font-mono text-white/40 mb-12 uppercase tracking-[0.2em]">Chapter 02 — The Methodology</span>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-8">ARCHITECTS OF<br />VIBRATION</h2>
                    <p className="text-white/60 font-serif text-lg leading-relaxed mb-8">
                        We do not just throw parties. We architect moments. Every light fixture, every bass frequency, every shadow is calculated to induce a state of flow.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-white font-bold mb-2">Sonic</h4>
                            <p className="text-sm text-white/40">Curated frequencies designed to bypass the ego and speak directly to the body.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-2">Visual</h4>
                            <p className="text-sm text-white/40">Minimalist brutalism meets organic warmth. No distractions. Only immersion.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Pledge */}
            <section className="py-48 px-6 text-center bg-white text-black">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-display text-6xl md:text-8xl tracking-tight mb-12">
                        JOIN THE<br />FREQUENCY
                    </h2>
                    <Link href="/tickets">
                        <MagneticButton strength={0.2} className="group relative">
                            <div className="absolute inset-0 rounded-lg bg-black/80 border border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-[#D4A574]/50 group-hover:shadow-[0_0_30px_rgba(212,165,116,0.2)]" />
                            <button className="relative px-12 py-4 bg-transparent text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 z-10">
                                Become a Member
                            </button>
                        </MagneticButton>
                    </Link>
                </div>
            </section>

        </div>
    );
}
