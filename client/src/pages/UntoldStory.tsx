import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import TicketTicker from "@/components/TicketTicker";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import SEO from "@/components/SEO";
import { POSH_TICKET_URL } from "@/data/events";
import { untoldSeason1, untoldSeason2 } from "@/data/galleryData";
import UntoldHero from "@/components/untold-story/UntoldHero";
import UntoldContent from "@/components/untold-story/UntoldContent";
import UntoldContrast from "@/components/untold-story/UntoldContrast";
import { deepBg, eventVisuals, untoldFaqs } from "@/components/untold-story/constants";



const UNTOLD_ANCHORS = [
  { label: "Event", href: "#untold-event" },
  { label: "Contrast", href: "#untold-contrast" },
  { label: "Records", href: "#untold-records" },
  { label: "Tickets", href: "#untold-tickets" },
];

export default function UntoldStory() {
  useEffect(() => {
    const eventSchemaId = "schema-untold-event";
    const faqSchemaId = "schema-untold-faq";

    const origin = window.location.origin || "https://monolithproject.com";
    const pageUrl = `${origin}${window.location.pathname}`;

    const eventSchema = {
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: "JUANY BRAVO B2B DERON — Untold Story Season III Episode II",
      description:
        "A late-night journey through Afro and melodic house led by two of Chicago's finest selectors in an immersive 360 dancefloor experience.",
      startDate: "2026-03-06T19:00:00-06:00",
      endDate: "2026-03-07T02:00:00-06:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      image: [
        `${origin}${eventVisuals.poster}`,
        `${origin}${eventVisuals.deron}`,
        `${origin}${eventVisuals.juany}`,
      ],
      location: {
        "@type": "Place",
        name: "Alhambra Palace",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1240 W Randolph St",
          addressLocality: "Chicago",
          addressRegion: "IL",
          postalCode: "60607",
          addressCountry: "US",
        },
      },
      performer: [
        { "@type": "MusicGroup", name: "Juany Bravo" },
        { "@type": "MusicGroup", name: "Deron" },
        { "@type": "MusicGroup", name: "Hashtom" },
        { "@type": "MusicGroup", name: "Rose" },
        { "@type": "MusicGroup", name: "Avo" },
        { "@type": "MusicGroup", name: "Jerome b2b Kenbo" },
      ],
      organizer: {
        "@type": "Organization",
        name: "The Monolith Project",
        url: origin,
      },
      offers: {
        "@type": "Offer",
        url: POSH_TICKET_URL,
        availability: "https://schema.org/InStock",
        validFrom: "2026-02-01T00:00:00-06:00",
        priceCurrency: "USD",
        price: "45",
      },
      url: pageUrl,
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: untoldFaqs.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      })),
    };

    const upsertSchema = (id: string, payload: object) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      const script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      script.text = JSON.stringify(payload);
      document.head.appendChild(script);
    };

    upsertSchema(eventSchemaId, eventSchema);
    upsertSchema(faqSchemaId, faqSchema);

    return () => {
      document.getElementById(eventSchemaId)?.remove();
      document.getElementById(faqSchemaId)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white bg-noise" style={{ background: deepBg }}>
      <SEO
        title="Untold Story"
        description="A late-night journey through Afro and melodic house. Immersive 360° sound in Chicago."
        image={eventVisuals.poster}
      />
      <Navigation />
      <main id="main-content" tabIndex={-1}>

        <UntoldHero />
        <SeasonAnchorNav items={UNTOLD_ANCHORS} tone="nocturne" className="-mt-7 mb-5" />
        <UntoldContent />
        <UntoldContrast />

        {/* Season Records */}
        <div id="untold-records" className="scroll-mt-44">
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

        <section id="untold-tickets" className="scroll-mt-44 py-0">
          <TicketTicker />
        </section>
      </main>

      <SlimSubscribeStrip title="UNLOCK UNTOLD UPDATES" source="untold_story_strip" />
      <Footer />
    </div>
  );
}
