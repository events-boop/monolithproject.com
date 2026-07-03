import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Camera,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import ChasingSunsetsDetails from "@/components/ChasingSunsetsDetails";
import ChasingSunsetsTicketing from "@/components/ChasingSunsetsTicketing";
import EpisodeGallery from "@/components/EpisodeGallery";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import VideoHeroSlider, { Slide } from "@/components/VideoHeroSlider";
import SEO from "@/components/SEO";
import useScrollSunset from "@/hooks/useScrollSunset";
import { useState } from "react";
import FixedTicketBadge from "@/components/FixedTicketBadge";
import ConversionStrip from "@/components/ConversionStrip";
import ResidentDJCard from "@/components/ResidentDJCard";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import EventFunnelStack from "@/components/EventFunnelStack";
import ConversionCTA from "@/components/ConversionCTA";
import EventCountdown from "@/components/EventCountdown";
import JoinSignalSection from "@/components/JoinSignalSection";
import Section from "@/components/layout/Section";
import ResponsiveImage from "@/components/ResponsiveImage";
import { archiveCollectionsBySlug } from "@/data/galleryData";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { CTA_LABELS } from "@/lib/cta";
import { CHASING_SUNSETS_DROP_URL } from "@/lib/dropLinks";
import {
  SUNSETS_JULY4_EVENT_ADDRESS,
  SUNSETS_JULY4_EVENT_TIME,
  SUNSETS_JULY4_EVENT_TITLE,
  SUNSETS_JULY4_LINEUP,
  SUNSETS_JULY4_TICKET_PATH,
  SUNSETS_TICKET_CTA_LABEL,
  captureSunsetsTicketCtaClick,
} from "@/lib/sunsetsTicketing";
import { appendAttributionQueryParams } from "@/lib/attribution";
import {
  getEventVenueLabel,
  getPrimaryTicketUrl,
  getSeriesExperienceEvent,
  getSeriesEvents,
  isTicketOnSale,
} from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import SplitText from "@/components/ui/SplitText";
import HorizonDiscMark from "@/components/HorizonDiscMark";

const chasingPosterImage = getResponsiveImage("chasingSunsets");
const chasingHeroImage = getResponsiveImage("chasingSunsets");

const CHASING_SUNSETS_SLIDES: Slide[] = [
  {
    type: "video",
    src: "/videos/hero-video-1.mp4",
    mobileSrc: "/videos/hero-video-1-mobile.mp4",
    poster: chasingPosterImage.src,
    posterSources: chasingPosterImage.sources,
    posterSizes: chasingPosterImage.sizes,
    caption: "THE MONOLITH PROJECT",
  },
  {
    type: "image",
    src: chasingHeroImage.src,
    sources: chasingHeroImage.sources,
    sizes: chasingHeroImage.sizes,
    alt: "July 4 · Castaways Atmosphere",
    caption: "CHASING SUN(SETS) | GOLDEN HOUR",
    className: "object-contain object-center",
  },
  {
    type: "image",
    src: "/images/chasing-sunsets-1.jpg",
    alt: "Rooftop Crowd at Sunset",
    caption: "CHASING SUN(SETS) | THE CROWD",
    className: "object-contain object-center",
  },
];

const CHASING_ANCHORS = [
  { label: "Hero", href: "#chasing-hero" },
  { label: "Format", href: "#chasing-concept" },
  { label: "Tickets", href: "#chasing-tickets" },
  { label: "Records", href: "#chasing-records" },
  { label: "Upcoming", href: "#chasing-upcoming" },
  { label: "Submit", href: "#chasing-submit" },
  { label: "FAQ", href: "#chasing-faq" },
  { label: "Updates", href: "#chasing-funnel" },
];

const CHASING_ARCHIVE_ENTRIES = [
  {
    ...archiveCollectionsBySlug["chasing-sunsets-season-iii"],
    href: "/chasing-sunsets/season-iii",
  },
  {
    ...archiveCollectionsBySlug["chasing-sunsets-season-ii"],
    href: "/chasing-sunsets/season-ii",
  },
  {
    ...archiveCollectionsBySlug["chasing-sunsets-season-i"],
    href: "/chasing-sunsets/season-i",
  },
];

