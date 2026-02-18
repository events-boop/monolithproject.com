import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Download, Mail, FileText, Image, Music } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const pressContacts = [
    {
        role: "General Press",
        email: "press@monolithproject.com",
        note: "Media inquiries, interview requests, editorial coverage",
    },
    {
        role: "Event Coverage",
        email: "events@monolithproject.com",
        note: "Press passes, photographer credentials, recap requests",
    },
];

const brandAssets = [
    {
        label: "Primary Logo",
        format: "SVG · PNG",
        desc: "Full wordmark, light and dark variants",
        icon: Image,
        color: "#E05A3A",
        available: true,
    },
    {
        label: "Series Logos",
        format: "SVG · PNG",
        desc: "Chasing Sun(Sets) and Untold Story marks",
        icon: Image,
        color: "#E8B86D",
        available: true,
    },
    {
        label: "Brand Guidelines",
        format: "PDF",
        desc: "Colors, typography, usage rules, spacing",
        icon: FileText,
        color: "#8B5CF6",
        available: true,
    },
    {
        label: "Event Photography",
        format: "ZIP · High-res JPG",
        desc: "Curated press photos from past seasons",
        icon: Image,
        color: "#E05A3A",
        available: true,
    },
    {
        label: "Artist EPKs",
        format: "PDF",
        desc: "Electronic press kits for featured artists",
        icon: FileText,
        color: "#E8B86D",
        available: false,
    },
    {
        label: "Music / Mixes",
        format: "SoundCloud · Spotify",
        desc: "Official mixes and curated playlists",
        icon: Music,
        color: "#1DB954",
        available: true,
    },
];

const pressHighlights = [
    {
        outlet: "Chicago Scene",
        headline: "Monolith Project is redefining Chicago's underground house music experience",
        year: "2025",
        url: "#",
    },
    {
        outlet: "Resident Advisor",
        headline: "The collectives bringing immersive dance culture back to the Midwest",
        year: "2025",
        url: "#",
    },
    {
        outlet: "Chicago Reader",
        headline: "Untold Story: The late-night series that Chicago's house heads have been waiting for",
        year: "2024",
        url: "#",
    },
];

const fastFacts = [
    { label: "Founded", value: "2024" },
    { label: "Based", value: "Chicago, IL" },
    { label: "Series", value: "2 Active" },
    { label: "Seasons", value: "6 Total" },
    { label: "Genre", value: "Afro · Melodic · House" },
    { label: "Capacity", value: "150–500" },
    { label: "Home Venue", value: "Alhambra Palace" },
    { label: "Press Contact", value: "press@monolithproject.com" },
];

