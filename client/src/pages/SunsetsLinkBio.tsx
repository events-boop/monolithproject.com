import { type FormEvent, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  LockKeyhole,
  Mail,
  MapPin,
  Music,
  Phone,
  Play,
  QrCode,
  Radio,
  Send,
  ShieldCheck,
  Ticket,
  Users,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import HoneypotField from "@/components/HoneypotField";
import { Button } from "@/components/ui/button";
import { appendAttributionQueryParams } from "@/lib/attribution";
import {
  submitContactForm,
  submitNewsletterLead,
  trackFunnelPageView,
  trackLeadConversion,
  trackLinkClick,
} from "@/lib/api";
import { trackLakeLead, trackLakePageView } from "@/lib/campaignPixel";
import { buildLeadIdempotencyKey } from "@/lib/leadCapture";
import {
  SUNSETS_2026_SEASON_CHAPTERS,
  SUNSETS_2026_SEASON_PASS,
  SUNSETS_2026_SEASON_PASS_CTA_LABEL,
  SUNSETS_JULY4_ADMISSION_TIERS,
  SUNSETS_JULY4_EVENT_DATE as JULY_4_EVENT_DATE,
  SUNSETS_JULY4_EVENT_SLUG as JULY_4_EVENT_SLUG,
  SUNSETS_JULY4_LINEUP,
  SUNSETS_JULY4_TABLE_MINIMUM,
  SUNSETS_JULY4_TICKET_PATH as TICKET_HREF,
  SUNSETS_JULY4_TOTAL_CAPACITY,
  SUNSETS_TICKET_CTA_LABEL,
  SUNSETS_TICKET_CTA_SUPPORT,
  captureSunsetsTicketCtaClick,
  SUNSETS_PRELAUNCH_LOCKED,
} from "@/lib/sunsetsTicketing";
import { honeypotFieldName } from "@shared/generated/hardening";

type Chapter = {
  title: string;
  date: string;
  place: string;
  status: string;
  action: string;
  eventSlug?: string;
  eventDate?: string;
  href?: string;
};

type TrackableLink = {
  buttonName: string;
  href: string;
  eventSlug?: string;
  eventDate?: string;
  interestType?: string;
  channel?: string;
};

const PAGE_PATH = "/sunsets";
const PAGE_SOURCE = "sunsets_wrapper";
const CANONICAL_SUNSETS_URL = "https://sunsets.vip";
const HERO_IMAGE = "/images/chasing-sunsets-premium.webp";
const OG_IMAGE = "/images/chasing-sunsets-july4-first-access.png";
const SUNSETS_COVER_IMAGE = "/images/chasing-sunsets-firstaccess-flyer.png";
const SUNSETS_QR_IMAGE = "/images/sunsets-vip-sunsets-qr.svg";
const AUTOGRAF_YOUTUBE_EMBED =
  "https://www.youtube.com/embed/9R6XH7JZlJI?start=5506&list=RD9R6XH7JZlJI&rel=0&modestbranding=1";
const SOMMERS_SOUNDCLOUD_URL =
  "https://soundcloud.com/chasing-sun-sets/sommers-uk-ep0011-chapter-1-chasing-sunsets";
const SOMMERS_SOUNDCLOUD_EMBED = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  SOMMERS_SOUNDCLOUD_URL
)}&color=%2361e8ff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=true`;

const HERO_SIGNAL_STATS = [
  { label: "Date", value: "July 4", note: "Saturday" },
  { label: "Time", value: "12PM-10PM", note: "12PM doors" },
  { label: "Venue", value: "Castaways", note: "Chicago" },
] as const;

const TICKET_RAIL_STATS = [
  {
    label: "Capacity",
    value: SUNSETS_PRELAUNCH_LOCKED
      ? "Locked"
      : SUNSETS_JULY4_TOTAL_CAPACITY.toLocaleString("en-US"),
    note: SUNSETS_PRELAUNCH_LOCKED ? "revealed at launch" : "guest admissions",
  },
  {
    label: "First Access",
    value: SUNSETS_PRELAUNCH_LOCKED ? "Locked" : "SUNSET26",
    note: SUNSETS_PRELAUNCH_LOCKED ? "Lake List only" : "$30 Lake List code",
  },
  {
    label: "Tables",
    value: SUNSETS_PRELAUNCH_LOCKED ? "By request" : SUNSETS_JULY4_TABLE_MINIMUM,
    note: "limited cabanas",
  },
] as const;

const FEATURED_TICKET_TIERS = SUNSETS_JULY4_ADMISSION_TIERS.filter(tier =>
  [
    "before-2pm-arrival",
    "first-access-lake-list",
    "ga-tier-1",
    "four-pack-group-bundle",
  ].includes(tier.id)
);

import { triggerHaptic, trackSunsetsClick, scrollToSection, LakeListForm, FeaturedDropSignup, DJSubmissionModal, FormInput, SelectField, appendEventAttribution, ArtPlaceholder, focusLakeList } from "@/components/SunsetsLinkBioComponents";

export default function SunsetsLinkBio() {
  const [isDjModalOpen, setIsDjModalOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackFunnelPageView({
      pagePath: PAGE_PATH,
      eventSlug: JULY_4_EVENT_SLUG,
      source: PAGE_SOURCE,
    });
    trackLakePageView();
  }, []);

  const chapters = useMemo<Chapter[]>(
    () =>
      SUNSETS_2026_SEASON_CHAPTERS.map((chapter, index) => ({
        title: chapter.title,
        date: chapter.date,
        place: SUNSETS_PRELAUNCH_LOCKED && index === 0
          ? `${chapter.venue} / Lineup TBA`
          : `${chapter.venue} / ${chapter.lineup}`,
        status:
          SUNSETS_PRELAUNCH_LOCKED
            ? index === 0
              ? "July 4 · first access"
              : index === 1
                ? "August · first access"
                : "September · first access"
            : index === 0
              ? "July 4 tickets"
              : index === 1
                ? "August tickets"
                : "September tickets",
        action: SUNSETS_PRELAUNCH_LOCKED
          ? "JOIN LAKE LIST"
          : index === 0
            ? SUNSETS_TICKET_CTA_LABEL
            : "BUY TICKETS",
        eventSlug: chapter.eventSlug,
        eventDate: chapter.eventDate,
        href: SUNSETS_PRELAUNCH_LOCKED ? undefined : chapter.ticketPath,
      })),
    []
  );

  const ticketHref = appendEventAttribution(TICKET_HREF, JULY_4_EVENT_SLUG);

  return (
    <div className="min-h-screen bg-[#050814] text-stone-100 selection:bg-[#61e8ff] selection:text-black">
      <SEO
        title="SUN(SETS) I - July 4 at Castaways"
        description={
          SUNSETS_PRELAUNCH_LOCKED
            ? "Chasing Sun(Sets) returns home to the lake July 4 at Castaways Chicago. Join the Lake List for first access — codes, drops, and location before the public."
            : "Chasing Sun(Sets) returns home to the lake July 4 at Castaways Chicago. Join the Lake List, claim season access, and secure official SUN(SETS) tickets."
        }
        image={OG_IMAGE}
        canonicalUrl={CANONICAL_SUNSETS_URL}
        canonicalPath={PAGE_PATH}
      />

      <div className="fixed inset-0 pointer-events-none">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,20,0.72)_0%,rgba(5,8,20,0.93)_48%,#050814_100%)]" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-4 py-5 sm:py-8">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="overflow-hidden border border-[#b9f5ff]/25 bg-[#0a1024]/86 shadow-2xl shadow-black/60 backdrop-blur"
        >
          <div className="relative h-[318px] overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,107,138,.28),rgba(97,232,255,.06)_38%,rgba(5,8,20,.50)),linear-gradient(0deg,#0a1024_0%,rgba(10,16,36,.30)_46%,rgba(10,16,36,0)_72%)]" />
            <div className="absolute left-4 top-4 border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
              The Monolith Project
            </div>
            <div className="absolute right-4 top-4 border border-[#ff6b8a]/30 bg-[#111b2a]/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff6b8a] backdrop-blur">
              Lake List
            </div>
            <div className="absolute left-4 top-14 hidden border-l border-[#61e8ff]/70 bg-black/30 px-3 py-2 backdrop-blur min-[450px]:block">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#61e8ff]">
                SUN(SETS) I
              </p>
              <p className="mt-1 text-xs font-semibold text-stone-200">
                July 4 / Castaways
              </p>
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="absolute bottom-5 left-5 right-5"
            >
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#61e8ff]">
                <Waves className="size-3.5" />
                Chicago 2026
              </div>
              <h1 className="text-[clamp(3.1rem,16vw,4.3rem)] font-black leading-[0.86] tracking-normal text-white">
                SUN<span className="text-[#61e8ff]">(</span>SETS
                <span className="text-[#61e8ff]">)</span>
              </h1>
              <p className="mt-3 max-w-[330px] text-sm font-medium leading-relaxed text-stone-200/90">
                Open-air house on the Chicago lakefront, July 4. The{" "}
                <span className="font-bold text-[#61e8ff]">Lake List</span> gets
                first access — the code, ticket drops, and location before the
                public.
              </p>
              <div className="mt-4 grid grid-cols-3 border border-white/12 bg-black/34 backdrop-blur">
                {HERO_SIGNAL_STATS.map(stat => (
                  <div
                    key={stat.label}
                    className="border-r border-white/10 px-2.5 py-2.5 last:border-r-0"
                  >
                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#61e8ff]">
                      {stat.label}
                    </p>
                    <p className="mt-1 truncate text-[13px] font-black leading-none text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 truncate text-[10px] font-semibold text-stone-300">
                      {stat.note}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-5 p-5 pt-6">
            <div className="flex items-stretch gap-3">
              <ArtPlaceholder
                label="Badge"
                className="h-12 w-12 shrink-0"
              />
              <Button
                type="button"
                className="h-12 min-w-0 flex-1 bg-[#61e8ff] px-2 text-[10px] font-black uppercase tracking-[0.1em] text-black shadow-[0_14px_36px_rgba(97,232,255,0.22)] hover:bg-[#a7f4ff] min-[420px]:px-4 min-[420px]:text-xs min-[420px]:tracking-[0.12em]"
                onClick={() => {
                  triggerHaptic(12);
                  focusLakeList();
                  trackSunsetsClick({
                    buttonName: "Register for First Access",
                    href: "#lake-list",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "first_access_hero_cta",
                    channel: "CRM",
                  });
                }}
              >
                <LockKeyhole className="size-4 shrink-0" />
                <span className="min-w-0 truncate">Register for First Access</span>
                <ArrowUpRight className="size-4 shrink-0" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="border border-white/10 bg-white/[.06] px-3 py-1 text-xs font-semibold text-stone-200">
                July 4th, 2026
              </span>
              <span className="border border-white/10 bg-white/[.06] px-3 py-1 text-xs font-semibold text-stone-200">
                Castaways / Chicago Lakefront
              </span>
              <span className="border border-[#ff6b8a]/25 bg-[#ff6b8a]/10 px-3 py-1 text-xs font-semibold text-[#ff6b8a]">
                Lake List
              </span>
            </div>

            <section
              id="lake-list"
              className="border border-white/10 bg-black/22 p-4"
            >
              <ArtPlaceholder
                label="First Access drop art"
                className="mb-3 h-28 w-full"
              />
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black tracking-normal">
                    Join the Lake List
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-stone-300">
                    Artist drops, private codes, ticket releases, and location
                    signals before the public.
                  </p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#ff6b8a] text-black">
                  <LockKeyhole className="size-4.5" />
                </div>
              </div>
              <LakeListForm />
            </section>

            <section className="border border-[#61e8ff]/25 bg-[#080d1f]/88 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
                    July 4 Lineup
                  </p>
                  <h2 className="mt-1 text-xl font-black leading-none tracking-normal text-white">
                    Castaways / Chicago Lakefront
                  </h2>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#61e8ff]/35 bg-[#61e8ff]/12 text-[#61e8ff]">
                  <Waves className="size-4.5" />
                </div>
              </div>
              {SUNSETS_PRELAUNCH_LOCKED ? (
                <div className="border border-[#61e8ff]/15 bg-black/20 px-4 py-6 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#61e8ff]/60">
                    Lineup TBA
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">
                    Artist announcements drop to the Lake List first. Sign up
                    above to get the lineup before the public.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {SUNSETS_JULY4_LINEUP.map((artist, index) => (
                    <div
                      key={artist}
                      className="border border-white/10 bg-black/24 px-3 py-2.5"
                    >
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-500">
                        0{index + 1}
                      </p>
                      <p className="mt-1 text-sm font-black uppercase tracking-normal text-white">
                        {artist}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="grid gap-3 pt-1">
              <section className="space-y-4 border border-[#61e8ff]/35 bg-[linear-gradient(145deg,rgba(97,232,255,0.14),rgba(255,255,255,0.045)_48%,rgba(255,107,138,0.10))] p-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
                    Season Pass
                  </p>
                  <h2 className="mt-2 text-2xl font-black leading-none tracking-normal text-white">
                    {SUNSETS_2026_SEASON_PASS.name}
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[#c7f7ff]">
                    {SUNSETS_2026_SEASON_PASS.summary}
                  </p>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-y border-white/10 py-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-300">
                      {SUNSETS_PRELAUNCH_LOCKED
                        ? "Founding tier"
                        : SUNSETS_2026_SEASON_PASS.tierName}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-400">
                      {SUNSETS_2026_SEASON_PASS.description}
                    </p>
                  </div>
                  <div className="text-right">
                    {SUNSETS_PRELAUNCH_LOCKED ? (
                      <p className="text-base font-black uppercase leading-tight tracking-[0.08em] text-[#61e8ff]">
                        Unlocks
                        <br />
                        at launch
                      </p>
                    ) : (
                      <p className="text-4xl font-black leading-none text-white">
                        {SUNSETS_2026_SEASON_PASS.priceLabel}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#61e8ff]">
                      {SUNSETS_PRELAUNCH_LOCKED
                        ? "Limited"
                        : SUNSETS_2026_SEASON_PASS.quantityLabel}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {SUNSETS_2026_SEASON_CHAPTERS.map(chapter => (
                    <div
                      key={chapter.id}
                      className="grid gap-1 border border-white/10 bg-black/20 px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-black text-white">
                          {chapter.title}
                        </span>
                        <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.16em] text-[#61e8ff]">
                          {chapter.date}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-stone-300">
                        {chapter.venue}
                      </p>
                      <p className="text-xs text-stone-400">{chapter.lineup}</p>
                    </div>
                  ))}
                </div>

                <Button
                  asChild
                  className="h-12 w-full bg-[#61e8ff] text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-[#a7f4ff]"
                >
                  <a
                    href={SUNSETS_PRELAUNCH_LOCKED ? "#lake-list" : ticketHref}
                    onClick={() => {
                      triggerHaptic(16);
                      if (SUNSETS_PRELAUNCH_LOCKED) {
                        focusLakeList();
                        trackSunsetsClick({
                          buttonName: "Join the Lake List",
                          href: "#lake-list",
                          eventSlug: JULY_4_EVENT_SLUG,
                          eventDate: JULY_4_EVENT_DATE,
                          interestType: "prelaunch_season_pass_to_lakelist",
                          channel: "CRM",
                        });
                        return;
                      }
                      captureSunsetsTicketCtaClick({
                        destinationUrl: ticketHref,
                        pagePath: PAGE_PATH,
                        ctaPosition: "season_pass",
                      });
                      trackSunsetsClick({
                        buttonName: SUNSETS_2026_SEASON_PASS_CTA_LABEL,
                        href: ticketHref,
                        eventSlug: JULY_4_EVENT_SLUG,
                        eventDate: JULY_4_EVENT_DATE,
                        interestType: "season_pass_claim",
                        channel: "Posh",
                      });
                    }}
                  >
                    <Ticket className="size-4" />
                    {SUNSETS_PRELAUNCH_LOCKED
                      ? "Join for Season Pass Access"
                      : SUNSETS_2026_SEASON_PASS_CTA_LABEL}
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </section>

              <Button
                type="button"
                className="h-[3.25rem] w-full bg-[#ff6b8a] text-xs font-black uppercase tracking-[0.12em] text-black shadow-[0_10px_32px_rgba(255,107,138,0.18)] hover:bg-[#ffd0dc]"
                onClick={() => {
                  triggerHaptic(8);
                  focusLakeList();
                  trackSunsetsClick({
                    buttonName: "Join the Lake List",
                    href: "#lake-list",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "lake_list_focus",
                    channel: "CRM",
                  });
                }}
              >
                <LockKeyhole className="size-4" />
                Join the Lake List
              </Button>
              <Button
                asChild
                className="h-[3.25rem] w-full bg-[#61e8ff] text-xs font-black uppercase tracking-[0.12em] text-black shadow-[0_14px_36px_rgba(97,232,255,0.22)] hover:bg-[#a7f4ff]"
              >
                <a
                  href={SUNSETS_PRELAUNCH_LOCKED ? "#lake-list" : ticketHref}
                  onClick={() => {
                    triggerHaptic(16);
                    if (SUNSETS_PRELAUNCH_LOCKED) {
                      focusLakeList();
                      trackSunsetsClick({
                        buttonName: "Join the Lake List",
                        href: "#lake-list",
                        eventSlug: JULY_4_EVENT_SLUG,
                        eventDate: JULY_4_EVENT_DATE,
                        interestType: "prelaunch_ticket_to_lakelist",
                        channel: "CRM",
                      });
                      return;
                    }
                    captureSunsetsTicketCtaClick({
                      destinationUrl: ticketHref,
                      pagePath: PAGE_PATH,
                      ctaPosition: "primary",
                    });
                    trackSunsetsClick({
                      buttonName: SUNSETS_TICKET_CTA_LABEL,
                      href: ticketHref,
                      eventSlug: JULY_4_EVENT_SLUG,
                      eventDate: JULY_4_EVENT_DATE,
                      interestType: "ticket_click",
                      channel: "Posh",
                    });
                  }}
                >
                  <Ticket className="size-4" />
                  {SUNSETS_PRELAUNCH_LOCKED
                    ? "Join Lake List for Tickets"
                    : SUNSETS_TICKET_CTA_LABEL}
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <p className="-mt-1 border border-white/10 bg-black/20 px-3 py-2 text-center text-[11px] font-semibold leading-relaxed text-stone-300">
                {SUNSETS_PRELAUNCH_LOCKED
                  ? "Lake List members get the first ticket window before public release."
                  : SUNSETS_TICKET_CTA_SUPPORT}
              </p>
              <section className="space-y-4 border border-[#61e8ff]/28 bg-[#0a1024]/94 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
                      <ShieldCheck className="size-3.5" />
                      Official Ticket Rail
                    </p>
                    <h2 className="mt-2 text-2xl font-black leading-none tracking-normal text-white">
                      The lake has a limit.
                    </h2>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-stone-300">
                      {SUNSETS_PRELAUNCH_LOCKED
                        ? "Lake List members get the first release window before public ticketing opens."
                        : "Ticket tiers move as allocations sell out. Secure entry early through the official Posh rail."}
                    </p>
                  </div>
                  <div className="shrink-0 border border-[#61e8ff]/35 bg-[#61e8ff]/12 px-3 py-2 text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#61e8ff]">
                      {SUNSETS_PRELAUNCH_LOCKED ? "Tickets" : "From"}
                    </p>
                    <p
                      className={`font-black leading-none text-white ${
                        SUNSETS_PRELAUNCH_LOCKED
                          ? "text-base uppercase tracking-[0.08em]"
                          : "text-2xl"
                      }`}
                    >
                      {SUNSETS_PRELAUNCH_LOCKED ? "Soon" : "$20"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 border border-white/10 bg-black/24">
                  {TICKET_RAIL_STATS.map((stat, index) => {
                    const StatIcon =
                      index === 0 ? Users : index === 1 ? LockKeyhole : Ticket;
                    return (
                      <div
                        key={stat.label}
                        className="border-r border-white/10 px-2 py-3 last:border-r-0"
                      >
                        <StatIcon className="mb-2 size-3.5 text-[#61e8ff]" />
                        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-stone-500">
                          {stat.label}
                        </p>
                        <p className="mt-1 truncate text-sm font-black leading-none text-white">
                          {stat.value}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[9px] font-semibold leading-tight text-stone-400">
                          {stat.note}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  {FEATURED_TICKET_TIERS.map(tier => (
                    <div
                      key={tier.id}
                      className={`border px-3 py-3 ${
                        tier.highlight
                          ? "border-[#61e8ff]/45 bg-[#61e8ff]/12"
                          : "border-white/10 bg-black/22"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-500">
                            {tier.visibility}
                          </p>
                          <h3 className="mt-1 text-sm font-black leading-tight text-white">
                            {tier.name}
                          </h3>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className={`font-black leading-none text-[#61e8ff] ${
                              SUNSETS_PRELAUNCH_LOCKED
                                ? "text-[11px] uppercase tracking-[0.1em]"
                                : "text-xl"
                            }`}
                          >
                            {SUNSETS_PRELAUNCH_LOCKED ? "At launch" : tier.priceLabel}
                          </p>
                          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-stone-500">
                            {SUNSETS_PRELAUNCH_LOCKED
                              ? "Allocation locked"
                              : tier.quantityLabel}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold leading-relaxed text-stone-300">
                        <Clock className="mt-0.5 size-3 shrink-0 text-[#61e8ff]" />
                        {tier.timing}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full border-white/10 bg-white/[.04] text-xs font-black uppercase tracking-[0.12em] text-stone-100 hover:bg-white/[.08]"
                onClick={() => {
                  triggerHaptic(8);
                  scrollToSection("last-chapter");
                  trackSunsetsClick({
                    buttonName: "Watch 2025 Recap",
                    href: "#last-chapter",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "recap_embed_focus",
                    channel: "YouTube",
                  });
                }}
              >
                <Play className="size-4" />
                Watch 2025 Recap
              </Button>
            </section>

            <section
              id="last-chapter"
              className="space-y-3 border border-[#61e8ff]/20 bg-[#61e8ff]/10 p-4"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
                  Recap
                </p>
                <h2 className="mt-1 text-2xl font-black leading-none tracking-normal text-white">
                  WATCH THE LAST CHAPTER
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  Autograf returns to the lake for Sun(Sets) 2026. Revisit the
                  energy from the last chapter.
                </p>
              </div>
              <div className="aspect-video overflow-hidden border border-white/10 bg-black">
                <iframe
                  className="h-full w-full"
                  src={AUTOGRAF_YOUTUBE_EMBED}
                  title="Autograf Sun(Sets) July 4 recap"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </section>

            <section className="space-y-3 pt-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
                  Event / artist teaser
                </p>
                <h3 className="mt-1 text-xl font-black tracking-normal text-white">
                  Upcoming Chapters
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-300">
                  SUN(SETS) returns to Castaways with July 4 first access,
                  private summer drops, and radio-led artist signals.
                </p>
              </div>

              {chapters.map((chapter, index) => {
                const Icon = index === 0 ? Ticket : Calendar;
                const chapterHref = chapter.href
                  ? appendEventAttribution(chapter.href, chapter.eventSlug)
                  : undefined;

                return (
                  <motion.div
                    key={chapter.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * index + 0.15,
                      duration: 0.45,
                    }}
                  >
                    {chapterHref ? (
                      <a
                        href={chapterHref}
                        onClick={() => {
                          triggerHaptic(12);
                          if (chapter.href === TICKET_HREF) {
                            captureSunsetsTicketCtaClick({
                              destinationUrl: chapterHref,
                              pagePath: PAGE_PATH,
                              ctaPosition: "chapter",
                            });
                          }
                          trackSunsetsClick({
                            buttonName: chapter.action,
                            href: chapterHref,
                            eventSlug: chapter.eventSlug,
                            eventDate: chapter.eventDate,
                            interestType: "chapter_ticket_click",
                            channel: "Posh",
                          });
                        }}
                        className="group block border border-[#61e8ff]/20 bg-[#0b1326]/90 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.24)] transition hover:border-[#61e8ff]/45 hover:bg-[#111b35]"
                      >
                        <ChapterContent
                          chapter={chapter}
                          icon={Icon}
                          isLinked
                        />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic(8);
                          focusLakeList();
                          trackSunsetsClick({
                            buttonName: chapter.action,
                            href: "#lake-list",
                            interestType: "lake_list_focus",
                            channel: "CRM",
                          });
                        }}
                        className="group block w-full border border-[#61e8ff]/20 bg-[#0b1326]/90 p-4 text-left shadow-[0_12px_34px_rgba(0,0,0,0.24)] transition hover:border-[#61e8ff]/45 hover:bg-[#111b35]"
                      >
                        <ChapterContent
                          chapter={chapter}
                          icon={Icon}
                          isLinked
                        />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </section>

            <section className="relative overflow-hidden border border-[#61e8ff]/30 bg-[#0a1024]/92 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#61e8ff]/70"
                aria-hidden="true"
              />
              <div className="grid gap-4 min-[390px]:grid-cols-[auto_minmax(0,1fr)] min-[390px]:items-center">
                <div className="mx-auto w-32 shrink-0 min-[390px]:mx-0">
                  <div className="border border-[#61e8ff]/45 bg-[#f8f4e8] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                    <img
                      src={SUNSETS_QR_IMAGE}
                      alt="QR code for the SUN(SETS) rail"
                      className="h-28 w-28"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-2 text-center text-[9px] font-black uppercase tracking-[0.24em] text-[#61e8ff]">
                    Scan rail
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#61e8ff]">
                    <QrCode className="size-3.5" />
                    Official public link
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-white">
                    sunsets.vip
                  </p>
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-stone-300">
                    Scan to save the SUN(SETS) rail, tickets, Lake List, and
                    season updates.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      asChild
                      className="h-11 flex-1 bg-[#61e8ff] px-3 text-[11px] font-black uppercase tracking-[0.12em] text-black hover:bg-[#a7f4ff] min-[390px]:flex-none"
                    >
                      <a
                        href={CANONICAL_SUNSETS_URL}
                        onClick={() =>
                          trackSunsetsClick({
                            buttonName: "Open SUN(SETS) QR Link",
                            href: CANONICAL_SUNSETS_URL,
                            eventSlug: JULY_4_EVENT_SLUG,
                            eventDate: JULY_4_EVENT_DATE,
                            interestType: "qr_link_click",
                            channel: "Monolith",
                          })
                        }
                      >
                        Open link
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="h-11 flex-1 border border-white/15 bg-white/[.07] px-3 text-[11px] font-black uppercase tracking-[0.12em] text-stone-100 hover:bg-white/[.12] min-[390px]:flex-none"
                    >
                      <a
                        href="/partners"
                        onClick={() =>
                          trackSunsetsClick({
                            buttonName: "Partner Inquiry",
                            href: "/partners",
                            eventSlug: JULY_4_EVENT_SLUG,
                            eventDate: JULY_4_EVENT_DATE,
                            interestType: "partner_inquiry_click",
                            channel: "Monolith",
                          })
                        }
                      >
                        Partners
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="featured-drop"
              className="space-y-4 border border-white/10 bg-black/24 p-4"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#61e8ff]">
                  SUN(SETS) RADIO — FEATURED DROP
                </p>
                <h2 className="mt-1 text-xl font-black tracking-normal text-white">
                  Sommers UK
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  Sommers UK featured SoundCloud selection.
                </p>
              </div>
              <div className="overflow-hidden border border-white/10 bg-black">
                <iframe
                  title="Sommers UK featured SoundCloud selection"
                  className="h-[300px] w-full"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={SOMMERS_SOUNDCLOUD_EMBED}
                />
              </div>
              <img
                src={SUNSETS_COVER_IMAGE}
                alt="Sun(Sets) featured drop cover artwork"
                className="w-full border border-white/10 object-cover"
                loading="lazy"
              />
              <FeaturedDropSignup />
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full border-white/10 bg-white/[.04] text-xs font-black uppercase tracking-[0.12em] text-stone-100 hover:bg-white/[.08]"
                onClick={() => {
                  triggerHaptic(8);
                  setIsDjModalOpen(true);
                  trackSunsetsClick({
                    buttonName: "DJs - submit your track",
                    href: "#dj-submit",
                    eventSlug: JULY_4_EVENT_SLUG,
                    eventDate: JULY_4_EVENT_DATE,
                    interestType: "sunsets_radio_submission_open",
                    channel: "Contact",
                  });
                }}
              >
                <Music className="size-4" />
                DJs — submit your track
              </Button>
            </section>

            <footer className="pb-1 pt-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Togetherness is the frequency.
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Music is the guide.
              </p>
            </footer>
          </div>
        </motion.section>
        <DJSubmissionModal
          isOpen={isDjModalOpen}
          onClose={() => setIsDjModalOpen(false)}
        />
      </main>
    </div>
  );
}

function ChapterContent({
  chapter,
  icon: Icon,
  isLinked,
}: {
  chapter: Chapter;
  icon: LucideIcon;
  isLinked?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#ff6b8a]/20 bg-[#ff6b8a]/10 text-[#ffd0dc]">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-base font-black tracking-normal text-white">
              {chapter.title}
            </h4>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-stone-300">
              <Calendar className="size-3.5 shrink-0" />
              {chapter.date}
            </p>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-stone-300">
              <MapPin className="size-3.5 shrink-0" />
              {chapter.place}
            </p>
          </div>
          {isLinked ? (
            <ChevronRight className="mt-1 size-4.5 shrink-0 text-stone-500 transition group-hover:translate-x-1 group-hover:text-[#61e8ff]" />
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-bold text-stone-200">
            {chapter.status}
          </span>
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#61e8ff]">
            {chapter.action}
          </span>
        </div>
      </div>
    </div>
  );
}
