import { useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Instagram,
  Globe,
  MapPin,
  Music,
  Play,
  ArrowRight,
  Share2,
  Camera,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import WordScrubReveal from "@/components/ui/WordScrubReveal";
import MagneticButton from "@/components/MagneticButton";
import { ARTISTS } from "@/data/artists";
import { CTA_LABELS } from "@/lib/cta";
import { getEventPillToneClass } from "@/lib/ctaTone";
import { getSeriesEvents } from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import type { ScheduledEvent } from "@/data/events";
import { buildArtistSchema } from "@/lib/schema";

const LEGACY_ID_MAP: Record<string, string> = {
  "3": "lazare",
  "4": "joezi",
  "5": "autograf",
  chus: "joezi",
  "summers-uk": "sommers-uk",
};

function resolveArtistId(id: string | undefined) {
  if (!id) return undefined;
  if (ARTISTS[id]) return id;
  const legacy = LEGACY_ID_MAP[id];
  if (legacy && ARTISTS[legacy]) return legacy;
  return undefined;
}

export default function ArtistProfile() {
  usePublicSiteDataVersion();
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedId = resolveArtistId(id);
  const artist = resolvedId ? ARTISTS[resolvedId] : undefined;
  const canonicalArtistPath = resolvedId
    ? `/artists/${resolvedId}`
    : id
      ? `/artists/${id}`
      : "/lineup";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroImageY = useTransform(scrollYProgress, [0, 0.5], ["0%", "40%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]);

  useEffect(() => {
    if (!id || !resolvedId) return;
    if (id === resolvedId) return;
    setLocation(`/artists/${resolvedId}`, { replace: true });
  }, [id, resolvedId, setLocation]);

  if (!artist) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <SEO
          title="Artist Not Found"
          description="We couldn't find that artist profile."
        />
        <Navigation />
        <section className="h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <p className="font-mono text-[10px] tracking-[0.5em] text-white/70 uppercase mb-4">
            404 / Page Not Found
          </p>
          <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.9] uppercase mb-10">
            Profile Not Found
          </h1>
          <Link href="/lineup" asChild>
            <a className="btn-pill-monolith">Back to Lineup</a>
          </Link>
        </section>
      </div>
    );
  }

  const primarySeries = artist.series[0];
  const isWarmSeries = primarySeries === "chasing-sunsets";
  const accentColor = isWarmSeries
    ? "#E8B86D"
    : primarySeries === "untold-story"
      ? "#22D3EE"
      : "#E05A3A";
  const accentClass = isWarmSeries
    ? "text-clay"
    : primarySeries === "untold-story"
      ? "text-primary"
      : "text-primary-foreground";

  const mappedSeries = (
    primarySeries === "sunsets-radio" ? "monolith-project" : primarySeries
  ) as ScheduledEvent["series"];
  const nextSeriesEvent = getSeriesEvents(mappedSeries)[0];
  const primaryPillClass = getEventPillToneClass({ series: mappedSeries });
  const outlinePillClass = isWarmSeries
    ? "btn-pill-outline btn-pill-outline-sunsets"
    : primarySeries === "untold-story"
      ? "btn-pill-outline btn-pill-outline-untold"
      : "btn-pill-outline btn-pill-outline-monolith";

  const primaryAction =
    primarySeries === "untold-story"
      ? { href: "/tickets", label: CTA_LABELS.tickets }
      : { href: "/schedule", label: CTA_LABELS.schedule };

  const hasEvents = Boolean(artist.events?.length);
  const hasPreviousSets = Boolean(artist.previousSets?.length);
  const hasGallery = Boolean(artist.gallery?.length);
  const sectionNumber = (value: number) => String(value).padStart(2, "0");

  let currentSec = 1;
  const eventsSectionNumber = hasEvents ? sectionNumber(++currentSec) : "";
  const previousSetsSectionNumber = hasPreviousSets
    ? sectionNumber(++currentSec)
    : "";
  const gallerySectionNumber = hasGallery ? sectionNumber(++currentSec) : "";
  const videoSectionNumber = artist.featuredVideo
    ? sectionNumber(++currentSec)
    : "";
  const tracksSectionNumber = artist.tracks?.length
    ? sectionNumber(++currentSec)
    : "";

  const nextArtistEvent =
    artist.events?.find(
      e => e.status === "on-sale" || e.status === "upcoming"
    ) || artist.events?.[0];
  const sidebarEvent = nextArtistEvent
    ? {
        series:
          nextArtistEvent.series === "untold-story"
            ? "Untold Story"
            : nextArtistEvent.series === "chasing-sunsets"
              ? "Chasing Sun(Sets)"
              : "Special Booking",
        date: nextArtistEvent.date,
        venue: nextArtistEvent.venue,
        city: nextArtistEvent.city || "Chicago, IL",
        href:
          nextArtistEvent.ticketUrl ||
          nextArtistEvent.eventUrl ||
          primaryAction.href,
        label: nextArtistEvent.ticketUrl ? "Get Tickets" : "View Show",
        isExternal: Boolean(
          nextArtistEvent.ticketUrl &&
          nextArtistEvent.ticketUrl.startsWith("http")
        ),
      }
    : {
        series:
          primarySeries === "untold-story"
            ? "Untold Story"
            : "Chasing Sun(Sets)",
        date: nextSeriesEvent?.date || "August 2026",
        venue: nextSeriesEvent?.venue || "Reveal TBA",
        city: nextSeriesEvent?.location || "Chicago, IL",
        href: primaryAction.href,
        label: primaryAction.label,
        isExternal: false,
      };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-white selection:bg-white/20"
    >
      <SEO
        title={artist.name}
        description={artist.bio}
        image={artist.image}
        canonicalPath={canonicalArtistPath}
        schemaData={buildArtistSchema(artist, canonicalArtistPath)}
      />

      {/* Cinematic Navigation Shell */}
      <div className="fixed top-0 left-0 right-0 z-[100] transition-opacity duration-500">
        <Navigation variant="dark" />
      </div>

      {/* Hero Section: Parallax & Kinetic Fill */}
      <section className="relative h-[100svh] w-full flex items-end overflow-hidden pb-12 md:pb-32 px-4 md:px-6">
        <motion.div
          style={{ y: heroImageY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0 h-[140%] w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-transparent opacity-60 z-10" />
          <ResponsiveImage
            src={artist.image}
            alt={artist.name}
            priority
            sizes="100vw"
            style={{ objectPosition: artist.imagePosition }}
            className="w-full h-full object-cover object-center filter saturate-[0.8] brightness-[0.85]"
          />
        </motion.div>

        <div className="container layout-wide relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 mb-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className={`font-mono text-[10px] tracking-[0.5em] uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md`}
                style={{ color: accentColor, borderColor: `${accentColor}33` }}
              >
                {primarySeries.replace("-", " ")}
              </motion.span>
            </div>

            <h1 className="font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.8] uppercase mb-4 md:mb-6">
              {artist.name}
            </h1>

            {/* Premium Role Designation Under Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-8 md:mb-12 relative"
            >
              {artist.role === "HEADLINER" ? (
                <div className="flex flex-col gap-1">
                  <span className="hero-wordmark text-[clamp(1.25rem,3vw,2.5rem)] tracking-[0.3em] text-white uppercase leading-none">
                    Headliner Status
                  </span>
                  <span className="font-mono text-[10px] md:text-[10px] tracking-[0.5em] text-white/70 uppercase">
                    Featured booking in the Monolith roster
                  </span>
                </div>
              ) : artist.role === "RESIDENT" ? (
                <div className="flex flex-col gap-6 md:gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="hero-wordmark text-[clamp(1.75rem,5vw,4rem)] tracking-[0.1em] text-white uppercase leading-[0.9]">
                      Monolith Resident Artist
                    </span>
                    <div className="flex items-center gap-3 md:gap-4 mt-2">
                      <div className="h-px w-8 md:w-12 bg-white/40" />
                      <span className="font-mono text-[10px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] text-white uppercase font-bold">
                        Core resident
                      </span>
                    </div>
                  </div>

                  {/* High-Prestige Residency Metadata HUD Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 pt-6 border-t border-white/10 max-w-3xl">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] md:text-[10px] tracking-[0.3em] text-white/70 uppercase">
                        Residency
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase">
                        Season 01
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] md:text-[10px] tracking-[0.3em] text-white/70 uppercase">
                        Artist Role
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase">
                        Resident
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] md:text-[10px] tracking-[0.3em] text-white/70 uppercase">
                        Based In
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase truncate">
                        {artist.origin.split(",")[0]} /{" "}
                        {artist.origin.split(",")[1]?.trim() || "Global"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[10px] md:text-[10px] tracking-[0.3em] text-white/70 uppercase">
                        Status
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)] animate-pulse" />
                        <span className="font-mono text-[10px] tracking-[0.1em] text-white uppercase">
                          Active resident
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="font-mono text-[10px] tracking-[0.5em] text-white/70 uppercase">
                  {artist.role}
                </span>
              )}
            </motion.div>

            <div className="flex flex-wrap items-center gap-10 md:gap-16">
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase lowercase-none">
                    Based In
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3 opacity-40" /> {artist.origin}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase lowercase-none">
                    Sound
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                    <Music className="w-3 h-3 opacity-40" /> {artist.genre}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <MagneticButton strength={0.25}>
                  <Link href={primaryAction.href} asChild>
                    <a className={`${primaryPillClass} group`}>
                      {primaryAction.label}
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </a>
                  </Link>
                </MagneticButton>

                {artist.socials.instagram && (
                  <MagneticButton strength={0.3}>
                    <a
                      href={artist.socials.instagram}
                      target="_blank"
                      className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md hover:bg-white hover:text-black transition-all"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </MagneticButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute bottom-10 right-10 flex flex-col items-center gap-4 hidden md:flex"
        >
          <span className="font-mono text-[10px] tracking-[0.5em] text-white/70 uppercase vertical-rl">
            The Roster
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* Main Content: Bento Glass System */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container layout-wide grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left Content — Story & Tracks */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-32">
            {/* About Section */}
            <div className="space-y-12">
              <div className="flex items-center gap-4 text-white/70">
                <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                  01 / Concept
                </span>
                <div className="h-px w-20 bg-current" />
              </div>
              <WordScrubReveal
                text={artist.bio}
                className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-white/80 font-light text-balance"
              />
              <div className="flex flex-wrap gap-2 pt-6">
                {artist.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.02] font-mono text-[10px] tracking-[0.2em] uppercase text-white/70 hover:text-white hover:border-white/20 transition-all cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Upcoming Shows & Event Routing Section */}
            {artist.events && artist.events.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-white/70">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                    {eventsSectionNumber} / Scheduled Shows
                  </span>
                  <div className="h-px w-20 bg-current" />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {artist.events.map((evt, i) => (
                    <motion.div
                      key={evt.id || evt.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 md:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] hover:border-white/20 transition-all group relative overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 items-center">
                        {evt.cardImage && (
                          <div className="relative aspect-[9/16] max-w-[180px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl group-hover:border-white/30 transition-all">
                            <ResponsiveImage
                              src={evt.cardImage}
                              alt={evt.title}
                              sizes="180px"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="flex flex-col justify-between h-full">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[10px] tracking-[0.4em] uppercase px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">
                                {evt.badge || evt.status || "UPCOMING"}
                              </span>
                              <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
                                {evt.date}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] tracking-[0.3em] text-white/50 uppercase">
                              {evt.venue} · {evt.city || "Chicago, IL"}
                            </span>
                          </div>

                          <h3 className="font-display text-3xl md:text-4xl uppercase tracking-widest text-white mb-3">
                            {evt.title}
                          </h3>

                          {evt.description && (
                            <p className="font-serif text-lg leading-relaxed text-white/70 mb-6 max-w-2xl">
                              {evt.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                            {evt.ticketUrl && (
                              <MagneticButton strength={0.25}>
                                <a
                                  href={evt.ticketUrl}
                                  target={
                                    evt.ticketUrl.startsWith("http")
                                      ? "_blank"
                                      : "_self"
                                  }
                                  rel={
                                    evt.ticketUrl.startsWith("http")
                                      ? "noreferrer"
                                      : undefined
                                  }
                                  className="btn-pill-monolith group inline-flex items-center gap-2"
                                >
                                  <span>Get Tickets</span>
                                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                              </MagneticButton>
                            )}

                            {evt.eventUrl && (
                              <Link href={evt.eventUrl} asChild>
                                <a
                                  className={`${outlinePillClass} group inline-flex items-center gap-2`}
                                >
                                  <span>Show Details</span>
                                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous Sets Section */}
            {artist.previousSets && artist.previousSets.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-white/70">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                    {previousSetsSectionNumber} / Recorded Sets
                  </span>
                  <div className="h-px w-20 bg-current" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {artist.previousSets.map((set, i) => (
                    <motion.a
                      key={set.title}
                      href={set.url}
                      target="_blank"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-[#E8B86D] uppercase">
                          {set.date}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                      <h5 className="font-display text-2xl uppercase tracking-widest text-white mb-2">
                        {set.title}
                      </h5>
                      <p className="font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase">
                        Live Recording
                      </p>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {artist.gallery && artist.gallery.length > 0 && (
              <div className="space-y-12">
                <div className="flex flex-wrap items-center justify-between gap-4 text-white/70">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                      {gallerySectionNumber} /{" "}
                      {artist.galleryLabel ?? "Live Gallery"}
                    </span>
                    <div className="h-px w-20 bg-current" />
                  </div>
                  {artist.galleryCredit && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                      Photography · {artist.galleryCredit}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {artist.gallery.map((photo, i) => (
                    <motion.div
                      key={photo.src}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={`relative overflow-hidden rounded-2xl border border-white/5 group cursor-pointer ${
                        i === 0 ? "col-span-2 row-span-2" : ""
                      }`}
                    >
                      <ResponsiveImage
                        src={photo.src}
                        alt={photo.alt}
                        sizes={
                          i === 0
                            ? "(min-width: 1024px) 50vw, 100vw"
                            : "(min-width: 1024px) 25vw, 50vw"
                        }
                        className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-700 filter saturate-[0.85] group-hover:saturate-100"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="font-mono text-[10px] tracking-[0.3em] text-white/70 uppercase">
                          {photo.alt}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Video Section */}
            {artist.featuredVideo && (
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-white/70">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                    {videoSectionNumber} / Featured Live Set
                  </span>
                  <div className="h-px w-20 bg-current" />
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_32px_80px_rgba(0,0,0,0.45)]">
                  <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
                    <div className="relative aspect-video min-h-0 bg-black">
                      <YouTubeEmbed
                        url={artist.featuredVideo.url}
                        title={artist.featuredVideo.title}
                        className="absolute inset-0 h-full w-full"
                        loading="lazy"
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
                        style={{ backgroundColor: accentColor }}
                      />
                    </div>

                    <div className="flex flex-col justify-between gap-10 p-8 md:p-10">
                      <div>
                        <span
                          className="font-mono text-[10px] uppercase tracking-[0.35em]"
                          style={{ color: accentColor }}
                        >
                          Full Set · YouTube
                        </span>
                        <h3 className="mt-5 font-display text-3xl uppercase leading-none tracking-wider text-white">
                          {artist.featuredVideo.label}
                        </h3>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                          Published by {artist.featuredVideo.source}
                        </p>
                        <p className="mt-7 font-serif text-lg italic leading-relaxed text-white/70">
                          {artist.featuredVideo.description}
                        </p>
                      </div>

                      <a
                        href={artist.featuredVideo.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`${outlinePillClass} group self-start`}
                      >
                        <span>Watch on YouTube</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Tracks Section */}
            {artist.tracks.length > 0 && (
              <div className="space-y-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/70">
                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                      {tracksSectionNumber} / Selected Records
                    </span>
                    <div className="h-px w-20 bg-current" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                  {artist.tracks.map((track, i) => (
                    <div
                      key={track.title}
                      className="group flex items-center justify-between p-8 bg-[#050505] hover:bg-white/[0.02] transition-colors duration-500 cursor-pointer"
                    >
                      <div className="flex items-center gap-8">
                        <span className="font-mono text-xs text-white/70 group-hover:text-primary transition-colors">
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-xl md:text-2xl font-display uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">
                            {track.title}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase lowercase-none">
                            {artist.name} · MONOLITH SELECT
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-xs text-white/70">
                          {track.duration}
                        </span>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                          <Play className="w-4 h-4 text-white/70 group-hover:text-black fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content — Sidebar Glass Bento */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">
            {/* Next Event Card */}
            <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Share2 className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
              </div>
              <span className="ui-kicker text-white/70 mb-2 block lowercase-none">
                Next Event
              </span>
              <h4 className="font-display text-4xl uppercase tracking-widest text-white mb-10 leading-none">
                What&apos;s
                <br />
                Next
              </h4>

              <div className="space-y-8 border-y border-white/5 py-10 mb-10">
                {[
                  {
                    label: "Series",
                    value: sidebarEvent.series,
                  },
                  {
                    label: "Date",
                    value: sidebarEvent.date,
                  },
                  {
                    label: "Venue",
                    value: sidebarEvent.venue,
                  },
                  {
                    label: "City",
                    value: sidebarEvent.city,
                  },
                ].map(spec => (
                  <div key={spec.label} className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] tracking-[0.4em] text-white/70 uppercase lowercase-none">
                      {spec.label}
                    </span>
                    <span className="font-mono text-sm uppercase tracking-widest text-white/80">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {sidebarEvent.isExternal ? (
                <a
                  href={sidebarEvent.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${outlinePillClass} btn-pill-wide group flex items-center justify-between`}
                >
                  <span>{sidebarEvent.label}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <Link href={sidebarEvent.href} asChild>
                  <a
                    className={`${outlinePillClass} btn-pill-wide group flex items-center justify-between`}
                  >
                    <span>{sidebarEvent.label}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Link>
              )}
            </div>

            {/* Connection Card */}
            <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
              <span className="ui-kicker text-white/70 mb-8 block lowercase-none">
                Follow
              </span>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href={artist.socials.instagram}
                  target="_blank"
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white group transition-all duration-500"
                >
                  <Instagram className="w-6 h-6 text-white/70 group-hover:text-black transition-colors mb-3" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/70 group-hover:text-black transition-colors uppercase">
                    Instagram
                  </span>
                </a>
                <a
                  href={artist.socials.website}
                  target="_blank"
                  className="flex flex-col items-center justify-center p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white group transition-all duration-500"
                >
                  <Globe className="w-6 h-6 text-white/70 group-hover:text-black transition-colors mb-3" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/70 group-hover:text-black transition-colors uppercase">
                    Official Site
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-24">
        <EntityBoostStrip
          tone="dark"
          className="pb-12 border-t border-white/5 bg-[#050505]"
        />
      </section>
    </div>
  );
}
