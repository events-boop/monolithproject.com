import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Radio,
} from "lucide-react";
import { Link } from "wouter";

import JsonLd from "@/components/JsonLd";
import KineticDecryption from "./KineticDecryption";
import { buildScheduledEventSchema } from "@/lib/schema";
import { getEventCta } from "@/lib/cta";
import {
  getEventVenueLabel,
  getExperienceEvent,
  getSeriesLabel,
} from "@/lib/siteExperience";
import type { ScheduledEvent } from "@shared/events/types";

const CASTAWAYS_HERO_IMAGE = "/images/sunsets-castaways-hero.jpg";
const HERO_FALLBACK_IMAGE = "/images/chasing-sunsets.webp";
const HERO_TITLE = "MONOLITH";
const HERO_PILLARS = "Chicago House Music / Events / Radio";
const HERO_TAGLINE = "Togetherness is the frequency.";
const HERO_SUPPORTING_LINE =
  "The Monolith Project produces Chasing Sun(Sets), Untold Story, and artist-led radio in Chicago.";

function getStatusLabel(status?: ScheduledEvent["status"]) {
  if (status === "on-sale") return "On Sale";
  if (status === "sold-out") return "Sold Out";
  if (status === "past") return "Archive";
  return "Coming Soon";
}

function getFeaturedCopy(event?: ScheduledEvent | null) {
  return (
    event?.experienceIntro ||
    event?.description ||
    "The July 4 open-air Chasing Sun(Sets) chapter at Castaways. Join first access for lineup, table, and ticket-window updates before they move public."
  );
}

function EventFeatureCard({ event }: { event?: ScheduledEvent | null }) {
  const cta = getEventCta(event);
  const ctaIsExternal = /^https?:\/\//i.test(cta.href);
  const venueLabel = getEventVenueLabel(event);
  const eventTitle =
    event?.headline || event?.title || "July 4th Open-Air Experience";
  const eventSeries = event
    ? getSeriesLabel(event.series)
    : "Chasing Sun(Sets)";
  const eventDate = event?.date || "July 4, 2026";
  const eventTime = event?.time || "3:00 PM - 10:00 PM";
  const eventEpisode = event?.episode || "Independence Day";

  return (
    <aside
      data-home-hero-card="true"
      className="relative w-full max-w-[29rem] overflow-hidden rounded-[1.35rem] border border-white/16 bg-[#090909]/76 p-6 shadow-[0_35px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl sm:p-7 lg:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 text-[9rem] font-black uppercase leading-none tracking-[0] text-white/[0.035]"
      >
        SUN
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(232,184,109,0.13),transparent_34%),radial-gradient(circle_at_90%_100%,rgba(164,89,44,0.14),transparent_38%)]"
      />

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-white/58">
            {eventSeries}
          </div>
          <div className="rounded-full border border-white/10 bg-white/12 px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.16em] text-white/72">
            {getStatusLabel(event?.status)}
          </div>
        </div>

        <h2 className="max-w-[10.5ch] text-balance hero-wordmark text-[clamp(2.35rem,4.2vw,4.25rem)] uppercase leading-[0.9] tracking-[0] text-white">
          {eventTitle}
        </h2>

        <div className="mt-5 font-mono text-[11px] font-black uppercase tracking-[0.28em] text-[#d8b782]">
          {eventEpisode}
        </div>

        <div className="mt-6 space-y-4 border-b border-white/12 pb-6 text-sm text-white/78">
          <div className="flex items-center gap-4">
            <CalendarDays size={17} className="shrink-0 text-white/60" />
            {eventDate}
          </div>
          <div className="flex items-center gap-4">
            <MapPin size={17} className="shrink-0 text-white/60" />
            {venueLabel}
          </div>
          <div className="flex items-center gap-4">
            <Clock3 size={17} className="shrink-0 text-white/60" />
            {eventTime}
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-7 text-white/82">
          {getFeaturedCopy(event)}
        </p>

        <a
          href={cta.href}
          target={ctaIsExternal ? "_blank" : undefined}
          rel={ctaIsExternal ? "noopener noreferrer" : undefined}
          className="mt-7 inline-flex min-h-[3.65rem] w-full items-center justify-center rounded-full bg-[#f4f0ea] px-7 text-[11px] font-black uppercase tracking-[0.22em] text-black shadow-[0_18px_42px_rgba(0,0,0,0.34)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          {cta.label}
          <ArrowUpRight className="ml-4 h-4 w-4" strokeWidth={2.5} />
        </a>

        <div className="mt-5 text-center font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#b89a6b]">
          First Access / Limited Inventory
        </div>
      </div>
    </aside>
  );
}

