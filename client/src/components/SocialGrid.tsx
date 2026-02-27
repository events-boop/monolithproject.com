import { motion } from "framer-motion";
import { Instagram, Youtube, Linkedin, ArrowUpRight } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

const socials = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/monolithproject.events" },
    { name: "TikTok", icon: TikTokIcon, url: "https://tiktok.com/@monolithproject" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@monolithproject" },
];

export default function SocialGrid() {
    // Monolith palette
    const colors = [
        "bg-primary",      // Coral/Orange
        "bg-clay",         // Terracotta
        "bg-charcoal",     // Dark
        "bg-stone",        // Grey
        "bg-sand",         // Light
        "bg-primary/80",   // Variatons
        "bg-clay/80",
        "bg-charcoal/80",
    ];

    // Generate a deterministic pattern of cells
    const cells = Array.from({ length: 48 }).map((_, i) => {
        // Determine color based on index to create a pseudo-random looking pattern
        // Designed to avoid adjacent same colors where possible
        const colorIndex = (i * 7 + 3) % colors.length;
        return colors[colorIndex];
    });

    return (
        <section className="relative overflow-hidden bg-background">
            {/* Grid Background */}
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 auto-rows-[60px] md:auto-rows-[80px] lg:auto-rows-[100px] w-full">
                {cells.map((color, i) => (
                    <motion.div
                        key={i}
                        className={`${color} border-[0.5px] border-black/5 relative overflow-hidden`}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.01, duration: 0.5 }}
                    >
                        {/* Subtle internal highlight to give depth like tiles */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 pointer-events-none" />
                    </motion.div>
                ))}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 pointer-events-none">

                <div className="bg-white/90 backdrop-blur-md border border-charcoal/10 p-8 md:p-12 shadow-2xl skew-x-[-2deg] pointer-events-auto hover:scale-105 transition-transform duration-500">
                    <p className="font-mono text-sm md:text-base text-charcoal/60 uppercase tracking-[0.2em] mb-4">
                        Follow the frequency
                    </p>

                    <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-charcoal uppercase leading-[0.8] tracking-tight mb-8">
                        @MONOLITHPROJECT
                    </h2>

                    <div className="flex items-center justify-center gap-4 text-charcoal">
                        {socials.map((s) => (
                            <a
                                key={s.name}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-charcoal hover:text-white transition-all group bg-white"
                                aria-label={`Follow us on ${s.name}`}
                            >
                                <s.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        ))}
                    </div>
                </div>

            </div>

            {/* Back to top (Visual only for now, or functional) */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="absolute bottom-6 right-6 bg-white border border-charcoal/10 p-3 shadow-lg hover:bg-charcoal hover:text-white transition-colors z-20"
                aria-label="Back to top"
            >
                <ArrowUpRight className="w-5 h-5" />
            </button>
        </section>
    );
}
