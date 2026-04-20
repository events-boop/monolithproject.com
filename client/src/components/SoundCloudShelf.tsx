import { ArrowUpRight, Headphones } from "lucide-react";
import { Link, useLocation } from "wouter";
import { radioEpisodes } from "@/data/radioEpisodes";
import { getSceneForPath } from "@/lib/scenes";
import ResponsiveImage from "./ResponsiveImage";

const featuredEpisodes = radioEpisodes.slice(0, 4);

const accentByBrand: Record<string, string> = {
  monolith: "#D4A574",
  "chasing-sunsets": "#E8B86D",
  "untold-story": "#22D3EE",
  radio: "#F43F5E",
};

export default function SoundCloudShelf() {
  const [location] = useLocation();
  const scene = getSceneForPath(location);
  const accent = accentByBrand[scene.brand] || accentByBrand.monolith;

  return (
    <section className="border-y border-white/8 bg-[#050505] text-white">
      <div className="container layout-wide px-6 py-10 md:py-12">
        <div className="flex flex-col gap-5 border-b border-white/8 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span
              className="mb-3 block font-mono text-[10px] uppercase tracking-[0.35em]"
              style={{ color: accent }}
            >
              SoundCloud Archive
            </span>
            <h2 className="font-display text-[clamp(2.25rem,4.5vw,4.75rem)] uppercase leading-[0.88] tracking-tight text-white">
              Latest Covers
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45 md:text-base">
              Fresh artwork from the Sun(Sets) radio archive, surfaced like a closing shelf before the footer.
            </p>
          </div>

          <div className="flex items-center gap-4 md:justify-end">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-white/30 md:block">
              {featuredEpisodes.length.toString().padStart(2, "0")} selections
            </span>
            <Link
              href="/radio"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.28em] text-white/60 transition-colors hover:text-white"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-6 flex gap-px overflow-x-auto bg-white/8 pb-2 scrollbar-none md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
          {featuredEpisodes.map((episode) => {
            const coverSrc = episode.coverImage || episode.image;

            return (
              <a
                key={episode.slug}
                href={episode.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group min-w-[78vw] bg-[#070709] text-left transition-colors hover:text-white sm:min-w-[340px] md:min-w-0"
              >
                <div className="relative aspect-square overflow-hidden border border-white/10 bg-black">
                  <div className="glass-refract absolute inset-0">
                    <ResponsiveImage
                      src={coverSrc}
                      alt={`${episode.guest} ${episode.title} SoundCloud artwork`}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 78vw"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover brightness-[0.9] transition-[filter] duration-500 group-hover:brightness-[0.75]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <span
                      className="rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-white/75"
                      style={{ borderColor: `${accent}66` }}
                    >
                      {episode.shortCode}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
                      {episode.duration}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm">
                      <Headphones className="h-3.5 w-3.5" />
                      Listen on SoundCloud
                    </div>
                  </div>
                </div>

                <div className="border border-t-0 border-white/10 px-4 py-4">
                  <p
                    className="font-mono text-[10px] uppercase tracking-[0.28em]"
                    style={{ color: accent }}
                  >
                    {episode.guest}
                  </p>
                  <h3 className="mt-2 font-display text-[1.25rem] uppercase leading-[0.95] tracking-[0.02em] text-white">
                    {episode.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                    <span>{episode.displayDate}</span>
                    <span className="inline-flex items-center gap-1.5 text-white/55 transition-colors group-hover:text-white">
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
