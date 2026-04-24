import { Check, ArrowRight, Lock, Anchor } from "lucide-react";
import type { ScheduledEvent } from "@shared/events/types";
import { useUI } from "@/contexts/UIContext";
import { useLocation } from "wouter";
import { getSeriesEvents } from "@/lib/siteExperience";

type ChasingSunsetsTicketingProps = {
  featuredEvent?: ScheduledEvent | null;
  seasonEvents?: ScheduledEvent[];
};

function getReleaseStatus(event?: ScheduledEvent | null) {
  if (!event) {
    return {
      dotClassName: "bg-white/40",
      labelClassName: "text-white/60",
      label: "Release Tracking",
    };
  }

  if (event.status === "on-sale" && event.ticketUrl) {
    return {
      dotClassName: "bg-green-400",
      labelClassName: "text-green-400",
      label: "Tickets On Sale",
    };
  }

  if (event.activeFunnels?.length) {
    return {
      dotClassName: "bg-[#E8B86D]",
      labelClassName: "text-[#E8B86D]",
      label: "Registration Open",
    };
  }

  return {
    dotClassName: "bg-white/40",
    labelClassName: "text-white/60",
    label: "Coming Soon",
  };
}

export default function ChasingSunsetsTicketing({
  featuredEvent,
  seasonEvents,
}: ChasingSunsetsTicketingProps) {
  const { openDrawer } = useUI();
  const [, setLocation] = useLocation();
  const chasingEvents = seasonEvents ?? getSeriesEvents("chasing-sunsets");
  const pricingEvent = featuredEvent ?? chasingEvents[0];
  const tiers = pricingEvent?.ticketTiers ?? [];
  const releaseStatus = getReleaseStatus(pricingEvent);
  const releaseTitle = pricingEvent?.headline || pricingEvent?.title || "Featured Release";
  const releaseEpisode = pricingEvent?.episode || "Featured Chapter";
  const releaseDate = pricingEvent?.date || "Date TBA";
  const releaseVenue = pricingEvent?.venue || "Castaways";
  const hasStructuredPricing = tiers.length > 0;

  return (
    <div
      data-featured-event-id={pricingEvent?.id}
      className="relative overflow-hidden border-t border-[#E8B86D]/25 bg-[linear-gradient(180deg,rgba(7,5,4,0.9),rgba(15,10,7,0.96))] px-6 py-24 shadow-[inset_0_1px_0_rgba(232,184,109,0.08)]"
    >
        {/* Background Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,184,109,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(194,112,62,0.12),transparent_32%)] pointer-events-none" />
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[#E8B86D]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[#C2703E]/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E8B86D]/35 to-transparent pointer-events-none" />

        <div className="container layout-default relative z-10">
            <div className="text-center mb-20">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E8B86D] block mb-4">
                  2ND ANNUAL 4TH OF JULY
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#F4D7A1]/75 block mb-4">
                  @ {releaseVenue.toUpperCase()}
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-7xl uppercase text-white tracking-widest leading-[0.85] mb-6">
                    CHASING SUN(SETS) SEASON 2026
                </h2>
                <p className="font-display text-2xl md:text-4xl uppercase text-[#F4D7A1] tracking-wide mb-5">
                  Tradition begins on the lakefront.
                </p>
                <p className="text-white/60 max-w-3xl mx-auto text-xs md:text-sm mt-4 leading-relaxed">
                  Sign up for the drop - season details, schedule, lineup, and July 4th first access coming soon.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8 font-mono text-[10px] tracking-[0.22em] text-white/75 uppercase">
                  {[
                    "JULY 4TH HOMECOMING",
                    "SEASON 2026",
                    "LINEUP COMING SOON",
                    "SCHEDULE COMING SOON",
                    "FIRST ACCESS OPEN",
                  ].map((badge) => (
                    <span key={badge} className="rounded-full border border-[#E8B86D]/35 bg-black/30 px-3 py-1">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button
                    onClick={() => openDrawer("newsletter")}
                    className="btn-pill-sunsets btn-pill-wide"
                  >
                    SIGN UP FOR THE DROP
                  </button>
                  <button
                    onClick={() => setLocation("/schedule")}
                    className="btn-pill-outline btn-pill-outline-sunsets btn-pill-wide"
                  >
                    VIEW SEASON DATES
                  </button>
                </div>
            </div>

            {/* Season Passes Tier (The Anchor) */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* GA Season Pass */}
                <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-[#E8B86D]/20 bg-[linear-gradient(180deg,rgba(30,20,12,0.94),rgba(11,9,8,0.97))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.28)] ring-1 ring-inset ring-white/6 transition-colors group hover:border-[#E8B86D]/35">
                    <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/8 blur-[40px] transition-colors group-hover:bg-[#E8B86D]/16" />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)] pointer-events-none" />
                    
                    <span className="relative z-10 mb-2 font-mono text-[10px] tracking-widest uppercase text-[#F4D7A1]/70">Access All Dates</span>
                    <h3 className="relative z-10 mb-2 font-display text-4xl uppercase text-white">Season Pass</h3>
                    
                    <div className="relative z-10 mb-8 flex items-baseline gap-2">
                        <span className="font-display text-5xl text-white tracking-tighter">$119</span>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-[#F4D7A1]/55">GA Tier</span>
                    </div>

                    <ul className="relative z-10 mb-10 flex-1 space-y-4">
                        {[
                            "Guaranteed entry to all 3 summer dates",
                            "Significant savings vs. single ticket pricing",
                            "Priority access to internal venue announcements",
                            "Skip the presale rush"
                        ].map((perk, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                                <Check className="w-5 h-5 text-[#E8B86D] shrink-0" />
                                <span>{perk}</span>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => openDrawer('newsletter')}
                        className="btn-pill-outline btn-pill-outline-sunsets btn-pill-wide relative z-10"
                    >
                        Season Updates
                    </button>
                </div>

                {/* VIP Season Pass */}
                <div className="relative flex flex-col overflow-hidden rounded-[2rem] border border-[#E8B86D]/40 bg-[linear-gradient(180deg,rgba(56,34,12,0.96),rgba(22,14,8,0.98))] p-8 shadow-[0_24px_72px_rgba(232,184,109,0.14)] ring-1 ring-inset ring-[#E8B86D]/12 group">
                    <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#E8B86D]/14 blur-[60px]" />
                    <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.04),transparent_48%)] pointer-events-none" />
                    
                    <div className="relative z-10 mb-4 inline-flex items-center gap-2 self-start rounded border border-[#E8B86D]/30 bg-[#E8B86D]/10 px-3 py-1 text-[10px] font-mono tracking-widest uppercase text-[#E8B86D]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8B86D] animate-pulse"></span>
                        Highly Limited
                    </div>

                    <h3 className="relative z-10 mb-2 line-clamp-1 font-display text-4xl uppercase text-white">VIP Pass</h3>
                    
                    <div className="flex items-baseline gap-2 mb-8 relative z-10">
                        <span className="font-display text-5xl text-[#E8B86D] tracking-tighter">$249</span>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-[#E8B86D]/60 mt-2">VIP Tier</span>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1 relative z-10">
                        {[
                            "Expedited premium entry lane",
                            "Dedicated viewing zones with prime sightlines",
                            "Private bar line & premium restrooms",
                            "Commemorative physical season credential",
                            "Internal first-access to July 5 Boat Show release"
                        ].map((perk, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                                <Check className="w-5 h-5 text-[#E8B86D] shrink-0 drop-shadow-[0_0_8px_rgba(232,184,109,0.5)]" />
                                <span>{perk}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => setLocation('/vip')}
                        className="btn-pill-sunsets btn-pill-wide relative z-10"
                    >
                        Request VIP Table
                    </button>
                </div>
            </div>

            {/* Single Events */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-8 mt-16">
                
                {/* Featured Release */}
                <div className="relative flex flex-col justify-center overflow-hidden rounded-[2rem] border border-[#E8B86D]/18 bg-[linear-gradient(180deg,rgba(27,18,11,0.95),rgba(9,8,8,0.97))] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.26)] ring-1 ring-inset ring-white/6">
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent_42%)] pointer-events-none" />
                    <div className="relative z-10 mb-8 flex flex-col items-start justify-between gap-8 border-b border-[#E8B86D]/14 pb-8 md:flex-row md:items-center">
                        <div>
                            <span className="mb-2 block font-mono text-[10px] tracking-widest uppercase text-[#F4D7A1]/70">{releaseEpisode}</span>
                            <h3 className="font-display text-[clamp(2rem,5vw,2.75rem)] uppercase text-white leading-[0.95] max-w-[16ch]">
                              {releaseTitle}
                            </h3>
                            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#E8B86D]">
                              {releaseDate}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full opacity-75 ${releaseStatus.dotClassName}`} />
                                <span className={`relative inline-flex h-2 w-2 ${releaseStatus.dotClassName}`} />
                            </span>
                            <span className={`font-mono text-[10px] tracking-widest uppercase font-bold ${releaseStatus.labelClassName}`}>
                              {releaseStatus.label}
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 grid gap-8 md:grid-cols-2">
                        {hasStructuredPricing ? (
                          <div className="space-y-2">
                              {tiers.map((tier, i) => {
                                  const isActive = tier.available;
                                  const isLast = !isActive && i === tiers.length - 1;
                                  return (
                                      <div key={tier.id} className="flex items-center justify-between border-b border-white/8 pb-4">
                                          <span className={`font-mono text-sm tracking-widest uppercase ${isActive ? "text-white" : "text-white/50"}`}>{tier.name}</span>
                                          <span className={`font-display text-2xl tracking-tighter ${isActive ? "text-[#E8B86D]" : isLast ? "text-white/30 line-through decoration-white/20" : "text-white/50"}`}>
                                              {!isActive && <Lock className="w-3.5 h-3.5 inline mr-1 opacity-50" />}${tier.price}
                                          </span>
                                      </div>
                                  );
                              })}
                          </div>
                        ) : (
                          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#F4D7A1]/70">
                              Pricing Window
                            </span>
                            <p className="mt-4 text-sm leading-relaxed text-white/75">
                              The next pricing move for this chapter has not been published yet. Join the updates list and you will get the first release before the public drop.
                            </p>
                            {typeof pricingEvent?.startingPrice === "number" ? (
                              <p className="mt-5 font-mono text-xs uppercase tracking-[0.22em] text-[#E8B86D]">
                                First public tier starts from ${pricingEvent.startingPrice}
                              </p>
                            ) : null}
                          </div>
                        )}

                        <div className="flex flex-col justify-end">
                            <button 
                                onClick={() => openDrawer('newsletter')}
                                className="btn-pill-outline btn-pill-outline-sunsets btn-pill-wide group"
                            >
                                Unlock Presale <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
                              {hasStructuredPricing
                                ? "First-release pricing is limited"
                                : "Priority notice lands before the public release"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* The "Classified" Secret Tier */}
                <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,12,12,0.94),rgba(5,5,5,0.98))] p-8 text-center shadow-[0_20px_48px_rgba(0,0,0,0.32)] ring-1 ring-inset ring-white/6 group">
                     {/* scanlines */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] pointer-events-none" />
                    
                    <Anchor className="w-8 h-8 text-white/20 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">Classified</span>
                    <h3 className="font-display text-2xl uppercase text-white/40 mb-4 tracking-widest">July 5th Recovery</h3>
                    
                    <div className="px-4 py-2 border border-white/10 bg-white/5 mt-2 rounded font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 flex flex-col items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Decrypting: 06.20.2026
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
