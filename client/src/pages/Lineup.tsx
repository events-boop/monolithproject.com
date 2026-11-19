import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Bookmark,
  Grid2x2,
  Headphones,
  List,
  MapPin,
  Music,
  Pause,
  Play,
  Sun,
  Search,
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import RevealText from "@/components/RevealText";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { getArtistAudioTrack } from "@/lib/artistEventDiscovery";
import { toggleSavedArtist, useSavedPassport } from "@/lib/savedPassport";
import { cn } from "@/lib/utils";
import {
  ARTIST_ENTRIES,
  ARTIST_PORTRAIT_PLACEHOLDER,
  type ArtistData,
  type ArtistSeries,
} from "@/data/artists";
import { radioEpisodes } from "@/data/radioEpisodes";

type Series = "all" | ArtistSeries;
type ViewMode = "list" | "grid";

interface FilterOption {
  label: string;
  value: Series;
  icon?: ReactNode;
}

interface ArtistPreview {
  src: string;
  fallbackSrc?: string;
  label: string;
  meta: string;
}

const filters: FilterOption[] = [
  { label: "All", value: "all" },
  {
    label: "Chasing Sun(Sets)",
    value: "chasing-sunsets",
    icon: <Sun className="h-3.5 w-3.5" />,
  },
  {
    label: "Untold Story",
    value: "untold-story",
    icon: <UntoldButterflyLogo className="h-4 w-4" />,
  },
  {
    label: "Sun(Sets) Radio",
    value: "sunsets-radio",
    icon: <Headphones className="h-3.5 w-3.5" />,
  },
];

const EVENT_PREVIEWS: Record<
  Exclude<ArtistSeries, "sunsets-radio">,
  ArtistPreview[]
> = {
  "chasing-sunsets": [
    {
      src: "/images/chasing-sunsets-premium.webp",
      label: "Season Flyer",
      meta: "Open-Air Series",
    },
    {
      src: "/images/archive/chasing-sunsets/css-s3-1.jpg",
      label: "Event Flyer",
      meta: "Latest Chapter",
    },
    {
      src: "/images/autograf-recap.jpg",
      label: "Recap Frame",
      meta: "Live Energy",
    },
  ],
  "untold-story": [
    {
      src: "/images/untold-story-juany-deron-v2.webp",
      label: "Chapter Flyer",
      meta: "Late-Night Series",
    },
    {
      src: "/images/lazare-recap.webp",
      label: "Series Poster",
      meta: "Immersive Room",
    },
    {
      src: "/images/eran-hersh-live-5.webp",
      label: "Live Frame",
      meta: "Global Guest",
    },
  ],
};

const RADIO_FALLBACK_PREVIEWS: ArtistPreview[] = [
  {
    src: "/images/radio-show-gear.webp",
    label: "Radio Archive",
    meta: "Chasing Sun(Sets) Radio",
  },
  {
    src: "/images/artist-benchek.jpg",
    label: "Guest Portrait",
    meta: "Featured Session",
  },
  {
    src: "/images/radio-show-gear.webp",
    label: "Guest Cover",
    meta: "Recent Drop",
  },
];

const RADIO_PREVIEW_IMAGES: Record<string, string> = {
  BENCHEK: "/images/artist-benchek.jpg",
  EWERSEEN: "/images/artist-ewerseen-2026-v2.jpg",
  TERRANOVA: "/images/artist-terranova.png",
  RADIAN: "/images/radio-show-gear.webp",
};

const sectionTitleClass = "section-display-title max-w-[8ch] text-white";

function getSeriesLabel(series: ArtistSeries) {
  switch (series) {
    case "chasing-sunsets":
      return "Chasing Sun(Sets)";
    case "untold-story":
      return "Untold Story";
    case "sunsets-radio":
      return "Sun(Sets) Radio";
    default:
      return "Monolith";
  }
}

