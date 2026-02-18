import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Handshake, Music, ShieldQuestion, Instagram } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import SEO from "@/components/SEO";

const socialLinks = [
  {
    label: "Email",
    value: "events@monolithproject.com",
    href: "mailto:events@monolithproject.com",
    icon: Mail,
    color: "#E05A3A",
  },
  {
    label: "Instagram",
    value: "@monolithproject.events",
    href: "https://instagram.com/monolithproject.events",
    icon: Instagram,
    color: "#E8B86D",
  },
  {
    label: "SoundCloud",
    value: "soundcloud.com/monolithproject",
    href: "https://soundcloud.com/monolithproject",
    // Custom SVG icon inline
    icon: null,
    svgPath: "M1 13.5C1 14.88 2.12 16 3.5 16s2.5-1.12 2.5-2.5V6a.5.5 0 0 0-1 0v7.5c0 .83-.67 1.5-1.5 1.5S2 14.33 2 13.5V9a.5.5 0 0 0-1 0v4.5zm5-7C6 7.88 7.12 9 8.5 9S11 7.88 11 6.5V4a.5.5 0 0 0-1 0v2.5c0 .83-.67 1.5-1.5 1.5S7 7.33 7 6.5V2a.5.5 0 0 0-1 0v4.5zm5 3C11 10.88 12.12 12 13.5 12S16 10.88 16 9.5v-5a.5.5 0 0 0-1 0v5c0 .83-.67 1.5-1.5 1.5S12 10.33 12 9.5v-7a.5.5 0 0 0-1 0v7z",
    color: "#FF5500",
  },
  {
    label: "Spotify",
    value: "The Monolith Project",
    href: "https://open.spotify.com/user/monolithproject",
    icon: null,
    svgPath: "M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.67 11.54c-.15.24-.46.32-.7.17-1.9-1.16-4.3-1.42-7.12-.78-.27.06-.54-.11-.6-.38-.06-.27.11-.54.38-.6 3.09-.7 5.74-.4 7.87.9.24.15.32.46.17.7zm.98-2.18c-.18.3-.57.39-.87.21-2.18-1.34-5.5-1.73-8.07-.95-.33.1-.68-.09-.78-.42-.1-.33.09-.68.42-.78 2.94-.89 6.6-.46 9.09 1.08.3.18.39.57.21.87zm.08-2.27C10.16 5.5 6.33 5.37 3.89 6.1c-.4.12-.82-.11-.94-.51-.12-.4.11-.82.51-.94 2.82-.86 7.5-.69 10.46 1.1.36.21.48.68.27 1.04-.21.36-.68.48-1.04.27z",
    color: "#1DB954",
  },
];

const contactTiles = [
  {
    icon: Mail,
    title: "General",
    description: "Questions, feedback, and anything that doesn't fit a box.",
    href: "mailto:events@monolithproject.com",
    label: "events@monolithproject.com",
    external: true,
    accent: "rgba(224,90,58,0.15)",
    border: "rgba(224,90,58,0.25)",
    iconColor: "#E05A3A",
  },
  {
    icon: Music,
    title: "Artists & Bookings",
    description: "Submit your mix, reach out for bookings, or propose a lineup idea.",
    href: "/booking",
    label: "Go to Booking",
    external: false,
    accent: "rgba(232,184,109,0.12)",
    border: "rgba(232,184,109,0.25)",
    iconColor: "#E8B86D",
  },
  {
    icon: Handshake,
    title: "Partners",
    description: "Venues, brands, crew, and collaborators. Let's build something clean.",
    href: "/partners",
    label: "View Partners",
    external: false,
    accent: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.25)",
    iconColor: "#8B5CF6",
  },
  {
    icon: ShieldQuestion,
    title: "Privacy / Legal",
    description: "Privacy requests and policy questions.",
    href: "/privacy",
    label: "Privacy Policy",
    external: false,
    accent: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.1)",
    iconColor: "rgba(255,255,255,0.5)",
  },
] as const;

export default function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "#050505" }}>
      <SEO
        title="Contact"
        description="Get in touch with The Monolith Project for bookings, partnerships, and general inquiries."
      />
      <Navigation />

      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(224,90,58,0.08),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(139,92,246,0.07),transparent_50%)]" />
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
              — Get In Touch
            </span>
            <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-[0.82] uppercase tracking-tight-display text-white mb-6">
              CONTACT
            </h1>
            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0 }}
              className="h-[2px] w-48 bg-gradient-to-r from-primary via-primary/60 to-transparent mb-8"
            />
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
              Use the form below, or jump directly to the right channel.
            </p>
          </motion.div>

          {/* Contact tiles */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {contactTiles.map((tile, idx) => {
              const inner = (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: idx * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className="group h-full p-6 relative overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    background: tile.accent,
                    border: `1px solid ${tile.border}`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${tile.accent}, transparent 70%)` }}
                  />

                  <div
                    className="relative w-10 h-10 flex items-center justify-center mb-5"
                    style={{ background: `${tile.accent}`, border: `1px solid ${tile.border}` }}
                  >
                    <tile.icon className="w-5 h-5" style={{ color: tile.iconColor }} />
                  </div>

                  <h3 className="relative font-display text-xl uppercase leading-none text-white mb-3">
                    {tile.title}
                  </h3>
                  <p className="relative text-sm text-white/45 leading-relaxed mb-6">
                    {tile.description}
                  </p>
                  <div
                    className="relative inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-200"
                    style={{ color: tile.iconColor }}
                  >
                    {tile.label}
                    <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </motion.div>
              );

              return tile.external ? (
                <a key={tile.title} href={tile.href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                  {inner}
                </a>
              ) : (
                <Link key={tile.title} href={tile.href} asChild>
                  <a className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                    {inner}
                  </a>
                </Link>
              );
            })}
          </div>

          {/* Social / direct contact strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20 mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-4 p-4 transition-all duration-300 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                >
                  {s.icon ? (
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  ) : (
                    <svg viewBox="0 0 16 16" className="w-4 h-4" fill={s.color}>
                      <path d={s.svgPath} />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[9px] tracking-[0.25em] uppercase mb-0.5" style={{ color: `${s.color}90` }}>
                    {s.label}
                  </p>
                  <p className="text-xs text-white/55 group-hover:text-white/80 transition-colors truncate">
                    {s.value}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 ml-auto flex-shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </motion.div>


          <div className="grid lg:grid-cols-12 gap-10 items-start">

            {/* Left: tips */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-4"
            >
              <div
                className="p-7 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-5">
                  What To Include
                </p>
                <ul className="space-y-4">
                  {[
                    "Dates + venue (if relevant)",
                    "Links: mixes, socials, decks, references",
                    "Budget range (if you have one)",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/55 leading-relaxed">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 h-px bg-white/8" />
                <p className="mt-6 text-sm text-white/35 leading-relaxed">
                  Sending music? Include a private SoundCloud link and a short note about the vibe you play.
                </p>

                <div className="mt-8 pt-6 border-t border-white/8">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3">Direct Email</p>
                  <a
                    href="mailto:events@monolithproject.com"
                    className="text-sm text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5 group"
                  >
                    events@monolithproject.com
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right: form */}
            <div className="lg:col-span-8">
              <ContactFormSection />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
