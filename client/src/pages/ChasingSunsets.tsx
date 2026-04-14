import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import ChasingSunsetsDetails from "@/components/ChasingSunsetsDetails";
import ChasingSunsetsTicketing from "@/components/ChasingSunsetsTicketing";
import EpisodeGallery from "@/components/EpisodeGallery";
import ArchiveSection from "@/components/ArchiveSection";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import { Link } from "wouter";
import VideoHeroSlider, { Slide } from "@/components/VideoHeroSlider";
import SEO from "@/components/SEO";
import useScrollSunset from "@/hooks/useScrollSunset";
import { useState } from "react";
import FixedTicketBadge from "@/components/FixedTicketBadge";
import Footer from "@/components/Footer";
import ConversionStrip from "@/components/ConversionStrip";
import ResidentDJCard from "@/components/ResidentDJCard";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import EventFunnelStack from "@/components/EventFunnelStack";
import ConversionCTA from "@/components/ConversionCTA";
import EventCountdown from "@/components/EventCountdown";
import Section from "@/components/layout/Section";
import { getResponsiveImage } from "@/lib/responsiveImages";
import { CTA_LABELS } from "@/lib/cta";
import {
  getEventVenueLabel,
  getPrimaryTicketUrl,
  getSeriesEvents,
  isTicketOnSale,
} from "@/lib/siteExperience";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import SplitText from "@/components/ui/SplitText";

const chasingPosterImage = getResponsiveImage("chasingSunsets");
const chasingHeroImage = getResponsiveImage("chasingSunsets");

const CHASING_SUNSETS_SLIDES: Slide[] = [
  {
    type: "video",
    src: "/videos/hero-video-1.mp4",
    poster: chasingPosterImage.src,
    posterSources: chasingPosterImage.sources,
    posterSizes: chasingPosterImage.sizes,
    caption: "THE MONOLITH PROJECT",
  },
  {
    type: "image",
    src: chasingHeroImage.src,
    sources: chasingHeroImage.sources,
    sizes: chasingHeroImage.sizes,
    alt: "Chasing Sun(Sets) Atmosphere",
    caption: "CHASING SUN(SETS) | GOLDEN HOUR",
  },
  {
    type: "image",
    src: "/images/chasing-sunsets-1.jpg",
    alt: "Rooftop Crowd at Sunset",
    caption: "CHASING SUN(SETS) | THE CROWD",
  },
];


const CHASING_ANCHORS = [
  { label: "Format", href: "#chasing-concept" },
  { label: "Records", href: "#chasing-records" },
  { label: "Upcoming", href: "#chasing-upcoming" },
  { label: "Submit", href: "#chasing-submit" },
  { label: "Updates", href: "#chasing-funnel" },
];

