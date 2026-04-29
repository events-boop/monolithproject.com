import { useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Building2, Handshake, Camera, Music, Shield, Lightbulb, Drama, Beer, ArrowUpRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import ConversionCTA from "@/components/ConversionCTA";
import MagneticButton from "@/components/MagneticButton";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useInquiry } from "@/contexts/InquiryContext";

const productionRoles = [
  {
    icon: Beer,
    title: "Bartenders",
    code: "HOSPITALITY",
    description: "Experienced bartenders for mobile and venue bars. Craft cocktails and high-volume service."
  },
  {
    icon: Shield,
    title: "Security",
    code: "SAFETY",
    description: "Professional security staff who understand event culture. Keep the vibe safe without killing it."
  },
  {
    icon: Wrench,
    title: "Stagehands",
    code: "OPS",
    description: "Load-in, load-out, stage setup, teardown. Reliable crew who know how to move fast."
  },
  {
    icon: Camera,
    title: "Media",
    code: "SIGNAL",
    description: "Photographers and videographers who capture real moments — not just posed shots."
  },
  {
    icon: Lightbulb,
    title: "Visuals",
    code: "ATMOS",
    description: "Lighting designers and VJ operators. Create atmosphere that matches the music."
  },
  {
    icon: Drama,
    title: "Performers",
    code: "ENERGY",
    description: "Live performers and dancers who add energy to the space. Expressive, not scripted."
  },
  {
    icon: Music,
    title: "Musicians",
    code: "LIVE",
    description: "Percussionists, saxophonists, vocalists — musicians who can jam with DJs and elevate the set."
  },
  {
    icon: Wrench,
    title: "Engineering",
    code: "SOUND",
    description: "FOH and monitor engineers. If you know your way around a PA system, let's talk."
  },
];

const partnerTypes = [
  {
    icon: Building2,
    title: "Venue Partners",
    subtitle: "Canvas Selection",
    inquiryType: "venue",
    description: "Rooftops, warehouses, outdoor spaces, clubs — if your space fits the vibe, we'll bring the crowd, sound, and creative direction. We handle production; you provide the setting.",
  },
  {
    icon: Handshake,
    title: "Brand Partners",
    subtitle: "Cultural Activation",
    inquiryType: "sponsor",
    description: "We work with brands that want to reach a real, engaged community. Activation spaces, product placement, co-branded experiences — always integrated, never forced.",
  },
];

