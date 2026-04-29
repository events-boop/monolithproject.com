import { Link } from "wouter";
import { useState, useCallback } from "react";
import VideoHeroSlider, { Slide } from "./VideoHeroSlider";
import JsonLd from "@/components/JsonLd";
import KineticDecryption from "./KineticDecryption";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { buildScheduledEventSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { padCountdown, useCountdown } from "@/hooks/useCountdown";
import {
  getEventById,
  getEventEyebrow,
  getEventStartTimestamp,
  getEventVenueLabel,
  getExperienceEvent,
  getSeriesLabel,
  getSeriesEvents,
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
    caption: "UNTOLD STORY IV | ERAN HERSH",
  },
  {
    type: "image",
    src: heroEranPortraitImage.src,
    sources: heroEranPortraitImage.sources,
    sizes: heroEranPortraitImage.sizes,
    alt: "Eran Hersh",
    caption: "UNTOLD STORY IV PORTRAIT",
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
    caption: "SUMMER '26 | CHASING SUN(SETS)",
  },
  {
    type: "image",
    src: heroAutografImage.src,
    sources: heroAutografImage.sources,
    sizes: heroAutografImage.sizes,
    alt: "Chasing Sun(Sets) July 4th",
    caption: "NEW SEASON DROP | JULY 4TH ARCHIVE",
  },
  {
    type: "image",
    src: heroLazareImage.src,
    sources: heroLazareImage.sources,
    sizes: heroLazareImage.sizes,
    alt: "Lazare Sabry Event",
    caption: "SPECIAL EVENT | LAZARE SABRY",
  },
];

/** Maps each hero slide to the banner state it should drive. */
const SLIDE_EVENT_MAP: SlideBannerInfo[] = [
  { fallbackToFeaturedEvent: true, label: "THE MONOLITH PROJECT" }, // 0: video
  { eventId: "us-s3e3", label: "UNTOLD STORY IV" }, // 1: eran hersh international
  { eventId: "us-s3e3", label: "UNTOLD STORY IV" }, // 2: eran hersh portrait
  {
    label: "UNTOLD STORY",
    eyebrow: "PAST SHOW",
    venueLabel: "INDOOR SERIES",
    dateLabel: "UNTOLD STORY ARCHIVE",
  }, // 3: untold story
  { eventId: "css-jul04", label: "CHASING SUN(SETS)" }, // 4: chasing sunsets / july 4th
  {
    eventId: "css-jul04",
    label: "CHASING SUN(SETS)",
    eyebrow: "NEW SEASON DROP",
    venueLabel: "JULY 4TH EVENT",
    dateLabel: "CHICAGO",
  }, // 5: chansing sunsets new season drop
  {
    label: "LAZARE SABRY",
    eyebrow: "SPECIAL EVENT",
    venueLabel: "CHICAGO",
    dateLabel: "COMING SOON",
  }, // 6: lazare sabry
];

const HERO_TITLE = "MONOLITH";
const HERO_PILLARS = "Chicago / House Music / Events / Radio";
const HERO_TAGLINE = "Togetherness is the frequency.";
const HERO_SUPPORTING_LINE =
  "Upcoming shows, Chasing Sun(Sets), Untold Story, and artist-led radio.";

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

function getEventStatusLabel(status?: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  if (status === "past") return "PAST";
  return "FEATURED";
}

function getSystemKicker(event: any | undefined, eyebrow: string | undefined, slideInfo: SlideBannerInfo) {
  if (event) {
    return `${toSystemText(getSeriesLabel(event.series))} / ${getEventSignalLabel(event)}`;
  }

  return toSystemText(eyebrow || slideInfo.eyebrow || "FEATURED SHOW");
}