export default function Press() {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
            <SEO
                title="Press & Media Kit"
                description="Press resources, brand assets, and media contacts for The Monolith Project — Chicago's premier immersive house music collective."
            />
            <Navigation />

            {/* Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(224,90,58,0.07),transparent_50%),radial-gradient(ellipse_at_85%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
                <div className="absolute inset-0 bg-noise opacity-[0.03]" />
            </div>

            <main className="relative z-10 pt-44 md:pt-52 pb-32">
                <div className="container max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-20"
                    >
                        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
                            — Media Resources
                        </span>
                        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-6">
                            PRESS &<br />MEDIA KIT
                        </h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ originX: 0 }}
                            className="h-[2px] w-44 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-8"
                        />
                        <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
                            Everything you need to cover The Monolith Project. Assets, contacts, and context — all in one place.
                        </p>

                        {/* Press CTA */}
                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="mailto:press@monolithproject.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-mono text-[10px] tracking-widest uppercase hover:bg-primary/85 transition-all"
                            >
                                <Mail className="w-3.5 h-3.5" />
                                Contact Press
                            </a>
                            <a
                                href="#assets"
                                className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[10px] tracking-widest uppercase transition-all"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download Assets
                            </a>
                        </div>
                    </motion.div>

                    {/* Fast Facts */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-20 p-8 relative overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">Fast Facts</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {fastFacts.map((fact) => (
                                <div key={fact.label}>
                                    <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/25 mb-1">{fact.label}</p>
                                    <p className="text-sm text-white/75">{fact.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* About blurb */}
                    <div className="grid lg:grid-cols-12 gap-10 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:col-span-7"
                        >
                            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5">About</p>
                            <div className="space-y-4 text-white/60 leading-relaxed">
                                <p>
                                    The Monolith Project is a Chicago-based events collective dedicated to building immersive, community-driven music experiences. Founded in 2024, the collective operates two flagship series: <span className="text-white/80">Chasing Sun(Sets)</span> — a rooftop golden-hour experience — and <span className="text-white/80">Untold Story</span> — a late-night 360° immersive house music journey.
                                </p>
                                <p>
                                    Rooted in Afro house, melodic house, and global rhythms, Monolith Project events are designed for people who show up early, stay late, and hold space on the dancefloor. Every event is a curated experience, not a club night.
                                </p>
                                <p>
                                    Based at Alhambra Palace in Chicago's West Loop, the collective has built a reputation for world-class sound, intentional production, and a community-first approach to nightlife.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:col-span-5"
                        >
                            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5">Press Contacts</p>
                            <div className="space-y-4">
                                {pressContacts.map((contact) => (
                                    <div
                                        key={contact.role}
                                        className="p-5 relative overflow-hidden"
                                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                                    >
                                        <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-primary/70 mb-2">{contact.role}</p>
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1.5 group mb-2"
                                        >
                                            {contact.email}
                                            <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                        <p className="text-xs text-white/35 leading-relaxed">{contact.note}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Brand Assets */}
                    <div id="assets" className="mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">Brand Assets</p>
                            <p className="text-white/40 text-sm">Request assets via email — we'll send a download link within 24 hours.</p>
                        </motion.div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {brandAssets.map((asset, idx) => (
                                <motion.div
                                    key={asset.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ delay: idx * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    className="group p-5 relative overflow-hidden transition-all duration-300"
                                    style={{
                                        background: "rgba(255,255,255,0.025)",
                                        border: `1px solid ${asset.available ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`,
                                        opacity: asset.available ? 1 : 0.5,
                                    }}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ background: `linear-gradient(to right, ${asset.color}60, transparent)` }} />

                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-9 h-9 flex items-center justify-center"
                                            style={{ background: `${asset.color}12`, border: `1px solid ${asset.color}25` }}
                                        >
                                            <asset.icon className="w-4 h-4" style={{ color: asset.color }} />
                                        </div>
                                        {!asset.available && (
                                            <span className="font-mono text-[8px] tracking-widest uppercase text-white/25 border border-white/10 px-2 py-0.5">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-display text-base uppercase text-white mb-1">{asset.label}</h3>
                                    <p className="font-mono text-[9px] tracking-widest uppercase mb-2" style={{ color: asset.color }}>{asset.format}</p>
                                    <p className="text-xs text-white/40 leading-relaxed mb-4">{asset.desc}</p>

                                    {asset.available && (
                                        <a
                                            href="mailto:press@monolithproject.com?subject=Asset Request"
                                            className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase transition-colors"
                                            style={{ color: `${asset.color}80` }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = asset.color)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = `${asset.color}80`)}
                                        >
                                            Request
                                            <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Press Coverage */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mb-20"
                    >
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">As Seen In</p>
                        <div className="space-y-3">
                            {pressHighlights.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -12 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.07, duration: 0.4 }}
                                    className="flex items-center gap-5 p-5"
                                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    <div className="flex-shrink-0 w-24">
                                        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-primary/70">{item.outlet}</p>
                                        <p className="font-mono text-[8px] text-white/25 mt-0.5">{item.year}</p>
                                    </div>
                                    <p className="flex-1 text-sm text-white/55 leading-relaxed italic">
                                        "{item.headline}"
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-white/25 font-mono italic">* Coverage examples — update with real placements as they come in.</p>
                    </motion.div>

                    {/* Bottom press CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="pt-12 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    >
                        <div>
                            <p className="font-display text-2xl uppercase text-white mb-1">Need Something Else?</p>
                            <p className="text-sm text-white/40">We'll get back to press inquiries within 24 hours.</p>
                        </div>
                        <a
                            href="mailto:press@monolithproject.com"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-mono text-[10px] tracking-widest uppercase hover:bg-primary/85 transition-all"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            press@monolithproject.com
                        </a>
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
