import { useEffect } from "react";
import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Music, Handshake, Mic2, ArrowRight } from "lucide-react";

const BookingFormSection = lazy(() => import("@/components/BookingFormSection"));

const whatWeBook = [
  {
    icon: Mic2,
    title: "Artists",
    description: "Selectors, DJs, live acts, and emerging talent. We build lineups around energy and alignment — not just names.",
    color: "#E05A3A",
  },
  {
    icon: Handshake,
    title: "Venues",
    description: "Rooftops, warehouses, galleries, and unconventional spaces. If it has the right energy, we want to know about it.",
    color: "#E8B86D",
  },
  {
    icon: Music,
    title: "Brands & Sponsors",
    description: "Authentic partnerships only. We work with brands that add to the experience, not subtract from it.",
    color: "#8B5CF6",
  },
];

const process = [
  { step: "01", title: "Submit", desc: "Fill out the form below. Be specific — the more context, the better." },
  { step: "02", title: "Review", desc: "We review every submission for fit with the collective's vision. This takes 2–3 weeks." },
  { step: "03", title: "Connect", desc: "If there's alignment, we'll reach out to start the conversation." },
];

export default function Booking() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
      <SEO
        title="Booking"
        description="Submit a mix or inquiry to play with The Monolith Project. We review every booking request for alignment with the collective."
      />
      <Navigation />

      {/* Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_30%,rgba(224,90,58,0.08),transparent_50%),radial-gradient(ellipse_at_90%_70%,rgba(232,184,109,0.06),transparent_50%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      <main className="relative z-10 pt-44 md:pt-52 pb-32">
        <div className="container max-w-6xl mx-auto px-6">

          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/35 block mb-5">
              — Work With Us
            </span>
            <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-6">
              BOOKING
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0 }}
              className="h-[2px] w-40 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-8"
            />
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl">
              Whether you're an artist, a venue, or a brand — we review every inquiry for alignment with the collective. We don't do filler. We do fit.
            </p>
          </motion.div>

          {/* What we book */}
          <div className="grid md:grid-cols-3 gap-4 mb-20">
            {whatWeBook.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 relative overflow-hidden"
                style={{
                  background: `${item.color}0A`,
                  border: `1px solid ${item.color}20`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(to right, ${item.color}60, transparent)` }} />
                <div
                  className="w-10 h-10 flex items-center justify-center mb-5"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <h3 className="font-display text-xl uppercase text-white mb-3">{item.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-8">How It Works</p>
            <div className="grid md:grid-cols-3 gap-0">
              {process.map((p, idx) => (
                <div key={p.step} className="flex items-start gap-5 relative">
                  {idx < process.length - 1 && (
                    <div className="hidden md:block absolute top-3 left-[calc(100%-1rem)] w-8 z-10">
                      <ArrowRight className="w-4 h-4 text-white/15" />
                    </div>
                  )}
                  <span className="font-display text-5xl text-white/8 leading-none flex-shrink-0 select-none">{p.step}</span>
                  <div className="pt-1">
                    <h4 className="font-display text-lg uppercase text-white mb-2">{p.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-primary/30 via-white/10 to-transparent mb-16" />

          {/* Form */}
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6">Before You Submit</p>
                <ul className="space-y-4">
                  {[
                    "Include a SoundCloud, mix link, or EPK",
                    "Tell us your genre and the vibe you bring",
                    "Share your availability or target dates",
                    "Budget range if you have one",
                    "Be real — we respond to authenticity",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-3 text-sm text-white/45 leading-relaxed">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 pt-8 border-t border-white/8">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3">Response Time</p>
                  <p className="text-sm text-white/40 leading-relaxed">
                    We aim to respond within 2–3 weeks. If you haven't heard back after a month, follow up at{" "}
                    <a href="mailto:events@monolithproject.com" className="text-primary/70 hover:text-primary transition-colors">
                      events@monolithproject.com
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-8">
              <Suspense fallback={<div className="min-h-[640px] border border-white/8 animate-pulse" />}>
                <BookingFormSection />
              </Suspense>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
