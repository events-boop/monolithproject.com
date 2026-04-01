import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import VisitorContextPanel from "@/components/VisitorContextPanel";
import MovementSection from "@/components/MovementSection";
import ExpressionSplit from "@/components/ExpressionSplit";
import ScheduleSection from "@/components/ScheduleSection";
import Ticker from "@/components/Ticker";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";
import TextLineupSection from "@/components/TextLineupSection";
import EditorialSignalsSection from "@/components/EditorialSignalsSection";
import EventFunnelStack from "@/components/EventFunnelStack";
import NewsletterSection from "@/components/NewsletterSection";
import EventCountdown from "@/components/EventCountdown";
import NightInNumbers from "@/components/NightInNumbers";
import WhatToExpect from "@/components/WhatToExpect";
import ConversionStrip from "@/components/ConversionStrip";
import { getExperienceEvent, getPrimaryTicketUrl } from "@/lib/siteExperience";

const CinematicBreak = lazy(() => import("@/components/CinematicBreak").catch(() => ({ default: () => <></> })));
const MixedMediaGallery = lazy(() => import("@/components/MixedMediaGallery"));
const SoundCloudSection = lazy(() => import("@/components/SoundCloudSection"));
const PastEventsSection = lazy(() => import("@/components/PastEventsSection"));
const InstagramFeed = lazy(() => import("@/components/InstagramFeed"));
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
        title="Chicago Music Nights, Series, and Archive | The Monolith Project"
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

        <SectionDivider id="series" number="01" label="The Series" />
        <ExpressionSplit />
        <WhatToExpect />

        <SectionDivider id="season" number="02" label="The Season" dark={false} />
        <ScheduleSection />
        <EventCountdown />

        {/* Gradient bridge: cream schedule → black rooms */}
        <div className="h-24 w-full bg-gradient-to-b from-[#EAEAEA] to-[#050505]" />

        <SectionDivider id="collective" number="03" label="The Collective" />
        <MovementSection />

        <ViewportLazy minHeightClassName="min-h-[60vh]">
          <Suspense fallback={null}>
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
           <VisitorContextPanel />
        </div>
        <div className="px-6 mb-24 md:mb-32">
          <div className="container mx-auto max-w-6xl">
            <ConversionStrip />
          </div>
        </div>

        <SectionDivider id="roster" number="04" label="The Roster" />
        <TextLineupSection />
        <NightInNumbers />

        <SectionDivider id="journal" number="05" label="Beyond The Night" />
        <EditorialSignalsSection />

        <SectionDivider id="archive" number="06" label="The Archive" />
        <ViewportLazy minHeightClassName="min-h-[520px]">
          <Suspense fallback={null}>
            <MixedMediaGallery />
          </Suspense>
        </ViewportLazy>

        <SectionDivider id="mixes" number="07" label="Mixes" />
        <ViewportLazy minHeightClassName="min-h-[420px]">
          <div className="bg-card">
            <Suspense fallback={null}>
              <SoundCloudSection />
            </Suspense>
          </div>
        </ViewportLazy>

        <SectionDivider id="community" number="08" label="Inner Circle" />
        {funnelEvent ? <EventFunnelStack eventId={funnelEvent.id} /> : null}

        <NewsletterSection source="homepage_bottom" />
        
        {/* Structural buffer for Footer / HUD clearance */}
        <div className="h-24 md:h-32" />

        <Ticker />
      </main>
    </div>
  );
}
