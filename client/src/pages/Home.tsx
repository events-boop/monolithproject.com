import { lazy, Suspense, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HomeEventFeature from "@/components/HomeEventFeature";
import "@/styles/home.css";
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
const FeaturedSets = lazy(() => import("@/components/FeaturedSets"));
const PartnershipMarquee = lazy(
  () => import("@/components/PartnershipMarquee")
);
import SEO from "@/components/SEO";
import { buildSitewideIdentitySchema } from "@/lib/schema";
import { LIVE_RED, MONOLITH_ORANGE, SUN_SETS_GOLD } from "@/lib/brand";
import { appendAttributionQueryParams } from "@/lib/attribution";

function getStatusLabel(status?: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  if (status === "past") return "ARCHIVE";
  return "SIGNAL PENDING";
}

const coolSubtextClass =
  "mt-4 max-w-3xl text-sm leading-relaxed text-[#B9F6FF]/82 md:text-base";

export default function Home() {
  usePublicSiteDataVersion();
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
  const sunsetsVipHref = appendAttributionQueryParams("https://sunsets.vip");
  const untoldVipHref = appendAttributionQueryParams("https://untold.vip");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="monolith-home min-h-screen bg-background text-foreground relative overflow-x-hidden bg-noise bg-scanlines">
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

        <HomeEventFeature />

        <section
          id="platform"
          className="home-etched-band relative z-10 border-y border-white/10 bg-white/[0.02] backdrop-blur-xl py-12 md:py-16"
          data-home-etch-tone="monolith"
        >
          <div
            aria-hidden="true"
            className="platform-etch-field home-etched-band-etch"
          >
            <span className="platform-etch-wordmark">MONOLITH PROJECT</span>
            <span className="platform-etch-axis" />
            <span className="platform-etch-monolith" />
            <span className="platform-etch-sun" />
            <span className="platform-etch-room" />
          </div>
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
                <div
                  className="brand-world-frame flex min-h-full flex-col bg-black/45 p-5 backdrop-blur-md"
                  data-world-tone="monolith"
                >
                  <span aria-hidden="true" className="world-frame-sigil" />
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
                  <p className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/48">
                    Chicago / Independent music & culture
                  </p>
                  <Link
                    href="/monolith"
                    aria-label="Explore the Monolith Project platform"
                    className="brand-world-domain-link btn-text-action mt-3 w-full justify-between"
                  >
                    <span>MONOLITHPROJECT.COM</span>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </div>
                <div
                  className="brand-world-frame flex min-h-full flex-col bg-[#2b1b10]/38 p-5 backdrop-blur-md"
                  data-world-tone="sunsets"
                >
                  <span aria-hidden="true" className="world-frame-sigil" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#E8B86D]">
                    Daylight
                  </span>
                  <h3 className="mt-3 font-display text-xl text-white">
                    Chasing Sun(Sets)
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/68">
                    Lakefront house music, golden hour, and the final chapter of
                    the summer at Castaways.
                  </p>
                  <p className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F4D7A1]/78">
                    III / The season finale
                  </p>
                  <a
                    href={sunsetsVipHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Sunsets VIP in a new tab"
                    className="brand-world-domain-link btn-text-action mt-3 w-full justify-between"
                  >
                    <span>SUNSETS.VIP</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
                <div
                  className="brand-world-frame flex min-h-full flex-col bg-[#07191d]/48 p-5 backdrop-blur-md"
                  data-world-tone="untold"
                >
                  <span aria-hidden="true" className="world-frame-sigil" />
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
                  <p className="mt-auto pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#B9F6FF]/76">
                    Four chapters / archive open
                  </p>
                  <a
                    href={untoldVipHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open Untold VIP in a new tab"
                    className="brand-world-domain-link btn-text-action mt-3 w-full justify-between"
                  >
                    <span>UNTOLD.VIP</span>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="campaigns"
          className="home-etched-band relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-lg py-20 md:py-28"
          data-home-etch-tone="untold"
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

                <div
                  className="signal-etched-frame rounded-xl border border-white/15 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(34,211,238,0.03)] backdrop-blur-2xl transition-all duration-500 hover:border-[#22d3ee]/40 md:p-8"
                  data-signal-tone="untold"
                >
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
                      className="btn-pill-outline btn-pill-outline-untold btn-pill-compact w-full justify-center sm:w-auto"
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
                <div
                  className="signal-etched-frame border border-white/15 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(34,211,238,0.03)] backdrop-blur-2xl md:p-8"
                  data-signal-tone="untold"
                >
                  <p className="text-sm leading-relaxed text-white/82">
                    The fourth chapter is complete. Enter the archive for the
                    rooms, artists, and stories that built the record.
                  </p>
                  <Link
                    href={untoldMomentHref}
                    className="btn-pill-outline btn-pill-outline-untold mt-6 w-full justify-center sm:w-auto"
                  >
                    Explore Untold Story <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
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
          <SectionDivider
            id="schedule-divider"
            number="01"
            label="Full Schedule"
            dark={false}
            glow={SUN_SETS_GOLD}
            etched
            etchTone="sunsets"
            watermark="CHASING SUN(SETS)"
          />
          <ViewportLazy
            minHeightClassName="min-h-[780px]"
            rootMargin="900px 0px"
            revealAfterMs={900}
          >
            <Suspense
              fallback={
                <Skeleton className="h-[780px] w-full opacity-25 animate-pulse" />
              }
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

        <div className="bg-black/20 backdrop-blur-md relative z-10 transition-colors duration-500">
          <SectionDivider
            id="featured"
            number="02"
            label="Past Nights"
            glow={`${LIVE_RED}14`}
            etched
            etchTone="archive"
            watermark="MONOLITH PROJECT"
          />
          <ViewportLazy
            minHeightClassName="min-h-[620px]"
            rootMargin="900px 0px"
            revealAfterMs={1200}
          >
            <Suspense
              fallback={
                <Skeleton className="h-[620px] w-full opacity-25 animate-pulse" />
              }
            >
              <FeaturedRecap />
            </Suspense>
          </ViewportLazy>
        </div>

        <div id="showcase" className="bg-black relative z-10">
          <SectionDivider
            id="lineup-divider"
            number="03"
            label="From the archive"
            glow={MONOLITH_ORANGE}
            dense
            etched
            etchTone="monolith"
            watermark="ARTISTS / ARCHIVE"
          />
          <ViewportLazy
            minHeightClassName="min-h-[420px]"
            rootMargin="900px 0px"
            revealAfterMs={1400}
          >
            <Suspense
              fallback={
                <Skeleton className="h-[420px] w-full opacity-25 animate-pulse" />
              }
            >
              <FeaturedSets />
            </Suspense>
          </ViewportLazy>
        </div>

        <section
          className="home-etched-band relative z-10 border-b border-white/10 bg-black/30 backdrop-blur-md py-16 md:py-24"
          data-home-etch-tone="archive"
        >
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

              <div
                className="signal-etched-frame border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl md:p-4"
                data-signal-tone="monolith"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/partners"
                    className="btn-pill-monolith btn-pill-compact w-full"
                  >
                    Partner With Us <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-pill-outline btn-pill-outline-monolith btn-pill-compact w-full"
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
          rootMargin="900px 0px"
          revealAfterMs={1600}
        >
          <Suspense
            fallback={
              <Skeleton className="h-[120px] w-full opacity-25 animate-pulse" />
            }
          >
            <PartnershipMarquee />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
