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
  getSeriesExperienceEvent,
} from "@/lib/siteExperience";
import { getEventDetailsHref } from "@/lib/cta";
import { CHASING_SUNSETS_DROP_URL } from "@/lib/dropLinks";

const FeaturedRecap = lazy(() => import("@/components/FeaturedRecap"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const FeaturedSets = lazy(() => import("@/components/FeaturedSets"));
const PartnershipMarquee = lazy(() => import("@/components/PartnershipMarquee"));
import SEO from "@/components/SEO";
import { buildSitewideIdentitySchema } from "@/lib/schema";
import { LIVE_RED, MONOLITH_ORANGE, SUN_SETS_GOLD } from "@/lib/brand";

function getStatusLabel(status?: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  return "PAST";
}

export default function Home() {
  usePublicSiteDataVersion();
  const chasingSeasonEvent = getSeriesExperienceEvent("chasing-sunsets", "hero");
  const untoldMoment = getSeriesExperienceEvent("untold-story", "hero");
  const untoldMomentHref = "/story";
  const untoldTicketHref = untoldMoment?.ticketUrl || untoldMoment?.primaryCta?.href || untoldMomentHref;
  const untoldTicketIsExternal = /^https?:\/\//i.test(untoldTicketHref);

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

      {/* Ambient static background glows for depth */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute -left-[8vw] -top-[10vh] h-[42rem] w-[42rem] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, var(--scene-glow) 0%, transparent 62%)" }}
        />
        <div
          className="absolute -right-[8vw] bottom-[-16vh] h-[34rem] w-[34rem] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 68%)" }}
        />
      </div>
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        <section className="relative z-10 border-y border-white/10 bg-[#0d0d0d] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 border-b border-white/10 pb-5 md:mb-10">
              <span className="section-kicker block text-[#E8B86D]">
                Chasing Sun(Sets) Season 2026
              </span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <h2 className="section-display-title-compact max-w-[16ch] text-white hyphens-none break-keep text-balance">
                  2nd Annual 4th of July @ Castaways
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/86 md:text-base">
                  Tradition begins on the lakefront. Sign up for the drop - season details, schedule, lineup, and July 4 first access coming soon.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={CHASING_SUNSETS_DROP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-neutral btn-pill-wide w-full justify-center sm:w-auto"
                  >
                    SIGN UP FOR THE DROP
                  </a>
                  <Link href="/chasing-sunsets" className="btn-pill-outline btn-pill-wide w-full justify-center sm:w-auto">
                    View Chasing Sun(Sets) Season
                  </Link>
                  <Link href="/schedule" className="btn-text-action">
                    See Summer Dates
                  </Link>
                </div>
              </div>

              <div className="border border-white/15 bg-white/[0.02] p-5 md:p-6">
                <span className="section-kicker block text-[#E8B86D]">
                  Season Focus
                </span>
                <h3 className="section-display-title-compact mt-3 max-w-[14ch] text-white hyphens-none break-keep text-balance">
                  {chasingSeasonEvent?.headline || "July 4th Open-Air Homecoming"}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/84">
                  {chasingSeasonEvent?.description ||
                    "Chicago's open-air house music gathering returns to North Avenue Beach with golden-hour sets, special guests, and a community built around sound, sunset, and togetherness."}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/84">
                  <div>
                    <dt className="text-white/66">Date</dt>
                    <dd className="mt-1 text-white">{chasingSeasonEvent?.date || "Coming Soon"}</dd>
                  </div>
                  <div>
                    <dt className="text-white/66">Location</dt>
                    <dd className="mt-1 text-white">
                      {chasingSeasonEvent ? getEventVenueLabel(chasingSeasonEvent) : "Chicago"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/66">Status</dt>
                    <dd className="mt-1 text-white">{getStatusLabel(chasingSeasonEvent?.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-white/66">Lineup</dt>
                    <dd className="mt-1 text-white">{chasingSeasonEvent?.lineup || "Lineup Coming Soon"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section id="campaigns" className="relative z-10 border-b border-white/10 bg-[#080808] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 md:mb-10">
              <span className="section-kicker text-primary">Untold Story IV</span>
              {untoldMoment?.status ? (
                <span className="border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/75">
                  {getStatusLabel(untoldMoment.status)}
                </span>
              ) : null}
            </div>

            {untoldMoment ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                  <span className="section-kicker mb-3 block text-white/78">
                    UNTOLD STORY IV
                  </span>
                  <h2 className="section-display-title-compact max-w-[14ch] text-white hyphens-none break-keep text-balance">
                    Eran Hersh in Chicago
                  </h2>
                  <p className="mt-4 font-display text-xl text-[#F4D7A1] md:text-2xl">May 16 at Hideaway</p>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/86 md:text-base">
                    Untold Story returns with Eran Hersh for an intimate after-dark chapter of house music, movement, and atmosphere.
                  </p>
                </div>

                <div className="border border-white/15 bg-white/[0.02] p-5 md:p-6">
                  <dl className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/84">
                    <div>
                      <dt className="text-white/66">Date</dt>
                      <dd className="mt-1 text-white">{untoldMoment.date}</dd>
                    </div>
                    <div>
                      <dt className="text-white/66">Time</dt>
                      <dd className="mt-1 text-white">{untoldMoment.time}</dd>
                    </div>
                    <div>
                      <dt className="text-white/66">Venue</dt>
                      <dd className="mt-1 text-white">{untoldMoment.venue}</dd>
                    </div>
                    <div>
                      <dt className="text-white/66">City</dt>
                      <dd className="mt-1 text-white">{untoldMoment.location}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-white/82">{getEventVenueLabel(untoldMoment)}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link href={untoldMomentHref} className="btn-pill-outline btn-pill-compact w-full justify-center sm:w-auto">
                      View Event <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    {untoldTicketIsExternal ? (
                      <a
                        href={untoldTicketHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill btn-pill-compact w-full justify-center sm:w-auto"
                      >
                        Get Tickets <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link href={untoldTicketHref} className="btn-pill btn-pill-compact w-full justify-center sm:w-auto">
                        Get Tickets <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/84">Untold Story IV details are being updated.</p>
            )}
          </div>
        </section>

        <section className="relative z-10 border-b border-white/10 bg-[#0d0c0b] py-10 md:py-14">
          <div className="container layout-wide px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="section-kicker block text-white/74">
                  Chasing Sun(Sets) Summer 2026
                </span>
                <h3 className="section-display-title-compact mt-3 text-white">
                  Season Dates
                </h3>
              </div>
              <Link href="/chasing-sunsets" className="btn-text-action">
                View Season Page
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="border border-white/15 bg-white/[0.02] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/85">
                July 4, 2026
              </div>
              <div className="border border-white/15 bg-white/[0.02] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/85">
                August 22, 2026
              </div>
              <div className="border border-white/15 bg-white/[0.02] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/85">
                September 19/26, 2026
              </div>
            </div>
          </div>
        </section>

        <div id="season" className="bg-[#F4ECD9] transition-colors duration-500 relative z-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 z-20"
            style={{ background: "linear-gradient(to bottom, rgba(17,17,17,0.35), transparent)" }}
          />
          <SectionDivider number="01" label="Upcoming Shows" dark={false} glow={SUN_SETS_GOLD} />
          <ViewportLazy minHeightClassName="min-h-[780px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[780px] w-full opacity-10" />}>
              <ScheduleSection />
            </Suspense>
          </ViewportLazy>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-20"
            style={{ background: "linear-gradient(to top, rgba(12,12,12,0.4), transparent)" }}
          />
        </div>

        <section id="series" className="relative z-10 border-b border-white/10 bg-[#111111] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 border-b border-white/10 pb-5 md:mb-10">
              <span className="section-kicker block text-[#E8B86D]">
                One platform, multiple series.
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Link href="/chasing-sunsets" className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#E8B86D]">Open Air</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Chasing Sun(Sets)</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  Open-air house music gatherings shaped by golden hour, lakefront energy, and community.
                </p>
              </Link>
              <Link href="/story" className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/76">After Dark</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Untold Story</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  After-dark rooms built for deeper sound, immersive dancefloors, and artist-led moments.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/68">
                  {untoldMoment?.date || "Current indoor event details live on the story page"}
                </p>
              </Link>
              <Link href="/radio" className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/76">Radio</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Radio</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  Mixes, conversations, and cultural memory from the artists shaping the sound.
                </p>
              </Link>
              <Link href="/partners" className="group border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/76">Collaborations</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Partners</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/84">
                  Brand and venue collaborations built around real audience energy, content, and community.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-10 border-b border-white/10 bg-[#111111] py-10 md:py-14">
          <div className="container layout-wide px-6">
            <div className="mb-6">
              <span className="section-kicker block text-primary">
                Past nights / Proof points
              </span>
            </div>
            <div className="grid gap-px bg-white/5 md:grid-cols-4">
              <div className="bg-[#111111] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">What It Is</p>
                <p className="mt-3 text-sm leading-relaxed text-white/90">Chicago-rooted music company</p>
              </div>
              <div className="bg-[#111111] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Show Types</p>
                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  Open-air, rooftop, and after-dark chapters
                </p>
              </div>
              <div className="bg-[#111111] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Audience Reach</p>
                <p className="mt-3 text-sm leading-relaxed text-white/90">1M+ organic impressions across past event content</p>
              </div>
              <div className="bg-[#111111] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary">Attendance</p>
                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  6,000+ community attendance across flagship open-air moments
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[#0c0c0c] relative z-10 transition-colors duration-500">
          <SectionDivider id="featured" number="02" label="Past Nights" glow={`${LIVE_RED}14`} />
          <ViewportLazy minHeightClassName="min-h-[620px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[620px] w-full opacity-10" />}>
              <FeaturedRecap />
            </Suspense>
          </ViewportLazy>
        </div>

        <div id="showcase" className="bg-black relative z-10">
          <SectionDivider number="03" label="Radio" glow={MONOLITH_ORANGE} dense />
          <ViewportLazy minHeightClassName="min-h-[420px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[420px] w-full opacity-10" />}>
              <FeaturedSets />
            </Suspense>
          </ViewportLazy>
        </div>

        <section id="community" className="relative z-10 border-y border-white/10 bg-[#0c0b0a] py-16 md:py-20">
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
                  Monolith works with venues, sponsors, artists, media, and cultural partners who want to build real audience energy around shows, content, and community.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] p-3 md:p-4 backdrop-blur-xl">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/partners" className="btn-pill-primary btn-pill-compact w-full">
                    Partner With Us <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link href="/contact" className="btn-pill-secondary btn-pill-compact w-full">
                    Contact <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ViewportLazy minHeightClassName="min-h-[120px]" rootMargin="0px 0px">
          <Suspense fallback={<Skeleton className="h-[120px] w-full opacity-10" />}>
            <PartnershipMarquee />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
