import { motion } from "framer-motion";
import { Clock, MapPin, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const timeline = [
    { time: "9:00 PM", event: "Doors Open", desc: "Arrive early to avoid the line." },
    { time: "10:00 PM", event: "Opener: AvO", desc: "Set the mood right." },
    { time: "11:30 PM", event: "Direct Support: Hashtom", desc: "Energy builds." },
    { time: "1:00 AM", event: "Headliner: Deron", desc: "Peak hour." },
    { time: "2:00 AM", event: "Close", desc: "Safe travels home." }
];

const checklist = [
    { icon: CheckCircle, text: "Valid Government ID (21+)" },
    { icon: CheckCircle, text: "Ticket QR Code (Screenshot it!)" },
    { icon: CheckCircle, text: "Credit/Debit Card (Cashless Bar)" },
    { icon: AlertCircle, text: "No Professional Cameras" },
    { icon: AlertCircle, text: "No Outside Drinks" }
];

export default function Guide() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <SEO
                title="Arrival Guide"
                description="Know before you go. Set times, parking, entry requirements, and pro-tips for a smooth night."
            />
            <Navigation />

            {/* Mobile-focused minimal header */}
            <main className="relative z-10 pt-32 md:pt-44 pb-32">
                <div className="container max-w-4xl mx-auto px-6">

                    <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                        <div>
                            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-2">● Live Updates</p>
                            <h1 className="font-display text-4xl md:text-6xl uppercase text-white">The Night Of</h1>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="font-mono text-xs text-white/50 tracking-wide">MARCH 6, 2026</p>
                            <p className="font-mono text-xs text-white/50 tracking-wide">ALHAMBRA PALACE</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Timeline */}
                        <section>
                            <h2 className="font-display text-2xl uppercase text-white mb-6 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary" /> Set Times
                            </h2>
                            <div className="space-y-0 relative border-l border-white/10 ml-2 pl-8 pb-2">
                                {timeline.map((slot, idx) => (
                                    <div key={slot.time} className="relative mb-10 last:mb-0">
                                        <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-background border-2 border-white/20" />
                                        {idx === 0 && <span className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-primary animate-ping opacity-75" />}

                                        <p className="font-mono text-xs text-primary mb-1 tracking-widest">{slot.time}</p>
                                        <h3 className="font-display text-xl uppercase text-white mb-1">{slot.event}</h3>
                                        <p className="text-sm text-white/40">{slot.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Checklist & Map placeholder */}
                        <section className="space-y-12">

                            {/* Entry Requirements */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <h3 className="font-display text-lg uppercase text-white mb-4">Entry Checklist</h3>
                                <ul className="space-y-3">
                                    {checklist.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                                            <item.icon className={`w-4 h-4 ${i < 3 ? "text-green-400" : "text-amber-400"}`} />
                                            {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Arrival Map */}
                            <div>
                                <h3 className="font-display text-lg uppercase text-white mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" /> Arrival
                                </h3>
                                <div className="aspect-video bg-white/5 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors">
                                    <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                                        Tap to Open Maps
                                    </p>
                                    <a
                                        href="https://goo.gl/maps/example"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 z-10"
                                        aria-label="Open Map"
                                    />
                                    <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                                </div>
                                <p className="mt-3 text-xs text-white/40 font-mono tracking-wide">
                                    Use the MAIN ENTRANCE on W Randolph St. <br />
                                    VIP/Table check-in fast lane on the left.
                                </p>
                            </div>

                        </section>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
