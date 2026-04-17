import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import { Skeleton } from "@/components/ui/skeleton";

const CinematicBreak = lazy(() => import("@/components/CinematicBreak").catch(() => ({ default: () => <></> })));
const ExpressionSplit = lazy(() => import("@/components/ExpressionSplit"));
const FeaturedCampaigns = lazy(() => import("@/components/FeaturedCampaigns"));
const ShowcaseSplit = lazy(() => import("@/components/ShowcaseSplit"));
const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const Ticker = lazy(() => import("@/components/Ticker"));
const VisitorContextPanel = lazy(() => import("@/components/VisitorContextPanel"));
import SEO from "@/components/SEO";
import { buildSitewideIdentitySchema } from "@/lib/schema";


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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
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
      </motion.div>
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        <div className="bg-[#0a0a0a] border-y border-white/5 relative z-10">
          <div id="start-here" className="relative pt-16 md:pt-20 pb-10">
            <ViewportLazy minHeightClassName="min-h-[280px]" rootMargin="220px 0px">
              <Suspense fallback={<Skeleton className="mx-auto h-[280px] w-full max-w-6xl opacity-10" />}>
                <VisitorContextPanel allowPartnerIntent={false} forcedSegment="first-visit" />
              </Suspense>
            </ViewportLazy>
          </div>
        </div>

        <div className="bg-[#0c0c0c] relative z-10 transition-colors duration-500">
          <SectionDivider id="campaigns" number="01" label="Upcoming Highlights" glow="rgba(255,51,51,0.08)" />
          <ViewportLazy minHeightClassName="min-h-[760px]" rootMargin="220px 0px">
            <Suspense fallback={<Skeleton className="h-[760px] w-full opacity-10" />}>
              <FeaturedCampaigns />
            </Suspense>
          </ViewportLazy>
        </div>

        <div className="bg-[#F8F8F8] transition-colors duration-500 relative z-10">
          <SectionDivider id="season" number="02" label="The Season" dark={false} glow="#8B5CF6" />
          <ViewportLazy minHeightClassName="min-h-[780px]" rootMargin="280px 0px">
            <Suspense fallback={<Skeleton className="h-[780px] w-full opacity-10" />}>
              <ScheduleSection />
            </Suspense>
          </ViewportLazy>
        </div>

        <div className="bg-[#111111] relative z-10 transition-colors duration-500">
          <SectionDivider id="series" number="03" label="The Branches" glow="#E05A3A" dense />
          <ViewportLazy minHeightClassName="min-h-[900px]" rootMargin="300px 0px">
            <Suspense fallback={<Skeleton className="h-[900px] w-full opacity-10" />}>
              <ExpressionSplit />
            </Suspense>
          </ViewportLazy>
        </div>

        <div className="bg-[#0d0d0d] relative z-10 transition-colors duration-500">
          <SectionDivider id="showcase" number="04" label="Explore" glow="#D4A574" dense />
          <ViewportLazy minHeightClassName="min-h-[900px]" rootMargin="300px 0px">
            <Suspense fallback={<Skeleton className="h-[900px] w-full opacity-10" />}>
              <ShowcaseSplit />
            </Suspense>
          </ViewportLazy>
        </div>

        <ViewportLazy minHeightClassName="min-h-[60vh]">
          <Suspense fallback={<Skeleton className="w-full h-[60vh] opacity-20" />}>
            <CinematicBreak
              image="/images/untold-story-juany-deron-v2.webp"
              videoSrc="/videos/hero-video-short.mp4"
              quote="We don't just book artists; we build rooms. We believe the best nights in Chicago happen when the sound is flawless, the crowd is intentional, and the space is designed for the music."
              attribution="The Monolith Project"
            />
          </Suspense>
        </ViewportLazy>

        <div className="bg-[#0c0b0a] relative z-10 transition-colors duration-500 pb-24 md:pb-32">
          <SectionDivider id="community" number="05" label="Newsletter" glow="#D4A574" />
          <ViewportLazy minHeightClassName="min-h-[620px]" rootMargin="220px 0px">
            <Suspense fallback={<Skeleton className="h-[620px] w-full opacity-10" />}>
              <NewsletterSection source="homepage_bottom" />
            </Suspense>
          </ViewportLazy>
        </div>

        <ViewportLazy minHeightClassName="min-h-[120px]" rootMargin="180px 0px">
          <Suspense fallback={<Skeleton className="h-[120px] w-full opacity-10" />}>
            <Ticker />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
