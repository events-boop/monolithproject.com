import { useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Building2, Handshake, Camera, Music, Shield, Lightbulb, Drama, Beer } from "lucide-react";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import ConversionCTA from "@/components/ConversionCTA";

const productionRoles = [
  {
    icon: Beer,
    title: "Bartenders",
    type: "general",
    description: "Experienced bartenders for mobile and venue bars. Craft cocktails and high-volume service."
  },
  {
    icon: Shield,
    title: "Security",
    type: "general",
    description: "Professional security staff who understand event culture. Keep the vibe safe without killing it."
  },
  {
    icon: Wrench,
    title: "Stagehands",
    type: "general",
    description: "Load-in, load-out, stage setup, teardown. Reliable crew who know how to move fast."
  },
  {
    icon: Camera,
    title: "Photo & Video",
    type: "press",
    description: "Photographers and videographers who capture real moments — not just posed shots."
  },
  {
    icon: Lightbulb,
    title: "Lighting & Visuals",
    type: "general",
    description: "Lighting designers and VJ operators. Create atmosphere that matches the music."
  },
  {
    icon: Drama,
    title: "Dancers & Performers",
    type: "artist",
    description: "Live performers and dancers who add energy to the space. Expressive, not scripted."
  },
  {
    icon: Music,
    title: "Live Musicians",
    type: "artist",
    description: "Percussionists, saxophonists, vocalists — musicians who can jam with DJs and elevate the set."
  },
  {
    icon: Wrench,
    title: "Sound Engineers",
    type: "general",
    description: "FOH and monitor engineers. If you know your way around a PA system, let's talk."
  },
];

const partnerTypes = [
  {
    icon: Building2,
    title: "Venue Partners",
    subtitle: "Host an Event",
    inquiryType: "venue",
    description: "Rooftops, warehouses, outdoor spaces, clubs — if your space fits the vibe, we'll bring the crowd, sound, and creative direction. We handle production; you provide the canvas.",
  },
  {
    icon: Handshake,
    title: "Brand Partners",
    subtitle: "Sponsor a Show",
    inquiryType: "sponsor",
    description: "We work with brands that want to reach a real, engaged community. Activation spaces, product placement, co-branded experiences — always integrated, never forced.",
  },
];

export default function Partners() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Partners & Crew"
        description="Work with The Monolith Project. We're looking for venue partners, brands, and production crew to help build the shows."
        canonicalPath="/partners"
      />
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,168,83,0.05)_0%,transparent_50%)]" />
        <div className="container layout-default px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="font-mono text-[10px] text-primary tracking-[0.4em] uppercase mb-4 block">
              Work With Us
            </span>
            <h1 className="font-display text-5xl md:text-8xl text-white mb-6 uppercase tracking-tighter">
              PARTNERS & CREW
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto font-light leading-relaxed">
              We're building a growing music project and we need the right people behind the scenes.
              If you help make shows happen, we want to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Production Crew Grid */}
      <section className="py-20 border-t border-white/5">
        <div className="container layout-default px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              Production Crew
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4 uppercase">
              BUILD THE SHOW WITH US
            </h2>
            <p className="text-white/40 max-w-2xl font-light">
              Every Monolith Project event needs a team behind it. Here's what we're looking for.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productionRoles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/20 transition-all duration-500 rounded-2xl"
              >
                <div className="w-12 h-12 bg-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <role.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl text-white mb-3 group-hover:text-primary transition-colors uppercase">
                  {role.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">
                  {role.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <ConversionCTA 
              variant="experiential" 
              size="lg" 
              event={{ primaryCta: { href: "inquiry://general", label: "Apply to Join the Crew" } } as any}
            />
            <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.2em] mt-8">
              Or Reconnect via crew@monolithproject.com
            </p>
          </motion.div>
        </div>
      </section>

      {/* Venue & Brand Partners */}
      <section className="py-20 border-t border-white/5 bg-white/[0.01]">
        <div className="container layout-default px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              Partnership Opportunities
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4 uppercase">
              VENUES & BRANDS
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnerTypes.map((partner, index) => (
              <motion.div
                key={partner.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group p-12 border border-white/5 bg-black hover:bg-white/[0.02] hover:border-primary/20 transition-all duration-500 rounded-[2rem]"
              >
                <div className="w-16 h-16 bg-primary/5 border border-primary/20 flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform">
                  <partner.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-4xl text-white mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                  {partner.title}
                </h3>
                <p className="font-mono text-[10px] text-primary tracking-[0.4em] uppercase mb-6 opacity-80">
                  {partner.subtitle}
                </p>
                <p className="text-white/50 leading-relaxed mb-10 font-light text-lg">
                  {partner.description}
                </p>
                <ConversionCTA 
                  variant="outline" 
                  size="md" 
                  event={{ primaryCta: { href: `inquiry://${partner.inquiryType}`, label: "Get in Touch" } } as any}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <EntityBoostStrip tone="dark" className="pb-16" />
      <NewsletterSection />
    </div>
  );
}
