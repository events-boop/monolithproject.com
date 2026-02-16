import { motion } from "framer-motion";
import { Users, Music, Calendar, TrendingUp } from "lucide-react";

const metrics = [
    { label: "Attendees (July 4th)", value: "3,000+", icon: Users },
    { label: "Rooftop RSVPs", value: "1,400+", icon: Calendar },
    { label: "Programming", value: "12 Hours", icon: Music },
    { label: "Talent", value: "Sarat, Kenbo & Friends", icon: Users },
];

const benefits = [
    { title: "Community Impact", description: "Creating spaces for connection in a disconnected world." },
    { title: "Cultural Alignment", description: "Aligning with a sophisticated, globally recognized music brand." },
    { title: "New Audience", description: "Engaging a high-value, culturally aware demographic (25-45)." },
    { title: "Curated Experience", description: "Bespoke production, world-class sound, and thoughtful design." },
];

export default function ChasingSunsetsDetails() {
    return (
        <section className="py-24 px-6 bg-sand text-charcoal relative overflow-hidden">
            {/* Background image wash (kept subtle so copy remains readable) */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <img
                    src="/images/chasing-sunsets-tradition.jpg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        // Fallback if the preferred photo hasn't been added yet.
                        (e.currentTarget as HTMLImageElement).src = "/images/chasing-sunsets.jpg";
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-[50%_35%] opacity-[0.6] saturate-[1.1] contrast-[1.08] brightness-[0.98]"
                />
                {/* Cream gradient veil for legibility */}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,245,237,0.82)_0%,rgba(251,245,237,0.62)_40%,rgba(251,245,237,0.84)_100%)]" />
                {/* Warm accent blooms */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(232,184,109,0.22),transparent_52%),radial-gradient(circle_at_82%_78%,rgba(194,112,62,0.18),transparent_56%)] mix-blend-multiply" />
            </div>

            <div className="container max-w-6xl mx-auto relative z-10">

                {/* Intro / Vision */}
                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-6 text-clay">
                            Who We Are
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6 text-charcoal">
                            A DEFINING SUMMER TRADITION
                        </h2>
                        <p className="text-lg leading-relaxed opacity-80 mb-6">
                            Chasing Sun(sets) is a globally recognized, sunset-focused event series built on community, intention, and melodic/Afro house music.
                        </p>
                        <p className="text-lg leading-relaxed opacity-80">
                            We create cinematic, luxury-minimalist experiences that attract sophisticated, high-value audiences. Our vision is to establish an annual summer tradition that grows in scale and prestige.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-clay/20"
                    >
                        <h3 className="font-display text-2xl mb-6 text-charcoal">THE VISION</h3>
                        <p className="mb-6 opacity-80">
                            Partner with The Monolith Project for the Chasing Sun(sets) Summer Series 2026. A collaboration to bring 4-6 defining moments to the city (May-Sept).
                        </p>
                        <ul className="space-y-4">
                            {benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1 text-clay"><TrendingUp size={16} /></span>
                                    <div>
                                        <strong className="block text-sm font-bold uppercase tracking-wide">{b.title}</strong>
                                        <span className="text-sm opacity-70">{b.description}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Metrics Grid */}
                <div className="mb-24">
                    <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-8 text-center text-clay">
                        Track Record (2025)
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {metrics.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 bg-white/60 backdrop-blur-md rounded-xl border border-clay/20 text-center hover:border-clay/40 transition-colors"
                            >
                                <m.icon className="w-6 h-6 mx-auto mb-4 text-clay" />
                                <div className="font-display text-3xl md:text-4xl mb-2 text-charcoal">{m.value}</div>
                                <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">{m.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>



            </div>
        </section>
    );
}
