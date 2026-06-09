import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Instagram,
  LockKeyhole,
  MapPin,
  Play,
  Radio,
  Ticket,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { appendAttributionQueryParams } from "@/lib/attribution";
import {
  trackFunnelPageView,
  trackLeadConversion,
  trackLinkClick,
} from "@/lib/api";
import { trackLakeLead, trackLakePageView } from "@/lib/campaignPixel";
import {
  SUNSETS_2026_SEASON_CHAPTERS,
  SUNSETS_2026_SEASON_PASS,
  SUNSETS_2026_SEASON_PASS_CTA_LABEL,
  SUNSETS_JULY4_EVENT_DATE as JULY_4_EVENT_DATE,
  SUNSETS_JULY4_EVENT_SLUG as JULY_4_EVENT_SLUG,
  SUNSETS_JULY4_TICKET_PATH as TICKET_HREF,
  SUNSETS_TICKET_CTA_LABEL,
  SUNSETS_TICKET_CTA_SUPPORT,
  captureSunsetsTicketCtaClick,
  SUNSETS_PRELAUNCH_LOCKED,
} from "@/lib/sunsetsTicketing";

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

type ActionLink = {
  label: string;
  buttonName: string;
  href: string;
  icon: LucideIcon;
  interestType: string;
  channel: string;
};

type TrackableLink = {
  buttonName: string;
  href: string;
  eventSlug?: string;
  eventDate?: string;
  interestType?: string;
  channel?: string;
};

const PAGE_PATH = "/lake";
const PAGE_SOURCE = "sunsets_lake";
const RECAP_HREF = "/go/media/sunsets-recap";
const RADIO_HREF = "/go/media/sunsets-soundcloud";
const INSTAGRAM_HREF = "/go/social/instagram-sunsets";
const LAYLO_HREF = "/go/waitlist/chasing-sunsets";
const HERO_IMAGE = "/images/chasing-sunsets-premium.webp";
const OG_IMAGE = "/images/chasing-sunsets-july4-first-access.png";

function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
}

function newEventId() {
  return crypto.randomUUID();
}

function appendEventAttribution(href: string, eventSlug?: string) {
  const attributedHref = appendAttributionQueryParams(href);
  if (!eventSlug) return attributedHref;

  try {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://monolithproject.com";
    const isAbsolute = /^https?:\/\//i.test(attributedHref);
    const url = new URL(attributedHref, origin);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return attributedHref;
    }

    if (!url.searchParams.has("event_slug")) {
      url.searchParams.set("event_slug", eventSlug);
    }

    if (url.origin === origin && !isAbsolute) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return url.toString();
  } catch {
    return attributedHref;
  }
}

function trackLakeClick(item: TrackableLink) {
  if (typeof window === "undefined") return;

  const win = window as Window & {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  };

  win.gtag?.("event", "sunsets_lake_click", {
    link_label: item.buttonName,
    link_url: item.href,
    page_path: PAGE_PATH,
    event_slug: item.eventSlug,
    interest_type: item.interestType,
  });

  trackLinkClick({
    buttonName: item.buttonName,
    destinationUrl: item.href,
    pagePath: PAGE_PATH,
    eventSlug: item.eventSlug,
    eventDate: item.eventDate,
    interestType: item.interestType,
    channel: item.channel,
    source: PAGE_SOURCE,
  });
}

