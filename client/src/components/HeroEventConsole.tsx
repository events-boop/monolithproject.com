import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";
import ChasingSunsetsLogo from "./ChasingSunsetsLogo";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { getPublicEvents } from "@/lib/siteData";
import { getScheduleDate, getScheduleVenue } from "@/lib/schedulePresentation";
import {
  getPublishedCatalogue,
  PUBLISHED_CTA_LABELS,
} from "@shared/events/publishedState";
import {
  currentSunsets,
  isCurrentSunsetsEvent,
  sunsetsShortDate,
} from "@shared/events/sunsets-current";
import { HOME_NEXT_CHAPTER } from "@shared/home-next-chapter";
import { ROUTES } from "@shared/routes";
import type { EventSeries } from "@shared/events/types";

interface ConsoleRecord {
  id: string;
  series: EventSeries;
  seriesSubtext: string;
  title: string;
  dateText: string;
  venueName: string;
  venueLocation: string;
  timeText: string;
  statusLabel: string;
  statusTone: "live" | "amber" | "muted";
  ctaLabel: string;
  ctaHref: string;
  ctaExternal: boolean;
  firstAccess: boolean;
}

interface HeroEventConsoleProps {
  heroInView: boolean;
  documentVisible: boolean;
  reducedMotion: boolean;
  pausedExternal?: boolean;
}

const CONSOLE_DWELL_MS = 18_000;
const CONSOLE_GLIDE_MS = 1_400;

function buildConsoleRecords(): ConsoleRecord[] {
  const catalogue = getPublishedCatalogue(getPublicEvents());
  const records: ConsoleRecord[] = [];

  for (const entry of catalogue.upcoming) {
    const { event, state } = entry;
    const isFinale = isCurrentSunsetsEvent(event);
    const title = isFinale
      ? currentSunsets.headliners.join(" × ")
      : event.headline || event.title;
    const dateInfo = getScheduleDate(event);
    const dateText = dateInfo.hasDay ? event.date : "Date to be announced";
    const venueName = getScheduleVenue(event);
    const venueLocation = event.location || "Chicago, IL";
    const timeText = /^(tba|reveal soon)$/i.test(event.time)
      ? "Hours to be announced"
      : event.time;

    const ctaHref =
      state.kind === "on-sale" ? state.ticketUrl : ROUTES.newsletter;
    const statusLabel =
      state.kind === "on-sale"
        ? "On Sale"
        : state.kind === "sold-out"
          ? state.badge
          : "Announcing Soon";
    const statusTone =
      state.kind === "on-sale"
        ? "live"
        : state.kind === "sold-out"
          ? "muted"
          : "amber";

    records.push({
      id: event.id,
      series: event.series,
      seriesSubtext: event.episode || "Upcoming chapter",
      title,
      dateText,
      venueName,
      venueLocation,
      timeText,
      statusLabel,
      statusTone,
      ctaLabel:
        state.cta !== null
          ? PUBLISHED_CTA_LABELS[state.cta]
          : PUBLISHED_CTA_LABELS["get-first-access"],
      ctaHref,
      ctaExternal: /^https?:\/\//i.test(ctaHref),
      firstAccess: state.kind === "first-access",
    });
  }

  for (const entry of catalogue.notices) {
    const { event, state } = entry;
    if (state.kind !== "postponed" && state.kind !== "cancelled") continue;
    const isFinale = isCurrentSunsetsEvent(event);
    const title = isFinale
      ? currentSunsets.headliners.join(" × ")
      : event.headline || event.title;
    const shortOriginal = isFinale ? sunsetsShortDate : event.date;

    records.push({
      id: event.id,
      series: event.series,
      seriesSubtext: isFinale ? "Sun(Sets) III" : "Status update",
      title,
      dateText:
        state.kind === "postponed"
          ? `Originally ${shortOriginal}`
          : shortOriginal,
      venueName: isFinale ? currentSunsets.venueName : getScheduleVenue(event),
      venueLocation: isFinale
        ? "Chicago Lakefront"
        : event.location || "Chicago, IL",
      timeText:
        state.kind === "postponed"
          ? "New date to be confirmed"
          : "Event cancelled",
      statusLabel: state.kind === "postponed" ? "Postponed" : "Cancelled",
      statusTone: "amber",
      ctaLabel: PUBLISHED_CTA_LABELS[state.cta],
      ctaHref: state.statusUrl,
      ctaExternal: /^https?:\/\//i.test(state.statusUrl),
      firstAccess: false,
    });
  }

  records.push({
    id: "next-chapter-2027",
    series: "monolith-project",
    seriesSubtext: `${HOME_NEXT_CHAPTER.year} Collective`,
    title: "Untold Story III & Sun(Sets) IV",
    dateText: `${HOME_NEXT_CHAPTER.year} Season`,
    venueName: "Chicago Rooms & Lakefront",
    venueLocation: "Chicago, IL",
    timeText: "Announced to the list first",
    statusLabel: "First Access",
    statusTone: "amber",
    ctaLabel: PUBLISHED_CTA_LABELS["get-first-access"],
    ctaHref: HOME_NEXT_CHAPTER.signupHref,
    ctaExternal: false,
    firstAccess: true,
  });

  if (catalogue.upcoming.length === 0 && catalogue.past.length > 0) {
    const recentPast = catalogue.past[0];
    if (recentPast && recentPast.state.kind === "past") {
      records.push({
        id: recentPast.event.id,
        series: recentPast.event.series,
        seriesSubtext: recentPast.event.episode || "Verified archive",
        title: recentPast.event.headline || recentPast.event.title,
        dateText: recentPast.event.date,
        venueName: getScheduleVenue(recentPast.event),
        venueLocation: recentPast.event.location || "Chicago, IL",
        timeText: "Completed Chicago session",
        statusLabel: "Past Event",
        statusTone: "muted",
        ctaLabel: PUBLISHED_CTA_LABELS["view-archive"],
        ctaHref: recentPast.state.archiveUrl,
        ctaExternal: false,
        firstAccess: false,
      });
    }
  }

  return records;
}

