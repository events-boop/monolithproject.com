
import { motion } from "framer-motion";
import { ArrowRight, Music, Building2, Handshake } from "lucide-react";

const connectOptions = [
    {
        id: "artist",
        icon: Music,
        title: "Artist / Agent",
        subtitle: "Programming & Curation",
        description: "For talent inquiries, avails, and curatorial alignment. We are building a platform, not just booking dates.",
        link: "/booking",
        delay: 0
    },
    {
        id: "venue",
        icon: Building2,
        title: "Venue Partner",
        subtitle: "Space & Infrastructure",
        description: "Align your space with The Monolith Project. We bring the narrative, audience, and creative direction.",
        link: "/booking",
        delay: 0.1
    },
    {
        id: "sponsor",
        icon: Handshake,
        title: "Brand / Sponsor",
        subtitle: "Strategic Partnerships",
        description: "Integration opportunities for brands seeking deep cultural connection and high-value audience alignment.",
        link: "/sponsors",
        delay: 0.2
    }
];

export default function ConnectSection() {
    return (
        <section id="connect" className="py-32 bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="container max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
                        06 — Connect
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl text-foreground mb-6">
                        ALIGN WITH <span className="text-silver-red-gradient">THE MONOLITH</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
                        Select your path. We filter all inquiries to ensure alignment with our core philosophy.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {connectOptions.map((option) => (
                        <motion.a
                            key={option.id}
                            href={option.link}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: option.delay, duration: 0.6 }}
                            className="group relative p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 rounded-sm overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <option.icon className="w-6 h-6 text-primary" />
                                </div>

                                <h3 className="font-display text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {option.title}
                                </h3>

                                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-6 opacity-80">
                                    {option.subtitle}
                                </p>

                                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow">
                                    {option.description}
                                </p>

                                <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground group-hover:text-primary transition-colors">
                                    <span>Initiate</span>
                                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-2" />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
