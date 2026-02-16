import { lazy, Suspense, useEffect } from "react";
import { POSH_TICKET_URL } from "@/data/events";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MovementSection from "@/components/MovementSection";
import ChaptersSection from "@/components/ChaptersSection";
import ScheduleSection from "@/components/ScheduleSection";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";

const CinematicBreak = lazy(() => import("@/components/CinematicBreak").catch(() => ({ default: () => <></> })));
const SoundCloudSection = lazy(() => import("@/components/SoundCloudSection"));
const PastEventsSection = lazy(() => import("@/components/PastEventsSection"));
const ConnectSection = lazy(() => import("@/components/ConnectSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const NewsletterSection = lazy(() => import("@/components/NewsletterSection"));
import SEO from "@/components/SEO";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <SEO
        title="Home"
        description="The Monolith Project is a Chicago-based events collective building on music, community, and showing up for each other."
      />
      <Navigation />
      <FixedTicketBadge />

      <main id="main-content" tabIndex={-1}>
        {/* Hero — countdown + video + CTAs */}
        <HeroSection />

        {/* 01 — The Movement */}
        <SectionDivider number="01" label="The Collective" />
        <MovementSection />

        {/* 02 — Two Series */}
        <SectionDivider number="02" label="The Events" />
        <ChaptersSection />

        {/* 03 — Artists - Swapped for Text Lineup Cloud */}
        <SectionDivider number="03" label="The Roster" />
        <TextLineupSection />

        {/* 04 — Gallery */}
        <SectionDivider number="04" label="Archives" />
        <MixedMediaGallery />

        {/* 04 — Gallery */}
        <SectionDivider number="04" label="Archives" />
        <MixedMediaGallery />

        {/* Cinematic break — full-bleed parallax with pull quote */}
        <ViewportLazy minHeightClassName="min-h-[60vh]">
          <Suspense fallback={null}>
            <CinematicBreak
              image="/images/untold-story-juany-deron-v2.jpg"
              videoSrc="/videos/hero-video-short.mp4"
              quote="We believe music carries emotion. We believe gathering should feel shared. We believe in rhythm, story, and togetherness."
              attribution="The Monolith Project"
              ctaLabel="Get Tickets"
              ctaUrl={POSH_TICKET_URL}
              ctaExternal
            />
          </Suspense>
        </ViewportLazy>

        {/* 05 — Schedule */}
        <SectionDivider number="05" label="Season 01" />
        <ScheduleSection />

        {/* 06 — Listen */}
        <SectionDivider number="06" label="Mixes" />
        <ViewportLazy minHeightClassName="min-h-[420px]">
          <div className="bg-card">
            <Suspense fallback={null}>
              <SoundCloudSection />
            </Suspense>
          </div>
        </ViewportLazy>

        {/* 07 — Past Events */}
        <SectionDivider number="07" label="Recaps" />
        <ViewportLazy minHeightClassName="min-h-[420px]">
          <Suspense fallback={null}>
            <PastEventsSection />
          </Suspense>
        </ViewportLazy>



        {/* 08 — Get Involved */}
        <SectionDivider number="08" label="Join Us" />
        <ViewportLazy minHeightClassName="min-h-[360px]">
          <Suspense fallback={null}>
            <ConnectSection />
          </Suspense>
        </ViewportLazy>

        {/* 09 — FAQ */}
        <SectionDivider number="09" label="FAQ" />
        <ViewportLazy minHeightClassName="min-h-[320px]">
          <Suspense fallback={null}>
            <FAQSection />
          </Suspense>
        </ViewportLazy>

        {/* Newsletter */}
        <ViewportLazy minHeightClassName="min-h-[320px]">
          <Suspense fallback={null}>
            <NewsletterSection />
          </Suspense>
        </ViewportLazy>

        {/* Tickets banner */}
        <Ticker />

        {/* Gradient bridge into footer */}
        <div className="relative h-24 bg-background overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 atmo-bridge" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
