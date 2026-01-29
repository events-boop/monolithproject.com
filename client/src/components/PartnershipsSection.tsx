
import { motion } from "framer-motion";

export default function PartnershipsSection() {
    return (
        <section id="partnerships" className="py-32 bg-obsidian relative overflow-hidden">
            {/* Solar Brutalism Background */}
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
            <div className="absolute -left-20 top-1/2 w-96 h-96 bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

            {/* Cosmic Marquee */}
            <div className="absolute top-10 left-0 w-full overflow-hidden opacity-[0.03] pointer-events-none select-none">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    className="whitespace-nowrap font-display text-[15rem] leading-none text-white"
                >
                    AUDIO • VISUAL • KINETIC • SPATIAL • DIGITAL • AUDIO • VISUAL • KINETIC • SPATIAL • DIGITAL
                </motion.div>
            </div>

            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Side */}
                    <div>
                        <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
                            05 — Partnerships
                        </span>
                        <h2 className="font-display text-5xl md:text-7xl text-foreground tracking-tight mb-8">
                            CULTURAL <span className="text-primary">SIGNAL</span>
                        </h2>

                        <div className="space-y-8 text-lg text-muted-foreground font-light leading-relaxed">
                            <p>
                                The Monolith Project is not just an event series; it is a platform for brand integration that feels native, not intrusive.
                            </p>
                            <p>
                                We partner with brands that understand <span className="text-foreground font-normal">the ritual of gathering</span>.
                                From "Chasing Sun(Sets)" golden hour activations to the deep-night narrative of "Untold Story",
                                we offer high-impact alignment with a curated, engaged audience.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-8">
                            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                                <h4 className="font-display text-2xl text-foreground mb-2">Tier 1</h4>
                                <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Monolith Presented</p>
                                <p className="text-sm text-muted-foreground">Full headline integration and shared narrative control.</p>
                            </motion.div>
                            <motion.div whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                                <h4 className="font-display text-2xl text-foreground mb-2">Tier 2</h4>
                                <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Experience Partner</p>
                                <p className="text-sm text-muted-foreground">Specific activation zones and sensory integration.</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Visual Side - Solar Glyph Integration */}
                    <div className="relative h-[600px] border border-white/5 bg-white/5 backdrop-blur-sm p-2 group overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="w-64 h-64 rounded-full border border-primary/30 flex items-center justify-center relative cursor-crosshair"
                            >
                                <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping opacity-20 duration-3000" />
                                <div className="w-48 h-48 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
                                <div className="relative z-10 text-center">
                                    <span className="block font-display text-6xl text-foreground group-hover:scale-110 transition-transform duration-500">50K+</span>
                                    <span className="text-xs font-mono uppercase tracking-widest text-primary">Annual Reach</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-50 pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    );
}
