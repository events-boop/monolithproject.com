import { motion } from "framer-motion";
import { MapPin, Bed, Car, Plane, Train, ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import RevealText from "@/components/RevealText";

const hotels = [
    {
        name: "The Hoxton",
        area: "Fulton Market",
        dist: "0.2 miles from venue",
        price: "$$$",
        desc: "Industrial-chic rooms with a rooftop pool and Peruvian cevicheria. The artist favorite.",
        link: "https://thehoxton.com/chicago/",
        code: "MONOLITH25"
    },
    {
        name: "Nobu Hotel",
        area: "West Loop",
        dist: "0.3 miles from venue",
        price: "$$$$",
        desc: "Minimalist luxury. Japanese aesthetics. Indoor tranquility pool. The ultimate recharge.",
        link: "https://chicago.nobuhotels.com/",
        code: null
    },
    {
        name: "Ace Hotel",
        area: "Fulton Market",
        dist: "0.4 miles from venue",
        price: "$$$",
        desc: "Mid-century modern vibes. Great lobby bar for pre-game drinks. Very community focused.",
        link: "https://acehotel.com/chicago/",
        code: "MONOLITH"
    }
];

const transport = [
    {
        icon: Car,
        title: "Rideshare",
        desc: "Uber/Lyft to 1240 W Randolph St. Ask for drop-off at the main marquee."
    },
    {
        icon: Train,
        title: "CTA / Train",
        desc: "Green/Pink Line to Morgan Station. Walk 2 blocks west. Safe and fast."
    },
    {
        icon: Plane,
        title: "From O'Hare (ORD)",
        desc: "Take the Blue Line to Clark/Lake, transfer to Green/Pink Line. Approx 45 mins."
    }
];

export default function Travel() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <SEO
                title="Travel Guide"
                description="Plan your trip to The Monolith Project. Recommended hotels, transport, and arrival guide."
            />
            <Navigation />

            {/* Background Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_10%,rgba(34,211,238,0.08),transparent_50%),radial-gradient(ellipse_at_10%_90%,rgba(224,90,58,0.06),transparent_50%)]" />
                <div className="absolute inset-0 bg-noise opacity-[0.04]" />
            </div>

            <main className="relative z-10 pt-44 md:pt-52 pb-32">
                <div className="container max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-24"
                    >
                        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
                            — Logistics
                        </span>
                        <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] uppercase tracking-tight-display text-white mb-8">
                            PLAN YOUR<br />TRIP
                        </h1>
                        <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
                            Everything you need to land, rest, and arrive ready.
                            We've curated a list of partner hotels and travel tips for the best experience.
                        </p>
                    </motion.div>

                    {/* Hotels Section */}
                    <section className="mb-32">
                        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-4">
                            <h2 className="font-display text-3xl uppercase text-white">Where To Stay</h2>
                            <span className="font-mono text-xs text-white/40 tracking-widest hidden md:inline-block">WEST LOOP / FULTON MARKET</span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {hotels.map((hotel, idx) => (
                                <motion.div
                                    key={hotel.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="aspect-[4/3] bg-white/5 border border-white/10 rounded-lg mb-6 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                        {/* Placeholder for hotel image - using gradient for now */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 group-hover:scale-105 transition-transform duration-700" />

                                        <div className="absolute bottom-4 left-4 z-20">
                                            <p className="font-display text-xl text-white uppercase tracking-wide">{hotel.name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start text-xs font-mono tracking-wide">
                                            <span className="text-primary uppercase">{hotel.area}</span>
                                            <span className="text-white/40">{hotel.dist}</span>
                                        </div>

                                        <p className="text-sm text-white/60 leading-relaxed min-h-[60px]">
                                            {hotel.desc}
                                        </p>

                                        {hotel.code && (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono uppercase tracking-widest text-white/80">
                                                <span>Code: <span className="text-white font-bold">{hotel.code}</span></span>
                                            </div>
                                        )}

                                        <a
                                            href={hotel.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-4 text-xs font-bold uppercase tracking-widest text-white hover:text-primary transition-colors flex items-center gap-2"
                                        >
                                            Book Room <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Transport Section */}
                    <section>
                        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-4">
                            <h2 className="font-display text-3xl uppercase text-white">Getting Here</h2>
                            <span className="font-mono text-xs text-white/40 tracking-widest hidden md:inline-block">1240 W RANDOLPH ST</span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {transport.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 border border-white/10 bg-white/[0.02] rounded-xl"
                                >
                                    <item.icon className="w-6 h-6 text-white/40 mb-4" />
                                    <h3 className="font-display text-lg uppercase text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}
