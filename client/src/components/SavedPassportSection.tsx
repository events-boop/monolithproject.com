import {
  ArrowUpRight,
  Bookmark,
  CalendarPlus,
  Headphones,
  Pause,
  Play,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "wouter";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { useUI } from "@/contexts/UIContext";
import { ARTISTS } from "@/data/artists";
import { radioEpisodes } from "@/data/radioEpisodes";
import {
  clearSavedPassport,
  toggleSavedArtist,
  toggleSavedEpisode,
  toggleSavedEvent,
  useSavedPassport,
} from "@/lib/savedPassport";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import { canAddEventToCalendar, getScheduleVenue } from "@/lib/schedulePresentation";
import { downloadEventCalendar } from "@/lib/calendar";
import { getEventDetailsHref } from "@/lib/cta";
import { getArtistAudioTrack } from "@/lib/artistEventDiscovery";
import { ROUTES } from "@shared/routes";

export default function SavedPassportSection() {
  usePublicSiteDataVersion();
  const passport = useSavedPassport();
  const audio = useOptionalGlobalAudio();
  const { closeDrawer } = useUI();

  const allEvents = getPublicEvents();
  const savedEvents = passport.events
    .map(id => allEvents.find(event => event.id === id))
    .filter((event): event is NonNullable<typeof event> => Boolean(event));

  const savedArtists = passport.artists
    .map(id => ARTISTS[id])
    .filter((artist): artist is NonNullable<typeof artist> => Boolean(artist));

  const savedEpisodes = passport.episodes
    .map(slug => radioEpisodes.find(ep => ep.slug === slug))
    .filter((ep): ep is NonNullable<typeof ep> => Boolean(ep));

  const isEmpty =
    savedEvents.length === 0 &&
    savedArtists.length === 0 &&
    savedEpisodes.length === 0;

  return (
    <div className="p-6 md:p-8 space-y-8 text-white">
      {isEmpty ? (
        <div className="lg-glass-card rounded-2xl p-7 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#f3a659]/35 bg-[#f3a659]/12 text-[#ffd8a6]">
            <Bookmark className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f3b572]">
              Your Monolith Shortlist
            </p>
            <h3 className="font-display text-2xl uppercase text-[#fbf6ee]">
              No saved nights or sets yet.
            </h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-white/70">
              Bookmark upcoming shows on the calendar, save roster artists, or
              pin Chasing Sunsets Radio episodes on this device for instant
              one-tap playback and `.ics` calendar export.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={ROUTES.schedule}
              onClick={closeDrawer}
              className="lg-pill-amber"
            >
              <span>Browse Shows</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={ROUTES.radio}
              onClick={closeDrawer}
              className="lg-pill-glass"
            >
              <Headphones className="h-4 w-4" aria-hidden="true" />
              <span>Explore Radio</span>
            </Link>
            <Link
              href={ROUTES.artists}
              onClick={closeDrawer}
              className="lg-pill-glass"
            >
              <span>All Artists</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f3c68f]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {savedEvents.length + savedArtists.length + savedEpisodes.length}{" "}
                Saved on this device
              </span>
            </div>
            <button
              type="button"
              onClick={clearSavedPassport}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear all
            </button>
          </div>

          {savedEvents.length > 0 && (
            <section aria-label="Saved nights" className="space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#e8c69a]">
                Saved Nights ({savedEvents.length})
              </h3>
              <div className="space-y-3">
                {savedEvents.map(event => {
                  const href = event.landingUrl || getEventDetailsHref(event);
                  const canExport = canAddEventToCalendar(event);
                  return (
                    <div
                      key={event.id}
                      className="lg-glass-card rounded-xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#f3b572]">
                          {event.date} · {getScheduleVenue(event)}
                        </p>
                        <Link
                          href={href}
                          onClick={closeDrawer}
                          className="mt-1 block font-display text-lg uppercase tracking-wide text-[#fbf6ee] hover:text-[#ffd8a6] transition-colors truncate"
                        >
                          {event.headline || event.title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {canExport && (
                          <button
                            type="button"
                            onClick={() => downloadEventCalendar(event)}
                            aria-label={`Export ${event.headline || event.title} .ics calendar file`}
                            className="lg-pill-glass !min-h-[38px] !px-3 !py-1.5"
                          >
                            <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>.ICS</span>
                          </button>
                        )}
                        <Link
                          href={href}
                          onClick={closeDrawer}
                          className="lg-pill-amber !min-h-[38px] !px-3.5 !py-1.5"
                        >
                          <span>Open</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSavedEvent(event.id)}
                          aria-label={`Remove ${event.headline || event.title} from saved nights`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/65 hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {savedEpisodes.length > 0 && (
            <section aria-label="Saved radio sets" className="space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#e8c69a]">
                Saved Radio Sets ({savedEpisodes.length})
              </h3>
              <div className="space-y-3">
                {savedEpisodes.map(ep => {
                  const isCurrent = audio?.activeTrack?.src === ep.embedUrl;
                  const isSpinning = Boolean(isCurrent && audio?.isPlaying);
                  return (
                    <div
                      key={ep.slug}
                      className="lg-glass-card rounded-xl p-3.5 flex items-center gap-3.5"
                    >
                      <ResponsiveImage
                        src={ep.coverImage || ep.image}
                        alt={ep.title}
                        width={64}
                        height={64}
                        sizes="64px"
                        style={{ objectPosition: "50% 0%" }}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover object-top border border-white/15"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#f3b572]">
                          {ep.shortCode} · {ep.guest} · {ep.duration}
                        </p>
                        <Link
                          href={`/radio/${ep.slug}`}
                          onClick={closeDrawer}
                          className="block font-medium text-sm text-[#fbf6ee] hover:text-[#ffd8a6] truncate"
                        >
                          {ep.title}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (isCurrent) {
                              audio?.setPlaying(!isSpinning);
                            } else {
                              audio?.loadTrack({
                                slug: ep.slug,
                                title: `${ep.shortCode} · ${ep.title}`,
                                artist: ep.guest,
                                src: ep.embedUrl,
                                coverImage: ep.coverImage || ep.image,
                                duration: ep.duration,
                              });
                            }
                          }}
                          aria-label={
                            isSpinning ? `Pause ${ep.title}` : `Play ${ep.title}`
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ffe6c2]/60 bg-[#f3a659] text-[#181009] transition-transform hover:scale-105"
                        >
                          {isSpinning ? (
                            <Pause className="h-4 w-4" fill="currentColor" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleSavedEpisode(ep.slug)}
                          aria-label={`Remove ${ep.title} from saved sets`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/65 hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {savedArtists.length > 0 && (
            <section aria-label="Saved artists" className="space-y-3">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#e8c69a]">
                Saved Artists ({savedArtists.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {savedArtists.map(artist => {
                  const track = getArtistAudioTrack(artist);
                  const isSpinning = Boolean(
                    track &&
                      audio?.activeTrack?.src === track.src &&
                      audio?.isPlaying
                  );
                  return (
                    <div
                      key={artist.id}
                      className="lg-glass-card rounded-xl p-3.5 flex items-center gap-3"
                    >
                      <ResponsiveImage
                        src={artist.image}
                        alt={artist.name}
                        width={56}
                        height={56}
                        sizes="56px"
                        style={{
                          objectPosition: artist.imagePosition || "50% 0%",
                        }}
                        className="h-13 w-13 shrink-0 rounded-full object-cover object-top border border-white/15"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/artists/${artist.id}`}
                          onClick={closeDrawer}
                          className="block font-display text-base uppercase tracking-wide text-[#fbf6ee] hover:text-[#ffd8a6] truncate"
                        >
                          {artist.name}
                        </Link>
                        <p className="font-mono text-[11px] text-white/65 truncate">
                          {artist.genre}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {track && (
                          <button
                            type="button"
                            onClick={() => {
                              if (audio?.activeTrack?.src === track.src) {
                                audio.setPlaying(!isSpinning);
                              } else {
                                audio?.loadTrack(track);
                              }
                            }}
                            aria-label={
                              isSpinning
                                ? `Pause ${artist.name} set`
                                : `Play ${artist.name} set`
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#f3a659]/45 bg-[#f3a659]/15 text-[#ffd8a6] hover:bg-[#f3a659] hover:text-[#181009] transition-colors"
                          >
                            {isSpinning ? (
                              <Pause className="h-3.5 w-3.5" />
                            ) : (
                              <Play className="h-3.5 w-3.5 ml-0.5" />
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleSavedArtist(artist.id)}
                          aria-label={`Remove ${artist.name} from saved artists`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/65 hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
