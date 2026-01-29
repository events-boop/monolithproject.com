/*
  DESIGN: S-Tier Premium - Unified Top Navigation Bar
  - Fixed top bar with glassmorphism
  - Left: Monolith Logo
  - Center: Minimal text links
  - Right: 'JOIN THE RITUAL' Gold Pill
*/

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Ticket } from "lucide-react";
import { Link, useLocation } from "wouter";
import MagneticButton from "./MagneticButton";
import RitualJoinModal from "./RitualJoinModal";
import { upcomingEvents } from "../data/events";

interface NavigationProps {
  activeSection?: string;
}

const navItems = [
  { label: "CHASING SUN(SETS)", href: "/chasing-sunsets" },
  { label: "UNTOLD STORY", href: "/story" },
  { label: "RADIO", href: "/radio" },
  { label: "TICKETS", href: "/tickets" },
  { label: "BOOKING", href: "/booking" },
];

export default function Navigation({ activeSection }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? "bg-black/40 backdrop-blur-xl border-white/5 py-3" : "bg-transparent border-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* LEFT: LOGO */}
          <div className="flex-shrink-0">
            <MagneticButton strength={0.2} onClick={handleLogoClick}>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-primary group-hover:shadow-[0_0_10px_#D4A574] transition-shadow duration-300" />
                <span className="font-display text-xl tracking-wide text-foreground group-hover:text-primary transition-colors">MONOLITH</span>
              </div>
            </MagneticButton>
          </div>

          <div className="hidden lg:flex items-center gap-8 xl:gap-12">


            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <a
                  className={`text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:text-primary ${location === item.href ? "text-primary shadow-[0_1px_0_0_#D4A574]" : "text-muted-foreground"
                    }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          {/* RIGHT: CTA & MOBILE TOGGLE */}
          <div className="flex items-center gap-6">
            {/* LIVE EVENT INDICATOR - Moved to Right */}
            {upcomingEvents.find(e => e.status === 'on-sale') && (() => {
              const liveEvent = upcomingEvents.find(e => e.status === 'on-sale')!;
              return (
                <Link href="/tickets">
                  <a className="hidden lg:flex items-center gap-2 group cursor-pointer">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-display text-xs tracking-widest text-emerald-500 group-hover:text-emerald-400 transition-colors uppercase">
                      LIVE: {liveEvent.title}
                    </span>
                  </a>
                </Link>
              );
            })()}

            <div>
              <MagneticButton strength={0.2} onClick={() => setIsJoinModalOpen(true)}>
                <div className="hidden md:flex relative overflow-hidden items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#D4A574] to-[#B38B5D] text-black rounded-full shadow-[0_0_20px_rgba(212,165,116,0.2)] border border-white/20 hover:border-white/40 hover:shadow-[0_0_30px_rgba(212,165,116,0.5)] transition-all duration-300 group cursor-pointer">
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  <Ticket className="w-3.5 h-3.5 fill-black/20" />
                  <span className="font-bold text-xs tracking-widest uppercase">Join the Ritual</span>
                </div>
              </MagneticButton>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden">
              <MagneticButton onClick={() => setMobileMenuOpen(true)}>
                <div className="p-2 text-foreground hover:text-primary transition-colors cursor-pointer">
                  <Menu size={24} />
                </div>
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.nav>

      <RitualJoinModal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} />

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
              <MagneticButton onClick={() => setMobileMenuOpen(false)}>
                <div className="p-2 text-foreground/50 hover:text-white transition-colors cursor-pointer">
                  <X size={32} />
                </div>
              </MagneticButton>
            </div>

            <div className="flex flex-col items-center gap-8 relative z-10 w-full px-8">
              {/* LIVE EVENT MOBILE */}
              {upcomingEvents.find(e => e.status === 'on-sale') && (() => {
                const liveEvent = upcomingEvents.find(e => e.status === 'on-sale')!;
                return (
                  <Link href="/tickets">
                    <motion.a
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-2xl md:text-5xl tracking-widest uppercase text-red-500 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-4"
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      {liveEvent.title}
                    </motion.a>
                  </Link>
                );
              })()}

              {navItems.map((item, index) => (
                <Link key={item.label} href={item.href}>
                  <motion.a
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className={`font-display text-3xl md:text-5xl tracking-widest uppercase hover:text-white transition-colors cursor-pointer ${location === item.href ? "text-white" : "text-muted-foreground"
                      }`}
                  >
                    {item.label}
                  </motion.a>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
