import { lazy, Suspense, useState, useEffect, useLayoutEffect, useRef } from "react";
import { Ticket, ArrowUpRight, Lock, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "../lib/utils";
import { signalChirp } from "../lib/SignalChirpEngine";
import KineticDecryption from "./KineticDecryption";
import MagneticButton from "./MagneticButton";
import { getEventBannerPayload, isEventBannerVisible } from "../lib/eventBanner";
import { getDrawerTypeForHref, useUI } from "../contexts/UIContext";
import { getSceneForPath } from "../lib/scenes";
import { getExperienceEvent, getPrimaryTicketUrl, getSeriesExperienceEvent, getSeriesEvents } from "../lib/siteExperience";
import NavigationMegamenu from "./NavigationMegamenu";
import { getEventCta } from "../lib/cta";
import { getEventCtaToneClass } from "../lib/ctaTone";
import { useIntentPrefetch } from "../hooks/useIntentPrefetch";
import UntoldButterflyLogo from "./UntoldButterflyLogo";

const InteractiveNavigationOverlay = lazy(() => import("./InteractiveNavigationOverlay"));

const MenuCyclingText = ({ isOpen, brand }: { isOpen: boolean; brand?: string }) => {
  const accentClass = brand === "chasing-sunsets" ? "text-sunsets-gold" :
    brand === "untold-story" ? "text-untold-cyan" :
      brand === "radio" ? "text-rose-500" : "text-primary";

  return (
    <div className="hidden sm:flex lg:hidden relative h-4 overflow-hidden flex-col font-mono text-[11px] font-bold tracking-[0.25em] uppercase transition-colors">
      <span
        className="h-full flex items-center justify-center"
        style={{ transform: `translateY(${isOpen ? "-100%" : "0%"})`, transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        MENU
      </span>
      <span
        className={cn("h-full flex items-center justify-center", accentClass)}
        style={{ transform: `translateY(${isOpen ? "-100%" : "0%"})`, transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        CLOSE
      </span>
    </div>
  );
};

const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="relative w-5 h-4 flex flex-col justify-between">
    <span
      style={{ transform: `translateY(${isOpen ? 6 : 0}px) rotate(${isOpen ? 45 : 0}deg)` }}
      className="block w-full h-[1.5px] bg-current rounded-full origin-center"
    />
    <span
      style={{ opacity: isOpen ? 0 : 1, transform: `scaleX(${isOpen ? 0 : 1})` }}
      className="block w-full h-[1.5px] bg-current rounded-full"
    />
    <span
      style={{ transform: `translateY(${isOpen ? -6 : 0}px) rotate(${isOpen ? -45 : 0}deg)` }}
      className="block w-full h-[1.5px] bg-current rounded-full origin-center"
    />
  </div>
);

interface NavigationProps {
  activeSection?: string;
  variant?: "dark" | "light";
  brand?: "monolith" | "chasing-sunsets" | "untold-story" | "radio";
}

export default function Navigation({ variant, brand }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const location = useLocation()[0];
  const setLocation = useLocation()[1];
  const { preconnectGateway } = useIntentPrefetch();

  const { openDrawer } = useUI();
  const isHome = location === "/";
  const scene = getSceneForPath(location);
  const resolvedVariant = variant ?? scene.variant;
  const resolvedBrand = brand ?? scene.brand;
  const isLight = resolvedVariant === "light";
  const ticketEvent = getExperienceEvent("ticket");
  const featuredChasingEvent = getSeriesExperienceEvent("chasing-sunsets", "hero");
  const featuredUntoldEvent = getSeriesExperienceEvent("untold-story", "hero");

  // Contextual CTA logic: ensure we point to the right series if we're on a series-specific page
  const isUntoldPath = location === "/story" || location.startsWith("/untold-story");
  const isSunsetsPath = location === "/chasing-sunsets" || location.startsWith("/chasing-sunsets");

  const contextEvent = isUntoldPath ? (featuredUntoldEvent || getSeriesEvents("untold-story")[0] || ticketEvent)
    : isSunsetsPath ? (featuredChasingEvent || getSeriesEvents("chasing-sunsets")[0] || ticketEvent)
      : ticketEvent;

  const cta = getEventCta(contextEvent);
  const ctaToneClass = getEventCtaToneClass(contextEvent);
  const ticketHref = getPrimaryTicketUrl(contextEvent);
  const hasEventBanner = isEventBannerVisible(location);
  const bannerPayload = hasEventBanner ? getEventBannerPayload() : null;
  const mobileMenuId = "nav-mobile-menu";

  const [currentChapter, setCurrentChapter] = useState<{ number: string; label: string } | null>(null);

  useEffect(() => {
    if (!isHome) {
      setCurrentChapter(null);
      return;
    }

    const sections = [
      { id: "campaigns", number: "01", label: "NEXT SHOW" },
      { id: "season", number: "02", label: "UPCOMING" },
      { id: "series", number: "03", label: "SERIES" },
      { id: "showcase", number: "04", label: "RADIO" },
      { id: "community", number: "05", label: "PARTNERS" },
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

  // Escape closes the mobile menu.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on navigation.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Publish the actual header shell metrics so first-screen sections stay aligned
  // with the fixed framed header across breakpoints.
  useLayoutEffect(() => {
    const root = document.documentElement;

    const syncShellMetrics = () => {
      root.style.setProperty("--shell-banner-height", "0px");
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

  const handleNavClick = (href: string) => {
    signalChirp.click();

    const drawer = getDrawerTypeForHref(href);
    if (drawer) {
      openDrawer(drawer);
      setMobileMenuOpen(false);
      return;
    }

    // Improved deep routing for anchors and cross-page anchors
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const normalizedPath = path === "" ? "/" : path;
      const targetId = hash;

      // Ensure that if it has a hash but route maps to a drawer, open the drawer?
      // Actually, if we want to scroll on the drawer.. it might not work out properly.
      // E.g. `/about#story`. In drawerRouteMap we mapped `/about` so it might not match.
      // But we can check `path` against drawerRouteMap too!
      const pathDrawer = getDrawerTypeForHref(normalizedPath);
      if (pathDrawer) {
        openDrawer(pathDrawer);
        setMobileMenuOpen(false);
        // Wait for drawer to open then scroll into view inside it
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 400);
        return;
      }

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
      <nav
        ref={navRef}
        style={{
          top: "var(--shell-nav-offset)",
        }}
        className="fixed left-0 right-0 z-[10001] px-1 py-1 sm:px-4 sm:py-3 pointer-events-none"
      >
        <a
          href="#main-content"
          onClick={() => {
            window.setTimeout(() => {
              document.getElementById("main-content")?.focus();
            }, 0);
          }}
          className="pointer-events-auto sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:px-4 focus:py-3 focus:rounded-md focus:bg-black focus:text-white focus:ring-2 focus:ring-primary/70"
        >
          Skip to content
        </a>
        <div className="pointer-events-auto mx-auto flex w-full max-w-[1920px] flex-col gap-1 sm:w-[98%] sm:gap-3">
          {bannerPayload && bannerPayload.status !== "past" ? (
            <a
              href={bannerPayload.ticketUrl || "/newsletter"}
              target={bannerPayload.ticketUrl && /^https?:\/\//i.test(bannerPayload.ticketUrl) ? "_blank" : undefined}
              rel={bannerPayload.ticketUrl && /^https?:\/\//i.test(bannerPayload.ticketUrl) ? "noopener noreferrer" : undefined}
              aria-label={
                bannerPayload.ticketUrl
                  ? "Open tickets for current featured event"
                  : "Request early access for the current featured event"
              }
              className="group relative block overflow-hidden rounded-[0.72rem] border border-primary/30 shadow-[0_12px_30px_rgba(224,90,58,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 sm:rounded-2xl"
            >
              <div
                className="relative h-9 sm:h-11"
                style={
                  bannerPayload.status === "live"
                    ? { background: "linear-gradient(100deg, #ef4444 0%, #f97316 35%, #dc2626 70%, #fb7185 100%)" }
                    : { background: "linear-gradient(100deg, #30140f 0%, #7e3622 28%, #e05a3a 62%, #f39c6b 100%)" }
                }
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_55%,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_78%_45%,rgba(255,220,180,0.28),transparent_35%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/12 via-transparent to-black/10" />
                <div className="hidden h-full items-center overflow-hidden whitespace-nowrap sm:flex">
                  <span className="sr-only">{bannerPayload.text}</span>
                  <div aria-hidden="true" className="flex animate-marquee-fast whitespace-nowrap">
                    {Array(10)
                      .fill(bannerPayload.text)
                      .map((text, index) => (
                        <span key={index} className="relative z-10 inline-flex items-center">
                          <span className="mx-4 text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] sm:mx-6 sm:text-[11px]">
                            {text}
                          </span>
                          <Ticket className="mx-1.5 h-4.5 w-4.5 text-white/90 sm:mx-3 sm:h-6 sm:w-6" />
                        </span>
                      ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center px-2.5 sm:hidden">
                  <div className="flex min-w-0 items-center gap-2.5 text-white/90">
                    {bannerPayload.status === "live" ? (
                      <span className="inline-flex h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-white" />
                    ) : (
                      <Ticket className="h-3.5 w-3.5 shrink-0 text-white/90" />
                    )}
                    <span className="min-w-0 truncate font-mono text-[10px] font-bold uppercase tracking-[0.1em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                      {bannerPayload.text}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ) : null}

          <div
            className={`rounded-3xl sm:rounded-[2rem] ${isLight ? "shell-frame-light" : "shell-frame"}`}
          >
            <div className="flex min-h-[3rem] w-full items-center justify-between px-2 py-1 sm:min-h-[4.25rem] sm:px-6 lg:py-3 xl:px-8">
              {/* LEFT: LOGO */}
              <div className="mr-2 flex shrink-0 items-center gap-2.5 min-[360px]:mr-3 min-[360px]:gap-3 lg:mr-8 xl:mr-12">
                <MagneticButton strength={0.25}>
                  <button
                    type="button"
                    onClick={handleLogoClick}
                    aria-label="Go to homepage"
                    data-nav-logo="true"
                    className="flex min-h-[var(--tap-target-min)] min-w-[var(--tap-target-min)] max-w-[110px] sm:max-w-none items-center gap-3 cursor-pointer rounded-sm px-2 py-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 pointer-events-auto overflow-hidden"
                  >
                    <span className={`flex items-center gap-3 text-[clamp(1rem,1.4vw,1.5rem)] tracking-[0.1em] uppercase leading-none text-left whitespace-nowrap transition-all duration-700 overflow-hidden ${resolvedBrand === "chasing-sunsets" ? "font-sunsets text-sunsets-gold drop-shadow-[0_2px_10px_rgba(232,184,109,0.3)]" :
                      resolvedBrand === "untold-story" ? "font-serif italic capitalize tracking-normal text-white" :
                        resolvedBrand === "radio" ? "font-radio text-rose-500" :
                          isLight ? "font-heavy text-charcoal group-hover:text-clay" : "font-heavy text-white group-hover:text-primary"
                      }`}>
                      {resolvedBrand === "chasing-sunsets" ? "CHASING SUN(SETS)" :
                        resolvedBrand === "untold-story" ? (
                          <>
                            <UntoldButterflyLogo className="w-8 h-8 md:w-9 md:h-9 -ml-2 text-untold-cyan" glow={true} />
                            <span className="hidden min-[380px]:inline font-serif italic capitalize tracking-normal text-white">Untold Story</span>
                          </>
                        ) :
                          resolvedBrand === "radio" ? (
                            <span className="font-radio text-rose-500">SUN(SETS) RADIO</span>
                          ) :
                            (
                              <div className="flex flex-row items-baseline gap-2">
                                <span className={cn(
                                  "font-monolith text-[0.9rem] font-medium uppercase leading-none tracking-[0.08em] transition-colors min-[360px]:text-[0.98rem] md:text-[1.16rem] shrink-0",
                                  isLight ? "text-black" : "text-white"
                                )}>
                                  <KineticDecryption text="MONOLITH" sessionOnce={true} />
                                </span>
                                <span className={cn(
                                  "font-monolith hidden text-[11px] font-medium uppercase leading-none tracking-[0.18em] transition-colors sm:inline shrink-0",
                                  isLight ? "text-black/40" : "text-white/40"
                                )}>
                                  <KineticDecryption text="PROJECT" sessionOnce={true} />
                                </span>
                              </div>
                            )}
                    </span>
                  </button>
                </MagneticButton>

                {/* LOCATION CONTEXT SIGNAL (SCROLL-SPY) */}
                {isHome && currentChapter && (
                  <div
                    className="hidden 2xl:flex items-center gap-3 pl-6 ml-6 border-l border-white/5 pointer-events-none shrink-0"
                  >
                    <span className="font-mono text-[11px] text-white/20 uppercase tracking-[0.4em] select-none">
                      Section
                    </span>
                    <span className={cn(
                      "font-heavy text-xs min-[1250px]:text-sm tabular-nums transition-colors duration-500",
                      resolvedBrand === "chasing-sunsets" ? "text-sunsets-gold" :
                        resolvedBrand === "untold-story" ? "text-untold-cyan" :
                          "text-white/80"
                    )}>
                      {currentChapter.number} / {currentChapter.label}
                    </span>
                  </div>
                )}
              </div>

              {/* CENTER: NAV ITEMS */}
              <div className="hidden lg:flex flex-1 min-w-0 items-center justify-end gap-2 xl:gap-3 2xl:gap-6 pr-2 xl:pr-4 whitespace-nowrap">
                <NavigationMegamenu
                  label="SHOWS"
                  href="/schedule"
                  isActive={location === "/schedule" || location === "/events" || location === "/tickets" || location.startsWith("/events/")}
                  isLight={isLight}
                  brand={resolvedBrand}
                  onNavigate={handleNavClick}
                  megamenu={{
                    items: [
                      { label: "UPCOMING SHOWS", href: "/schedule", icon: "arrow" },
                      { label: "GET TICKETS", href: ticketHref || "/tickets", icon: "ticket" },
                      { label: "CHASING SUN(SETS)", href: "/chasing-sunsets" },
                      { label: "UNTOLD STORY", href: "/story" },
                      { label: "ENTRY GUIDE", href: "/guide#entry" },
                    ],
                    feature: ticketEvent ? {
                      title: ticketEvent.headline || ticketEvent.title,
                      subtitle: ticketEvent.episode || ticketEvent.subtitle || "Featured Event",
                      image: ticketEvent.image || "/images/chasing-sunsets-premium.webp",
                      href: ticketHref || `/events/${ticketEvent.slug || ticketEvent.id}`,
                      ctaText: ticketHref ? "On Sale" : "See The Night",
                      icon: ticketHref ? "ticket" : "arrow",
                      badge: ticketEvent.status === "on-sale" ? "ON SALE" : "COMING SOON",
                      external: !!ticketHref
                    } : {
                      title: "UPCOMING SHOWS",
                      subtitle: "Tickets + dates",
                      image: "/images/eran-hersh-live-1.webp",
                      href: "/schedule",
                      ctaText: "View Shows",
                      icon: "arrow",
                      badge: "SHOWS"
                    }
                  }}
                />

                <NavigationMegamenu
                  label="CHASING SUN(SETS)"
                  href="/chasing-sunsets"
                  isActive={location.includes("/chasing-sunsets")}
                  isLight={isLight}
                  brand={resolvedBrand}
                  onNavigate={handleNavClick}
                  megamenu={{
                    items: [
                      { label: "SEASON 2026", href: "/chasing-sunsets", icon: "arrow" },
                      { label: "SIGN UP FOR DROPS", href: "/newsletter", icon: "arrow" },
                      { label: "TICKETS + DATES", href: "/schedule", icon: "ticket" },
                      { label: "PAST NIGHTS", href: "/archive", icon: "arrow" },
                    ],
                    feature: {
                      title: featuredChasingEvent?.headline || featuredChasingEvent?.title || "Chasing Sun(Sets)",
                      subtitle: featuredChasingEvent?.episode || "Open-air series",
                      image: featuredChasingEvent?.image || "/images/chasing-sunsets-premium.webp",
                      href: getPrimaryTicketUrl(featuredChasingEvent) || "/chasing-sunsets",
                      ctaText: getPrimaryTicketUrl(featuredChasingEvent) ? "Get Tickets" : "View Season",
                      icon: getPrimaryTicketUrl(featuredChasingEvent) ? "ticket" : "arrow",
                      badge: featuredChasingEvent?.status === "on-sale" ? "ON SALE" : "SEASON 2026",
                      external: !!getPrimaryTicketUrl(featuredChasingEvent)
                    }
                  }}
                />

                <NavigationMegamenu
                  label="UNTOLD STORY"
                  href="/story"
                  isActive={location.includes("/story") || location.includes("/untold-story")}
                  isLight={isLight}
                  brand={resolvedBrand}
                  onNavigate={handleNavClick}
                  megamenu={{
                    items: [
                      { label: "CURRENT INDOOR EVENT", href: "/story", icon: "arrow" },
                      { label: "TICKETS + DATES", href: "/schedule", icon: "ticket" },
                      { label: "PAST NIGHTS", href: "/archive", icon: "arrow" },
                      { label: "CONTACT", href: "/contact", icon: "arrow" },
                    ],
                    feature: {
                      title: featuredUntoldEvent?.headline || featuredUntoldEvent?.title || "Untold Story",
                      subtitle: featuredUntoldEvent?.episode || "Indoor series",
                      image: featuredUntoldEvent?.image || "/images/untold-story-juany-deron-v2.webp",
                      href: getPrimaryTicketUrl(featuredUntoldEvent) || "/story",
                      ctaText: getPrimaryTicketUrl(featuredUntoldEvent) ? "Get Tickets" : "View Story",
                      icon: "arrow",
                      badge: featuredUntoldEvent?.status === "on-sale" ? "ON SALE" : "UNTOLD STORY",
                      external: !!getPrimaryTicketUrl(featuredUntoldEvent)
                    }
                  }}
                />

                <NavigationMegamenu
                  label="RADIO"
                  href="/radio"
                  isActive={location.startsWith("/radio")}
                  isLight={isLight}
                  brand={resolvedBrand}
                  onNavigate={handleNavClick}
                  megamenu={{
                    items: [
                      { label: "THE SHOW", href: "/radio", icon: "play" },
                      { label: "LATEST EPISODE", href: "/radio/ep-01-benchek", icon: "play" },
                      { label: "ALL EPISODES", href: "/radio#episodes" },
                    ],
                    feature: {
                      title: "CHASING SUN(SETS) RADIO",
                      subtitle: "Mixes, guests, and artist content",
                      image: "/images/radio-show-gear.webp",
                      href: "/radio/ep-01-benchek",
                      ctaText: "Tune In",
                      icon: "play",
                      badge: "RADIO"
                    }
                  }}
                />

                <NavigationMegamenu
                  label="PARTNERS"
                  href="/partners"
                  isActive={location === "/partners" || location === "/sponsors" || location === "/press" || location === "/booking"}
                  isLight={isLight}
                  brand={resolvedBrand}
                  onNavigate={handleNavClick}
                  megamenu={{
                    items: [
                      { label: "PARTNER WITH US", href: "/partners", icon: "arrow" },
                      { label: "PARTNERSHIPS", href: "/partners" },
                      { label: "SPONSOR ACCESS", href: "/sponsors" },
                      { label: "PRESS & MEDIA", href: "/press" },
                      { label: "ABOUT MONOLITH", href: "/about" },
                    ],
                    feature: {
                      title: "PARTNER WITH MONOLITH",
                      subtitle: "Brands, venues, and cultural collaborators",
                      image: "/images/industrial-roster.webp",
                      href: "/partners",
                      ctaText: "Start Conversation",
                      icon: "arrow",
                      badge: "PARTNERS"
                    }
                  }}
                />

                <Link
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("/contact");
                  }}
                  className={`group shrink-0 flex items-center gap-1.5 text-[10px] lg:text-[11px] xl:text-[12px] font-[800] tracking-[0.1em] lg:tracking-[0.1em] xl:tracking-[0.15em] uppercase transition-all duration-300 py-4 ${isLight
                      ? `hover:text-clay ${location === "/contact" ? "text-clay" : "text-stone"}`
                      : `hover:text-primary hover:drop-shadow-[0_0_8px_rgba(212,165,116,0.6)] ${location === "/contact" ? "text-primary drop-shadow-[0_0_8px_rgba(212,165,116,0.5)]" : "text-white/90 hover:text-white"}`
                    }`}
                >
                  Contact
                </Link>
              </div>

              {/* RIGHT: CTA & MOBILE TOGGLE */}
              <div className="flex items-center justify-end gap-1.5 min-[360px]:gap-2 sm:gap-3 md:gap-4 shrink-0">
                <div className="hidden min-[370px]:flex sm:hidden">
                  <MagneticButton strength={0.16}>
                    <a
                      href={cta.href}
                      target={cta.isExternal ? "_blank" : undefined}
                      rel={cta.isExternal ? "noopener noreferrer" : undefined}
                      data-mobile-quick-cta="true"
                      aria-label={`${cta.label} — ${ticketEvent?.headline || ticketEvent?.title || "Next Night"}`}
                      data-cursor-text={cta.tool === "posh" ? "GET IN" : cta.tool === "laylo" ? "UNLOCK" : "RSVP"}
                      onMouseEnter={() => {
                        signalChirp.hover();
                        if (cta.isExternal) preconnectGateway(cta.href);
                      }}
                      onClick={() => signalChirp.click()}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ${cta.tool === "posh"
                        ? "border-transparent bg-primary text-black"
                        : cta.tool === "laylo"
                          ? "border-white/10 bg-[#e4e4e7] text-[#18181b]"
                          : "border-white/20 bg-white/[0.08] text-white"
                        }`}
                    >
                      {cta.tool === "posh" ? <Ticket className="h-4 w-4" /> : cta.tool === "laylo" ? <Lock className="h-4 w-4 text-black" /> : <Zap className="h-4 w-4" />}
                    </a>
                  </MagneticButton>
                </div>

                {/* TICKETS BUTTON */}
                <div className="hidden sm:block">
                  <MagneticButton strength={0.2}>
                    <a
                      href={cta.href}
                      target={cta.isExternal ? "_blank" : undefined}
                      rel={cta.isExternal ? "noopener noreferrer" : undefined}
                      data-cursor-text={cta.tool === 'posh' ? "GET IN" : cta.tool === 'laylo' ? "UNLOCK" : "RSVP"}
                      onMouseEnter={() => {
                        signalChirp.hover();
                        if (cta.isExternal) preconnectGateway(cta.href);
                      }}
                      onClick={() => signalChirp.click()}
                    >
                      <div className={`
                      rounded-full items-center gap-2.5 px-5 min-[1150px]:px-6 xl:px-7 py-2.5
                      transition-all duration-500 flex border uppercase font-black
                      ${cta.tool === 'posh' ? 'cta-posh border-transparent' : cta.tool === 'laylo' ? 'cta-laylo' : 'cta-fillout'}
                      ${ctaToneClass}
                      ${isLight && cta.tool === 'posh' ? 'opacity-90 hover:opacity-100 !shadow-none' : ''}
                    `}>
                        {cta.tool === 'posh' ? <Ticket className="h-4 w-4" /> : cta.tool === 'laylo' ? <Lock className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                        <span className="text-[12px] min-[1150px]:text-[13px] xl:text-[14px] tracking-[0.2em]">
                          {cta.label}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                      </div>
                    </a>
                  </MagneticButton>
                </div>

                {/* Cinematic Universal Toggle (Menu -> Close) */}
                <div className="flex items-center">
                  <MagneticButton>
                    <button
                      type="button"
                      onClick={() => {
                        signalChirp.click();
                        setMobileMenuOpen(!mobileMenuOpen);
                      }}
                      data-nav-menu-toggle="true"
                      aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                      aria-haspopup="dialog"
                      aria-expanded={mobileMenuOpen}
                      aria-controls={mobileMenuId}
                      className={cn(
                        "flex min-h-[var(--tap-target-min)] min-w-[var(--tap-target-min)] items-center gap-3 px-3 sm:px-4 rounded-full transition-all duration-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                        isLight ? "text-charcoal border-black/5" : "text-foreground border-white/5",
                        mobileMenuOpen ? "bg-white text-black" : "bg-white/5 backdrop-blur-md"
                      )}
                    >
                      <MenuCyclingText isOpen={mobileMenuOpen} brand={resolvedBrand} />
                      <HamburgerIcon isOpen={mobileMenuOpen} />
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Interactive chapter-entry overlay */}
      {mobileMenuOpen && (
        <Suspense fallback={null}>
          <InteractiveNavigationOverlay
            activePath={location}
            closeButtonRef={closeButtonRef}
            dialogRef={mobileDialogRef}
            id={mobileMenuId}
            onClose={() => setMobileMenuOpen(false)}
            onNavigate={handleNavClick}
            ticketHref={ticketHref}
          />
        </Suspense>
      )}
    </>
  );
}
