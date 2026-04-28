import { Anchor, ArrowRight, Calendar, Check, Lock, MapPin } from "lucide-react";
import type { ScheduledEvent } from "@shared/events/types";
import { useLocation } from "wouter";
import { getSeriesEvents } from "@/lib/siteExperience";
import { CHASING_SUNSETS_DROP_URL } from "@/lib/dropLinks";

type ChasingSunsetsTicketingProps = {
  featuredEvent?: ScheduledEvent | null;
  seasonEvents?: ScheduledEvent[];
};

function getReleaseStatus(event?: ScheduledEvent | null) {
  if (!event) {
    return {
      dotClassName: "bg-[#C2703E]/50",
      labelClassName: "text-[#2C1810]/56",
      label: "Release Tracking",
    };
  }

  if (event.status === "on-sale" && event.ticketUrl) {
    return {
      dotClassName: "bg-[#3D8A57]",
      labelClassName: "text-[#3D8A57]",
      label: "Tickets On Sale",
    };
  }

  if (event.activeFunnels?.length) {
    return {
      dotClassName: "bg-[#A4592C]",
      labelClassName: "text-[#A4592C]",
      label: "Registration Open",
    };
  }

  return {
    dotClassName: "bg-[#2C1810]/30",
    labelClassName: "text-[#2C1810]/54",
    label: "Coming Soon",
  };
}

const SEASON_PASS_PERKS = [
  "Guaranteed entry to all tracked summer dates",
  "Lower total cost than buying each chapter separately",
  "Priority access to venue and lineup updates",
  "The cleanest way to stay inside the season arc",
];

const VIP_PASS_PERKS = [
  "Expedited entry lane across the season",
  "Better sightlines and higher-touch access",
  "Private bar line and premium restroom routing",
  "Priority for the July 5 recovery release",
];

