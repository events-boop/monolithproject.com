import {
  Instagram,
  Headphones,
  Youtube,
  ArrowUpRight,
  Sun,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  POSH_TICKET_URL,
  INSTAGRAM_MONOLITH,
  INSTAGRAM_SUNSETS,
  INSTAGRAM_UNTOLD,
  TIKTOK_URL,
  SOUNDCLOUD_URL,
} from "@/data/events";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { CTA_LABELS } from "@/lib/cta";
import { getSceneForPath } from "@/lib/scenes";
import { ROUTES, ANCHORS } from "@shared/routes";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socials = [
  { name: "Monolith — Instagram", icon: Instagram, url: INSTAGRAM_MONOLITH },
  { name: "Monolith — TikTok", icon: TikTokIcon, url: TIKTOK_URL },
  {
    name: "Chasing Sun(Sets) — Instagram",
    icon: Instagram,
    url: INSTAGRAM_SUNSETS,
  },
  { name: "Untold Story — Instagram", icon: Instagram, url: INSTAGRAM_UNTOLD },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@monolithproject",
  },
  { name: "SoundCloud", icon: Headphones, url: SOUNDCLOUD_URL },
];

type FooterLinkGroup = {
  title: string;
  items: Array<{
    name: string;
    href: string;
    external?: boolean;
  }>;
};

const links: FooterLinkGroup[] = [
  {
    title: "Explore",
    items: [
      { name: "About", href: ROUTES.about },
      { name: "Togetherness", href: ROUTES.about + ANCHORS.togetherness },
      { name: "Events", href: ROUTES.schedule },
      { name: "Artists", href: ROUTES.lineup },
      { name: "Event Archive", href: ROUTES.archive },
      { name: "Articles", href: ROUTES.insights },
      { name: "Contact", href: ROUTES.contact },
    ],
  },
  {
    title: "Series",
    items: [
      { name: "Chasing Sun(Sets)", href: ROUTES.chasingSunsets },
      { name: "Sun(Sets) Link In Bio", href: ROUTES.sunsets },
      { name: "Untold Story", href: ROUTES.story },
      { name: "Radio Show", href: ROUTES.radio },
    ],
  },
  {
    title: "Work With Us",
    items: [
      { name: "Partners", href: ROUTES.partners },
      { name: "Sponsor Access", href: ROUTES.sponsors },
      { name: "Booking", href: ROUTES.booking },
      { name: "Artist Submission", href: ROUTES.submit },
      { name: "Press & Media", href: ROUTES.press },
    ],
  },
  {
    title: "Utilities",
    items: [
      { name: "Newsletter", href: ROUTES.newsletter },
      { name: "Night Guide", href: ROUTES.guide },
      { name: "FAQ", href: ROUTES.faq },
      {
        name: "Tickets",
        href: POSH_TICKET_URL,
      },
      { name: "Terms of Service", href: ROUTES.terms },
      { name: "Privacy Policy", href: ROUTES.privacy },
      { name: "Cookie Policy", href: ROUTES.cookies },
    ],
  },
];