function getStatusLabel(status: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  return "PAST";
}

function isExternalUrl(url?: string | null) {
  return !!url && (/^https?:\/\//i.test(url) || url.startsWith("/go/"));
}

function shouldOpenInNewTab(url?: string | null) {
  return !!url && /^https?:\/\//i.test(url);
}

function trackSunsetsTicketLink(
  href?: string | null,
  ctaPosition: "primary" | "secondary" = "secondary"
) {
  if (href !== SUNSETS_JULY4_TICKET_PATH) return;
  captureSunsetsTicketCtaClick({
    destinationUrl: appendAttributionQueryParams(href),
    pagePath: "/chasing-sunsets",
    ctaPosition,
  });
}

export default function ChasingSunsets() {
  usePublicSiteDataVersion();
  useScrollSunset();
  const [activeTab, setActiveTab] = useState<"live" | "residents">("live");
  const [faqOpen, setFaqOpen] = useState(false);
  const chasingEvents = getSeriesEvents("chasing-sunsets");
  const featuredChasingEvent = getSeriesExperienceEvent(
    "chasing-sunsets",
    "hero"
  );
  const chasingFunnelEvent =
    (featuredChasingEvent?.activeFunnels?.length
      ? featuredChasingEvent
      : undefined) ?? chasingEvents.find(event => event.activeFunnels?.length);
  const featuredArchive = CHASING_ARCHIVE_ENTRIES[0];
  const primarySeasonHref =
    getPrimaryTicketUrl(featuredChasingEvent) || "/schedule";
  const primarySeasonExternal = isExternalUrl(primarySeasonHref);

  const chasingFaqs = [
    [
      "Where are the events located?",
      "The series moves through rooftop, shoreline, and open-air Chicago rooms. The exact chapter is always tied to the date release.",
    ],
    [
      "What time should I arrive?",
      "Golden hour. The full point of the series is the transition from daylight into city glow, so late arrival misses part of the format.",
    ],
    [
      "Are tickets sold at the door?",
      "Usually no. We treat this as a capacity-managed summer room, so the strongest move is always to get on the drop list before public sale.",
    ],
    [
      "What is the dress code?",
      "Elevated but relaxed. Dress for weather, movement, and a room that starts in the sun before it finishes at night.",
    ],
    [
      "What happens if it rains?",
      "SUN(SETS) is a rain-or-shine event — a little rain won't stop the lake. Lightning or severe weather may cause a temporary pause for safety, then we resume when cleared. We're watching the weather closely with venue and production, and real-time updates post to @chasingsunsets.music. Refunds are issued only if the event is canceled in full.",
    ],
  ] as const;

  return (
    <div className="relative min-h-screen bg-noise selection:text-white sunset-page">
      <SEO
        title="SUN(SETS) I — July 4th at Castaways | Chasing Sun(Sets)"
        description="SUN(SETS) I brings Autograf, Kiko Franco, Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar to Castaways Beach Club on July 4th, 2026. Tickets on sale now."
        absoluteTitle
        canonicalPath="/chasing-sunsets"
        image="/images/chasing-sunsets-premium.webp"
      />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black/95">
        <div
          className="absolute left-[-20%] top-[-10%] h-[60rem] w-[60rem] rounded-full opacity-30 mix-blend-screen animate-pulse duration-[10000ms]"
          style={{
            background:
              "radial-gradient(circle, var(--color-sunsets-auburn) 0%, transparent 60%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[-20%] h-[50rem] w-[50rem] rounded-full opacity-25 mix-blend-screen animate-pulse duration-[15000ms]"
          style={{
            background:
              "radial-gradient(circle, var(--color-sunsets-gold) 0%, transparent 60%)",
            filter: "blur(100px)",
          }}
        />
      </div>
      <Navigation variant="dark" brand="chasing-sunsets" />

      <main id="main-content" tabIndex={-1}>
        <section
          id="chasing-hero"
          data-featured-event-id={featuredChasingEvent?.id}
          aria-labelledby="chasing-hero-title"
          className="hero-shell-start relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-black/40 backdrop-blur-sm px-6 pb-16 pt-24 screen-shell-stable sm:justify-end sm:pb-28 sm:pt-0"
        >
          <VideoHeroSlider slides={CHASING_SUNSETS_SLIDES} />
          <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.8)_100%)]" />

          <div className="container layout-default relative z-20 mt-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-auto"
            >
              <div className="mb-5 hidden max-w-full flex-wrap items-center gap-2 border border-[#E8B86D]/40 bg-white/[0.05] px-3 py-2 shadow-[0_0_30px_rgba(232,184,109,0.15)] backdrop-blur-xl sm:mb-7 sm:inline-flex sm:px-4 rounded-full hover:bg-white/[0.1] transition-colors">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8B86D]">
                  SUN(SETS) I
                </span>
                <span className="h-1 w-1 rounded-full bg-[#E8B86D]/70" />
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#E8B86D]">
                  Chasing Sun(Sets)
                </span>
              </div>
              <HorizonDiscMark className="mb-5 h-12 w-12 sm:mb-7 sm:h-14 sm:w-14" />
              <span
                data-chasing-episode="true"
                className="mb-3 block font-mono text-xs uppercase tracking-[0.22em] text-white/90 sm:mb-5 sm:text-sm"
              >
                {featuredChasingEvent
                  ? featuredChasingEvent.episode
                  : "SUN(SETS) I"}
              </span>
              <h1
                id="chasing-hero-title"
                className="font-display mb-4 flex flex-col text-[clamp(3.15rem,9.2vw,9rem)] uppercase leading-[0.82] tracking-[0] bg-gradient-to-br from-[#fbf5ed] via-[#e8b86d] to-[#c2703e] bg-clip-text text-transparent drop-shadow-[0_10px_40px_rgba(232,184,109,0.3)] sm:mb-5"
              >
                {["CHASING", "SUN(SETS)"].map((line, i) => (
                  <motion.span
                    key={`${line}-${i}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.72,
                      delay: 0.08 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>
              {featuredChasingEvent ? (
                <p className="mb-6 max-w-2xl font-mono text-xs uppercase tracking-[0.2em] text-[#E8B86D] sm:mb-7 sm:text-sm">
                  {featuredChasingEvent.headline || SUNSETS_JULY4_EVENT_TITLE}
                </p>
              ) : null}
              <BrandTranslatorLabel className="mb-4 sm:mb-6" tone="warm">
                An Open-Air Monolith Series
              </BrandTranslatorLabel>

              <div className="max-w-2xl">
                <p className="mb-4 text-base leading-relaxed text-white/92 sm:text-lg">
                  Chasing Sun(Sets) returns home to the lake this July 4th at
                  Castaways Beach Club. Golden hour. House music. Lake Michigan.
                  The skyline behind you.
                </p>
                <p className="mb-4 max-w-xl text-sm font-semibold uppercase tracking-[0.16em] text-[#E8B86D]">
                  Watch the sun. Stay for the sets.
                </p>
                {featuredChasingEvent ? (
                  <div
                    data-chasing-meta="true"
                    className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-[#E8B86D] sm:mb-8 sm:gap-x-6 sm:text-[11px]"
                  >
                    <span>{featuredChasingEvent.date}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{SUNSETS_JULY4_EVENT_TIME}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{getEventVenueLabel(featuredChasingEvent)}</span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span>{SUNSETS_JULY4_LINEUP.join(" · ")}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row">
                <ConversionCTA
                  event={featuredChasingEvent}
                  size="lg"
                  showUrgency={true}
                />
                <MagneticButton strength={0.22}>
                  <a
                    href="#chasing-concept"
                    className="btn-pill-secondary group"
                  >
                    Explore Series
                    <ArrowRight
                      size={14}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </a>
                </MagneticButton>
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {[
                  "Autograf",
                  "Kiko Franco",
                  "The Lake Has A Limit",
                  "Tables From $2,000",
                ].map(pill => (
                  <span
                    key={pill}
                    className="border border-white/32 bg-black/35 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/90 backdrop-blur sm:text-xs"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <SeasonAnchorNav
          items={CHASING_ANCHORS}
          tone="warm"
          className="-mt-7 mb-5"
        />
        {featuredChasingEvent ? (
          <EventCountdown event={featuredChasingEvent} />
        ) : null}

        <Section
          width="wide"
          spacing="tight"
          borderTop="border-t border-[#E8B86D]/18"
          bg="sunset-lively-strip"
        >
          <div className="grid gap-4 lg:grid-cols-12">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sunset-lively-card sunset-lively-card-feature lg:col-span-6 p-6 backdrop-blur-2xl bg-white/[0.03] border border-white/10 hover:border-[#E8B86D]/40 transition-colors duration-500 shadow-[0_0_50px_rgba(232,184,109,0.05)] rounded-2xl md:p-8"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.34em] sunset-accent">
                Next Chapter
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.6rem,4.45vw,4.15rem)] uppercase leading-[0.88] sunset-text">
                {featuredChasingEvent?.headline ||
                  featuredChasingEvent?.title ||
                  "Season 2026"}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed sunset-text-70 md:text-lg">
                SUN(SETS) I opens the 2026 lakefront chapter on July 4 at
                Castaways. The ticket ladder is live: early arrival, Lake List
                first access, public GA tiers, group bundles, and a separate
                table/cabana rail.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="rounded-full border border-[#E8B86D]/18 bg-white/78 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] sunset-text-70">
                  {featuredChasingEvent?.date || "Date TBA"}
                </span>
                <span className="rounded-full border border-[#E8B86D]/22 bg-white/78 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] sunset-text-70">
                  {featuredChasingEvent
                    ? getEventVenueLabel(featuredChasingEvent)
                    : "Chicago"}
                </span>
                <span className="sunset-coral-chip rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em]">
                  {featuredChasingEvent
                    ? getStatusLabel(featuredChasingEvent.status)
                    : "Season Tracking"}
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {primarySeasonExternal ? (
                  <a
                    href={primarySeasonHref}
                    target={
                      shouldOpenInNewTab(primarySeasonHref)
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      shouldOpenInNewTab(primarySeasonHref)
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={() =>
                      trackSunsetsTicketLink(primarySeasonHref, "secondary")
                    }
                    className="btn-pill-sunsets inline-flex items-center justify-center"
                  >
                    {isTicketOnSale(featuredChasingEvent)
                      ? SUNSETS_TICKET_CTA_LABEL
                      : "Open Featured Chapter"}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={primarySeasonHref}
                    onClick={() =>
                      trackSunsetsTicketLink(primarySeasonHref, "secondary")
                    }
                    className="btn-pill-sunsets inline-flex items-center justify-center"
                  >
                    {isTicketOnSale(featuredChasingEvent)
                      ? SUNSETS_TICKET_CTA_LABEL
                      : "Open Featured Chapter"}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
                <a
                  href="#chasing-tickets"
                  className="btn-pill-outline btn-pill-outline-sunsets-light inline-flex items-center justify-center"
                >
                  Season Release Structure
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </motion.article>

            {[
              {
                kicker: "Archive",
                title: "Season Records",
                body: "Past summers, proof of room, and the lakefront story that built the return.",
                href: "#chasing-records",
              },
              {
                kicker: "Schedule",
                title: "Set Times",
                body: "Doors at 12PM. Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar build the day — Autograf and Kiko Franco take sunset.",
                href: "#chasing-tickets",
              },
              {
                kicker: "VIP Rail",
                title: "Tables",
                body: "6 premium cabanas and limited tables start at a $2,000 minimum.",
                href: "/vip",
              },
            ].map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="sunset-lively-card lg:col-span-2 p-6 backdrop-blur-2xl bg-white/[0.03] border border-white/10 hover:border-[#E8B86D]/40 hover:bg-white/[0.06] transition-all duration-500 rounded-2xl group"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] sunset-accent">
                  {card.kicker}
                </span>
                <h3 className="mt-4 font-display text-[clamp(1.45rem,1.45vw,1.9rem)] uppercase leading-[0.92] sunset-text">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed sunset-text-60">
                  {card.body}
                </p>
                <a
                  href={card.href}
                  className="mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] sunset-text transition-colors hover:text-[#E8B86D]"
                >
                  Open
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section
          id="chasing-concept"
          width="wide"
          scrollAnchor
          borderTop="border-t border-[#E8B86D]/14"
          bg="bg-black/40 backdrop-blur-xl"
        >
          <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] sunset-accent block mb-4">
                The Format
              </span>
              <h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.86] sunset-text uppercase">
                Sunset To
                <br />
                <span className="font-serif italic normal-case text-[#E8B86D]">
                  city glow
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
            >
              <article className="border border-[#E8B86D]/16 bg-white/72 p-6 shadow-[0_20px_48px_rgba(44,24,16,0.06)] md:p-8">
                <p className="text-lg leading-relaxed sunset-text-80">
                  This July 4th, The Monolith Project brings Chasing Sun(Sets)
                  back to where the story belongs: the Chicago lakefront. A
                  full-day house music experience moves from daytime energy into
                  golden hour and the final sunset set.
                </p>
                <p className="mt-5 leading-relaxed sunset-text-70">
                  This is not a holiday party. It is the return of a Chicago
                  summer ritual: open air, skyline views, house music, and a
                  crowd built around connection.
                </p>
              </article>

              <article className="border border-[#E8B86D]/24 bg-[linear-gradient(135deg,rgba(20,184,166,0.12),rgba(255,255,255,0.9)_52%,rgba(139,92,246,0.08))] p-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8B86D]">
                  Season Logic
                </span>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed sunset-text-70">
                  <li>Tickets move by clean public tier logic.</li>
                  <li>First Access stays hidden with code SUNSET26.</li>
                  <li>Tables and cabanas stay separate from GA inventory.</li>
                  <li>No fake scarcity language: the lake has a limit.</li>
                  <li>{SUNSETS_JULY4_EVENT_ADDRESS}</li>
                </ul>
              </article>
            </motion.div>
          </div>
        </Section>

        <div id="chasing-manifesto" className="scroll-shell-target">
          <ChasingSunsetsDetails />
        </div>

        <div
          id="chasing-tickets"
          data-featured-event-id={featuredChasingEvent?.id}
          className="scroll-shell-target"
        >
          <ChasingSunsetsTicketing
            featuredEvent={featuredChasingEvent}
            seasonEvents={chasingEvents}
          />
        </div>

        <section className="relative z-20 border-t border-[#E8B86D]/14 bg-[linear-gradient(180deg,rgba(251,245,237,0.98),rgba(244,233,214,0.94))] px-6 py-24">
          <div className="layout-default">
            <EpisodeGallery
              series="chasing-sunsets"
              season="Season III"
              episode="Episode III"
              title="THE SHORE"
              subtitle="Boat club and beach chapters"
              description="The latest visual cut from the shoreline run. Proof of crowd, booth, horizon, and the final push into night."
              accentColor="#E8B86D"
              images={[
                {
                  src: "/images/archive/chasing-sunsets/css-s3-1.jpg",
                  alt: "Chasing SunSets Shoreline",
                  label: "Open Air",
                },
                {
                  src: "/images/archive/chasing-sunsets/css-s3-4.jpg",
                  alt: "Chasing SunSets Booth",
                  label: "The Booth",
                },
                {
                  src: "/images/archive/chasing-sunsets/css-s3-7.jpg",
                  alt: "Chasing SunSets Vibe",
                  label: "Atmosphere",
                },
                {
                  src: "/images/archive/chasing-sunsets/css-s3-9.jpg",
                  alt: "Chasing SunSets Finale",
                  label: "Finale",
                },
              ]}
            />
          </div>
        </section>

        <Section
          as="div"
          id="chasing-records"
          width="wide"
          scrollAnchor
          borderTop="border-t border-[#E8B86D]/14"
          bg="bg-[#1a1a1a]"
        >
          <div className="flex flex-col gap-6 border-b border-[#E8B86D]/14 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#E8B86D]">
                Season Records
              </span>
              <h2 className="section-display-title-compact mt-3 max-w-[8ch] sunset-text">
                SUMMER ARCHIVE
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed sunset-text-60 md:text-base">
                Chasing-only galleries, newest first. The archive now reads like
                a continuing season deck instead of a mixed Monolith shelf.
              </p>
            </div>
            <Link
              href="/archive"
              className="btn-pill-outline btn-pill-outline-sunsets-light inline-flex items-center justify-center self-start md:self-auto"
            >
              View Full Archive
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {CHASING_ARCHIVE_ENTRIES.map((entry, index) => (
              <motion.article
                key={entry.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  href={entry.href}
                  className="group block overflow-hidden border border-[#E8B86D]/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,247,236,0.74))] shadow-[0_20px_48px_rgba(44,24,16,0.06)] transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-[#E8B86D]/14 bg-black">
                    <ResponsiveImage
                      src={entry.coverImage}
                      alt={`${entry.title} ${entry.subtitle}`}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/82 backdrop-blur-sm">
                      {entry.date}
                    </div>
                    <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/78 backdrop-blur-sm">
                      <Camera className="h-3.5 w-3.5" />
                      {entry.media.length} Frames
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#E8B86D]">
                      {entry.subtitle}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(2rem,3vw,2.8rem)] uppercase leading-[0.92] sunset-text">
                      {entry.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed sunset-text-60 md:text-base">
                      {entry.description}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] sunset-text transition-colors group-hover:text-[#E8B86D]">
                      Open Gallery
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </Section>

        <Section
          id="chasing-upcoming"
          width="wide"
          scrollAnchor
          borderTop="border-t border-[#E8B86D]/14"
          bg="bg-[linear-gradient(180deg,rgba(244,233,214,0.9),rgba(251,245,237,0.96))]"
        >
          <div className="mb-16 flex flex-col gap-6 border-b border-[#E8B86D]/14 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => setActiveTab("live")}
                className={`px-5 py-3 font-display text-xl uppercase tracking-wide transition-colors md:text-3xl ${
                  activeTab === "live"
                    ? "border border-[#E8B86D]/20 bg-white/60 text-[#2C1810]"
                    : "border border-transparent bg-transparent text-[#2C1810]/45 hover:text-[#2C1810]/75"
                }`}
                data-cursor-text="LIVE"
              >
                LIVE EVENTS
              </button>
              <button
                onClick={() => setActiveTab("residents")}
                className={`px-5 py-3 font-display text-xl uppercase tracking-wide transition-colors md:text-3xl ${
                  activeTab === "residents"
                    ? "border border-[#E8B86D]/20 bg-white/60 text-[#2C1810]"
                    : "border border-transparent bg-transparent text-[#2C1810]/45 hover:text-[#2C1810]/75"
                }`}
                data-cursor-text="DJS"
              >
                RESIDENT DJS
              </button>
            </div>
            <span className="font-mono text-xs tracking-widest sunset-accent">
              SEASON 2026
            </span>
          </div>

          {activeTab === "live" ? (
            <div className="space-y-4">
              {chasingEvents.length > 0 ? (
                chasingEvents.map(event => {
                  const [month, day] = event.date.replace(",", "").split(" ");
                  const eventLabel =
                    event.headline || `${event.title} · ${event.episode}`;

                  return (
                    <div
                      key={event.id}
                      className="group rounded-[1.75rem] border border-[#E8B86D]/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,247,236,0.72))] p-7 shadow-[0_20px_48px_rgba(44,24,16,0.06)] transition-transform duration-500 hover:-translate-y-1 md:p-8"
                    >
                      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="flex items-start gap-5">
                          <div className="flex h-16 w-16 flex-col items-center justify-center border border-[#E8B86D]/20 bg-white/75">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E8B86D]">
                              {month.substring(0, 3).toUpperCase()}
                            </span>
                            <span className="font-display text-xl sunset-text">
                              {day}
                            </span>
                          </div>
                          <div>
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#E8B86D]">
                              {event.episode}
                            </p>
                            <h3 className="mb-2 font-display text-[clamp(1.8rem,3vw,2.7rem)] uppercase leading-[0.92] sunset-text transition-colors group-hover:text-[#E8B86D]">
                              {eventLabel}
                            </h3>
                            <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.22em] sunset-text-60">
                              <span className="flex items-center gap-1.5">
                                <MapPin size={12} className="text-[#E8B86D]" />{" "}
                                {getEventVenueLabel(event)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar
                                  size={12}
                                  className="text-[#E8B86D]"
                                />{" "}
                                {event.time}
                              </span>
                              <span className="sunset-teal-chip rounded-full border px-3 py-1 text-[9px] font-black tracking-[0.2em]">
                                {getStatusLabel(event.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full lg:w-auto">
                          {isTicketOnSale(event) ? (
                            (() => {
                              const ticketHref =
                                getPrimaryTicketUrl(event) || "/tickets";
                              const ticketExternal = isExternalUrl(ticketHref);

                              return ticketExternal ? (
                                <a
                                  href={ticketHref}
                                  target={
                                    shouldOpenInNewTab(ticketHref)
                                      ? "_blank"
                                      : undefined
                                  }
                                  rel={
                                    shouldOpenInNewTab(ticketHref)
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  onClick={() =>
                                    trackSunsetsTicketLink(
                                      ticketHref,
                                      "secondary"
                                    )
                                  }
                                  className="btn-pill-sunsets btn-pill-compact w-full justify-center"
                                >
                                  {event.id === "css-jul04"
                                    ? SUNSETS_TICKET_CTA_LABEL
                                    : CTA_LABELS.tickets}{" "}
                                  <ArrowUpRight size={14} />
                                </a>
                              ) : (
                                <Link
                                  href={ticketHref}
                                  onClick={() =>
                                    trackSunsetsTicketLink(
                                      ticketHref,
                                      "secondary"
                                    )
                                  }
                                  className="btn-pill-sunsets btn-pill-compact w-full justify-center"
                                >
                                  {event.id === "css-jul04"
                                    ? SUNSETS_TICKET_CTA_LABEL
                                    : CTA_LABELS.tickets}{" "}
                                  <ArrowUpRight size={14} />
                                </Link>
                              );
                            })()
                          ) : (
                            <Link href="/newsletter" asChild>
                              <a className="btn-pill-outline btn-pill-outline-sunsets-light btn-pill-compact w-full justify-center">
                                {CTA_LABELS.innerCircle}{" "}
                                <ArrowUpRight size={14} />
                              </a>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-[1.75rem] border border-[#E8B86D]/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(255,247,236,0.72))] p-10 text-center shadow-[0_20px_48px_rgba(44,24,16,0.06)]">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] sunset-accent">
                    Season 2026
                  </p>
                  <h3 className="mb-4 font-display text-3xl sunset-text">
                    Season Dates Incoming
                  </h3>
                  <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed sunset-text-70">
                    The next open-air dates are being finalized. Join the
                    newsletter to hear about them before the public release.
                  </p>
                  <Link href="/newsletter" asChild>
                    <a className="btn-pill-outline btn-pill-outline-sunsets-light btn-pill-compact group">
                      {CTA_LABELS.innerCircle} <ArrowUpRight size={14} />
                    </a>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <ResidentDJCard />
          )}
        </Section>

        <Section
          id="chasing-submit"
          width="wide"
          scrollAnchor
          borderTop="border-t border-[#E8B86D]/14"
          bg="bg-[#1a1a1a]"
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] sunset-accent block mb-4">
                For The Selectors
              </span>
              <h2 className="font-display text-[clamp(3rem,6vw,6rem)] uppercase leading-[0.88] sunset-text">
                SUBMIT YOUR{" "}
                <span className="font-serif italic normal-case text-[#E8B86D]">
                  set
                </span>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed sunset-text-80">
                Chasing Sun(Sets) is built for golden-hour pacing. If your mix
                fits melodic, organic, or afro house in an open-air setting,
                send it through.
              </p>
            </div>
            <div className="border border-[#E8B86D]/16 bg-white/72 p-6 shadow-[0_18px_44px_rgba(44,24,16,0.06)] md:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8B86D]">
                What Helps
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed sunset-text-70">
                <li>Share a mix that already sounds right at sunset.</li>
                <li>Include where you have played and what rooms fit you.</li>
                <li>
                  Keep the pacing patient. This series is not built for
                  all-peak-all-night energy.
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <MagneticButton strength={0.4}>
                  <a
                    href="mailto:music@monolithproject.com?subject=Chasing Sun(Sets) Submission"
                    className="btn-pill-sunsets group inline-flex items-center justify-center"
                  >
                    Submit A Mix{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </MagneticButton>
                <a
                  href={appendAttributionQueryParams(CHASING_SUNSETS_DROP_URL)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill-outline btn-pill-outline-sunsets-light inline-flex items-center justify-center"
                >
                  Join The Drop
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="chasing-faq"
          width="wide"
          scrollAnchor
          borderTop="border-t border-[#E8B86D]/14"
          bg="bg-[linear-gradient(180deg,rgba(244,233,214,0.9),rgba(251,245,237,0.96))]"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#E8B86D]">
                House Rules
              </span>
              <h2 className="section-display-title-compact mt-3 max-w-[8ch] sunset-text">
                FAQ / ACCESS
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed sunset-text-60 md:text-base">
                The route closes with the practical layer: ticket tiers, arrival
                windows, table rules, and venue policy.
              </p>
            </div>

            <div>
              <button
                onClick={() => setFaqOpen(!faqOpen)}
                className="group flex w-full items-center justify-between border border-[#E8B86D]/16 bg-white/76 p-6 text-left shadow-[0_18px_44px_rgba(44,24,16,0.06)] transition-colors hover:bg-white md:p-8"
              >
                <span className="font-display text-xl uppercase tracking-wide sunset-text md:text-2xl">
                  Frequently Asked Questions
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8B86D]/18 bg-[#1a1a1a] transition-transform duration-500 group-hover:scale-110">
                  <div
                    className={`relative h-4 w-4 origin-center transition-transform duration-500 ${faqOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-[#E8B86D]" />
                    <span
                      className={`absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-[#E8B86D] transition-transform duration-500 ${faqOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
                    />
                  </div>
                </span>
              </button>

              <AnimatePresence>
                {faqOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-4 pt-6 md:grid-cols-2">
                      {chasingFaqs.map(([question, answer], idx) => (
                        <motion.details
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.08 + idx * 0.04,
                            duration: 0.35,
                          }}
                          key={question}
                          className="group border border-[#E8B86D]/14 bg-white/72 px-6 py-5 shadow-[0_14px_34px_rgba(44,24,16,0.05)]"
                        >
                          <summary className="list-none flex items-center justify-between outline-none sunset-text cursor-pointer">
                            <span className="pr-4 font-medium">{question}</span>
                            <span className="flex-shrink-0 text-[#E8B86D] transition-transform duration-300 group-open:rotate-45">
                              <span className="relative block h-[2px] w-3 bg-current">
                                <span className="absolute left-1/2 top-1/2 block h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-current transition-opacity group-open:opacity-0" />
                              </span>
                            </span>
                          </summary>
                          <p className="mt-4 border-t border-[#E8B86D]/12 pt-4 text-sm leading-relaxed sunset-text-60">
                            {answer}
                          </p>
                        </motion.details>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </Section>

        {chasingFunnelEvent ? (
          <div
            id="chasing-funnel"
            className="scroll-shell-target relative z-10 mb-20 w-full overflow-hidden md:mb-24"
          >
            <EventFunnelStack eventId={chasingFunnelEvent.id} />
          </div>
        ) : null}
      </main>

      <JoinSignalSection tone="warm" />
      <ConversionStrip event={chasingFunnelEvent || undefined} tone="warm" />
      <FixedTicketBadge />
    </div>
  );
}
