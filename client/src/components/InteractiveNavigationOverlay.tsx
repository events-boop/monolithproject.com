import {
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Disc3,
  MapPinned,
  Radio,
  Sparkles,
  Sun,
  Ticket,
  UsersRound,
  X,
} from "lucide-react";
import { navigationChapters, type NavigationChapter, type NavigationChapterId } from "@/data/navigationChapters";
import { getEventDetailsHref } from "@/lib/cta";
import {
  getEventVenueLabel,
  getExperienceEvent,
  getPrimaryTicketUrl,
  getSeriesEvents,
  getUpcomingEvents,
} from "@/lib/siteExperience";
import { INSTAGRAM_MONOLITH, LAYLO_URL, SOUNDCLOUD_URL } from "@/data/events";
import { cn } from "@/lib/utils";
import { signalChirp } from "@/lib/SignalChirpEngine";
import MagneticButton from "./MagneticButton";
import ResponsiveImage from "./ResponsiveImage";

interface InteractiveNavigationOverlayProps {
  activePath: string;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;
  id: string;
  onClose: () => void;
  onNavigate: (href: string) => void;
  ticketHref?: string | null;
}

interface ChapterView extends NavigationChapter {
  meta: string[];
  primaryHref: string;
  primaryLabel: string;
  previewTitle: string;
  status: string;
}

const utilityLinks = [
  { label: "Tickets", href: "/tickets" },
  { label: "Instagram", href: INSTAGRAM_MONOLITH },
  { label: "Text Alerts", href: LAYLO_URL },
  { label: "SoundCloud", href: SOUNDCLOUD_URL },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

const chapterIconMap: Record<NavigationChapterId, typeof Sparkles> = {
  "next-night": Ticket,
  schedule: CalendarDays,
  "chasing-sunsets": Sun,
  "untold-story": Sparkles,
  artists: UsersRound,
  radio: Radio,
  guide: MapPinned,
};

function getChapterIdForPath(path: string): NavigationChapterId {
  if (path === "/schedule" || path.startsWith("/events/")) return "schedule";
  if (path.startsWith("/chasing-sunsets")) return "chasing-sunsets";
  if (path === "/story" || path.startsWith("/untold-story")) return "untold-story";
  if (path === "/lineup" || path.startsWith("/artists/")) return "artists";
  if (path.startsWith("/radio")) return "radio";
  if (path === "/guide" || path === "/faq" || path === "/travel" || path === "/vip") return "guide";
  if (path === "/tickets") return "next-night";
  return "next-night";
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "on-sale":
      return "On Sale";
    case "coming-soon":
      return "Coming Soon";
    case "sold-out":
      return "Sold Out";
    default:
      return "Live Signal";
  }
}

function compactMeta(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value));
}

function resolveChapterView(chapter: NavigationChapter, ticketHref?: string | null): ChapterView {
  const ticketEvent = getExperienceEvent("ticket");

  if (chapter.id === "next-night") {
    const primaryHref = ticketHref || getPrimaryTicketUrl(ticketEvent) || getEventDetailsHref(ticketEvent);
    return {
      ...chapter,
      image: ticketEvent?.image || chapter.image,
      meta: compactMeta([
        ticketEvent?.date,
        ticketEvent ? getEventVenueLabel(ticketEvent) : null,
        ticketEvent?.lineup,
      ]),
      primaryHref,
      primaryLabel: ticketHref || getPrimaryTicketUrl(ticketEvent) ? "Get In" : "See The Night",
      previewTitle: ticketEvent?.headline || ticketEvent?.title || chapter.label,
      proof: ticketEvent?.capacity || chapter.proof,
      status: getStatusLabel(ticketEvent?.status),
    };
  }

  if (chapter.id === "schedule") {
    const events = getUpcomingEvents(3);
    return {
      ...chapter,
      meta: events.map((event) => `${event.date} / ${event.title}`),
      primaryHref: chapter.href,
      primaryLabel: chapter.ctaLabel,
      previewTitle: "Season Map",
      status: `${events.length || 0} Upcoming`,
    };
  }

  if (chapter.id === "chasing-sunsets") {
    const event = getSeriesEvents("chasing-sunsets")[0];
    return {
      ...chapter,
      image: event?.image || chapter.image,
      meta: compactMeta([event?.episode, event?.date, event?.lineup]),
      primaryHref: chapter.href,
      primaryLabel: chapter.ctaLabel,
      previewTitle: event?.headline || event?.title || chapter.label,
      status: event ? getStatusLabel(event.status) : "Open-Air Series",
    };
  }

  if (chapter.id === "untold-story") {
    const event = getSeriesEvents("untold-story")[0];
    return {
      ...chapter,
      image: event?.image || chapter.image,
      meta: compactMeta([event?.episode, event?.date, event?.lineup]),
      primaryHref: chapter.href,
      primaryLabel: chapter.ctaLabel,
      previewTitle: event?.headline || event?.title || chapter.label,
      status: event ? getStatusLabel(event.status) : "After-Dark Series",
    };
  }

  if (chapter.id === "guide") {
    const guideEvent = getExperienceEvent("guide");
    return {
      ...chapter,
      meta: compactMeta([
        guideEvent?.date,
        guideEvent ? getEventVenueLabel(guideEvent) : null,
        guideEvent?.doors ? `Doors ${guideEvent.doors}` : null,
      ]),
      primaryHref: chapter.href,
      primaryLabel: chapter.ctaLabel,
      previewTitle: "The Night Of",
      status: "Entry Ready",
    };
  }

  return {
    ...chapter,
    meta: [],
    primaryHref: chapter.href,
    primaryLabel: chapter.ctaLabel,
    previewTitle: chapter.label,
    status: chapter.eyebrow,
  };
}

