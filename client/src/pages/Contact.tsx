import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Handshake, Music, ShieldQuestion } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import SEO from "@/components/SEO";

const contactTiles = [
  {
    icon: Mail,
    title: "General",
    description: "Questions, feedback, and anything that doesn't fit a box.",
    href: "mailto:events@monolithproject.com",
    label: "events@monolithproject.com",
    external: true,
  },
  {
    icon: Music,
    title: "Artists & Bookings",
    description: "Submit your mix, reach out for bookings, or propose a lineup idea.",
    href: "/booking",
    label: "Go to Booking",
    external: false,
  },
  {
    icon: Handshake,
    title: "Partners",
    description: "Venues, brands, crew, and collaborators. Let's build something clean.",
    href: "/partners",
    label: "View Partners",
    external: false,
  },
  {
    icon: ShieldQuestion,
    title: "Privacy / Legal",
    description: "Privacy requests and policy questions.",
    href: "/privacy",
    label: "Privacy Policy",
    external: false,
  },
] as const;

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <SEO
        title="Contact"
        description="Get in touch with The Monolith Project for bookings, partnerships, and general inquiries."
      />
      <Navigation />

      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 atmo-surface opacity-35" />

      <main className="relative pt-44 md:pt-48 pb-24">
        <section className="px-6">
          <div className="container max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <span className="ui-kicker text-primary/85 block mb-5">Get In Touch</span>
              <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.86] uppercase tracking-tight-display">
                CONTACT
              </h1>
              <p className="mt-5 text-muted-foreground leading-relaxed max-w-2xl">
                Use the form for general inquiries, or jump directly to booking, partners, or legal.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:events@monolithproject.com"
                  className="btn-pill border-white/10 bg-white/[0.03] text-white/85 hover:text-white hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </a>
                <Link href="/booking" asChild>
                  <a className="btn-pill border-primary/40 bg-primary/12 text-primary hover:bg-primary/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                    <Music className="w-3.5 h-3.5" />
                    Booking
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </Link>
              </div>
            </motion.div>

            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactTiles.map((tile, idx) => (
                <motion.div
                  key={tile.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: idx * 0.05, duration: 0.45, ease: "easeOut" }}
                  className="h-full"
                >
                  {tile.external ? (
                    <a
                      href={tile.href}
                      className="ui-card h-full block border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6"
                    >
                      <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/70 mb-5">
                        <tile.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-2xl uppercase leading-none">{tile.title}</h3>
                      <p className="mt-3 text-sm text-white/45 leading-relaxed">{tile.description}</p>
                      <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-white/70">
                        {tile.label}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      </div>
                    </a>
                  ) : (
                    <Link href={tile.href} asChild>
                      <a className="ui-card h-full block border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-6">
                        <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/70 mb-5">
                          <tile.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display text-2xl uppercase leading-none">{tile.title}</h3>
                        <p className="mt-3 text-sm text-white/45 leading-relaxed">{tile.description}</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-white/70">
                          {tile.label}
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </div>
                      </a>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-16 grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="border border-white/10 bg-white/[0.02] rounded-2xl p-7"
                >
                  <p className="ui-kicker text-white/50 mb-4">What To Include</p>
                  <ul className="space-y-3 text-sm text-white/55 leading-relaxed">
                    <li>Dates + venue (if relevant)</li>
                    <li>Links: mixes, socials, decks, references</li>
                    <li>Budget range (if you have one)</li>
                  </ul>
                  <div className="mt-6 h-px bg-white/10" />
                  <p className="mt-6 text-sm text-white/45 leading-relaxed">
                    If you're sending music: include a private SoundCloud link and a short note about the vibe you play.
                  </p>
                </motion.div>
              </div>

              <div className="lg:col-span-7">
                <ContactFormSection />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
