import { ArrowUpRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import { getUpcomingEvents, getSeriesColor, getEventEyebrow } from "@/lib/siteExperience";
import { getEventDetailsHref } from "@/lib/cta";

const seriesFallbackImage: Record<string, string> = {
  "chasing-sunsets": "/images/chasing-sunsets-premium.webp",
  "untold-story": "/images/untold-story-juany-deron-v2.webp",
  "monolith-project": "/images/hero-monolith.webp",
};

export default function FeaturedCampaigns() {
  const campaigns = getUpcomingEvents(2);

  if (campaigns.length === 0) return null;

  return (
    <section className="py-24 bg-black border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <p className="text-white/70 max-w-md text-sm md:text-base leading-relaxed">
              The next two Monolith events.
            </p>
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-white/40 shrink-0">
              {campaigns.length.toString().padStart(2, "0")} Upcoming
            </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {campaigns.map((event) => {
            const color = getSeriesColor(event.series);
            const eyebrow = getEventEyebrow(event);
            const detailsHref = getEventDetailsHref(event);
            const cardImage = event.image || seriesFallbackImage[event.series];
            const cardHeadline = event.headline || event.episode || event.title;

            return (
              <Link
                key={event.id}
                href={detailsHref}
                className="group relative border border-white/10 hover:border-[var(--campaign-color)]/50 bg-white/[0.01] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[500px] transition-[border-color,transform] duration-500"
                style={{ "--campaign-color": color } as React.CSSProperties}
              >
                {cardImage && (
                  <img
                    src={cardImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-700 group-hover:scale-[1.08] group-hover:opacity-60"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-soft-light"
                  style={{ background: `radial-gradient(120% 80% at 50% 100%, ${color}22, transparent 70%)` }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <div
                        className="px-3 py-1 text-[11px] font-mono tracking-widest uppercase rounded flex items-center gap-2 border"
                        style={{ color, backgroundColor: `${color}18`, borderColor: `${color}33` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse" style={{ backgroundColor: color }} />
                        {eyebrow}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-mono tracking-widest uppercase">
                          <Calendar className="w-3.5 h-3.5" /> {event.date}
                      </div>
                  </div>
                  <h3
                    className="font-display text-[clamp(2rem,6vw,3.2rem)] md:text-5xl uppercase text-white leading-[0.9] mb-4 transition-colors"
                    style={{ ["--tw-text-opacity" as string]: 1 }}
                  >
                    <span className="group-hover:text-[var(--campaign-color)] transition-colors">
                      {cardHeadline}
                    </span>
                  </h3>
                  {event.description && (
                    <p className="text-white/80 font-sans max-w-sm mb-8 text-sm md:text-base">
                      {event.description}
                    </p>
                  )}
                  <div
                    className="flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase font-bold group-hover:underline decoration-1 underline-offset-[12px]"
                    style={{ color }}
                  >
                      See The Night <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