export default function InteractiveNavigationOverlay({
  activePath,
  closeButtonRef,
  dialogRef,
  id,
  onClose,
  onNavigate,
  ticketHref,
}: InteractiveNavigationOverlayProps) {
  const reduceMotion = useReducedMotion();
  const [activeChapterId, setActiveChapterId] = useState<NavigationChapterId>(() => getChapterIdForPath(activePath));
  const [expandedChapterId, setExpandedChapterId] = useState<NavigationChapterId | null>(() => getChapterIdForPath(activePath));

  useEffect(() => {
    const nextId = getChapterIdForPath(activePath);
    setActiveChapterId(nextId);
    setExpandedChapterId(nextId);
  }, [activePath]);

  const activeChapter =
    navigationChapters.find((chapter) => chapter.id === activeChapterId) ?? navigationChapters[0];
  const activeView = resolveChapterView(activeChapter, ticketHref);
  const accentStyle = { "--chapter-accent": activeView.accent } as CSSProperties;

  const handleDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
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
  };

  const handleLinkClick = (href: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    signalChirp.click();
    onClose();

    if (!isExternalHref(href)) {
      event.preventDefault();
      onNavigate(href);
    }
  };

  const renderPreview = (view: ChapterView) => {
    const PrimaryIcon = chapterIconMap[view.id] ?? Sparkles;

    return (
      <motion.article
        key={view.id}
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.99 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-[0_34px_90px_rgba(0,0,0,0.42)]"
        style={accentStyle}
      >
        <ResponsiveImage
          src={view.image}
          alt=""
          sizes="(min-width: 768px) 50vw, 100vw"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-68 transition-transform duration-700 ease-out"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,color-mix(in_srgb,var(--chapter-accent)_32%,transparent),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.24)),linear-gradient(0deg,rgba(0,0,0,0.92),transparent_58%)]" />
        <div className="absolute right-8 top-8 rounded-full border border-white/20 bg-black/45 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">
          {view.status}
        </div>

        <div className="relative z-10 flex h-full flex-col justify-end p-7 md:p-9">
          <div className="mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur-md">
            <PrimaryIcon className="h-3.5 w-3.5" style={{ color: view.accent }} />
            {view.eyebrow}
          </div>

          <div className="max-w-2xl">
            <p className="mb-4 max-w-xl font-mono text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: view.accent }}>
              {view.tagline}
            </p>
            <h2 className="font-display text-[clamp(2.5rem,4.8vw,5.8rem)] uppercase leading-[0.82] tracking-[-0.04em] text-white">
              {view.previewTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
              {view.description}
            </p>

            {view.meta.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {view.meta.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-black/36 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                {view.proof}
              </p>
              <a
                href={view.primaryHref}
                target={isExternalHref(view.primaryHref) ? "_blank" : undefined}
                rel={isExternalHref(view.primaryHref) ? "noopener noreferrer" : undefined}
                onClick={handleLinkClick(view.primaryHref)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {view.primaryLabel}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <motion.div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[10005] overflow-y-auto bg-[#030305] text-white backdrop-blur-2xl"
      onKeyDown={handleDialogKeyDown}
      style={{
        background:
          "radial-gradient(circle at 16% 12%, rgba(224,90,58,0.14), transparent 30%), radial-gradient(circle at 82% 20%, rgba(34,211,238,0.12), transparent 32%), linear-gradient(135deg, rgba(3,3,5,0.995), rgba(7,7,11,0.998) 45%, rgba(1,1,3,1))",
        paddingTop: "calc(var(--shell-nav-offset) + var(--shell-nav-height) + 0.75rem)",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[#030305]" />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 16% 12%, rgba(224,90,58,0.16), transparent 30%), radial-gradient(circle at 82% 20%, rgba(34,211,238,0.13), transparent 32%), linear-gradient(135deg, rgba(3,3,5,0.98), rgba(7,7,11,0.995) 45%, rgba(1,1,3,1))",
        }}
      />
      <div className="pointer-events-none fixed inset-0 bg-noise opacity-55" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-48 bg-gradient-to-b from-black/78 to-transparent" />

      <div className="fixed right-5 top-5 z-20 md:right-8 md:top-8">
        <MagneticButton>
          <button
            type="button"
            onClick={() => {
              signalChirp.click();
              onClose();
            }}
            aria-label="Close navigation menu"
            ref={closeButtonRef}
            data-cursor-text="CLOSE"
            className="rounded-full border border-white/10 bg-white/[0.06] p-3 text-white/60 backdrop-blur-md transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={24} />
          </button>
        </MagneticButton>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-var(--shell-nav-height)-3rem)] w-full max-w-[1800px] flex-col px-4 py-6 sm:px-6 lg:px-10">
        <header className="mb-6 flex flex-col gap-5 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Monolith Navigation System
            </p>
            <h1 className="mt-2 font-display text-[clamp(2rem,4.2vw,4.35rem)] uppercase leading-[0.82] tracking-[-0.04em] text-white">
              Choose Your Entry
            </h1>
          </div>
          <nav aria-label="Utility links" className="flex flex-wrap gap-2">
            {utilityLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick(link.href)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </header>

        <div className="hidden min-h-[30rem] flex-1 grid-cols-[minmax(18rem,0.68fr)_minmax(0,1.32fr)] gap-6 lg:grid 2xl:gap-8">
          <nav aria-label="Primary worlds" className="flex flex-col justify-center gap-1.5">
            {navigationChapters.map((chapter, index) => {
              const isActive = chapter.id === activeChapterId;
              const Icon = chapterIconMap[chapter.id] ?? Disc3;
              const view = resolveChapterView(chapter, ticketHref);

              return (
                <motion.a
                  key={chapter.id}
                  href={view.primaryHref}
                  initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + index * 0.045, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => {
                    setActiveChapterId(chapter.id);
                    signalChirp.hover();
                  }}
                  onFocus={() => setActiveChapterId(chapter.id)}
                  onClick={handleLinkClick(view.primaryHref)}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl border px-4 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    isActive
                      ? "border-white/20 bg-white/[0.08] shadow-[0_18px_45px_rgba(0,0,0,0.26)]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]",
                  )}
                  style={{ "--chapter-accent": chapter.accent } as CSSProperties}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-3 left-0 w-[3px] rounded-full transition-opacity duration-300",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                    )}
                    style={{ background: chapter.accent }}
                  />
                  <span className="flex items-center justify-between gap-4">
                    <span>
                      <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                        {String(index + 1).padStart(2, "0")} / {chapter.eyebrow}
                      </span>
                      <span className="block font-display text-[clamp(1.55rem,2.55vw,3.45rem)] uppercase leading-[0.8] tracking-[-0.04em] text-white">
                        {chapter.label}
                      </span>
                    </span>
                    <Icon className="h-5 w-5 shrink-0 opacity-45 transition-opacity group-hover:opacity-90" style={{ color: chapter.accent }} />
                  </span>
                </motion.a>
              );
            })}
          </nav>

          <div className="relative">
            <AnimatePresence mode="wait">{renderPreview(activeView)}</AnimatePresence>
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          {navigationChapters.map((chapter, index) => {
            const isExpanded = expandedChapterId === chapter.id;
            const view = resolveChapterView(chapter, ticketHref);
            const Icon = chapterIconMap[chapter.id] ?? Sparkles;

            return (
              <motion.div
                key={chapter.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + index * 0.04, duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]"
                style={{ "--chapter-accent": chapter.accent } as CSSProperties}
              >
                <button
                  type="button"
                  onClick={() => {
                    signalChirp.click();
                    setActiveChapterId(chapter.id);
                    setExpandedChapterId(isExpanded ? null : chapter.id);
                  }}
                  aria-expanded={isExpanded}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <span>
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
                      {String(index + 1).padStart(2, "0")} / {chapter.eyebrow}
                    </span>
                    <span className="font-display text-[clamp(2rem,9vw,3.6rem)] uppercase leading-[0.82] tracking-[-0.04em] text-white">
                      {chapter.label}
                    </span>
                  </span>
                  <Icon className="h-5 w-5 shrink-0" style={{ color: chapter.accent }} />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3">
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
                          <ResponsiveImage
                            src={view.image}
                            alt=""
                            sizes="100vw"
                            className="h-48 w-full object-cover opacity-72"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />
                          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                            {view.status}
                          </div>
                          <div className="relative z-10 p-4 pt-28">
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: view.accent }}>
                              {view.tagline}
                            </p>
                            <h2 className="mt-2 font-display text-3xl uppercase leading-[0.88] tracking-[-0.04em] text-white">
                              {view.previewTitle}
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-white/70">
                              {view.description}
                            </p>
                            <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                              {view.proof}
                            </p>
                            <div className="mt-4 flex flex-col gap-2">
                              <a
                                href={view.primaryHref}
                                target={isExternalHref(view.primaryHref) ? "_blank" : undefined}
                                rel={isExternalHref(view.primaryHref) ? "noopener noreferrer" : undefined}
                                onClick={handleLinkClick(view.primaryHref)}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-black"
                              >
                                {view.primaryLabel}
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                              <div className="grid grid-cols-2 gap-2">
                                {view.secondaryLinks.slice(0, 2).map((link) => (
                                  <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={handleLinkClick(link.href)}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-white/60"
                                  >
                                    {link.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
