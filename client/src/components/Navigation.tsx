import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Menu, X, Ticket, ChevronDown, ArrowUpRight, Play, Mic2, Star, BookOpen, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { signalChirp } from "@/lib/SignalChirpEngine";
import KineticDecryption from "./KineticDecryption";
import MagneticButton from "./MagneticButton";
import CommunityDropdown from "./CommunityDropdown";
import { isEventBannerVisible } from "@/lib/eventBanner";
import { getDrawerTypeForHref, useUI } from "@/contexts/UIContext";
import { getSceneForPath } from "@/lib/scenes";
import { getExperienceEvent, getPrimaryTicketUrl } from "@/lib/siteExperience";
import NavigationMegamenu from "./NavigationMegamenu";

interface NavigationProps {
  activeSection?: string;
  variant?: "dark" | "light";
  brand?: "monolith" | "chasing-sunsets" | "untold-story" | "radio";
}

const navItems: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: "THE MONOLITH", href: "/about" },
  { label: "SUN(SETS) & RADIO", href: "/chasing-sunsets" },
  { label: "UNTOLD STORY", href: "/story" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "JOURNAL", href: "/insights" },
  {
    label: "PARTNERS",
    href: "/partners",
    children: [
      { label: "OUR PARTNERS", href: "/partners" },
      { label: "SPONSOR ACCESS", href: "/sponsors" },
      { label: "BOOKING", href: "/booking" },
      { label: "ARTIST SUBMISSION", href: "/submit" },
      { label: "PRESS & MEDIA", href: "/press" },
    ],
  },
  { label: "CONTACT", href: "/contact" },
];

const mobilePrimaryItems = [
  { 
    label: "THE MONOLITH", 
    href: "/about",
    subItems: [
      { label: "THE STORY", href: "/about#story" },
      { label: "THE VISION", href: "/about#vision" },
      { label: "MANIFESTO", href: "/about#manifesto" }
    ]
  },
  { 
    label: "SUN(SETS) & RADIO", 
    href: "/chasing-sunsets",
    subItems: [
      { label: "RADIO HUB", href: "/radio" },
      { label: "LATEST SHOW", href: "/radio/autograf" },
      { label: "SCHEDULE", href: "/schedule" }
    ]
  },
  { 
    label: "UNTOLD STORY", 
    href: "/story",
    subItems: [
      { label: "THE VISION", href: "/story#vision" },
      { label: "PRIVATE TABLES", href: "/vip" },
      { label: "DRESS CODE", href: "/guide#dress" }
    ]
  }
];

