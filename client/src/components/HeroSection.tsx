import { Link } from "wouter";
import { useEffect, useState, memo, useCallback } from "react";
import VideoHeroSlider, { Slide } from "./VideoHeroSlider";
import JsonLd from "@/components/JsonLd";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
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
const heroAutografImage = getResponsiveImage("autografRecap");

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
    caption: "ERAN HERSH | MAY 16 2026",
  },
  {
    type: "image",
    src: heroEranPortraitImage.src,
    sources: heroEranPortraitImage.sources,
    sizes: heroEranPortraitImage.sizes,
    alt: "Eran Hersh",
    caption: "ERAN HERSH PORTRAIT",
  },
  {
    type: "image",
    src: heroUntoldImage.src,
    sources: heroUntoldImage.sources,
    sizes: heroUntoldImage.sizes,
    alt: "Untold Story Archive",
    caption: "ARCHIVE | UNTOLD STORY SEASON III",
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
    alt: "Autograf Archive",
    caption: "ARCHIVE | SPECIAL EVENT AUTOGRAF",
  },
];

/** Maps each hero slide to the banner state it should drive. */
const SLIDE_EVENT_MAP: SlideBannerInfo[] = [
  { fallbackToFeaturedEvent: true, label: "THE MONOLITH PROJECT" }, // 0: video
  { eventId: "us-s3e3", label: "ERAN HERSH" }, // 1: eran hersh international
  { eventId: "us-s3e3", label: "ERAN HERSH" }, // 2: eran hersh portrait
  {
    label: "UNTOLD STORY",
    eyebrow: "ARCHIVE SIGNAL",
    venueLabel: "LATE-NIGHT SERIES",
    dateLabel: "SEASON III ARCHIVE",
  }, // 3: untold story
  { eventId: "css-jul04", label: "CHASING SUN(SETS)" }, // 4: chasing sunsets / july 4th
  {
    label: "AUTOGRAF",
    eyebrow: "ARCHIVE SIGNAL",
    venueLabel: "FEATURED EVENT",
    dateLabel: "AUTOGRAF",
  }, // 5: autograf archive
];

const HERO_SUBHEAD =
  "Monolith is the root. Chasing Sun(Sets) runs the daytime — rooftops in summer, the Radio Show worldwide. Untold Story runs the night. Same city, same standard, one project.";

