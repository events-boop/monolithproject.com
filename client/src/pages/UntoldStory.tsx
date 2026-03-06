import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import TicketTicker from "@/components/TicketTicker";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import EpisodeGallery from "@/components/EpisodeGallery";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { POSH_TICKET_URL } from "@/data/events";
import { untoldSeason1, untoldSeason2 } from "@/data/galleryData";
import { eventVisuals, untoldFaqs } from "@/components/untold-story/constants";

import UntoldHero from "@/components/untold-story/UntoldHero";
import UntoldContent from "@/components/untold-story/UntoldContent";
import UntoldContrast from "@/components/untold-story/UntoldContrast";
import EventFunnelStack from "@/components/EventFunnelStack";

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
    <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white bg-noise bg-untold-deep-solid">
      <SEO
        title="Untold Story"
        description="A late-night journey through Afro and melodic house. Immersive 360° sound in Chicago."
        image={eventVisuals.poster}
      />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <UntoldHero />
        <SeasonAnchorNav items={UNTOLD_ANCHORS} tone="nocturne" className="-mt-7 mb-5 relative z-30" />
        <UntoldContent />
        <UntoldContrast />

        {/* Dynamic Funnels for this Event */}
        <EventFunnelStack eventId="us-s3e2" />

        {/* Season Records */}
        <div id="untold-records" className="scroll-mt-44 relative z-20 container max-w-6xl mx-auto px-6 border-t border-white/10">
          <EpisodeGallery
            series="untold-story"
            season="Season I"
            episode="Chapter 01"
            title="The Blueprint"
            subtitle="Summer Mel • Avo"
            description="Late night. Immersive. The first chapter. A look back at the original flyers that set the tone on June 21st at Nisos Lounge."
            accentColor="#8B5CF6"
            images={[
              { src: "/images/untold-s1e1-summer.jpg", alt: "Summer Mel - Chapter 01", label: "SUMMER MEL" },
              { src: "/images/untold-s1e1-info.jpg", alt: "What is an Untold Story", label: "THE MANIFESTO" },
              { src: "/images/untold-s1e1-avo.jpg", alt: "Avo - Chapter 01", label: "AVO" },
              { src: "/images/untold-s1e1-chapter1.jpg", alt: "Chapter 1 Lineup", label: "CHAPTER 01" },
            ]}
          />

          {/* Links for Season 2 and 3 Galleries */}
          <div className="py-12 flex flex-col md:flex-row gap-6 border-t border-white/10">
            <div className="flex-1 p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8B5CF6] block mb-2">Season II</span>
                <h4 className="font-display text-2xl uppercase text-white mb-4">The Story Grows</h4>
                <p className="text-white/60 mb-6 font-mono text-xs uppercase tracking-widest line-clamp-2">360° sound. Deeper rooms. The records of 2025.</p>
                <Link href="/untold-story/season-2" asChild>
                  <a className="inline-flex items-center gap-2 font-mono text-xs uppercase text-white group-hover:text-[#8B5CF6] transition-colors">
                    View Archive <ArrowUpRight className="w-4 h-4" />
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex-1 p-8 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-[#8B5CF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8B5CF6] block mb-2">Season III</span>
                <h4 className="font-display text-2xl uppercase text-white mb-4">The Most Ambitious Chapter</h4>
                <p className="text-white/60 mb-6 font-mono text-xs uppercase tracking-widest line-clamp-2">Currently unfolding. Unforgettable artist showcases.</p>
                <Link href="/untold-story/season-3" asChild>
                  <a className="inline-flex items-center gap-2 font-mono text-xs uppercase text-white group-hover:text-[#8B5CF6] transition-colors">
                    View Archive <ArrowUpRight className="w-4 h-4" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section id="untold-tickets" className="scroll-mt-44 py-0 relative z-20">
          <TicketTicker />
        </section>
      </main>

      <SlimSubscribeStrip title="UNLOCK UNTOLD UPDATES" source="untold_story_strip" />
    </div>
  );
}
