import ChasingSunsetsLogo from "./ChasingSunsetsLogo";
import { Instagram, Headphones, Youtube, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  INSTAGRAM_MONOLITH,
  INSTAGRAM_SUNSETS,
  INSTAGRAM_UNTOLD,
  TIKTOK_URL,
  SOUNDCLOUD_URL,
} from "@/data/events";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
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
      { name: "SUNSETS.FM", href: ROUTES.sunsetsFM },
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
        href: ROUTES.schedule,
      },
      { name: "Terms of Service", href: ROUTES.terms },
      { name: "Privacy Policy", href: ROUTES.privacy },
      { name: "Cookie Policy", href: ROUTES.cookies },
    ],
  },
];

export default function Footer() {
  const [location] = useLocation();
  const signatureRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: signatureRef,
    offset: ["start end", "end end"],
  });
  const textScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const brand = getSceneForPath(location).brand || "monolith";
  const [desktop, setDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const title =
    brand === "chasing-sunsets"
      ? "CHASING SUN(SETS)"
      : brand === "untold-story"
        ? "UNTOLD STORY"
        : brand === "radio"
          ? "SUN(SETS) RADIO"
          : "MONOLITH";
  return (
    <footer className="site-footer-refined" data-brand={brand}>
      <div className="container layout-wide">
        <div className="footer-refined-grid">
          <div className="footer-refined-brand">
            <Link href={ROUTES.home} aria-label="The Monolith Project home">
              {brand === "chasing-sunsets" ? (
                <ChasingSunsetsLogo className="w-[180px]" />
              ) : (
                <span className="hero-wordmark">{title}</span>
              )}
            </Link>
            <p>
              Chicago-rooted house music.
              <br />
              Rooms worth returning to.
            </p>
            <a
              className="footer-contact"
              href="mailto:events@monolithproject.com"
            >
              events@monolithproject.com{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          {links.map(group => (
            <details
              key={group.title}
              className="footer-link-group"
              open={desktop}
            >
              <summary>
                {group.title}
                <span aria-hidden="true">+</span>
              </summary>
              <nav aria-label={group.title}>
                {group.items.map(item => (
                  <Link key={item.name} href={item.href}>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </details>
          ))}
        </div>
        <div className="footer-refined-bottom">
          <div className="footer-socials">
            {socials.map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
              >
                <s.icon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
          <p>
            © {new Date().getFullYear()} The Monolith Project{" "}
            <span>Chicago, IL</span>
          </p>
        </div>
      </div>
      <div
        ref={signatureRef}
        className="footer-mega-wordmark"
        aria-hidden="true"
        onMouseMove={event => {
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            "--mouse-x",
            `${event.clientX - rect.left}px`
          );
          event.currentTarget.style.setProperty(
            "--mouse-y",
            `${event.clientY - rect.top}px`
          );
        }}
      >
        <motion.div
          className="footer-mega-text"
          style={
            reducedMotion
              ? undefined
              : { scale: textScale, y: textY, opacity: textOpacity }
          }
        >
          <span className="footer-mega-fill">{title}</span>
          <span className="footer-mega-outline">{title}</span>
        </motion.div>
      </div>
    </footer>
  );
}