function getSeriesChipClasses(series: ArtistSeries) {
  switch (series) {
    case "chasing-sunsets":
      return "border-[#E8B86D]/30 bg-[#E8B86D]/10 text-[#F3D6A0]";
    case "untold-story":
      return "border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#9BE7F7]";
    case "sunsets-radio":
      return "border-[#C2703E]/30 bg-[#C2703E]/10 text-[#F3CDAF]";
    default:
      return "border-white/15 bg-white/5 text-white/70";
  }
}

function getSeriesHoverBorder(series: ArtistSeries) {
  switch (series) {
    case "chasing-sunsets":
      return "group-hover:border-[#E8B86D]/45";
    case "untold-story":
      return "group-hover:border-[#22D3EE]/45";
    case "sunsets-radio":
      return "group-hover:border-[#C2703E]/45";
    default:
      return "group-hover:border-white/20";
  }
}

function getSeriesIcon(series: ArtistSeries) {
  switch (series) {
    case "chasing-sunsets":
      return <Sun className="h-3.5 w-3.5 text-[#E8B86D]" />;
    case "untold-story":
      return <UntoldButterflyLogo className="h-4 w-4 text-[#22D3EE]" />;
    case "sunsets-radio":
      return <Headphones className="h-3.5 w-3.5 text-[#C2703E]" />;
    default:
      return null;
  }
}