export default function Footer() {
  const [location] = useLocation();
  const scene = getSceneForPath(location);
  const resolvedBrand = scene.brand || "monolith";

  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const textScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  let displayTitle = "MONOLITH";
  let topNavLeft = "MONOLITH";
  let topNavRight = "PROJECT";
  let glowColor = "rgba(224,90,58";
  let fontSizeClass = "text-[18vw]";

  if ((resolvedBrand as string) === "chasing-sunsets") {
    displayTitle = "CHASING SUNSETS";
    topNavLeft = "CHASING";
    topNavRight = "SUN(SETS)";
    glowColor = "rgba(232,184,109";
    fontSizeClass = "text-[15.5vw]";
  } else if ((resolvedBrand as string) === "untold-story") {
    displayTitle = "UNTOLD STORY";
    topNavLeft = "UNTOLD";
    topNavRight = "STORY";
    glowColor = "rgba(34,211,238";
    fontSizeClass = "text-[17vw]";
  } else if ((resolvedBrand as string) === "radio") {
    displayTitle = "SUN(SETS) RADIO";
    topNavLeft = "SUN(SETS)";
    topNavRight = "RADIO";
    glowColor = "rgba(244,63,94";
    fontSizeClass = "text-[15vw]";
  }

  const renderItemLabel = (name: string) => {
    if (name === "Chasing Sun(Sets)" || name === "Sun(Sets) Link In Bio") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-clay" />
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
    <footer className="bg-background border-t border-white/5 relative overflow-hidden pt-12 md:pt-16 pb-8 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(224,90,58,0.14),transparent_38%),radial-gradient(circle_at_88%_82%,rgba(194,112,62,0.1),transparent_42%),radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.1),transparent_34%),radial-gradient(circle_at_30%_78%,rgba(139,92,246,0.1),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,15,0.16)_0%,rgba(6,6,15,0.45)_100%)]" />
      <div className="container layout-wide px-6 flex flex-col justify-between min-h-[60vh]">
        {/* Top: Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16 z-10 relative">
          <div className="col-span-2 md:col-span-1">
            <span className="hero-wordmark text-3xl md:text-3xl tracking-wide block mb-6 text-white leading-none">
              {topNavLeft}
              <br />
              {topNavRight}
            </span>
            <p className="text-white/70 text-sm leading-relaxed max-w-[220px]">
              Chicago-rooted house music experiences. Curated rooms.
              Uncompromised sound. Built for people who return.
            </p>
          </div>

          {links.map(group => (
            <div key={group.title}>
              <h2 className="font-bold text-[12px] md:text-[11px] tracking-[0.2em] uppercase text-white/70 mb-6">
                {group.title}
              </h2>
              <ul className="space-y-4">
                {group.items.map(item => (
                  <li key={item.name}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`transition-colors font-bold text-[12px] md:text-[11px] tracking-[0.15em] uppercase flex items-center gap-1 group w-max ${
                          item.href === POSH_TICKET_URL
                            ? "px-3 py-1.5 rounded-none bg-primary/18 border border-primary/40 text-primary hover:text-primary hover:bg-primary/25"
                            : "text-white/80 hover:text-white"
                        }`}
                      >
                        {renderItemLabel(item.name)}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <Link href={item.href} asChild>
                        <a
                          className={`transition-colors font-bold text-[12px] md:text-[11px] tracking-[0.15em] uppercase block w-max ${
                            item.href === POSH_TICKET_URL
                              ? "px-3 py-1.5 rounded-none bg-primary/18 border border-primary/40 text-primary hover:text-primary hover:bg-primary/25"
                              : "text-white/80 hover:text-white"
                          }`}
                        >
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

        {/* Bottom: Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 pb-8 lg:pb-20 border-t border-white/5 z-10 relative">
          <div className="flex flex-wrap gap-2">
            {socials.map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center w-12 h-12 border border-white/20 bg-white/[0.04] text-white/70 hover:text-white hover:border-white/40 hover:bg-white/[0.1] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={s.name}
                title={s.name}
              >
                <s.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="ui-chip text-white/70 text-[11px]">
              © {new Date().getFullYear()} The Monolith Project
            </p>
            <p className="ui-chip text-white/70 mt-1.5 text-[11px]">
              ENGINEERED BY STARK INDUSTRIES
            </p>
          </div>
        </div>
      </div>

      {/* Mega Footer: Giant Interactive Typography */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden cursor-default select-none group flex justify-center items-end mt-auto pt-24 md:pt-32 pb-8 md:pb-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={e => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
          e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
        }}
      >
        {/* Spotlight Gradient - Follows Mouse */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), ${glowColor},0.15), transparent 40%)`,
          }}
        />

        {/* Huge Edge-to-Edge Text */}
        <motion.div
          style={{ scale: textScale, y: textY, opacity: textOpacity }}
          className="w-full relative z-10"
        >
          <div
            className={`relative z-10 hero-wordmark ${fontSizeClass} leading-[0.95] text-center tracking-tight transition-all duration-700 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 drop-shadow-[0_0_0_${glowColor},0)] group-hover:drop-shadow-[0_0_80px_${glowColor},0.4)] mix-blend-overlay group-hover:mix-blend-normal uppercase`}
          >
            {displayTitle}
          </div>

          {/* Outline Overlay for Stroke Effect */}
          <div
            className={`absolute inset-x-0 top-0 z-20 hero-wordmark ${fontSizeClass} leading-[0.95] text-center tracking-tight pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity duration-700 text-transparent uppercase`}
            style={{
              WebkitTextStroke: "2px rgba(255,255,255,0.3)",
              transform: "translateZ(0)",
            }}
          >
            {displayTitle}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
