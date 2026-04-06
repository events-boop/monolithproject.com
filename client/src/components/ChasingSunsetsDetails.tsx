import { motion } from "framer-motion";
import { Users, Music, Calendar, TrendingUp } from "lucide-react";
import RevealText from "./RevealText";

const metrics = [
    { label: "Best Time", value: "Golden Hour", icon: Calendar },
    { label: "The Sound", value: "Melodic House", icon: Music },
    { label: "The Room", value: "Open-Air", icon: TrendingUp },
    { label: "The Crowd", value: "Music-First", icon: Users },
];

const benefits = [
    { title: "What It Is", description: "A summer-long curation of outdoor rooms that start at sunset and end long after dark." },
    { title: "The July 4th Tradition", description: "Our flagship gathering. The energy of the city at its peak, soundtracked by world-class selectors." },
    { title: "Who It's For", description: "Those who prioritize the room, the music, and the people over the hype." },
    { title: "How To Get Tickets", description: "Capacities are strict. Early access goes to the newsletter before public sale." },
];

export default function ChasingSunsetsDetails() {
    return (
        <section className="py-24 px-6 bg-sand text-charcoal relative overflow-hidden">
            {/* Background image wash */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <img
                    src="/images/chasing-sunsets-tradition.jpg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/chasing-sunsets.jpg";
                    }}
                    className="absolute inset-0 w-full h-full object-cover object-[50%_35%] opacity-[0.6] saturate-[1.1] contrast-[1.08] brightness-[0.98]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,245,237,0.82)_0%,rgba(251,245,237,0.62)_40%,rgba(251,245,237,0.84)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(232,184,109,0.22),transparent_52%),radial-gradient(circle_at_82%_78%,rgba(194,112,62,0.18),transparent_56%)] mix-blend-multiply" />
            </div>

            <div className="container layout-default relative z-10">

                {/* Intro / Vision */}
                <div className="grid md:grid-cols-2 gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-6 text-clay">
                            The Series
                        </span>
                        <RevealText as="h2" className="font-display text-4xl md:text-5xl leading-tight mb-6 text-charcoal">
                            DAYLIGHT TURNING INTO DUSK
                        </RevealText>
                        <p className="text-lg leading-relaxed opacity-80 mb-6">
                            Chasing Sun(Sets) is an open-air series built entirely around the golden hour. No dark rooms at the start, no vip ropes—just the sky and the sound.
                        </p>
                        <p className="text-lg leading-relaxed opacity-80">
                            We book afro house, organic house, and melodic house for rooftops, beach clubs, and open-air spaces across Chicago.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="season-panel-warm p-8"
                        data-cursor-text="EXPERIENCE"
                    >
                        <h3 className="font-display text-2xl mb-6 text-charcoal">WHAT TO EXPECT</h3>
                        <p className="mb-6 opacity-80">
                            A run of summer dates built around sunset, movement, and strong bookings from May through September.
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
                        The Elements
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {metrics.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="season-panel-warm p-6 text-center hover:border-clay/40 transition-colors"
                                data-cursor-text="ATMOSPHERE"
                            >
                                <m.icon className="w-6 h-6 mx-auto mb-4 text-clay" />
                                <div className="font-display text-2xl md:text-3xl mb-2 text-charcoal">{m.value}</div>
                                <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">{m.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>



            </div>
        </section>
    );
}
