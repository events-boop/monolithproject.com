import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { POSH_TICKET_URL } from "@/data/events";

const lineup = [
    "Aaron Hibell", "Acid Pauli", "Adriatique", "Âme DJ b2b Sama' Abdulhadi",
    "Anetha", "Anfisa Letyago", "ANNA", "Arodes", "ARTBAT", "Ben Böhmer",
    "berlioz", "Carlita", "Deer Jade", "Enfant Sauvage", "Eric Prydz",
    "Étienne de Crécy", "Funk Tribu", "Ginton", "Jimi Jules", "Kasablanca",
    "Kenya Grace", "Kerri Chandler", "KILIMANJARO", "Kölsch", "Lane 8",
    "LP Giobbi b2b DJ Tennis", "Mahmut Orhan", "Marten Lou", "meera",
    "Michael Bibi", "Mind Against", "Miss Monique", "Monolink", "nimino",
    "Parra for Cuva", "Rodrigo Gallardo", "Röyksopp DJ Set", "Sammy Virji",
    "Thylacine", "Vintage Culture", "Weval", "YOTTO"
];

export default function TextLineupSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="relative py-32 bg-[#F5F5F0] text-[#050505] overflow-hidden">
            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                    <div>
                        <h2 className="font-display text-8xl md:text-[10rem] leading-[0.8] tracking-tighter mb-4 text-[#050505]">
                            THE<br />ARTISTS
                        </h2>
                        <p className="font-mono text-sm tracking-widest uppercase text-[#050505]/60 max-w-md">
                            3 days of music, 3 stages, 44 artists to send you into orbit.
                            A curation of the finest electronic music acts from around the globe.
                        </p>
                    </div>

                    <a
                        href="/lineup"
                        className="group hidden md:flex items-center gap-3 px-8 py-4 rounded-full border border-[#050505]/20 hover:bg-[#050505] hover:text-white transition-all duration-300"
                    >
                        <span className="font-bold tracking-widest text-sm uppercase">Full Lineup</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                </div>

                <motion.div style={{ y }} className="relative">
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-4 text-center leading-tight">
                        {lineup.map((artist, i) => (
                            <span key={artist} className="group relative">
                                <span className="font-display text-3xl md:text-5xl lg:text-6xl text-[#050505] uppercase tracking-tight hover:text-[#E05A3A] transition-colors duration-300 cursor-default">
                                    {artist}
                                </span>
                                {i < lineup.length - 1 && (
                                    <span className="inline-block mx-2 md:mx-4 align-middle w-1.5 h-1.5 bg-[#050505]/20 rounded-full" />
                                )}
                            </span>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-20 flex justify-center md:hidden">
                    <a
                        href="/lineup"
                        className="group flex items-center gap-3 px-8 py-4 rounded-full border border-[#050505]/20 hover:bg-[#050505] hover:text-white transition-all duration-300"
                    >
                        <span className="font-bold tracking-widest text-sm uppercase">Full Lineup</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
}