export default function HeroSection() {
  const featuredEvent = getExperienceEvent("hero");
  const structuredData = featuredEvent ? (
    <JsonLd data={buildScheduledEventSchema(featuredEvent, "/")} />
  ) : null;

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] overflow-hidden bg-[#080808] text-white screen-shell-stable"
    >
      {structuredData}

      <div
        aria-hidden="true"
        className="absolute inset-0 scale-[1.02] bg-cover bg-center"
        style={{
          backgroundImage: `url(${CASTAWAYS_HERO_IMAGE}), url(${HERO_FALLBACK_IMAGE})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/42 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-black/54" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_55%,rgba(255,190,104,0.2),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.11] bg-[linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative z-10 flex min-h-[100dvh] flex-col px-6 pb-5 pt-[var(--shell-page-top-hero)] sm:px-8 lg:px-14">
        <div className="grid flex-1 items-end gap-10 pb-6 pt-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14 lg:pt-16 xl:gap-20">
          <div className="max-w-4xl">
            <div className="mb-12 hidden items-center gap-5 font-mono text-[10px] font-black uppercase tracking-[0.3em] text-white/58 md:flex lg:mb-20">
              <span>Monolith</span>
              <span className="h-px w-14 bg-white/28" />
              <span>Chicago</span>
            </div>

            <h1
              data-home-hero-heading="true"
              className="hero-wordmark text-[clamp(4.2rem,10vw,10.25rem)] uppercase leading-[0.82] tracking-[0] text-white drop-shadow-[0_22px_48px_rgba(0,0,0,0.62)]"
            >
              <KineticDecryption text={HERO_TITLE} autoStart={false} />
            </h1>

            <div
              data-home-hero-eyebrow="true"
              className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-white/62 sm:tracking-[0.3em]"
            >
              {HERO_PILLARS}
            </div>

            <h2 className="mt-7 max-w-2xl text-balance font-display text-[clamp(2rem,4.1vw,4.25rem)] uppercase leading-[0.9] tracking-[0] text-white">
              {HERO_TAGLINE}
            </h2>

            <p
              data-home-hero-summary="true"
              className="mt-6 max-w-xl text-base leading-7 text-white/78 md:text-lg"
            >
              {HERO_SUPPORTING_LINE}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/sunsets"
                className="inline-flex min-h-[4rem] items-center justify-center rounded-full bg-[#f4f0ea] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-black shadow-[0_18px_42px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 sm:text-[12px]"
              >
                Sun(Sets) Events
                <ArrowUpRight className="ml-4 h-4 w-4" strokeWidth={2.5} />
              </Link>

              <Link
                href="/story"
                className="inline-flex min-h-[4rem] items-center justify-center rounded-full border border-white/38 bg-white/[0.07] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/12 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/55 sm:text-[12px]"
              >
                Untold Story
                <ArrowUpRight className="ml-4 h-4 w-4" strokeWidth={2.5} />
              </Link>
            </div>

            <div className="mt-12 hidden font-mono text-[10px] uppercase tracking-[0.24em] text-white/50 md:block">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-[2px] w-20 bg-white/20" />
                <span className="h-[2px] w-10 bg-[#d8b782]" />
                <span className="h-[2px] w-16 bg-white/20" />
              </div>
              <div>41.8781 N, 87.6298 W</div>
              <div className="mt-1">Sector: Primary_Core</div>
            </div>
          </div>

          <div className="flex w-full justify-center lg:justify-end">
            <EventFeatureCard event={featuredEvent} />
          </div>
        </div>

        <Link
          href="/radio"
          className="relative z-20 flex min-h-16 items-center justify-between gap-4 rounded-[1.35rem] border border-white/14 bg-black/56 px-5 py-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/68 backdrop-blur-xl transition hover:border-white/28 hover:bg-black/68 sm:px-6 sm:text-[11px]"
        >
          <div className="flex min-w-0 items-center gap-4">
            <Radio size={22} className="shrink-0" />
            <span className="truncate">Listen Live: Monolith Radio</span>
          </div>
          <div className="hidden md:block">
            24/7 Chicago House Music & Culture
          </div>
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            Tune In <ArrowUpRight size={14} />
          </div>
        </Link>
      </div>
    </section>
  );
}
