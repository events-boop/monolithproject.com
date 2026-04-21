import { useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Building2, Handshake, Camera, Music, Shield, Lightbulb, Drama, Beer } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import ConversionCTA from "@/components/ConversionCTA";
import KineticDecryption from "@/components/KineticDecryption";
import MagneticButton from "@/components/MagneticButton";
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
                  <span className="font-mono text-[10px] text-primary tracking-[0.4em] uppercase">System_Entry // Collaboration</span>
                  <div className="h-px w-20 bg-white/10" />
              </div>
              <h1 className="font-display text-[clamp(2.8rem,9vw,8rem)] text-white mb-8 uppercase leading-[0.82] tracking-tight-display">
                <KineticDecryption text="PARTNERS" />
                <br />
                <span className="opacity-40">& CREW</span>
              </h1>
              <p className="text-white/60 text-lg md:text-2xl max-w-2xl font-light leading-relaxed italic">
                Monolith is a growing music ecosystem. We are looking for the right architects, operators, and settings to build the next chapters.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Partnership Types — Large Immerisve Blocks */}
        <section className="py-20 px-6 border-t border-white/5">
           <div className="container layout-default">
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

        {/* Production Crew Grid — Technical Cards */}
        <section className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
          <div className="container layout-default">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20 text-center md:text-left"
            >
              <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase mb-4 block">
                Resource_Network
              </span>
              <h2 className="font-display text-5xl md:text-7xl text-white mb-6 uppercase tracking-tight">
                JOIN THE <span className="opacity-40 font-light italic">OPERATIONS</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {productionRoles.map((role, index) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.5 }}
                  className="group p-8 border border-white/5 bg-black hover:border-white/20 transition-all duration-500 rounded-2xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                     <div className="font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase border border-white/5 px-2 py-1 rounded">
                        [ ID: {role.code} ]
                     </div>
                     <role.icon className="w-5 h-5 text-white/10 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-display text-2xl text-white mb-3 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                    {role.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light">
                    {role.description}
                  </p>
                  
                  {/* Subtle hover glow */}
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>

            {/* Global Crew CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24 p-12 md:p-20 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent text-center"
            >
              <h2 className="font-display text-4xl md:text-6xl uppercase mb-10">Crew Inquiries</h2>
              <div className="flex flex-col items-center gap-8">
                  <MagneticButton strength={0.2}>
                    <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); openInquiry("general"); }} 
                        className="inline-flex h-16 items-center justify-center bg-white text-black px-12 font-mono text-xs uppercase tracking-[0.3em] hover:bg-white/90 active:scale-95 transition-all rounded-full shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
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
