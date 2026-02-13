import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Ticket, ChevronDown, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import MagneticButton from "./MagneticButton";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { POSH_TICKET_URL } from "@/data/events";

interface NavigationProps {
  activeSection?: string;
  variant?: "dark" | "light";
}

const navItems = [
  { label: "CHASING SUN(SETS)", href: "/chasing-sunsets" },
  { label: "UNTOLD STORY", href: "/story" },
  { label: "SCHEDULE", href: "/schedule" },
  { label: "TICKETS", href: "/tickets" },
  { label: "LINEUP", href: "/lineup" },
  { label: "RADIO", href: "/radio" },
  { label: "ABOUT", href: "/about" },
  {
    label: "PARTNERS",
    href: "/partners",
    children: [
      { label: "PARTNERS & CREW", href: "/partners" },
      { label: "BOOKING", href: "/booking" },
      { label: "SPONSOR ACCESS", href: "/sponsors" },
    ],
  },
];

const mobileNavItems = [
  { label: "CHASING SUN(SETS)", href: "/chasing-sunsets" },
  { label: "UNTOLD STORY", href: "/story" },
  { label: "SCHEDULE", href: "/schedule" },
  { label: "TICKETS", href: "/tickets" },
  { label: "LINEUP", href: "/lineup" },
  { label: "RADIO", href: "/radio" },
  { label: "ABOUT", href: "/about" },
  { label: "PARTNERS", href: "/partners" },
  { label: "BOOKING", href: "/booking" },
];

export default function Navigation({ activeSection, variant = "dark" }: NavigationProps) {
  const isLight = variant === "light";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        setLocation("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  };

  const handleLogoClick = () => {
    if (location === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setLocation("/");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className={`fixed top-10 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
          ? isLight
            ? "bg-sand/80 backdrop-blur-xl border-charcoal/5 py-3"
            : "bg-[#0a0a0a]/80 backdrop-blur-xl border-white/10 py-3"
          : "bg-transparent border-transparent py-6"
          }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-20 flex items-center justify-between gap-3">
          {/* LEFT: LOGO */}
          <div className="flex-shrink min-w-0 -ml-1 md:-ml-2">
            <MagneticButton strength={0.2}>
              <button
                type="button"
                onClick={handleLogoClick}
                aria-label="Go to homepage"
                className="flex items-end gap-3 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm"
              >
                <div className={`w-2 h-2 rounded-full mb-1 ${isLight ? "bg-clay" : "bg-primary"} group-hover:shadow-[0_0_10px_var(--primary)] transition-shadow duration-300`} />
                <span className={`font-display text-[clamp(0.82rem,1.25vw,1.15rem)] tracking-[0.05em] leading-none text-left whitespace-nowrap ${isLight ? "text-charcoal group-hover:text-clay" : "text-foreground group-hover:text-primary"} transition-colors`}>
                  MONOLITH PROJECT
                </span>
              </button>
            </MagneticButton>
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-5 2xl:gap-8">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    className={`flex items-center gap-1 text-[11px] font-bold tracking-[0.16em] uppercase transition-all duration-300 ${isLight
                      ? `hover:text-clay text-stone`
                      : `hover:text-primary hover:drop-shadow-[0_0_8px_rgba(212,165,116,0.6)] ${[item.href, ...item.children.map(c => c.href)].includes(location) ? "text-primary drop-shadow-[0_0_8px_rgba(212,165,116,0.5)]" : "text-white/90"}`
                      }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full mt-3 left-0 min-w-[180px] py-2 border backdrop-blur-md ${isLight
                          ? "bg-sand/95 border-charcoal/10"
                          : "bg-[#0a0a0a]/95 border-white/10"
                          }`}
                      >
                        {item.children.map((child) => (
                          <Link key={child.label} href={child.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`block px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-colors ${isLight
                              ? `hover:text-clay hover:bg-charcoal/5 ${location === child.href ? "text-clay" : "text-stone"}`
                              : `hover:text-primary hover:bg-white/5 ${location === child.href ? "text-primary" : "text-white/80"}`
                              }`}
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
                <Link key={item.label} href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith("/#")) {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }
                  }}
                  className={`text-[11px] font-bold tracking-[0.16em] uppercase transition-all duration-300 ${isLight
                    ? `hover:text-clay ${location === item.href ? "text-clay" : "text-stone"}`
                    : `hover:text-primary hover:drop-shadow-[0_0_8px_rgba(212,165,116,0.6)] ${location === item.href ? "text-primary drop-shadow-[0_0_8px_rgba(212,165,116,0.5)]" : "text-white/90 hover:text-white"}`
                    }`}
                >
                  {item.label === "CHASING SUN(SETS)" ? (
                    <span className="inline-flex items-center gap-1.5 text-clay">
                      <span aria-hidden="true" className="text-[12px] leading-none">☀️</span>
                      <span>{item.label}</span>
                    </span>
                  ) : item.label === "UNTOLD STORY" ? (
                    <span className="inline-flex items-center gap-1.5 text-primary">
                      <UntoldButterflyLogo className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              )
            )}
          </div>

          {/* RIGHT: CTA & MOBILE TOGGLE */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
            <div>
              <MagneticButton strength={0.2}>
                <a href={POSH_TICKET_URL} target="_blank" rel="noopener noreferrer">
                  <div className={`hidden md:flex btn-pill-coral items-center gap-2 px-4 xl:px-5 py-2 ${isLight
                    ? "!bg-charcoal !border-charcoal !text-sand hover:!bg-charcoal/90 !shadow-none"
                    : "shadow-[0_0_18px_rgba(224,90,58,0.35)]"
                    }`}>
                    <Ticket className="w-3.5 h-3.5" />
                    <span className="font-bold text-[11px] tracking-[0.14em] uppercase">Tickets</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </div>
                </a>
              </MagneticButton>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden">
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation menu"
                  className={`p-2 ${isLight ? "text-charcoal hover:text-clay" : "text-foreground hover:text-primary"} transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70`}
                >
                  <Menu size={24} />
                </button>
              </MagneticButton>
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
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <div className="absolute top-6 right-6">
              <MagneticButton>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2 text-foreground/50 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <X size={32} />
                </button>
              </MagneticButton>
            </div>

            <div className="flex flex-col items-center gap-8 relative z-10 w-full px-8">
              {mobileNavItems.filter(i => i.label !== "TICKETS").map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    href={item.href.startsWith("/#") ? "/" : item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.href.startsWith("/#")) {
                        handleNavClick(item.href);
                      }
                    }}
                    className={`font-display text-3xl md:text-5xl tracking-widest uppercase hover:text-white transition-colors cursor-pointer ${location === item.href ? "text-white" : "text-muted-foreground"}`}
                  >
                    {item.label === "CHASING SUN(SETS)" ? (
                      <span className="inline-flex items-center gap-3 text-clay">
                        <span aria-hidden="true" className="text-2xl md:text-3xl leading-none">☀️</span>
                        <span>{item.label}</span>
                      </span>
                    ) : item.label === "UNTOLD STORY" ? (
                      <span className="inline-flex items-center gap-3 text-primary">
                        <UntoldButterflyLogo className="w-6 h-6 md:w-8 md:h-8" />
                        <span>{item.label}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* Emphasized ticket CTA */}
              <motion.a
                href={POSH_TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + mobileNavItems.length * 0.1 }}
                className="mt-4 px-10 py-4 border border-white/25 rounded-full text-white font-display text-2xl tracking-widest uppercase flex items-center gap-3 hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                GET TICKETS
                <ArrowUpRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
