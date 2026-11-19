import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Calendar,
  Camera,
  Compass,
  Headphones,
  Pause,
  Play,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { useUI } from "@/contexts/UIContext";
import { archiveEntries } from "@/data/archiveEntries";
import { ARTIST_ENTRIES } from "@/data/artists";
import { insightEntries } from "@/data/insights";
import { radioEpisodes } from "@/data/radioEpisodes";
import { getEventDetailsHref } from "@/lib/cta";
import { useSavedPassport } from "@/lib/savedPassport";
import { getScheduleVenue } from "@/lib/schedulePresentation";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import { getPublishedEventState } from "@shared/events/publishedState";
import { ROUTES } from "@shared/routes";

const QUICK_DESTINATIONS = [
  {
    label: "Shows & Full Calendar",
    subtitle: "Upcoming chapters, updates & past archive",
    href: ROUTES.schedule,
    keywords: "events schedule calendar dates shows",
    icon: Calendar,
  },
  {
    label: "Chasing Sunsets Radio",
    subtitle: "Listen to all 13 artist-led transmissions",
    href: ROUTES.radio,
    keywords: "radio listen mixes sets soundcloud sunsets fm",
    icon: Headphones,
  },
  {
    label: "First Access & Updates",
    subtitle: "Priority ticket windows & 2027 season announcements",
    href: ROUTES.newsletter,
    keywords: "newsletter signup presale waitlist first access",
    icon: Sparkles,
  },
  {
    label: "Arrival & Room Concierge",
    subtitle: "Chicago room guide, doors, entry & rideshare pins",
    href: ROUTES.guide,
    keywords: "guide arrival venue castaways west loop parking dress id",
    icon: Compass,
  },
  {
    label: "VIP Tables & Cabanas",
    subtitle: "Inquiry-only reserved group hospitality",
    href: ROUTES.vip,
    keywords: "vip tables cabanas bottle service hospitality",
    icon: Sparkles,
  },
] as const;

