import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring, useInView, useReducedMotion } from "framer-motion";
import { Play, Pause, Sun, X, MapPin, Music, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import GlobalListenerMap from "@/components/GlobalListenerMap";
import RadioGlobe from "@/components/RadioGlobe";
import Navigation from "@/components/Navigation";
import SlimSubscribeStrip from "@/components/SlimSubscribeStrip";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import StickyPlayer from "@/components/StickyPlayer";
import RevealText from "@/components/RevealText";
import HeroSpotlight from "@/components/ui/HeroSpotlight";
import ShimmerButton from "@/components/ui/ShimmerButton";
import SEO from "@/components/SEO";
import SmartImage from "@/components/SmartImage";
import MagneticButton from "@/components/MagneticButton";
import BrandTranslatorLabel from "@/components/BrandTranslatorLabel";
import BrandMotifDivider from "@/components/BrandMotifDivider";
import FloatingFactsChip from "@/components/FloatingFactsChip";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import SignalBarsMark from "@/components/SignalBarsMark";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import { CTA_LABELS } from "@/lib/cta";

const radioArtists = [
  {
    name: "BENCHEK",
    image: "/images/artist-benchek.jpg",
    banner: "Chasing Sun(Sets) Radio Show",
    eyebrow: "Featured Episode",
    summary: "Start with the New Year transition session that opened the radio archive.",
    href: "/radio/ep-01-benchek",
    ctaLabel: "Open Episode 01",
  },
  {
    name: "EWERSEEN",
    image: "/images/artist-ewerseen.png",
    banner: "Chasing Sun(Sets) Radio Show",
    eyebrow: "Featured Episode",
    summary: "Jump straight into EWERSEEN's Mix Vol. 3 and the radio-show side of Chasing Sun(Sets).",
    href: "/radio/ep-02-ewerseen",
    ctaLabel: "Open EWERSEEN Mix",
  },
  {
    name: "TERRANOVA",
    image: "/images/artist-terranova.png",
    banner: "Chasing Sun(Sets) Radio Show",
    eyebrow: "Featured Episode",
    summary: "Open the TERRANOVA guest session and move through the strongest long-form entry points in the archive.",
    href: "/radio/ep-03-terranova",
    ctaLabel: "Open Episode 03",
  },
];

const RADIO_ANCHORS = [
  { label: "Episodes", href: "#radio-tracks" },
  { label: "Map", href: "#radio-map" },
  { label: "FAQ", href: "#radio-faq" },
];

interface Track {
  title: string;
  artist: string;
  series: "sunsets" | "untold";
  duration: string;
  soundcloudUrl: string;
  embedUrl: string;
}

const tracks: Track[] = [
  {
    title: "Spécial NYE",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "58:23",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "TERRANOVA x CHASING SUN(SETS)",
    artist: "TERRANOVA",
    series: "sunsets",
    duration: "62:10",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/terranova",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/terranova&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Mix Vol.3",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "55:48",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "RADIAN x UNTOLD STORY",
    artist: "RADIAN",
    series: "untold",
    duration: "71:05",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/radianofc-set",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/radianofc-set&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Collab Mix Vol.2",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "48:32",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
  {
    title: "Live from Marbella EP02",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "64:17",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
  },
];

type Filter = "all" | "sunsets" | "untold";

const sectionTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: sectionTransition,
};

const radioFaqs = [
  ["How often are new mixes released?", "We drop new mixes regularly, capturing the very best live sets from our recent events as well as exclusive guest mixes."],
  ["Can I submit a mix for the Radio show?", "Yes, we are always looking for selectors who fit the Monolith and Chasing Sun(Sets) sound. Reach out to us via the contact page."],
  ["Are the live recordings edited?", "We try to keep them as raw and authentic as possible to capture the true energy and imperfections of the dancefloor."]
];

// Audio Visualizer Component
function AudioVisualizer({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="flex items-end gap-[3px] h-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-1 bg-primary rounded-sm transition-all"
          style={{
            animation: `radioVisualizerBar ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 0.3}s`,
            height: '20%',
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes radioVisualizerBar {
          0% { height: 20%; opacity: 0.6; }
          100% { height: 100%; opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default function Radio() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [faqDrawerOpen, setFaqDrawerOpen] = useState(false);
  const [artistIndex, setArtistIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroInView = useInView(heroRef, { margin: "-20% 0px -20% 0px" });
  const reduceMotion = useReducedMotion();

  // 3D Tilt calculations
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (reduceMotion || !heroInView) return;
    const timer = setInterval(() => {
      setArtistIndex((prev) => (prev + 1) % radioArtists.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [reduceMotion, heroInView]);

  const filtered = filter === "all" ? tracks : tracks.filter((t) => t.series === filter);
  const activeArtist = radioArtists[artistIndex] || radioArtists[0];

  const handlePlay = (index: number) => {
    const track = filtered[index];
    const realIndex = tracks.indexOf(track);
    setActiveTrack((current) => (current === realIndex ? null : realIndex));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Chasing Sun(Sets) Radio Show | Episodes, Tracklists, Guest Mixes"
        description="Official Chasing Sun(Sets) Radio Show archive from Chicago with guest mixes, episode pages, tracklists, and links to tickets and facts."
        absoluteTitle
        canonicalPath="/radio"
      />
      <Navigation brand="radio" />

      {/* Hero */}
      <section ref={heroRef} className="relative page-shell-start-loose pb-24 px-6 overflow-hidden min-h-[75vh] flex flex-col justify-center bg-black">
        {/* Full Bleed Rotating Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={artistIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <SmartImage
                src={(radioArtists[artistIndex] || radioArtists[0]).image}
                alt={(radioArtists[artistIndex] || radioArtists[0]).name}
                priority
                className="w-full h-full object-cover object-[center_30%]"
                containerClassName="h-full w-full bg-transparent"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
        </div>

        <div className="container layout-wide relative z-10 w-full">
          <div className="max-w-3xl">
            <SignalBarsMark className="w-14 h-10 sm:w-16 sm:h-12 mb-5 sm:mb-6" />
            <RevealText as="span" className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-6" delay={0.1}>
              {activeArtist.banner}
            </RevealText>
            <div className="mb-8 relative">
              <HeroSpotlight className="-m-8 p-8" spotlightColor="rgba(255, 255, 255, 0.15)">
                <motion.h1
                  initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                  className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.85] uppercase tracking-tight-display drop-shadow-2xl"
                >
                  <span className="bg-gradient-to-r from-[#C2703E] via-[#E8B86D] to-[#FBF5ED] bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(0,0,0,0.55)] block mb-2 md:mb-4">
                    CHASING SUN(SETS)
                  </span>
                  <span className="text-white">RADIO</span>
                </motion.h1>
                <BrandTranslatorLabel className="mt-2" tone="radio">
                  {activeArtist.eyebrow}
                </BrandTranslatorLabel>
              </HeroSpotlight>
            </div>
            <RevealText as="p" className="max-w-lg text-white/80 text-lg md:text-xl leading-relaxed drop-shadow-lg font-light" delay={0.4} stagger={0.01}>
              {activeArtist.summary}
            </RevealText>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <MagneticButton strength={0.3}>
                <Link href={activeArtist.href} asChild>
                  <a className="btn-pill-coral inline-flex items-center justify-center">
                    {activeArtist.ctaLabel}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </a>
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.22}>
                <a href="#radio-tracks" className="px-10 h-14 border border-white/20 text-white font-display text-lg tracking-widest uppercase hover:border-primary hover:text-primary transition-colors cursor-pointer rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 bg-black/20">
                  Browse All Sets
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
      <SeasonAnchorNav items={RADIO_ANCHORS} tone="warm" className="-mt-7 mb-5" />

      {/* Massive Globe Separator with Rotating Frame */}
      <section className="relative w-full h-[60vh] md:h-[75vh] min-h-[550px] overflow-hidden border-t border-border bg-card flex flex-col justify-center">
        {/* Globe */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-0 mt-[-10vh] translate-y-24 md:translate-y-12 opacity-80 mix-blend-lighten">
          <RadioGlobe />
        </div>

        {/* Floating Autograf Video (Double size = ~320x320 sq) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-cover bg-center bg-black/20"
          style={{ backgroundImage: "url('/images/autograf-recap.jpg')" }}
        >
          <YouTubeEmbed
            url="https://www.youtube.com/watch?v=9R6XH7JZlJI"
            title="Autograf live at Monolith"
            autoplay
            muted
            controls={false}
            loop
            playsInline
            start={3714}
            allowFullScreen={false}
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-[1.5] border-0"
          />
        </div>

        <div className="container layout-wide h-full relative z-20 w-full flex flex-col md:flex-row items-center justify-between px-6 pointer-events-none">
          {/* Rotating Album Cover Frame with 3D Tilt */}
          <Link href={activeArtist.href} asChild>
            <a
              className="w-full h-full flex items-center justify-center md:justify-start pointer-events-auto"
              style={{ perspective: 1200 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label={`Open ${activeArtist.name} radio feature`}
            >
              <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ opacity: { duration: 1.2, delay: 0.5 }, y: { duration: 1.2, delay: 0.5, ease: "easeOut" } }}
                className="relative w-[300px] md:w-[400px] aspect-square rounded-2xl overflow-hidden bg-background/5 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-20"
              >
                {/* Decorative Elements */}
                <div
                  style={{ transform: "translateZ(30px)" }}
                  className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[10px] text-white/80 tracking-widest uppercase">Radio Show</span>
                </div>
                <div
                  style={{ transform: "translateZ(30px)" }}
                  className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-white/80 tracking-widest uppercase">Live</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={artistIndex}
                    initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 z-10"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    <SmartImage
                      src={activeArtist.image}
                      alt={activeArtist.name}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full bg-black"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  </motion.div>
                </AnimatePresence>

                {/* Artist Name Container */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 z-30"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={artistIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6 }}
                      className="flex flex-col gap-1 drop-shadow-lg"
                    >
                      <span className="font-mono text-[10px] tracking-[0.3em] text-[#E8B86D] uppercase font-bold drop-shadow-md">Now Playing</span>
                      <span className="font-display text-3xl md:text-4xl text-white tracking-widest uppercase drop-shadow-xl block">{activeArtist.name}</span>
                      <span className="font-mono text-[10px] tracking-[0.24em] text-white/60 uppercase">
                        {activeArtist.banner}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </a>
          </Link>
        </div>
      </section>

      {/* Filters with LayoutId Gliding Pill */}
      <section className="px-6 pb-8 border-t border-border pt-12 md:pt-16">
        <div className="container layout-default">
          <div className="flex flex-wrap gap-3 pb-6 border-b border-border relative">
            {([
              { label: "ALL", value: "all" as Filter, icon: null },
              { label: "SUN(SETS)", value: "sunsets" as Filter, icon: <Sun className="w-3.5 h-3.5" /> },
              { label: "UNTOLD", value: "untold" as Filter, icon: <UntoldButterflyLogo className="w-4 h-4" /> },
            ]).map((f) => {
              const isActive = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`relative flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors outline-none z-10 ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary/90 border border-primary rounded-full z-0 pointer-events-none shadow-md backdrop-blur-sm"
                      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {f.icon}
                    {f.label}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto font-mono text-xs text-muted-foreground self-center">
              {filtered.length} SET{filtered.length !== 1 ? "S" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Track List */}
      <section id="radio-tracks" className="px-6 pb-16 scroll-shell-target">
        <div className="container layout-default">
          <div className="border-t border-border/50">
            {filtered.map((track, index) => {
              const realIndex = tracks.indexOf(track);
              const isActive = activeTrack === realIndex;
              return (
                <motion.div
                  key={track.soundcloudUrl}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className={`group w-full flex items-center gap-4 md:gap-6 py-5 px-4 border-b border-border/50 transition-colors bg-transparent ${isActive ? "bg-white/5" : "hover:bg-white/[0.03]"
                    }`}
                >
                  {/* Magnetic Play Button */}
                  <MagneticButton strength={0.4} onClick={() => handlePlay(index)}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all flex-shrink-0 ${isActive ? "bg-primary text-primary-foreground border-transparent shadow-[0_0_15px_rgba(224,90,58,0.5)]" : "bg-black/20 border border-white/10 text-white group-hover:border-primary/50 group-hover:text-primary"}`} aria-label={`${isActive ? "Pause" : "Play"} ${track.title}`}>
                      {isActive ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-1" />
                      )}
                    </div>
                  </MagneticButton>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer" onClick={() => handlePlay(index)}>
                    <div className="flex items-center gap-3">
                      <span className={`block text-base md:text-lg font-medium truncate transition-colors ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                        {track.title}
                      </span>
                      <AudioVisualizer isActive={isActive} />
                    </div>
                    <span className="block text-xs md:text-sm text-muted-foreground font-mono tracking-wide mt-1">
                      {track.artist}
                    </span>
                  </div>

                  {/* Series tag & Duration */}
                  <div className="flex flex-col items-end gap-2 shrink-0 cursor-pointer" onClick={() => handlePlay(index)}>
                    <span className={`hidden md:inline-block px-3 py-1 text-[10px] font-mono tracking-widest uppercase border rounded-md ${track.series === "sunsets"
                      ? "text-orange-300 border-orange-300/30 bg-orange-300/10"
                      : "text-primary border-primary/30 bg-primary/10"
                      }`}>
                      {track.series === "sunsets" ? "SUN(SETS)" : "UNTOLD"}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {track.duration}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <BrandMotifDivider tone="nocturne" className="my-10" />

      {/* Map Section */}
      <section id="radio-map" className="px-6 py-20 bg-card border-t border-border scroll-shell-target">
        <div className="container layout-default">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-border">
            <div>
              <RevealText as="span" className="font-mono text-xs text-primary tracking-[0.3em] uppercase block mb-2" delay={0.1}>
                Global Reach
              </RevealText>
              <RevealText as="h2" className="font-display text-4xl text-foreground" delay={0.2} blurStrength={10}>
                WHERE PEOPLE LISTEN
              </RevealText>
            </div>
            <span className="font-mono text-xs text-muted-foreground tracking-widest">
              4 ARTISTS · 8 CITIES
            </span>
          </div>

          <div className="border border-border bg-background p-6 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none z-10" />
            <div className="h-[300px] md:h-[400px] relative z-0">
              <GlobalListenerMap />
            </div>
          </div>
        </div>
      </section>

      {/* Radio FAQ - Modern Floating Button triggering Off-Canvas */}
      <section id="radio-faq" className="px-6 pb-24 border-t border-border mt-12 md:mt-0 pt-20 scroll-shell-target">
        <div className="container layout-default flex flex-col md:flex-row items-center justify-between gap-8 bg-card border border-border/50 p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h3 className="font-display text-3xl md:text-5xl uppercase tracking-wide text-foreground mb-4">Questions About The Radio Show?</h3>
            <p className="text-muted-foreground font-light text-lg">Learn more about episode releases, mix submissions, and how the recordings are put together.</p>
          </div>

          <div className="relative z-10">
            <MagneticButton strength={0.4}>
              <button
                onClick={() => setFaqDrawerOpen(true)}
                className="btn-pill-coral flex shadow-[0_10px_30px_rgba(224,90,58,0.25)] hover:shadow-[0_15px_40px_rgba(224,90,58,0.4)]"
              >
                VIEW FAQ
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Off-Canvas Drawer for FAQ */}
        <AnimatePresence>
          {faqDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setFaqDrawerOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] lg:w-[600px] bg-background border-l border-border z-50 flex flex-col shadow-2xl"
              >
                <div className="p-6 md:p-8 border-b border-border flex items-center justify-between shrink-0">
                  <h2 className="font-display text-3xl text-foreground uppercase tracking-wider">Radio FAQ</h2>
                  <button
                    onClick={() => setFaqDrawerOpen(false)}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                  <div className="space-y-6">
                    {radioFaqs.map(([q, a], idx) => (
                      <div key={idx} className="border border-white/5 bg-white/5 p-6 rounded-2xl">
                        <h4 className="font-bold text-foreground mb-3 text-lg leading-tight">{q}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-border">
        <div className="container layout-narrow text-center">
          <RevealText as="h2" className="font-display text-4xl md:text-6xl text-foreground mb-4" blurStrength={12}>
            HEAR IT LIVE
          </RevealText>
          <RevealText as="p" className="text-muted-foreground max-w-md mx-auto mb-12 flex" stagger={0.01} delay={0.2}>
            Every set gets recorded and added to the archive.
            Come to the show, hear it first.
          </RevealText>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton strength={0.4}>
              <Link href="/tickets" asChild>
                <a className="btn-pill-coral w-full flex items-center justify-center">
                  {CTA_LABELS.tickets}
                </a>
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.4}>
              <Link href="/schedule" asChild>
                <a className="px-10 h-14 border border-border text-foreground font-display text-lg tracking-widest uppercase hover:border-primary hover:text-primary transition-colors cursor-pointer rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70">
                  {CTA_LABELS.schedule}
                </a>
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>

      <FloatingFactsChip tone="nocturne" storageKey="floating-facts-chip-radio" />
    </div>
  );
}
