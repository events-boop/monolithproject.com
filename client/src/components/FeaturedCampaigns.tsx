import { ArrowUpRight, PlayCircle, Calendar } from "lucide-react";
import { Link } from "wouter";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { getUpcomingEvents, getSeriesColor, getSeriesLabel, getEventEyebrow } from "@/lib/siteExperience";
import { getEventCta } from "@/lib/cta";

const heroArchiveImage = getResponsiveImage("heroMonolith", "(min-width: 1024px) 67vw, 100vw");

function CampaignBackdrop({
  alt,
  className,
  sizes,
  sources,
  src,
}: {
  alt: string;
  className: string;
  sizes: string;
  sources: {
    srcSet: string;
    type: string;
    media?: string;
    sizes?: string;
  }[];
  src: string;
}) {
  return (
    <picture className={className}>
      {sources.map((source) => (
        <source
          key={source.type}
          media={source.media}
          sizes={source.sizes || sizes}
          srcSet={source.srcSet}
          type={source.type}
        />
      ))}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
    </picture>
  );
}

export default function FeaturedCampaigns() {
  const campaigns = getUpcomingEvents(2);

  if (campaigns.length === 0) return null;

  return (
    <section className="py-24 bg-black border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[11px] md:text-sm tracking-[0.3em] uppercase text-white/65 block mb-4">
                Active Campaigns
              </span>
              <h2 className="font-display text-[clamp(1.8rem,6vw,3.5rem)] md:text-5xl uppercase text-white tracking-widest">
                Upcoming Highlights
              </h2>
            </div>
            <p className="text-white/72 max-w-sm text-sm">
              Start with the biggest upcoming Monolith events and the latest radio release.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {campaigns.map((event) => {
            const color = getSeriesColor(event.series);
            const cta = getEventCta(event);
            const eyebrow = getEventEyebrow(event);
            const seriesHref = event.series === "untold-story" ? "/story" : event.series === "chasing-sunsets" ? "/chasing-sunsets" : "/schedule";

            return (
              <Link
                key={event.id}
                href={seriesHref}
                className="group relative border border-white/10 bg-white/[0.01] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[500px] transition-colors"
                style={{ "--campaign-color": color } as React.CSSProperties}
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <div
                        className="px-3 py-1 text-[11px] font-mono tracking-widest uppercase rounded flex items-center gap-2 border"
                        style={{ color, backgroundColor: `${color}18`, borderColor: `${color}33` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse" style={{ backgroundColor: color }} />
                        {eyebrow}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/72 text-[11px] font-mono tracking-widest uppercase">
                          <Calendar className="w-3.5 h-3.5" /> {event.date}
                      </div>
                  </div>
                  <h3
                    className="font-display text-[clamp(2rem,6vw,3.2rem)] md:text-5xl uppercase text-white leading-[0.9] mb-4 transition-colors"
                    style={{ ["--tw-text-opacity" as string]: 1 }}
                    onMouseEnter={() => {}} // hover color via group
                  >
                    <span className="group-hover:text-[var(--campaign-color)] transition-colors">
                      {getSeriesLabel(event.series)}<br/>{event.title}
                    </span>
                  </h3>
                  {event.description && (
                    <p className="text-white/78 font-sans max-w-sm mb-8 text-sm md:text-base">
                      {event.description}
                    </p>
                  )}
                  <div
                    className="flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase font-bold group-hover:underline decoration-1 underline-offset-[12px]"
                    style={{ color }}
                  >
                      {cta.label} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Third Row: Archive Video & Radio */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
            {/* Video Recap */}
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 group overflow-hidden min-h-[300px] flex flex-col justify-center border-l-4 border-l-[#E05A3A]">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-black/80 z-0" />
                <CampaignBackdrop
                  src={heroArchiveImage.src}
                  sources={heroArchiveImage.sources}
                  sizes={heroArchiveImage.sizes}
                  alt=""
                  className="absolute inset-0 z-0 opacity-10 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#E8B86D]/10 to-transparent mix-blend-screen pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 h-full w-full">
                    <div className="max-w-md">
                        <span className="font-mono text-[11px] md:text-sm tracking-[0.3em] uppercase text-[#E8B86D] mb-4 block">Event Archive</span>
                        <h3 className="font-display text-3xl md:text-5xl uppercase text-white mb-4 leading-[0.9] drop-shadow-xl">
                           Chasing Sun(Sets)<br/>4th of July 2025
                        </h3>
                        <p className="text-white/78 text-sm md:text-base leading-relaxed">
                            Look back at our defining daytime rooftop set from last summer before reserving your spot for this year.
                        </p>
                    </div>

                    <a
                      href="/videos/hero-video-short.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open the Chasing Sun(Sets) 4th of July 2025 recap video"
                      title="Open recap video"
                      className="shrink-0 flex items-center justify-center p-6 lg:p-10 rounded-full border border-white/20 bg-black/50 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all cursor-pointer shadow-2xl group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                    >
                        <PlayCircle className="w-8 h-8 md:w-12 md:h-12 text-white group-hover:text-black" />
                    </a>
                </div>
            </div>

            {/* Radio Feature */}
            <div className="relative border border-white/10 bg-[#060606] p-6 md:p-8 flex flex-col justify-between group">
                <div className="mb-6">
                   <span className="font-mono text-[11px] md:text-sm tracking-[0.3em] uppercase text-white/65 mb-3 block">Radio Show</span>
                   <h3 className="font-display text-2xl uppercase text-white mb-2">Chasing Sun(Sets) Radio Show</h3>
                   <p className="text-white/82 text-xs leading-relaxed">Open the newest mix in the full Chasing Sun(Sets) Radio Show archive instead of a third-party embed.</p>
                </div>

                <div className="w-full relative overflow-hidden rounded-[12px] border border-white/10 bg-black/40 p-5 md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#E05A3A]">Latest Audio Drop</span>
                      <h4 className="mt-3 font-display text-2xl uppercase text-white leading-none">Chasing Sun(Sets) Radio</h4>
                      <p className="mt-3 text-sm leading-relaxed text-white/78">
                        Launch the full player, browse recent episodes, and listen in a cleaner view without the embedded SoundCloud chrome.
                      </p>
                    </div>
                    <div className="shrink-0 rounded-full border border-white/15 bg-white/5 p-4">
                      <PlayCircle className="h-8 w-8 text-[#E8B86D]" />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/radio"
                      className="inline-flex items-center gap-3 border border-white bg-white px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black transition-colors hover:bg-black hover:text-white"
                    >
                      Open Radio Show
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="https://soundcloud.com/chasing-sun-sets"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 border border-white/20 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-white/82 transition-colors hover:border-white hover:text-white"
                    >
                      SoundCloud Archive
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
