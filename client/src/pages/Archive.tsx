import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, ArrowUpRight, Calendar, MapPin, Users, Play } from "lucide-react";
import { Link } from "wouter";
import { signalChirp } from "@/lib/SignalChirpEngine";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import { archiveCollectionsBySlug } from "@/data/galleryData";
import { CTA_LABELS } from "@/lib/cta";

// ─── Archive Data ────────────────────────────────────────────────────────────

type ArchiveSeason = {
    id: string;
    series: "chasing-sunsets" | "untold-story";
    season: string;
    year: string;
    title: string;
    subtitle: string;
    status: "past" | "active" | "upcoming";
    events: ArchiveEvent[];
    coverImage: string;
    accentColor: string;
    borderColor: string;
};

type ArchiveEvent = {
    date: string;
    venue: string;
    location: string;
    lineup: string;
    highlight?: string;
    hasFootage: boolean;
    footageUrl?: string;
};

const archiveData: ArchiveSeason[] = [
    // ── Chasing Sun(Sets) ──────────────────────────────────────────────────────
    {
        id: "css-s1",
        series: "chasing-sunsets",
        season: "Season I",
        year: "2024",
        title: "Chasing Sun(Sets)",
        subtitle: "Where it started. Rooftop golden hour, Chicago summers.",
        status: "past",
        accentColor: "#E8B86D",
        borderColor: "rgba(232,184,109,0.25)",
        coverImage: "/images/chasing-sunsets.jpg",
        events: [
            {
                date: "Summer 2024",
                venue: "Chicago Rooftop",
                location: "Chicago, IL",
                lineup: "Resident DJs · Special Guests",
                highlight: "The inaugural season — rooftop sunsets, golden hour pacing, and the foundation of the series.",
                hasFootage: true,
            },
        ],
    },
    {
        id: "css-s2",
        series: "chasing-sunsets",
        season: "Season II",
        year: "2025",
        title: "Chasing Sun(Sets)",
        subtitle: "Bigger rooms, deeper rhythm, more golden hours.",
        status: "past",
        accentColor: "#E8B86D",
        borderColor: "rgba(232,184,109,0.25)",
        coverImage: "/images/chasing-sunsets.jpg",
        events: [
            {
                date: "Summer 2025",
                venue: "Chicago Rooftop",
                location: "Chicago, IL",
                lineup: "Resident DJs · Expanded Lineup",
                highlight: "Season II brought a larger crowd, a refined sound, and the proof that this was more than a one-summer thing.",
                hasFootage: true,
            },
        ],
    },
    {
        id: "css-s3",
        series: "chasing-sunsets",
        season: "Season III",
        year: "2026",
        title: "Chasing Sun(Sets)",
        subtitle: "The season is coming. Golden hour, elevated.",
        status: "upcoming",
        accentColor: "#E8B86D",
        borderColor: "rgba(232,184,109,0.35)",
        coverImage: "/images/chasing-sunsets.jpg",
        events: [
            {
                date: "Summer 2026",
                venue: "TBA",
                location: "Chicago, IL",
                lineup: "TBA",
                highlight: "Season III is on the horizon. Sign up to be first to know.",
                hasFootage: false,
            },
        ],
    },
    // ── Untold Story ───────────────────────────────────────────────────────────
    {
        id: "us-s1",
        series: "untold-story",
        season: "Season I",
        year: "2024",
        title: "Untold Story",
        subtitle: "Late night, immersive, and the first Untold Story season.",
        status: "past",
        accentColor: "#8B5CF6",
        borderColor: "rgba(139,92,246,0.25)",
        coverImage: "/images/untold-deron-single.jpg",
        events: [
            {
                date: "2024",
                venue: "Chicago",
                location: "Chicago, IL",
                lineup: "Deron · Resident Selectors",
                highlight: "The first Untold Story — an intimate late-night experience that set the blueprint for everything after.",
                hasFootage: true,
            },
        ],
    },
    {
        id: "us-s2",
        series: "untold-story",
        season: "Season II",
        year: "2025",
        title: "Untold Story",
        subtitle: "360° sound. Deeper rooms. The story grows.",
        status: "past",
        accentColor: "#8B5CF6",
        borderColor: "rgba(139,92,246,0.25)",
        coverImage: "/images/lazare-recap.webp",
        events: [
            {
                date: "December 12, 2025",
                venue: "Chicago",
                location: "Chicago, IL",
                lineup: "Lazare Sabry · Special Guests",
                highlight: "Season II introduced 360° immersive sound and a new level of production. The room got bigger, the music got deeper.",
                hasFootage: true,
            },
        ],
    },
    {
        id: "us-s3",
        series: "untold-story",
        season: "Season III",
        year: "2026",
        title: "Untold Story",
        subtitle: "The biggest season yet. In progress.",
        status: "active",
        accentColor: "#8B5CF6",
        borderColor: "rgba(139,92,246,0.4)",
        coverImage: "/images/untold-story-juany-deron-v2.jpg",
        events: [
            {
                date: "March 6, 2026",
                venue: "Alhambra Palace",
                location: "West Loop, Chicago",
                lineup: "Deron B2B Juany Bravo · Hashtom · Rose · Jerome · Avo · Kenny",
                highlight: "S3·E2 — Deron B2B Juany Bravo. The most anticipated pairing in Untold Story history.",
                hasFootage: true,
            },
        ],
    },
];

