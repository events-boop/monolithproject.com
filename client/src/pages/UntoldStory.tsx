import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import TicketTicker from "@/components/TicketTicker";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import SEO from "@/components/SEO";
import { untoldSeason1, untoldSeason2 } from "@/data/galleryData";
import { deepBg, eventVisuals, untoldFaqs } from "@/components/untold-story/constants";
import JsonLd from "@/components/JsonLd";
import { buildFaqSchema } from "@/lib/schema";
import EntityBoostStrip from "@/components/EntityBoostStrip";

import UntoldHero from "@/components/untold-story/UntoldHero";
import UntoldContent from "@/components/untold-story/UntoldContent";
import UntoldContrast from "@/components/untold-story/UntoldContrast";

const UNTOLD_ANCHORS = [
  { label: "Event", href: "#untold-event" },
  { label: "Contrast", href: "#untold-contrast" },
  { label: "Records", href: "#untold-records" },
  { label: "Tickets", href: "#untold-tickets" },
];

export default function UntoldStory() {
  return (
    <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white bg-noise" style={{ background: deepBg }}>
      <SEO
        title="Untold Story"
        description="A late-night journey through Afro and melodic house. Immersive 360° sound in Chicago."
        image={eventVisuals.poster}
        canonicalPath="/story"
      />
      <JsonLd id="schema-untold-faq" data={buildFaqSchema(untoldFaqs)} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <UntoldHero />
        <SeasonAnchorNav items={UNTOLD_ANCHORS} tone="nocturne" className="-mt-7 mb-5 relative z-30" />
        <EntityBoostStrip tone="nocturne" className="mb-8" contextLabel="Untold Story Entity Links" />
        <UntoldContent />
        <UntoldContrast />

        {/* Season Records */}
        <div id="untold-records" className="scroll-mt-44 relative z-20">
          <MixedMediaGallery
            title="Season I"
            subtitle="2025 Archives"
            description="The seeds were sown. Deep beats and deeper connections."
            media={untoldSeason1}
            className="bg-card border-t border-border/50"
          />
          <MixedMediaGallery
            title="Season II"
            subtitle="2026 Archives"
            description="The story unfolds. Higher energy, wider spaces."
            media={untoldSeason2}
            className="bg-card border-t border-border/50"
          />
        </div>

        <section id="untold-tickets" className="scroll-mt-44 py-0 relative z-20">
          <TicketTicker />
        </section>
      </main>

      <SlimSubscribeStrip title="UNLOCK UNTOLD UPDATES" source="untold_story_strip" />
      <Footer />
    </div>
  );
}
