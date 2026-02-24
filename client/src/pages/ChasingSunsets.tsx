import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import ChasingSunsetsDetails from "@/components/ChasingSunsetsDetails";
import MixedMediaGallery from "@/components/MixedMediaGallery";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import { chasingSeason1, chasingSeason2 } from "@/data/galleryData";
import { Link } from "wouter";
import VideoHeroSlider, { Slide } from "@/components/VideoHeroSlider";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";
import BrandMotifDivider from "@/components/BrandMotifDivider";
import FloatingFactsChip from "@/components/FloatingFactsChip";

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
    month: "AUG",
    day: "22",
    dateLabel: "August 22, 2026",
    title: "THE FIRST MONOLITH",
    venue: "Venue TBA",
    location: "Chicago, IL",
    time: "4:00 PM - Late",
    status: "coming-soon" as const,
  },
];

const CHASING_ANCHORS = [
  { label: "Format", href: "#chasing-concept" },
  { label: "July Recap", href: "#chasing-july-2025-recap" },
  { label: "Records", href: "#chasing-records" },
  { label: "Upcoming", href: "#chasing-upcoming" },
  { label: "Submit", href: "#chasing-submit" },
  { label: "Network", href: "#chasing-cta" },
];

// Chasing Sunsets palette — Auburn + Warm Gold
const auburn = "#C2703E";
const warmGold = "#E8B86D";
const cream = "#FBF5ED";
const deepWarm = "#2C1810";
const JULY_2025_RECAP_URL = "https://www.youtube.com/watch?v=9R6XH7JZlJI";
const JULY_2025_RECAP_EMBED_URL = "https://www.youtube-nocookie.com/embed/9R6XH7JZlJI";
const sectionTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: sectionTransition,
};

