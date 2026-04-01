import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import TicketTicker from "@/components/TicketTicker";
import EpisodeGallery from "@/components/EpisodeGallery";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { eventVisuals, untoldFaqs } from "@/components/untold-story/constants";
import UntoldHero from "@/components/untold-story/UntoldHero";
import UntoldContent from "@/components/untold-story/UntoldContent";
import UntoldContrast from "@/components/untold-story/UntoldContrast";
import EventFunnelStack from "@/components/EventFunnelStack";
import JsonLd from "@/components/JsonLd";
import { buildFaqSchema, buildScheduledEventSchema } from "@/lib/schema";
import { getEventById, getEventWindowStatus } from "@/lib/siteExperience";

const UNTOLD_ANCHORS = [
  { label: "Event", href: "#untold-event" },
  { label: "Contrast", href: "#untold-contrast" },
  { label: "Records", href: "#untold-records" },
  { label: "Tickets", href: "#untold-tickets" },
];

export default function UntoldStory() {
  const scheduledEvent = getEventById("us-s3e3");
  const showEventSchema =
    scheduledEvent && getEventWindowStatus(scheduledEvent) !== "past";

  return (
    <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white bg-noise bg-untold-deep-solid">
      <SEO
        title="Untold Story"
        description="A late-night journey through Afro and melodic house. Immersive 360° sound in Chicago."
        image={eventVisuals.poster}
      />
      {showEventSchema ? (
        <JsonLd
          id="schema-untold-event"
          data={buildScheduledEventSchema(scheduledEvent, "/story")}
        />
      ) : null}
      <JsonLd id="schema-untold-faq" data={buildFaqSchema(untoldFaqs)} />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <UntoldHero event={scheduledEvent} />
        <SeasonAnchorNav items={UNTOLD_ANCHORS} tone="nocturne" className="-mt-7 mb-5 relative z-30" />
        <UntoldContent event={scheduledEvent} />
        <UntoldContrast />

        {/* Dynamic Funnels for this Event */}
        <EventFunnelStack eventId="us-may16" />

        {/* Season Records */}
        <div id="untold-records" className="scroll-shell-target relative z-20 container max-w-6xl mx-auto px-6 border-t border-white/10">
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

        <section id="untold-tickets" className="scroll-shell-target py-0 relative z-20">
          <TicketTicker />
        </section>
      </main>

      <SlimSubscribeStrip title="UNLOCK UNTOLD UPDATES" source="untold_story_strip" />
    </div>
  );
}
