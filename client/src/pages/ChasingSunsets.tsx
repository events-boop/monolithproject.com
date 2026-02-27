import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import ChasingSunsetsDetails from "@/components/ChasingSunsetsDetails";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import EpisodeGallery from "@/components/EpisodeGallery";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import { Link } from "wouter";
import VideoHeroSlider, { Slide } from "@/components/VideoHeroSlider";
import SEO from "@/components/SEO";
import useScrollSunset from "@/hooks/useScrollSunset";
import ChasingSunsetsOptIn from "@/components/ChasingSunsetsOptIn";
import { useState } from "react";
import ResidentDJCard from "@/components/ResidentDJCard";
import MagneticButton from "@/components/MagneticButton";
import EventFunnelStack from "@/components/EventFunnelStack";

const CHASING_SUNSETS_SLIDES: Slide[] = [
  {
    type: "video",
    src: "/videos/hero-video-1.mp4",
    poster: "/images/hero-video-1-poster.jpg",
    caption: "THE MONOLITH PROJECT",
  },
  {
    type: "image",
    src: "/images/chasing-sunsets.jpg",
    alt: "Chasing Sun(Sets) Atmosphere",
    caption: "CHASING SUN(SETS) | GOLDEN HOUR",
  },
  {
    type: "image",
    src: "/images/autograf-recap.jpg",
    alt: "Autograf Live",
    credit: "TBA",
    caption: "AUTOGRAF | LIVE SET",
  },
];


const events = [
  {
    month: "MAR",
    day: "06",
    title: "DERON B2B JUANY BRAVO",
    location: "Alhambra Palace, Chicago",
    time: "9:00 PM - Late",
    status: "on-sale" as const,
  },
  {
    month: "MAR",
    day: "21",
    title: "AUTOGRAF",
    location: "Alhambra Palace, Chicago",
    time: "9:00 PM - Late",
    status: "on-sale" as const,
  },
];

const CHASING_ANCHORS = [
  { label: "Format", href: "#chasing-concept" },
  { label: "Records", href: "#chasing-records" },
  { label: "Upcoming", href: "#chasing-upcoming" },
  { label: "Submit", href: "#chasing-submit" },
  { label: "Network", href: "#chasing-cta" },
];

// Static dark — only for the hero video overlay (always needs contrast)
const HERO_DARK = "#2C1810";

