import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { archiveCollectionsBySlug, ArchiveCollection } from "@/data/galleryData";

// Newest first — static list since we have a small fixed set
const archiveEntries: (ArchiveCollection & { href: string })[] = [
    { ...archiveCollectionsBySlug["untold-story-season-iii"], href: "/untold-story/season-iii" },
    { ...archiveCollectionsBySlug["chasing-sunsets-season-iii"], href: "/chasing-sunsets/season-iii" },
    { ...archiveCollectionsBySlug["untold-story-season-ii"], href: "/untold-story/season-ii" },
    { ...archiveCollectionsBySlug["chasing-sunsets-season-ii"], href: "/chasing-sunsets/season-ii" },
    { ...archiveCollectionsBySlug["untold-story-season-i"], href: "/untold-story/season-i" },
    { ...archiveCollectionsBySlug["chasing-sunsets-season-i"], href: "/chasing-sunsets/season-i" },
].filter((e) => e.media.length > 0);

export default function Archive() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
            <SEO
                title="Archive"
                description="The full history of Monolith Project events — galleries from every season."
            />
            <Navigation />

            {/* Subtle atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(232,184,109,0.04),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(139,92,246,0.04),transparent_50%)]" />
            </div>

            <main className="relative z-10 page-shell-start-loose pb-32">
                <div className="container layout-wide px-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-16"
                    >
                        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
                            Event Archive
                        </span>
                        <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.82] uppercase tracking-tight text-white mb-6">
                            ARCHIVE
                        </h1>
                        <p className="text-white/45 max-w-xl leading-relaxed">
                            Every season, every event, every gallery.
                        </p>
                    </motion.div>

                    {/* Event Card Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {archiveEntries.map((entry, idx) => (
                            <motion.div
                                key={entry.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link href={entry.href} asChild>
                                    <a className="group block border border-white/8 hover:border-white/20 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.04]">
                                        {/* Cover Image */}
                                        <div className="aspect-[3/2] overflow-hidden relative">
                                            <img
                                                src={entry.coverImage}
                                                alt={`${entry.title} ${entry.subtitle}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            {/* Photo count badge */}
                                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm">
                                                <Camera className="w-3 h-3 text-white/70" />
                                                <span className="font-mono text-[10px] text-white/70">
                                                    {entry.media.length}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5">
                                            <span
                                                className="font-mono text-[10px] tracking-[0.25em] uppercase block mb-3"
                                                style={{ color: entry.accentColor }}
                                            >
                                                {entry.date}
                                            </span>
                                            <h2 className="font-display text-xl uppercase tracking-wider text-white mb-1">
                                                {entry.title}
                                            </h2>
                                            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
                                                {entry.subtitle}
                                            </p>
                                            <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-4">
                                                {entry.description}
                                            </p>
                                            <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">
                                                View Gallery
                                                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </span>
                                        </div>
                                    </a>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}
