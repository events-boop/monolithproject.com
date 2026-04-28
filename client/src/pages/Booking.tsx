import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import ViewportLazy from "@/components/ViewportLazy";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import { ShieldCheck, Zap, Globe, ChevronRight } from "lucide-react";

const BookingFormSection = lazy(() => import("@/components/BookingFormSection"));

const standards = [
  {
    icon: Zap,
    label: "Artistry",
    description: "We look for artists who can build a room, not just spike energy for a few moments.",
    id: "01"
  },
  {
    icon: ShieldCheck,
    label: "Technicality",
    description: "Strong transitions, clean sound, and respect for the booth matter.",
    id: "02"
  },
  {
    icon: Globe,
    label: "Community",
    description: "We book people who fit the crowd, the city, and the spirit of the night.",
    id: "03"
  }
];

export default function Booking() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white bg-scanlines relative overflow-x-hidden">
      <SEO
        title="Booking"
        description="Submit a mix or booking inquiry to play with The Monolith Project in Chicago. We review every request for musical fit, crowd fit, and alignment with our shows."
        canonicalPath="/booking"
      />
      <Navigation />

      {/* Atmospheric Immerisve Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[20%] right-[-5%] w-[45rem] h-[45rem] bg-indigo-500/5 rounded-full blur-[160px] opacity-20" />
          <div className="absolute bottom-0 left-[10%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[140px] opacity-20" />
      </div>

      <main className="relative z-10">
        <section className="pt-40 md:pt-56 pb-20 px-6">
          <div className="container layout-default">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 mb-10 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30" aria-label="Breadcrumb">
                <Link href="/" className="transition-colors hover:text-white">
                  Monolith
                </Link>
                <ChevronRight size={10} />
                <span className="text-white/80">Booking Request</span>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="section-display-title mb-4 text-white">
                BOOKING
              </h1>
              <p className="section-display-title-compact text-white/38">
                &amp; INQUIRY
              </p>
              <p className="text-white/60 text-lg md:text-2xl max-w-xl font-light italic leading-relaxed">
                Whether you represent an artist, venue, or brand partner, we review every submission for musical fit, room awareness, and alignment with the world we build.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Curation Standards Pillars */}
        <section className="py-20 px-6 border-t border-white/5">
             <div className="container layout-default">
                <div className="mb-12 max-w-2xl">
                  <span className="section-kicker text-primary mb-4 block">
                    Curation Standards
                  </span>
                  <h2 className="section-display-title-compact mb-4 text-white">
                    What We Screen For
                  </h2>
                  <p className="text-white/45 text-base md:text-lg leading-relaxed">
                    Every request is reviewed for pacing, technical command, and cultural alignment before we open a conversation.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                   {standards.map((std, i) => (
                      <motion.div 
                        key={std.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700"
                      >
                         <div className="flex items-center justify-between mb-8">
                            <span className="font-mono text-[10px] text-primary">{std.id}</span>
                            <std.icon className="w-5 h-5 text-white/10" />
                         </div>
                         <h3 className="font-display text-2xl uppercase tracking-wider mb-4">{std.label}</h3>
                         <p className="text-white/40 text-sm leading-relaxed font-light italic">{std.description}</p>
                      </motion.div>
                   ))}
                </div>
             </div>
        </section>

        {/* Formal Inquiry Section */}
        <section className="py-24 md:py-32 px-6 border-t border-white/5 bg-white/[0.01]">
          <div className="container layout-narrow">
            <div className="mb-16 text-center">
                <span className="section-kicker text-white/20 mb-4 block">Booking Request</span>
                <h2 className="section-display-title-compact">Start The Conversation</h2>
            </div>
            
            <ViewportLazy minHeightClassName="min-h-[640px]">
              <Suspense fallback={<div className="border border-white/5 p-8 md:p-12 min-h-[640px] bg-black/40 rounded-[2.5rem] animate-pulse" aria-hidden="true" />}>
                <div className="bg-black/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-2 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <BookingFormSection />
                </div>
              </Suspense>
            </ViewportLazy>
          </div>
        </section>
      </main>

      <EntityBoostStrip tone="dark" className="pb-20" />
    </div>
  );
}
