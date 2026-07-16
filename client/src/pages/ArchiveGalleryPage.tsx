import { useEffect } from "react";
import { useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Camera, UploadCloud } from "lucide-react";
import { archiveCollectionsBySlug } from "@/data/galleryData";

// Dropbox file request — community uploads of DJ sets, photos, and videos.
const COMMUNITY_UPLOAD_URL = "https://www.dropbox.com/request/3f0662s872jlukad0r4h";

export default function ArchiveGalleryPage() {
  const [match, params] = useRoute("/:series/:season");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!match || !params?.series || !params?.season) return null;

  const key = `${params.series}-${params.season}`;
  const gallery = archiveCollectionsBySlug[key];

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
      <SEO title={`${gallery.title} — ${gallery.subtitle}`} />
      <Navigation variant="dark" brand={navBrand} />

      <main className="page-shell-start pb-32">
        <div className="container layout-wide px-6">
          <Link href="/archive" asChild>
            <a className="btn-text-action mb-12">
              <ArrowLeft className="w-4 h-4" /> Back to Archive
            </a>
          </Link>

          {gallery.comingSoon && gallery.media.length === 0 ? (
            <section aria-label={`${gallery.subtitle} — photos coming soon`}>
              <span
                className="font-mono text-[10px] tracking-[0.25em] uppercase block mb-4"
                style={{ color: gallery.accentColor }}
              >
                {gallery.date}
              </span>
              <h1 className="font-display text-3xl md:text-5xl uppercase tracking-wider text-white mb-3">
                {gallery.title}
              </h1>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/70 mb-6">
                {gallery.subtitle}
              </p>
              <p className="max-w-xl text-white/70 leading-relaxed mb-6">
                {gallery.description}
              </p>

              {gallery.journalHref && (
                <Link href={gallery.journalHref} asChild>
                  <a className="btn-text-action mb-12">
                    <BookOpen className="w-4 h-4" /> Read The Recap
                  </a>
                </Link>
              )}

              <div className="max-w-xl border border-white/12 bg-white/[0.03] p-8 text-center">
                <Camera
                  className="mx-auto mb-4 h-8 w-8 opacity-40"
                  style={{ color: gallery.accentColor }}
                />
                <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-white mb-2">
                  Photos Coming Soon
                </p>
                <p className="text-sm text-white/60 leading-relaxed mb-6">
                  The gallery and recap film are in the edit. Were you there?
                  Send us your photos, videos, or DJ sets — the best make the
                  official recap.
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
            </section>
          ) : (
            <>
              {gallery.journalHref && (
                <Link href={gallery.journalHref} asChild>
                  <a className="btn-text-action mb-10">
                    <BookOpen className="w-4 h-4" /> Read The Recap
                  </a>
                </Link>
              )}
              <MixedMediaGallery
                title={gallery.title}
                subtitle={gallery.subtitle}
                description={gallery.description}
                media={gallery.media}
                className="bg-transparent"
                dense
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