function getSystemMeta(dateLabel: string, venueLabel?: string) {
  const date = toSystemText(dateLabel);
  const venue = toSystemText(venueLabel)
    .replace(/,\s*CHICAGO,\s*IL/g, "")
    .replace(/^VENUE REVEAL SOON$/, "VENUE LOCK PENDING");

  return [date, venue].filter(Boolean).join(" / ");
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
  contextualFallbackAction
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
  const isLive = event?.status === "on-sale";
  const eventStart = event ? getEventStartTimestamp(event) : null;
  const countdown = useCountdown(isLive ? eventStart : null);
  const showCountdown = isLive && eventStart && !countdown.isExpired;
  const systemKicker = getSystemKicker(event, eyebrow, slideInfo);
  const systemMeta = getSystemMeta(dateLabel, venueLabel);
  const eventStatusLabel = getEventStatusLabel(event?.status);
  const shortDescription =
    event?.description ||
    event?.experienceIntro ||
    (event ? `${event.title} at ${event.venue}, ${event.location}.` : undefined);

  return (
    <div
      key={headline}
      data-home-hero-card="true"
      className="group/card relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
    >
      {/* Immersive Background Window */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 transition-transform duration-[2s] group-hover/card:scale-105"
          style={{
            background:
              "radial-gradient(circle at 18% 18%, rgba(224, 90, 58, 0.22), transparent 36%), radial-gradient(circle at 82% 20%, rgba(255, 255, 255, 0.08), transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.72) 44%, rgba(0,0,0,0.92))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-start gap-5 p-8 md:p-10">
        {/* Status Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <span className="event-system-chip rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-white backdrop-blur-md">
            {eventStatusLabel}
          </span>
        </div>

        {/* Narrative Metadata */}
        <div className="flex w-full flex-col gap-3 pr-16 sm:pr-20">
          <span className="event-system-kicker text-[var(--monolith-red)]">
            {systemKicker}
          </span>
          <h3 className={cn(
            "event-system-headline max-w-[14ch] text-[clamp(1.75rem,8vw,3.85rem)] sm:text-[clamp(2rem,7vw,3.85rem)] text-white text-balance",
            isJuly4thEvent && "july-4th-gradient"
          )}>
            {toSystemText(headline)}
          </h3>
          <span className="event-system-meta max-w-[34ch] border-t border-white/10 pt-3 text-white/82">
            {systemMeta}
          </span>
          {event?.time ? (
            <span className="event-system-chip text-white/70">
              {toSystemText(event.time)}
            </span>
          ) : null}
          {shortDescription ? (
            <p className="max-w-[34ch] text-[13px] leading-relaxed text-white/86 line-clamp-4">
              {shortDescription}
            </p>
          ) : null}
        </div>

        {showCountdown && (
          <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4 border-y border-white/10 py-3">
            <span className="event-system-chip text-white/70">
              Event Starts
            </span>
            <div className="event-system-chip flex items-center gap-2 text-white tabular-nums">
              <span>{countdown.days}D</span>
              <span className="text-white/56">/</span>
              <span>{padCountdown(countdown.hours)}H</span>
              <span className="text-white/56">/</span>
              <span>{padCountdown(countdown.minutes)}M</span>
            </div>
          </div>
        )}

        {/* CTA Engine */}
        <div className="w-full mt-4">
          {event ? (
            <HeroCardCTA event={event} />
          ) : contextualFallbackAction ? (
            <Link href={contextualFallbackAction.href} asChild>
              <a className="btn-pill-neutral btn-pill-wide">
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
    (event?.slug || event?.id ? `/events/${event.slug || event.id}` : "/schedule");
  const label = event?.primaryCta?.label || (event?.ticketUrl ? "Get Tickets" : "View Details");
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="btn-pill-neutral btn-pill-wide"
    >
      {label}
    </a>
  );
}

export default function HeroSection() {
  const featuredEvent = getExperienceEvent("hero");

  const [activeSlide, setActiveSlide] = useState(0);
  const handleSlideChange = useCallback((index: number) => setActiveSlide(index), []);

  // Resolve which event to show in the banner based on the active slide
  const slideInfo = SLIDE_EVENT_MAP[activeSlide] ?? SLIDE_EVENT_MAP[0];
  const bannerEvent = slideInfo.fallbackToFeaturedEvent
    ? featuredEvent
    : slideInfo.eventId
      ? getEventById(slideInfo.eventId)
      : undefined;

  const headline = bannerEvent?.headline || bannerEvent?.title || slideInfo.label;
  const eyebrow = bannerEvent ? getEventEyebrow(bannerEvent) : slideInfo.eyebrow;
  const dateLabel = bannerEvent?.date ?? slideInfo.dateLabel ?? "Coming Soon";
  const venueLabel = bannerEvent ? getEventVenueLabel(bannerEvent) : slideInfo.venueLabel;
  const isJuly4thEvent = headline.toUpperCase().includes("JULY 4") || headline.toUpperCase().includes("INDEPENDENCE");
  const contextualFallbackAction =
    !bannerEvent && activeSlide === 3
      ? { href: "/story", label: "Explore Untold Story" }
      : !bannerEvent && activeSlide === 5
        ? { href: "/archive", label: "See The Archive" }
        : undefined;

  const structuredData = featuredEvent ? <JsonLd data={buildScheduledEventSchema(featuredEvent, "/")} /> : null;

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-black screen-shell-stable"
    >
      {structuredData}

      {/* Cinematic Background Layer — always video slider */}
      <div className="absolute inset-0 z-0 h-[115%] -top-[7%] hero-bg">
        <VideoHeroSlider slides={HERO_SLIDES} onSlideChange={handleSlideChange} />
      </div>

      {/* Architectural HUD Grid Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4vw_4vw]" />
        <div className="absolute left-0 right-0 top-[-10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-30 flex min-h-[100dvh] h-auto flex-col px-6 pb-10 pt-[calc(var(--shell-page-top-hero)+0.5rem)] sm:pb-14 sm:pt-[calc(var(--shell-page-top-hero)+1rem)] md:px-8 md:pb-10 md:pt-[calc(var(--shell-page-top-hero)+0.5rem)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-10 md:grid md:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] md:items-center md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,27rem)] lg:gap-16">
          <div
            data-home-hero-copy="true"
            className="flex min-w-0 flex-col items-center justify-center pt-1 text-center text-white md:items-start md:pr-8 md:text-left lg:pr-12"
          >
            <div className="relative z-10 flex min-w-0 flex-col items-center md:items-start">
              <h1
                data-home-hero-heading="true"
                className={cn(
                  "font-heavy text-[clamp(2.2rem,11.2vw,8.8rem)] leading-[0.82] tracking-[-0.06em] uppercase text-balance text-white [-webkit-text-stroke:clamp(1px,0.4vw,3px)_white]"
                )}
              >
                <KineticDecryption text={HERO_TITLE} autoStart={false} />
              </h1>

              <p
                data-home-hero-pillars="true"
                className="mt-4 max-w-md text-center font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.24em] text-white/76 md:text-left"
              >
                {HERO_PILLARS}
              </p>
              <p className="mt-5 max-w-[18ch] text-balance font-display text-[clamp(1.2rem,3vw,2.15rem)] leading-[1.02] text-white/92">
                {HERO_TAGLINE}
              </p>

              <p className="mt-5 max-w-[32rem] text-balance text-sm leading-relaxed text-white/84 md:text-base">
                {HERO_SUPPORTING_LINE}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link href="/schedule" className="btn-pill-neutral btn-pill-wide">
                  Upcoming Shows
                </Link>
                <Link href="/newsletter" className="btn-pill-outline btn-pill-wide">
                  Get The Drop
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-auto flex w-full justify-center md:mt-0 md:justify-end">
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