export default function ChasingSunsets() {
  useScrollSunset();
  const [activeTab, setActiveTab] = useState<'live' | 'residents'>('live');
  const [faqOpen, setFaqOpen] = useState(false);

  const chasingFaqs = [
    ["Where are the events located?", "Our events take place at various outdoor and rooftop locations across Chicago. Keep an eye on the schedule for specific venues."],
    ["What time should I arrive?", "The magic happens during the golden hour. We highly recommend arriving early to experience the transition from sunset to sundown."],
    ["Are tickets sold at the door?", "We operate as a presale-only collective to ensure the best experience and crowd control. Door sales are extremely rare."],
    ["What's the dress code?", "Elevated, comfortable outdoor attire. Think rooftop chic. Dress for the weather and prepare to dance."]
  ];

  return (
    <div className="min-h-screen selection:text-white relative overflow-hidden bg-noise sunset-page">
      <ChasingSunsetsOptIn />
      <SEO
        title="Chasing Sun(Sets)"
        description="Golden hour. Good people. Great music. Rooftop shows and outdoor gatherings throughout Chicago."
        image="/images/chasing-sunsets.jpg"
      />
      <div className="pointer-events-none absolute inset-0 bg-chasing-glow-1" />
      <Navigation variant="dark" brand="chasing-sunsets" />
      <main id="main-content" tabIndex={-1}>

        {/* Hero — raw, warm, big type */}
        <section id="chasing-hero" className="relative min-h-screen flex flex-col justify-end pb-32 pt-48 px-6 overflow-hidden">
          {/* Full-bleed background slider */}
          <VideoHeroSlider slides={CHASING_SUNSETS_SLIDES} />

          {/* Overlay gradient for readability */}
          <div className="absolute inset-0 opacity-80 z-10 pointer-events-none bg-chasing-hero-overlay" />

          <div className="relative z-20 container max-w-6xl mx-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-auto"
            >
              <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-6 text-white/90">
                Series 01
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] uppercase mb-8 tracking-tight-display text-white"
              >
                <span className="bg-gradient-to-r from-[#C2703E] via-[#E8B86D] to-[#FBF5ED] bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(0,0,0,0.55)]">
                  CHASING SUN(SETS)
                </span>
              </motion.h1>
              <p className="max-w-lg text-lg leading-relaxed text-white/90">
                Golden hour. Good people. Great music. Rooftop shows and outdoor
                gatherings where the sun does half the work.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["Open Air Ritual", "Melodic + Afro House", "Sunset Community", "Rooftop Culture"].map((pill) => (
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

        {/* The Concept */}
        <section id="chasing-concept" className="scroll-mt-44 py-24 px-6 sunset-border-accent border-t">
          <div className="container max-w-6xl mx-auto">
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
                  Every Chasing Sun(Sets) show starts during golden hour. The music
                  builds as the light changes. By the time the sun is gone, the
                  energy is already there.
                </p>
                <p className="leading-relaxed sunset-text-70">
                  Melodic house, afro house, organic downtempo — sounds that match
                  the warmth. Rooftops, gardens, open-air spaces. No dark rooms,
                  no strobes. Just the sky and the sound.
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
          </div>
        </section>

        {/* NEW: Pitch / Details Section */}
        <div id="chasing-manifesto" className="scroll-mt-44">
          <ChasingSunsetsDetails />
        </div>

        {/* Season Records */}
        <div id="chasing-records" className="scroll-mt-44 container max-w-6xl mx-auto px-6 border-t sunset-border-accent">
          <EpisodeGallery
            series="chasing-sunsets"
            season="Season I"
            episode="Chapter 01"
            title="The First Sunset"
            subtitle="Amari • Sarat • Erik"
            description="The beginning. Rooftops, the skyline, and the golden hour. A look back at the flyers that started it all on August 9th, 2024 at The Penthouse."
            accentColor="#E8B86D"
            images={[
              { src: "/images/chasing-s1e1-amari.jpg", alt: "Amari - Chapter 01", label: "AMARI" },
              { src: "/images/chasing-s1e1-sarat.jpg", alt: "Sarat - Chapter 01", label: "SARAT" },
              { src: "/images/chasing-s1e1-erik.jpg", alt: "Erik - Chapter 01", label: "ERIK" },
              { src: "/images/chasing-s1e1-group.jpg", alt: "The Collective - Chapter 01", label: "THE TRINITY" },
            ]}
          />

          {/* Links for Season 2 and 3 Galleries */}
          <div className="py-12 flex flex-col md:flex-row gap-6 border-t sunset-border-accent">
            <div className="flex-1 p-8 border sunset-border-accent rounded-2xl glass hover:bg-white/5 transition-colors group">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E8B86D] block mb-2">Season II</span>
              <h4 className="font-display text-2xl uppercase text-white mb-4">Expanded Horizons</h4>
              <p className="text-white/60 mb-6 font-mono text-xs uppercase tracking-widest line-clamp-2">Bigger rooms, deeper grooves, more golden hours. 2025 Archives.</p>
              <Link href="/chasing-sunsets/season-2" asChild>
                <a className="inline-flex items-center gap-2 font-mono text-xs uppercase text-white group-hover:text-[#E8B86D] transition-colors">
                  View Archive <ArrowUpRight className="w-4 h-4" />
                </a>
              </Link>
            </div>
            <div className="flex-1 p-8 border sunset-border-accent rounded-2xl glass hover:bg-white/5 transition-colors group">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E8B86D] block mb-2">Season III</span>
              <h4 className="font-display text-2xl uppercase text-white mb-4">The Next Chapter</h4>
              <p className="text-white/60 mb-6 font-mono text-xs uppercase tracking-widest line-clamp-2">The season is coming. Golden hour, elevated. 2026 Archives.</p>
              <Link href="/chasing-sunsets/season-3" asChild>
                <a className="inline-flex items-center gap-2 font-mono text-xs uppercase text-white group-hover:text-[#E8B86D] transition-colors">
                  View Archive <ArrowUpRight className="w-4 h-4" />
                </a>
              </Link>
            </div>
          </div>
        </div>



        {/* Upcoming Events / Residents */}
        <section id="chasing-upcoming" className="scroll-mt-44 py-24 px-6 sunset-warm-section sunset-border-accent border-t">
          <div className="container max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 gap-6 sunset-border-accent border-b">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('live')}
                  className={`font-display text-4xl md:text-5xl transition-colors sunset-text ${activeTab === 'live' ? '' : 'opacity-40 hover:opacity-70'}`}
                >
                  LIVE EVENTS
                </button>
                <button
                  onClick={() => setActiveTab('residents')}
                  className={`font-display text-4xl md:text-5xl transition-colors sunset-text ${activeTab === 'residents' ? '' : 'opacity-40 hover:opacity-70'}`}
                >
                  RESIDENT DJS
                </button>
              </div>
              <span className="font-mono text-xs tracking-widest sunset-accent">SEASON 2026</span>
            </div>

            {activeTab === 'live' ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.title}
                    className="group p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all rounded-2xl backdrop-blur-sm border sunset-border-accent-20 sunset-glass-card-solid"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center justify-center w-16 h-16 border sunset-border-accent-30 bg-[color-mix(in_srgb,var(--sunset-accent)_3%,transparent)]">
                        <span className="text-xs font-bold uppercase sunset-accent">{event.month}</span>
                        <span className="text-lg font-display sunset-text">{event.day}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-display tracking-wide mb-1 group-hover:transition-colors sunset-text">
                          {event.title}
                        </h3>
                        <div className="flex gap-4 text-sm font-mono uppercase sunset-text-60">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {event.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href="/tickets" asChild>
                      <a
                        className="px-8 py-3 font-bold tracking-widest text-xs uppercase hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer text-white rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50 sensory-ticket-btn sunset-gradient-btn"
                      >
                        GET TICKETS <ArrowUpRight size={14} />
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <ResidentDJCard />
            )}
          </div>
        </section>

        {/* Submit DJ Set */}
        <section id="chasing-submit" className="scroll-mt-44 py-24 px-6 sunset-border-accent border-t">
          <div className="container max-w-4xl mx-auto text-center">
            <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4 sunset-accent">
              For The Selectors
            </span>
            <h2 className="font-display text-5xl md:text-6xl mb-8 sunset-text">
              SUBMIT YOUR SET
            </h2>
            <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto sunset-text-80">
              Chasing Sun(Sets) is about the perfect vibe for the golden hour.
              Melodic, Organic, Afro House. If you have the sound, we have the sunset.
            </p>
            <MagneticButton strength={0.4}>
              <a
                href="mailto:music@monolithproject.com?subject=Chasing Sun(Sets) Submission"
                className="inline-flex items-center gap-2 px-10 py-4 font-display text-lg tracking-widest uppercase hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] transition-all duration-300 cursor-pointer text-white rounded-full sunset-gradient-btn group"
              >
                SUBMIT A MIX <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </MagneticButton>
          </div>
        </section>

        {/* Chasing Sun(Sets) FAQ */}
        <section id="chasing-faq" className="scroll-mt-44 py-24 px-6 sunset-border-accent border-t">
          <div className="container max-w-4xl mx-auto">
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
          </div>
        </section>

        {/* Inner Circle Pre-registration Funnel */}
        <div className="relative z-10 w-full overflow-hidden bg-black/40 backdrop-blur-3xl border-y border-[#E8B86D]/10">
          <EventFunnelStack eventId="css-002" />
        </div>

        {/* CTA */}
        <section id="chasing-cta" className="scroll-mt-44 py-32 px-6 relative sunset-border-accent border-t">
          <div className="pointer-events-none absolute inset-0 bg-chasing-glow-2" />
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="font-display text-5xl md:text-7xl mb-6 sunset-text">
              CHASE THE LIGHT
            </h2>
            <p className="text-lg max-w-xl mx-auto mb-12 sunset-text-70">
              Sign up for the newsletter to get ticket access before anyone else.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton strength={0.3}>
                <Link href="/story" asChild>
                  <a
                    className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:bg-[color-mix(in_srgb,var(--sunset-text)_5%,transparent)] transition-all duration-300 cursor-pointer rounded-full inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C1810]/20 border sunset-text border-[color-mix(in_srgb,var(--sunset-text)_19%,transparent)] group"
                  >
                    UNTOLD STORY <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.3}>
                <Link href="/" asChild>
                  <a
                    className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(232,184,109,0.3)] transition-all duration-300 cursor-pointer text-white rounded-full inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50 sunset-gradient-btn group"
                  >
                    BACK TO MONOLITH <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </Link>
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>

      <SlimSubscribeStrip title="SUBSCRIBE FOR SUN(SETS)" source="chasing_sunsets_strip" dark={false} />
      <Footer />
    </div>
  );
}
