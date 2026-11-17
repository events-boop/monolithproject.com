import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  Globe,
  MapPin,
  Music,
  Play,
  Pause,
  Bookmark,
  Headphones,
  ArrowLeft,
  ArrowRight,
  Camera,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import MagneticButton from "@/components/MagneticButton";
import { ARTISTS } from "@/data/artists";
import { getEventPillToneClass } from "@/lib/ctaTone";
import { getSeriesLabel } from "@/lib/siteExperience";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import {
  eventIncludesArtist,
  getArtistAudioTrack,
  getArtistRecording,
} from "@/lib/artistEventDiscovery";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { toggleSavedArtist, useSavedPassport } from "@/lib/savedPassport";
import { getEventDetailsHref } from "@/lib/cta";
import { getScheduleVenue } from "@/lib/schedulePresentation";
import type { ScheduledEvent } from "@/data/events";
import type { MediaItem } from "@/data/galleryData";
import { buildArtistSchema } from "@/lib/schema";

const GalleryLightbox = lazy(() => import("@/components/GalleryLightbox"));

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
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const audio = useOptionalGlobalAudio();
  const passport = useSavedPassport();

  const resolvedId = resolveArtistId(id);
  const artist = resolvedId ? ARTISTS[resolvedId] : undefined;
  const canonicalArtistPath = resolvedId
    ? `/artists/${resolvedId}`
    : id
      ? `/artists/${id}`
      : "/lineup";

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
          noIndex
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
  const primaryPillClass = getEventPillToneClass({ series: mappedSeries });
  const outlinePillClass = isWarmSeries
    ? "btn-pill-outline btn-pill-outline-sunsets"
    : primarySeries === "untold-story"
      ? "btn-pill-outline btn-pill-outline-untold"
      : "btn-pill-outline btn-pill-outline-monolith";

  const hasEvents = Boolean(artist.events?.length);
  const hasPreviousSets = Boolean(artist.previousSets?.length);
  const hasPublishedSets = Boolean(artist.previousSets?.some(set => set.url));
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

  const appearances = getPublicEvents().filter(event =>
    eventIncludesArtist(event, artist)
  );
  const nextAppearance =
    appearances.find(
      event =>
        event.eventStatus === "EventPostponed" ||
        event.status === "on-sale" ||
        event.status === "coming-soon"
    ) || appearances[0];
  const appearancePostponed = nextAppearance?.eventStatus === "EventPostponed";
  const appearancePending = nextAppearance?.confirmationStatus === "pending";
  const appearancePast =
    nextAppearance?.status === "past" && !appearancePostponed;
  const sidebarEvent = {
    series: nextAppearance
      ? getSeriesLabel(nextAppearance.series)
      : "The Monolith Project",
    date: appearancePostponed
      ? "Replacement date to be announced"
      : appearancePending
        ? "Date to be announced"
        : nextAppearance?.date || "No announced appearance",
    venue: appearancePostponed
      ? "Replacement venue to be announced"
      : nextAppearance
        ? getScheduleVenue(nextAppearance)
        : "See the current calendar",
    city: nextAppearance?.location || "Chicago",
    href: appearancePostponed
      ? "/sunsets#event-update"
      : nextAppearance
        ? getEventDetailsHref(nextAppearance)
        : "/schedule",
    label: appearancePostponed
      ? "Read show update"
      : appearancePast
        ? "View past appearance"
        : nextAppearance
          ? "View show details"
          : "Explore the calendar",
    isExternal: false,
  };
  const artistRecording = getArtistRecording(artist);
  const inlineAudioTrack = getArtistAudioTrack(artist);
  const isArtistSaved = Boolean(
    resolvedId && passport.artists.includes(resolvedId)
  );
  const isArtistTrackActive = Boolean(
    inlineAudioTrack && audio?.activeTrack?.src === inlineAudioTrack.src
  );
  const isArtistTrackPlaying = Boolean(isArtistTrackActive && audio?.isPlaying);
  const recordingHref = artist.featuredVideo
    ? "#artist-recording"
    : hasPublishedSets
      ? "#artist-recordings"
      : artistRecording?.href || "/radio";
  const recordingLabel = artist.featuredVideo
    ? "Watch a recorded set"
    : hasPublishedSets
      ? "Explore set links"
      : artistRecording?.label || "Explore the radio";
  const socialLinks = [
    { label: "Instagram", href: artist.socials.instagram, icon: Instagram },
    { label: "Official site", href: artist.socials.website, icon: Globe },
    { label: "SoundCloud", href: artist.socials.soundcloud, icon: Music },
    { label: "Spotify", href: artist.socials.spotify, icon: Music },
  ].filter(link => link.href);

  const galleryMedia: MediaItem[] = (artist.gallery ?? []).map(
    (photo, index) => ({
      id: `${artist.id}-gallery-${index}`,
      kind: "image" as const,
      src: photo.src,
      width: 2560,
      height: 3840,
      alt: photo.alt,
      caption: photo.alt,
      credit: artist.galleryCredit,
    })
  );

  return (
    <div
      ref={containerRef}
      className="artist-profile-page min-h-screen bg-[#050505] text-white selection:bg-white/20"
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

      <main id="main-content" tabIndex={-1}>
        <section className="artist-editorial-hero container layout-wide">
          <Link href="/artists" className="artist-roster-back">
            <ArrowLeft size={16} aria-hidden="true" /> The artists
          </Link>
          <div className="artist-editorial-stage">
            <div className="artist-editorial-portrait">
              <ResponsiveImage
                src={artist.image}
                alt={artist.name}
                priority
                sizes="(min-width: 900px) 48vw, 100vw"
                className="w-full h-full object-contain object-bottom"
              />
            </div>
            <div className="artist-editorial-intro">
              <p className="artist-editorial-kicker">
                {primarySeries === "sunsets-radio"
                  ? "Chasing Sunsets Radio"
                  : getSeriesLabel(primarySeries)}{" "}
                <span>/ {artist.role.toLowerCase()}</span>
              </p>
              <h1>{artist.name}</h1>
              <dl className="artist-editorial-facts">
                <div>
                  <dt>Based in</dt>
                  <dd>{artist.origin}</dd>
                </div>
                <div>
                  <dt>Sound</dt>
                  <dd>{artist.genre}</dd>
                </div>
              </dl>
              <div className="artist-editorial-actions">
                {inlineAudioTrack ? (
                  <button
                    type="button"
                    className="lg-pill-amber"
                    onClick={() =>
                      isArtistTrackActive
                        ? audio?.setPlaying(!isArtistTrackPlaying)
                        : audio?.loadTrack(inlineAudioTrack)
                    }
                  >
                    {isArtistTrackPlaying ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}{" "}
                    {isArtistTrackPlaying
                      ? "Pause recording"
                      : "Play recording"}
                  </button>
                ) : (
                  <a
                    href={recordingHref}
                    target={
                      recordingHref.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      recordingHref.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="lg-pill-amber"
                  >
                    <Headphones size={16} />
                    {recordingLabel}
                  </a>
                )}
                {resolvedId && (
                  <button
                    type="button"
                    onClick={() => toggleSavedArtist(resolvedId)}
                    aria-pressed={isArtistSaved}
                    aria-label={`${isArtistSaved ? "Unsave" : "Save"} ${artist.name}`}
                    className="artist-editorial-save"
                  >
                    <Bookmark
                      size={16}
                      fill={isArtistSaved ? "currentColor" : "none"}
                    />{" "}
                    {isArtistSaved ? "Saved" : "Save artist"}
                  </button>
                )}
              </div>
              {inlineAudioTrack && (
                <a className="artist-editorial-secondary" href={recordingHref}>
                  {recordingLabel} <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Main Content: Bento Glass System */}
        <section className="artist-profile-content relative px-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="container layout-wide grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 xl:gap-28">
            {/* Left Content — Story & Tracks */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-32">
              {/* About Section */}
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-white/70">
                  <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                    01 / Artist profile
                  </span>
                  <div className="h-px w-20 bg-current" />
                </div>
                <p className="artist-editorial-bio">
                  {/bio coming soon/i.test(artist.bio)
                    ? `Explore ${artist.name}'s music and Monolith appearances below.`
                    : artist.bio}
                </p>
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
                      {eventsSectionNumber} / Appearances
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
                            <div className="relative aspect-[3/4] max-w-[180px] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl group-hover:border-white/30 transition-all">
                              <ResponsiveImage
                                src={evt.cardImage}
                                alt={evt.title}
                                sizes="180px"
                                style={{ objectPosition: "50% 0%" }}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="flex flex-col justify-between h-full">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] tracking-[0.4em] uppercase px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary">
                                  {evt.badge || evt.status || "Appearance"}
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
                              <p className="font-sans text-lg leading-relaxed text-white/70 mb-6 max-w-2xl">
                                {evt.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                              {evt.ticketUrl &&
                                Date.parse(evt.date) > Date.now() &&
                                !/postponed|cancelled/i.test(
                                  `${evt.badge} ${evt.status}`
                                ) && (
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
                <div id="artist-recordings" className="space-y-12">
                  <div className="flex items-center gap-4 text-white/70">
                    <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
                      {previousSetsSectionNumber} /{" "}
                      {hasPublishedSets
                        ? "Recorded sets"
                        : "Previous appearances"}
                    </span>
                    <div className="h-px w-20 bg-current" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {artist.previousSets.map((set, i) => (
                      <motion.article
                        key={set.title}
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
                        </div>
                        <h5 className="font-display text-2xl uppercase tracking-widest text-white mb-2">
                          {set.title}
                        </h5>
                        {set.url ? (
                          <a
                            className="artist-set-link"
                            href={set.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Explore set links{" "}
                            <ArrowRight size={16} aria-hidden="true" />
                          </a>
                        ) : (
                          <p className="text-sm text-white/70">
                            Recording link has not been published.
                          </p>
                        )}
                      </motion.article>
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
                  <div
                    className={
                      artist.gallery.length === 2
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6"
                        : "grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6"
                    }
                  >
                    {artist.gallery.map((photo, i) => {
                      const isLandscape = photo.orientation === "landscape";
                      const isFeaturedBento =
                        artist.gallery!.length >= 3 && i === 0 && !isLandscape;
                      return (
                        <motion.button
                          key={photo.src}
                          type="button"
                          onClick={() => setLightboxIndex(i)}
                          aria-label={`Open full photo: ${photo.alt}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08 }}
                          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c0b] text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3a659] ${
                            isLandscape ? "aspect-[3/2]" : "aspect-[2/3]"
                          } ${isFeaturedBento ? "col-span-2 row-span-2" : ""}`}
                        >
                          <ResponsiveImage
                            src={photo.src}
                            alt={photo.alt}
                            sizes={
                              isFeaturedBento || artist.gallery!.length === 2
                                ? "(min-width: 1024px) 56vw, 100vw"
                                : "(min-width: 1024px) 36vw, 60vw"
                            }
                            style={{
                              objectPosition: photo.objectPosition || "50% 0%",
                            }}
                            className={`w-full h-full object-top origin-top group-hover:scale-[1.03] transition-transform duration-700 ${
                              photo.fit === "contain" || isLandscape
                                ? "object-contain bg-[#0d0c0b]"
                                : "object-cover"
                            }`}
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="pointer-events-none absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <span className="font-mono text-[10px] tracking-[0.26em] text-white/90 uppercase drop-shadow-md">
                              {photo.alt}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Featured Video Section */}
              {artist.featuredVideo && (
                <div id="artist-recording" className="space-y-12">
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
                          <p className="mt-7 font-sans text-lg italic leading-relaxed text-white/70">
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
                        className="group flex items-center justify-between p-8 bg-[#050505]"
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Content — Sidebar Glass Bento */}
            <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-10 xl:sticky xl:top-32 self-start">
              {/* Next Event Card */}
              <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group">
                <span className="ui-kicker text-white/70 mb-2 block lowercase-none">
                  {appearancePostponed
                    ? "Show update"
                    : appearancePast
                      ? "Past appearance"
                      : nextAppearance
                        ? "Artist appearance"
                        : "Show discovery"}
                </span>
                <h4 className="font-display text-4xl uppercase tracking-widest text-white mb-10 leading-none">
                  Artist &amp;
                  <br />
                  Show
                </h4>

                <p className="artist-appearance-note">
                  {appearancePostponed
                    ? "This is the original booking. Artist participation and replacement-show details await confirmation."
                    : appearancePast
                      ? "A previous appearance in the Monolith archive."
                      : nextAppearance
                        ? "Explore the event guide for the latest details."
                        : "No upcoming appearance is announced for this artist. Discover the current shows in our calendar."}
                </p>
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

              <div className="artist-profile-connections p-8 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="ui-kicker text-white/70 mb-5 block">
                  Keep exploring
                </span>
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                ))}
                <Link href="/artists">
                  All artist profiles{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
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
      </main>

      {lightboxIndex >= 0 && galleryMedia.length > 0 ? (
        <Suspense fallback={null}>
          <GalleryLightbox
            media={galleryMedia}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(-1)}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
