import {
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Bookmark,
  Globe2,
  Radio,
  Search,
  Sparkles,
  Sun,
  Ticket,
  UsersRound,
  X,
} from "lucide-react";
import {
  HOUSE_OF_FRIENDS_SITE,
  SUNSETS_FM_SITE,
  navigationChapters,
  type NavigationChapter,
  type NavigationChapterId,
} from "@/data/navigationChapters";
import { getEventDetailsHref } from "@/lib/cta";
import {
  getEventVenueLabel,
  getExperienceEvent,
  getPrimaryTicketUrl,
  getSeriesExperienceEvent,
  getSeriesEvents,
} from "@/lib/siteExperience";
import { INSTAGRAM_MONOLITH, LAYLO_URL, SOUNDCLOUD_URL } from "@/data/events";
import { cn } from "@/lib/utils";
import { signalChirp } from "@/lib/SignalChirpEngine";
import MagneticButton from "./MagneticButton";
import { ROUTES } from "@shared/routes";
import { HOME_NEXT_CHAPTER } from "@shared/home-next-chapter";
import ResponsiveImage from "./ResponsiveImage";
import GlyphBackdrop from "./GlyphBackdrop";
import { useUI } from "@/contexts/UIContext";
import { useSavedPassport } from "@/lib/savedPassport";
import "@/styles/menu-overlay.css";

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
  { label: "Open Network", href: ROUTES.openNetwork },
  { label: "Tickets", href: "/tickets" },
  { label: "Plan Visit", href: "/guide" },
  { label: "Monolith", href: "/monolith" },
  { label: "Journal", href: "/insights" },
  { label: "Instagram", href: INSTAGRAM_MONOLITH },
  { label: "Text Alerts", href: LAYLO_URL },
  { label: "SoundCloud", href: SOUNDCLOUD_URL },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
];

const chapterIconMap: Record<NavigationChapterId, typeof Sparkles> = {
  schedule: Ticket,
  artists: UsersRound,
  "chasing-sunsets": Sun,
  "untold-story": Sparkles,
  radio: Radio,
  "sunsets-fm": Globe2,
  "house-of-friends": UsersRound,
};

function getChapterIdForPath(path: string): NavigationChapterId {
  if (
    path === "/schedule" ||
    path === "/events" ||
    path.startsWith("/events/") ||
    path === "/tickets"
  )
    return "schedule";
  if (path.startsWith("/sunsets-fm") || path.startsWith("/open-network"))
    return "sunsets-fm";
  if (path.startsWith("/chasing-sunsets") || path.startsWith("/sunsets"))
    return "chasing-sunsets";
  if (path === "/story" || path.startsWith("/untold-story"))
    return "untold-story";
  if (path === "/artists" || path === "/lineup" || path.startsWith("/artists/"))
    return "artists";
  if (path.startsWith(ROUTES.houseOfFriends)) return "house-of-friends";
  if (path.startsWith("/radio")) return "radio";
  return "schedule";
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("/go/");
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "on-sale":
      return "On Sale";
    case "coming-soon":
      return "First Access";
    case "sold-out":
      return "Sold Out";
    case "past":
      return "Archive";
    default:
      return "Upcoming";
  }
}

function compactMeta(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value));
}

