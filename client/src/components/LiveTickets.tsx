import { ArrowUpRight, Check, Lock, Ticket, Zap } from "lucide-react";
import { Link } from "wouter";
import { getEventById, getSeriesColor, getSeriesLabel } from "@/lib/siteExperience";
import { getEventCta, getEventDetailsHref, isEventLowInventory } from "@/lib/cta";
import type { EventCta, FunnelTool } from "@/lib/cta";
import { LIVE_RED } from "@/lib/brand";
import type { ScheduledEvent } from "@shared/events/types";

const FEATURED_TIERED_ID = "css-jul04";
const ACTION_EVENT_IDS = ["us-s3e3", "us-jul04", "css-aug22"];

export default function LiveTickets() {
  const tieredEvent = getEventById(FEATURED_TIERED_ID);
  const actionEvents = ACTION_EVENT_IDS
    .map((id) => getEventById(id))
    .filter((e): e is ScheduledEvent => Boolean(e));

  if (!tieredEvent && actionEvents.length === 0) return null;

  const totalReleases = (tieredEvent?.ticketTiers?.length ?? 0) + actionEvents.length;

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
            {totalReleases.toString().padStart(2, "0")} Releases
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {tieredEvent && <TieredEventCard event={tieredEvent} />}

          <div className="flex flex-col divide-y divide-white/10 bg-black">
            {actionEvents.map((event) => (
              <ActionCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function toolIcon(tool: FunnelTool) {
  if (tool === "laylo") return <Lock className="w-4 h-4 md:w-5 md:h-5" />;
  if (tool === "fillout") return <Zap className="w-4 h-4 md:w-5 md:h-5" />;
  return <Ticket className="w-4 h-4 md:w-5 md:h-5" />;
}

function ctaHref(cta: EventCta, fallback: string) {
  return cta.href || fallback;
}

function TieredEventCard({ event }: { event: ScheduledEvent }) {
  const color = getSeriesColor(event.series);
  const detailsHref = getEventDetailsHref(event);
  const title = event.headline || event.episode || event.title;
  const label = getSeriesLabel(event.series);
  const tiers = event.ticketTiers ?? [];
  const firstLockedIndex = tiers.findIndex((t) => !t.available);
  const cta = getEventCta(event);
  const href = ctaHref(cta, detailsHref);
  const startingPrice = event.startingPrice;

  return (
    <div className="group relative bg-black p-6 md:p-8 flex flex-col justify-between lg:col-span-2 transition-colors duration-500">
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

      <div className="relative grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 md:gap-10 items-start mb-8">
        <div>
          <div className="flex items-center justify-between gap-3 mb-5">
            <Link
              href={detailsHref}
              className="font-mono text-[10px] tracking-[0.35em] uppercase hover:opacity-70 transition-opacity"
              style={{ color }}
            >
              {label}
            </Link>
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

          <Link
            href={detailsHref}
            className="block font-display text-[1.75rem] md:text-[2.25rem] lg:text-[2.5rem] uppercase text-white leading-[0.9] tracking-tight mb-4 hover:text-white/80 transition-colors"
          >
            {title}
          </Link>

          {event.description && (
            <p className="font-serif italic text-[13px] md:text-[14px] leading-relaxed text-white/55 max-w-[42ch]">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex flex-col divide-y divide-white/10 border-y border-white/10 md:border-y-0 md:border md:border-white/10">
          {tiers.map((tier, i) => {
            const isLive = tier.available;
            const isNext = !isLive && i === firstLockedIndex;
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

      {/* BRUTAL CTA SLAB */}
      <Link
        href={href}
        target={cta.isExternal ? "_blank" : undefined}
        rel={cta.isExternal ? "noopener noreferrer" : undefined}
        className="relative group/cta flex items-center justify-between gap-4 px-5 md:px-8 py-5 md:py-7 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{
          backgroundColor: LIVE_RED,
          boxShadow: `0 12px 40px -10px ${LIVE_RED}80`,
        }}
        data-cta-source="live-tickets-hero"
        data-cta-tool={cta.tool}
      >
        <div className="flex items-center gap-3 md:gap-5 text-black">
          {toolIcon(cta.tool)}
          <span className="font-display text-[1.5rem] md:text-[2.25rem] leading-none uppercase tracking-tight">
            {cta.label}
          </span>
          {startingPrice ? (
            <span className="font-display text-[1.5rem] md:text-[2.25rem] leading-none uppercase tracking-tight opacity-60">
              · From ${startingPrice}
            </span>
          ) : null}
        </div>
        <span className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center bg-black text-white transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1">
          <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
        </span>
      </Link>
    </div>
  );
}

function ActionCard({ event }: { event: ScheduledEvent }) {
  const color = getSeriesColor(event.series);
  const detailsHref = getEventDetailsHref(event);
  const title = event.headline || event.episode || event.title;
  const label = getSeriesLabel(event.series);
  const lowInventory = isEventLowInventory(event);
  const isOnSale = event.status === "on-sale";
  const cta = getEventCta(event);
  const href = ctaHref(cta, detailsHref);
  const statusLabel = isOnSale
    ? lowInventory ? "Final Release" : "On Sale"
    : event.startingPrice ? "Presale" : "Waitlist";

  return (
    <div className="group relative flex-1 flex items-center gap-4 md:gap-5 p-5 md:p-6 transition-colors duration-500 hover:bg-white/[0.03] min-h-[140px]">
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-500 group-hover:w-[3px]"
        style={{ backgroundColor: color }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={detailsHref}
            className="font-mono text-[9px] tracking-[0.35em] uppercase hover:opacity-70 transition-opacity"
            style={{ color }}
          >
            {label}
          </Link>
          <span className="text-white/20">·</span>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 truncate">
            {event.date}
          </span>
        </div>

        <Link
          href={detailsHref}
          className="block font-display text-[1.1rem] md:text-[1.25rem] leading-[0.95] uppercase text-white tracking-tight truncate hover:text-white/80 transition-colors"
        >
          {title}
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <span
            className="font-mono text-[8px] tracking-[0.35em] uppercase px-1.5 py-0.5 border"
            style={{
              color: isOnSale ? LIVE_RED : "rgba(255,255,255,0.55)",
              borderColor: isOnSale ? `${LIVE_RED}66` : "rgba(255,255,255,0.2)",
            }}
          >
            {statusLabel}
          </span>
          {event.startingPrice && (
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">
              From <span className="text-white font-bold">${event.startingPrice}</span>
            </span>
          )}
        </div>
      </div>

      {/* FILLED ACTION CHIP */}
      <Link
        href={href}
        target={cta.isExternal ? "_blank" : undefined}
        rel={cta.isExternal ? "noopener noreferrer" : undefined}
        className="shrink-0 inline-flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        style={{
          backgroundColor: isOnSale ? LIVE_RED : color,
          color: isOnSale ? "#000" : "#000",
        }}
        data-cta-source="live-tickets-action"
        data-cta-tool={cta.tool}
      >
        <span className="hidden sm:inline">{cta.label}</span>
        <span className="sm:hidden">{cta.tool === "laylo" ? "Notify" : "Get"}</span>
        <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </Link>
    </div>
  );
}
