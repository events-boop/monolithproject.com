import { useMemo, useState, type ReactNode } from "react";
import { ArrowUpRight, Grid2x2, Headphones, List, MapPin, Music, Sun } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import RevealText from "@/components/RevealText";
import TicketTicker from "@/components/TicketTicker";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import ResponsiveImage from "@/components/ResponsiveImage";
import { cn } from "@/lib/utils";
import { ARTIST_ENTRIES, type ArtistData, type ArtistSeries } from "@/data/artists";
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
  { label: "Chasing Sun(Sets)", value: "chasing-sunsets", icon: <Sun className="h-3.5 w-3.5" /> },
  { label: "Untold Story", value: "untold-story", icon: <UntoldButterflyLogo className="h-4 w-4" /> },
  { label: "Sun(Sets) Radio", value: "sunsets-radio", icon: <Headphones className="h-3.5 w-3.5" /> },
];

const EVENT_PREVIEWS: Record<Exclude<ArtistSeries, "sunsets-radio">, ArtistPreview[]> = {
  "chasing-sunsets": [
    { src: "/images/chasing-sunsets-premium.webp", label: "Season Flyer", meta: "Open-Air Series" },
    { src: "/images/archive/chasing-sunsets/css-s3-1.jpg", label: "Event Flyer", meta: "Latest Chapter" },
    { src: "/images/autograf-recap.jpg", label: "Recap Frame", meta: "Live Energy" },
  ],
  "untold-story": [
    { src: "/images/untold-story-juany-deron-v2.webp", label: "Chapter Flyer", meta: "Late-Night Series" },
    { src: "/images/lazare-recap.webp", label: "Series Poster", meta: "Immersive Room" },
    { src: "/images/eran-hersh-live-5.webp", label: "Live Frame", meta: "Global Guest" },
  ],
};

const RADIO_FALLBACK_PREVIEWS: ArtistPreview[] = [
  { src: "/images/radio-show-gear.webp", label: "Radio Archive", meta: "Chasing Sun(Sets) Radio" },
  { src: "/images/artist-benchek.jpg", label: "Guest Portrait", meta: "Featured Session" },
  { src: "/images/radio-show-gear.webp", label: "Guest Cover", meta: "Recent Drop" },
];

const RADIO_PREVIEW_IMAGES: Record<string, string> = {
  BENCHEK: "/images/artist-benchek.jpg",
  EWERSEEN: "/images/radio-show-gear.webp",
  TERRANOVA: "/images/artist-terranova.png",
  RADIAN: "/images/radio-show-gear.webp",
};

