import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";
import { getExperienceEvent, getPrimaryTicketUrl } from "@/lib/siteExperience";
import { Skeleton } from "@/components/ui/skeleton";

const CinematicBreak = lazy(() => import("@/components/CinematicBreak").catch(() => ({ default: () => <></> })));
const ConversionStrip = lazy(() => import("@/components/ConversionStrip"));
const EditorialSignalsSection = lazy(() => import("@/components/EditorialSignalsSection"));
const EventCountdown = lazy(() => import("@/components/EventCountdown"));
const EventFunnelStack = lazy(() => import("@/components/EventFunnelStack"));
const ExpressionSplit = lazy(() => import("@/components/ExpressionSplit"));
const FeaturedCampaigns = lazy(() => import("@/components/FeaturedCampaigns"));
const HomeShowcaseAccordion = lazy(() => import("@/components/HomeShowcaseAccordion"));
const MixedMediaGallery = lazy(() => import("@/components/MixedMediaGallery"));
const MovementSection = lazy(() => import("@/components/MovementSection"));
const NightInNumbers = lazy(() => import("@/components/NightInNumbers"));
const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const SoundCloudSection = lazy(() => import("@/components/SoundCloudSection"));
const TextLineupSection = lazy(() => import("@/components/TextLineupSection"));
const Ticker = lazy(() => import("@/components/Ticker"));
const VisitorContextPanel = lazy(() => import("@/components/VisitorContextPanel"));
const WhatToExpect = lazy(() => import("@/components/WhatToExpect"));
import SEO from "@/components/SEO";

