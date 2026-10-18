import { lazy, Suspense, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import {
  HomeSeries,
  HomeRecap,
  HomeCommunity,
} from "@/components/HomeDiscovery";
import ViewportLazy from "@/components/ViewportLazy";
const HomeArtists = lazy(() => import("@/components/HomeArtists"));
import HomeUpcomingShows from "@/components/HomeUpcomingShows";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import SEO from "@/components/SEO";
import { buildSitewideIdentitySchema } from "@/lib/schema";
import "@/styles/home.css";

export default function Home() {
  usePublicSiteDataVersion();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="monolith-home min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <SEO
        title="The Monolith Project | Chicago House Music Events"
        description="The Monolith Project produces Chicago house music events, Chasing Sun(Sets), Untold Story nights, and artist-led radio."
        absoluteTitle
        canonicalPath="/"
        schemaData={buildSitewideIdentitySchema()}
      />
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <div id="season">
          <HomeUpcomingShows />
        </div>
        <HomeSeries />
        <div id="showcase">
          <ViewportLazy
            minHeightClassName="min-h-[700px]"
            rootMargin="400px 0px"
          >
            <Suspense fallback={<div className="min-h-[700px]" />}>
              <HomeArtists />
            </Suspense>
          </ViewportLazy>
        </div>
        <HomeRecap />
        <HomeCommunity />
      </main>
    </div>
  );
}
