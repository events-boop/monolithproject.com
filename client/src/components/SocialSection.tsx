/*
  DESIGN: Cosmic Mysticism - Social Media Section
  - Instagram feed preview with links to all brand accounts
  - TikTok links
  - Clean grid layout with hover effects
*/

import { motion } from "framer-motion";
import { Instagram, ExternalLink } from "lucide-react";

interface SocialAccount {
  platform: "instagram" | "tiktok";
  handle: string;
  url: string;
  brand: string;
  description: string;
}

const socialAccounts: SocialAccount[] = [
  {
    platform: "instagram",
    handle: "@chasingsunsets.music",
    url: "https://instagram.com/chasingsunsets.music",
    brand: "Chasing Sun(Sets)",
    description: "Sunset gatherings & golden hour moments"
  },
  {
    platform: "instagram",
    handle: "@untoldstory.music",
    url: "https://instagram.com/untoldstory.music",
    brand: "Untold Story",
    description: "360° sonic experiences"
  },
  {
    platform: "instagram",
    handle: "@monolithproject.events",
    url: "https://instagram.com/monolithproject.events",
    brand: "The Monolith Project",
    description: "The movement behind the music"
  }
];

const tiktokAccounts = [
  {
    handle: "@chasingsunsets",
    url: "https://tiktok.com/@chasingsunsets",
    brand: "Chasing Sun(Sets)"
  },
  {
    handle: "@monolithproject",
    url: "https://tiktok.com/@monolithproject",
    brand: "The Monolith Project"
  }
];

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

export default function SocialSection() {
  return (
    <section id="social" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-6 h-6 text-primary" />
            <span className="text-sm tracking-ultra-wide text-muted-foreground uppercase">
              Stay Connected
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            FOLLOW THE<br />
            <span className="text-primary">FREQUENCY</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join our community across platforms. Behind-the-scenes moments, artist features, and announcements.
          </p>
        </motion.div>

        {/* Instagram Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {socialAccounts.map((account, index) => (
            <motion.a
              key={account.handle}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 hover:border-primary/50 transition-all duration-300 text-center"
            >
              {/* Instagram Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              
              {/* Brand Name */}
              <h3 className="font-display text-xl text-foreground mb-2">
                {account.brand}
              </h3>
              
              {/* Handle */}
              <p className="text-primary font-medium mb-3">
                {account.handle}
              </p>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4">
                {account.description}
              </p>
              
              {/* Follow CTA */}
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                <span>Follow</span>
                <ExternalLink className="w-4 h-4" />
              </span>
            </motion.a>
          ))}
        </div>

        {/* TikTok Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {tiktokAccounts.map((account) => (
            <a
              key={account.handle}
              href={account.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 bg-card/30 border border-border rounded-full hover:border-primary/50 transition-all duration-300"
            >
              <TikTokIcon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {account.handle}
              </span>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