export default function ChasingSunsetsTicketing({
  featuredEvent,
  seasonEvents,
}: ChasingSunsetsTicketingProps) {
  const [, setLocation] = useLocation();
  const chasingEvents = seasonEvents ?? getSeriesEvents("chasing-sunsets");
  const pricingEvent = featuredEvent ?? chasingEvents[0];
  const tiers = pricingEvent?.ticketTiers ?? [];
  const releaseStatus = getReleaseStatus(pricingEvent);
  const releaseTitle = pricingEvent?.headline || pricingEvent?.title || "Featured Release";
  const releaseEpisode = pricingEvent?.episode || "Featured Chapter";
  const releaseDate = pricingEvent?.date || "Date TBA";
  const releaseVenue = pricingEvent?.venue || "Castaways";
  const releaseLocation = pricingEvent?.location || "Chicago";
  const hasStructuredPricing = tiers.length > 0;
  const seasonEventCount = chasingEvents.length || 3;

  return (
    <section
      data-featured-event-id={pricingEvent?.id}
      className="relative overflow-hidden border-t border-[#C2703E]/14 bg-[linear-gradient(180deg,rgba(244,233,214,0.92),rgba(251,245,237,0.98))] px-6 py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(232,184,109,0.14),transparent_28%),radial-gradient(circle_at_82%_74%,rgba(194,112,62,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8B86D]/40 to-transparent" />

      <div className="container layout-wide relative z-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-end">
          <div className="max-w-3xl">
            <span className="block font-mono text-[10px] uppercase tracking-[0.34em] text-[#A4592C]">
              Ticketing / Access
            </span>
            <h2 className="mt-4 font-display text-[clamp(3rem,6vw,6.2rem)] uppercase leading-[0.86] tracking-tight text-[#2C1810] hyphens-none break-keep">
              CHASING SUN(SETS)
              <br />
              SEASON 2026
            </h2>
            <p className="mt-4 font-serif text-[clamp(1.35rem,2vw,1.95rem)] italic text-[#A4592C]">
              Tradition begins on the lakefront.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#2C1810]/70 md:text-lg">
              This block now carries the same season language as the rest of the page: featured chapter,
              access logic, pass options, and early-drop routing in one place instead of a separate dark promo wall.
            </p>
          </div>

          <div className="sunset-panel-editorial p-6 md:p-8">
            <div className="flex flex-wrap gap-2.5">
              <span className="rounded-full border border-[#C2703E]/16 bg-white/72 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2C1810]/70">
                {releaseVenue.toUpperCase()}
              </span>
              <span className="rounded-full border border-[#C2703E]/16 bg-white/72 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2C1810]/70">
                {seasonEventCount} tracked dates
              </span>
              <span className={`inline-flex items-center gap-2 rounded-full border border-[#E8B86D]/24 bg-[#E8B86D]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] ${releaseStatus.labelClassName}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${releaseStatus.dotClassName}`} />
                {releaseStatus.label}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="sunset-panel-editorial-soft p-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.26em] text-[#A4592C]">Featured Date</span>
                <p className="mt-3 font-display text-2xl uppercase leading-[0.92] text-[#2C1810]">{releaseDate}</p>
              </div>
              <div className="sunset-panel-editorial-soft p-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.26em] text-[#A4592C]">Episode</span>
                <p className="mt-3 font-display text-2xl uppercase leading-[0.92] text-[#2C1810]">{releaseEpisode}</p>
              </div>
              <div className="sunset-panel-editorial-soft p-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.26em] text-[#A4592C]">Drop Route</span>
                <p className="mt-3 text-sm leading-relaxed text-[#2C1810]/64">
                  Release details, lineup, and access signals land here before the public push.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={CHASING_SUNSETS_DROP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-sunsets btn-pill-wide"
              >
                Sign Up For The Drop
              </a>
              <button
                onClick={() => setLocation("/schedule")}
                className="btn-pill-outline btn-pill-outline-sunsets-light btn-pill-wide"
              >
                View Season Dates
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <article className="sunset-panel-editorial p-6 md:p-8">
            <div className="flex flex-col gap-6 border-b border-[#C2703E]/12 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#A4592C]">{releaseEpisode}</span>
                <h3 className="mt-3 font-display text-[clamp(2.3rem,4vw,4rem)] uppercase leading-[0.88] text-[#2C1810]">
                  {releaseTitle}
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-[#C2703E]/14 bg-white/72 px-4 py-3">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#A4592C]">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </span>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#2C1810]/72">{releaseDate}</p>
                </div>
                <div className="rounded-[1.25rem] border border-[#C2703E]/14 bg-white/72 px-4 py-3">
                  <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#A4592C]">
                    <MapPin className="h-3.5 w-3.5" /> Venue
                  </span>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[#2C1810]/72">
                    {releaseVenue} / {releaseLocation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="sunset-panel-editorial-soft p-5 md:p-6">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#A4592C]">
                  {hasStructuredPricing ? "Release Tiers" : "Pricing Window"}
                </span>

                {hasStructuredPricing ? (
                  <div className="mt-5 space-y-3">
                    {tiers.map((tier, index) => {
                      const isActive = tier.available;
                      const isLast = index === tiers.length - 1;

                      return (
                        <div
                          key={tier.id}
                          className={`flex items-center justify-between border-[#C2703E]/10 ${isLast ? "" : "border-b pb-3"}`}
                        >
                          <span className={`font-mono text-xs uppercase tracking-[0.22em] ${isActive ? "text-[#2C1810]/78" : "text-[#2C1810]/42"}`}>
                            {tier.name}
                          </span>
                          <span className={`font-display text-[1.7rem] uppercase leading-none ${isActive ? "text-[#A4592C]" : "text-[#2C1810]/32 line-through decoration-[#2C1810]/20"}`}>
                            {!isActive ? <Lock className="mr-1 inline h-3.5 w-3.5 opacity-50" /> : null}
                            ${tier.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[1.25rem] border border-[#C2703E]/12 bg-white/72 p-5">
                    <p className="text-sm leading-relaxed text-[#2C1810]/68">
                      The next pricing move for this chapter has not been published yet. The drop list remains the first place where new access tiers land.
                    </p>
                    {typeof pricingEvent?.startingPrice === "number" ? (
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#A4592C]">
                        First public tier starts from ${pricingEvent.startingPrice}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <div className="sunset-panel-editorial-soft p-5 md:p-6">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#A4592C]">Release Route</span>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#2C1810]/66">
                    <li>Season updates move through one drop route instead of fragmented links.</li>
                    <li>Featured release, pricing logic, and pass access stay tied to the same chapter system.</li>
                    <li>{hasStructuredPricing ? "Early tiers are visible now. Later phases close out fast." : "Pricing is still staging. Join now if you want the first public move."}</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={CHASING_SUNSETS_DROP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-outline btn-pill-outline-sunsets-light btn-pill-wide"
                  >
                    Unlock Presale <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button onClick={() => setLocation("/schedule")} className="btn-pill-sunsets btn-pill-wide">
                    See All Dates
                  </button>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="sunset-panel-editorial-soft p-6 md:p-7">
              <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#A4592C]">Access All Dates</span>
              <div className="mt-4 flex items-end justify-between gap-4 border-b border-[#C2703E]/12 pb-5">
                <div>
                  <h3 className="font-display text-[2.2rem] uppercase leading-[0.92] text-[#2C1810]">Season Pass</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#2C1810]/62">For the people treating Chasing as a full summer run, not a one-off ticket.</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-4xl uppercase leading-none text-[#A4592C]">$119</span>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2C1810]/48">GA Tier</p>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {SEASON_PASS_PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm leading-relaxed text-[#2C1810]/68">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A4592C]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <a
                href={CHASING_SUNSETS_DROP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-outline btn-pill-outline-sunsets-light btn-pill-wide mt-6"
              >
                Season Updates
              </a>
            </article>

            <article className="rounded-[1.75rem] border border-[#E8B86D]/24 bg-[linear-gradient(180deg,rgba(250,239,212,0.86),rgba(255,247,231,0.78))] p-6 shadow-[0_20px_48px_rgba(44,24,16,0.06)] md:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8B86D]/36 bg-[#E8B86D]/12 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#A4592C]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A4592C]" />
                Highly Limited
              </div>
              <div className="mt-5 flex items-end justify-between gap-4 border-b border-[#C2703E]/12 pb-5">
                <div>
                  <h3 className="font-display text-[2.2rem] uppercase leading-[0.92] text-[#2C1810]">VIP Pass</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#2C1810]/62">Higher-touch entry, cleaner movement, and better positioning inside the room.</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-4xl uppercase leading-none text-[#A4592C]">$249</span>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2C1810]/48">VIP Tier</p>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {VIP_PASS_PERKS.map((perk) => (
                  <li key={perk} className="flex items-start gap-3 text-sm leading-relaxed text-[#2C1810]/68">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A4592C]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => setLocation("/vip")} className="btn-pill-sunsets btn-pill-wide mt-6">
                Request VIP Table
              </button>
            </article>

            <article className="sunset-panel-editorial-soft p-6 md:p-7">
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#A4592C]">
                <Anchor className="h-3.5 w-3.5" /> July 5 Recovery
              </span>
              <h3 className="mt-4 font-display text-[1.9rem] uppercase leading-[0.92] text-[#2C1810]">Recovery Signal</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2C1810]/64">
                The follow-up chapter stays intentionally quiet until the primary release window clears. This stays here as season context, not a separate mini-site tease.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C2703E]/18 bg-white/72 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2C1810]/56">
                <Lock className="h-3.5 w-3.5" /> Decrypting 06.20.2026
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