function SeriesIdentity({ record }: { record: ConsoleRecord }) {
  if (record.series === "chasing-sunsets") {
    return (
      <div className="lg-console-brand">
        <ChasingSunsetsLogo
          className="lg-console-sunsets-logo"
          decorative
          priority
        />
        <span className="lg-console-brand-sub">{record.seriesSubtext}</span>
      </div>
    );
  }

  if (record.series === "untold-story") {
    return (
      <div className="lg-console-brand">
        <div className="lg-console-untold-mark">
          <UntoldButterflyLogo className="w-6 h-6 text-untold-cyan" />
          <span>Untold Story</span>
        </div>
        <span className="lg-console-brand-sub">{record.seriesSubtext}</span>
      </div>
    );
  }

  return (
    <div className="lg-console-brand">
      <span className="lg-console-monolith-mark">MONOLITH</span>
      <span className="lg-console-brand-sub">{record.seriesSubtext}</span>
    </div>
  );
}

function ConsoleAction({
  record,
  inert,
}: {
  record: ConsoleRecord;
  inert: boolean;
}) {
  const sharedProps = {
    className: "lg-console-cta",
    "data-first-access": record.firstAccess ? "true" : undefined,
    tabIndex: inert ? -1 : undefined,
    "aria-hidden": inert ? ("true" as const) : undefined,
  };

  if (record.ctaExternal || record.ctaHref.includes("#")) {
    return (
      <a
        href={record.ctaHref}
        target={record.ctaExternal ? "_blank" : undefined}
        rel={record.ctaExternal ? "noopener noreferrer" : undefined}
        {...sharedProps}
      >
        <span>{record.ctaLabel}</span>
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={record.ctaHref} {...sharedProps}>
      <span>{record.ctaLabel}</span>
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}

function ConsoleRecordRow({
  record,
  stateClass,
  inert = false,
}: {
  record: ConsoleRecord;
  stateClass: string;
  inert?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (inert) {
      node.setAttribute("inert", "");
    } else {
      node.removeAttribute("inert");
    }
  }, [inert]);

  return (
    <div
      ref={ref}
      className={`lg-console-record ${stateClass}`}
      aria-hidden={inert || undefined}
      data-console-record-id={record.id}
      data-console-active={!inert ? "true" : "false"}
    >
      <div className="lg-console-identity">
        <SeriesIdentity record={record} />
      </div>

      <div className="lg-console-facts">
        <div className="lg-console-fact lg-console-fact-date">
          <Calendar size={15} aria-hidden="true" />
          <div>
            <span className="lg-console-fact-primary">{record.dateText}</span>
            <span className="lg-console-fact-secondary">{record.title}</span>
          </div>
        </div>

        <div className="lg-console-fact lg-console-fact-venue">
          <MapPin size={15} aria-hidden="true" />
          <div>
            <span className="lg-console-fact-primary">{record.venueName}</span>
            <span className="lg-console-fact-secondary">
              {record.venueLocation}
            </span>
          </div>
        </div>

        <div className="lg-console-fact lg-console-fact-time">
          <Clock size={15} aria-hidden="true" />
          <div>
            <span className="lg-console-fact-primary">{record.timeText}</span>
            <span className="lg-console-fact-secondary">
              Official status
            </span>
          </div>
        </div>
      </div>

      <div className="lg-console-actions">
        <span className="lg-console-badge" data-tone={record.statusTone}>
          {record.statusLabel}
        </span>
        <ConsoleAction record={record} inert={inert} />
      </div>
    </div>
  );
}

export default function HeroEventConsole({
  heroInView,
  documentVisible,
  reducedMotion,
  pausedExternal = false,
}: HeroEventConsoleProps) {
  const records = useMemo(() => buildConsoleRecords(), []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const [glideDirection, setGlideDirection] = useState<"ltr" | "rtl">("ltr");
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true
  );
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktopViewport(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (activeIndex >= records.length) {
      setActiveIndex(0);
      setOutgoingIndex(null);
    }
  }, [activeIndex, records.length]);

  useEffect(() => {
    if (outgoingIndex === null) return;
    const timer = window.setTimeout(() => {
      setOutgoingIndex(null);
    }, CONSOLE_GLIDE_MS + 40);
    return () => window.clearTimeout(timer);
  }, [outgoingIndex]);

  const canAutoRotate =
    records.length > 1 &&
    isDesktopViewport &&
    !reducedMotion &&
    !manualPaused &&
    !hovering &&
    !focusWithin &&
    heroInView &&
    documentVisible &&
    !pausedExternal &&
    outgoingIndex === null;

  useEffect(() => {
    if (!canAutoRotate) return;
    const timer = window.setTimeout(() => {
      setGlideDirection("ltr");
      setOutgoingIndex(activeIndex);
      setActiveIndex(prev => (prev + 1) % records.length);
    }, CONSOLE_DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [canAutoRotate, activeIndex, records.length]);

  if (records.length === 0) return null;

  const activeRecord = records[activeIndex] ?? records[0];
  const outgoingRecord =
    outgoingIndex !== null && outgoingIndex !== activeIndex
      ? records[outgoingIndex]
      : null;

  const stepConsole = (delta: 1 | -1) => {
    if (records.length <= 1) return;
    setManualPaused(true);
    const next = (activeIndex + delta + records.length) % records.length;
    if (reducedMotion || !isDesktopViewport) {
      setOutgoingIndex(null);
      setActiveIndex(next);
      return;
    }
    setGlideDirection(delta > 0 ? "ltr" : "rtl");
    setOutgoingIndex(activeIndex);
    setActiveIndex(next);
  };

  return (
    <div
      ref={consoleRef}
      role="region"
      aria-label="Featured events and announcements"
      data-home-hero-card="true"
      className="lg-console-shell"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={event => {
        if (
          !consoleRef.current?.contains(event.relatedTarget as Node | null)
        ) {
          setFocusWithin(false);
        }
      }}
    >
      <div className="lg-console-viewport" aria-live="off">
        {outgoingRecord && (
          <ConsoleRecordRow
            key={`out-${outgoingRecord.id}`}
            record={outgoingRecord}
            stateClass={
              glideDirection === "ltr"
                ? "is-console-exiting-ltr"
                : "is-console-exiting-rtl"
            }
            inert
          />
        )}
        <ConsoleRecordRow
          key={`in-${activeRecord.id}`}
          record={activeRecord}
          stateClass={
            outgoingRecord
              ? glideDirection === "ltr"
                ? "is-console-entering-ltr"
                : "is-console-entering-rtl"
              : "is-console-steady"
          }
        />
      </div>

      {records.length > 1 && (
        <div
          className="lg-console-stepper"
          role="group"
          aria-label="Browse event updates"
        >
          <button
            type="button"
            className="lg-console-step-btn"
            onClick={() => stepConsole(-1)}
            aria-label="Previous event announcement"
          >
            <ChevronLeft size={14} aria-hidden="true" />
          </button>
          <span className="lg-console-step-count" aria-hidden="true">
            {activeIndex + 1}/{records.length}
          </span>
          <button
            type="button"
            className="lg-console-step-btn"
            onClick={() => stepConsole(1)}
            aria-label="Next event announcement"
          >
            <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
