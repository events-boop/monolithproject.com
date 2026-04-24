import { lazy, Suspense, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import { Skeleton } from "@/components/ui/skeleton";
import ConversionCTA from "@/components/ConversionCTA";
import JoinSignalSection from "@/components/JoinSignalSection";
import {
  getEventVenueLabel,
  getExperienceEvent,
  getSeriesLabel,
} from "@/lib/siteExperience";
import { getEventDetailsHref } from "@/lib/cta";

const CinematicBreak = lazy(() => import("@/components/CinematicBreak").catch(() => ({ default: () => <></> })));
const ExpressionSplit = lazy(() => import("@/components/ExpressionSplit"));
const FeaturedRecap = lazy(() => import("@/components/FeaturedRecap"));
const ShowcaseSplit = lazy(() => import("@/components/ShowcaseSplit"));
const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const Ticker = lazy(() => import("@/components/Ticker"));
const LiveTickets = lazy(() => import("@/components/LiveTickets"));
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
  const featuredMoment = getExperienceEvent("hero");
  const featuredMomentHref = getEventDetailsHref(featuredMoment);
  const featuredMomentSummary =
    featuredMoment?.description ||
    featuredMoment?.experienceIntro ||
    "A curated chapter built around sound quality, intentional crowd energy, and cinematic pacing.";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden bg-noise bg-scanlines">
      <SEO
        title="Chicago Music Nights, Series, and Archive"
        description="The Monolith Project is the root. Chasing Sun(Sets) runs daytime — rooftops in summer, the Radio Show worldwide. Untold Story runs the night. One Chicago music project."
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

        <section className="relative z-10 border-y border-white/10 bg-[#080808] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 md:mb-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">Featured Moment</span>
              {featuredMoment?.status ? (
                <span className="border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/75">
                  {getStatusLabel(featuredMoment.status)}
                </span>
              ) : null}
            </div>

            {featuredMoment ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
                <div>
                  <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                    {getSeriesLabel(featuredMoment.series)}
                  </span>
                  <h2 className="font-display text-[clamp(2.2rem,5vw,4.8rem)] leading-[0.9] uppercase tracking-tight text-white">
                    {featuredMoment.headline || featuredMoment.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                    {featuredMomentSummary}
                  </p>
                </div>

                <div className="border border-white/15 bg-white/[0.02] p-5 md:p-6">
                  <dl className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                    <div>
                      <dt className="text-white/40">Date</dt>
                      <dd className="mt-1 text-white">{featuredMoment.date}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">Time</dt>
                      <dd className="mt-1 text-white">{featuredMoment.time}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">Venue</dt>
                      <dd className="mt-1 text-white">{featuredMoment.venue}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">City</dt>
                      <dd className="mt-1 text-white">{featuredMoment.location}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-white/65">{getEventVenueLabel(featuredMoment)}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <ConversionCTA event={featuredMoment} size="md" showUrgency={false} />
                    <Link href={featuredMomentHref} className="btn-pill-outline btn-pill-compact w-full justify-center sm:w-auto">
                      View Event Details <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/70">Featured event details are being updated.</p>
            )}
          </div>
        </section>

        <section className="relative z-10 border-b border-white/10 bg-[#0d0d0d] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 border-b border-white/10 pb-5 md:mb-10">
              <span className="block font-mono text-[11px] uppercase tracking-[0.35em] text-[#E8B86D]">
                One Platform. Multiple Frequencies.
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/story" className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Untold Story</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">After-Dark Chapters</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Late-night rooms designed for pacing, intentional crowd energy, and uncompromised sound.
                </p>
              </Link>
              <Link href="/chasing-sunsets" className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Chasing Sun(Sets)</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Open-Air Chapters</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Rooftop and outdoor sessions built around golden-hour movement and clear sonic architecture.
                </p>
              </Link>
              <Link href="/radio" className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Radio</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Broadcast Memory</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Episode archive and curated mixes that extend each room beyond the night itself.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-10 border-b border-white/10 bg-[#111111] py-10 md:py-14">
          <div className="container layout-wide px-6">
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Past Signal</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">Chicago-rooted music platform</p>
              </div>
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Format</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Open-air, rooftop, and after-dark chapters
                </p>
              </div>
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Reach</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">1M+ organic impressions across past event content</p>
              </div>
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Attendance</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  6,000+ community attendance across flagship open-air moments
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[#111111] relative z-10 transition-colors duration-500">
          <SectionDivider id="series" number="01" label="The Branches" glow={MONOLITH_ORANGE} dense />
          <ViewportLazy minHeightClassName="min-h-[900px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[900px] w-full opacity-10" />}>
              <ExpressionSplit />
            </Suspense>
          </ViewportLazy>
        </div>

        <div className="bg-[#F4ECD9] transition-colors duration-500 relative z-10">
          {/* Warm top-edge fade — bleeds the dark Branches into golden-hour cream */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 z-20"
            style={{ background: "linear-gradient(to bottom, rgba(17,17,17,0.35), transparent)" }}
          />
          <SectionDivider id="season" number="02" label="The Season" dark={false} glow={SUN_SETS_GOLD} />
          <ViewportLazy minHeightClassName="min-h-[780px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[780px] w-full opacity-10" />}>
              <ScheduleSection />
            </Suspense>
          </ViewportLazy>
          {/* Warm bottom-edge fade — returns to Featured's near-black */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-20"
            style={{ background: "linear-gradient(to top, rgba(12,12,12,0.4), transparent)" }}
          />
        </div>

        <div className="bg-[#0c0c0c] relative z-10 transition-colors duration-500">
          <SectionDivider id="featured" number="03" label="Featured" glow={`${LIVE_RED}14`} />
          <ViewportLazy minHeightClassName="min-h-[620px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[620px] w-full opacity-10" />}>
              <FeaturedRecap />
            </Suspense>
          </ViewportLazy>
        </div>

        <div id="live" className="bg-black relative z-10">
          <ViewportLazy minHeightClassName="min-h-[420px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[420px] w-full opacity-10" />}>
              <LiveTickets />
            </Suspense>
          </ViewportLazy>
        </div>

        <div className="bg-[#0d0d0d] relative z-10 transition-colors duration-500">
          <SectionDivider id="showcase" number="04" label="Explore" glow={SUN_SETS_GOLD} dense />
          <ViewportLazy minHeightClassName="min-h-[900px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[900px] w-full opacity-10" />}>
              <ShowcaseSplit />
            </Suspense>
          </ViewportLazy>
        </div>

        <ViewportLazy minHeightClassName="min-h-[60vh]" rootMargin="0px 0px">
          <Suspense fallback={<Skeleton className="w-full h-[60vh] opacity-20" />}>
            <CinematicBreak
              image="/images/untold-story-juany-deron-v2.webp"
              videoSrc="/videos/hero-video-short.mp4"
              mobileVideoSrc="/videos/hero-video-short-mobile.mp4"
              quote="We don't just book artists; we build rooms. We believe the best nights in Chicago happen when the sound is flawless, the crowd is intentional, and the space is designed for the music."
              attribution="The Monolith Project"
            />
          </Suspense>
        </ViewportLazy>

        <div className="bg-[#0c0b0a] relative z-10 transition-colors duration-500 pb-24 md:pb-32">
          <SectionDivider id="community" number="05" label="Newsletter" glow={SUN_SETS_GOLD} />
          <ViewportLazy minHeightClassName="min-h-[620px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[620px] w-full opacity-10" />}>
              <NewsletterSection source="homepage_bottom" />
            </Suspense>
          </ViewportLazy>
        </div>

        <div id="featured-sets" className="bg-black relative z-10">
          <ViewportLazy minHeightClassName="min-h-[420px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[420px] w-full opacity-10" />}>
              <FeaturedSets />
            </Suspense>
          </ViewportLazy>
        </div>

        <JoinSignalSection />

        <ViewportLazy minHeightClassName="min-h-[120px]" rootMargin="0px 0px">
          <Suspense fallback={<Skeleton className="h-[120px] w-full opacity-10" />}>
            <PartnershipMarquee />
          </Suspense>
        </ViewportLazy>

        <ViewportLazy minHeightClassName="min-h-[120px]" rootMargin="0px 0px">
          <Suspense fallback={<Skeleton className="h-[120px] w-full opacity-10" />}>
            <Ticker />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
