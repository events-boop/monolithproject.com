import { useEffect } from "react";
import { buildGallerySchema } from "@shared/seo/gallery";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEO from "@/components/SEO";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Camera, Headphones, Pause, Play, UploadCloud } from "lucide-react";
import {
  archiveCollectionsBySlug,
  type ArchiveCollection,
} from "@/data/galleryData";
import { radioEpisodes } from "@/data/radioEpisodes";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";

// Dropbox file request — community uploads of DJ sets, photos, and videos.
const COMMUNITY_UPLOAD_URL =
  "https://www.dropbox.com/request/3f0662s872jlukad0r4h";

// Community upload panel. Renders standalone when a collection has no media
// yet, and under a seeded gallery while comingSoon is set (the edit is still
// in progress and the best community frames make the official recap).
function CommunityUploadPanel({ gallery }: { gallery: ArchiveCollection }) {
  return (
    <div className="max-w-xl border border-white/12 bg-white/[0.03] p-8 text-center">
      <Camera
        className="mx-auto mb-4 h-8 w-8 opacity-40"
        style={{ color: gallery.accentColor }}
      />
      <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-white mb-2">
        {gallery.media.length === 0 ? "Photos Coming Soon" : "More Coming"}
      </p>
      <p className="text-sm text-white/60 leading-relaxed mb-6">
        The gallery and recap film are in the edit. Were you there? Send us your
        photos, videos, or DJ sets — the best make the official recap.
      </p>
      <a
        href={COMMUNITY_UPLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[46px] items-center justify-center gap-2 border px-6 font-mono text-[11px] font-black uppercase tracking-[0.14em] transition-all hover:text-black"
        style={{
          borderColor: `${gallery.accentColor}80`,
          color: gallery.accentColor,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = gallery.accentColor;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <UploadCloud className="h-4 w-4" />
        Upload Your Sets, Photos + Videos
      </a>
    </div>
  );
}

export default function ArchiveGalleryPage() {
  const [match, params] = useRoute("/:series/:season");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!match || !params?.series || !params?.season) return null;

  const key =
    params.series === "archive"
      ? params.season
      : `${params.series}-${params.season}`;
  const gallery = archiveCollectionsBySlug[key];
  const audio = useOptionalGlobalAudio();

  const soundtrackEpisode =
    params.series === "untold-story" || key.startsWith("untold-story")
      ? radioEpisodes.find(ep => ep.slug === "ch-02-radian-no-sleep") ||
        radioEpisodes[0]
      : key.includes("sunsets-i")
        ? radioEpisodes.find(ep => ep.slug === "ep-02-ewerseen") ||
          radioEpisodes[0]
        : radioEpisodes.find(ep => ep.slug === "ep-004-benchek-part-2") ||
          radioEpisodes[0];

  const isSoundtrackActive = Boolean(
    soundtrackEpisode && audio?.activeTrack?.src === soundtrackEpisode.embedUrl
  );
  const isSoundtrackPlaying = Boolean(isSoundtrackActive && audio?.isPlaying);

  const navBrand: "chasing-sunsets" | "untold-story" | "monolith" =
    params.series === "chasing-sunsets" || params.series === "untold-story"
      ? params.series
      : "monolith";

  if (!gallery) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <p className="font-mono uppercase tracking-widest text-white/70">
          Gallery not found
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      <SEO
        title={`${gallery.title} — ${gallery.subtitle}`}
        description={gallery.description}
        canonicalPath={`/${params.series}/${params.season}`}
        image={gallery.coverImage}
        schemaData={buildGallerySchema(
          gallery,
          `/${params.series}/${params.season}`
        )}
      />
      <Navigation variant="dark" brand={navBrand} />

      <main id="main-content" tabIndex={-1} className="pb-32 lg-dusk-atmosphere">
        {/* Full-Bleed Cinematic Season Cover Hero */}
        <section className="relative flex min-h-[max(760px,96svh)] flex-col justify-between overflow-hidden border-b border-white/10 px-6 pb-12 pt-[calc(var(--shell-page-top-hero)+12px)] md:pb-16">
          <div className="absolute inset-0 z-0">
            <ResponsiveImage
              src={gallery.coverImage}
              alt={`${gallery.title} — ${gallery.subtitle}`}
              priority
              sizes="100vw"
              className="h-full w-full object-cover object-center opacity-80"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,5,5,0.48) 0%, rgba(5,5,5,0.12) 30%, rgba(5,5,5,0.34) 60%, rgba(5,5,5,0.92) 90%, #050505 100%), linear-gradient(90deg, rgba(5,5,5,0.74) 0%, rgba(5,5,5,0.22) 56%, rgba(5,5,5,0.08) 90%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 56% 42% at 22% 86%, ${gallery.accentColor}30 0%, rgba(243,166,89,0.12) 45%, transparent 74%)`,
              }}
            />
          </div>

          <div className="container layout-wide relative z-10 flex flex-wrap items-center justify-between gap-4">
            <Link href="/archive" asChild>
              <a className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/85 backdrop-blur-md transition-colors hover:border-[#f3a659]/50 hover:text-white">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Archive
              </a>
            </Link>

            {soundtrackEpisode && (
              <div className="lg-glass-card rounded-full px-3.5 py-2 flex items-center gap-3">
                <Headphones
                  className="h-4 w-4 text-[#f3b572] shrink-0"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">
                  Gallery Soundtrack · {soundtrackEpisode.guest}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (isSoundtrackActive) {
                      audio?.setPlaying(!isSoundtrackPlaying);
                    } else {
                      audio?.loadTrack({
                        slug: soundtrackEpisode.slug,
                        title: `${soundtrackEpisode.shortCode} · ${soundtrackEpisode.title}`,
                        artist: soundtrackEpisode.guest,
                        src: soundtrackEpisode.embedUrl,
                        coverImage:
                          soundtrackEpisode.coverImage || soundtrackEpisode.image,
                        duration: soundtrackEpisode.duration,
                      });
                    }
                  }}
                  className="lg-pill-amber !min-h-[34px] !px-3.5 !py-1"
                >
                  {isSoundtrackPlaying ? (
                    <>
                      <Pause className="h-3 w-3 fill-current" aria-hidden="true" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                      <span>Listen while browsing</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[18vh]" aria-hidden="true" />

          <div className="container layout-wide relative z-10">
            <div className="flex flex-wrap items-center gap-3.5 mb-5">
              <span
                className="font-mono text-[11px] tracking-[0.3em] uppercase rounded-full border px-3.5 py-1.5 bg-black/45 backdrop-blur-md"
                style={{
                  color: gallery.accentColor,
                  borderColor: `${gallery.accentColor}55`,
                }}
              >
                {gallery.date}
              </span>
              {gallery.subtitle && (
                <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/80">
                  {gallery.subtitle}
                </span>
              )}
            </div>

            <h1 className="font-display text-[clamp(3.2rem,8.5vw,7.8rem)] leading-[0.86] uppercase tracking-tight text-[#fbf6ee] drop-shadow-2xl max-w-5xl mb-5">
              {gallery.title}
            </h1>

            {gallery.description && (
              <p className="max-w-2xl text-base md:text-lg text-white/80 leading-relaxed mb-7">
                {gallery.description}
              </p>
            )}

            {gallery.journalHref && (
              <Link href={gallery.journalHref} asChild>
                <a className="lg-pill-glass inline-flex">
                  <BookOpen className="w-4 h-4" />
                  <span>Read The Recap</span>
                </a>
              </Link>
            )}
          </div>
        </section>

        <div className="container layout-wide px-6 pt-12">
          {gallery.comingSoon && gallery.media.length === 0 ? (
            <section aria-label={`${gallery.subtitle} — photos coming soon`}>
              <CommunityUploadPanel gallery={gallery} />
            </section>
          ) : (
            <>
              <MixedMediaGallery
                title={gallery.title}
                headingLevel="h2"
                subtitle={gallery.subtitle}
                description={gallery.description}
                media={gallery.media}
                className="bg-transparent !pt-0"
                dense
                hideHeader
                accentColor={gallery.accentColor}
                externalGallery={gallery.externalGallery}
              />
              {gallery.comingSoon && (
                <div className="mt-16">
                  <CommunityUploadPanel gallery={gallery} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
