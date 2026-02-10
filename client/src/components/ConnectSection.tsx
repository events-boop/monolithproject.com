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
        description: "Bartenders, security, stagehands, camera operators, lighting techs, dancers, musicians — if you help make shows happen, we want to hear from you.",
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
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
            <div className="absolute inset-0 atmo-surface opacity-70 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_82%,rgba(34,211,238,0.1),transparent_30%),radial-gradient(circle_at_86%_24%,rgba(224,90,58,0.12),transparent_34%)] pointer-events-none" />

            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <EditorialHeader
                    kicker="Work With Us"
                    title="Get Involved"
                    description="We're building something and we need the right people. Artists, crew, venues, brands — let's connect."
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {connectOptions.map((option) => (
                        <Link key={option.id} href={option.link}>
                            <motion.a
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: option.delay, duration: 0.35 }}
                                className="ui-card group relative p-8 border border-white/15 bg-[linear-gradient(150deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] hover:border-primary/35 overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                                aria-label={`Connect with ${option.title}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-cyan-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),transparent_45%)] opacity-50 pointer-events-none" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="w-12 h-12 bg-primary/5 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <option.icon className="w-6 h-6 text-primary" />
                                    </div>

                                    <h3 className="ui-heading font-display text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {option.title}
                                    </h3>

                                    <p className="ui-meta text-primary mb-6 opacity-80">
                                        {option.subtitle}
                                    </p>

                                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                                        {option.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground group-hover:text-primary transition-colors">
                                        <span>Get in Touch</span>
                                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-2" />
                                    </div>
                                </div>
                            </motion.a>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
