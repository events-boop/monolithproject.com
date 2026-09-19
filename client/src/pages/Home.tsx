import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import HomeEventFeature from "@/components/HomeEventFeature";
import {
  HomeSeries,
  HomeRecap,
  HomeArtists,
  HomeCommunity,
} from "@/components/HomeDiscovery";
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
        <HomeEventFeature />
        <div id="season">
          <HomeUpcomingShows />
        </div>
        <HomeSeries />
        <HomeRecap />
        <HomeArtists />
        <HomeCommunity />
      </main>
    </div>
  );
}
