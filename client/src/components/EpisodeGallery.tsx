import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";

interface EpisodeGalleryProps {
    series: "chasing-sunsets" | "untold-story";
    season: string;
    episode?: string;
    title: string;
    subtitle?: string;
    description?: string;
    images: { src: string; alt: string; label?: string }[];
    accentColor: string;
}

export default function EpisodeGallery({
    series,
    season,
    episode,
    title,
    subtitle,
    description,
    images,
    accentColor,
}: EpisodeGalleryProps) {
    const isChasing = series === "chasing-sunsets";
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    
    // Asymmetrical scroll physics — significantly reduced on mobile to prevent content occlusion
    const yEven = useTransform(scrollYProgress, [0, 1], [40, -40]);
    const yOdd = useTransform(scrollYProgress, [0, 1], [-20, 20]);

    return (
        <div ref={containerRef} className={`py-16 ${isChasing ? "sunset-border-accent" : "border-white/10"}`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
                <div>
                    <span
                        className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-3"
                        style={{ color: accentColor }}
                    >
                        {season} {episode && `— ${episode}`}
                    </span>
                    <h3 className="font-display text-4xl md:text-5xl uppercase text-white mb-2">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-xl text-white/70 font-display tracking-widest uppercase mb-4">
                            {subtitle}
                        </p>
                    )}
                    {description && (
                        <p className="text-white/50 max-w-xl text-sm leading-relaxed border-l-2 pl-4" style={{ borderColor: accentColor }}>
                            {description}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/${series}/${season.replace(/\s+/g, "-").toLowerCase()}`} asChild>
                        <a
                            className="px-6 py-2.5 rounded-full font-mono text-[10px] tracking-widest uppercase border hover:bg-white/5 transition-all flex items-center gap-2 text-white"
                            style={{ borderColor: `${accentColor}40` }}
                        >
                            View Full Gallery
                            <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
                {images.map((img, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                        <motion.div
                            key={idx}
                            style={{ y: isEven ? yEven : yOdd }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative aspect-[3/4] rounded-xl overflow-hidden glass border border-white/10 grayscale-[60%] hover:grayscale-0 transition-all duration-700 hover:z-20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                        >
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />

                            {img.label && (
                                <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/50 block mb-1">
                                        Card {idx + 1}
                                    </span>
                                    <p className="font-display text-xl uppercase tracking-widest text-white drop-shadow-md">
                                        {img.label}
                                    </p>
                                </div>
                            )}

                            {/* Hover Frame Effect */}
                            <div
                                className="absolute inset-0 border-[3px] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-[0.98] group-hover:scale-100 mix-blend-overlay"
                                style={{ borderColor: accentColor }}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
