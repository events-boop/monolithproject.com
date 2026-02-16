import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Handshake, Music, ShieldQuestion } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";

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
    <div className="min-h-screen bg-paper text-charcoal relative overflow-hidden">
      <Navigation variant="light" />

      {/* Atmosphere */}
      <div className="absolute inset-0 atmo-surface-soft opacity-50 pointer-events-none fixed" />

      <main className="relative pt-44 md:pt-48 pb-24">
        <section className="px-6">
          <div className="container max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <span className="ui-kicker text-charcoal/55 block mb-5">Get In Touch</span>
              <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.86] uppercase tracking-tight-display text-charcoal">
                CONTACT
              </h1>
              <p className="mt-5 text-charcoal/70 leading-relaxed max-w-2xl">
                Use the form for general inquiries, or jump directly to booking, partners, or legal.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:events@monolithproject.com"
                  className="btn-pill border-charcoal/20 bg-white/70 text-charcoal/80 hover:text-charcoal hover:border-charcoal/30 hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </a>
                <Link href="/booking" asChild>
                  <a className="btn-pill border-primary/35 bg-primary/10 text-primary hover:bg-primary/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
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
                      className="ui-card h-full block border border-charcoal/15 bg-white/70 hover:bg-white/85 transition-colors p-6"
                    >
                      <div className="w-11 h-11 rounded-2xl border border-charcoal/10 bg-white/80 flex items-center justify-center text-charcoal/60 mb-5">
                        <tile.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-2xl uppercase leading-none">{tile.title}</h3>
                      <p className="mt-3 text-sm text-charcoal/60 leading-relaxed">{tile.description}</p>
                      <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-charcoal/70">
                        {tile.label}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      </div>
                    </a>
                  ) : (
                    <Link href={tile.href} asChild>
                      <a className="ui-card h-full block border border-charcoal/15 bg-white/70 hover:bg-white/85 transition-colors p-6">
                        <div className="w-11 h-11 rounded-2xl border border-charcoal/10 bg-white/80 flex items-center justify-center text-charcoal/60 mb-5">
                          <tile.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-display text-2xl uppercase leading-none">{tile.title}</h3>
                        <p className="mt-3 text-sm text-charcoal/60 leading-relaxed">{tile.description}</p>
                        <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase text-charcoal/70">
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
                  className="border border-charcoal/15 bg-white/70 rounded-2xl p-7"
                >
                  <p className="ui-kicker text-charcoal/55 mb-4">What To Include</p>
                  <ul className="space-y-3 text-sm text-charcoal/70 leading-relaxed">
                    <li>Dates + venue (if relevant)</li>
                    <li>Links: mixes, socials, decks, references</li>
                    <li>Budget range (if you have one)</li>
                  </ul>
                  <div className="mt-6 h-px bg-charcoal/15" />
                  <p className="mt-6 text-sm text-charcoal/60 leading-relaxed">
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