function resolveChapterView(
  chapter: NavigationChapter,
  ticketHref?: string | null
): ChapterView {
  const ticketEvent = getExperienceEvent("ticket");

  // While a show is postponed the menu teases what is next instead of selling tickets, and keeps
  // the ticket-holder update one tap away (Erik, 2026-11-10: badge, not a postponed pop-up).
  if (
    chapter.id === "schedule" &&
    ticketEvent?.eventStatus === "EventPostponed"
  ) {
    return {
      ...chapter,
      eyebrow: "Dates + updates",
      tagline: "New show updates incoming.",
      description:
        "September 19 was rained out. Its new date, and what is coming in 2027, will be announced here first.",
      proof: "Ticket-holders: see the update.",
      image: ticketEvent.image || chapter.image,
      meta: compactMeta([
        ticketEvent.date ? `Original date: ${ticketEvent.date}` : null,
        getEventVenueLabel(ticketEvent),
        ticketEvent.lineup,
      ]),
      primaryHref: getEventDetailsHref(ticketEvent),
      primaryLabel: "Ticket-holder update",
      previewTitle: ticketEvent.headline || ticketEvent.title || chapter.label,
      status: "Postponed",
    };
  }

  if (chapter.id === "schedule") {
    const primaryHref =
      ticketHref ||
      getPrimaryTicketUrl(ticketEvent) ||
      getEventDetailsHref(ticketEvent);
    return {
      ...chapter,
      image: ticketEvent?.image || chapter.image,
      meta: compactMeta([
        ticketEvent?.date,
        ticketEvent ? getEventVenueLabel(ticketEvent) : null,
        ticketEvent?.lineup,
      ]),
      primaryHref,
      primaryLabel:
        ticketHref || getPrimaryTicketUrl(ticketEvent)
          ? "Get tickets"
          : "Event details",
      previewTitle:
        ticketEvent?.headline || ticketEvent?.title || chapter.label,
      proof: ticketEvent?.capacity || chapter.proof,
      status: getStatusLabel(ticketEvent?.status),
    };
  }

  if (chapter.id === "chasing-sunsets") {
    const event =
      getSeriesExperienceEvent("chasing-sunsets", "hero") ||
      getSeriesEvents("chasing-sunsets")[0];
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
    const event =
      getSeriesExperienceEvent("untold-story", "hero") ||
      getSeriesEvents("untold-story")[0];
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
  const [activeChapterId, setActiveChapterId] = useState<NavigationChapterId>(
    () => getChapterIdForPath(activePath)
  );
  const [expandedChapterId, setExpandedChapterId] =
    useState<NavigationChapterId | null>(() => getChapterIdForPath(activePath));

  useEffect(() => {
    const nextId = getChapterIdForPath(activePath);
    setActiveChapterId(nextId);
    setExpandedChapterId(nextId);
  }, [activePath]);

  const activeChapter =
    navigationChapters.find(chapter => chapter.id === activeChapterId) ??
    navigationChapters[0];
  const activeView = resolveChapterView(activeChapter, ticketHref);
  const { openCommandPalette, openDrawer } = useUI();
  const savedPassport = useSavedPassport();
  const accentStyle = {
    "--chapter-accent": activeView.accent,
  } as CSSProperties;

  const handleDialogKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(
      el =>
        el.offsetParent !== null && el.getAttribute("aria-hidden") !== "true"
    );

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

  const handleLinkClick =
    (href: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
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
        className="lg-menu-preview"
        style={accentStyle}
      >
        <div className="lg-menu-preview-copy">
          <div>
            <div className="lg-menu-status">
              <PrimaryIcon
                className="h-3.5 w-3.5"
                style={{ color: view.accent }}
              />
              {view.eyebrow}
            </div>
            <p
              className="lg-menu-preview-tagline"
              style={{ color: view.accent }}
            >
              {view.tagline}
            </p>
            <h2 className="lg-menu-preview-title">{view.previewTitle}</h2>
            <p className="lg-menu-preview-body">{view.description}</p>
            {view.meta.length > 0 && (
              <div className="lg-menu-preview-meta">
                {view.meta.slice(0, 3).map(item => (
                  <span key={item} className="lg-menu-chip">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="lg-menu-preview-footer">
            <div className="flex min-w-0 flex-col gap-3">
              {view.id === "sunsets-fm" ? (
                <a
                  href={SUNSETS_FM_SITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick(SUNSETS_FM_SITE)}
                  className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold text-[#f3b572] underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2"
                >
                  Visit sunsets.fm
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <p className="lg-menu-proof">{view.proof}</p>
              )}
              {view.secondaryLinks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {view.secondaryLinks.slice(0, 2).map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={isExternalHref(link.href) ? "_blank" : undefined}
                      rel={
                        isExternalHref(link.href)
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={handleLinkClick(link.href)}
                      className="lg-pill-glass !min-h-[36px] !px-3.5 !py-1.5"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a
              href={view.primaryHref}
              target={isExternalHref(view.primaryHref) ? "_blank" : undefined}
              rel={
                isExternalHref(view.primaryHref)
                  ? "noopener noreferrer"
                  : undefined
              }
              onClick={handleLinkClick(view.primaryHref)}
              className="lg-btn-amber shrink-0"
            >
              <span>{view.primaryLabel}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="lg-menu-preview-media">
          <ResponsiveImage
            src={view.image}
            alt={view.previewTitle}
            sizes="(min-width: 1100px) 28vw, 50vw"
            loading="lazy"
            style={{ objectPosition: "50% 0%" }}
            className="h-full w-full object-cover object-top origin-top"
            decoding="async"
          />
          <span className="absolute right-4 top-4 z-10 rounded-full border border-[rgba(255,228,194,0.22)] bg-black/55 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#f8efe2] backdrop-blur-md">
            {view.status}
          </span>
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
      className="lg-menu-overlay fixed inset-0 z-[10005] overflow-y-auto bg-[#070608] text-[#fbf6ee] backdrop-blur-2xl"
      onKeyDown={handleDialogKeyDown}
      style={{
        paddingTop:
          "calc(var(--shell-nav-offset) + var(--shell-nav-height) + 0.75rem)",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <GlyphBackdrop surface="menu" />

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
          className="lg-menu-close"
        >
          <X size={22} />
        </button>
      </MagneticButton>

      <div className="lg-menu-stage">
        <header className="lg-menu-header">
          <div>
            <p className="lg-menu-kicker">Explore Monolith</p>
            <h1 className="lg-menu-title">Shows, radio & the network</h1>
          </div>
          <div className="lg-menu-header-actions">
            <button
              type="button"
              onClick={() => {
                onClose();
                openCommandPalette();
              }}
              className="lg-pill-glass hidden md:inline-flex"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                openDrawer("saved");
              }}
              className="lg-pill-glass hidden md:inline-flex"
            >
              <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Saved ({savedPassport.total})</span>
            </button>
            <Link
              href={HOME_NEXT_CHAPTER.signupHref}
              onClick={onClose}
              data-first-access="true"
              className="lg-btn-amber"
            >
              <span>{HOME_NEXT_CHAPTER.year} · Get First Access</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </header>
        <nav aria-label="Main pages" className="lg-menu-mobile-quick">
          <button
            type="button"
            onClick={() => {
              onClose();
              openCommandPalette();
            }}
            className="lg-pill-glass !min-h-[38px] !px-3.5 !py-1.5"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              openDrawer("saved");
            }}
            className="lg-pill-glass !min-h-[38px] !px-3.5 !py-1.5"
          >
            <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Saved ({savedPassport.total})</span>
          </button>
          {[
            { label: "Events / Tickets", href: "/schedule" },
            { label: "Sun(Sets)", href: "/sunsets" },
            { label: "Untold Story", href: "/untold-story" },
            { label: "Chasing Sunsets Radio", href: "/radio" },
            { label: "SUNSETS.FM", href: ROUTES.sunsetsFM },
            { label: "House of Friends", href: HOUSE_OF_FRIENDS_SITE },
            { label: "Open Network", href: ROUTES.openNetwork },
            { label: "About", href: "/about" },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              target={isExternalHref(link.href) ? "_blank" : undefined}
              rel={
                isExternalHref(link.href) ? "noopener noreferrer" : undefined
              }
              onClick={handleLinkClick(link.href)}
              className="lg-pill-glass !min-h-[38px] !px-3.5 !py-1.5"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="lg-menu-desktop">
          <nav aria-label="Primary worlds" className="lg-menu-chapters">
            {navigationChapters.map((chapter, index) => {
              const isActive = chapter.id === activeChapterId;
              const Icon = chapterIconMap[chapter.id] ?? Sparkles;
              const view = resolveChapterView(chapter, ticketHref);

              return (
                <motion.a
                  key={chapter.id}
                  href={view.primaryHref}
                  target={
                    isExternalHref(view.primaryHref) ? "_blank" : undefined
                  }
                  rel={
                    isExternalHref(view.primaryHref)
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.08 + index * 0.045,
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => {
                    setActiveChapterId(chapter.id);
                    signalChirp.hover();
                  }}
                  onFocus={() => setActiveChapterId(chapter.id)}
                  onClick={handleLinkClick(view.primaryHref)}
                  className={cn("lg-menu-chapter", isActive && "is-active")}
                  style={
                    { "--chapter-accent": chapter.accent } as CSSProperties
                  }
                >
                  <span className="lg-menu-chapter-row">
                    <span>
                      <span className="lg-menu-chapter-meta">
                        {String(index + 1).padStart(2, "0")} / {chapter.eyebrow}
                      </span>
                      <span className="lg-menu-chapter-label">
                        {chapter.label}
                      </span>
                    </span>
                    <Icon
                      className="h-5 w-5 shrink-0 opacity-55 transition-opacity group-hover:opacity-95"
                      style={{ color: chapter.accent }}
                    />
                  </span>
                </motion.a>
              );
            })}
          </nav>

          <div className="relative min-h-0">
            <AnimatePresence mode="wait">
              {renderPreview(activeView)}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg-menu-mobile">
          {navigationChapters.map((chapter, index) => {
            const isExpanded = expandedChapterId === chapter.id;
            const view = resolveChapterView(chapter, ticketHref);
            const Icon = chapterIconMap[chapter.id] ?? Sparkles;

            return (
              <motion.div
                key={chapter.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.06 + index * 0.04,
                  duration: 0.34,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "lg-menu-mobile-chapter",
                  isExpanded && "is-expanded"
                )}
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
                  className="lg-menu-mobile-trigger"
                >
                  <span>
                    <span className="lg-menu-mobile-meta">
                      {String(index + 1).padStart(2, "0")} / {chapter.eyebrow}
                    </span>
                    <span className="lg-menu-mobile-label">
                      {chapter.label}
                    </span>
                  </span>
                  <Icon
                    className="h-5 w-5 shrink-0 opacity-70"
                    style={{ color: chapter.accent }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reduceMotion ? undefined : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="lg-menu-mobile-panel">
                        <div className="lg-menu-mobile-media">
                          <ResponsiveImage
                            src={view.image}
                            alt={view.label}
                            sizes="100vw"
                            style={{ objectPosition: "50% 0%" }}
                            className="object-cover object-top origin-top"
                            loading="lazy"
                            decoding="async"
                          />
                          <span className="lg-menu-mobile-status">
                            {view.status}
                          </span>
                          <div className="lg-menu-mobile-copy">
                            <p className="lg-menu-mobile-tagline">
                              {view.tagline}
                            </p>
                            <h2 className="lg-menu-mobile-title">
                              {view.previewTitle}
                            </h2>
                            <p className="lg-menu-mobile-body">
                              {view.description}
                            </p>
                            <p className="lg-menu-mobile-proof">{view.proof}</p>
                            <div className="lg-menu-mobile-actions">
                              <a
                                href={view.primaryHref}
                                target={
                                  isExternalHref(view.primaryHref)
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  isExternalHref(view.primaryHref)
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                onClick={handleLinkClick(view.primaryHref)}
                                className="lg-btn-amber"
                              >
                                <span>{view.primaryLabel}</span>
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                              <div className="lg-menu-mobile-secondary">
                                {view.secondaryLinks.slice(0, 2).map(link => (
                                  <a
                                    key={link.href}
                                    href={link.href}
                                    target={
                                      isExternalHref(link.href)
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel={
                                      isExternalHref(link.href)
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    onClick={handleLinkClick(link.href)}
                                    className="lg-pill-glass !min-h-[42px] text-center"
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
        <nav aria-label="Utility links" className="lg-menu-utilities">
          {utilityLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick(link.href)}
              className="lg-menu-utility"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}
