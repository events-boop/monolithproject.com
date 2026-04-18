import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { getEventById, getSeriesColor, getSeriesLabel } from "@/lib/siteExperience";
import { getEventDetailsHref, isEventLowInventory } from "@/lib/cta";
import { LIVE_RED } from "@/lib/brand";

interface FeaturedPick {
  eventId: string;
  tierLabel?: string;
  priceOverride?: number;
  accent?: string;
}

const FEATURED: FeaturedPick[] = [
  { eventId: "us-s3e3" },
  { eventId: "css-jul04", tierLabel: "Early Release", priceOverride: 30 },
  { eventId: "css-jul04", tierLabel: "Advance Release", priceOverride: 40 },
];

export default function LiveTickets() {
  const picks = FEATURED.map((pick) => ({ pick, event: getEventById(pick.eventId) })).filter(
    (p) => p.event,
  );

  if (picks.length === 0) return null;

  return (
    <section className="relative bg-black border-y border-white/10 py-14 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${LIVE_RED}aa, transparent)` }}
      />

      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-8 md:mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                className="absolute inset-0 rounded-full motion-safe:animate-ping opacity-75"
                style={{ backgroundColor: LIVE_RED }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: LIVE_RED }}
              />
            </span>
            <span
              className="font-mono text-[11px] md:text-[12px] tracking-[0.5em] uppercase font-bold"
              style={{ color: LIVE_RED }}
            >
              Featured Event
            </span>
            <span className="h-px w-8 md:w-12 bg-white/20" />
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-white/70">
              On Sale
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 shrink-0">
            {picks.length.toString().padStart(2, "0")} Available
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {picks.map(({ pick, event }, index) => {
            if (!event) return null;
            const color = pick.accent ?? getSeriesColor(event.series);
            const href = getEventDetailsHref(event);
            const title = event.headline || event.episode || event.title;
            const lowInventory = isEventLowInventory(event);
            const price = pick.priceOverride ?? event.startingPrice;
            const label = pick.tierLabel ?? getSeriesLabel(event.series);

            return (
              <Link
                key={`${pick.eventId}-${index}`}
                href={href}
                className="group relative bg-black p-6 md:p-8 flex flex-col justify-between min-h-[260px] md:min-h-[300px] transition-colors duration-500 hover:bg-white/[0.02]"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 group-hover:w-[3px]"
                  style={{ backgroundColor: color }}
                />
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(120% 80% at 0% 0%, ${color}14, transparent 60%)`,
                  }}
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span
                      className="font-mono text-[10px] tracking-[0.35em] uppercase"
                      style={{ color }}
                    >
                      {label}
                    </span>
                    {lowInventory && (
                      <span
                        className="font-mono text-[9px] tracking-[0.3em] uppercase border px-1.5 py-0.5"
                        style={{ color: LIVE_RED, borderColor: `${LIVE_RED}66` }}
                      >
                        Final Release
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 mb-4">
                    <span>{event.date}</span>
                    {event.venue && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="truncate">{event.venue}</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-display text-2xl md:text-[1.75rem] uppercase text-white leading-[0.95] tracking-tight transition-colors group-hover:text-white">
                    {title}
                  </h3>
                </div>

                <div className="relative mt-8 flex items-end justify-between">
                  <div>
                    <span className="block font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 mb-1">
                      From
                    </span>
                    <span
                      className="font-display text-3xl md:text-4xl text-white leading-none"
                      style={{ color }}
                    >
                      {price ? `$${price}` : "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-white group-hover:gap-3 transition-all">
                    <span className="hidden sm:inline">Secure</span>
                    <span
                      className="flex h-8 w-8 items-center justify-center border transition-colors group-hover:bg-white group-hover:text-black"
                      style={{ borderColor: `${color}66` }}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
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
