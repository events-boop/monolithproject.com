import { useLayoutEffect, useState, useRef } from "react";
import { Link } from "wouter";
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
  const menuId = `megamenu-${brand}`;

  useLayoutEffect(() => {
    if (!isOpen) return;
    setPanelShift(0);
    requestAnimationFrame(() => {
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;
      const margin = 12;
      const overflowLeft = margin - rect.left;
      const overflowRight = rect.right - (window.innerWidth - margin);
      if (overflowLeft > 0) setPanelShift(overflowLeft);
      else if (overflowRight > 0) setPanelShift(-overflowRight);
    });
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
    leftColumnTitle = "SUN(SETS) Radio";
    leftColumnItems = [
      { label: "S1E1: Benchek", href: "/radio/ep-01-benchek", icon: "play" },
      {
        label: "S1E2: Terranova",
        href: "/radio/ep-03-terranova",
        icon: "play",
      },
      {
        label: "S1E3: Benchek Marbella",
        href: "/radio/ep-004-benchek-part-2",
        icon: "play",
      },
      {
        label: "S1E4: Ewerseen Mix",
        href: "/radio/ep-02-ewerseen",
        icon: "play",
      },
      {
        label: "S1E5: Terranova Guest",
        href: "/radio/ep-03-terranova",
        icon: "play",
      },
    ];
  } else if (type === "untold") {
    leftColumnTitle = "The Lore";
    leftColumnItems = [
      { label: "The Vision", href: "/story#vision", icon: "arrow" },
      { label: "What to Expect", href: "/story#expect", icon: "arrow" },
      { label: "Dress Code", href: "/story#dresscode", icon: "arrow" },
      { label: "Private Tables", href: "/story#tables", icon: "arrow" },
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
      className="relative flex h-full min-w-max shrink-0 flex-1 cursor-pointer items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={openMenu}
      onBlurCapture={e => {
        const nextTarget = e.relatedTarget as Node | null;
        if (!nextTarget || !e.currentTarget.contains(nextTarget)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={e => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={e => {
          e.preventDefault();
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsOpen(false);
          onNavigate(href);
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={typeof label === "string" ? label : undefined}
        className={`group shrink-0 flex items-center gap-1.5 text-[10px] lg:text-[10px] xl:text-[11px] 2xl:text-[12px] font-[800] tracking-[0.1em] lg:tracking-[0.08em] xl:tracking-[0.12em] 2xl:tracking-[0.15em] uppercase transition-all duration-300 py-4 ${
          isLight
            ? `hover:text-clay ${isActive ? "text-clay" : "text-stone"}`
            : brand === "chasing-sunsets"
              ? `hover:text-white hover:drop-shadow-[0_0_10px_rgba(232,184,109,0.55)] ${isActive ? "text-white drop-shadow-[0_0_10px_rgba(232,184,109,0.45)]" : "text-white/90"}`
              : `hover:text-primary hover:drop-shadow-[0_0_8px_rgba(212,165,116,0.6)] ${isActive ? "text-primary drop-shadow-[0_0_8px_rgba(212,165,116,0.5)]" : "text-white/90 hover:text-white"}`
        }`}
      >
        {label}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          ref={panelRef}
          className={`absolute left-1/2 top-full z-30 mt-3 w-[min(42rem,calc(100vw-3rem))] rounded-[2rem] border p-2 shadow-[0_22px_48px_rgba(0,0,0,0.38)] backdrop-blur-xl ${
            isLight
              ? "bg-white/97 border-black/6"
              : "bg-[#0a0a0a]/97 border-white/10"
          }`}
          role="menu"
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            transform: `translateX(calc(-50% + ${panelShift}px))`,
          }}
        >
          <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t bg-inherit opacity-90" />
          <div className="flex min-h-[240px] overflow-hidden rounded-3xl bg-transparent">
            {/* Left Column: Links */}
            <div className="w-5/12 p-6 flex flex-col gap-5">
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
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          role="menuitem"
                          className={`group/item flex items-center gap-2.5 text-sm font-medium tracking-wider transition-all hover:translate-x-1 duration-200 border-b border-transparent ${
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
                          onClick={e => {
                            e.preventDefault();
                            setIsOpen(false);
                            onNavigate(item.href);
                          }}
                          role="menuitem"
                          className={`group/item flex items-center gap-2.5 text-sm font-medium tracking-wider transition-all hover:translate-x-1 duration-200 border-b border-transparent ${
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

            {/* Right Column: Featured Card */}
            <div className="w-7/12 p-2">
              <div
                className={`relative h-full rounded-xl overflow-hidden group/card cursor-pointer shadow-none transition-shadow hover:shadow-[0_0_20px_rgba(212,165,116,0.15)] ${megamenu.feature.icon === "ticket" ? "border border-primary/30" : ""}`}
              >
                <ResponsiveImage
                  src={megamenu.feature.image}
                  alt={megamenu.feature.title}
                  sizes="28rem"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
                />

                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

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
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      role="menuitem"
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
                      onClick={e => {
                        e.preventDefault();
                        setIsOpen(false);
                        onNavigate(megamenu.feature.href);
                      }}
                      role="menuitem"
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
