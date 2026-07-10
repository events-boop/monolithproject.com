import { lazy, Suspense, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getEventVenueLabel,
  getEventWindowStatus,
  getSeriesExperienceEvent,
} from "@/lib/siteExperience";

const FeaturedRecap = lazy(() => import("@/components/FeaturedRecap"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const SeasonChapterCards = lazy(
  () => import("@/components/SeasonChapterCards")
);
const FeaturedSets = lazy(() => import("@/components/FeaturedSets"));
const PartnershipMarquee = lazy(
  () => import("@/components/PartnershipMarquee")
);
import SEO from "@/components/SEO";
import { buildSitewideIdentitySchema } from "@/lib/schema";
import { LIVE_RED, MONOLITH_ORANGE, SUN_SETS_GOLD } from "@/lib/brand";
import { appendAttributionQueryParams } from "@/lib/attribution";
import { SUNSETS_LAKELIST_PATH } from "@/lib/sunsetsTicketing";

// Chapter One archive — photos + recap land here as they clear the edit.
const SUNSETS_I_ARCHIVE_HREF = "/chasing-sunsets/sunsets-i-2026";

function getStatusLabel(status?: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  if (status === "past") return "ARCHIVE";
  return "SIGNAL PENDING";
}

const titleSubtextClass =
  "mt-4 max-w-3xl text-sm leading-relaxed text-[#F4D7A1]/88 md:text-base";
const warmSubtextClass = "mt-4 text-sm leading-relaxed text-[#E8B86D]/84";
const coolSubtextClass =
  "mt-4 max-w-3xl text-sm leading-relaxed text-[#B9F6FF]/82 md:text-base";

export default function Home() {
  usePublicSiteDataVersion();
  const chasingSeasonEvent = getSeriesExperienceEvent(
    "chasing-sunsets",
    "hero"
  );
  const untoldMoment = getSeriesExperienceEvent("untold-story", "hero");
  const untoldMomentHref = "/story";
  const untoldTicketHref =
    untoldMoment?.ticketUrl ||
    untoldMoment?.primaryCta?.href ||
    untoldMomentHref;
  const untoldCtaLabel = untoldMoment?.primaryCta?.label || "Open Untold Story";
  const untoldTicketIsExternal =
    /^https?:\/\//i.test(untoldTicketHref) ||
    untoldTicketHref.startsWith("/go/");
  // The featured untold record can be a past-event fallback — never show a
  // past date grid next to future-tense copy.
  const untoldIsPast = getEventWindowStatus(untoldMoment) === "past";
  const lakeListHref = appendAttributionQueryParams(SUNSETS_LAKELIST_PATH);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden bg-noise bg-scanlines">
      <SEO
        title="The Monolith Project | Chicago House Music Events"
        description="The Monolith Project produces Chicago house music events, Chasing Sun(Sets), Untold Story nights, and artist-led radio."
        absoluteTitle
        canonicalPath="/"
        schemaData={buildSitewideIdentitySchema()}
      />

      {/* Ambient animated background glows for dynamic depth */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black/90">
        <div
          className="absolute -left-[10vw] top-[10vh] h-[45rem] w-[45rem] rounded-full opacity-30 mix-blend-screen animate-pulse duration-[8000ms]"
          style={{
            background:
              "radial-gradient(circle, var(--color-sunsets-gold) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -right-[15vw] bottom-[10vh] h-[50rem] w-[50rem] rounded-full opacity-20 mix-blend-screen animate-pulse duration-[12000ms]"
          style={{
            background:
              "radial-gradient(circle, var(--color-untold-cyan) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        {/* Current season signal — the event truth lands before brand exposition. */}
        <section
          aria-label="SUN(SETS) II — August 22"
          className="relative z-10 border-y border-[#E8B86D]/30 bg-black/40 backdrop-blur-2xl py-10 md:py-14 shadow-[0_0_30px_rgba(232,184,109,0.05)]"
        >
          <div className="container layout-wide px-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center">
              <div>
                <span className="section-kicker block text-[#E8B86D]">
                  Chasing Sun(Sets) / Season 2026
                </span>
                <h2 className="section-display-title-compact mt-3 max-w-[26ch] text-white hyphens-none break-keep text-balance">
                  Chapter I is archived. Chapter II is next.
                </h2>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/82 md:text-[11px]">
                  SUN(SETS) II · AUGUST 22 · CASTAWAYS · CHICAGO · 21+
                </p>
                <p className="mt-2 text-sm text-[#F4D7A1]/80">
                  The Summer Return. Artist reveal, first ticket window, and
                  table access move through the Lake List first.
                </p>
              </div>
              <div className="flex flex-col gap-3 lg:items-end">
                <a
                  href={lakeListHref}
                  className="btn-pill-sunsets btn-pill-wide w-full justify-center sm:w-auto"
                >
                  Join the Lake List
                  <ArrowUpRight className="size-4" />
                </a>
                <Link
                  href={SUNSETS_I_ARCHIVE_HREF}
                  className="btn-text-action text-left lg:text-right"
                >
                  Chapter One complete — relive July 4
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">
              <div className="bg-black/55 p-4 backdrop-blur-md">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  01 / Archive
                </span>
                <p className="mt-2 font-display text-lg leading-none text-white">
                  July 4
                </p>
                <p className="mt-1 text-xs text-white/64">
                  Chapter One complete.
                </p>
              </div>
              <div className="bg-[#2b1b10]/72 p-4 backdrop-blur-md">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E8B86D]">
                  02 / Next
                </span>
                <p className="mt-2 font-display text-lg leading-none text-white">
                  August 22
                </p>
                <p className="mt-1 text-xs text-[#F4D7A1]/78">
                  Artist reveal incoming.
                </p>
              </div>
              <div className="bg-black/55 p-4 backdrop-blur-md">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  03 / Finale
                </span>
                <p className="mt-2 font-display text-lg leading-none text-white">
                  September 19
                </p>
                <p className="mt-1 text-xs text-white/64">Joezi x Massuma.</p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="platform"
          className="relative z-10 border-y border-white/10 bg-white/[0.02] backdrop-blur-xl py-12 md:py-16"
        >
          <div className="container layout-wide px-6">
            <div className="flex flex-col gap-8">
              <div className="max-w-4xl">
                <span className="section-kicker block text-white/56">
                  The Monolith Project / The platform
                </span>
                <h2 className="mt-3 max-w-[22ch] text-balance font-display text-3xl leading-[0.98] text-white md:text-4xl">
                  The line between the lake, the room, and what comes next.
                </h2>
              </div>
              <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
                <div className="bg-black/45 p-5 backdrop-blur-md">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/48">
                    The parent
                  </span>
                  <h3 className="mt-3 font-display text-xl text-white">
                    Monolith Project
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/68">
                    The cultural platform taking form around the rooms, people,
                    and rituals that matter.
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/48">
                    Launch signal / forthcoming
                  </p>
                </div>
                <div className="bg-[#2b1b10]/38 p-5 backdrop-blur-md">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E8B86D]">
                    Daylight
                  </span>
                  <h3 className="mt-3 font-display text-xl text-white">
                    Chasing Sun(Sets)
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/68">
                    Lakefront house music, golden hour, and a season that moves
                    from Chapter I into II and III.
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F4D7A1]/78">
                    II next / III closes the season
                  </p>
                </div>
                <div className="bg-[#07191d]/48 p-5 backdrop-blur-md">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B9F6FF]">
                    After dark
                  </span>
                  <h3 className="mt-3 font-display text-xl text-white">
                    Untold Story
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/68">
                    The tighter, deeper room. Four chapters now live in the
                    archive; the next coordinates arrive when they are right.
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#B9F6FF]/76">
                    Four chapters / archive open
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 border-y border-white/10 bg-black/20 backdrop-blur-md py-20 md:py-28">
          <div className="container layout-wide px-6">
            <div className="mb-8 border-b border-white/10 pb-5 md:mb-10">
              <span className="section-kicker block text-[#E8B86D]">
                Chasing Sun(Sets / Current signal
              </span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <h2 className="section-display-title-compact max-w-[16ch] text-white hyphens-none break-keep text-balance">
                  The lakefront season keeps moving.
                </h2>
                <p className={titleSubtextClass}>
                  Chapter One now lives in the archive. Chapter Two arrives
                  August 22, with Chapter Three closing the season September 19.
                  First access hears every release before the public.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/sunsets"
                    className="btn-pill-sunsets btn-pill-wide w-full justify-center sm:w-auto"
                  >
                    Explore the Season
                  </Link>
                  <a
                    href={lakeListHref}
                    className="btn-pill-outline-sunsets btn-pill-wide w-full justify-center sm:w-auto"
                  >
                    Join the Lake List
                  </a>
                  <Link href="/chasing-sunsets" className="btn-text-action">
                    Chapter One Archive
                  </Link>
                  <Link href="/schedule" className="btn-text-action">
                    See All Dates
                  </Link>
                </div>
              </div>

              <div className="border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.03)] hover:border-white/30 transition-all duration-500">
                <span className="section-kicker block text-[#E8B86D]">
                  Next on the lake
                </span>
                <h3 className="section-display-title-compact mt-3 max-w-[14ch] text-white hyphens-none break-keep text-balance">
                  {chasingSeasonEvent?.headline || "SUN(SETS) II — Chapter Two"}
                </h3>
                <p className={warmSubtextClass}>
                  {chasingSeasonEvent?.description ||
                    "The Summer Return lands August 22 at Castaways. Artist reveal, first ticket window, and table access move through the Lake List first."}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/84">
                  <div>
                    <dt className="text-white/66">Date</dt>
                    <dd className="mt-1 text-white">
                      {chasingSeasonEvent?.date || "August 22, 2026"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/66">Location</dt>
                    <dd className="mt-1 text-white">
                      {chasingSeasonEvent
                        ? getEventVenueLabel(chasingSeasonEvent)
                        : "Castaways, Chicago"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/66">Status</dt>
                    <dd className="mt-1 text-white">
                      {getStatusLabel(
                        chasingSeasonEvent?.status || "coming-soon"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/66">Lineup</dt>
                    <dd className="mt-1 text-white">
                      {chasingSeasonEvent?.lineup || "Artist Reveal Coming"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section
          id="campaigns"
          className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-lg py-20 md:py-28"
        >
          <div className="container layout-wide px-6">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 md:mb-10">
              <span className="section-kicker text-primary">Untold Story</span>
              {untoldMoment?.status ? (
                <span className="border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/75">
                  {untoldIsPast
                    ? "FOUR CHAPTERS / ARCHIVE"
                    : getStatusLabel(untoldMoment.status)}
                </span>
              ) : null}
            </div>

            {untoldMoment ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
                <div>
                  <span className="section-kicker mb-3 block text-white/78">
                    {untoldIsPast
                      ? "Four chapters. One after-dark record."
                      : "Next chapter"}
                  </span>
                  <h2 className="section-display-title-compact max-w-[14ch] text-white hyphens-none break-keep text-balance">
                    {untoldIsPast
                      ? "Four chapters deep. The next room comes later."
                      : untoldMoment.headline || untoldMoment.title}
                  </h2>
                  {untoldIsPast ? (
                    <p className="mt-4 font-display text-xl text-[#F4D7A1] md:text-2xl">
                      Untold Story IV closed the latest chapter. New coordinates
                      arrive when the room is right.
                    </p>
                  ) : (
                    <p className="mt-4 font-display text-xl text-[#F4D7A1] md:text-2xl">
                      {untoldMoment.date} at {untoldMoment.venue}
                    </p>
                  )}
                  <p className={coolSubtextClass}>
                    The next late-night chapter is moving into first-access
                    mode. Join the list for the reveal, table path, and
                    ticket-window updates.
                  </p>
                </div>

                <div className="border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-6 md:p-8 rounded-xl shadow-[0_0_40px_rgba(34,211,238,0.03)] hover:border-[#22d3ee]/40 transition-all duration-500">
                  {untoldIsPast ? (
                    <p className="border-b border-white/10 pb-5 text-sm leading-relaxed text-white/82">
                      Four chapters now live in the record. Latest chapter:{" "}
                      {untoldMoment.headline || untoldMoment.title} —{" "}
                      {untoldMoment.date}.
                    </p>
                  ) : (
                    <>
                      <dl className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/84">
                        <div>
                          <dt className="text-white/66">Date</dt>
                          <dd className="mt-1 text-white">
                            {untoldMoment.date}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-white/66">Time</dt>
                          <dd className="mt-1 text-white">
                            {untoldMoment.time}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-white/66">Venue</dt>
                          <dd className="mt-1 text-white">
                            {untoldMoment.venue}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-white/66">City</dt>
                          <dd className="mt-1 text-white">
                            {untoldMoment.location}
                          </dd>
                        </div>
                      </dl>
                      <p className="mt-4 text-sm text-white/82">
                        {getEventVenueLabel(untoldMoment)}
                      </p>
                    </>
                  )}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href={untoldMomentHref}
                      className="btn-pill-outline btn-pill-compact w-full justify-center sm:w-auto"
                    >
                      View Untold Story <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    {!untoldIsPast && untoldTicketIsExternal ? (
                      <a
                        href={untoldTicketHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill-untold btn-pill-compact w-full justify-center sm:w-auto"
                      >
                        {untoldCtaLabel} <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : !untoldIsPast ? (
                      <Link
                        href={untoldTicketHref}
                        className="btn-pill-untold btn-pill-compact w-full justify-center sm:w-auto"
                      >
                        {untoldCtaLabel} <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
                <div>
                  <span className="section-kicker mb-3 block text-white/78">
                    Four chapters. One after-dark record.
                  </span>
                  <h2 className="section-display-title-compact max-w-[14ch] text-white hyphens-none break-keep text-balance">
                    Four chapters deep. The next room comes later.
                  </h2>
                  <p className={coolSubtextClass}>
                    Untold Story is the tighter, deeper current inside the
                    Monolith world. The archive is open while the next
                    coordinates take shape.
                  </p>
                </div>
                <div className="border border-white/15 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(34,211,238,0.03)] backdrop-blur-2xl md:p-8">
                  <p className="text-sm leading-relaxed text-white/82">
                    The fourth chapter is complete. Enter the archive for the
                    rooms, artists, and stories that built the record.
                  </p>
                  <Link
                    href={untoldMomentHref}
                    className="btn-pill-outline mt-6 w-full justify-center sm:w-auto"
                  >
                    Explore Untold Story <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-md py-12 md:py-16">
          <div className="container layout-wide px-6">
            <img
              src="/images/monolith-three-worlds-banner.jpg"
              alt="Monolith Project - Three Worlds. One Purpose."
              className="w-full h-auto rounded-xl border border-white/15 shadow-[0_0_40px_rgba(232,184,109,0.1)]"
            />
          </div>
        </section>

        <div
          id="season"
          className="bg-black/20 backdrop-blur-md transition-colors duration-500 relative z-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 z-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(17,17,17,0.35), transparent)",
            }}
          />
          <ViewportLazy
            minHeightClassName="min-h-[560px]"
            rootMargin="400px 0px"
          >
            <Suspense
              fallback={<Skeleton className="h-[560px] w-full opacity-10" />}
            >
              <SeasonChapterCards />
            </Suspense>
          </ViewportLazy>
          <SectionDivider
            number="01"
            label="Full Schedule"
            dark={false}
            glow={SUN_SETS_GOLD}
          />
          <ViewportLazy
            minHeightClassName="min-h-[780px]"
            rootMargin="500px 0px"
            revealAfterMs={900}
          >
            <Suspense
              fallback={<Skeleton className="h-[780px] w-full opacity-10" />}
            >
              <ScheduleSection />
            </Suspense>
          </ViewportLazy>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-20"
            style={{
              background:
                "linear-gradient(to top, rgba(12,12,12,0.4), transparent)",
            }}
          />
        </div>

        <section
          id="series"
          className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl py-20 md:py-28"
        >
          <div className="container layout-wide px-6">
            <div className="mb-8 border-b border-white/10 pb-5 md:mb-10">
              <span className="section-kicker block text-[#E8B86D]">
                The active world
              </span>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#D9C6A5]/86">
                Monolith Project is the platform. Chasing Sun(Sets) owns the
                daylight; Untold Story owns the room after dark. The next
                expression arrives when this foundation is ready.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/monolith"
                className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/76">
                  The Parent
                </p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">
                  Monolith Project
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  The platform around the rooms, people, and cultural signal
                  connecting every chapter.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/68">
                  Launch signal / forthcoming
                </p>
              </Link>
              <Link
                href="/chasing-sunsets"
                className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#E8B86D]">
                  Open Air
                </p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">
                  Chasing Sun(Sets)
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  Open-air house music gatherings shaped by golden hour,
                  lakefront energy, and community.
                </p>
              </Link>
              <Link
                href="/story"
                className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/76">
                  After Dark
                </p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">
                  Untold Story
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  After-dark rooms built for deeper sound, immersive
                  dancefloors, and artist-led moments.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/68">
                  {untoldIsPast
                    ? "Four chapters / archive open"
                    : untoldMoment?.date || "Next coordinates soon"}
                </p>
              </Link>
              <Link
                href="/partners"
                className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/76">
                  Collaborations
                </p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">
                  Partners
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  Brand and venue collaborations built around real audience
                  energy, content, and community.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <div className="bg-black/20 backdrop-blur-md relative z-10 transition-colors duration-500">
          <SectionDivider
            id="featured"
            number="02"
            label="Past Nights"
            glow={`${LIVE_RED}14`}
          />
          <ViewportLazy
            minHeightClassName="min-h-[620px]"
            rootMargin="500px 0px"
            revealAfterMs={1200}
          >
            <Suspense
              fallback={<Skeleton className="h-[620px] w-full opacity-10" />}
            >
              <FeaturedRecap />
            </Suspense>
          </ViewportLazy>
        </div>

        <div id="showcase" className="bg-black relative z-10">
          <SectionDivider
            number="03"
            label="Lineup"
            glow={MONOLITH_ORANGE}
            dense
          />
          <ViewportLazy
            minHeightClassName="min-h-[420px]"
            rootMargin="500px 0px"
            revealAfterMs={1400}
          >
            <Suspense
              fallback={<Skeleton className="h-[420px] w-full opacity-10" />}
            >
              <FeaturedSets />
            </Suspense>
          </ViewportLazy>
        </div>

        <section className="relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-md py-16 md:py-24">
          <div className="container layout-wide px-6">
            <div className="mb-6">
              <span className="section-kicker block text-primary">
                Past nights / Proof points
              </span>
            </div>
            <div className="grid gap-[1px] bg-white/10 md:grid-cols-4 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-black/60 backdrop-blur-xl p-8 hover:bg-white/[0.05] transition-all duration-300">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                  What It Is
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/90">
                  Chicago-rooted music company
                </p>
              </div>
              <div className="bg-black/60 backdrop-blur-xl p-8 hover:bg-white/[0.05] transition-all duration-300">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                  Show Types
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/90">
                  Open-air, rooftop, and after-dark chapters
                </p>
              </div>
              <div className="bg-black/60 backdrop-blur-xl p-8 hover:bg-white/[0.05] transition-all duration-300">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                  Audience Reach
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/90">
                  1M+ organic impressions across past event content
                </p>
              </div>
              <div className="bg-black/60 backdrop-blur-xl p-8 hover:bg-white/[0.05] transition-all duration-300">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                  Attendance
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/90">
                  6,000+ community attendance across flagship open-air moments
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="community"
          className="relative z-10 border-y border-white/10 bg-black/40 backdrop-blur-lg py-24 md:py-32"
        >
          <div className="container layout-wide px-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <span className="section-kicker block mb-4 text-primary">
                  Partners / Contact
                </span>
                <h2 className="section-display-title-compact mb-4 max-w-[18ch] text-white text-balance">
                  Bring your venue, brand, or idea into the room.
                </h2>
                <p className="max-w-2xl text-sm md:text-base leading-relaxed text-white/86">
                  Monolith works with venues, sponsors, artists, media, and
                  cultural partners who want to build real audience energy
                  around shows, content, and community.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] p-3 md:p-4 backdrop-blur-xl">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/partners"
                    className="btn-pill-monolith btn-pill-compact w-full"
                  >
                    Partner With Us <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-pill-outline-dark btn-pill-compact w-full"
                  >
                    Contact <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ViewportLazy
          minHeightClassName="min-h-[120px]"
          rootMargin="500px 0px"
          revealAfterMs={1600}
        >
          <Suspense
            fallback={<Skeleton className="h-[120px] w-full opacity-10" />}
          >
            <PartnershipMarquee />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