const seriesFilters = [
    { id: "all", label: "All Series" },
    { id: "chasing-sunsets", label: "Chasing Sun(Sets)" },
    { id: "untold-story", label: "Untold Story" },
];

const statusBadge = {
    past: { label: "Archived", color: "rgba(255,255,255,0.25)", bg: "rgba(255,255,255,0.06)" },
    active: { label: "Season Active", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
    upcoming: { label: "Coming Soon", color: "#E8B86D", bg: "rgba(232,184,109,0.12)" },
};

function getSeasonGalleryHref(season: ArchiveSeason) {
    const seasonNumber = season.id.match(/s(\d+)$/)?.[1];
    if (!seasonNumber) return null;

    const key = `${season.series}-season-${seasonNumber}`;
    const gallery = archiveCollectionsBySlug[key];

    return gallery && gallery.media.length > 0 ? `/${season.series}/season-${seasonNumber}` : null;
}

function SeriesIcon({ series, color }: { series: ArchiveSeason["series"]; color: string }) {
    if (series === "chasing-sunsets") return <Sun className="w-4 h-4" style={{ color }} />;
    // UntoldButterflyLogo doesn't accept style prop — use className with closest Tailwind color
    const cls = color === "#8B5CF6" ? "w-4 h-4 text-violet-400" : "w-4 h-4 text-white/60";
    return <UntoldButterflyLogo className={cls} />;
}

export default function Archive() {
    const [filter, setFilter] = useState<"all" | "chasing-sunsets" | "untold-story">("all");
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => { 
        window.scrollTo(0, 0); 
    }, []);

    const toggle = (id: string) => {
        signalChirp.click();
        setExpanded(expanded === id ? null : id);
    };

    const filtered = filter === "all" ? archiveData : archiveData.filter((s) => s.series === filter);

    return (
        <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
            <SEO
                title="Archive"
                description="The full history of Monolith Project events — Chasing Sun(Sets) and Untold Story, season by season."
            />
            <Navigation />

            {/* Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(232,184,109,0.06),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(139,92,246,0.06),transparent_50%)]" />
                <div className="absolute inset-0 bg-noise opacity-[0.03]" />
            </div>

            <main className="relative z-10 page-shell-start-loose pb-32">
                <div className="container max-w-6xl mx-auto px-6">

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
                        <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-6">
                            ARCHIVE
                        </h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ originX: 0 }}
                            className="h-[2px] w-36 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-6"
                        />
                        <p className="text-white/45 max-w-xl leading-relaxed">
                            Every season, every event, and every gallery we have published so far.
                        </p>
                    </motion.div>

                    {/* Stats bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap gap-8 mb-12 pb-12 border-b border-white/8"
                    >
                        {[
                            { label: "Series", value: "2" },
                            { label: "Seasons", value: "6" },
                            { label: "Years Active", value: "2024–" },
                            { label: "Home Base", value: "Chicago" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="font-display text-3xl text-white">{stat.value}</p>
                                <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Filter tabs */}
                    <div className="flex flex-wrap gap-2 mb-12">
                        {seriesFilters.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id as typeof filter)}
                                className="px-5 py-2 font-mono text-[10px] tracking-[0.25em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                                style={{
                                    background: filter === f.id ? "rgba(224,90,58,0.12)" : "rgba(255,255,255,0.04)",
                                    border: `1px solid ${filter === f.id ? "rgba(224,90,58,0.4)" : "rgba(255,255,255,0.08)"}`,
                                    color: filter === f.id ? "#E05A3A" : "rgba(255,255,255,0.4)",
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Archive grid — Fan Down Pattern */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-t border-white/10"
                        >
                            {filtered.map((season, idx) => {
                                const badge = statusBadge[season.status];
                                const isOpen = expanded === season.id;
                                const galleryHref = getSeasonGalleryHref(season);

                                return (
                                    <div 
                                        key={season.id} 
                                        id={season.id} 
                                        className="w-full border-b border-white/10 flex flex-col group scroll-mt-32"
                                    >
                                        <button
                                            onClick={() => toggle(season.id)}
                                            onMouseEnter={() => signalChirp.hover()}
                                            data-cursor-image={season.coverImage}
                                            className="w-full text-left py-8 md:py-12 px-2 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus-visible:outline-none focus-visible:bg-white/[0.03]"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-grow">
                                                <div className="flex items-center gap-4 min-w-[140px]">
                                                    <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/30">
                                                        {season.year}
                                                    </span>
                                                    <div className="flex-grow h-px bg-white/10 hidden md:block" />
                                                </div>
                                                
                                                <div className="min-w-0 flex-grow">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <SeriesIcon series={season.series} color={season.accentColor} />
                                                        <span className="font-mono text-[9px] tracking-[0.25em] uppercase" style={{ color: season.accentColor }}>
                                                            {season.title}
                                                        </span>
                                                        <span
                                                            className="px-2 py-0.5 font-mono text-[8px] tracking-widest uppercase border"
                                                            style={{ 
                                                                background: `${badge.color}10`, 
                                                                color: badge.color, 
                                                                borderColor: `${badge.color}25` 
                                                            }}
                                                        >
                                                            {badge.label}
                                                        </span>
                                                    </div>
                                                    <h2 className="font-display text-3xl md:text-5xl uppercase tracking-widest text-white/90 group-hover:text-white group-hover:translate-x-2 transition-all duration-500">
                                                        {season.season}
                                                    </h2>
                                                </div>
                                            </div>

                                            <div className="w-12 h-12 rounded-full border border-white/10 flex flex-shrink-0 items-center justify-center group-hover:bg-white group-hover:border-white transition-all ml-4">
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 45 : 0 }}
                                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                                >
                                                    <span className="text-white/60 group-hover:text-black transition-colors text-2xl font-light leading-none">+</span>
                                                </motion.div>
                                            </div>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden bg-white/[0.01]"
                                                >
                                                    <div className="px-6 md:px-12 pb-16 pt-4 border-t border-white/5">
                                                        <div className="grid lg:grid-cols-12 gap-12 items-start">
                                                            {/* Media Visual */}
                                                            <div className="lg:col-span-5 relative aspect-[4/5] md:aspect-square overflow-hidden bg-white/5">
                                                                <img 
                                                                    src={season.coverImage} 
                                                                    alt={season.title}
                                                                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                                                <div className="absolute bottom-8 left-8">
                                                                    <p className="text-white/60 text-sm max-w-xs italic leading-relaxed">
                                                                        "{season.subtitle}"
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Event Details */}
                                                            <div className="lg:col-span-7 space-y-12">
                                                                {season.events.map((event, eIdx) => (
                                                                    <div key={eIdx} className="space-y-8">
                                                                        <div className="flex flex-wrap gap-x-12 gap-y-6">
                                                                            <div className="flex flex-col gap-2">
                                                                                <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Date</span>
                                                                                <div className="flex items-center gap-3 text-white text-lg font-display uppercase">
                                                                                    <Calendar className="w-4 h-4" style={{ color: season.accentColor }} />
                                                                                    {event.date}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex flex-col gap-2">
                                                                                <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Location</span>
                                                                                <div className="flex items-center gap-3 text-white text-lg font-display uppercase">
                                                                                    <MapPin className="w-4 h-4" style={{ color: season.accentColor }} />
                                                                                    {event.venue} — {event.location}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 block mb-4">Lineup</span>
                                                                            <p className="text-xl md:text-2xl font-display text-white/80 leading-snug tracking-wider">
                                                                                {event.lineup}
                                                                            </p>
                                                                        </div>

                                                                        {event.highlight && (
                                                                            <div className="p-6 bg-white/5 border-l-2 border-primary/40">
                                                                                <p className="text-white/50 text-sm leading-relaxed italic">
                                                                                    {event.highlight}
                                                                                </p>
                                                                            </div>
                                                                        )}

                                                                        <div className="flex flex-wrap gap-4 pt-4">
                                                                            {event.hasFootage && galleryHref && (
                                                                                <Link href={galleryHref} asChild>
                                                                                    <a className="px-8 py-4 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-mono text-[10px] tracking-widest uppercase flex items-center gap-3 group/btn">
                                                                                        <Play className="w-3 h-3 transition-transform group-hover/btn:scale-110" />
                                                                                        View Gallery
                                                                                    </a>
                                                                                </Link>
                                                                            )}
                                                                            {season.status === "active" && (
                                                                                <Link href="/tickets" asChild>
                                                                                    <a className="px-8 py-4 bg-primary text-white hover:bg-primary/90 transition-all duration-300 font-mono text-[10px] tracking-widest uppercase flex items-center gap-3">
                                                                                        Get Tickets
                                                                                        <ArrowUpRight className="w-3 h-3" />
                                                                                    </a>
                                                                                </Link>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-20 pt-12 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                        <div>
                            <p className="font-display text-2xl uppercase text-white mb-1">What's Next</p>
                            <p className="text-sm text-white/40">The next events are already on the calendar.</p>
                        </div>
                        <Link href="/schedule" asChild>
                            <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-mono text-[10px] tracking-widest uppercase hover:bg-primary/85 transition-all">
                                {CTA_LABELS.schedule}
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </Link>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