export default function ChasingSunsets() {
  const featuredEvent = events[0];

  return (
    <div className="min-h-screen selection:text-white relative overflow-hidden bg-noise" style={{ background: cream, color: deepWarm }}>
      <SEO
        title="Chasing Sun(Sets) Chicago | Sunset House Music Series"
        description="Official Chasing Sun(Sets) page for Chicago sunset house music events, lineup updates, the July 2025 recap video, and ticket links."
        image="/images/chasing-sunsets.jpg"
        canonicalPath="/chasing-sunsets"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(232,184,109,0.25),transparent_34%),radial-gradient(circle_at_84%_18%,rgba(194,112,62,0.2),transparent_32%),radial-gradient(circle_at_75%_84%,rgba(139,92,246,0.14),transparent_36%)]" />
      <Navigation variant="dark" brand="chasing-sunsets" />
      <main id="main-content" tabIndex={-1}>

      {/* Hero — raw, warm, big type */}
      <section id="chasing-hero" className="relative min-h-screen flex flex-col justify-end pb-32 pt-48 px-6 overflow-hidden">
        {/* Full-bleed background slider */}
        <VideoHeroSlider slides={CHASING_SUNSETS_SLIDES} />

        {/* Overlay gradient for readability */}
        <div
          className="absolute inset-0 opacity-80 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${deepWarm}ee 0%, ${deepWarm}66 45%, transparent 78%)`,
          }}
        />

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
            <h1 className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] uppercase mb-8 tracking-tight-display text-white">
              <span className="bg-gradient-to-r from-[#C2703E] via-[#E8B86D] to-[#FBF5ED] bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(0,0,0,0.55)]">
                CHASING SUN(SETS)
              </span>
            </h1>
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

      {/* July 2025 Recap Video */}
      <section
        id="chasing-july-2025-recap"
        className="scroll-mt-44 py-24 px-6"
        style={{ borderTop: `1px solid ${auburn}15`, background: `${warmGold}08` }}
      >
        <motion.div className="container max-w-6xl mx-auto" {...sectionReveal}>
          <div className="lg:hidden sticky top-[5.65rem] z-20 mb-8">
            <div className="luxe-surface-warm p-2.5">
              <div className="overflow-hidden rounded-[0.9rem] border bg-black" style={{ borderColor: `${auburn}36` }}>
                <div className="aspect-video">
                  <iframe
                    title="July 2025 Chasing Sun(Sets) recap video mobile preview"
                    src={JULY_2025_RECAP_EMBED_URL}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
            <div className="lg:order-1">
              <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: auburn }}>
                Featured Recap
              </span>
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: deepWarm }}>
                JULY 2025 CHASING SUN(SETS) RECAP
              </h2>
              <p className="text-lg mb-5 max-w-3xl leading-relaxed" style={{ color: `${deepWarm}80` }}>
                This is the official Chasing Sun(Sets) recap video from July 2025 - a visual archive of the sunset chapter.
              </p>
              <p className="text-base mb-6 max-w-3xl leading-relaxed" style={{ color: `${deepWarm}73` }}>
                From first light to closing track, this chapter captures the exact pace and emotional arc that defines the series:
                open-air ritual, community movement, and sunset energy turning into night momentum.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {["Official Recap", "Chicago — July 2025", "Sunset Chapter Archive"].map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1.5 rounded-full text-[10px] font-mono tracking-[0.16em] uppercase border"
                    style={{ borderColor: `${auburn}45`, color: `${deepWarm}C8`, background: "rgba(255,255,255,0.74)" }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="cta-stack">
                <a
                  href={JULY_2025_RECAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 font-bold tracking-widest text-xs uppercase text-white rounded-full lift-hover"
                  style={{ background: `linear-gradient(135deg, ${auburn}, ${warmGold})` }}
                >
                  Watch Recap <ArrowUpRight size={14} />
                </a>
                <Link href="/tickets" className="btn-pill-dark">
                  Get Tickets
                </Link>
              </div>
              <p className="ui-meta mt-4" style={{ color: `${deepWarm}99` }}>
                16:9 Live Chapter Film · Official Set Recap
              </p>
            </div>

            <div className="hidden lg:block lg:order-2">
              <div className="sticky top-28">
                <div className="luxe-surface-warm p-3 md:p-4">
                  <div className="overflow-hidden rounded-[0.9rem] border bg-black" style={{ borderColor: `${auburn}30` }}>
                    <div className="aspect-video">
                      <iframe
                        title="July 2025 Chasing Sun(Sets) recap video"
                        src={JULY_2025_RECAP_EMBED_URL}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <BrandMotifDivider tone="warm" className="my-6" />

      {/* The Concept */}
      <section id="chasing-concept" className="scroll-mt-44 py-24 px-6" style={{ borderTop: `1px solid ${auburn}15` }}>
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={sectionReveal.initial}
              whileInView={sectionReveal.whileInView}
              viewport={sectionReveal.viewport}
              transition={sectionTransition}
            >
              <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: auburn }}>
                The Format
              </span>
              <h2 className="font-display text-5xl md:text-6xl mb-6" style={{ color: deepWarm }}>
                SUNSET TO
                <br />
                SUNDOWN
              </h2>
            </motion.div>

            <motion.div
              initial={sectionReveal.initial}
              whileInView={sectionReveal.whileInView}
              viewport={sectionReveal.viewport}
              transition={{ ...sectionTransition, delay: 0.1 }}
              className="space-y-6 rounded-2xl border p-6 md:p-8 backdrop-blur-sm"
              style={{ borderColor: `${auburn}22`, background: "linear-gradient(145deg,rgba(255,255,255,0.62),rgba(255,255,255,0.36))" }}
            >
              <p className="text-lg leading-relaxed" style={{ color: `${deepWarm}80` }}>
                Every Chasing Sun(Sets) show starts during golden hour. The music
                builds as the light changes. By the time the sun is gone, the
                energy is already there.
              </p>
              <p className="leading-relaxed" style={{ color: `${deepWarm}70` }}>
                Melodic house, afro house, organic downtempo — sounds that match
                the warmth. Rooftops, gardens, open-air spaces. No dark rooms,
                no strobes. Just the sky and the sound.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 pt-4">
                {["Rooftop", "Golden Hour", "Melodic House", "Afro House", "Open Air"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-xs font-mono tracking-widest uppercase"
                    style={{ border: `1px solid ${auburn}30`, color: auburn }}
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
      <div id="chasing-records" className="scroll-mt-44">
        <MixedMediaGallery
          title="Season I"
          subtitle="2025 Archives"
          description="The beginning. Rooftops, rivers, and the golden hour."
          media={chasingSeason1}
          className="bg-transparent border-t border-[#C2703E]/10"
          style={{ color: deepWarm }}
        />
        <MixedMediaGallery
          title="Season II"
          subtitle="2026 Archives"
          description="Expanding the horizon. New venues, same sun."
          media={chasingSeason2}
          className="bg-transparent border-t border-[#C2703E]/10"
          style={{ color: deepWarm }}
        />
      </div>

      <BrandMotifDivider tone="warm" className="my-6" />

      {/* Upcoming Events */}
      <section id="chasing-upcoming" className="scroll-mt-44 py-24 px-6" style={{ background: `${warmGold}12`, borderTop: `1px solid ${auburn}15` }}>
        <div className="container max-w-5xl mx-auto">
          <motion.div className="flex items-end justify-between mb-16 pb-6" style={{ borderBottom: `1px solid ${auburn}15` }} {...sectionReveal}>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: deepWarm }}>UPCOMING</h2>
            <span className="font-mono text-xs tracking-widest" style={{ color: auburn }}>SEASON 2026</span>
          </motion.div>

          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                className="group p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all rounded-2xl backdrop-blur-sm"
                style={{ border: `1px solid ${auburn}20`, background: "linear-gradient(145deg,rgba(255,255,255,0.75),rgba(255,255,255,0.45))" }}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ ...sectionTransition, delay: Math.min(index * 0.08, 0.2) }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-center justify-center w-16 h-16" style={{ border: `1px solid ${auburn}30`, background: `${auburn}08` }}>
                    <span className="text-xs font-bold uppercase" style={{ color: auburn }}>{event.month}</span>
                    <span className="text-lg font-display" style={{ color: deepWarm }}>{event.day}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display tracking-wide mb-1 group-hover:transition-colors" style={{ color: deepWarm }}>
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-2.5 text-sm md:text-[0.95rem] font-mono uppercase" style={{ color: `${deepWarm}78` }}>
                      <span
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] md:text-xs tracking-[0.12em]"
                        style={{ background: "rgba(255,255,255,0.9)", border: `1px solid ${auburn}42` }}
                      >
                        <MapPin size={12} /> {event.location}
                      </span>
                      <span
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] md:text-xs tracking-[0.12em]"
                        style={{ background: "rgba(255,255,255,0.9)", border: `1px solid ${auburn}42` }}
                      >
                        <Calendar size={12} /> {event.time}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href="/tickets" asChild>
                  <a
                    className="w-full sm:w-auto px-8 py-3 font-bold tracking-widest text-xs uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer text-white rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50"
                    style={{ background: `linear-gradient(135deg, ${auburn}, ${warmGold})` }}
                  >
                    GET TICKETS <ArrowUpRight size={14} />
                  </a>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit DJ Set */}
      <section id="chasing-submit" className="scroll-mt-44 py-24 px-6" style={{ borderTop: `1px solid ${auburn}15`, background: cream }}>
        <motion.div className="container max-w-4xl mx-auto text-center" {...sectionReveal}>
          <span className="font-mono text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: auburn }}>
            For The Selectors
          </span>
          <h2 className="font-display text-5xl md:text-6xl mb-8" style={{ color: deepWarm }}>
            SUBMIT YOUR SET
          </h2>
          <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: `${deepWarm}80` }}>
            Chasing Sun(Sets) is about the perfect vibe for the golden hour.
            Melodic, Organic, Afro House. If you have the sound, we have the sunset.
          </p>
          <a
            href="mailto:music@monolithproject.com?subject=Chasing Sun(Sets) Submission"
            className="inline-block px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer text-white rounded-full"
            style={{ background: `linear-gradient(135deg, ${auburn}, ${warmGold})` }}
          >
            SUBMIT A MIX
          </a>
        </motion.div>
      </section>

      {/* CTA */}
      <section id="chasing-cta" className="scroll-mt-44 py-32 px-6 relative" style={{ borderTop: `1px solid ${auburn}15` }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(194,112,62,0.18),transparent_32%),radial-gradient(circle_at_82%_76%,rgba(232,184,109,0.22),transparent_34%)]" />
        <motion.div className="container max-w-4xl mx-auto text-center" {...sectionReveal}>
          <h2 className="font-display text-5xl md:text-7xl mb-6" style={{ color: deepWarm }}>
            CHASE THE LIGHT
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-12" style={{ color: `${deepWarm}70` }}>
            Sign up for the newsletter to get ticket access before anyone else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/story" asChild>
              <a
                className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-80 transition-opacity cursor-pointer rounded-full inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C1810]/20"
                style={{ border: `1px solid ${deepWarm}30`, color: deepWarm }}
              >
                UNTOLD STORY
              </a>
            </Link>
            <Link href="/" asChild>
              <a
                className="px-10 py-4 font-display text-lg tracking-widest uppercase hover:opacity-90 transition-opacity cursor-pointer text-white rounded-full inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50"
                style={{ background: `linear-gradient(135deg, ${auburn}, ${warmGold})` }}
              >
                BACK TO MONOLITH
              </a>
            </Link>
          </div>
        </motion.div>
      </section>
      </main>

      <SlimSubscribeStrip title="SUBSCRIBE FOR SUN(SETS)" source="chasing_sunsets_strip" dark={false} />
      <EntityBoostStrip
        tone="warm"
        className="pb-8"
        contextLabel="Chasing Sun(Sets) Identity Links"
        intent="watch-recap"
      />
      <section className="px-6 pb-8">
        <div className="container max-w-6xl mx-auto">
          <div
            className="luxe-surface-warm rounded-2xl px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 justify-between"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: `${deepWarm}90` }}>
                Next Event
              </p>
              <p className="font-display text-2xl md:text-3xl uppercase mt-1" style={{ color: deepWarm }}>
                {featuredEvent.title}
              </p>
              <div className="mt-2 flex flex-wrap gap-2.5 text-[11px] md:text-xs font-mono uppercase tracking-[0.12em]" style={{ color: `${deepWarm}84` }}>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ borderColor: `${auburn}38`, background: "rgba(255,255,255,0.72)" }}>
                  <Calendar size={12} /> {featuredEvent.dateLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border" style={{ borderColor: `${auburn}38`, background: "rgba(255,255,255,0.72)" }}>
                  <MapPin size={12} /> {featuredEvent.venue}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full border" style={{ borderColor: `${auburn}32`, background: "rgba(255,255,255,0.62)" }}>
                  {featuredEvent.location}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full border" style={{ borderColor: `${auburn}32`, background: "rgba(255,255,255,0.62)" }}>
                  {featuredEvent.time}
                </span>
              </div>
            </div>
            <Link href="/tickets" className="btn-pill-coral w-full md:w-auto">
              Get Tickets
            </Link>
          </div>
        </div>
      </section>
      <FloatingFactsChip tone="warm" storageKey="floating-facts-chip-chasing" />
      <Footer />
    </div>
  );
}
