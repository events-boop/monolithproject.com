import { motion } from "framer-motion";
import { ArrowRight, Music, Building2, Handshake, Wrench } from "lucide-react";
import { Link } from "wouter";
import EditorialHeader from "./EditorialHeader";

const connectOptions = [
    {
        id: "artist",
        icon: Music,
        title: "Artists & DJs",
        subtitle: "Play With Us",
        description: "We're always looking for artists who fit the sound. Send us your mix and let's talk.",
        link: "/booking",
        delay: 0
    },
    {
        id: "production",
        icon: Wrench,
        title: "Production Crew",
        subtitle: "Build the Show",
        description: "Bartenders, security, stagehands, lighting techs, dancers — if you help make shows happen, we want to hear from you.",
        link: "/partners",
        delay: 0.1
    },
    {
        id: "venue",
        icon: Building2,
        title: "Venue Partners",
        subtitle: "Host an Event",
        description: "Have a space that fits the vibe? We bring the crowd, the sound, and the creative direction.",
        link: "/partners",
        delay: 0.2
    },
    {
        id: "sponsor",
        icon: Handshake,
        title: "Brand Partners",
        subtitle: "Work Together",
        description: "Interested in reaching a real community? Let's find a way to work together that feels natural.",
        link: "/sponsors",
        delay: 0.3
    }
];

export default function ConnectSection() {
    return (
        <section id="connect" className="section-rhythm-tight bg-background relative overflow-hidden">
            {/* Ambient Base Layer */}
            <div className="absolute inset-0 bg-[#050505]" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute inset-0 atmo-surface opacity-40 pointer-events-none" />

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                <EditorialHeader
                    kicker="Work With Us"
                    title="Get Involved"
                    description="We're building something and we need the right people. Artists, crew, venues, brands — let's connect."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {connectOptions.map((option) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: option.delay, duration: 0.5, ease: "easeOut" }}
                            className="h-full"
                        >
                            <Link href={option.link} className="block h-full group focus-visible:outline-none rounded-sm">
                                <div className="relative h-full p-8 md:p-10 border border-white/5 bg-white/[0.015] backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.03] hover:border-primary/20 flex flex-col group-focus-visible:ring-2 ring-primary/50 overflow-hidden">

                                    {/* Hover Glow Effect */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col h-full">
                                        {/* Icon */}
                                        <div className="mb-8 text-white/30 group-hover:text-primary group-hover:scale-110 origin-left transition-all duration-500">
                                            <option.icon strokeWidth={1} className="w-10 h-10" />
                                        </div>

                                        {/* Meta */}
                                        <div className="flex flex-col gap-2 mb-4">
                                            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary/70">
                                                {option.subtitle}
                                            </span>
                                            <h3 className="font-display text-3xl md:text-4xl text-white leading-[0.85] tracking-wide group-hover:text-white transition-colors">
                                                {option.title}
                                            </h3>
                                        </div>

                                        {/* Desc */}
                                        <p className="text-white/40 text-sm leading-relaxed mb-10 flex-grow font-light border-l border-white/5 pl-4 ml-1 group-hover:border-primary/30 transition-colors duration-500">
                                            {option.description}
                                        </p>

                                        {/* Footer/CTA */}
                                        <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 group-hover:text-white transition-colors mt-auto">
                                            <span>Start Here</span>
                                            <div className="relative w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-primary transition-all duration-300">
                                                <ArrowRight className="absolute -right-1 -top-1.5 w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