export default function Home() {
  const funnelEvent = getExperienceEvent("funnel");
  const ticketUrl = getPrimaryTicketUrl(funnelEvent);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden bg-noise bg-scanlines">
      <SEO
        title="Chicago Music Nights, Series, and Archive"
        description="The Monolith Project is a Chicago-rooted music world built through recurring nights, distinct series, a radio show, and an archive shaped by curation, atmosphere, and return-worthy rooms."
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
        <ViewportLazy minHeightClassName="min-h-[760px]" rootMargin="220px 0px">
          <Suspense fallback={<Skeleton className="h-[760px] w-full opacity-10" />}>
            <FeaturedCampaigns />
          </Suspense>
        </ViewportLazy>

        <div className="bg-[#111111] border-y border-white/5 relative z-10 transition-colors duration-500">
          <SectionDivider id="series" number="01" label="The Series" glow="#E05A3A" />
          <ViewportLazy minHeightClassName="min-h-[900px]" rootMargin="300px 0px">
            <Suspense fallback={<Skeleton className="h-[900px] w-full opacity-10" />}>
              <ExpressionSplit />
            </Suspense>
          </ViewportLazy>
          <ViewportLazy minHeightClassName="min-h-[520px]" rootMargin="260px 0px">
            <Suspense fallback={<Skeleton className="h-[520px] w-full opacity-10" />}>
              <WhatToExpect />
            </Suspense>
          </ViewportLazy>
        </div>

        <div className="bg-[#F8F8F8] transition-colors duration-500 border-y border-black/5">
          <SectionDivider id="season" number="02" label="The Season" dark={false} glow="#8B5CF6" />
          <ViewportLazy minHeightClassName="min-h-[780px]" rootMargin="280px 0px">
            <Suspense fallback={<Skeleton className="h-[780px] w-full opacity-10" />}>
              <ScheduleSection />
            </Suspense>
          </ViewportLazy>
          
          {/* Official Campaign Countdowns Stack - Now Inside Season Chapter */}
          <ViewportLazy minHeightClassName="min-h-[640px]" rootMargin="240px 0px">
            <Suspense fallback={<Skeleton className="h-[640px] w-full opacity-10" />}>
              <div className="flex flex-col w-full bg-white/40 pb-20">
                  <EventCountdown eventId="us-s3e3" />
                  <EventCountdown eventId="css-jul04" />
              </div>
            </Suspense>
          </ViewportLazy>
        </div>

        <div className="bg-[#080808] border-y border-white/5 relative z-10 transition-colors duration-500">
           <SectionDivider id="collective" number="03" label="The Philosophy" glow="rgba(255,255,255,0.15)" />
           <ViewportLazy minHeightClassName="min-h-[820px]" rootMargin="260px 0px">
             <Suspense fallback={<Skeleton className="h-[820px] w-full opacity-10" />}>
               <MovementSection />
             </Suspense>
           </ViewportLazy>
        </div>

        <ViewportLazy minHeightClassName="min-h-[60vh]">
          <Suspense fallback={<Skeleton className="w-full h-[60vh] opacity-20" />}>
            <CinematicBreak
              image="/images/untold-story-juany-deron-v2.jpg"
              videoSrc="/videos/hero-video-short.mp4"
              quote="We believe music can hold a room together. We believe gathering should feel shared. We believe the strongest nights leave a record behind."
              attribution="The Monolith Project"
              ctaLabel="Get Tickets"
              ctaUrl={ticketUrl}
              ctaExternal
            />
          </Suspense>
        </ViewportLazy>

        {/* HUD Recognition Reveal + SS-Conversion Strip */}
        <div className="relative pt-24 md:pt-32 pb-12">
           <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 -translate-y-1/2" />
           <ViewportLazy minHeightClassName="min-h-[280px]" rootMargin="220px 0px">
             <Suspense fallback={<Skeleton className="mx-auto h-[280px] w-full max-w-6xl opacity-10" />}>
               <VisitorContextPanel />
             </Suspense>
           </ViewportLazy>
        </div>
        <div className="px-6 mb-24 md:mb-32">
          <div className="container mx-auto max-w-6xl">
            <ViewportLazy minHeightClassName="min-h-[180px]" rootMargin="220px 0px">
              <Suspense fallback={<Skeleton className="h-[180px] w-full opacity-10" />}>
                <ConversionStrip />
              </Suspense>
            </ViewportLazy>
          </div>
        </div>

        <ViewportLazy minHeightClassName="min-h-[520px]" rootMargin="220px 0px">
          <Suspense fallback={<Skeleton className="h-[520px] w-full opacity-10" />}>
            <NightInNumbers />
          </Suspense>
        </ViewportLazy>

        {/* Collapsible SS-Tier Showcase Modules */}
        <ViewportLazy minHeightClassName="min-h-[900px]" rootMargin="220px 0px">
          <Suspense fallback={<Skeleton className="h-[900px] w-full opacity-10" />}>
            <HomeShowcaseAccordion items={[
              {
                id: "roster",
                number: "04",
                title: "The Collective",
                subtitle: "The Roster · Selectors",
                previewImage: "/images/artists-collective.jpg",
                content: (
                  <Suspense fallback={<Skeleton className="h-[520px] w-full opacity-10" />}>
                    <TextLineupSection />
                  </Suspense>
                )
              },
              {
                id: "journal",
                number: "05",
                title: "The Longest Record",
                subtitle: "Beyond the night · Editorials",
                previewImage: "/images/editorial-bg.jpg",
                content: (
                  <Suspense fallback={<Skeleton className="h-[520px] w-full opacity-10" />}>
                    <EditorialSignalsSection />
                  </Suspense>
                )
              },
              {
                id: "archive",
                number: "06",
                title: "Captured Moments",
                subtitle: "The Archive · Visual Records",
                previewImage: "/images/autograf-recap.jpg",
                content: (
                  <ViewportLazy minHeightClassName="min-h-[520px]">
                    <Suspense fallback={<Skeleton className="w-full h-[520px] opacity-10" />}>
                      <MixedMediaGallery />
                    </Suspense>
                  </ViewportLazy>
                )
              },
              {
                id: "mixes",
                number: "07",
                title: "Radio Transmission",
                subtitle: "Mixes · Curated Sound",
                previewImage: "/images/radio-show.jpg",
                content: (
                  <ViewportLazy minHeightClassName="min-h-[420px]">
                    <div className="bg-card">
                      <Suspense fallback={null}>
                        <SoundCloudSection />
                      </Suspense>
                    </div>
                  </ViewportLazy>
                )
              }
            ]} />
          </Suspense>
        </ViewportLazy>

        <div className="bg-[#0c0b0a] border-y border-white/5 relative z-10 transition-colors duration-500">
          <SectionDivider id="community" number="08" label="Inner Circle" glow="#D4A574" />
          {funnelEvent ? (
            <ViewportLazy minHeightClassName="min-h-[620px]" rootMargin="240px 0px">
              <Suspense fallback={<Skeleton className="h-[620px] w-full opacity-10" />}>
                <EventFunnelStack eventId={funnelEvent.id} />
              </Suspense>
            </ViewportLazy>
          ) : null}

          <ViewportLazy minHeightClassName="min-h-[620px]" rootMargin="220px 0px">
            <Suspense fallback={<Skeleton className="h-[620px] w-full opacity-10" />}>
              <NewsletterSection source="homepage_bottom" />
            </Suspense>
          </ViewportLazy>
        </div>
        
        {/* Structural buffer for Footer / HUD clearance */}
        <div className="h-24 md:h-32" />

        <ViewportLazy minHeightClassName="min-h-[120px]" rootMargin="180px 0px">
          <Suspense fallback={<Skeleton className="h-[120px] w-full opacity-10" />}>
            <Ticker />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
