import {
  Anchor,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Ticket,
  Users,
  Waves,
} from "lucide-react";
import type { ScheduledEvent } from "@shared/events/types";
import { useLocation } from "wouter";
import { getSeriesEvents } from "@/lib/siteExperience";
import { appendAttributionQueryParams } from "@/lib/attribution";
import { trackAccessEvent, trackTicketIntent } from "@/lib/api";
import {
  SUNSETS_JULY4_ADMISSION_TIERS,
  SUNSETS_JULY4_EVENT_ADDRESS,
  SUNSETS_JULY4_EVENT_LOCATION,
  SUNSETS_JULY4_EVENT_TIME,
  SUNSETS_JULY4_EVENT_TITLE,
  SUNSETS_JULY4_EVENT_VENUE,
  SUNSETS_JULY4_FIRST_ACCESS_CODE,
  SUNSETS_JULY4_LINEUP,
  SUNSETS_JULY4_REVENUE,
  SUNSETS_JULY4_SET_TIMES,
  SUNSETS_JULY4_TABLE_MINIMUM,
  SUNSETS_JULY4_TABLE_RAIL,
  SUNSETS_PRELAUNCH_LOCKED,
  SUNSETS_JULY4_TICKET_PATH,
  SUNSETS_JULY4_TOTAL_CAPACITY,
  SUNSETS_TICKET_CTA_LABEL,
  SUNSETS_TICKET_CTA_SUPPORT,
  captureSunsetsTicketCtaClick,
} from "@/lib/sunsetsTicketing";

const TICKET_RAIL_STATS = [
  {
    label: "Capacity",
    value: SUNSETS_JULY4_TOTAL_CAPACITY.toLocaleString("en-US"),
    note: "guest admissions",
  },
  {
    label: "First Access",
    value: SUNSETS_JULY4_FIRST_ACCESS_CODE,
    note: SUNSETS_PRELAUNCH_LOCKED ? "hidden tier" : "$30 hidden tier",
  },
  {
    label: "Tables",
    value: SUNSETS_PRELAUNCH_LOCKED ? "By request" : SUNSETS_JULY4_TABLE_MINIMUM,
    note: "6 premium cabanas",
  },
  {
    label: "Ticket Rail",
    value: SUNSETS_PRELAUNCH_LOCKED ? "Lake List" : "Posh",
    note: SUNSETS_PRELAUNCH_LOCKED ? "first access" : "official source",
  },
] as const;

const PUBLIC_RULES = [
  "Ticket tiers are released in order. When a tier sells out, the price moves.",
  "Before 2PM Arrival Pass holders must be checked in before 2:00 PM.",
  "Tables and cabanas are handled through the VIP inquiry rail, not free admission tickets.",
] as const;

const PUBLIC_COPY_BLOCKS = [
  {
    kicker: "Why This One Matters",
    title: "Watch the sun. Stay for the sets.",
    body: "Music brings people together when the setting, the sound, and the moment are aligned. On July 4th, we bring that back to the lake: open air, skyline views, house music, and a crowd built around connection.",
  },
  {
    kicker: "Entry Info",
    title: "Ticketed event. Valid ID required.",
    body: "Arrive early to avoid peak entry delays. All sales are subject to ticketing platform and venue policies. Before 2PM Arrival Pass holders must be checked in before 2:00 PM.",
  },
  {
    kicker: "After Party",
    title: "Details shared separately.",
    body: "Official after party details will be shared with ticket holders and announced separately.",
  },
  {
    kicker: "Presented By The Monolith Project",
    title: "Rooted in the city where house music was born.",
    body: "Chicago-based music and cultural experience platform. House music. Artist-led events. Intentional community. Togetherness is the frequency. Music is the guide.",
  },
] as const;

type ChasingSunsetsTicketingProps = {
  featuredEvent?: ScheduledEvent | null;
  seasonEvents?: ScheduledEvent[];
};

function handleTicketClick(source: string) {
  if (SUNSETS_PRELAUNCH_LOCKED) return "/sunsets";
  const href = appendAttributionQueryParams(SUNSETS_JULY4_TICKET_PATH);
  captureSunsetsTicketCtaClick({
    destinationUrl: href,
    pagePath: "/chasing-sunsets",
    ctaPosition: source === "primary" ? "primary" : "secondary",
  });
  void trackTicketIntent(source, "css-jul04", href);
  return href;
}

