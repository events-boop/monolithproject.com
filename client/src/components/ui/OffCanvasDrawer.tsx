import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import { Link } from "wouter";
import { DrawerType, useUI } from "../../contexts/UIContext";
import MagneticButton from "../MagneticButton";

const FAQSection = lazy(() => import("../FAQSection"));
const NewsletterSection = lazy(() => import("../NewsletterSection"));
const ConnectSection = lazy(() => import("../ConnectSection"));
const ExperienceGuidePanel = lazy(() => import("../ExperienceGuidePanel"));
const AboutSection = lazy(() => import("../AboutSection"));
const ArchiveSection = lazy(() => import("../ArchiveSection"));

const drawerMeta: Record<
    Exclude<DrawerType, null>,
    { eyebrow: string; title: string; description: string; href: string; hrefLabel: string }
> = {
    faq: {
        eyebrow: "Answers",
        title: "Frequently Asked Questions",
        description: "Fast clarity on entry, tickets, tables, and what to expect inside the room.",
        href: "/faq",
        hrefLabel: "Full FAQ",
    },
    newsletter: {
        eyebrow: "Newsletter",
        title: "Get Updates",
        description: "Early ticket windows, lineup drops, and radio episodes before the public post.",
        href: "/newsletter",
        hrefLabel: "Open Newsletter Page",
    },
    contact: {
        eyebrow: "Connect",
        title: "Work With The Monolith",
        description: "Artists, crew, venue partners, and aligned brands all funnel through one contact surface.",
        href: "/contact",
        hrefLabel: "Contact Page",
    },
    guide: {
        eyebrow: "Night Guide",
        title: "Arrival Intelligence",
        description: "Everything the room needs before doors: timing, entry rhythm, venue notes, and maps.",
        href: "/guide",
        hrefLabel: "Full Guide",
    },
    about: {
        eyebrow: "The Standard",
        title: "About The Project",
        description: "Four parts. One project. We build rooms worth returning to.",
        href: "/about",
        hrefLabel: "View Full Vision",
    },
    archive: {
        eyebrow: "The Record",
        title: "Event Archive",
        description: "Every season, every event, every gallery. The full history of Monolith Project events.",
        href: "/archive",
        hrefLabel: "View Full Archive",
    },
};

function DrawerContent({ type }: { type: Exclude<DrawerType, null> }) {
    switch (type) {
        case "faq":
            return <FAQSection />;
        case "newsletter":
            return <NewsletterSection />;
        case "contact":
            return <ConnectSection compact />;
        case "guide":
            return <ExperienceGuidePanel />;
        case "about":
            return <AboutSection />;
        case "archive":
            return <ArchiveSection />;
        default:
            return null;
    }
}

export default function OffCanvasDrawer() {
    const { activeDrawer, closeDrawer } = useUI();
    const meta = activeDrawer ? drawerMeta[activeDrawer] : null;

    return (
        <Dialog.Root open={Boolean(activeDrawer)} onOpenChange={(open) => !open && closeDrawer()}>
            <AnimatePresence>
                {activeDrawer && meta ? (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="fixed inset-0 z-[120] bg-black/58 backdrop-blur-[6px]"
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                            <motion.div
                                initial={{ x: 48, opacity: 0 }}
                                animate={{ x: 0 }}
                                exit={{ x: 48, opacity: 0 }}
                                transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.8 }}
                                className="fixed inset-x-0 bottom-0 z-[130] flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.42)] md:bottom-4 md:left-auto md:right-4 md:top-[calc(var(--shell-nav-offset)+0.5rem)] md:max-h-none md:w-[min(42rem,calc(100vw-2rem))] md:rounded-[2rem]"
                                style={{
                                    background:
                                        "linear-gradient(160deg, rgba(16,16,18,0.96), rgba(8,8,10,0.99))",
                                }}
                            >
                                <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none mix-blend-overlay" />

                                <div className="sticky top-0 z-20 border-b border-white/8 bg-black/28 px-6 py-5 backdrop-blur-2xl md:px-8">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="max-w-xl">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-primary/75">
                                                {meta.eyebrow}
                                            </p>
                                            <Dialog.Title className="mt-3 font-display text-3xl uppercase leading-[0.9] text-white md:text-[2.4rem]">
                                                {meta.title}
                                            </Dialog.Title>
                                            <Dialog.Description className="mt-3 max-w-lg text-sm leading-relaxed text-white/56">
                                                {meta.description}
                                            </Dialog.Description>
                                        </div>

                                        <MagneticButton>
                                            <Dialog.Close asChild>
                                                <button
                                                    aria-label="Close drawer"
                                                    className="rounded-full border border-white/10 bg-white/5 p-3 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </Dialog.Close>
                                        </MagneticButton>
                                    </div>

                                    <div className="mt-5">
                                        <Link
                                            href={meta.href}
                                            onClick={() => closeDrawer()}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/78 transition-colors hover:border-white/20 hover:text-white"
                                        >
                                            {meta.hrefLabel}
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="relative z-10 flex-1 overflow-y-auto">
                                    <Suspense
                                        fallback={
                                            <div className="p-12 text-white/40 font-mono text-sm tracking-widest uppercase">
                                                Loading interface...
                                            </div>
                                        }
                                    >
                                        <DrawerContent type={activeDrawer} />
                                    </Suspense>
                                </div>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                ) : null}
            </AnimatePresence>
        </Dialog.Root>
    );
}