function dedupePreviewItems(items: ArtistPreview[]) {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = `${item.src}::${item.label}::${item.meta}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getArtistFallbackImage(artist: ArtistData) {
  if (artist.series.includes("sunsets-radio")) {
    return RADIO_PREVIEW_IMAGES[artist.name] ?? RADIO_FALLBACK_PREVIEWS[0].src;
  }

  const primarySeries = artist.series[0] as Exclude<
    ArtistSeries,
    "sunsets-radio"
  >;
  return (
    EVENT_PREVIEWS[primarySeries]?.[0]?.src ?? "/images/artists-collective.webp"
  );
}

function buildArtistPreviewItems(artist: ArtistData): ArtistPreview[] {
  const radioPreviewItems = artist.series.includes("sunsets-radio")
    ? radioEpisodes
        .filter(episode => episode.guest === artist.name)
        .map(episode => ({
          src:
            episode.coverImage ||
            RADIO_PREVIEW_IMAGES[episode.guest] ||
            artist.image,
          fallbackSrc: RADIO_PREVIEW_IMAGES[episode.guest] || artist.image,
          label: episode.shortCode,
          meta: episode.title,
        }))
    : [];

  if (radioPreviewItems.length) {
    return dedupePreviewItems([
      ...radioPreviewItems,
      {
        src: artist.image,
        fallbackSrc: getArtistFallbackImage(artist),
        label: "Guest Portrait",
        meta: artist.name,
      },
      ...RADIO_FALLBACK_PREVIEWS,
    ]).slice(0, 3);
  }

  const galleryPreviewItems =
    artist.gallery?.map((photo, index) => ({
      src: photo.src,
      label: artist.galleryLabel ?? (index === 0 ? "Live Frame" : "Gallery"),
      meta: photo.alt,
    })) ?? [];

  const eventPreviewItems =
    EVENT_PREVIEWS[
      artist.series[0] as Exclude<ArtistSeries, "sunsets-radio">
    ] ?? [];

  return dedupePreviewItems([
    ...galleryPreviewItems,
    {
      src: artist.image,
      fallbackSrc: getArtistFallbackImage(artist),
      label: "Artist Portrait",
      meta: artist.name,
    },
    ...eventPreviewItems,
  ]).slice(0, 3);
}

function PreviewTile({
  item,
  featured = false,
}: {
  item: ArtistPreview;
  featured?: boolean;
}) {
  const [src, setSrc] = useState(item.src);
  const isRemote = /^https?:\/\//i.test(src);
  const handleError = () => {
    if (item.fallbackSrc && src !== item.fallbackSrc) {
      setSrc(item.fallbackSrc);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]",
        featured ? "aspect-[4/5] min-h-[18rem]" : "aspect-[4/5]"
      )}
    >
      {isRemote ? (
        <img
          src={src}
          alt={item.meta}
          loading="lazy"
          decoding="async"
          onError={handleError}
          style={{ objectPosition: "50% 0%" }}
          className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
        />
      ) : (
        <ResponsiveImage
          src={src}
          alt={item.meta}
          sizes={
            featured
              ? "(min-width: 1024px) 30vw, 100vw"
              : "(min-width: 1024px) 18vw, 50vw"
          }
          onError={handleError}
          style={{ objectPosition: "50% 0%" }}
          className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
          {item.label}
        </span>
        <p className="mt-2 font-display text-lg uppercase leading-[0.95] text-white sm:text-xl">
          {item.meta}
        </p>
      </div>
    </div>
  );
}

function ArtistListRow({ artist }: { artist: ArtistData }) {
  const previews = buildArtistPreviewItems(artist);
  const primarySeries = artist.series[0];
  const portraitFallback = getArtistFallbackImage(artist);
  const [portraitSrc, setPortraitSrc] = useState(artist.image);
  const handlePortraitError = () => {
    if (portraitSrc !== portraitFallback) {
      setPortraitSrc(portraitFallback);
    }
  };

  return (
    <Link href={`/artists/${artist.id}`} asChild>
      <a className="group artist-index-list-row block py-3 first:pt-0 md:py-4">
        <article className="grid gap-6 rounded-2xl border border-[rgba(255,228,194,0.12)] bg-[rgba(255,255,255,0.02)] p-5 transition-[border-color,background,box-shadow] duration-300 group-hover:border-[rgba(255,214,166,0.34)] group-hover:bg-[rgba(255,214,166,0.04)] group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.28)] md:p-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]",
                  getSeriesChipClasses(primarySeries)
                )}
              >
                {getSeriesIcon(primarySeries)}
                {getSeriesLabel(primarySeries)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/38">
                {artist.role}
              </span>
            </div>

            <div className="mt-5 flex items-start gap-4">
              <div
                className={cn(
                  "hidden overflow-hidden border border-white/10 bg-white/[0.03] sm:block",
                  primarySeries === "sunsets-radio"
                    ? "w-20 aspect-square"
                    : "w-20 aspect-[4/5]"
                )}
              >
                <ResponsiveImage
                  src={portraitSrc}
                  alt={
                    portraitSrc === ARTIST_PORTRAIT_PLACEHOLDER
                      ? `Portrait pending for ${artist.name}`
                      : artist.name
                  }
                  style={{ objectPosition: artist.imagePosition || "50% 0%" }}
                  sizes="80px"
                  onError={handlePortraitError}
                  className="h-full w-full object-cover object-top transition duration-700"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="section-display-title-compact text-white">
                  {artist.name}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/68 md:text-base">
                  {artist.bio}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/48">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {artist.origin}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Music className="h-3.5 w-3.5" />
                    {artist.genre}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {artist.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/62 transition-colors group-hover:text-white">
                  <span>Open Artist Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
            <PreviewTile item={previews[0]} featured />
            <div className="grid gap-3">
              {previews.slice(1, 3).map(item => (
                <PreviewTile key={`${artist.id}-${item.src}`} item={item} />
              ))}
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
}

function ArtistGridCard({ artist }: { artist: ArtistData }) {
  const primarySeries = artist.series[0];
  const portraitFallback = getArtistFallbackImage(artist);
  const [portraitSrc, setPortraitSrc] = useState(artist.image);
  const audio = useOptionalGlobalAudio();
  const passport = useSavedPassport();
  const isSaved = passport.artists.includes(artist.id);
  const audioTrack = getArtistAudioTrack(artist);
  const isTrackPlaying = Boolean(
    audioTrack && audio?.activeTrack?.src === audioTrack.src && audio?.isPlaying
  );

  const handlePortraitError = () => {
    if (portraitSrc !== portraitFallback) {
      setPortraitSrc(portraitFallback);
    }
  };

  return (
    <article
      className={cn(
        "artist-grid-card group relative overflow-hidden rounded-2xl lg-glass-card lg-glass-card-interactive",
        getSeriesHoverBorder(primarySeries)
      )}
    >
      <Link href={`/artists/${artist.id}`} className="block">
        <div className="artist-grid-portrait aspect-[4/5] overflow-hidden">
          <ResponsiveImage
            src={portraitSrc}
            alt={
              portraitSrc === ARTIST_PORTRAIT_PLACEHOLDER
                ? `Portrait pending for ${artist.name}`
                : artist.name
            }
            style={{ objectPosition: artist.imagePosition || "50% 0%" }}
            sizes="(min-width: 1280px) 23vw, (min-width: 768px) 33vw, 100vw"
            onError={handlePortraitError}
            className="h-full w-full object-cover object-top origin-top transition-all duration-700 group-hover:scale-105"
          />
        </div>
        <div className="artist-grid-series px-6 pt-6">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur-md",
              getSeriesChipClasses(primarySeries)
            )}
          >
            {getSeriesIcon(primarySeries)}
            {getSeriesLabel(primarySeries)}
          </span>
        </div>
        <div className="artist-grid-copy px-6 pb-7 pt-4">
          <h2 className="section-display-title-compact text-[#fbf6ee] group-hover:text-[#ffd8a6] transition-colors">
            {artist.name}
          </h2>
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-white/74">
            {artist.bio}
          </p>
          <div className="mt-4 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f3c68f] transition-colors group-hover:text-white">
            <span>Artist Profile</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>

      {/* Top-right Save & Inline Play controls */}
      <div className="artist-grid-controls absolute top-4 right-4 z-10 flex items-center gap-2">
        {audioTrack && (
          <button
            type="button"
            onClick={() => {
              if (audio?.activeTrack?.src === audioTrack.src) {
                audio.setPlaying(!isTrackPlaying);
              } else {
                audio?.loadTrack(audioTrack);
              }
            }}
            aria-label={
              isTrackPlaying
                ? `Pause ${artist.name} set`
                : `Play ${artist.name} set in deck`
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#ffe6c2]/55 bg-[#18120e]/80 text-[#ffd8a6] backdrop-blur-md hover:bg-[#f3a659] hover:text-[#181009] transition-colors cursor-pointer"
          >
            {isTrackPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="h-3.5 w-3.5 ml-0.5 fill-current" />
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => toggleSavedArtist(artist.id)}
          aria-pressed={isSaved}
          aria-label={
            isSaved
              ? `Remove ${artist.name} from saved artists`
              : `Save ${artist.name}`
          }
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-colors cursor-pointer",
            isSaved
              ? "border-[#f3a659]/65 bg-[#f3a659] text-[#181009]"
              : "border-white/20 bg-black/60 text-white/80 hover:border-[#f3a659]/50 hover:text-white"
          )}
        >
          <Bookmark
            className="h-3.5 w-3.5"
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>
    </article>
  );
}

export default function Lineup() {
  const [activeFilter, setActiveFilter] = useState<Series>("all");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredArtists = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return ARTIST_ENTRIES.filter(
      artist =>
        (activeFilter === "all" || artist.series.includes(activeFilter)) &&
        (!search ||
          `${artist.name} ${artist.genre} ${artist.origin}`
            .toLocaleLowerCase()
            .includes(search))
    );
  }, [activeFilter, query]);

  return (
    <div className="artist-index min-h-screen bg-background text-foreground lg-dusk-atmosphere">
      <SEO
        title="Artists"
        description="Explore the artists behind The Monolith Project across Chasing Sun(Sets), Untold Story, and Sun(Sets) Radio."
        canonicalPath="/lineup"
      />
      <Navigation />

      <section className="lg-cinematic-masthead px-6 artist-index-masthead">
        <div className="container layout-default">
          <span className="section-kicker block text-[#f3b572] mb-5">
            The Monolith Project / Artist index
          </span>
          <RevealText as="h1" className={sectionTitleClass}>
            ARTISTS
          </RevealText>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-[#f4e9d8]/78 md:text-xl md:leading-relaxed">
            Find the artists behind the nights. Explore their sound, revisit a
            set, or follow the people shaping our dance floors.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/schedule" className="lg-pill-amber">
              <span>Explore shows</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/radio" className="lg-pill-glass">
              <span>Enter the listening room</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="artist-index-toolbar sticky sticky-shell-top z-30 border-y border-[rgba(255,228,194,0.14)] bg-[rgba(12,10,9,0.78)] px-6 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="container layout-default">
          <label className="artist-index-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search artists</span>
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Find an artist, sound or city"
            />
          </label>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="artist-index-filters flex flex-wrap gap-2">
              {filters.map(filter => {
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(filter.value)}
                    className={cn(
                      "artist-index-filter inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors backdrop-blur-md",
                      isActive
                        ? filter.value === "chasing-sunsets"
                          ? "border-[#E8B86D]/55 bg-[#E8B86D]/14 text-[#F3D6A0] shadow-[0_8px_24px_rgba(232,184,109,0.12)]"
                          : filter.value === "untold-story"
                            ? "border-[#22D3EE]/55 bg-[#22D3EE]/14 text-[#9BE7F7] shadow-[0_8px_24px_rgba(34,211,238,0.1)]"
                            : filter.value === "sunsets-radio"
                              ? "border-[#C2703E]/55 bg-[#C2703E]/14 text-[#F3CDAF] shadow-[0_8px_24px_rgba(194,112,62,0.12)]"
                              : "border-[rgba(255,228,194,0.42)] bg-[rgba(255,214,166,0.12)] text-[#fff8ee] shadow-[0_8px_24px_rgba(243,166,89,0.12)]"
                        : "border-[rgba(255,228,194,0.14)] bg-[rgba(255,255,255,0.03)] text-white/58 hover:border-[rgba(255,214,166,0.34)] hover:text-white/88"
                    )}
                  >
                    {filter.icon}
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/48">
              <span>View</span>
              <button
                type="button"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors",
                  viewMode === "list"
                    ? "border-white/20 bg-white/8 text-white"
                    : "border-white/10 text-white/52 hover:border-white/20 hover:text-white/80"
                )}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
              <button
                type="button"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors",
                  viewMode === "grid"
                    ? "border-white/20 bg-white/8 text-white"
                    : "border-white/10 text-white/52 hover:border-white/20 hover:text-white/80"
                )}
              >
                <Grid2x2 className="h-3.5 w-3.5" />
                Grid
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="container layout-default">
          <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-5">
            <span
              aria-live="polite"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/44"
            >
              {filteredArtists.length} Artist
              {filteredArtists.length === 1 ? "" : "s"}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/34">
              {viewMode === "list"
                ? "Artists + selected work"
                : "Artist portraits"}
            </span>
          </div>

          {!filteredArtists.length && (
            <div className="artist-index-empty lg-glass-card rounded-2xl px-6 py-10 md:px-10">
              <h2>No artists found.</h2>
              <p>
                Try another name, sound or city, or choose a different series.
              </p>
              <button
                type="button"
                className="lg-pill-amber"
                onClick={() => {
                  setQuery("");
                  setActiveFilter("all");
                }}
              >
                Show all artists
              </button>
            </div>
          )}
          {viewMode === "list" ? (
            <div>
              {filteredArtists.map(artist => (
                <ArtistListRow key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filteredArtists.map(artist => (
                <ArtistGridCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="container layout-default border-t border-white/10 pt-12">
          <span className="section-kicker block text-white/42">
            Artist Booking / Submissions
          </span>
          <h2 className="section-display-title-compact max-w-[8ch] text-white">
            WANT TO PLAY
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
            Booking inquiries for Chasing Sun(Sets) and Untold Story rooms, plus
            Sun(Sets) Radio guest submissions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/booking" className="lg-pill-amber">
              <span>Artist Booking</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/submit" className="lg-pill-glass">
              <span>Radio Submission</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <EntityBoostStrip tone="dark" className="pb-16" />
      <SlimSubscribeStrip
        title="GET LINEUP DROPS FIRST"
        source="lineup_strip"
      />
    </div>
  );
}
