import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MapPin, Clock, CreditCard, Shield, Accessibility, Music, HelpCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import JsonLd from "@/components/JsonLd";
import { buildFaqSchema } from "@/lib/schema";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { signalChirp } from "@/lib/SignalChirpEngine";

const categories = [
    {
        icon: MapPin,
        label: "Venue & Location",
        color: "#E05A3A",
        faqs: [
            {
                q: "Where is Alhambra Palace?",
                a: "Alhambra Palace is located at 1240 W Randolph St, Chicago, IL 60607 — in the West Loop neighborhood. It's easily accessible by CTA (Pink/Green Line, Morgan stop) and rideshare.",
            },
            {
                q: "Is there parking nearby?",
                a: "Street parking is available in the West Loop, though it fills up fast on event nights. We recommend rideshare (Uber/Lyft) or the CTA. Several paid lots are within a 5-minute walk.",
            },
            {
                q: "Is the venue accessible?",
                a: "Yes. Alhambra Palace is ADA accessible with ground-level entry and accessible restrooms. If you have specific accessibility needs, email us at events@monolithproject.com before the event.",
            },
        ],
    },
    {
        icon: CreditCard,
        label: "Tickets & Entry",
        color: "#E8B86D",
        faqs: [
            {
                q: "Where do I buy tickets?",
                a: "All tickets are sold exclusively through Posh. Links are available on our Tickets page and in our Instagram bio. We do not sell tickets at the door — all events are presale only.",
            },
            {
                q: "What is the refund policy?",
                a: "All sales are final. Tickets are non-refundable and non-transferable unless the event is cancelled or rescheduled by us. In that case, full refunds will be issued automatically.",
            },
            {
                q: "Can I transfer my ticket to someone else?",
                a: "Ticket transfers are handled through Posh. Log into your Posh account and use the transfer feature. We cannot process transfers manually.",
            },
            {
                q: "What's the age requirement?",
                a: "All Monolith Project events are 21+ unless otherwise stated. Valid government-issued photo ID is required at the door. No exceptions.",
            },
            {
                q: "What happens if the event sells out?",
                a: "Once tickets are gone, they're gone. We do not maintain a waitlist or release additional tickets at the door. Follow our Instagram for any last-minute announcements.",
            },
        ],
    },
    {
        icon: Clock,
        label: "Night Of",
        color: "#8B5CF6",
        faqs: [
            {
                q: "What time do doors open?",
                a: "Doors typically open at 9:00 PM. Music runs until 2:00 AM. Specific times are always listed on the event page and your ticket confirmation.",
            },
            {
                q: "Is there a dress code?",
                a: "We don't enforce a strict dress code, but we ask that you dress with intention. This is a curated experience — come as yourself, but come correct. Athletic wear and sportswear are discouraged.",
            },
            {
                q: "Can I re-enter if I leave?",
                a: "Re-entry policy varies by venue. For Alhambra Palace events, re-entry is generally not permitted after midnight. Check with door staff on the night.",
            },
            {
                q: "Is there coat check?",
                a: "Yes, coat check is available at Alhambra Palace for a small fee. We recommend traveling light.",
            },
        ],
    },
    {
        icon: Music,
        label: "Artists & Bookings",
        color: "#E05A3A",
        faqs: [
            {
                q: "How do I submit a mix or booking inquiry?",
                a: "Head to our Booking page and fill out the form. Include a SoundCloud or mix link, your genre, and availability. We review every submission — it just takes time.",
            },
            {
                q: "How long does it take to hear back on a booking?",
                a: "We aim to respond within 2–3 weeks. If you haven't heard back after a month, feel free to follow up at events@monolithproject.com.",
            },
            {
                q: "Do you work with international artists?",
                a: "Yes. We've hosted artists from across the US and internationally. If you're traveling and want to play Chicago, reach out — we love connecting with artists on tour.",
            },
        ],
    },
    {
        icon: Shield,
        label: "Safety & Community",
        color: "#1DB954",
        faqs: [
            {
                q: "What is your policy on harassment?",
                a: "Zero tolerance. Anyone engaging in harassment, discrimination, or making others feel unsafe will be removed immediately with no refund. Our events are a space for everyone.",
            },
            {
                q: "Who do I contact if I feel unsafe at an event?",
                a: "Find any staff member or security immediately. You can also text us at the number posted at the venue entrance. Your safety is the priority.",
            },
            {
                q: "Are your events sober-friendly?",
                a: "Our events are 21+ and alcohol is served, but we fully respect and support sober attendees. Non-alcoholic options are always available at the bar.",
            },
        ],
    },
    {
        icon: Accessibility,
        label: "Accessibility",
        color: "#8B5CF6",
        faqs: [
            {
                q: "Do you offer accommodations for disabilities?",
                a: "Yes. Email us at events@monolithproject.com at least 48 hours before the event and we'll do everything we can to accommodate your needs.",
            },
            {
                q: "Is there seating available?",
                a: "Limited seating is available at most venues. If you require seating due to a medical condition, please contact us in advance.",
            },
        ],
    },
];

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            className="border-b border-white/8 last:border-0"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-start justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group"
            >
                <span className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors leading-relaxed pr-4">
                    {q}
                </span>
                <span className="flex-shrink-0 mt-0.5">
                    {isOpen
                        ? <Minus className="w-4 h-4 text-primary" />
                        : <Plus className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                    }
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-sm text-white/50 leading-relaxed pr-8">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQ() {
    const [activeCategory, setActiveCategory] = useState(0);
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const faqSchemaEntries = categories.flatMap((category) =>
        category.faqs.map((faq) => [faq.q, faq.a] as [string, string]),
    );

    useEffect(() => {
        window.scrollTo(0, 0);
        setOpenIndex(0);
    }, [activeCategory]);

    const current = categories[activeCategory];

    return (
        <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
            <SEO
                title="FAQ | Chasing Sun(Sets), Tickets, Venue & Radio Show"
                description="Official FAQ for Chasing Sun(Sets) and The Monolith Project in Chicago: tickets, venue, accessibility, radio show, and brand identity."
                canonicalPath="/faq"
            />
            <JsonLd id="schema-main-faq" data={buildFaqSchema(faqSchemaEntries)} />
            <Navigation />

            {/* Atmosphere */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_25%,rgba(224,90,58,0.07),transparent_50%),radial-gradient(ellipse_at_85%_75%,rgba(139,92,246,0.06),transparent_50%)]" />
                <div className="absolute inset-0 bg-noise opacity-[0.03]" />
            </div>

            <main className="relative z-10 page-shell-start-loose pb-32">
                <div className="container max-w-6xl mx-auto px-6">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-16"
                    >
                        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
                            — Got Questions
                        </span>
                        <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] uppercase tracking-tight-display text-white mb-6">
                            FAQ
                        </h1>
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{ originX: 0 }}
                            className="h-[2px] w-32 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-6"
                        />
                        <p className="text-white/45 max-w-xl leading-relaxed">
                            Everything you need to know before, during, and after an event.
                        </p>
                    </motion.div>
                    <EntityBoostStrip tone="nocturne" className="px-0 mb-10" contextLabel="FAQ + Official Identity Links" />

                    <div className="max-w-4xl mx-auto space-y-4">
                        {categories.map((cat, idx) => {
                            const isCatOpen = activeCategory === idx;
                            return (
                                <div 
                                    key={cat.label} 
                                    className="border-b border-white/10 flex flex-col group scroll-mt-32 backdrop-blur-sm"
                                >
                                    {/* Category Header */}
                                    <button
                                        onClick={() => {
                                            signalChirp.click();
                                            setActiveCategory(isCatOpen ? -1 : idx);
                                        }}
                                        onMouseEnter={() => signalChirp.hover()}
                                        className="w-full text-left py-8 md:py-10 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors focus-visible:outline-none focus-visible:bg-white/[0.03]"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div 
                                                className="w-10 h-10 flex items-center justify-center rounded-none"
                                                style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                                            >
                                                <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                                            </div>
                                            <h2 className="font-display text-2xl md:text-3xl uppercase tracking-widest text-white/90 group-hover:text-white transition-all duration-300">
                                                {cat.label}
                                            </h2>
                                        </div>

                                        <div className="w-10 h-10 rounded-full border border-white/10 flex flex-shrink-0 items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                                            <motion.div
                                                animate={{ rotate: isCatOpen ? 45 : 0 }}
                                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                <Plus className="w-5 h-5 text-white/60 group-hover:text-black transition-colors" />
                                            </motion.div>
                                        </div>
                                    </button>

                                    {/* Category Content */}
                                    <AnimatePresence initial={false}>
                                        {isCatOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 md:px-16 pb-12 pt-4">
                                                    <div className="space-y-2">
                                                        {cat.faqs.map((faq, fIdx) => (
                                                            <FAQItem
                                                                key={fIdx}
                                                                q={faq.q}
                                                                a={faq.a}
                                                                isOpen={openIndex === fIdx}
                                                                onToggle={() => {
                                                                    signalChirp.click();
                                                                    setOpenIndex(openIndex === fIdx ? null : fIdx);
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-24 pt-12 border-t border-white/10 text-center"
                    >
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">Still Have Questions?</p>
                        <a
                            href="mailto:events@monolithproject.com"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-mono text-[10px] tracking-[0.25em] uppercase hover:bg-white/90 transition-all"
                        >
                            <HelpCircle className="w-4 h-4" />
                            Direct Inquiry
                        </a>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