export default function SonicCommandPalette() {
  usePublicSiteDataVersion();
  const {
    isCommandPaletteOpen,
    closeCommandPalette,
    toggleCommandPalette,
    openDrawer,
  } = useUI();
  const [, setLocation] = useLocation();
  const audio = useOptionalGlobalAudio();
  const passport = useSavedPassport();

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleCommandPalette]);

  const navigateTo = (href: string) => {
    closeCommandPalette();
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      const targetPath = path || "/";
      setLocation(targetPath);
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 240);
      return;
    }
    setLocation(href);
  };

  const events = getPublicEvents().filter(
    event => event.status !== "draft" && event.status !== "hidden"
  );

  return (
    <Dialog.Root
      open={isCommandPaletteOpen}
      onOpenChange={open => {
        if (!open) closeCommandPalette();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="lg-cmdk-overlay" />
        <Dialog.Content
          data-sonic-command-palette="true"
          className="lg-cmdk-dialog"
          aria-label="Search Monolith artists, radio episodes, shows, and archive"
        >
          <Dialog.Title className="sr-only">
            Search The Monolith Project
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Search across 32 artists, 13 Chasing Sunsets Radio episodes, shows,
            archive galleries, and journal articles, or start instant playback.
          </Dialog.Description>

          <Command className="lg-cmdk-root" loop>
            <div className="lg-cmdk-input-bar">
              <Search
                className="h-4.5 w-4.5 shrink-0 text-[#f3b572]"
                aria-hidden="true"
              />
              <Command.Input
                autoFocus
                placeholder="Search artists, radio sets, shows, rooms, or archive…"
                className="lg-cmdk-input"
              />
              <span className="lg-cmdk-kbd hidden sm:inline-flex" aria-hidden="true">
                ESC
              </span>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close search"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white/75 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <Command.List className="lg-cmdk-list">
              <Command.Empty className="lg-cmdk-empty">
                No matching artists, sets, or chapters found.
              </Command.Empty>

              {/* Quick Actions & Saved Shortlist */}
              <Command.Group heading="Quick Navigation">
                <Command.Item
                  value="saved shortlist my lineup bookmarked sets nights"
                  onSelect={() => {
                    closeCommandPalette();
                    openDrawer("saved");
                  }}
                  className="lg-cmdk-item"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#f3a659]/35 bg-[#f3a659]/12 text-[#ffd8a6]">
                      <Bookmark className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium text-[#fbf6ee] truncate">
                        Open Your Saved List ({passport.total})
                      </span>
                      <span className="block text-xs text-white/60 truncate">
                        Bookmarked shows, artists & radio episodes on this device
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50" />
                </Command.Item>

                {QUICK_DESTINATIONS.map(item => (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${item.subtitle} ${item.keywords}`}
                    onSelect={() => navigateTo(item.href)}
                    className="lg-cmdk-item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-[#f3c68f]">
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-[#fbf6ee] truncate">
                          {item.label}
                        </span>
                        <span className="block text-xs text-white/60 truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50" />
                  </Command.Item>
                ))}
              </Command.Group>

              {/* Radio Episodes — Play Instantly or Open Dossier */}
              <Command.Group heading="Chasing Sunsets Radio — Play in Deck">
                {radioEpisodes.map(episode => {
                  const isCurrent = audio?.activeTrack?.src === episode.embedUrl;
                  const isPlaying = Boolean(isCurrent && audio?.isPlaying);
                  return (
                    <Command.Item
                      key={episode.slug}
                      value={`play radio ${episode.shortCode} ${episode.guest} ${episode.title} ${episode.summary}`}
                      onSelect={() => {
                        audio?.loadTrack({
                          slug: episode.slug,
                          title: `${episode.shortCode} · ${episode.title}`,
                          artist: episode.guest,
                          src: episode.embedUrl,
                          coverImage: episode.coverImage || episode.image,
                          duration: episode.duration,
                        });
                        closeCommandPalette();
                      }}
                      className="lg-cmdk-item"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f3a659]/45 bg-[#f3a659]/18 text-[#ffd8a6]">
                          {isPlaying ? (
                            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Play
                              className="h-3.5 w-3.5 ml-0.5"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        <div className="min-w-0">
                          <span className="block text-sm font-medium text-[#fbf6ee] truncate">
                            {episode.guest} — {episode.title}
                          </span>
                          <span className="block font-mono text-[11px] text-[#e8c69a]/80 truncate">
                            {episode.shortCode} · {episode.duration} · Play in
                            persistent deck
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          navigateTo(`/radio/${episode.slug}`);
                        }}
                        className="shrink-0 rounded-full border border-white/14 bg-white/[0.05] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-white/75 hover:border-[#f3a659]/50 hover:text-white"
                      >
                        Episode ↗
                      </button>
                    </Command.Item>
                  );
                })}
              </Command.Group>

              {/* Shows & Events */}
              <Command.Group heading="Shows & Chapters">
                {events.map(event => {
                  const state = getPublishedEventState(event);
                  const href = event.landingUrl || getEventDetailsHref(event);
                  const badge =
                    state.kind === "postponed"
                      ? "Postponed"
                      : state.kind === "on-sale"
                        ? "On Sale"
                        : state.kind === "past"
                          ? "Archive"
                          : "First Access";
                  return (
                    <Command.Item
                      key={event.id}
                      value={`event show ${event.headline || event.title} ${event.lineup || ""} ${event.venue} ${event.date}`}
                      onSelect={() => navigateTo(href)}
                      className="lg-cmdk-item"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-[#f3b572]">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-sm font-medium text-[#fbf6ee] truncate">
                            {event.headline || event.title}
                          </span>
                          <span className="block text-xs text-white/60 truncate">
                            {event.date} · {getScheduleVenue(event)}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full border border-[#f3a659]/35 bg-[#f3a659]/10 px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[#ffd8a6]">
                        {badge}
                      </span>
                    </Command.Item>
                  );
                })}
              </Command.Group>

              {/* All 32 Roster Artists */}
              <Command.Group heading="Artists Roster (32)">
                {ARTIST_ENTRIES.map(artist => (
                  <Command.Item
                    key={artist.id}
                    value={`artist dj ${artist.name} ${artist.genre} ${artist.origin} ${artist.role}`}
                    onSelect={() => navigateTo(`/artists/${artist.id}`)}
                    className="lg-cmdk-item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/75">
                        <User className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-[#fbf6ee] truncate">
                          {artist.name}
                        </span>
                        <span className="block text-xs text-white/60 truncate">
                          {artist.genre} · {artist.origin}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50" />
                  </Command.Item>
                ))}
              </Command.Group>

              {/* Archive Galleries */}
              <Command.Group heading="Archive Galleries">
                {archiveEntries.map(entry => (
                  <Command.Item
                    key={entry.slug}
                    value={`archive gallery photos ${entry.title} ${entry.subtitle} ${entry.date}`}
                    onSelect={() => navigateTo(entry.href)}
                    className="lg-cmdk-item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-[#f3c68f]">
                        <Camera className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-[#fbf6ee] truncate">
                          {entry.title} — {entry.subtitle}
                        </span>
                        <span className="block text-xs text-white/60 truncate">
                          {entry.date}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50" />
                  </Command.Item>
                ))}
              </Command.Group>

              {/* Editorial Journal / Insights */}
              <Command.Group heading="Journal & Insights">
                {insightEntries.map(article => (
                  <Command.Item
                    key={article.slug}
                    value={`article journal insight ${article.title} ${article.category} ${article.summary}`}
                    onSelect={() => navigateTo(`/insights/${article.slug}`)}
                    className="lg-cmdk-item"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] text-white/75">
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-sm font-medium text-[#fbf6ee] truncate">
                          {article.title}
                        </span>
                        <span className="block text-xs text-white/60 truncate">
                          {article.category} · {article.readTime}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-white/50" />
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>

            <div className="lg-cmdk-footer">
              <span>↑↓ Navigate · ↵ Select or Play</span>
              <span>⌘K Search Monolith</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
