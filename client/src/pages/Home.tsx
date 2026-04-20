import { lazy, Suspense, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import { Skeleton } from "@/components/ui/skeleton";

const CinematicBreak = lazy(() => import("@/components/CinematicBreak").catch(() => ({ default: () => <></> })));
const ExpressionSplit = lazy(() => import("@/components/ExpressionSplit"));
const FeaturedRecap = lazy(() => import("@/components/FeaturedRecap"));
const ShowcaseSplit = lazy(() => import("@/components/ShowcaseSplit"));
const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const Ticker = lazy(() => import("@/components/Ticker"));
const LiveTickets = lazy(() => import("@/components/LiveTickets"));
const FeaturedSets = lazy(() => import("@/components/FeaturedSets"));
import SEO from "@/components/SEO";
import { buildSitewideIdentitySchema } from "@/lib/schema";
import { LIVE_RED, MONOLITH_ORANGE, SUN_SETS_GOLD } from "@/lib/brand";


export default function Home() {
  usePublicSiteDataVersion();

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

        <ViewportLazy minHeightClassName="min-h-[120px]" rootMargin="0px 0px">
          <Suspense fallback={<Skeleton className="h-[120px] w-full opacity-10" />}>
            <Ticker />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
