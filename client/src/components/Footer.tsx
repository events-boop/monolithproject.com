/*
  DESIGN: Cosmic Mysticism - Footer
  - Minimal, elegant footer
  - Social links and navigation
  - Brand tagline
*/

import { motion } from "framer-motion";
import { Instagram, Headphones } from "lucide-react";
import { Link } from "wouter";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socialLinks = [
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/monolithproject.events" },
  { name: "TikTok", icon: TikTokIcon, url: "https://tiktok.com/@monolithproject" },
  { name: "SoundCloud", icon: Headphones, url: "https://soundcloud.com/chasing-sun-sets" },
];

const footerLinks = [
  { name: "About", href: "/about", isPage: true },
  { name: "Events", href: "#chapters", isPage: false },
  { name: "Radio", href: "/radio", isPage: true },
  { name: "Artists", href: "#artists", isPage: false },
  { name: "Booking", href: "/booking", isPage: true },
  { name: "Partners", href: "/sponsors", isPage: true },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative py-16 bg-card border-t border-border">
      <div className="container max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="font-display text-2xl tracking-ultra-wide text-primary mb-2">
              THE MONOLITH PROJECT
            </h3>
            <p className="text-sm text-muted-foreground tracking-widest uppercase">
              Togetherness is the frequency. Music is the guide.
            </p>
          </motion.div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-border mb-12" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-8">
            {footerLinks.map((link) => (
              link.isPage ? (
                <Link key={link.name} href={link.href}>
                  <a className="text-sm text-muted-foreground hover:text-primary tracking-widest uppercase transition-colors">
                    {link.name}
                  </a>
                </Link>
              ) : (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-muted-foreground hover:text-primary tracking-widest uppercase transition-colors"
                >
                  {link.name}
                </button>
              )
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} The Monolith Project. All rights reserved.
          </p>
        </div>

        {/* Decorative Monolith Symbol */}
        <div className="flex justify-center mt-12">
          <svg
            viewBox="0 0 40 60"
            className="w-6 h-9 text-primary/30"
            fill="currentColor"
          >
            <path d="M20 0 L40 60 L0 60 Z" />
          </svg>
        </div>
      </div>
    </footer>
  );
}
