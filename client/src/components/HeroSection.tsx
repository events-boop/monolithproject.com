import { Link } from "wouter";
import { useState, useCallback } from "react";
import VideoHeroSlider, { Slide } from "./VideoHeroSlider";
import JsonLd from "@/components/JsonLd";
import KineticDecryption from "./KineticDecryption";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { buildScheduledEventSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { padCountdown, useCountdown } from "@/hooks/useCountdown";
import { SUNSETS_JULY4_COMPLETE_LABEL } from "@/lib/sunsetsTicketing";
import {
  getEventById,
  getEventEyebrow,
  getEventStartTimestamp,
  getEventVenueLabel,
  getExperienceEvent,
  getSeriesLabel,
} from "@/lib/siteExperience";

const heroPosterImage = getResponsiveImage("videoPoster1");
const heroUntoldImage = getResponsiveImage("untoldStoryHero");
const heroSunsetsImage = getResponsiveImage("chasingSunsets");
const heroEranIntlImage = getResponsiveImage("eranHershInternational");
const heroEranPortraitImage = getResponsiveImage("eranHershPortraitReal");
const heroAutografImage = getResponsiveImage("sunsetPartyHero");
const heroLazareImage = getResponsiveImage("lazareSabryHero");

/** Each slide maps to banner metadata and an optional event context. */
interface SlideBannerInfo {
  eventId?: string;
  fallbackToFeaturedEvent?: boolean;
  label: string;
  eyebrow?: string;
  venueLabel?: string;
  dateLabel?: string;
  statusLabel?: string;
  fallbackAction?: { href: string; label: string };
}

const HERO_SLIDES: Slide[] = [
  {
    type: "video",
    src: "/videos/hero-video-1.mp4",
    mobileSrc: "/videos/hero-video-1-mobile.mp4",
    poster: heroPosterImage.src,
    posterSources: heroPosterImage.sources,
    posterSizes: heroPosterImage.sizes,
    width: 1920,
    height: 1080,
    caption: "THE MONOLITH PROJECT (LIVE)",
  },
  {
    type: "image",
    src: heroEranIntlImage.src,
    sources: heroEranIntlImage.sources,
    sizes: heroEranIntlImage.sizes,
    alt: "Eran Hersh",
    caption: "UNTOLD STORY IV / ARCHIVE",
  },
  {
    type: "image",
    src: heroEranPortraitImage.src,
    sources: heroEranPortraitImage.sources,
    sizes: heroEranPortraitImage.sizes,
    alt: "Eran Hersh",
    caption: "UNTOLD STORY IV / CHAPTER FOUR",
  },
  {
    type: "image",
    src: heroUntoldImage.src,
    sources: heroUntoldImage.sources,
    sizes: heroUntoldImage.sizes,
    alt: "Untold Story Archive",
    caption: "ARCHIVE | UNTOLD STORY",
  },
  {
    type: "image",
    src: heroSunsetsImage.src,
    sources: heroSunsetsImage.sources,
    sizes: heroSunsetsImage.sizes,
    alt: "Chasing Sun(Sets)",
    caption: "SUN(SETS) II | AUGUST 22",
  },
  {
    type: "image",
    src: heroAutografImage.src,
    sources: heroAutografImage.sources,
    sizes: heroAutografImage.sizes,
    alt: "Chasing Sun(Sets) July 4th",
    caption: SUNSETS_JULY4_COMPLETE_LABEL,
  },
  {
    type: "image",
    src: heroLazareImage.src,
    sources: heroLazareImage.sources,
    sizes: heroLazareImage.sizes,
    alt: "The Monolith Project launch signal",
    caption: "THE MONOLITH PROJECT | LAUNCH SIGNAL",
  },
];

/** Maps each hero slide to the banner state it should drive. */
const SLIDE_EVENT_MAP: SlideBannerInfo[] = [
  {
    fallbackToFeaturedEvent: true,
    label: "SUN(SETS) II",
    eyebrow: "NEXT CHAPTER / FIRST ACCESS",
    venueLabel: "CASTAWAYS / CHICAGO",
    dateLabel: "AUGUST 22 / 2026",
    statusLabel: "FIRST ACCESS",
    fallbackAction: { href: "/go/lakelist", label: "Join the Lake List" },
  }, // 0: current season signal
  {
    label: "UNTOLD STORY IV",
    eyebrow: "CHAPTER FOUR / ARCHIVE",
    venueLabel: "HIDEAWAY / CHICAGO",
    dateLabel: "MAY 16 / 2026",
    statusLabel: "ARCHIVE",
    fallbackAction: { href: "/story", label: "Explore Untold Story" },
  }, // 1: eran hersh international
  {
    label: "UNTOLD STORY IV",
    eyebrow: "CHAPTER FOUR / ARCHIVE",
    venueLabel: "HIDEAWAY / CHICAGO",
    dateLabel: "MAY 16 / 2026",
    statusLabel: "ARCHIVE",
    fallbackAction: { href: "/story", label: "Explore Untold Story" },
  }, // 2: eran hersh portrait
  {
    label: "UNTOLD STORY",
    eyebrow: "FOUR CHAPTERS / AFTER DARK",
    venueLabel: "CHICAGO",
    dateLabel: "UNTOLD STORY ARCHIVE",
    statusLabel: "ARCHIVE",
    fallbackAction: { href: "/story", label: "Explore Untold Story" },
  }, // 3: untold story
  { eventId: "css-aug22", label: "CHASING SUN(SETS)" }, // 4: chasing sunsets / chapter two
  {
    label: "SUN(SETS) I",
    eyebrow: "CHAPTER ONE / ARCHIVE",
    venueLabel: "CASTAWAYS / CHICAGO",
    dateLabel: "JULY 4 / 2026",
    statusLabel: "ARCHIVE",
    fallbackAction: {
      href: "/chasing-sunsets/sunsets-i-2026",
      label: "Enter Chapter One",
    },
  }, // 5: chapter one archive
  { eventId: "css-oct10", label: "THE MONOLITH PROJECT" }, // 6: parent-brand launch
];

const HERO_TITLE = "MONOLITH";
const HERO_PILLARS = "Chicago / Daylight / After Dark";
const HERO_TAGLINE = "One platform. Two currents.";
const HERO_SUPPORTING_LINE =
  "Chasing Sun(Sets) moves with the lake. Untold Story takes the night deeper. The Monolith Project is what connects them.";

function toSystemText(value?: string | null) {
  return (value || "")
    .replace(/[—·|]/g, " / ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function getEventSignalLabel(event?: any) {
  if (!event) return "PAST SHOW";
  if (event.status === "on-sale") return "TICKETS LIVE";
  if (event.status === "sold-out") return "SOLD OUT";
  if (event.recentlyDropped) return "SIGN UP OPEN";
  if (event.status === "coming-soon") return "DROP SOON";
  if (event.status === "past") return "PAST SHOW";
  return "FEATURED SHOW";
}

function getEventStatusLabel(status?: string, fallback = "FEATURED") {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  if (status === "past") return "PAST";
  return fallback;
}

function getSystemKicker(
  event: any | undefined,
  eyebrow: string | undefined,
  slideInfo: SlideBannerInfo
) {
  if (event) {
    return `${toSystemText(getSeriesLabel(event.series))} / ${getEventSignalLabel(event)}`;
  }

  return toSystemText(eyebrow || slideInfo.eyebrow || "FEATURED SHOW");
}

function getSystemVenue(venueLabel?: string) {
  return toSystemText(venueLabel)
    .replace(/,\s*CHICAGO,\s*IL/g, "")
    .replace(/^VENUE REVEAL SOON$/, "VENUE LOCK PENDING");
}

function HomeHeroUtilityRow() {
  return (
    <div className="relative z-40 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-6 pt-4 font-mono text-[9px] font-black uppercase tracking-[0.12em] text-white/42 md:px-8 md:text-[10px]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="text-white/62">MONOLITH</span>
        <span className="hidden h-px w-8 bg-white/24 sm:block" />
        <span>Chicago</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span>Daylight</span>
        <span className="h-1 w-1 rounded-full bg-[#E8B86D]" />
        <span>After Dark</span>
      </div>
    </div>
  );
}

/**
 * FloatingEventCard:
 * The immersive, interactive conversion point for the hero section.
 * Syncs with the active slide to feature live shows, radio episodes, or archives.
 */
function FloatingEventCard({
  event,
  slideInfo,
  dateLabel,
  venueLabel,
  eyebrow,
  isJuly4thEvent,
  contextualFallbackAction,
}: {
  event?: any;
  slideInfo: SlideBannerInfo;
  dateLabel: string;
  venueLabel?: string;
  eyebrow?: string;
  isJuly4thEvent: boolean;
  contextualFallbackAction?: { href: string; label: string };
}) {
  const headline = event?.headline || event?.title || slideInfo.label;
  const systemHeadline = toSystemText(headline);
  const usesCondensedHeadline = systemHeadline.length > 22;
  const isLive = event?.status === "on-sale";
  const eventStart = event ? getEventStartTimestamp(event) : null;
  const countdown = useCountdown(isLive ? eventStart : null);
  const showCountdown = isLive && eventStart && !countdown.isExpired;
  const systemKicker = getSystemKicker(event, eyebrow, slideInfo);
  const systemDate = toSystemText(dateLabel);
  const systemVenue = getSystemVenue(venueLabel) || "CHICAGO";
  const eventStatusLabel = getEventStatusLabel(
    event?.status,
    slideInfo.statusLabel
  );
  const cardSignal =
    `${event?.series || ""} ${headline} ${systemKicker}`.toUpperCase();
  const cardTone = cardSignal.includes("UNTOLD")
    ? "untold"
    : cardSignal.includes("SUN(SETS)") || cardSignal.includes("CHASING")
      ? "sunsets"
      : "monolith";
  const shortDescription =
    event?.description ||
    event?.experienceIntro ||
    (event
      ? `${event.title} at ${event.venue}, ${event.location}.`
      : undefined);
  const phaseLabel = event?.time
    ? toSystemText(event.time)
    : cardTone === "untold"
      ? "AFTER DARK / ARCHIVE RECORD"
      : cardTone === "sunsets"
        ? eventStatusLabel === "ARCHIVE"
          ? "CHAPTER RECORD"
          : "GOLDEN HOUR"
        : "LAUNCH SIGNAL";
  const cardDescription =
    shortDescription ||
    (cardTone === "untold"
      ? "Four chapters live in the archive. The next coordinates arrive when the room is right."
      : cardTone === "sunsets"
        ? eventStatusLabel === "ARCHIVE"
          ? "Chapter One lives in the archive. The lakefront season keeps moving."
          : "The lakefront season continues. First access moves through the Lake List."
        : "The parent platform connecting the lake, the room, and what comes next.");

  return (
    <div
      key={headline}
      data-home-hero-card="true"
      data-card-tone={cardTone}
      className="hero-event-dossier group/card relative h-[29rem] w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(135deg,rgba(34,34,32,0.86),rgba(12,12,12,0.92)_58%,rgba(28,28,26,0.86))] shadow-[0_34px_90px_rgba(0,0,0,0.78),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors duration-500 sm:h-[31rem] md:h-[34rem]"
    >
      <div aria-hidden="true" className="hero-card-etch">
        <span className="hero-card-etch-corner hero-card-etch-corner-nw" />
        <span className="hero-card-etch-corner hero-card-etch-corner-ne" />
        <span className="hero-card-etch-corner hero-card-etch-corner-sw" />
        <span className="hero-card-etch-corner hero-card-etch-corner-se" />
        <span className="hero-card-etch-rail hero-card-etch-rail-n" />
        <span className="hero-card-etch-rail hero-card-etch-rail-e" />
        <span className="hero-card-etch-rail hero-card-etch-rail-s" />
        <span className="hero-card-etch-rail hero-card-etch-rail-w" />
        <span className="hero-card-etch-emblem" />
      </div>
      <div aria-hidden="true" className="hero-card-ambient-sigil">
        <span />
      </div>
      {/* Immersive Background Window */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="hero-card-lightfield absolute inset-0 opacity-80 transition-transform duration-[2s] group-hover/card:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-white/[0.03]" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex h-full flex-col items-start gap-3 p-6 sm:gap-4 sm:p-8 md:p-10">
        {/* Status Badge */}
        <div className="flex items-center gap-2 self-end sm:absolute sm:right-6 sm:top-6">
          <span className="event-system-chip hero-card-status rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-white/76 backdrop-blur-md">
            <span aria-hidden="true" className="hero-card-status-dot" />
            {eventStatusLabel}
          </span>
        </div>

        {/* Narrative Metadata */}
        <div className="flex min-h-0 w-full flex-col gap-3">
          <span className="event-system-kicker min-h-[1em] text-white/58 sm:pr-24">
            {systemKicker}
          </span>
          <h3
            className={cn(
              "hero-card-headline-slot event-system-headline h-[5.75rem] w-full max-w-full overflow-hidden text-white text-balance tracking-[-0.035em] drop-shadow-[0_16px_34px_rgba(0,0,0,0.58)] sm:h-[8.5rem]",
              isJuly4thEvent
                ? "text-[clamp(1.5rem,5.6vw,2.55rem)] sm:text-[clamp(1.65rem,3.8vw,2.55rem)]"
                : usesCondensedHeadline
                  ? "text-[clamp(1.5rem,6.4vw,2.25rem)] sm:text-[clamp(1.75rem,3.2vw,2.35rem)]"
                  : "text-[clamp(1.65rem,7vw,2.8rem)] sm:text-[clamp(1.85rem,4vw,2.8rem)]",
              isJuly4thEvent && "july-4th-gradient"
            )}
          >
            {systemHeadline}
          </h3>
          <dl className="hero-card-spec-grid mt-1 grid w-full grid-cols-2 border-y border-white/10">
            <div className="min-w-0 py-3 pr-3">
              <dt className="event-system-chip text-white/38">Date</dt>
              <dd className="event-system-meta mt-1.5 min-h-[2.25rem] text-white/76">
                {systemDate}
              </dd>
            </div>
            <div className="min-w-0 border-l border-white/10 py-3 pl-3">
              <dt className="event-system-chip text-white/38">Location</dt>
              <dd className="event-system-meta mt-1.5 min-h-[2.25rem] text-white/76">
                {systemVenue}
              </dd>
            </div>
          </dl>
          <span className="event-system-chip min-h-[1em] text-white/54">
            {phaseLabel}
          </span>
          <p
            className={cn(
              "max-w-[34ch] text-[13px] leading-relaxed text-white/72",
              showCountdown
                ? "min-h-[2.6rem] line-clamp-2"
                : "min-h-[3.8rem] line-clamp-3"
            )}
          >
            {cardDescription}
          </p>
        </div>

        {showCountdown && (
          <div className="grid w-full shrink-0 grid-cols-[1fr_auto] items-center gap-4 border-y border-white/10 py-3">
            <span className="event-system-chip text-white/54">
              Event Starts
            </span>
            <div className="event-system-chip flex items-center gap-2 text-white/82 tabular-nums">
              <span>{countdown.days}D</span>
              <span className="text-white/34">/</span>
              <span>{padCountdown(countdown.hours)}H</span>
              <span className="text-white/34">/</span>
              <span>{padCountdown(countdown.minutes)}M</span>
            </div>
          </div>
        )}

        {/* CTA Engine */}
        <div className="mt-auto w-full shrink-0">
          {event ? (
            <HeroCardCTA event={event} />
          ) : contextualFallbackAction ? (
            <Link href={contextualFallbackAction.href} asChild>
              <a
                className={cn(
                  "hero-card-cta btn-pill-wide",
                  cardTone === "untold"
                    ? "btn-pill-untold"
                    : cardTone === "sunsets"
                      ? "btn-pill-sunsets"
                      : "btn-pill-monolith"
                )}
              >
                {contextualFallbackAction.label}
              </a>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HeroCardCTA({ event }: { event: any }) {
  const href =
    event?.primaryCta?.href ||
    event?.ticketUrl ||
    (event?.slug || event?.id
      ? `/events/${event.slug || event.id}`
      : "/schedule");
  const label =
    event?.primaryCta?.label ||
    (event?.ticketUrl ? "Get Tickets" : "View Details");
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="hero-card-cta inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-full border border-white/78 bg-white px-6 text-[11px] font-black uppercase tracking-[0.18em] text-[#17110E] shadow-[0_18px_36px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.8)] transition hover:-translate-y-0.5 hover:bg-[#E7E7E2] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/62"
    >
      {label}
    </a>
  );
}

export default function HeroSection() {
  const featuredEvent = getExperienceEvent("hero");

  const [activeSlide, setActiveSlide] = useState(0);
  const handleSlideChange = useCallback(
    (index: number) => setActiveSlide(index),
    []
  );

  // Resolve which event to show in the banner based on the active slide
  const slideInfo = SLIDE_EVENT_MAP[activeSlide] ?? SLIDE_EVENT_MAP[0];
  const bannerEvent = slideInfo.fallbackToFeaturedEvent
    ? featuredEvent
    : slideInfo.eventId
      ? getEventById(slideInfo.eventId)
      : undefined;

  const headline =
    bannerEvent?.headline || bannerEvent?.title || slideInfo.label;
  const eyebrow = bannerEvent
    ? getEventEyebrow(bannerEvent)
    : slideInfo.eyebrow;
  const dateLabel = bannerEvent?.date ?? slideInfo.dateLabel ?? "Coming Soon";
  const venueLabel = bannerEvent
    ? getEventVenueLabel(bannerEvent)
    : slideInfo.venueLabel;
  const isJuly4thEvent =
    headline.toUpperCase().includes("JULY 4") ||
    headline.toUpperCase().includes("INDEPENDENCE");
  const contextualFallbackAction = !bannerEvent
    ? slideInfo.fallbackAction
    : undefined;

  const structuredData = featuredEvent ? (
    <JsonLd data={buildScheduledEventSchema(featuredEvent, "/")} />
  ) : null;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-black screen-shell-stable"
    >
      {structuredData}

      {/* Cinematic Background Layer — always video slider */}
      <div className="absolute inset-0 z-0 h-[115%] -top-[7%] hero-bg">
        <VideoHeroSlider
          slides={HERO_SLIDES}
          onSlideChange={handleSlideChange}
        />
      </div>

      {/* Architectural HUD Grid Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4vw_4vw]" />
        <div className="absolute left-0 right-0 top-[-10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[14vh] z-20 hidden overflow-hidden text-center md:block">
        <span className="hero-wordmark block text-[clamp(5rem,17vw,17rem)] uppercase leading-none tracking-[0] text-white/[0.026]">
          MONOLITH
        </span>
      </div>

      <div className="pointer-events-none relative z-30 flex min-h-[100dvh] h-auto flex-col px-6 pb-10 pt-[calc(var(--shell-page-top-hero)+0.5rem)] sm:pb-14 sm:pt-[calc(var(--shell-page-top-hero)+1rem)] md:px-8 md:pb-10 md:pt-[calc(var(--shell-page-top-hero)+0.5rem)]">
        <HomeHeroUtilityRow />
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-10 md:grid md:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] md:items-center md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,27rem)] lg:gap-16">
          <div
            data-home-hero-copy="true"
            className="flex min-w-0 flex-col items-center justify-center pt-1 text-center text-white md:items-start md:pr-8 md:text-left lg:pr-12"
          >
            <div className="relative z-10 flex min-w-0 flex-col items-center md:items-start">
              <div className="pointer-events-none absolute left-1/2 top-0 h-[18rem] w-[120vw] -translate-x-1/2 -translate-y-[22%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.16)_0%,rgba(168,168,160,0.10)_28%,rgba(52,52,48,0.10)_48%,transparent_74%)] blur-3xl md:left-[34%] md:h-[24rem] md:w-[48rem] md:-translate-x-1/3 md:-translate-y-[28%]" />
              <div className="pointer-events-none absolute left-1/2 top-[3.75rem] h-28 w-[112vw] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.10)_34%,rgba(178,178,170,0.12)_50%,rgba(72,72,68,0.10)_68%,transparent)] blur-2xl md:left-[40%] md:top-[6.25rem] md:w-[44rem] md:-translate-x-1/3" />
              <h1
                data-home-hero-heading="true"
                className={cn(
                  "relative hero-wordmark max-w-full text-[clamp(3rem,7vw,9rem)] text-balance bg-gradient-to-b from-white via-[#ECECE8] to-white/28 bg-clip-text text-left text-transparent drop-shadow-[0_22px_42px_rgba(0,0,0,0.62)]"
                )}
              >
                <KineticDecryption text={HERO_TITLE} autoStart={false} />
              </h1>

              <p
                data-home-hero-pillars="true"
                data-home-hero-eyebrow="true"
                className="mt-4 max-w-md text-center font-mono text-[12px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.24em] text-white/62 md:text-left"
              >
                {HERO_PILLARS}
              </p>
              <p className="mt-5 max-w-[18ch] text-balance font-display text-[clamp(1.2rem,3vw,2.15rem)] leading-[1.02] text-white/94">
                {HERO_TAGLINE}
              </p>

              <p
                data-home-hero-summary="true"
                className="mt-5 max-w-[34rem] text-balance text-sm leading-relaxed text-white/70 drop-shadow-[0_8px_22px_rgba(0,0,0,0.55)] md:text-base"
              >
                {HERO_SUPPORTING_LINE}
              </p>

              <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link
                  href="/go/lakelist"
                  className="inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-full border border-white/75 bg-white px-8 text-[11px] font-black uppercase tracking-[0.18em] text-[#17110E] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#F8FAF8] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:w-auto sm:min-w-[15rem]"
                >
                  Join the Lake List
                </Link>
                <Link
                  href="/sunsets"
                  className="inline-flex min-h-[3.5rem] w-full items-center justify-center rounded-full border border-white/26 bg-white/[0.08] px-8 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/48 hover:bg-white/14 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/55 sm:w-auto sm:min-w-[15rem]"
                >
                  Explore Sun(Sets)
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto mt-auto flex w-full justify-center md:mt-0 md:justify-end">
            <div className="w-full max-w-[22rem] sm:max-w-[24rem] md:max-w-[26rem] lg:max-w-[28rem]">
              <FloatingEventCard
                event={bannerEvent}
                slideInfo={slideInfo}
                dateLabel={dateLabel}
                venueLabel={venueLabel}
                eyebrow={eyebrow}
                isJuly4thEvent={isJuly4thEvent}
                contextualFallbackAction={contextualFallbackAction}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
