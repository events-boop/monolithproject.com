import { useEffect, useId, useLayoutEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { ROUTES } from "@shared/routes";
import { ChevronDown, ArrowUpRight, Play, Ticket } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

export interface MegamenuProps {
  label: React.ReactNode;
  href: string;
  isActive: boolean;
  isLight: boolean;
  brand: string;
  type?: "chasing-radio" | "untold" | "monolith" | "default";
  megamenu: {
    items: {
      label: string;
      href: string;
      icon?: "play" | "ticket" | "arrow";
    }[];
    feature: {
      title: string;
      subtitle?: string;
      image: string;
      /** Keep faces/heads visible in portrait feature tiles. */
      imagePosition?: string;
      href: string;
      ctaText: string;
      icon?: "play" | "ticket" | "arrow";
      badge?: string;
      external?: boolean;
    };
  };
  onNavigate: (href: string) => void;
}

export default function NavigationMegamenu({
  label,
  href,
  isActive,
  isLight,
  brand,
  type = "default",
  megamenu,
  onNavigate,
}: MegamenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Horizontal correction so the trigger-centered panel never clips the
  // viewport edge (left-most nav items would otherwise open off-screen).
  const [panelShift, setPanelShift] = useState(0);
  const menuId = useId();
  const disclosureRef = useRef<HTMLButtonElement | null>(null);
  const focusFirstLink = useRef(false);
  const section = href.includes("untold")
    ? "untold"
    : /sunsets|radio/.test(href)
      ? "sunsets"
      : "monolith";
  const clearMenuTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => clearMenuTimer, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    setPanelShift(0);
    const frame = requestAnimationFrame(() => {
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;
      const margin = 12;
      const overflowLeft = margin - rect.left;
      const overflowRight = rect.right - (window.innerWidth - margin);
      if (overflowLeft > 0) setPanelShift(overflowLeft);
      else if (overflowRight > 0) setPanelShift(-overflowRight);
      if (focusFirstLink.current) {
        panelRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
        focusFirstLink.current = false;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  const openMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 200);
  };

  const closeMenu = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleMouseEnter = () => {
    openMenu();
  };

  const handleMouseLeave = () => {
    closeMenu();
  };

  const FeatureIcon =
    megamenu.feature.icon === "play"
      ? Play
      : megamenu.feature.icon === "ticket"
        ? Ticket
        : ArrowUpRight;

  const ItemIcon = ({
    type: itemType,
  }: {
    type?: "play" | "ticket" | "arrow";
  }) => {
    if (itemType === "play")
      return <Play className="w-2.5 h-2.5 fill-current text-primary" />;
    if (itemType === "ticket")
      return <Ticket className="w-2.5 h-2.5 text-primary" />;
    if (itemType === "arrow")
      return <ArrowUpRight className="w-2.5 h-2.5 opacity-50" />;
    return (
      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30 group-hover/item:opacity-100 transition-opacity" />
    );
  };

  // Custom configurations based on Megamenu Type
  let leftColumnTitle = "Explore";
  let leftColumnItems = megamenu.items;

  if (type === "chasing-radio") {
    leftColumnTitle = "Chasing Sunsets Radio";
    leftColumnItems = [
      { label: "All radio sessions", href: ROUTES.radio, icon: "arrow" },
      { label: "SUNSETS.FM", href: ROUTES.sunsetsFM, icon: "arrow" },
      {
        label: "Benchek · Special NYE",
        href: "/radio/ep-01-benchek",
        icon: "play",
      },
      { label: "Ewerseen", href: "/radio/ep-02-ewerseen", icon: "play" },
      { label: "Terranova", href: "/radio/ep-03-terranova", icon: "play" },
      {
        label: "Benchek · Marbella II",
        href: "/radio/ep-004-benchek-part-2",
        icon: "play",
      },
      { label: "Open Network", href: ROUTES.openNetwork, icon: "arrow" },
    ];
  } else if (type === "untold") {
    leftColumnTitle = "The Lore";
    leftColumnItems = [
      { label: "The Vision", href: "/untold-story#vision", icon: "arrow" },
      { label: "What to Expect", href: "/untold-story#expect", icon: "arrow" },
      { label: "Dress Code", href: "/untold-story#dresscode", icon: "arrow" },
      { label: "Private Tables", href: "/untold-story#tables", icon: "arrow" },
      { label: "Story Archive", href: "/archive", icon: "arrow" },
    ];
  } else if (type === "monolith") {
    leftColumnTitle = "The Concept";
    leftColumnItems = [
      { label: "The Story", href: "/monolith#story", icon: "arrow" },
      { label: "The Vision", href: "/monolith#vision", icon: "arrow" },
      { label: "Manifesto", href: "/monolith#manifesto", icon: "arrow" },
    ];
  }

  return (
    <div
      className="site-nav-item relative flex h-full min-w-max shrink-0 flex-1 items-center justify-center"
      data-section={section}
      data-active={isActive || undefined}
      data-appearance={isLight ? "light" : "dark"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onBlurCapture={e => {
        const nextTarget = e.relatedTarget as Node | null;
        if (!nextTarget || !e.currentTarget.contains(nextTarget)) {
          clearMenuTimer();
          setIsOpen(false);
        }
      }}
      onKeyDown={e => {
        if (e.key === "Escape" && isOpen) {
          e.preventDefault();
          e.stopPropagation();
          clearMenuTimer();
          setIsOpen(false);
          disclosureRef.current?.focus();
        }
        if (e.key === "ArrowDown" && !isOpen) {
          e.preventDefault();
          clearMenuTimer();
          focusFirstLink.current = true;
          setIsOpen(true);
        }
      }}
    >
      <Link
        href={href}
        className="site-nav-link"
        aria-current={isActive ? "page" : undefined}
        onClick={event => {
          if (
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          )
            return;
          event.preventDefault();
          clearMenuTimer();
          setIsOpen(false);
          onNavigate(href);
        }}
      >
        {label}
      </Link>
      <button
        ref={disclosureRef}
        type="button"
        className="site-nav-disclosure"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`Explore ${typeof label === "string" ? label.toLowerCase() : brand}`}
        onClick={() => {
          clearMenuTimer();
          setIsOpen(open => !open);
        }}
      >
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          ref={panelRef}
          className={`site-nav-panel absolute left-1/2 top-full z-30 mt-3 w-[min(42rem,calc(100vw-3rem))] rounded-[2rem] border p-2 shadow-[0_26px_56px_rgba(0,0,0,0.46)] backdrop-blur-xl ${
            isLight
              ? "bg-white/97 border-black/6"
              : "bg-[rgba(12,10,10,0.94)] border-[rgba(255,228,194,0.16)] shadow-[0_26px_56px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,246,232,0.12)]"
          }`}
          role="region"
          aria-label={`${typeof label === "string" ? label : brand} links`}
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            transform: `translateX(calc(-50% + ${panelShift}px))`,
          }}
        >
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t bg-inherit opacity-90" />
          <div className="flex min-h-[300px] overflow-hidden rounded-3xl bg-transparent">
            {/* Left Column: Links */}
            <div className="site-nav-directory w-5/12 p-6 flex flex-col gap-5">
              <span
                className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isLight ? "text-black/40" : "text-white/70"}`}
              >
                {leftColumnTitle}
              </span>
              <ul className="flex flex-col gap-3">
                {leftColumnItems.map((item, i) => {
                  const isGoRoute = item.href.startsWith("/go/");
                  return (
                    <li key={i}>
                      {isGoRoute ? (
                        <a
                          href={item.href}
                          data-first-access={
                            /first\s+access/i.test(item.label)
                              ? "true"
                              : undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className={`site-nav-menu-link group/item flex items-center gap-2.5 text-sm font-medium tracking-wider transition-all hover:translate-x-1 duration-200 border-b border-transparent ${
                            isLight
                              ? "text-charcoal hover:text-clay hover:border-clay/30"
                              : "text-white/80 hover:text-white hover:border-primary/40"
                          }`}
                        >
                          <div className="w-4 flex items-center justify-center shrink-0">
                            <ItemIcon type={item.icon} />
                          </div>
                          <span className="flex-1">{item.label}</span>
                          <div className="w-px h-0 group-hover/item:h-3 bg-current opacity-20 transition-all duration-300" />
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          data-first-access={
                            /first\s+access/i.test(item.label)
                              ? "true"
                              : undefined
                          }
                          onClick={e => {
                            e.preventDefault();
                            setIsOpen(false);
                            onNavigate(item.href);
                          }}
                          className={`site-nav-menu-link group/item flex items-center gap-2.5 text-sm font-medium tracking-wider transition-all hover:translate-x-1 duration-200 border-b border-transparent ${
                            isLight
                              ? "text-charcoal hover:text-clay hover:border-clay/30"
                              : "text-white/80 hover:text-white hover:border-primary/40"
                          }`}
                        >
                          <div className="w-4 flex items-center justify-center shrink-0">
                            <ItemIcon type={item.icon} />
                          </div>
                          <span className="flex-1">{item.label}</span>
                          <div className="w-px h-0 group-hover/item:h-3 bg-current opacity-20 transition-all duration-300" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Column: Featured Card — portrait frame keeps heads intact */}
            <div className="flex w-7/12 items-stretch p-2">
              <div
                className={`site-nav-feature relative w-full aspect-[4/5] max-h-[22rem] self-center rounded-2xl overflow-hidden group/card cursor-pointer border border-white/10 bg-[#0d0c0b] shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition-shadow hover:shadow-[0_0_28px_rgba(243,166,89,0.18)] ${megamenu.feature.icon === "ticket" ? "border-[#f3a659]/35" : ""}`}
              >
                <ResponsiveImage
                  src={megamenu.feature.image}
                  alt={megamenu.feature.title}
                  sizes="28rem"
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: megamenu.feature.imagePosition || "50% 0%",
                  }}
                  className="absolute inset-x-[7%] inset-y-[6%] h-auto w-auto max-h-[88%] max-w-[86%] m-auto object-contain object-top origin-top"
                />

                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

                {/* Blinking green live status dot for Untold tickets */}
                {type === "untold" && megamenu.feature.badge ? (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/80 border border-emerald-500/30 flex items-center gap-2 shadow-lg backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase mt-0.5">
                      {megamenu.feature.badge}
                    </span>
                  </div>
                ) : megamenu.feature.badge ? (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/72 border border-white/20 flex items-center gap-1.5 shadow-lg">
                    <span className="text-[10px] font-bold tracking-widest text-white uppercase mt-0.5">
                      {megamenu.feature.badge}
                    </span>
                  </div>
                ) : null}

                {/* Glassmorphism hover play overlay for Chasing/Radio */}
                {type === "chasing-radio" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 group-hover/card:scale-110 group-hover/card:bg-primary/80 group-hover/card:border-primary/50 shadow-2xl">
                      <Play className="w-5 h-5 text-white fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-start gap-4">
                  <div>
                    {megamenu.feature.subtitle && (
                      <p className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md">
                        {megamenu.feature.subtitle}
                      </p>
                    )}
                    <h3 className="text-white text-lg lg:text-xl font-display font-bold leading-tight drop-shadow-md">
                      {megamenu.feature.title}
                    </h3>
                  </div>

                  {megamenu.feature.external ? (
                    <a
                      href={megamenu.feature.href}
                      data-first-access={
                        /first\s+access/i.test(megamenu.feature.ctaText)
                          ? "true"
                          : undefined
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className={`${megamenu.feature.icon === "ticket" ? "btn-pill-monolith" : "btn-pill-outline"} btn-pill-compact`}
                    >
                      <FeatureIcon className="w-4 h-4" />
                      <span className="text-[13px] lg:text-sm font-black tracking-[0.15em] uppercase">
                        {megamenu.feature.ctaText}
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={megamenu.feature.href}
                      data-first-access={
                        /first\s+access/i.test(megamenu.feature.ctaText)
                          ? "true"
                          : undefined
                      }
                      onClick={e => {
                        e.preventDefault();
                        setIsOpen(false);
                        onNavigate(megamenu.feature.href);
                      }}
                      className="btn-pill-outline btn-pill-compact"
                    >
                      <FeatureIcon className="w-4 h-4" />
                      <span className="text-[13px] lg:text-sm font-black tracking-[0.15em] uppercase">
                        {megamenu.feature.ctaText}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