const sectionTitleClass =
  "section-display-title max-w-[8ch] text-white";

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
  return items.filter((item) => {
    if (seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}

function buildArtistPreviewItems(artist: ArtistData): ArtistPreview[] {
  const radioPreviewItems = artist.series.includes("sunsets-radio")
    ? radioEpisodes
        .filter((episode) => episode.guest === artist.name)
        .map((episode) => ({
          src: RADIO_PREVIEW_IMAGES[episode.guest] || artist.image,
          fallbackSrc: artist.image,
          label: episode.shortCode,
          meta: episode.title,
        }))
    : [];

  if (radioPreviewItems.length) {
    return dedupePreviewItems([
      ...radioPreviewItems,
      { src: artist.image, label: "Guest Portrait", meta: artist.name },
      ...RADIO_FALLBACK_PREVIEWS,
    ]).slice(0, 3);
  }

  const galleryPreviewItems =
    artist.gallery?.map((photo, index) => ({
      src: photo.src,
      label: index === 0 ? "Live Frame" : "Gallery",
      meta: photo.alt,
    })) ?? [];

  const eventPreviewItems = EVENT_PREVIEWS[artist.series[0] as Exclude<ArtistSeries, "sunsets-radio">] ?? [];

  return dedupePreviewItems([
    ...galleryPreviewItems,
    { src: artist.image, label: "Artist Portrait", meta: artist.name },
    ...eventPreviewItems,
  ]).slice(0, 3);
}

function PreviewTile({ item, featured = false }: { item: ArtistPreview; featured?: boolean }) {
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
        "relative overflow-hidden border border-white/10 bg-white/[0.03]",
        featured ? "aspect-[4/5] min-h-[18rem]" : "aspect-[4/3]",
      )}
    >
      {isRemote ? (
        <img
          src={src}
          alt={item.meta}
          loading="lazy"
          decoding="async"
          onError={handleError}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
        />
      ) : (
        <ResponsiveImage
          src={src}
          alt={item.meta}
          sizes={featured ? "(min-width: 1024px) 30vw, 100vw" : "(min-width: 1024px) 18vw, 50vw"}
          onError={handleError}
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/50">
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

  return (
    <Link href={`/artists/${artist.id}`} asChild>
      <a className="group block border-t border-white/10 py-8 first:border-t-0 md:py-10">
        <article className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]",
                  getSeriesChipClasses(primarySeries),
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
              <div className={cn(
                "hidden overflow-hidden border border-white/10 bg-white/[0.03] sm:block",
                primarySeries === "sunsets-radio" ? "w-20 aspect-square" : "w-20 aspect-[4/5]",
              )}>
                <ResponsiveImage
                  src={artist.image}
                  alt={artist.name}
                  sizes="80px"
                  className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
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
                  {artist.tags.slice(0, 3).map((tag) => (
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
              {previews.slice(1, 3).map((item) => (
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

  return (
    <Link href={`/artists/${artist.id}`} asChild>
      <a className="group block">
        <article
          className={cn(
            "relative overflow-hidden border border-white/10 bg-black transition-colors duration-500",
            getSeriesHoverBorder(primarySeries),
          )}
        >
          <div className="aspect-[4/5] overflow-hidden">
            <ResponsiveImage
              src={artist.image}
              alt={artist.name}
              sizes="(min-width: 1280px) 23vw, (min-width: 768px) 33vw, 100vw"
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]",
                getSeriesChipClasses(primarySeries),
              )}
            >
              {getSeriesIcon(primarySeries)}
              {getSeriesLabel(primarySeries)}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/42">
              {artist.role}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h2 className="section-display-title-compact text-white">
              {artist.name}
            </h2>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/68">
              {artist.bio}
            </p>
            <div className="mt-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/58 transition-colors group-hover:text-white">
              <span>Artist Profile</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </article>
      </a>
    </Link>
  );
}

export default function Lineup() {
  const [activeFilter, setActiveFilter] = useState<Series>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filteredArtists = useMemo(() => {
    if (activeFilter === "all") return ARTIST_ENTRIES;
    return ARTIST_ENTRIES.filter((artist) => artist.series.includes(activeFilter));
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Artists"
        description="Explore the artists behind The Monolith Project across Chasing Sun(Sets), Untold Story, and Sun(Sets) Radio."
        canonicalPath="/lineup"
      />
      <Navigation />

      <section className="page-shell-start-loose px-6 pb-8">
        <div className="container layout-default">
          <span className="section-kicker block text-white/42">Monolith Project Index</span>
          <RevealText as="h1" className={sectionTitleClass}>
            ARTISTS
          </RevealText>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            A roster view modeled as identity on the left and work on the right. Radio guests show episode
            covers. Event artists show flyers, series frames, and live visuals.
          </p>
        </div>
      </section>

      <section className="sticky sticky-shell-top z-30 border-y border-white/10 bg-black/75 px-6 py-4 backdrop-blur-xl">
        <div className="container layout-default">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
                      isActive
                        ? filter.value === "chasing-sunsets"
                          ? "border-[#E8B86D]/45 bg-[#E8B86D]/10 text-[#F3D6A0]"
                          : filter.value === "untold-story"
                            ? "border-[#22D3EE]/45 bg-[#22D3EE]/10 text-[#9BE7F7]"
                            : filter.value === "sunsets-radio"
                              ? "border-[#C2703E]/45 bg-[#C2703E]/10 text-[#F3CDAF]"
                              : "border-white/20 bg-white/8 text-white"
                        : "border-white/10 text-white/52 hover:border-white/20 hover:text-white/80",
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
                onClick={() => setViewMode("list")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors",
                  viewMode === "list"
                    ? "border-white/20 bg-white/8 text-white"
                    : "border-white/10 text-white/52 hover:border-white/20 hover:text-white/80",
                )}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors",
                  viewMode === "grid"
                    ? "border-white/20 bg-white/8 text-white"
                    : "border-white/10 text-white/52 hover:border-white/20 hover:text-white/80",
                )}
              >
                <Grid2x2 className="h-3.5 w-3.5" />
                Grid
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-8 md:pb-24">
        <div className="container layout-default">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/44">
              {filteredArtists.length} Artist{filteredArtists.length === 1 ? "" : "s"}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/34">
              {viewMode === "list" ? "Identity + Work Preview" : "Poster Grid"}
            </span>
          </div>

          {viewMode === "list" ? (
            <div>
              {filteredArtists.map((artist) => (
                <ArtistListRow key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredArtists.map((artist) => (
                <ArtistGridCard key={artist.id} artist={artist} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="container layout-default border-t border-white/10 pt-12">
          <span className="section-kicker block text-white/42">Artist Booking / Submissions</span>
          <h2 className="section-display-title-compact max-w-[8ch] text-white">
            WANT TO PLAY
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 md:text-lg">
            Booking inquiries for Chasing Sun(Sets) and Untold Story rooms, plus Sun(Sets) Radio guest submissions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/booking" className="btn-pill-primary btn-pill-wide">
              Artist Booking
            </Link>
            <Link href="/submit" className="btn-pill-outline btn-pill-wide">
              Radio Submission
            </Link>
          </div>
        </div>
      </section>

      <EntityBoostStrip tone="dark" className="pb-16" />
      <TicketTicker />
      <SlimSubscribeStrip title="GET LINEUP DROPS FIRST" source="lineup_strip" />
    </div>
  );
}
