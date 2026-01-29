import { motion } from "framer-motion";
import { Play, SkipBack, SkipForward, Disc, Globe, MapPin } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import { Link } from "wouter";
import GlobalListenerMap from "@/components/GlobalListenerMap";

// The "Foundation" Sets - Chapter 01
const ARCHIVE_SETS = [
    { id: 1, title: "The Awakening", location: "Johannesburg", coordinates: "26.20° S, 28.04° E", artist: "BLACK COFFEE", date: "2025.01.01", coverColor: "bg-[#D4A574]" },
    { id: 2, title: "Solar Return", location: "Tulum", coordinates: "20.21° N, 87.46° W", artist: "KEINEMUSIK", date: "2025.01.15", coverColor: "bg-[#333]" },
    { id: 3, title: "Urban Concrete", location: "Berlin", coordinates: "52.52° N, 13.40° E", artist: "BEN BOHMER", date: "2025.02.02", coverColor: "bg-[#555]" },
    { id: 4, title: "Desert Mirage", location: "Dubai", coordinates: "25.20° N, 55.27° E", artist: "ADRIATIQUE", date: "2025.02.18", coverColor: "bg-[#D4A574]" },
    { id: 5, title: "Pacific Drift", location: "Los Angeles", coordinates: "34.05° N, 118.24° W", artist: "LANE 8", date: "2025.03.01", coverColor: "bg-[#222]" },
    { id: 6, title: "High Altitude", location: "Swiss Alps", coordinates: "46.81° N, 8.22° E", artist: "ARTBAT", date: "2025.03.15", coverColor: "bg-[#999]" },
    { id: 7, title: "Island Echoes", location: "Ibiza", coordinates: "38.90° N, 1.41° E", artist: "SOLOMUN", date: "2025.04.01", coverColor: "bg-[#D4A574]" },
    { id: 8, title: "Neon Nights", location: "Tokyo", coordinates: "35.67° N, 139.65° E", artist: "PEGGY GOU", date: "2025.04.20", coverColor: "bg-[#444]" },
    { id: 9, title: "Deep Forest", location: "Bali", coordinates: "8.40° S, 115.18° E", artist: "RUFUS DU SOL", date: "2025.05.05", coverColor: "bg-[#666]" },
    { id: 10, title: "Rooftop Haze", location: "New York", coordinates: "40.71° N, 74.00° W", artist: "THE BLESSED MADONNA", date: "2025.05.25", coverColor: "bg-[#D4A574]" },
    { id: 11, title: "The Return", location: "Chicago", coordinates: "41.87° N, 87.62° W", artist: "HONEY DIJON", date: "2025.06.11", coverColor: "bg-[#000]" },
];

import Navigation from "@/components/Navigation";

export default function Radio() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4A574] selection:text-black overflow-x-hidden">
            {/* Global Navigation */}
            <Navigation />

            <div className="container max-w-7xl mx-auto px-6 pt-24 pb-40">

                {/* HERO SECTION: Global Map & Live Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] mb-24">

                    {/* Text / Data Column */}
                    <div className="order-2 lg:order-1 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 border border-white/20 rounded-full text-[10px] tracking-[0.2em] uppercase text-white/60">
                                    Global Frequency
                                </span>
                                <span className="px-3 py-1 bg-[#D4A574]/10 border border-[#D4A574]/30 rounded-full text-[10px] tracking-[0.2em] uppercase text-[#D4A574]">
                                    11,402 Listeners
                                </span>
                            </div>

                            <h1 className="font-display text-8xl md:text-[8rem] lg:text-[10rem] leading-[0.85] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                                GLOBAL<br />SYNC
                            </h1>

                            <p className="font-serif italic text-2xl text-white/50 max-w-lg mb-12">
                                We are not listening alone. Across {new Date().getHours() > 12 ? 'Tokyo, Berlin, and Lagos' : 'New York, London, and Tulum'}, the ritual connects us.
                            </p>

                            {/* Now Playing Widget - Inline */}
                            <div className="glass p-6 rounded-xl border-l-2 border-[#D4A574] max-w-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded bg-black/50 flex items-center justify-center shrink-0">
                                        <Disc className="w-8 h-8 text-white/20 animate-spin-slow" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-widest text-[#D4A574] mb-1">Current Transmission</div>
                                        <div className="font-display text-2xl leading-none mb-1">SET 004 // DESERT MIRAGE</div>
                                        <div className="text-xs font-mono text-white/40">ADRIATIQUE • LIVE FROM DUBAI</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Globe Vis Column */}
                    <div className="order-1 lg:order-2 h-[50vh] lg:h-[80vh] w-full relative">
                        <div className="absolute inset-0 pointer-events-none">
                            <GlobalListenerMap />
                        </div>
                        {/* Overlay Gradient to blend bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
                    </div>
                </div>


                {/* THE ARCHIVE - CHAPTER 01 */}
                <div className="mb-12 flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                        <h2 className="font-display text-4xl md:text-6xl text-white mb-2">CHAPTER 01</h2>
                        <p className="font-mono text-sm text-[#D4A574] tracking-widest">THE FOUNDATION // 11 SETS</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 pb-48">
                    {ARCHIVE_SETS.map((set) => (
                        <motion.div
                            key={set.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            {/* Card Image/Glyph Area */}
                            <div className="relative aspect-[4/5] bg-[#111] border border-white/5 mb-4 overflow-hidden">
                                <div className={`absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity ${set.coverColor}`} />
                                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-xs text-white/30">NO. {String(set.id).padStart(2, '0')}</span>
                                        <Globe className="w-4 h-4 text-white/20" />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        {/* Abstract Glyph Placeholder */}
                                        <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center group-hover:border-[#D4A574]/50 group-hover:scale-110 transition-all duration-500">
                                            <div className="w-12 h-12 border border-white/10 rotate-45 group-hover:rotate-90 transition-all duration-700" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-mono text-white/40 mb-1">{set.coordinates}</div>
                                        <div className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white">{set.location}</div>
                                    </div>
                                </div>

                                {/* Hover Play Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <MagneticButton>
                                        <div className="w-16 h-16 rounded-full bg-[#D4A574] text-black flex items-center justify-center">
                                            <Play className="w-6 h-6 ml-1" fill="currentColor" />
                                        </div>
                                    </MagneticButton>
                                </div>
                            </div>

                            {/* Meta */}
                            <h3 className="font-display text-2xl text-white mb-1 group-hover:text-[#D4A574] transition-colors">{set.title}</h3>
                            <p className="text-sm font-mono text-white/50">{set.artist} <span className="opacity-30 mx-2">|</span> {set.date}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}

