import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Instagram, Music, Headphones, Mail, ArrowRight, MapPinned } from "lucide-react";
import { useLocation } from "wouter";
import {
    INSTAGRAM_MONOLITH,
    TIKTOK_URL,
    SOUNDCLOUD_URL,
    SPOTIFY_URL,
    LAYLO_URL
} from "@/data/events";
import { getDrawerTypeForHref, useUI } from "@/contexts/UIContext";

interface CommunityDropdownProps {
    isLight?: boolean;
    brand?: "monolith" | "chasing-sunsets" | "untold-story" | "radio";
}

const communityLinks = [
    {
        title: "Instagram",
        description: "Follow our latest news",
        href: INSTAGRAM_MONOLITH,
        icon: <Instagram className="w-5 h-5" />,
        color: "group-hover:text-pink-500",
    },
    {
        title: "TikTok",
        description: "Watch our moments",
        href: TIKTOK_URL,
        icon: <Music className="w-5 h-5" />,
        color: "group-hover:text-white",
    },
    {
        title: "SoundCloud",
        description: "Listen to the sets",
        href: SOUNDCLOUD_URL,
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.69 16.538v-8.483c.25.04.496.082.723.11v8.361c-..." />
                {/* We can use a simpler sound cloud icon or just generic headphones */}
            </svg>
        ),
        iconOverride: <Headphones className="w-5 h-5" />,
        color: "group-hover:text-[#ff7700]",
    },
    {
        title: "Spotify",
        description: "Our curated playlists",
        href: SPOTIFY_URL,
        iconOverride: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm5.454 17.3c-.22.364-.69.475-1.05.257-2.883-1.76-6.51-2.155-10.796-1.18-.42.096-.837-.17-.93-.59-.095-.42.17-.837.59-.93 4.673-1.063 8.71-.62 11.927 1.345.362.22.472.69.255 1.05zm1.536-3.44c-.28.45-.873.593-1.325.313-3.308-2.036-8.384-2.63-12.008-1.436-.51.17-1.057-.107-1.226-.618-.17-.51.107-1.055.618-1.225 4.14-1.37 9.773-.7 13.628 1.67.45.28.592.872.313 1.324zm.14-3.56c-3.953-2.347-10.468-2.564-14.25-.14-.582.37-1.332.2-1.704-.38-.372-.582-.202-1.332.38-1.704 4.38-2.8 11.616-2.54 16.155 1.15.536.435.618 1.192.183 1.728-.433.535-1.19.617-1.726.182z" />
            </svg>
        ),
        color: "group-hover:text-[#1DB954]",
    },
    {
        title: "Inner Circle",
        description: "Opt in for exclusivity",
        href: "/newsletter",
        iconOverride: <Mail className="w-5 h-5" />,
        color: "group-hover:text-primary",
    },
    {
        title: "Night Guide",
        description: "Entry, timing, and arrival notes",
        href: "/guide",
        iconOverride: <MapPinned className="w-5 h-5" />,
        color: "group-hover:text-clay",
    },
    {
        title: "Laylo Drops",
        description: "Text alerts & updates",
        href: LAYLO_URL,
        iconOverride: <ArrowRight className="w-5 h-5 pointer-events-none" />,
        color: "group-hover:text-purple-500",
    },
];

export default function CommunityDropdown({ isLight, brand }: CommunityDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [, setLocation] = useLocation();
    const { openDrawer } = useUI();
    const menuId = "community-menu";

    const getMenuItems = () =>
        Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []);

    const focusMenuItem = (index: number) => {
        const items = getMenuItems();
        if (items.length === 0) return;
        const nextIndex = ((index % items.length) + items.length) % items.length;
        items[nextIndex]?.focus();
    };

    const closeMenu = (restoreFocus = false) => {
        setIsOpen(false);
        if (!restoreFocus) return;
        window.setTimeout(() => triggerRef.current?.focus(), 0);
    };

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                closeMenu();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Escape closes any open menus.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            closeMenu(true);
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleLinkClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        const drawer = getDrawerTypeForHref(href);

        if (drawer) {
            e.preventDefault();
            openDrawer(drawer);
        } else if (href.startsWith("/")) {
            e.preventDefault();
            setLocation(href);
        }

        closeMenu();
    };

    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
            window.setTimeout(() => focusMenuItem(0), 0);
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setIsOpen(true);
            window.setTimeout(() => focusMenuItem(-1), 0);
        }
    };

    const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const items = getMenuItems();
        if (items.length === 0) return;

        const activeIndex = items.findIndex((item) => item === document.activeElement);

        if (e.key === "ArrowDown") {
            e.preventDefault();
            focusMenuItem(activeIndex + 1);
            return;
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            focusMenuItem(activeIndex <= 0 ? items.length - 1 : activeIndex - 1);
            return;
        }

        if (e.key === "Home") {
            e.preventDefault();
            focusMenuItem(0);
            return;
        }

        if (e.key === "End") {
            e.preventDefault();
            focusMenuItem(items.length - 1);
            return;
        }

        if (e.key === "Tab") {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                onKeyDown={handleTriggerKeyDown}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls={menuId}
                className={`flex items-center gap-1 text-[12px] font-bold tracking-[0.16em] uppercase transition-all duration-300 ${isLight
                    ? "hover:text-clay text-stone"
                    : brand === "chasing-sunsets"
                        ? "hover:text-white hover:drop-shadow-[0_0_10px_rgba(232,184,109,0.55)] text-white/90"
                        : "hover:text-primary hover:drop-shadow-[0_0_8px_rgba(212,165,116,0.6)] text-white/90"
                    }`}
            >
                COMMUNITY
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[340px] p-2 rounded-[20px] ${isLight
                            ? "bg-sand/98 border border-charcoal/10"
                            : "bg-[#0B0C0F]/98 border border-white/6"
                            }`}
                        id={menuId}
                        role="menu"
                        aria-label="Community links"
                        onKeyDown={handleMenuKeyDown}
                        style={{
                            boxShadow: "0 18px 40px rgba(0,0,0,0.45)"
                        }}
                    >
                        <div className="flex flex-col gap-1">
                            {communityLinks.map((link) => (
                                <a
                                    key={link.title}
                                    href={link.href}
                                    target={link.href.startsWith("/") ? "_self" : "_blank"}
                                    rel={link.href.startsWith("/") ? "" : "noopener noreferrer"}
                                    onClick={handleLinkClick(link.href)}
                                    role="menuitem"
                                    className={`group flex items-center gap-4 p-2.5 rounded-[14px] transition-all duration-300 ${isLight ? "hover:bg-charcoal/5" : "hover:bg-white/[0.04]"
                                        }`}
                                >
                                    {/* Icon Box */}
                                    <div
                                        className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-[10px] border transition-colors duration-300 ${isLight
                                            ? "bg-white border-charcoal/10 text-charcoal/60 group-hover:border-charcoal/20"
                                            : "bg-white/[0.03] border-white/[0.08] text-white/50 group-hover:border-white/[0.15]"
                                            } ${link.color}`}
                                    >
                                        {link.iconOverride || link.icon}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col">
                                        <span
                                            className={`text-[14px] font-semibold leading-tight tracking-wide ${isLight ? "text-charcoal" : "text-white/90 group-hover:text-white"
                                                } transition-colors`}
                                        >
                                            {link.title}
                                        </span>
                                        <span
                                            className={`text-[13px] ${isLight ? "text-stone" : "text-white/40 group-hover:text-white/60"
                                                } transition-colors`}
                                        >
                                            {link.description}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