const mobileSecondaryItems = [
  { label: "ARTISTS", href: "/lineup" },
  { label: "RADIO", href: "/radio" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "NIGHT GUIDE", href: "/guide" },
  { label: "PARTNERS", href: "/partners" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation({ activeSection, variant, brand }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownLabel, setOpenDropdownLabel] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [location, setLocation] = useLocation();
  const { openDrawer } = useUI();
  const scene = getSceneForPath(location);
  const resolvedVariant = variant ?? scene.variant;
  const resolvedBrand = brand ?? scene.brand;
  const isLight = resolvedVariant === "light";
  const ticketHref = getPrimaryTicketUrl(getExperienceEvent("ticket"));
  const hasEventBanner = isEventBannerVisible(location);
  const mobileMenuId = "nav-mobile-menu";

  const { scrollY } = useScroll();
  const navBlur = "none";

  // Dynamic values for light/dark mode - Fixed: Hooks must be unconditional
  const bgValueLight = useTransform(scrollY, [0, 50], ["rgba(251, 245, 237, 0)", "rgba(251, 245, 237, 0.85)"]);
  const bgValueDark = useTransform(scrollY, [0, 50], ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.85)"]);
  const bgValue = isLight ? bgValueLight : bgValueDark;

  const borderValueLight = useTransform(scrollY, [0, 50], ["transparent", "rgba(21, 2, 217, 0.05)"]);
  const borderValueDark = useTransform(scrollY, [0, 50], ["transparent", "rgba(255, 255, 255, 0.08)"]);
  const borderValue = isLight ? borderValueLight : borderValueDark;

  const [currentChapter, setCurrentChapter] = useState<{ number: string; label: string } | null>(null);
  const isHome = location === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setCurrentChapter(null);
      return;
    }

    const sections = [
      { id: "series", number: "01", label: "SERIES" },
      { id: "season", number: "02", label: "SEASON" },
      { id: "collective", number: "03", label: "COLLECTIVE" },
      { id: "roster", number: "04", label: "ROSTER" },
      { id: "journal", number: "05", label: "JOURNAL" },
      { id: "archive", number: "06", label: "ARCHIVE" },
      { id: "mixes", number: "07", label: "MIXES" },
      { id: "community", number: "08", label: "COMMUNITY" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting sections and pick the one most visible
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        
        if (visible.length > 0) {
          const matched = sections.find(s => s.id === visible[0].target.id);
          if (matched) setCurrentChapter({ number: matched.number, label: matched.label });
        } else if (window.scrollY < 400) {
          setCurrentChapter(null);
        }
      },
      { threshold: [0.1, 0.5], rootMargin: "-10% 0px -70% 0px" }
    );

    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome, location]);

  useEffect(() => {
    const handleScroll = () => {
      // Show logo after scrolling past the hero section (~25vh)
      setIsScrolled(window.scrollY > (window.innerHeight * 0.25));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdownLabel(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Escape closes any open menus.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenDropdownLabel(null);
      setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close any open menus on navigation.
  useEffect(() => {
    setOpenDropdownLabel(null);
    setMobileMenuOpen(false);
  }, [location]);

  // Publish the actual shell metrics so first-screen sections can stay aligned
  // with the fixed banner + nav stack across breakpoints.
  useLayoutEffect(() => {
    const root = document.documentElement;

    const syncShellMetrics = () => {
      root.style.setProperty("--shell-banner-height", hasEventBanner ? "3rem" : "0px");
      root.style.setProperty("--shell-nav-height", `${navRef.current?.offsetHeight ?? 76}px`);
    };

    syncShellMetrics();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && navRef.current) {
      resizeObserver = new ResizeObserver(syncShellMetrics);
      resizeObserver.observe(navRef.current);
    }

    window.addEventListener("resize", syncShellMetrics);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncShellMetrics);
    };
  }, [hasEventBanner]);

  // Lock background scroll when mobile menu is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  // Basic focus management for the mobile dialog: focus close on open, restore on close.
  useEffect(() => {
    if (mobileMenuOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      window.setTimeout(() => closeButtonRef.current?.focus(), 0);
      return;
    }
    const el = lastFocusedRef.current;
    if (el && typeof el.focus === "function") el.focus();
    lastFocusedRef.current = null;
  }, [mobileMenuOpen]);

  const isActiveHref = (href: string) => {
    if (location === href) return true;
    // Aliases kept for marketing links.
    if (href === "/about" && location === "/togetherness") return true;
    if (href === "/story" && location === "/untold-story-deron-juany-bravo") return true;
    return false;
  };

  const getDropdownParentClass = (isActive: boolean) => {
    if (isLight) return "hover:text-clay text-stone";
    if (resolvedBrand === "chasing-sunsets") {
      return `hover:text-white hover:drop-shadow-[0_0_10px_rgba(232,184,109,0.55)] ${isActive ? "text-white drop-shadow-[0_0_10px_rgba(232,184,109,0.45)]" : "text-white/90"}`;
    }
    return `hover:text-primary hover:drop-shadow-[0_0_8px_rgba(212,165,116,0.6)] ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(212,165,116,0.5)]" : "text-white/90"}`;
  };

  const getDropdownItemClass = (isActive: boolean) => {
    if (isLight) return `hover:text-clay hover:bg-charcoal/5 ${isActive ? "text-clay" : "text-stone"}`;
    if (resolvedBrand === "chasing-sunsets") {
      return `hover:text-white hover:bg-white/5 ${isActive ? "text-white" : "text-white/80"}`;
    }
    return `hover:text-primary hover:bg-white/5 ${isActive ? "text-primary" : "text-white/80"}`;
  };

  const getTopLevelClass = (isActive: boolean) => {
    if (isLight) return `hover:text-clay ${isActive ? "text-clay" : "text-stone"}`;
    if (resolvedBrand === "chasing-sunsets") {
      return `hover:text-white hover:drop-shadow-[0_0_10px_rgba(232,184,109,0.55)] ${isActive ? "text-white drop-shadow-[0_0_10px_rgba(232,184,109,0.45)]" : "text-white/90"}`;
    }
    return `hover:text-primary hover:drop-shadow-[0_0_8px_rgba(212,165,116,0.6)] ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(212,165,116,0.5)]" : "text-white/90 hover:text-white"}`;
  };

  const getDropdownMenuId = (label: string) => `nav-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const renderNavLabel = (label: string, mobile = false) => {
    const accent =
      label === "CHASING SUN(SETS)"
        ? "#C2703E"
        : label === "RADIO"
          ? "#F43F5E"
          : label === "UNTOLD STORY"
            ? "#8B5CF6"
            : null;

    if (!accent) return label;

    return (
      <span className={`inline-flex items-center ${mobile ? "gap-3" : "gap-1.5"}`}>
        <span
          aria-hidden="true"
          className={`${mobile ? "h-2 w-2" : "h-1.5 w-1.5"} rounded-full`}
          style={{ backgroundColor: accent }}
        />
        <span className={`relative inline-block ${mobile ? "pb-2" : "pb-1"}`}>
          <span>{label}</span>
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 left-0 right-0 h-px opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
          />
        </span>
      </span>
    );
  };

  const handleNavClick = (href: string) => {
    signalChirp.click();
    
    // Improved deep routing for anchors and cross-page anchors
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const normalizedPath = path === "" ? "/" : path;
      const targetId = hash;
      
      if (location === normalizedPath || (location === "/" && normalizedPath === "/")) {
        // Current page, just scroll
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Cross page deep link
        setLocation(normalizedPath);
        // Wait for page transition then scroll
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          } else {
            // Fallback: try waiting longer if page is slow
            setTimeout(() => {
              document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
            }, 600);
          }
        }, 300);
      }
    } else {
      setLocation(href);
    }
  };

  const handleLogoClick = () => {
    signalChirp.click();
    const logoHref = "/";
    if (location === logoHref) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocation(logoHref);
    }
  };

  const handleUtilityLink = (href: string) => {
    const drawer = getDrawerTypeForHref(href);

    if (drawer) {
      openDrawer(drawer);
      return true;
    }

    if (href.includes("#")) {
      handleNavClick(href);
      return true;
    }

    return false;
  };

  return (
    <>
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[49] h-28 bg-gradient-to-b from-black/72 to-transparent" />
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        style={{
          top: "var(--shell-nav-offset)",
          backgroundColor: bgValue,
          backdropFilter: navBlur,
          borderColor: borderValue
        }}
        className="fixed left-0 right-0 z-[10001] px-3 py-2.5 transition-colors duration-500 sm:px-4 sm:py-3 pointer-events-auto"
      >
        <a
          href="#main-content"
          onClick={() => {
            window.setTimeout(() => {
              document.getElementById("main-content")?.focus();
            }, 0);
          }}
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-3 focus:rounded-md focus:bg-black focus:text-white focus:ring-2 focus:ring-primary/70"
        >
          Skip to content
        </a>
        <div
          className={`mx-auto w-[98%] max-w-[1920px] rounded-[1.75rem] ${isLight ? "shell-frame-light" : "shell-frame"}`}
        >
          <div className="w-full px-5 sm:px-6 xl:px-8 py-2 lg:py-3 flex items-center justify-between">
            {/* LEFT: LOGO */}
            <div className="shrink-0 mr-4 lg:mr-8 xl:mr-12 flex items-center gap-4">
              <MagneticButton strength={0.25}>
                <button
                  type="button"
                  onClick={handleLogoClick}
                  aria-label="Go to homepage"
                  className="flex items-center gap-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 rounded-sm focus-visible:ring-primary/70 pointer-events-auto"
                >
                  {/* The Monolith Pillar Signal */}
                  <div className="relative flex items-end justify-center w-5 h-6">
                    <div className={`w-[2px] h-full ${isLight ? "bg-stone/20" : "bg-white/10"} absolute bottom-0`} />
                    <div 
                      className={`w-[4px] h-[70%] relative z-10 rounded-t-[1px] group-hover:scale-y-110 transition-transform duration-500 ${
                        resolvedBrand === "chasing-sunsets" ? "bg-sunsets-gold" : 
                        resolvedBrand === "untold-story" ? "bg-untold-cyan" : 
                        isLight ? "bg-clay" : "bg-primary"
                      }`} 
                    />
                    <div 
                      className={`absolute -bottom-1 w-4 h-[1px] blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        resolvedBrand === "chasing-sunsets" ? "bg-sunsets-gold/40" : 
                        resolvedBrand === "untold-story" ? "bg-untold-cyan/40" : 
                        isLight ? "bg-clay/40" : "bg-primary/40"
                      }`} 
                    />
                  </div>
                  
                  <span className={`text-[clamp(1.1rem,1.4vw,1.5rem)] tracking-[0.1em] uppercase leading-none text-left whitespace-nowrap transition-all duration-700 overflow-hidden ${
                    resolvedBrand === "chasing-sunsets" ? "font-sunsets text-sunsets-gold drop-shadow-[0_2px_10px_rgba(232,184,109,0.3)]" : 
                    resolvedBrand === "untold-story" ? "font-serif italic capitalize tracking-normal text-white" : 
                    resolvedBrand === "radio" ? "font-radio text-rose-500" :
                    isLight ? "font-heavy text-charcoal group-hover:text-clay" : "font-heavy text-white group-hover:text-primary"
                  }`}>
                    {resolvedBrand === "chasing-sunsets" ? "CHASING SUN(SETS)" : 
                     resolvedBrand === "untold-story" ? "Untold Story" : 
                     resolvedBrand === "radio" ? "MONOLITH RADIO" :
                     "MONOLITH"}
                  </span>
                </button>
              </MagneticButton>

              {/* LOCATION CONTEXT SIGNAL (SCROLL-SPY) */}
              <AnimatePresence>
                {isHome && currentChapter && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="hidden xl:flex items-center gap-3 pl-6 ml-6 border-l border-white/5 pointer-events-none"
                  >
                  <Link 
            href="/" 
            className="flex flex-col items-start gap-0.5 group pointer-events-auto"
            onClick={() => {
              signalChirp.click();
              setMobileMenuOpen(false);
            }}
            onMouseEnter={() => signalChirp.hover()}
          >
            <span className={cn(
              "font-heavy text-base md:text-xl tracking-[-0.04em] uppercase transition-colors shrink-0",
              isLight ? "text-black" : "text-white"
            )}>
              <KineticDecryption text="MONOLITH" />
            </span>
            <span className={cn(
              "font-monolith text-[9px] md:text-[11px] tracking-[0.3em] leading-none transition-colors -mt-0.5 shrink-0 uppercase",
              isLight ? "text-black/40" : "text-white/40"
            )}>
              <KineticDecryption text="PROJECT" />
            </span>
          </Link>
  <span className="font-mono text-[11px] text-white/20 uppercase tracking-[0.4em] select-none">
                      Chapter
                    </span>
                    <span className="font-heavy text-xs min-[1150px]:text-sm text-white/80 tabular-nums">
                      {currentChapter.number} / {currentChapter.label}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CENTER: NAV ITEMS */}
            <div className="hidden lg:flex flex-1 min-w-0 items-center justify-end gap-3 xl:gap-5 2xl:gap-8 pr-4 whitespace-nowrap">
              {/* NAVIGATION MEGAMENU INJECTIONS */}
              <NavigationMegamenu
                label="THE MONOLITH"
                href="/about"
                isActive={location === "/about" || location === "/togetherness"}
                isLight={isLight}
                brand={resolvedBrand}
                onNavigate={handleNavClick}
                megamenu={{
                  items: [
                    { label: "THE STORY", href: "/about#story" },
                    { label: "THE VISION", href: "/about#vision" },
                    { label: "MANIFESTO", href: "/about#manifesto" },
                  ],
                  feature: {
                    title: "THE MONOLITH HUB",
                    subtitle: "Core Philosophy",
                    image: "/images/hero-monolith.jpg",
                    href: "/about",
                    ctaText: "Explore Concept",
                    icon: "arrow",
                    badge: "STORY"
                  }
                }}
              />

              <NavigationMegamenu
                label="SUN(SETS) & RADIO"
                href="/chasing-sunsets"
                isActive={[ "/chasing-sunsets", "/radio" ].includes(location)}
                isLight={isLight}
                brand={resolvedBrand}
                onNavigate={handleNavClick}
                megamenu={{
                  items: [
                    { label: "S1E1: AUTOGRAF", href: "/radio/autograf", icon: "play" },
                    { label: "S1E2: LAZARE", href: "/radio/lazare", icon: "play" },
                    { label: "S2E3: ERAN HERSH", href: "/radio/eran-hersh", icon: "play" },
                    { label: "RADIO ARCHIVE", href: "/radio" },
                    { label: "ABOUT SUN(SETS)", href: "/chasing-sunsets" },
                  ],
                  feature: {
                    title: "LATEST TRANSMISSION",
                    subtitle: "Chasing Sun(Sets) Radio",
                    image: "/images/radio-show.jpg",
                    href: "/radio",
                    ctaText: "Listen Now",
                    icon: "play",
                    badge: "STREAMS"
                  }
                }}
              />

              <NavigationMegamenu
                label="UNTOLD STORY"
                href="/story"
                isActive={location.includes("/story")}
                isLight={isLight}
                brand={resolvedBrand}
                onNavigate={handleNavClick}
                megamenu={{
                  items: [
                    { label: "THE VISION", href: "/story#vision" },
                    { label: "WHAT TO EXPECT", href: "/story#expect" },
                    { label: "DRESS CODE", href: "/guide#dress" },
                    { label: "PRIVATE TABLES", href: "/vip" },
                    { label: "STORY ARCHIVE", href: "/untold-story/season-1" },
                  ],
                  feature: {
                    title: "DERON B2B JUANY BRAVO",
                    subtitle: "Untold Story S3·E3",
                    image: "/images/untold-story-juany-deron-v2.jpg",
                    href: ticketHref || "/story",
                    ctaText: ticketHref ? "Tickets Live" : "Join Waitlist",
                    icon: "ticket",
                    badge: "ON SALE NOW",
                    external: !!ticketHref
                  }
                }}
              />

              {navItems.filter(i => ![ "THE MONOLITH", "SUN(SETS) & RADIO", "UNTOLD STORY" ].includes(i.label)).map((item) =>
                item.children ? (
                    <div 
                      key={item.label} 
                      className="relative shrink-0"
                      onMouseEnter={() => { setOpenDropdownLabel(item.label); signalChirp.hover(); }}
                      onMouseLeave={() => setOpenDropdownLabel(null)}
                    >                      <button
                        type="button"
                        onClick={() => signalChirp.click()}
                        aria-expanded={openDropdownLabel === item.label}
                      aria-haspopup="menu"
                      aria-controls={getDropdownMenuId(item.label)}
                      className={`flex items-center gap-1.5 text-[11px] min-[1150px]:text-[11px] xl:text-[12px] font-[800] tracking-[0.1em] min-[1150px]:tracking-[0.1em] xl:tracking-[0.12em] uppercase transition-all duration-300 ${getDropdownParentClass([item.href, ...item.children.map(c => c.href)].includes(location))}`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          openDropdownLabel === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openDropdownLabel === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute top-full mt-4 -left-2 min-w-[210px] py-2.5 rounded-2xl border shadow-[0_18px_40px_rgba(0,0,0,0.42)] ${isLight
                            ? "bg-sand/95 border-charcoal/10"
                            : "bg-[#0c0c0a]/98 border-white/10"
                            }`}
                          id={getDropdownMenuId(item.label)}
                          role="menu"
                          aria-label={item.label}
                        >
                          {item.children.map((child) => (
                            <Link key={child.label} href={child.href}
                              onMouseEnter={() => signalChirp.hover()}
                              onClick={(e) => {
                                signalChirp.click();
                                if (handleUtilityLink(child.href)) {
                                  e.preventDefault();
                                }
                                setOpenDropdownLabel(null);
                              }}
                              aria-current={isActiveHref(child.href) ? "page" : undefined}
                              className={`block px-6 py-2.5 text-[11px] font-[800] tracking-[0.16em] uppercase transition-colors ${getDropdownItemClass(isActiveHref(child.href))}`}
                              role="menuitem"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={item.label} href={item.href}                    onMouseEnter={() => signalChirp.hover()}
                    onClick={(e) => {
                      signalChirp.click();
                      if (handleUtilityLink(item.href)) {
                        e.preventDefault();
                      }
                    }}
                    aria-current={isActiveHref(item.href) ? "page" : undefined}
                    className={`group relative shrink-0 text-[11px] min-[1150px]:text-[11px] xl:text-[12px] font-[800] tracking-[0.1em] min-[1150px]:tracking-[0.1em] xl:tracking-[0.12em] uppercase transition-all duration-300 ${getTopLevelClass(isActiveHref(item.href))}`}
                  >
                    <span className="relative z-10">{renderNavLabel(item.label)}</span>
                    <motion.span 
                      className="absolute -bottom-1 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-500"
                      initial={false}
                    />
                    <motion.span 
                      className="absolute -inset-x-2 -inset-y-1 bg-white/[0.03] rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Link>
                )
              )}
              <CommunityDropdown isLight={isLight} brand={resolvedBrand} />
            </div>

            {/* RIGHT: CTA & MOBILE TOGGLE */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 justify-end">
              {/* TICKETS BUTTON */}
              <div className="hidden sm:block">
                <MagneticButton strength={0.2}>
                  <a href={ticketHref || "/schedule"} target={ticketHref ? "_blank" : undefined} rel={ticketHref ? "noopener noreferrer" : undefined} data-cursor-text="TICKETS" onClick={() => signalChirp.click()}>
                    <div className={`sunset-gradient-btn text-white rounded-full items-center gap-2.5 px-5 min-[1150px]:px-6 xl:px-7 py-3 transition-all duration-300 flex ${isLight
                      ? "opacity-90 hover:opacity-100 !shadow-none"
                      : "hover:scale-[1.02] shadow-[0_0_20px_rgba(232,184,109,0.3)]"
                      }`}>
                      <Ticket className="h-4 w-4" />
                      <span className="font-black text-[12px] min-[1150px]:text-[13px] xl:text-[14px] tracking-[0.18em] uppercase">Tickets</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                    </div>
                  </a>
                </MagneticButton>
              </div>

              {/* Mobile Toggle */}
              <div className="lg:hidden">
                <MagneticButton>
                  <button
                    type="button"
                    onClick={() => { signalChirp.click(); setMobileMenuOpen(true); }}
                    aria-label="Open navigation menu"
                    aria-haspopup="dialog"
                    aria-expanded={mobileMenuOpen}
                    aria-controls={mobileMenuId}
                    data-cursor-text="MENU"
                    className={`p-2.5 ${isLight ? "text-charcoal hover:text-clay" : (resolvedBrand as string) === "chasing-sunsets" ? "text-foreground hover:text-white" : "text-foreground hover:text-primary"} transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70`}
                  >
                    <Menu size={24} />
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10005] flex flex-col items-center justify-start bg-[radial-gradient(circle_at_20%_15%,rgba(224,90,58,0.16),transparent_34%),radial-gradient(circle_at_82%_82%,rgba(34,211,238,0.14),transparent_36%),linear-gradient(180deg,rgba(6,6,15,0.88),rgba(6,6,15,0.96))] px-4 pb-6 backdrop-blur-2xl md:justify-center overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            ref={mobileDialogRef}
            id={mobileMenuId}
            style={{
              paddingTop: "calc(var(--shell-nav-offset) + var(--shell-nav-height) + 0.75rem)",
              paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
            }}
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const dialog = mobileDialogRef.current;
              if (!dialog) return;

              const focusable = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
                ),
              ).filter((el) => el.offsetParent !== null && el.getAttribute("aria-hidden") !== "true");

              if (focusable.length === 0) {
                e.preventDefault();
                return;
              }

              const first = focusable[0];
              const last = focusable[focusable.length - 1];
              const active = document.activeElement as HTMLElement | null;

              if (e.shiftKey) {
                if (active === first || !active || !dialog.contains(active)) {
                  e.preventDefault();
                  last.focus();
                }
                return;
              }

              if (active === last) {
                e.preventDefault();
                first.focus();
              }
            }}
          >
            <div
              className="absolute right-6 md:right-8"
              style={{ top: "calc(var(--shell-nav-offset) + 0.125rem)" }}
            >
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => { signalChirp.click(); setMobileMenuOpen(false); }}
                  aria-label="Close navigation menu"
                  ref={closeButtonRef}
                  data-cursor-text="CLOSE"
                  className="p-2.5 text-foreground/50 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <X size={32} />
                </button>
              </MagneticButton>
            </div>

            <div className="scrollbar-hide relative z-10 flex w-full max-w-2xl flex-col items-center gap-4 px-5 py-5 sm:gap-6 sm:px-8 sm:py-8">
              {mobilePrimaryItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        signalChirp.click();
                        handleNavClick(item.href);
                      }}
                      aria-current={isActiveHref(item.href) ? "page" : undefined}
                      className={`group font-display text-4xl sm:text-5xl md:text-6xl tracking-widest uppercase hover:text-white transition-colors cursor-pointer ${isActiveHref(item.href) ? "text-white" : "text-white/50"}`}
                    >
                      {renderNavLabel(item.label, true)}
                    </button>
                    {item.subItems && (
                      <button 
                        onClick={() => setExpandedMobileItem(expandedMobileItem === item.label ? null : item.label)}
                        className={`p-2 rounded-full bg-white/5 border border-white/10 transition-transform duration-300 ${expandedMobileItem === item.label ? "rotate-180" : ""}`}
                      >
                        <ChevronDown size={20} className="text-white/40" />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedMobileItem === item.label && item.subItems && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden flex flex-col items-center gap-3 mt-4 w-full"
                      >
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.label}
                            onClick={() => {
                              signalChirp.click();
                              handleNavClick(sub.href);
                              setMobileMenuOpen(false);
                            }}
                            className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-white/40 hover:text-primary transition-colors py-2 px-4 rounded-full border border-white/5 bg-white/[0.02]"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Emphasized ticket CTA */}
              <motion.a
                href={ticketHref || "/schedule"}
                target={ticketHref ? "_blank" : undefined}
                rel={ticketHref ? "noopener noreferrer" : undefined}
                onClick={() => { signalChirp.click(); setMobileMenuOpen(false); }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 bg-white rounded-full text-black font-heavy text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all cursor-pointer shadow-[0_10px_40px_rgba(255,255,255,0.2)] focus-visible:outline-none"
              >
                <Ticket className="w-4 h-4" />
                {ticketHref ? "SECURE SECRETS / TICKETS" : "SECURE PRIORITY ENTRY"}
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>

              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.6 }}
                 className="flex flex-wrap justify-center gap-x-6 gap-y-4 mt-10 pt-8 w-full border-t border-white/10"
              >
                 {mobileSecondaryItems.map((item) => (
                   <Link key={item.label} href={item.href} asChild>
                     <a 
                       onClick={() => { signalChirp.click(); setMobileMenuOpen(false); }}
                       className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors cursor-pointer"
                     >
                       {item.label}
                     </a>
                   </Link>
                 ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
