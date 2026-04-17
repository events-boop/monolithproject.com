import { ArrowUpRight } from "lucide-react";
import "@/styles/themes/untold.css";
import Navigation from "@/components/Navigation";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import EpisodeGallery from "@/components/EpisodeGallery";
import ArchiveSection from "@/components/ArchiveSection";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { eventVisuals, untoldFaqs } from "@/components/untold-story/constants";
import UntoldHero from "@/components/untold-story/UntoldHero";
import UntoldContent from "@/components/untold-story/UntoldContent";
import UntoldContrast from "@/components/untold-story/UntoldContrast";
import { buildFaqSchema, buildScheduledEventSchema } from "@/lib/schema";
import { getSeriesEvents, getEventWindowStatus } from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";

const UNTOLD_ANCHORS = [
  { label: "Event", href: "#untold-event" },
  { label: "Contrast", href: "#untold-contrast" },
  { label: "Records", href: "#untold-records" },
  { label: "Updates", href: "#untold-updates" },
];

export default function UntoldStory() {
  usePublicSiteDataVersion();
  const scheduledEvent = getSeriesEvents("untold-story")[0] ?? null;
  const showEventSchema =
    scheduledEvent && getEventWindowStatus(scheduledEvent) !== "past";

  const schemaData = [
    buildFaqSchema(untoldFaqs),
    ...(showEventSchema ? [buildScheduledEventSchema(scheduledEvent, "/story")] : [])
  ];

  return (
    <div className="min-h-screen text-white selection:bg-cyan-400/20 selection:text-white bg-noise bg-untold-deep-solid">
      <SEO
        title="Untold Story"
        description="The premier after-dark electronic music series in Chicago. Curated rooms, uncompromised sound, and a dedicated architectural standard for the late night."
        image={eventVisuals.poster}
        schemaData={schemaData}
      />
      <Navigation brand="untold-story" />

      <main id="main-content" tabIndex={-1}>
        <UntoldHero event={scheduledEvent} />
        <SeasonAnchorNav items={UNTOLD_ANCHORS} tone="nocturne" className="-mt-7 mb-5 relative z-30" />
        <UntoldContent event={scheduledEvent} />
        <UntoldContrast />

        {/* Episode Gallery — Season III Highlights */}
        <section className="relative z-20 py-24 px-6 border-t border-white/10">
          <div className="layout-default">
            <EpisodeGallery
              series="untold-story"
              season="Season III"
              episode="Episode II"
              title="THE RECORD"
              accentColor="#8B5CF6"
              images={[
                { src: "/images/archive/us-s3/JPQ_6000.jpg", alt: "Untold Story S3 Crowd", label: "The Room" },
                { src: "/images/archive/us-s3/JPQ_6044.jpg", alt: "Untold Story S3 Artist", label: "The Booth" },
                { src: "/images/archive/us-s3/JPQ_6321.jpg", alt: "Untold Story S3 Texture", label: "Texture" },
                { src: "/images/untold-story-juany-deron-v2.webp", alt: "Untold Story S3 Finale", label: "Finale" }
              ]}
            />
          </div>
        </section>

        {/* Season Records */}
        <span id="archive" className="block scroll-mt-32" aria-hidden="true" />
        <div id="untold-records" className="scroll-shell-target relative z-20 pt-8 border-t border-white/10">
           <ArchiveSection />
        </div>

        <section id="untold-updates" className="scroll-shell-target py-0 relative z-20">
          <SlimSubscribeStrip title="UNTOLD UPDATES" source="untold_story_strip" />
        </section>
      </main>
    </div>
  );
}
