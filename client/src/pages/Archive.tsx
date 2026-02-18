import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, ArrowUpRight, Calendar, MapPin, Users, Play } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";

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
                highlight: "The inaugural season — rooftop sunsets, golden hour vibes, and the beginning of something.",
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
        subtitle: "Bigger rooms, deeper grooves, more golden hours.",
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
        subtitle: "Late night. Immersive. The first chapter.",
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
        coverImage: "/images/untold-juany-single.jpg",
        events: [
            {
                date: "2025",
                venue: "Chicago",
                location: "Chicago, IL",
                lineup: "Juany Bravo · Deron · Guests",
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
        subtitle: "The most ambitious chapter yet. In progress.",
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
                hasFootage: false,
                footageUrl: "/story",
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

function SeriesIcon({ series, color }: { series: ArchiveSeason["series"]; color: string }) {
    if (series === "chasing-sunsets") return <Sun className="w-4 h-4" style={{ color }} />;
    // UntoldButterflyLogo doesn't accept style prop — use className with closest Tailwind color
    const cls = color === "#8B5CF6" ? "w-4 h-4 text-violet-400" : "w-4 h-4 text-white/60";
    return <UntoldButterflyLogo className={cls} />;
}

export default function Archive() {
    const [filter, setFilter] = useState<"all" | "chasing-sunsets" | "untold-story">("all");
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

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

            <main className="relative z-10 pt-44 md:pt-52 pb-32">
                <div className="container max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-16"
                    >
                        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
                            — The History
                        </span>
                        <h1 className="font-display text-[clamp(3.5rem,10vw,8.5rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-6">
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
                            Every season. Every chapter. The full story of what we've built — and what's still coming.
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

                    {/* Archive grid */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            {filtered.map((season, idx) => {
                                const badge = statusBadge[season.status];
                                const isOpen = expanded === season.id;

                                return (
                                    <motion.div
                                        key={season.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative overflow-hidden"
                                        style={{ border: `1px solid ${isOpen ? season.borderColor : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.3s" }}
                                    >
                                        {/* Top accent */}
                                        <div
                                            className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-300"
                                            style={{
                                                background: `linear-gradient(to right, ${season.accentColor}80, ${season.accentColor}20, transparent)`,
                                                opacity: isOpen ? 1 : 0.4,
                                            }}
                                        />

                                        {/* Header row — always visible */}
                                        <button
                                            onClick={() => setExpanded(isOpen ? null : season.id)}
                                            className="w-full flex items-center gap-5 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group"
                                        >
                                            {/* Cover thumbnail */}
                                            <div
                                                className="w-14 h-14 flex-shrink-0 bg-cover bg-center overflow-hidden"
                                                style={{ backgroundImage: `url(${season.coverImage})` }}
                                            >
                                                <div className="w-full h-full" style={{ background: `${season.accentColor}30` }} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                    <SeriesIcon series={season.series} color={season.accentColor} />
                                                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: season.accentColor }}>
                                                        {season.title}
                                                    </span>
                                                    <span
                                                        className="px-2 py-0.5 font-mono text-[8px] tracking-widest uppercase"
                                                        style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}30` }}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-baseline gap-3">
                                                    <h2 className="font-display text-xl md:text-2xl uppercase text-white">{season.season}</h2>
                                                    <span className="font-mono text-sm text-white/30">{season.year}</span>
                                                </div>
                                                <p className="text-sm text-white/40 mt-1 truncate">{season.subtitle}</p>
                                            </div>

                                            <div
                                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300"
                                                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                                            >
                                                <span className="text-white/30 text-xl leading-none">+</span>
                                            </div>
                                        </button>

                                        {/* Expanded content */}
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 border-t border-white/6">
                                                        {season.events.map((event, eIdx) => (
                                                            <div key={eIdx} className="pt-6">
                                                                {/* Event meta */}
                                                                <div className="flex flex-wrap gap-4 mb-4">
                                                                    {[
                                                                        { icon: Calendar, text: event.date },
                                                                        { icon: MapPin, text: `${event.venue} · ${event.location}` },
                                                                    ].map(({ icon: Icon, text }) => (
                                                                        <div key={text} className="flex items-center gap-2 text-xs text-white/40 font-mono">
                                                                            <Icon className="w-3 h-3" style={{ color: season.accentColor }} />
                                                                            {text}
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Lineup */}
                                                                <div className="mb-4">
                                                                    <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/25 mb-1">Lineup</p>
                                                                    <p className="text-sm text-white/60">{event.lineup}</p>
                                                                </div>

                                                                {/* Highlight */}
                                                                {event.highlight && (
                                                                    <div
                                                                        className="p-4 mb-5"
                                                                        style={{ background: `${season.accentColor}08`, borderLeft: `2px solid ${season.accentColor}40` }}
                                                                    >
                                                                        <p className="text-sm text-white/55 leading-relaxed italic">"{event.highlight}"</p>
                                                                    </div>
                                                                )}

                                                                {/* CTAs */}
                                                                <div className="flex flex-wrap gap-3">
                                                                    {event.hasFootage && (
                                                                        <a
                                                                            href="#"
                                                                            className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-all"
                                                                            style={{
                                                                                background: `${season.accentColor}12`,
                                                                                border: `1px solid ${season.accentColor}30`,
                                                                                color: season.accentColor,
                                                                            }}
                                                                        >
                                                                            <Play className="w-3 h-3" />
                                                                            Watch Footage
                                                                        </a>
                                                                    )}
                                                                    {season.status === "active" && (
                                                                        <Link href="/story" asChild>
                                                                            <a
                                                                                className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-all"
                                                                                style={{
                                                                                    background: `${season.accentColor}12`,
                                                                                    border: `1px solid ${season.accentColor}30`,
                                                                                    color: season.accentColor,
                                                                                }}
                                                                            >
                                                                                Get Tickets
                                                                                <ArrowUpRight className="w-3 h-3" />
                                                                            </a>
                                                                        </Link>
                                                                    )}
                                                                    {season.status === "upcoming" && (
                                                                        <Link href="/chasing-sunsets" asChild>
                                                                            <a
                                                                                className="inline-flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-all"
                                                                                style={{
                                                                                    background: `${season.accentColor}12`,
                                                                                    border: `1px solid ${season.accentColor}30`,
                                                                                    color: season.accentColor,
                                                                                }}
                                                                            >
                                                                                Learn More
                                                                                <ArrowUpRight className="w-3 h-3" />
                                                                            </a>
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
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
                            <p className="text-sm text-white/40">The next chapter is already in motion.</p>
                        </div>
                        <Link href="/schedule" asChild>
                            <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-mono text-[10px] tracking-widest uppercase hover:bg-primary/85 transition-all">
                                View Schedule
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </Link>
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
