/*
  DESIGN: S-Tier Premium - The Ritual Dashboard (First Scroll)
  - Bento Grid Layout (Asymmetric)
  - Purpose: Aggregate Events, Radio, and Roster into a "Command Center" feel.
  - Interactive, glassmorphic, and highly visual.
*/

import { motion } from "framer-motion";
import { Calendar, Play, ArrowUpRight, Radio, Users } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { Link } from "wouter";

// Mock Data for "Next Ritual"
const nextRitual = {
    title: "SPRING EQUINOX",
    date: "MAR 21 . 2026",
    location: "SECRET WAREHOUSE, CHICAGO",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1974&auto=format&fit=crop", // Concert crowd
};

// Mock Data for "Radio"
const latestMix = {
    title: "GOLDEN HOUR VOL. 4",
    artist: "AUTOGRAF",
    duration: "58:00",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop", // Abstract sun
};

export default function RitualDashboard() {
    return (
        <section id="dashboard" className="relative py-24 md:py-32 bg-background section-padding overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" /> {/* Smooth fade out */}

            <div className="max-w-7xl mx-auto">

                {/* Section Header - Connected to Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-12 border-b border-white/10 pb-6"
                >
                    <div>
                        <span className="text-xs font-mono text-primary tracking-widest uppercase mb-2 block">
                            TRANSMISSION INCOMING
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl text-foreground/90">
                            EXPLORE THE FREQUENCY
                        </h2>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Welcome to the new era. Secure your place, tune in, or discover the architects of sound.
                        </p>
                    </div>
                </motion.div>

                {/* BENTO GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">

                    {/* CARD 1: NEXT EVENT (Dominant - 7 Cols) */}
                    <Link href="/chasing-sunsets">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="col-span-1 lg:col-span-7 relative group overflow-hidden rounded-3xl border border-white/10 bg-card cursor-pointer min-h-[400px]"
                        >
                            {/* Background Image with Zoom */}
                            <div className="absolute inset-0">
                                <img
                                    src={nextRitual.image}
                                    alt="Event Background"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <span className="px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                                        Next Ritual
                                    </span>
                                    <ArrowUpRight className="text-white/50 group-hover:text-primary transition-colors w-8 h-8" />
                                </div>

                                <div>
                                    <h3 className="font-display text-5xl md:text-7xl text-white mb-2 leading-[0.85] tracking-tighter group-hover:text-primary transition-colors duration-500">
                                        {nextRitual.title}
                                    </h3>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-white/80 font-mono text-sm tracking-widest mt-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            {nextRitual.date}
                                        </div>
                                        <div className="hidden md:block w-1 h-1 bg-primary rounded-full" />
                                        <div>{nextRitual.location}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>


                    {/* RIGHT COLUMN STACK (5 Cols) */}
                    <div className="col-span-1 lg:col-span-5 grid grid-rows-1 md:grid-rows-2 gap-6 h-full">

                        {/* CARD 2: LATEST RADIO (Top Half) */}
                        <Link href="/radio">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="relative group overflow-hidden rounded-3xl border border-white/10 bg-card/40 backdrop-blur-sm p-8 flex flex-col justify-center min-h-[250px] cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Radio className="w-5 h-5 animate-pulse" />
                                        <span className="text-xs font-bold tracking-widest uppercase">Live Station</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 shadow-lg relative group-hover:scale-105 transition-transform duration-500 shrink-0">
                                        <img src={latestMix.image} alt="Mix Cover" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <Play className="w-8 h-8 text-white fill-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-display text-3xl text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {latestMix.title}
                                        </h4>
                                        <p className="text-muted-foreground text-sm tracking-wide">
                                            ft. {latestMix.artist}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>

                        {/* CARD 3: ROSTER CALL (Bottom Half) */}
                        <Link href="/artists/1">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="relative group overflow-hidden rounded-3xl border border-white/10 bg-black flex flex-col justify-between p-8 cursor-pointer h-full"
                            >
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bottom-0 bg-gradient-to-t from-primary/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">The Architects</span>
                                        <Users className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                                    </div>
                                    <h4 className="font-display text-4xl text-white group-hover:tracking-wider transition-all duration-500">
                                        MONOLITH ROSTER
                                    </h4>
                                </div>

                                <div className="relative z-10 flex items-center gap-2 text-primary text-sm font-bold tracking-widest uppercase mt-4">
                                    <span>View Artists</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
}