function toSystemText(value?: string | null) {
  return (value || "")
    .replace(/[—·|]/g, " / ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function getEventSignalLabel(event?: any) {
  if (!event) return "ARCHIVE SIGNAL";
  if (event.status === "on-sale") return "ACTIVE SALE";
  if (event.status === "sold-out") return "WAITLIST CONTROL";
  if (event.recentlyDropped) return "SIGNAL OPEN";
  if (event.status === "coming-soon") return "PRESALE BUILDING";
  if (event.status === "past") return "ARCHIVE SIGNAL";
  return "FEATURED SIGNAL";
}

function getSystemKicker(event: any | undefined, eyebrow: string | undefined, slideInfo: SlideBannerInfo) {
  if (event) {
    return `${toSystemText(getSeriesLabel(event.series))} / ${getEventSignalLabel(event)}`;
  }

  return toSystemText(eyebrow || slideInfo.eyebrow || "FEATURED SIGNAL");
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

  return (
    <div
      key={headline}
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
      <div className="relative z-10 flex flex-col items-start gap-4 p-6 md:p-8">
        {/* Status Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {isLive && (
            <span className="event-system-chip rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-white backdrop-blur-md">
              Active Sale
            </span>
          )}
        </div>

        {/* Narrative Metadata */}
        <div className="flex w-full flex-col gap-3 pr-20">
          <span className="event-system-kicker text-[var(--monolith-red)]">
            {systemKicker}
          </span>
          <h3 className={cn(
            "event-system-headline max-w-[14ch] text-[clamp(2rem,7vw,3.85rem)] text-white text-balance",
            isJuly4thEvent && "july-4th-gradient"
          )}>
            {toSystemText(headline)}
          </h3>
          <span className="event-system-meta max-w-[34ch] border-t border-white/10 pt-3 text-white/60">
            {systemMeta}
          </span>
        </div>

        {showCountdown && (
          <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4 border-y border-white/10 py-3">
            <span className="event-system-chip text-white/45">
              Event Starts
            </span>
            <div className="event-system-chip flex items-center gap-2 text-white tabular-nums">
              <span>{countdown.days}D</span>
              <span className="text-white/25">/</span>
              <span>{padCountdown(countdown.hours)}H</span>
              <span className="text-white/25">/</span>
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
              <a className="flex h-12 w-full items-center justify-center rounded-none border border-white/20 bg-white text-[11px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-[var(--monolith-red)] hover:border-transparent">
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
      className="flex h-12 w-full items-center justify-center rounded-none border border-transparent bg-white text-[11px] font-black uppercase tracking-[0.3em] text-black transition-colors hover:bg-[var(--monolith-red)] hover:text-white"
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

  const sunsetsFallback = getSeriesEvents("chasing-sunsets")[0];
  const untoldFallback = getSeriesEvents("untold-story")[0];
  
  const targetDateFallback = slideInfo.label.includes("SUN(SETS)") 
    ? sunsetsFallback 
    : slideInfo.label.includes("UNTOLD") 
      ? untoldFallback 
      : featuredEvent;

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

  const [headlineCycle, setHeadlineCycle] = useState("MONOLITH");

  useEffect(() => {
    setHeadlineCycle("MONOLITH");
  }, []);

  const structuredData = featuredEvent ? <JsonLd data={buildScheduledEventSchema(featuredEvent, "/")} /> : null;

  return (
    <div className="bg-black flex h-[100dvh] flex-col">
      <section
        id="hero"
        className="relative h-full overflow-hidden bg-black md:screen-shell-stable"
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

        {/* 
            FLOATING EXPERIENTIAL CARD (The "Dope" Card) 
            Positioned as a persistent, high-fidelity overlay.
        */}
        <div className="absolute inset-x-0 bottom-0 z-50 p-6 md:p-12 pointer-events-none flex justify-center md:justify-end md:bottom-auto md:top-[var(--shell-page-top-hero)] md:h-full md:items-center">
          <div className="pointer-events-auto">
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

        {/* Main Impact Visuals (Center Focused) — always MONOLITH branding */}
        <div className="absolute inset-0 z-30 flex w-full flex-col items-center justify-start px-6 pb-16 pt-[calc(var(--shell-page-top-hero)+2rem)] text-center pointer-events-none md:justify-center md:p-6 md:pr-[500px]">
          <div className="flex w-full flex-col items-center justify-start md:items-start md:text-left">
            <div className="mb-6 relative md:mb-12">
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <h2 className="font-mono text-[11px] md:text-sm uppercase tracking-[0.8em] text-white/40">{getEventEyebrow(featuredEvent) || "Chicago Music Project"}</h2>
                <div className="h-px w-8 md:w-20 bg-white/10" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center md:items-start text-white">
              <h1
                key={headlineCycle}
                className={cn(
                  "font-heavy text-[clamp(2.5rem,15.5vw,11.5rem)] leading-[0.8] uppercase pointer-events-auto",
                  headlineCycle === "JULY 4TH" ? "july-4th-gradient" : "text-white"
                )}
              >
                <KineticDecryption text={headlineCycle} autoStart={false} />
              </h1>
              <div className="h-px w-full bg-gradient-to-r from-white/30 to-transparent my-6 lg:my-8" />
              <span className="font-mono text-[clamp(0.8rem,5vw,2.5rem)] leading-[1] tracking-[0.5em] uppercase text-white/90">PROJECT</span>
              <BrandTranslatorLabel className="mt-5" tone="neutral">Root Architecture / Events / Radio / Research</BrandTranslatorLabel>
              <p className="mt-6 max-w-sm text-center md:text-left font-mono text-[10px] uppercase tracking-[0.3em] text-white/50 md:mt-8 md:max-w-md md:text-sm md:tracking-[0.4em]">
                {HERO_SUBHEAD}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
