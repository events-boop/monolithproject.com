import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronDown, ArrowUpRight, Play, Ticket } from "lucide-react";

export interface MegamenuProps {
    label: React.ReactNode;
    href: string;
    isActive: boolean;
    isLight: boolean;
    brand: string;
    megamenu: {
        items: { label: string; href: string }[];
        feature: {
            title: string;
            subtitle?: string;
            image: string;
            href: string;
            ctaText: string;
            icon?: "play" | "ticket";
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
    megamenu,
    onNavigate,
}: MegamenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const openMenu = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const closeMenu = () => {
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

    return (
        <div
            className="relative flex justify-center items-center shrink-0 flex-1 min-w-max h-full cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocusCapture={openMenu}
            onBlurCapture={(e) => {
                const nextTarget = e.relatedTarget as Node | null;
                if (!nextTarget || !e.currentTarget.contains(nextTarget)) {
                    setIsOpen(false);
                }
            }}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    setIsOpen(false);
                }
            }}
        >
            <Link
                href={href}
                onClick={(e) => {
                    e.preventDefault();
                    onNavigate(href);
                }}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className={`group shrink-0 flex items-center gap-1.5 text-[10px] lg:text-[11px] xl:text-[12px] font-[800] tracking-[0.1em] lg:tracking-[0.12em] xl:tracking-[0.16em] uppercase transition-all duration-300 py-4 ${isLight
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
            </Link>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute top-[36px] -left-1/2 -ml-24 xl:-left-12 2xl:-left-24 w-[560px] p-2 rounded-3xl border shadow-[0_18px_40px_rgba(0,0,0,0.45)] ${isLight
                            ? "bg-white/98 border-black/5"
                            : "bg-[#0a0a0a]/98 border-white/10"
                            }`}
                        role="menu"
                        style={{ pointerEvents: isOpen ? "auto" : "none" }}
                    >
                        <div className="flex bg-transparent rounded-2xl overflow-hidden min-h-[240px]">
                            {/* Left Column: Links */}
                            <div className="w-5/12 p-6 flex flex-col gap-5">
                                <span
                                    className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isLight ? "text-black/40" : "text-white/40"}`}
                                >
                                    Explore
                                </span>
                                <ul className="flex flex-col gap-4">
                                    {megamenu.items.map((item, i) => (
                                        <li key={i}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsOpen(false);
                                                    onNavigate(item.href);
                                                }}
                                                role="menuitem"
                                                className={`text-sm font-medium tracking-wider transition-colors hover:-translate-y-0.5 inline-block duration-200 ${isLight
                                                    ? "text-charcoal hover:text-clay"
                                                    : "text-white/80 hover:text-white"
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Column: Featured Card */}
                            <div className="w-7/12 p-2">
                                <div
                                    className={`relative h-full rounded-xl overflow-hidden group/card cursor-pointer shadow-none transition-shadow hover:shadow-[0_0_20px_rgba(212,165,116,0.15)] ${megamenu.feature.icon === "ticket" ? "border border-primary/30" : ""}`}
                                >
                                    <img
                                        src={megamenu.feature.image}
                                        alt={megamenu.feature.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                                    {megamenu.feature.badge && (
                                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/72 border border-white/20 flex items-center gap-1.5 shadow-lg">
                                            <span className="text-[9px] font-bold tracking-widest text-white uppercase mt-0.5">
                                                {megamenu.feature.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-start gap-4">
                                        <div>
                                            {megamenu.feature.subtitle && (
                                                <p className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-1 drop-shadow-md">
                                                    {megamenu.feature.subtitle}
                                                </p>
                                            )}
                                            <h4 className="text-white text-lg lg:text-xl font-display font-bold leading-tight drop-shadow-md">
                                                {megamenu.feature.title}
                                            </h4>
                                        </div>

                                        {megamenu.feature.external ? (
                                            <a
                                                href={megamenu.feature.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setIsOpen(false)}
                                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${megamenu.feature.icon === "ticket" ? "bg-primary text-black hover:bg-white hover:scale-105" : "bg-white/12 hover:bg-white/20 border border-white/20 text-white"}`}
                                            >
                                                <FeatureIcon className="w-4 h-4" />
                                                <span className="text-xs font-bold tracking-wider uppercase mt-0.5">
                                                    {megamenu.feature.ctaText}
                                                </span>
                                            </a>
                                        ) : (
                                            <Link
                                                href={megamenu.feature.href}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsOpen(false);
                                                    onNavigate(megamenu.feature.href);
                                                }}
                                                role="menuitem"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/12 hover:bg-white/20 border border-white/20 transition-all duration-300 text-white hover:scale-105"
                                            >
                                                <FeatureIcon className="w-4 h-4" />
                                                <span className="text-xs font-bold tracking-wider uppercase mt-0.5">
                                                    {megamenu.feature.ctaText}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
