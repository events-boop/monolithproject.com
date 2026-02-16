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
    title: "THE FIRST MONOLITH",
    location: "Chicago, IL",
    time: "4:00 PM - Late",
    status: "coming-soon" as const,
  },
];

const CHASING_ANCHORS = [
  { label: "Format", href: "#chasing-concept" },
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

export default function ChasingSunsets() {
  return (
    <div className="min-h-screen selection:text-white relative overflow-hidden bg-noise" style={{ background: cream, color: deepWarm }}>
      <SEO
        title="Chasing Sun(Sets)"
        description="Golden hour. Good people. Great music. Rooftop shows and outdoor gatherings throughout Chicago."
        image="/images/chasing-sunsets.jpg"
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

      {/* The Concept */}
      <section id="chasing-concept" className="scroll-mt-44 py-24 px-6" style={{ borderTop: `1px solid ${auburn}15` }}>
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
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

      {/* Upcoming Events */}
      <section id="chasing-upcoming" className="scroll-mt-44 py-24 px-6" style={{ background: `${warmGold}12`, borderTop: `1px solid ${auburn}15` }}>
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-16 pb-6" style={{ borderBottom: `1px solid ${auburn}15` }}>
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: deepWarm }}>UPCOMING</h2>
            <span className="font-mono text-xs tracking-widest" style={{ color: auburn }}>SEASON 2026</span>
          </div>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.title}
                className="group p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all rounded-2xl backdrop-blur-sm"
                style={{ border: `1px solid ${auburn}20`, background: "linear-gradient(145deg,rgba(255,255,255,0.75),rgba(255,255,255,0.45))" }}
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
                    <div className="flex gap-4 text-sm font-mono uppercase" style={{ color: `${deepWarm}60` }}>
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
                    className="px-8 py-3 font-bold tracking-widest text-xs uppercase hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer text-white rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8B86D]/50"
                    style={{ background: `linear-gradient(135deg, ${auburn}, ${warmGold})` }}
                  >
                    GET TICKETS <ArrowUpRight size={14} />
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit DJ Set */}
      <section id="chasing-submit" className="scroll-mt-44 py-24 px-6" style={{ borderTop: `1px solid ${auburn}15`, background: cream }}>
        <div className="container max-w-4xl mx-auto text-center">
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
        </div>
      </section>

      {/* CTA */}
      <section id="chasing-cta" className="scroll-mt-44 py-32 px-6 relative" style={{ borderTop: `1px solid ${auburn}15` }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(194,112,62,0.18),transparent_32%),radial-gradient(circle_at_82%_76%,rgba(232,184,109,0.22),transparent_34%)]" />
        <div className="container max-w-4xl mx-auto text-center">
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
        </div>
      </section>
      </main>

      <SlimSubscribeStrip title="SUBSCRIBE FOR SUN(SETS)" source="chasing_sunsets_strip" dark={false} />
      <Footer />
    </div>
  );
}
