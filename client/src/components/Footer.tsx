
import { Instagram, Headphones, Youtube, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { POSH_TICKET_URL } from "@/data/events";
import { useState } from "react";
import UntoldButterflyLogo from "./UntoldButterflyLogo";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

const socials = [
  { name: "Chasing Sun(Sets) Instagram", icon: Instagram, url: "https://instagram.com/chasingsunsets.music" },
  { name: "Untold Story Instagram", icon: Instagram, url: "https://instagram.com/untoldstory.music" },
  { name: "Monolith Instagram", icon: Instagram, url: "https://instagram.com/monolithproject.events" },
  { name: "Chasing Sun(Sets) TikTok", icon: TikTokIcon, url: "https://tiktok.com/@chasingsunsets" },
  { name: "Monolith TikTok", icon: TikTokIcon, url: "https://tiktok.com/@monolithproject" },
  { name: "YouTube", icon: Youtube, url: "https://youtube.com/@monolithproject" },
  { name: "Spotify", icon: SpotifyIcon, url: "https://open.spotify.com" },
  { name: "SoundCloud", icon: Headphones, url: "https://soundcloud.com/chasing-sun-sets" },
];

const links = [
  {
    title: "Navigate", items: [
      { name: "Schedule", href: "/schedule" },
      { name: "Tickets", href: "/tickets" },
      { name: "Lineup", href: "/lineup" },
      { name: "Chasing Sun(Sets)", href: "/chasing-sunsets" },
      { name: "Untold Story", href: "/story" },
      { name: "Radio", href: "/radio" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/#faq" },
    ]
  },
  {
    title: "Work With Us", items: [
      { name: "Partners", href: "/partners" },
      { name: "Booking", href: "/booking" },
      { name: "Sponsor Access", href: "/sponsors" },
      { name: "Get Tickets", href: POSH_TICKET_URL, external: true },
    ]
  },
  {
    title: "Legal", items: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
    ]
  }
];

export default function Footer() {
  const [isHovered, setIsHovered] = useState(false);
  const renderItemLabel = (name: string) => {
    if (name === "Chasing Sun(Sets)") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">☀️</span>
          <span>{name}</span>
        </span>
      );
    }
    if (name === "Untold Story") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <UntoldButterflyLogo className="w-3.5 h-3.5 text-primary" />
          <span>{name}</span>
        </span>
      );
    }
    return name;
  };

  return (
    <footer className="bg-background border-t border-white/5 relative overflow-hidden pt-20 pb-8 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(224,90,58,0.14),transparent_38%),radial-gradient(circle_at_88%_82%,rgba(194,112,62,0.1),transparent_42%),radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.1),transparent_34%),radial-gradient(circle_at_30%_78%,rgba(139,92,246,0.1),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,15,0.16)_0%,rgba(6,6,15,0.45)_100%)]" />
      <div className="container max-w-7xl mx-auto px-6 flex flex-col justify-between min-h-[60vh]">

        {/* Top: Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 z-10 relative">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-2xl tracking-wide block mb-6 text-white">
              THE MONOLITH
              <br />
              PROJECT
            </span>
            <p className="text-white/70 text-sm leading-relaxed max-w-[220px]">
              Togetherness is the frequency.
              <br />
              Music is the guide.
            </p>
          </div>

          {links.map((group) => (
            <div key={group.title}>
              <h4 className="ui-kicker text-white/60 mb-6">{group.title}</h4>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.name}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`transition-colors text-sm tracking-wide flex items-center gap-1 group ${item.name === "Get Tickets"
                          ? "px-2 py-1 rounded-full bg-primary/18 border border-primary/40 text-primary font-semibold hover:text-primary hover:bg-primary/25"
                          : "text-white/85 hover:text-white"
                          }`}
                      >
                        {renderItemLabel(item.name)}
                        <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <Link href={item.href} asChild>
                        <a className={`transition-colors text-sm tracking-wide ${item.name === "Get Tickets"
                          ? "px-2 py-1 rounded-full bg-primary/18 border border-primary/40 text-primary font-semibold hover:text-primary hover:bg-primary/25"
                          : "text-white/85 hover:text-white"
                          }`}>
                          {renderItemLabel(item.name)}
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle: Giant Interactive Typography with Spotlight */}
        <div
          className="relative py-10 md:py-24 -mx-6 md:-mx-12 overflow-hidden cursor-default select-none group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
          }}
        >
          {/* Spotlight Gradient - Follows Mouse */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
            style={{
              background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(224,90,58,0.15), transparent 40%)`
            }}
          />

          {/* Background Video/Gradient Fill Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-clay/20 to-primary/20 bg-[length:200%_auto] animate-marquee" />
            <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
          </div>

          {/* Huge Text - Base Layer */}
          <h1 className="relative z-10 font-display text-[13.5vw] leading-[0.8] text-center tracking-tight-display transition-all duration-700 text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-white/5 drop-shadow-[0_0_0_rgba(224,90,58,0)] group-hover:drop-shadow-[0_0_30px_rgba(224,90,58,0.3)] group-hover:text-white/90 mix-blend-overlay group-hover:mix-blend-normal transform group-hover:scale-[1.02]">
            MONOLITH
          </h1>

          {/* Outline Overlay for Stroke Effect */}
          <h1
            className="absolute inset-0 top-10 md:top-24 z-20 font-display text-[13.5vw] leading-[0.8] text-center tracking-tight-display pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-700 text-transparent"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
              transform: "translateZ(0)"
            }}
          >
            MONOLITH
          </h1>
        </div>

        {/* Bottom: Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5 z-10 relative">
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/25 bg-white/[0.03] flex items-center justify-center text-white/75 hover:text-white hover:border-white/45 hover:bg-white/[0.08] transition-all"
                aria-label={s.name}
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="ui-chip text-white/55">
              © {new Date().getFullYear()} The Monolith Project
            </p>
            <p className="ui-chip text-white/45 mt-1">
              Engineered in Chicago by Stark Industries
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