function focusLakeList() {
  if (typeof document === "undefined") return;
  const target = document.getElementById("lake-list");
  target?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export default function LakeLanding() {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Internal funnel analytics + campaign Pixel PageView (Dataset 1049241148606250).
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
        place: chapter.venue,
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

  const actionLinks = useMemo<ActionLink[]>(
    () => [
      {
        label: "Recap",
        buttonName: "Watch Recap",
        href: RECAP_HREF,
        icon: Play,
        interestType: "recap_click",
        channel: "YouTube",
      },
      {
        label: "Radio",
        buttonName: "Sun(Sets) Radio",
        href: RADIO_HREF,
        icon: Radio,
        interestType: "radio_click",
        channel: "SoundCloud",
      },
      {
        label: "Follow",
        buttonName: "Follow Sun(Sets)",
        href: INSTAGRAM_HREF,
        icon: Instagram,
        interestType: "instagram_click",
        channel: "Instagram",
      },
      {
        label: "VIP",
        buttonName: "VIP Inquiry",
        href: "/vip",
        icon: Users,
        interestType: "vip_inquiry_click",
        channel: "Monolith",
      },
    ],
    []
  );

  const ticketHref = appendEventAttribution(TICKET_HREF, JULY_4_EVENT_SLUG);
  const firstAccessHref = appendAttributionQueryParams(LAYLO_HREF);

  // Primary paid-campaign conversion: one event_id shared by the browser Pixel
  // Lead and the server CAPI Lead, then outbound to Laylo. Ticket buttons never
  // call this — Lead fires only here.
  const handleFirstAccess = () => {
    triggerHaptic(16);
    const eventId = newEventId();

    trackLakeLead(eventId);
    trackLeadConversion(eventId, {
      eventSourceUrl:
        typeof window !== "undefined" ? window.location.href : undefined,
    });
    trackLakeClick({
      buttonName: "Join the Lake List",
      href: firstAccessHref,
      eventSlug: JULY_4_EVENT_SLUG,
      eventDate: JULY_4_EVENT_DATE,
      interestType: "outbound_laylo_click",
      channel: "Laylo",
    });
  };

  return (
    <div className="min-h-screen bg-[#050814] text-stone-100 selection:bg-[#61e8ff] selection:text-black">
      <SEO
        title="Sun(Sets) Lake List & First Access"
        description="Join the Lake List for Sun(Sets) July 4 ticket access, artist drops, recap video, radio, VIP, and partner inquiries."
        image={OG_IMAGE}
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
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="overflow-hidden border border-[#b9f5ff]/25 bg-[#0a1024]/86 shadow-2xl shadow-black/60 backdrop-blur"
        >
          <div className="relative h-[255px] overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,107,138,.22),rgba(97,232,255,.06)_40%,rgba(5,8,20,.48)),linear-gradient(0deg,#0a1024_0%,rgba(10,16,36,0)_54%)]" />
            <div className="absolute left-4 top-4 border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
              The Monolith Project
            </div>
            <div className="absolute right-4 top-4 border border-[#ff6b8a]/30 bg-[#111b2a]/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#ff6b8a] backdrop-blur">
              Lake List
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
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
                A full-day open-air chapter of house music, lakefront energy,
                and golden-hour connection.
              </p>
            </motion.div>
          </div>

          <div className="space-y-4 p-5 pt-6">
            <div className="flex flex-wrap gap-2">
              <span className="border border-white/10 bg-white/[.06] px-3 py-1 text-xs font-semibold text-stone-200">
                July 4
              </span>
              <span className="border border-white/10 bg-white/[.06] px-3 py-1 text-xs font-semibold text-stone-200">
                Castaways
              </span>
              <span className="border border-[#ff6b8a]/25 bg-[#ff6b8a]/10 px-3 py-1 text-xs font-semibold text-[#ff6b8a]">
                First Access
              </span>
            </div>

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
                      trackLakeClick({
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
                    trackLakeClick({
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

            <a
              href={SUNSETS_PRELAUNCH_LOCKED ? "#lake-list" : ticketHref}
              onClick={() => {
                triggerHaptic(16);
                if (SUNSETS_PRELAUNCH_LOCKED) {
                  focusLakeList();
                  trackLakeClick({
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
                trackLakeClick({
                  buttonName: SUNSETS_TICKET_CTA_LABEL,
                  href: ticketHref,
                  eventSlug: JULY_4_EVENT_SLUG,
                  eventDate: JULY_4_EVENT_DATE,
                  interestType: "ticket_click",
                  channel: "Posh",
                });
              }}
              className="flex min-h-14 items-center justify-center gap-2 bg-[#61e8ff] px-4 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#a7f4ff]"
            >
              <Ticket className="size-4" />
              {SUNSETS_PRELAUNCH_LOCKED
                ? "Join Lake List for Tickets"
                : SUNSETS_TICKET_CTA_LABEL}
              <ArrowUpRight className="size-4" />
            </a>
            <p className="-mt-2 text-center text-[11px] font-semibold text-stone-400">
              {SUNSETS_PRELAUNCH_LOCKED
                ? "Lake List members get the first ticket window before public release."
                : SUNSETS_TICKET_CTA_SUPPORT}
            </p>

            <section
              id="lake-list"
              className="border border-white/10 bg-black/22 p-4"
            >
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
              <a
                href={firstAccessHref}
                data-campaign-lead="lake"
                onClick={handleFirstAccess}
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#ff6b8a] text-sm font-black text-black transition hover:bg-[#ffd0dc]"
              >
                <LockKeyhole className="size-4" />
                Join the Lake List
                <ArrowUpRight className="size-4" />
              </a>
              <p className="mt-2 px-1 text-[10px] leading-snug text-stone-400">
                By joining, you agree to receive event updates from The Monolith
                Project / Chasing Sun(Sets). Message rates may apply.
              </p>
            </section>

            <section className="space-y-3 pt-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-300">
                  Upcoming Chapters
                </h3>
                <span className="text-right text-[11px] font-semibold text-[#61e8ff]">
                  {SUNSETS_PRELAUNCH_LOCKED
                    ? "Lake List opens first"
                    : "Prices move by release"}
                </span>
              </div>

              {chapters.map((chapter, index) => {
                const Icon = index === 0 ? Ticket : Calendar;
                const chapterHref = chapter.href
                  ? appendEventAttribution(chapter.href, chapter.eventSlug)
                  : undefined;

                return (
                  <motion.div
                    key={chapter.title}
                    initial={{ opacity: 0, y: 14 }}
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
                          trackLakeClick({
                            buttonName: chapter.action,
                            href: chapterHref,
                            eventSlug: chapter.eventSlug,
                            eventDate: chapter.eventDate,
                            interestType: "chapter_ticket_click",
                            channel: "Posh",
                          });
                        }}
                        className="group block border border-white/10 bg-white/[.055] p-4 transition hover:border-[#61e8ff]/35 hover:bg-white/[.075]"
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
                          trackLakeClick({
                            buttonName: chapter.action,
                            href: "#lake-list",
                            interestType: "lake_list_focus",
                            channel: "CRM",
                          });
                        }}
                        className="group block w-full border border-white/10 bg-white/[.055] p-4 text-left transition hover:border-[#61e8ff]/35 hover:bg-white/[.075]"
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

            <section className="grid grid-cols-2 gap-3 pt-2">
              {actionLinks.map(item => {
                const Icon = item.icon;
                const href = appendEventAttribution(
                  item.href,
                  JULY_4_EVENT_SLUG
                );

                return (
                  <Button
                    key={item.label}
                    asChild
                    variant="outline"
                    className="h-12 border-white/10 bg-white/[.04] text-stone-100 hover:bg-white/[.08]"
                  >
                    <a
                      href={href}
                      onClick={() => {
                        triggerHaptic(8);
                        trackLakeClick({
                          buttonName: item.buttonName,
                          href,
                          eventSlug: JULY_4_EVENT_SLUG,
                          eventDate: JULY_4_EVENT_DATE,
                          interestType: item.interestType,
                          channel: item.channel,
                        });
                      }}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </a>
                  </Button>
                );
              })}
            </section>

            <section className="border border-[#61e8ff]/20 bg-[#61e8ff]/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#61e8ff]">
                    Official short link
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-white">
                    sunsets.vip
                  </p>
                </div>
                <Button
                  asChild
                  className="h-10 shrink-0 bg-white px-3 text-black hover:bg-stone-200"
                >
                  <a
                    href="/partners"
                    onClick={() =>
                      trackLakeClick({
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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white/[.10] text-[#ffd0dc]">
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
            <p className="mt-1 flex items-center gap-1 text-xs text-stone-400">
              <MapPin className="size-3.5 shrink-0" />
              {chapter.place}
            </p>
          </div>
          {isLinked ? (
            <ChevronRight className="mt-1 size-4.5 shrink-0 text-stone-500 transition group-hover:translate-x-1 group-hover:text-[#61e8ff]" />
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="bg-black/25 px-2.5 py-1 text-[11px] font-bold text-stone-300">
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