export default function Partners() {
  const { openInquiry } = useInquiry();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white bg-scanlines relative overflow-x-hidden">
      <SEO
        title="Partners & Crew"
        description="Work with The Monolith Project. We're looking for venue partners, brands, and production crew to help build the shows."
        canonicalPath="/partners"
      />
      <Navigation />

      {/* Atmospheric Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[10%] left-[-10%] w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[150px] opacity-20" />
          <div className="absolute bottom-[20%] right-[-10%] w-[35rem] h-[35rem] bg-orange-500/5 rounded-full blur-[120px] opacity-20" />
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-40 md:pt-56 pb-20 px-6">
          <div className="container layout-default">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                  <span className="section-kicker text-primary">Partner With Monolith</span>
                  <div className="h-px w-20 bg-white/10" />
              </div>
              <h1 className="section-display-title mb-4 text-white flex flex-col">
                <span>PARTNERS</span>
                <span className="text-white/38">&amp; CREW</span>
              </h1>
              <p className="text-white/60 text-lg md:text-2xl max-w-2xl font-light leading-relaxed italic">
                We work with venues, brands, crew, and creative collaborators who want to help produce strong shows and reach a real Chicago audience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Partnership Types — Large Immerisve Blocks */}
        <section className="py-20 px-6 border-t border-white/5">
           <div className="container layout-default">
              <div className="mb-12 max-w-3xl">
                <span className="section-kicker mb-4 block text-primary">Ways We Work</span>
                <h2 className="section-display-title-compact mb-4 text-white">
                  Venue and brand partners inside the same Monolith system.
                </h2>
                <p className="text-base leading-relaxed text-white/55 md:text-lg">
                  The pitch is direct: strong audience energy, clear creative fit, and production that protects the room.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {partnerTypes.map((partner, index) => (
                  <motion.div
                    key={partner.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative h-full flex flex-col p-10 md:p-14 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-[1.2s] rounded-[2.5rem] overflow-hidden"
                  >
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-700">
                           <partner.icon className="w-7 h-7 text-white/40 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-display text-4xl md:text-5xl text-white mb-3 uppercase tracking-tighter">
                          {partner.title}
                        </h3>
                        <p className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase mb-10">
                          [ {partner.subtitle} ]
                        </p>
                        <p className="text-white/50 leading-relaxed mb-12 font-light text-lg md:text-xl">
                          {partner.description}
                        </p>
                        
                        <div className="mt-auto">
                            <ConversionCTA 
                              variant="outline" 
                              size="md" 
                              event={{ primaryCta: { href: `inquiry://${partner.inquiryType}`, label: "Start Conversation", tool: "fillout", isExternal: false } }}
                            />
                        </div>
                    </div>
                    {/* Shadow Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] group-hover:opacity-100 opacity-20 transition-opacity" />
                  </motion.div>
                ))}
              </div>
           </div>
        </section>

        {/* Production Crew — Editorial Asymmetric Grid */}
        <section className="py-24 md:py-32 px-6 border-t border-white/5 bg-white/[0.01]">
          <div className="container layout-default">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-16"
            >
              <div className="md:w-[65%]">
                <span className="section-kicker text-white/30 mb-4 block">
                  Resource_Network
                </span>
                <h2 className="section-display-title-compact text-white">
                  PRODUCTION <span className="opacity-40 font-light italic">CREW</span>
                </h2>
              </div>
              <p className="text-sm md:text-base text-white/55 w-full md:max-w-sm border-l border-white/10 pl-4 leading-relaxed">
                Operations, hospitality, and stage. The people behind every Monolith night — load-in to last call.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 md:h-[640px]">
              {/* LEFT — 2 stacked image cards */}
              <div className="md:col-span-4 flex flex-col gap-4 lg:gap-6">
                {[
                  { ...productionRoles[7], image: "/images/autograf-recap.jpg" },
                  { ...productionRoles[4], image: "/images/lazare-recap.webp" },
                ].map((r) => (
                  <motion.article
                    key={r.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex-1 min-h-[16rem] overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer transition-colors duration-500 hover:border-white/25"
                    onClick={() => openInquiry("general")}
                  >
                    <div className="absolute inset-0">
                      <ResponsiveImage
                        src={r.image}
                        alt={r.title}
                        sizes="(min-width: 1024px) 22vw, 100vw"
                        className="w-full h-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div className="p-5">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/15 bg-zinc-950/70 backdrop-blur-md font-mono text-[10px] tracking-[0.28em] uppercase text-white/80">
                          <r.icon className="w-3.5 h-3.5 text-primary" />
                          {r.code}
                        </span>
                      </div>
                      <div className="flex justify-between items-end p-5 bg-zinc-950/60 backdrop-blur-xl border-t border-white/10">
                        <h3 className="font-display text-xl lg:text-2xl text-white uppercase leading-[0.92]">{r.title}</h3>
                        <span aria-hidden className="w-10 h-10 border border-white/20 bg-white/5 group-hover:bg-white/15 text-white flex items-center justify-center transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* CENTER — hero card */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group md:col-span-5 relative h-[400px] md:h-full overflow-hidden border border-white/10 bg-zinc-950 cursor-pointer transition-colors duration-500 hover:border-white/25"
                onClick={() => openInquiry("general")}
              >
                <div className="absolute inset-0">
                  <ResponsiveImage
                    src="/images/eran-hersh-live-5.webp"
                    alt="Stagehands and operations"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="w-full h-full object-cover opacity-65 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="p-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/15 bg-zinc-950/70 backdrop-blur-md font-mono text-[10px] tracking-[0.28em] uppercase text-white/80">
                      <Wrench className="w-3.5 h-3.5 text-primary" />
                      {productionRoles[2].code}
                    </span>
                  </div>
                  <div className="flex justify-between items-end p-6 bg-zinc-950/60 backdrop-blur-xl border-t border-white/10">
                    <h3 className="font-display text-2xl lg:text-4xl text-white uppercase leading-[0.92] max-w-[14ch]">
                      Stagehands<br />& Operations.
                    </h3>
                    <span aria-hidden className="w-12 h-12 border border-white/20 bg-white/5 group-hover:bg-white/15 text-white flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </motion.article>

              {/* RIGHT — 3 info cards */}
              <div className="md:col-span-3 flex flex-col gap-4 lg:gap-6">
                {[productionRoles[0], productionRoles[1], productionRoles[5]].map((r, i) => (
                  <motion.article
                    key={r.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5 }}
                    className="group relative flex-1 min-h-[10rem] border border-white/10 bg-zinc-950/40 backdrop-blur-sm cursor-pointer transition-colors duration-300 hover:bg-zinc-900/50 hover:border-white/20 p-5 flex flex-col justify-between"
                    onClick={() => openInquiry("general")}
                  >
                    <div>
                      <r.icon className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors mb-3" />
                      <h3 className="font-display text-lg lg:text-xl text-white uppercase tracking-tight leading-[0.95]">{r.title}</h3>
                      <p className="mt-1 font-mono text-[10px] tracking-[0.24em] uppercase text-white/35">[ {r.code} ]</p>
                    </div>
                    <div className="flex justify-end">
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <p className="mt-8 font-mono text-[10px] text-white/30 tracking-[0.32em] uppercase">
              Also looking for: Media · Musicians · Anyone with the right energy.
            </p>

            {/* Global Crew CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 p-12 md:p-20 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent text-center"
            >
              <span className="section-kicker mb-4 block text-primary">Join The Build</span>
              <h2 className="section-display-title-compact mb-10 text-white">Crew Inquiries</h2>
              <div className="flex flex-col items-center gap-8">
                  <MagneticButton strength={0.2}>
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); openInquiry("general"); }} 
                        className="btn-pill-neutral"
                    >
                        Submit Crew Inquiry
                    </a>
                  </MagneticButton>
                  <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em] max-w-sm mx-auto">
                    Direct inquiries via crew@monolithproject.com // Review cycles occur monthly.
                  </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <EntityBoostStrip tone="dark" className="pb-16" />
      <NewsletterSection />
    </div>
  );
}
