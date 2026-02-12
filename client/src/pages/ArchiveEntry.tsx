import { ArrowLeft, ArrowUpRight, Camera, Disc3, MapPin } from "lucide-react";
import { Link, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import { getArchiveRecapBySlug, getEpisodeBySlug } from "@/data/archive";

export default function ArchiveEntry() {
  const [, params] = useRoute<{ slug: string }>("/archive/:slug");
  const recap = getArchiveRecapBySlug(params?.slug || "");
  const episode = recap?.relatedEpisodeSlug ? getEpisodeBySlug(recap.relatedEpisodeSlug) : null;

  if (!recap) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <section className="pt-44 pb-24 px-6">
          <div className="container max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-primary mb-4">Archive Entry Missing</p>
            <h1 className="font-display text-5xl md:text-7xl mb-6">No Recap Found</h1>
            <Link href="/archive">
              <a className="btn-pill-coral inline-flex">Back To Archive</a>
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(circle at 14% 16%, rgba(224,90,58,0.2), transparent 34%), radial-gradient(circle at 82% 18%, rgba(34,211,238,0.2), transparent 36%), linear-gradient(180deg, #070c18 0%, #04070f 100%)",
      }}
    >
      <Navigation />

      <section className="pt-44 pb-10 px-6">
        <div className="container max-w-6xl mx-auto">
          <Link href="/archive">
            <a className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back To Archive
            </a>
          </Link>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-white/55 mb-3">{recap.subtitle}</p>
          <h1 className="font-display text-[clamp(2.8rem,10vw,6.4rem)] leading-[0.86] mb-3">{recap.title}</h1>
          <p className="text-white/80 text-lg max-w-3xl">{recap.summary}</p>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="container max-w-6xl mx-auto grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 border border-white/20 rounded-2xl overflow-hidden bg-black/25">
            <img src={recap.image} alt={recap.title} className="w-full h-[420px] object-cover" />
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="border border-white/20 rounded-2xl p-5 bg-white/5">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/60 mb-3">Details</p>
              <div className="space-y-2 text-sm">
                <p className="text-white/80">{recap.date}</p>
                <p className="text-white/80 inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white/45" />
                  {recap.location}
                </p>
                <p className="text-white/80 inline-flex items-center gap-2">
                  <Camera className="w-4 h-4 text-white/45" />
                  {recap.photographer}
                </p>
              </div>
            </div>

            <div className="border border-white/20 rounded-2xl p-5 bg-white/5">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/60 mb-3">Highlights</p>
              <ul className="space-y-2">
                {recap.highlights.map((highlight) => (
                  <li key={highlight} className="text-white/80 text-sm">
                    • {highlight}
                  </li>
                ))}
              </ul>
            </div>

            {recap.galleryUrl && (
              <a
                href={recap.galleryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-clay/70 text-clay rounded-full text-xs font-bold tracking-[0.15em] uppercase hover:bg-clay/10 transition-colors inline-flex items-center gap-2"
              >
                Full Gallery
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {episode && (
        <section className="px-6 pb-20">
          <div className="container max-w-6xl mx-auto border border-white/20 rounded-2xl p-5 md:p-6 bg-white/5">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/60 mb-3 inline-flex items-center gap-2">
              <Disc3 className="w-3.5 h-3.5" />
              Related Episode
            </p>
            <h2 className="font-display text-3xl md:text-4xl mb-4">{episode.title}</h2>
            <p className="text-white/75 mb-6 max-w-3xl">{episode.commentary}</p>
            <div className="rounded-xl overflow-hidden border border-white/20">
              <iframe
                title={`${episode.title} SoundCloud player`}
                width="100%"
                height="166"
                allow="autoplay"
                src={episode.embedUrl}
              />
            </div>
          </div>
        </section>
      )}

      <SlimSubscribeStrip title="MORE RECAPS SOON" source={`archive_${recap.slug}_strip`} />
      <Footer />
    </div>
  );
}

