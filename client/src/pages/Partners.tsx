import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wrench, Building2, Handshake, Camera, Music, Shield, Lightbulb, Drama, Beer } from "lucide-react";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const productionRoles = [
  {
    icon: Beer,
    title: "Bartenders",
    description: "Experienced bartenders for mobile and venue bars. Craft cocktails and high-volume service."
  },
  {
    icon: Shield,
    title: "Security",
    description: "Professional security staff who understand event culture. Keep the vibe safe without killing it."
  },
  {
    icon: Wrench,
    title: "Stagehands",
    description: "Load-in, load-out, stage setup, teardown. Reliable crew who know how to move fast."
  },
  {
    icon: Camera,
    title: "Photo & Video",
    description: "Photographers and videographers who capture real moments — not just posed shots."
  },
  {
    icon: Lightbulb,
    title: "Lighting & Visuals",
    description: "Lighting designers and VJ operators. Create atmosphere that matches the music."
  },
  {
    icon: Drama,
    title: "Dancers & Performers",
    description: "Live performers and dancers who add energy to the space. Expressive, not scripted."
  },
  {
    icon: Music,
    title: "Live Musicians",
    description: "Percussionists, saxophonists, vocalists — musicians who can jam with DJs and elevate the set."
  },
  {
    icon: Wrench,
    title: "Sound Engineers",
    description: "FOH and monitor engineers. If you know your way around a PA system, let's talk."
  },
];

const partnerTypes = [
  {
    icon: Building2,
    title: "Venue Partners",
    subtitle: "Host an Event",
    description: "Rooftops, warehouses, outdoor spaces, clubs — if your space fits the vibe, we'll bring the crowd, sound, and creative direction. We handle production; you provide the canvas.",
  },
  {
    icon: Handshake,
    title: "Brand Partners",
    subtitle: "Sponsor a Show",
    description: "We work with brands that want to reach a real, engaged community. Activation spaces, product placement, co-branded experiences — always integrated, never forced.",
  },
];

export default function Partners() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-20 relative">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              Work With Us
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6">
              PARTNERS & CREW
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're building a collective and we need the right people behind the scenes.
              If you help make shows happen, we want to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Production Crew Grid */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              Production Crew
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              BUILD THE SHOW WITH US
            </h2>
            <p className="text-muted-foreground max-w-2xl">
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
                className="group p-6 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-10 h-10 bg-primary/5 border border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <role.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {role.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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
            className="text-center mt-16"
          >
            <a
              href="mailto:crew@monolithproject.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background hover:bg-primary transition-colors duration-300 font-display text-lg tracking-widest uppercase group rounded-full"
            >
              <span>Apply to Join the Crew</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-muted-foreground text-sm mt-4">
              Email us at crew@monolithproject.com with your experience and availability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="container max-w-6xl mx-auto px-6">
        <div className="h-px bg-border" />
      </div>

      {/* Venue & Brand Partners */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="font-mono text-xs text-primary tracking-widest uppercase mb-4 block">
              Partnership Opportunities
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-4">
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
                className="group p-10 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-primary/5 border border-primary/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <partner.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-3xl text-foreground mb-2 group-hover:text-primary transition-colors">
                  {partner.title}
                </h3>
                <p className="font-mono text-xs text-primary tracking-widest uppercase mb-4 opacity-80">
                  {partner.subtitle}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  {partner.description}
                </p>
                <a
                  href="mailto:partners@monolithproject.com"
                  className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-foreground group-hover:text-primary transition-colors"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </div>
  );
}