export default function ChasingSunsetsTicketing({
  featuredEvent,
  seasonEvents,
}: ChasingSunsetsTicketingProps) {
  const [, setLocation] = useLocation();
  const chasingEvents = seasonEvents ?? getSeriesEvents("chasing-sunsets");
  const pricingEvent = featuredEvent ?? chasingEvents[0];
  const ticketHref = SUNSETS_PRELAUNCH_LOCKED
    ? "/sunsets"
    : appendAttributionQueryParams(SUNSETS_JULY4_TICKET_PATH);

  return (
    <section
      data-featured-event-id={pricingEvent?.id}
      className="relative overflow-hidden border-y border-[#f4d58d]/22 bg-[#080a07] px-6 py-20 text-white md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(244,213,141,0.16),rgba(8,10,7,0)_34%),radial-gradient(circle_at_82%_22%,rgba(20,184,166,0.13),transparent_30%),linear-gradient(180deg,#080a07_0%,#11150f_52%,#080a07_100%)]" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#f4d58d]/70 to-transparent" />

      <div className="container layout-wide relative z-10">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:items-end">
          <div>
            <span className="inline-flex items-center gap-2 border border-[#f4d58d]/28 bg-[#f4d58d]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#f4d58d]">
              <Ticket className="h-3.5 w-3.5" /> Ticketing / Access
            </span>
            <h2 className="mt-5 font-display text-[clamp(3.1rem,6.4vw,6.8rem)] uppercase leading-[0.84] tracking-normal text-white">
              SUN(SETS) I
              <span className="block text-[#f4d58d]">July 4th</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/82 md:text-xl">
              Chasing Sun(Sets) returns home to the lake for a full-day house
              music experience at Castaways Beach Club. Golden hour, Lake
              Michigan, and the skyline behind you.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={ticketHref}
                onClick={() => handleTicketClick("primary")}
                className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#f4d58d] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-white"
              >
                <Ticket className="h-4 w-4" />
                {SUNSETS_TICKET_CTA_LABEL}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                onClick={() => {
                  trackAccessEvent("vip_inquiry_click", {
                    buttonName: "Request Table / Cabana",
                    destinationUrl: "/vip",
                    eventSlug: pricingEvent?.slug || pricingEvent?.id,
                    eventDate: pricingEvent?.date,
                    channel: "site",
                    source: "chasing_sunsets_ticketing",
                  });
                  setLocation("/vip");
                }}
                className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/18 bg-white/[0.06] px-6 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-[#f4d58d]/60 hover:bg-white/[0.1]"
              >
                <Users className="h-4 w-4" />
                Tables / Cabanas
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/48">
              {SUNSETS_TICKET_CTA_SUPPORT}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {TICKET_RAIL_STATS.map(stat => (
              <div key={stat.label} className="border border-white/12 bg-white/[0.055] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#f4d58d]">
                  {stat.label}
                </p>
                <p className="mt-3 font-display text-[clamp(1.85rem,3vw,3rem)] uppercase leading-none text-white">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-white/55">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {PUBLIC_COPY_BLOCKS.map(block => (
            <article key={block.kicker} className="border border-white/10 bg-black/28 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8ee8dd]">
                {block.kicker}
              </p>
              <h3 className="mt-4 text-lg font-black leading-tight text-white">
                {block.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/64">{block.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="border border-[#f4d58d]/22 bg-[#f4d58d]/10 p-5 lg:col-span-2">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#f4d58d]">
                  Final Ticket Tiers
                </p>
                <h3 className="mt-3 font-display text-[clamp(2rem,4vw,4rem)] uppercase leading-[0.88] text-white">
                  The lake has a limit.
                </h3>
              </div>
            </div>
          </div>
          <div className="border border-white/12 bg-black/30 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8ee8dd]">
              Event Details
            </p>
            <dl className="mt-4 space-y-3 text-sm text-white/70">
              <div className="flex gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#f4d58d]" />
                <div>
                  <dt className="sr-only">Title</dt>
                  <dd>{SUNSETS_JULY4_EVENT_TITLE}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#f4d58d]" />
                <dd>{SUNSETS_JULY4_EVENT_TIME}</dd>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f4d58d]" />
                <dd>
                  {SUNSETS_JULY4_EVENT_VENUE} · {SUNSETS_JULY4_EVENT_LOCATION}
                  <span className="block text-white/42">{SUNSETS_JULY4_EVENT_ADDRESS}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {SUNSETS_JULY4_ADMISSION_TIERS.map(tier => (
            <article
              key={tier.id}
              className={`border p-5 transition hover:-translate-y-1 ${
                tier.highlight
                  ? "border-[#f4d58d]/50 bg-[#f4d58d]/12 shadow-[0_24px_70px_rgba(244,213,141,0.12)]"
                  : "border-white/12 bg-white/[0.055]"
              }`}
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/70">
                    {tier.visibility}
                  </p>
                  <h4 className="mt-3 text-lg font-black leading-tight text-white">
                    {tier.name}
                  </h4>
                </div>
                <div className="text-right">
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">
                    {SUNSETS_PRELAUNCH_LOCKED ? "Allocation locked" : tier.quantityLabel}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/68">{tier.description}</p>
              <div className="mt-5 grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/48">
                <span>{tier.admissionLabel}</span>
                <span>{tier.timing}</span>
              </div>
              {tier.rule && !SUNSETS_PRELAUNCH_LOCKED ? (
                <p className="mt-4 border-l-2 border-[#f4d58d]/55 pl-3 text-xs font-semibold leading-relaxed text-[#f8e7b3]">
                  {tier.rule}
                </p>
              ) : null}
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <article className="border border-[#8ee8dd]/26 bg-[#8ee8dd]/10 p-6 md:p-7">
            <div className="flex items-center gap-3">
              <Anchor className="h-5 w-5 text-[#8ee8dd]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8ee8dd]">
                Tables / Cabanas
              </p>
            </div>
            <h3 className="mt-4 font-display text-[clamp(2rem,3vw,3.4rem)] uppercase leading-[0.9] text-white">
              {SUNSETS_JULY4_TABLE_RAIL.name}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/72">
              {SUNSETS_PRELAUNCH_LOCKED
                ? "Limited tables and 6 premium cabanas are available for SUN(SETS) I — reserved space for your group. Pricing shared on inquiry."
                : SUNSETS_JULY4_TABLE_RAIL.description}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                SUNSETS_JULY4_TABLE_RAIL.quantityLabel,
                SUNSETS_JULY4_TABLE_RAIL.admissionLabel,
              ].map(item => (
                <span key={item} className="border border-white/10 bg-black/24 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/76">
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold leading-relaxed text-[#f8e7b3]">
              {SUNSETS_JULY4_TABLE_RAIL.rule}
            </p>
            <button
              onClick={() => {
                trackAccessEvent("vip_inquiry_click", {
                  buttonName: "Request Table / Cabana",
                  destinationUrl: "/vip",
                  eventSlug: pricingEvent?.slug || pricingEvent?.id,
                  eventDate: pricingEvent?.date,
                  channel: "site",
                  source: "chasing_sunsets_ticketing_table_rail",
                });
                setLocation("/vip");
              }}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#f4d58d]"
            >
              Request Table / Cabana <ArrowRight className="h-4 w-4" />
            </button>
          </article>

          <article className="border border-white/12 bg-white/[0.055] p-6 md:p-7">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#f4d58d]">
                  <Waves className="h-4 w-4" /> Lineup
                </p>
                <ul className="mt-5 space-y-3">
                  {SUNSETS_JULY4_LINEUP.map(artist => (
                    <li key={artist} className="font-display text-[clamp(1.55rem,2.4vw,2.55rem)] uppercase leading-none text-white">
                      {artist === "Kiko Franco" ? (
                        <a
                          href="/artists/kiko-franco"
                          className="underline-offset-8 transition-colors hover:text-[#f4d58d] hover:underline"
                        >
                          {artist}
                        </a>
                      ) : (
                        artist
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8ee8dd]">
                  <Clock className="h-4 w-4" /> Set Times
                </p>
                <ol className="mt-5 space-y-3">
                  {SUNSETS_JULY4_SET_TIMES.map(slot => (
                    <li key={`${slot.time}-${slot.label}`} className="flex gap-3 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
                      <span className="min-w-[9.5rem] font-mono text-[10px] uppercase tracking-[0.18em] text-[#f4d58d]">
                        {slot.time}
                      </span>
                      <span className="text-sm font-semibold text-white/72">{slot.label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PUBLIC_RULES.map(rule => (
            <div key={rule} className="flex gap-3 border border-white/10 bg-black/24 p-4 text-sm leading-relaxed text-white/66">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#f4d58d]" />
              <span>{rule}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <p className="max-w-2xl text-sm leading-relaxed text-white/54">
            Secure your entry early. Capacity is limited, ticket tiers move as allocations sell out, and all ticket purchases route through the official Posh rail.
          </p>
          <a
            href={ticketHref}
            onClick={() => handleTicketClick("footer")}
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 border border-[#f4d58d]/42 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#f4d58d] transition hover:bg-[#f4d58d] hover:text-black"
          >
            {SUNSETS_TICKET_CTA_LABEL} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
