import { ArrowUpRight, Check, Lock } from "lucide-react";
import { Link } from "wouter";
import { getEventById, getSeriesColor, getSeriesLabel } from "@/lib/siteExperience";
import { getEventDetailsHref, isEventLowInventory } from "@/lib/cta";
import { LIVE_RED } from "@/lib/brand";

const FEATURED_SINGLE_ID = "us-s3e3";
const FEATURED_TIERED_ID = "css-jul04";

export default function LiveTickets() {
  const singleEvent = getEventById(FEATURED_SINGLE_ID);
  const tieredEvent = getEventById(FEATURED_TIERED_ID);

  if (!singleEvent && !tieredEvent) return null;

  const totalAvailable = (tieredEvent?.ticketTiers?.length ?? 0) + (singleEvent ? 1 : 0);

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
            {totalAvailable.toString().padStart(2, "0")} Releases
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {singleEvent && <SingleEventCard event={singleEvent} />}
          {tieredEvent && <TieredEventCard event={tieredEvent} />}
        </div>
      </div>
    </section>
  );
}

function SingleEventCard({ event }: { event: NonNullable<ReturnType<typeof getEventById>> }) {
  const color = getSeriesColor(event.series);
  const href = getEventDetailsHref(event);
  const title = event.headline || event.episode || event.title;
  const lowInventory = isEventLowInventory(event);
  const label = getSeriesLabel(event.series);

  return (
    <Link
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

        <h3 className="font-display text-2xl md:text-[1.75rem] uppercase text-white leading-[0.95] tracking-tight">
          {title}
        </h3>
      </div>

      <div className="relative mt-8 flex items-end justify-between">
        <div>
          <span className="block font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 mb-1">
            From
          </span>
          <span
            className="font-display text-3xl md:text-4xl leading-none"
            style={{ color }}
          >
            {event.startingPrice ? `$${event.startingPrice}` : "—"}
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
}

function TieredEventCard({ event }: { event: NonNullable<ReturnType<typeof getEventById>> }) {
  const color = getSeriesColor(event.series);
  const href = getEventDetailsHref(event);
  const title = event.headline || event.episode || event.title;
  const label = getSeriesLabel(event.series);
  const tiers = event.ticketTiers ?? [];

  return (
    <Link
      href={href}
      className="group relative bg-black p-6 md:p-8 flex flex-col justify-between min-h-[260px] md:min-h-[300px] md:col-span-2 transition-colors duration-500 hover:bg-white/[0.02]"
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

      <div className="relative grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 md:gap-10 items-start">
        <div>
          <div className="flex items-center justify-between gap-3 mb-5">
            <span
              className="font-mono text-[10px] tracking-[0.35em] uppercase"
              style={{ color }}
            >
              {label}
            </span>
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">
              Tiered Release
            </span>
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

          <h3 className="font-display text-2xl md:text-[1.75rem] uppercase text-white leading-[0.95] tracking-tight mb-4">
            {title}
          </h3>

          {event.description && (
            <p className="font-serif italic text-[13px] md:text-[14px] leading-relaxed text-white/55 max-w-[42ch]">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex flex-col divide-y divide-white/10 border-y border-white/10 md:border-y-0 md:border md:border-white/10">
          {tiers.map((tier, i) => {
            const isLive = tier.available;
            const isNext = !isLive && i === tiers.findIndex((t) => !t.available);
            return (
              <div
                key={tier.id}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  isLive ? "" : "opacity-55"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border"
                    style={{
                      borderColor: isLive ? `${LIVE_RED}88` : "rgba(255,255,255,0.2)",
                      backgroundColor: isLive ? `${LIVE_RED}1a` : "transparent",
                    }}
                  >
                    {isLive ? (
                      <Check className="w-3 h-3" style={{ color: LIVE_RED }} />
                    ) : (
                      <Lock className="w-2.5 h-2.5 text-white/40" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white truncate">
                        {tier.name}
                      </span>
                      {isLive && (
                        <span
                          className="font-mono text-[8px] tracking-[0.35em] uppercase px-1 py-0.5 border"
                          style={{ color: LIVE_RED, borderColor: `${LIVE_RED}66` }}
                        >
                          Live
                        </span>
                      )}
                      {isNext && (
                        <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-white/40">
                          Next
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className="font-display text-xl md:text-2xl leading-none shrink-0"
                  style={{ color: isLive ? color : "rgba(255,255,255,0.35)" }}
                >
                  ${tier.price}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between">
        <div>
          <span className="block font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 mb-1">
            From
          </span>
          <span
            className="font-display text-3xl md:text-4xl leading-none"
            style={{ color }}
          >
            {event.startingPrice ? `$${event.startingPrice}` : "—"}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase text-white group-hover:gap-3 transition-all">
          <span className="hidden sm:inline">Secure Early</span>
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
}
