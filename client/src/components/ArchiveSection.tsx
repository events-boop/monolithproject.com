import { motion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";
import { Link } from "wouter";
import { archiveCollectionsBySlug, ArchiveCollection } from "@/data/galleryData";
import { useUI } from "@/contexts/UIContext";
import { signalChirp } from "@/lib/SignalChirpEngine";
import ResponsiveImage from "@/components/ResponsiveImage";
import SplitText from "@/components/ui/SplitText";

// Newest first — static list since we have a small fixed set
const archiveEntries: (ArchiveCollection & { href: string })[] = [
    { ...archiveCollectionsBySlug["untold-story-season-iii"], href: "/untold-story/season-iii" },
    { ...archiveCollectionsBySlug["chasing-sunsets-season-iii"], href: "/chasing-sunsets/season-iii" },
    { ...archiveCollectionsBySlug["untold-story-season-ii"], href: "/untold-story/season-ii" },
    { ...archiveCollectionsBySlug["chasing-sunsets-season-ii"], href: "/chasing-sunsets/season-ii" },
    { ...archiveCollectionsBySlug["untold-story-season-i"], href: "/untold-story/season-i" },
    { ...archiveCollectionsBySlug["chasing-sunsets-season-i"], href: "/chasing-sunsets/season-i" },
].filter((e) => e.media.length > 0);

export default function ArchiveSection() {
    const { closeDrawer } = useUI();

    return (
        <div className="w-full text-white relative">
            {/* Subtle atmosphere inside the drawer */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(232,184,109,0.04),transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(139,92,246,0.04),transparent_60%)]" />
            </div>

            <div className="relative z-10 px-6 py-12 md:py-16 mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-12 border-b border-white/5 pb-8"
                >
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-4">
                        Event Archive
                    </span>
                    <h1 className="font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.82] uppercase tracking-tight text-white mb-4 drop-shadow-md">
                        <SplitText text="ARCHIVE" initialDelay={0.15} />
                    </h1>
                    <p className="text-white/40 max-w-md leading-relaxed text-sm md:text-base">
                        Every season, every event, every gallery. The full history of Monolith Project events.
                    </p>
                </motion.div>

                {/* Event Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archiveEntries.map((entry, idx) => (
                        <motion.div
                            key={entry.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full"
                        >
                            <Link href={entry.href} onClick={() => { signalChirp.click(); closeDrawer(); }} className="group flex flex-col h-full border border-white/10 hover:border-white/20 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                                {/* Cover Image */}
                                <div className="aspect-[3/2] overflow-hidden relative shrink-0">
                                    <ResponsiveImage
                                        src={entry.coverImage}
                                        alt={`${entry.title} ${entry.subtitle}`}
                                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    {/* Photo count badge */}
                                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-sm">
                                        <Camera className="w-3 h-3 text-white/70" />
                                        <span className="font-mono text-[10px] text-white/70">
                                            {entry.media.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex flex-col flex-1">
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
                                    <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-6 flex-1">
                                        {entry.description}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white transition-colors">
                                            View Gallery
                                            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