export default function ChasingSunsets() {
  usePublicSiteDataVersion();
  useScrollSunset();
  const [activeTab, setActiveTab] = useState<'live' | 'residents'>('live');
  const [faqOpen, setFaqOpen] = useState(false);
  const chasingEvents = getSeriesEvents("chasing-sunsets");
  const chasingFunnelEvent = chasingEvents.find((event) => event.activeFunnels?.length);
  const liveChasingEvent = chasingEvents.find((event) => isTicketOnSale(event));
  const featuredChasingEvent =
    liveChasingEvent ??
    chasingEvents.find((event) => event.activeFunnels?.length) ??
    chasingEvents[0];

  const chasingFaqs = [
    ["Where are the events located?", "Our events take place at various outdoor and rooftop locations across Chicago. Keep an eye on the schedule for specific venues."],
    ["What time should I arrive?", "The magic happens during the golden hour. We highly recommend arriving early to experience the transition from sunset to sundown."],
    ["Are tickets sold at the door?", "We usually run as a presale-first series so we can manage capacity and keep the room comfortable. Door sales are rare."],
    ["What's the dress code?", "Elevated, comfortable outdoor attire. Think rooftop chic. Dress for the weather and prepare to dance."]
  ];

  return (
    <div className="min-h-screen selection:text-white relative bg-noise sunset-page">
      <SEO
        title="Chasing Sun(Sets)"
        description="The premier open-air electronic music series in Chicago. Curated rooms, panoramic views, and uncompromised sound."
        image="/images/chasing-sunsets-premium.webp"
      />
      <div className="pointer-events-none absolute inset-0 bg-chasing-glow-1 overflow-hidden" />
      <Navigation variant="dark" brand="chasing-sunsets" />
      <main id="main-content" tabIndex={-1}>

        {/* Hero — raw, warm, big type */}
        <section id="chasing-hero" className="relative screen-shell-stable flex flex-col justify-center sm:justify-end pb-16 sm:pb-32 pt-24 sm:pt-0 hero-shell-start px-6 overflow-hidden min-h-[100dvh]">
          {/* Full-bleed background slider */}
          <VideoHeroSlider slides={CHASING_SUNSETS_SLIDES} />

          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 opacity-80 z-10 pointer-events-none bg-chasing-hero-overlay" />

          <div className="relative z-20 container layout-default pointer-events-none mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-auto"
            >
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase block mb-4 sm:mb-6 text-white/90">
                {featuredChasingEvent ? `${featuredChasingEvent.episode}` : "Series 01"}
              </span>
              <h1 className="font-display flex flex-col text-[clamp(2.5rem,8vw,8rem)] leading-[0.85] uppercase mb-6 sm:mb-8 tracking-tight-display text-white drop-shadow-[0_14px_50px_rgba(0,0,0,0.55)]">
                {featuredChasingEvent ? (
                  <SplitText text={featuredChasingEvent.headline || featuredChasingEvent.title} className="bg-gradient-to-r from-[#C2703E] via-[#E8B86D] to-[#FBF5ED] bg-clip-text text-transparent" />
                ) : (
                  <>
                    <SplitText text="CHASING" className="bg-gradient-to-r from-[#C2703E] via-[#E8B86D] to-[#FBF5ED] bg-clip-text text-transparent" initialDelay={0.10} />
                    <SplitText text="SUN(SETS)" className="bg-gradient-to-r from-[#C2703E] via-[#E8B86D] to-[#FBF5ED] bg-clip-text text-transparent" initialDelay={0.25} />
                  </>
                )}
              </h1>
              <BrandTranslatorLabel className="mb-4 sm:mb-6" tone="warm">
                An Open-Air Monolith Series
              </BrandTranslatorLabel>
              
              <div className="max-w-xl">
                 <p className="text-base sm:text-lg leading-relaxed text-white/90 mb-4">
                   Open-air sunset and night sessions built for movement, warmth, and return.
                 </p>
                 {featuredChasingEvent && (
                   <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#E8B86D] mb-6 sm:mb-8">
                      <span>{featuredChasingEvent.date}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{getEventVenueLabel(featuredChasingEvent)}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{featuredChasingEvent.lineup || "Lineup TBA"}</span>
                   </div>
                 )}
              </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 mt-8">
                  <ConversionCTA
                    event={featuredChasingEvent}
                    size="lg"
                    showUrgency={true}
                  />
                  
                  <MagneticButton strength={0.22}>
                    <a href="#chasing-records" className="cta-ghost flex items-center justify-center px-10 py-5">
                        View Records
                        <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                  </MagneticButton>
                </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Open Air", "Melodic + Afro House", "Good Crowd", "Rooftop Series"].map((pill) => (
                  <span
                    key={pill}
                    className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-[0.16em] uppercase border border-white/30 bg-black/20 text-white/90"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <SeasonAnchorNav items={CHASING_ANCHORS} tone="warm" className="-mt-7 mb-5" />
        {featuredChasingEvent ? <EventCountdown eventId={featuredChasingEvent.id} /> : null}

        {/* The Concept */}
        <Section id="chasing-concept" scrollAnchor borderTop="sunset-border-accent border-t">
          <div className="grid md:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4 sunset-accent">
                  The Format
                </span>
                <h2 className="font-display text-5xl md:text-6xl mb-6 sunset-text">
                  SUNSET TO
                  <br />
                  SUNDOWN
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-6 rounded-2xl border p-6 md:p-8 backdrop-blur-sm sunset-border-accent sunset-glass-card"
              >
                <p className="text-lg leading-relaxed sunset-text-80">
                  Chicago's premier open-air ecosystem. Every show starts during golden hour. The music
                  builds as the environment shifts. By the time the sun is gone, the uncompromised sound is already there.
                </p>
                <p className="leading-relaxed sunset-text-70">
                  Melodic house, afro house, organic downtempo — sounds that match
                  the warmth. Rooftops, gardens, open-air spaces. No strobes, no dark rooms — just world-class electronic music in spaces designed for it.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {["Rooftop", "Golden Hour", "Melodic House", "Afro House", "Open Air"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 text-xs font-mono tracking-widest uppercase border sunset-accent-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
        </Section>

        {/* NEW: Pitch / Details Section */}
        <div id="chasing-manifesto" className="scroll-shell-target">
          <ChasingSunsetsDetails />
        </div>

        {/* NEW: Ticketing / Season Pass Release Structure */}
        <div id="chasing-tickets" className="scroll-shell-target">
          <ChasingSunsetsTicketing />
        </div>

        {/* Episode Gallery — Season III Highlights */}
        <section className="relative z-20 py-24 px-6 border-t sunset-border-accent">
          <div className="layout-default">
            <EpisodeGallery
              series="chasing-sunsets"
              season="Season III"
              episode="Episode III"
              title="THE SHORE"
              accentColor="#E8B86D"
              images={[
                { src: "/images/archive/chasing-sunsets/css-s3-1.jpg", alt: "Chasing SunSets Shoreline", label: "Open Air" },
                { src: "/images/archive/chasing-sunsets/css-s3-4.jpg", alt: "Chasing SunSets Booth", label: "The Booth" },
                { src: "/images/archive/chasing-sunsets/css-s3-7.jpg", alt: "Chasing SunSets Vibe", label: "Atmosphere" },
                { src: "/images/archive/chasing-sunsets/css-s3-9.jpg", alt: "Chasing SunSets Finale", label: "Finale" }
              ]}
            />
          </div>
        </section>

        {/* Season Records */}
        <Section as="div" id="chasing-records" scrollAnchor spacing="none" borderTop="border-t sunset-border-accent">
           <ArchiveSection />
        </Section>

        {/* Upcoming Events / Residents */}
        <Section id="chasing-upcoming" scrollAnchor borderTop="sunset-border-accent border-t" bg="sunset-warm-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 gap-6 sunset-border-accent border-b">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('live')}
                  className={`font-display text-4xl md:text-5xl transition-colors sunset-text ${activeTab === 'live' ? '' : 'opacity-40 hover:opacity-70'}`}
                  data-cursor-text="LIVE"
                >
                  LIVE EVENTS
                </button>
                <button
                  onClick={() => setActiveTab('residents')}
                  className={`font-display text-4xl md:text-5xl transition-colors sunset-text ${activeTab === 'residents' ? '' : 'opacity-40 hover:opacity-70'}`}
                  data-cursor-text="DJS"
                >
                  RESIDENT DJS
                </button>
              </div>
              <span className="font-mono text-xs tracking-widest sunset-accent">SEASON 2026</span>
            </div>

            {activeTab === 'live' ? (
              <div className="space-y-4">
                {chasingEvents.length > 0 ? (
                  chasingEvents.map((event) => {
                    const [month, day] = event.date.replace(",", "").split(" ");
                    const eventLabel = event.headline || `${event.title} · ${event.episode}`;

                    return (
                      <div
                        key={event.id}
                        className="group p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all rounded-2xl backdrop-blur-sm border sunset-border-accent-20 sunset-glass-card-solid"
                      >
                        <div className="flex items-start gap-6">
                          <div className="flex flex-col items-center justify-center w-16 h-16 border sunset-border-accent-30 bg-[color-mix(in_srgb,var(--sunset-accent)_3%,transparent)]">
                            <span className="text-xs font-bold uppercase sunset-accent">{month.substring(0, 3).toUpperCase()}</span>
                            <span className="text-lg font-display sunset-text">{day}</span>
                          </div>
                          <div>
                            <p className="mb-2 font-mono text-[10px] tracking-[0.24em] uppercase sunset-accent">
                              {event.episode}
                            </p>
                            <h3 className="text-2xl font-display tracking-wide mb-1 group-hover:transition-colors sunset-text">
                              {eventLabel}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm font-mono uppercase sunset-text-60">
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {getEventVenueLabel(event)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={12} /> {event.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isTicketOnSale(event) ? (
                          <a
                            href={getPrimaryTicketUrl(event)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3.5 font-black tracking-[0.18em] text-[13px] sm:text-sm uppercase hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer text-white rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50 sensory-ticket-btn sunset-gradient-btn"
                          >
                            {CTA_LABELS.tickets} <ArrowUpRight size={14} />
                          </a>
                        ) : (
                          <Link href="/newsletter" asChild>
                            <a
                              className="px-8 py-3 font-bold tracking-widest text-xs uppercase transition-colors flex items-center gap-2 cursor-pointer rounded-full border border-[#E8B86D]/35 text-[#E8B86D] hover:bg-[#E8B86D]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50"
                            >
                              {CTA_LABELS.innerCircle} <ArrowUpRight size={14} />
                            </a>
                          </Link>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border p-10 text-center sunset-border-accent-20 sunset-glass-card-solid">
                    <p className="mb-3 font-mono text-[10px] tracking-[0.3em] uppercase sunset-accent">
                      Season 2026
                    </p>
                    <h3 className="mb-4 font-display text-3xl sunset-text">Season Dates Incoming</h3>
                    <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed sunset-text-70">
                      The next open-air dates are being finalized. Join the newsletter to hear about them before the public release.
                    </p>
                    <Link href="/newsletter" asChild>
                      <a className="inline-flex items-center gap-2 rounded-full border border-[#E8B86D]/35 px-8 py-3 font-bold tracking-widest text-xs uppercase text-[#E8B86D] transition-colors hover:bg-[#E8B86D]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50">
                        {CTA_LABELS.innerCircle} <ArrowUpRight size={14} />
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <ResidentDJCard />
            )}
        </Section>

        {/* Submit DJ Set */}
        <Section id="chasing-submit" width="narrow" scrollAnchor borderTop="sunset-border-accent border-t" containerClassName="text-center">
            <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4 sunset-accent">
              For The Selectors
            </span>
            <h2 className="font-display text-5xl md:text-6xl mb-8 sunset-text">
              SUBMIT YOUR SET
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto sunset-text-80">
              Chasing Sun(Sets) is built for golden-hour pacing. If your mix fits melodic, organic, or afro house in an open-air setting, send it through.
            </p>
            <MagneticButton strength={0.4}>
              <a
                href="mailto:music@monolithproject.com?subject=Chasing Sun(Sets) Submission"
                className="inline-flex items-center gap-2 px-10 py-4 font-display text-lg tracking-widest uppercase hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] transition-all duration-300 cursor-pointer text-white rounded-full sunset-gradient-btn group"
              >
                SUBMIT A MIX <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </MagneticButton>
        </Section>

        {/* Chasing Sun(Sets) FAQ */}
        <Section id="chasing-faq" width="narrow" scrollAnchor borderTop="sunset-border-accent border-t">
            <button
              onClick={() => setFaqOpen(!faqOpen)}
              className="w-full flex items-center justify-between p-6 md:p-8 rounded-2xl bg-white text-[#0B0C10] hover:bg-[#FDF6E3] transition-all duration-300 font-display text-xl md:text-2xl uppercase tracking-wide group shadow-[0_0_30px_rgba(232,184,109,0.15)] hover:shadow-[0_0_50px_rgba(232,184,109,0.3)]"
            >
              <span>Frequently Asked Questions</span>
              <span className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <div className={`relative w-4 h-4 transition-transform duration-500 origin-center ${faqOpen ? "rotate-180" : "rotate-0"}`}>
                  <span className={`absolute top-1/2 left-0 w-4 h-[2px] bg-[#C2703E] -translate-y-1/2 transition-transform duration-500`} />
                  <span className={`absolute top-0 left-1/2 w-[2px] h-4 bg-[#C2703E] -translate-x-1/2 transition-transform duration-500 ${faqOpen ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
                </div>
              </span>
            </button>

            <AnimatePresence>
              {faqOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 space-y-4">
                    {chasingFaqs.map(([q, a], idx) => (
                      <motion.details
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (idx * 0.05), duration: 0.4 }}
                        key={q}
                        className="border px-6 py-5 rounded-xl border-[#E8B86D]/20 bg-black/20 backdrop-blur-sm group cursor-pointer"
                      >
                        <summary className="text-white font-medium list-none flex items-center justify-between outline-none">
                          <span className="pr-4">{q}</span>
                          <span className="text-[#E8B86D] group-open:rotate-45 transition-transform duration-300 flex-shrink-0">
                            <span className="block w-3 h-[2px] bg-current relative">
                              <span className="block w-[2px] h-3 bg-current absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-open:opacity-0 transition-opacity" />
                            </span>
                          </span>
                        </summary>
                        <p className="text-white/70 mt-4 text-sm leading-relaxed border-t border-white/10 pt-4">{a}</p>
                      </motion.details>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </Section>

        {/* Chasing Sun(Sets) updates funnel */}
        {chasingFunnelEvent ? (
          <div
            id="chasing-funnel"
            className="scroll-shell-target relative z-10 w-full overflow-hidden bg-black/40 backdrop-blur-3xl border-y border-[#E8B86D]/10 mb-20 md:mb-24"
          >
            <EventFunnelStack eventId={chasingFunnelEvent.id} />
          </div>
        ) : null}

      </main>
      <ConversionStrip event={chasingFunnelEvent || undefined} />
      <FixedTicketBadge />
    </div>
  );
}
