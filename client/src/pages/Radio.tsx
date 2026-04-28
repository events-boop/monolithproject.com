import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Headphones, Play, Radio as RadioIcon, Sun, Waves } from "lucide-react";
import { Link } from "wouter";
import GlobalListenerMap from "@/components/GlobalListenerMap";
import RadioGlobe from "@/components/RadioGlobe";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";
import MagneticButton from "@/components/MagneticButton";
import BrandMotifDivider from "@/components/BrandMotifDivider";
import FloatingFactsChip from "@/components/FloatingFactsChip";
import SignalBarsMark from "@/components/SignalBarsMark";
import SeasonAnchorNav from "@/components/SeasonAnchorNav";
import JoinSignalSection from "@/components/JoinSignalSection";
import { radioEpisodes, type RadioEpisode } from "@/data/radioEpisodes";

type EpisodeMode = "sunsets" | "crossovers";
type EpisodeFilter = "all" | EpisodeMode;

const RADIO_ANCHORS = [
  { label: "Featured", href: "#radio-featured" },
  { label: "Archive", href: "#radio-archive" },
  { label: "Reach", href: "#radio-map" },
  { label: "FAQ", href: "#radio-faq" },
];

const sectionTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };
const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: sectionTransition,
};

const radioFaqs = [
  [
    "How often are new mixes released?",
    "New drops land when the archive has something worth replaying. We prioritize strong sessions over filler cadence.",
  ],
  [
    "Can I submit a mix for the radio show?",
    "Yes. The best fits already sound aligned with Monolith, Chasing Sun(Sets), or the deeper crossover lane between them.",
  ],
  [
    "Are the recordings heavily edited?",
    "No. We clean the presentation, but the goal is to keep the pacing and tension of the original room or guest session intact.",
  ],
] as const;

const episodeScenes: Record<string, { heroImage: string; signal: string; region: string; mode: EpisodeMode }> = {
  "ep-004-benchek-part-2": {
    heroImage: "/images/artist-benchek.jpg",
    signal: "Marbella return",
    region: "Open-air transmission",
    mode: "sunsets",
  },
  "ch-02-radian-no-sleep": {
    heroImage: "/images/radio-show-gear.webp",
    signal: "Berlin chapter",
    region: "After-hours pressure",
    mode: "crossovers",
  },
  "ep-01-benchek": {
    heroImage: "/images/artist-benchek.jpg",
    signal: "Archive opener",
    region: "NYE transition set",
    mode: "sunsets",
  },
  "ep-02-ewerseen": {
    heroImage: "/images/artist-ewerseen.png",
    signal: "Guest mix",
    region: "Peak-hour drive",
    mode: "sunsets",
  },
  "ep-03-terranova": {
    heroImage: "/images/artist-terranova.png",
    signal: "Long-form session",
    region: "Sunline archive",
    mode: "sunsets",
  },
  "ep-04-radian": {
    heroImage: "/images/radio-show-gear.webp",
    signal: "Crossover cut",
    region: "Untold bridge",
    mode: "crossovers",
  },
};

const featuredEpisodePool = radioEpisodes.slice(0, 4);

function getEpisodeScene(episode: RadioEpisode) {
  return (
    episodeScenes[episode.slug] ?? {
      heroImage: episode.image,
      signal: "Guest session",
      region: "Radio archive",
      mode: "sunsets" as EpisodeMode,
    }
  );
}

function getCoverSrc(episode: RadioEpisode) {
  return episode.coverImage || episode.image;
}

function getNarrativePreview(narrative: string) {
  return narrative.split("\n\n")[0] || narrative;
}

function isExternalLink(url: string) {
  return /^https?:\/\//i.test(url);
}

function scrollToFeaturedDeck() {
  if (typeof document === "undefined") return;
  document.getElementById("radio-featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Radio() {
  const [filter, setFilter] = useState<EpisodeFilter>("all");
  const [activeEpisodeSlug, setActiveEpisodeSlug] = useState(featuredEpisodePool[0]?.slug ?? radioEpisodes[0]?.slug ?? "");
  const heroRef = useRef<HTMLElement | null>(null);
  const heroInView = useInView(heroRef, { margin: "-20% 0px -20% 0px" });
  const reduceMotion = useReducedMotion();

  const activeEpisode = useMemo(
    () => radioEpisodes.find((episode) => episode.slug === activeEpisodeSlug) ?? radioEpisodes[0],
    [activeEpisodeSlug],
  );

  const filteredEpisodes = useMemo(() => {
    if (filter === "all") return radioEpisodes;
    return radioEpisodes.filter((episode) => getEpisodeScene(episode).mode === filter);
  }, [filter]);

  useEffect(() => {
    if (reduceMotion || !heroInView || featuredEpisodePool.length < 2) return;

    const timer = setInterval(() => {
      setActiveEpisodeSlug((current) => {
        const currentIndex = featuredEpisodePool.findIndex((episode) => episode.slug === current);
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % featuredEpisodePool.length : 0;
        return featuredEpisodePool[nextIndex].slug;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [heroInView, reduceMotion]);

  if (!activeEpisode) {
    return null;
  }

  const activeScene = getEpisodeScene(activeEpisode);
  const heroQueue = featuredEpisodePool.filter((episode) => episode.slug !== activeEpisode.slug).slice(0, 3);

  const selectEpisode = (slug: string, bringToDeck = false) => {
    setActiveEpisodeSlug(slug);
    if (bringToDeck) scrollToFeaturedDeck();
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <SEO
        title="Radio | The Monolith Project"
        description="Listen to artist-led mixes, archive episodes, and crossover sessions from The Monolith Project's Chicago music community."
        absoluteTitle
        canonicalPath="/radio"
      />
      <Navigation brand="chasing-sunsets" />

      <section
        ref={heroRef}
        className="relative flex min-h-[82vh] flex-col justify-center overflow-hidden bg-[#050505] px-6 pb-24 page-shell-start-loose"
      >
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEpisode.slug}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <ResponsiveImage
                src={activeScene.heroImage}
                alt={`${activeEpisode.guest} radio portrait`}
                priority
                sizes="100vw"
                className="h-full w-full object-cover object-center opacity-30"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(232,184,109,0.22),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(194,112,62,0.16),transparent_24%),linear-gradient(180deg,rgba(6,6,6,0.1)_0%,rgba(6,6,6,0.68)_45%,rgba(5,5,5,0.96)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.68)_45%,rgba(5,5,5,0.88)_100%)]" />
        </div>

        <div className="container layout-wide relative z-10 w-full">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-end">
            <motion.div {...sectionReveal}>
              <SignalBarsMark className="mb-6 h-10 w-14 sm:h-12 sm:w-16" />
              <span className="mb-5 block font-mono text-[10px] uppercase tracking-[0.38em] text-[#E8B86D]">
                Chasing Sun(Sets) Radio Show
              </span>
              <h1 className="section-display-title max-w-[10ch] text-white">
                CHASING SUN(SETS) <span className="text-white/48">RADIO</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 md:text-xl md:leading-relaxed">
                The between-shows archive. Guest-led mixes, crossover cuts, and long-form episodes built to move from golden hour into the darker rooms.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <MagneticButton strength={0.28}>
                  <Link href={`/radio/${activeEpisode.slug}`} asChild>
                    <a className="btn-pill-sunsets inline-flex items-center justify-center">
                      Open Featured Episode
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.22}>
                  <a href="#radio-archive" className="btn-pill-glass inline-flex items-center justify-center">
                    Browse Full Archive
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </MagneticButton>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  `${radioEpisodes.length.toString().padStart(2, "0")} episodes live`,
                  "Chicago-rooted, globally replayed",
                  "Sunset cuts and late-night bridges",
                ].map((stat) => (
                  <div
                    key={stat}
                    className="border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-white/58 backdrop-blur-sm"
                  >
                    {stat}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...sectionReveal}
              transition={{ ...sectionTransition, delay: 0.1 }}
              className="luxe-surface-dark p-4 md:p-5"
            >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
                <button
                  type="button"
                  onClick={() => selectEpisode(activeEpisode.slug)}
                  className="group relative overflow-hidden border border-white/12 bg-black text-left"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <ResponsiveImage
                      src={getCoverSrc(activeEpisode)}
                      alt={`${activeEpisode.guest} ${activeEpisode.title} cover art`}
                      priority
                      sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 40vw, 100vw"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 border border-[#E8B86D]/30 bg-black/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#F7F2EA] backdrop-blur-sm">
                        <RadioIcon className="h-3.5 w-3.5 text-[#E8B86D]" />
                        {activeEpisode.shortCode}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/65">
                        {activeEpisode.duration}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#E8B86D]">
                        Now Spinning
                      </p>
                      <h2 className="mt-2 max-w-[12ch] font-display text-[clamp(2rem,4vw,3.2rem)] uppercase leading-[0.88] text-white">
                        {activeEpisode.guest}
                      </h2>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
                        {activeEpisode.summary}
                      </p>
                    </div>
                  </div>
                </button>

                <div className="flex flex-col gap-3">
                  <div className="border border-[#C2703E]/18 bg-[#120f0d]/86 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#C2703E]">
                      Current Signal
                    </p>
                    <p className="mt-3 font-display text-2xl uppercase leading-[0.9] text-white">
                      {activeScene.signal}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">{activeScene.region}</p>
                  </div>

                  <div className="border border-white/10 bg-white/[0.02] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/42">Queue</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/28">Next drops</p>
                    </div>
                    <div className="space-y-2">
                      {heroQueue.map((episode) => {
                        const scene = getEpisodeScene(episode);

                        return (
                          <button
                            key={episode.slug}
                            type="button"
                            onClick={() => selectEpisode(episode.slug)}
                            className="group flex w-full items-center gap-3 border border-white/8 bg-black/30 px-3 py-3 text-left transition-colors hover:border-white/18 hover:bg-white/[0.04]"
                          >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-white/10 bg-black">
                              <ResponsiveImage
                                src={getCoverSrc(episode)}
                                alt={`${episode.guest} cover art`}
                                sizes="64px"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#E8B86D]">
                                {episode.shortCode}
                              </p>
                              <p className="mt-1 truncate font-display text-lg uppercase leading-none text-white">
                                {episode.guest}
                              </p>
                              <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-white/40">
                                {scene.signal}
                              </p>
                            </div>
                            <Play className="h-4 w-4 shrink-0 text-white/35 transition-colors group-hover:text-white" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SeasonAnchorNav items={RADIO_ANCHORS} tone="warm" className="-mt-7 mb-6" />

      <section id="radio-featured" className="px-6 pb-10 scroll-shell-target">
        <div className="container layout-wide">
          <motion.div className="grid gap-6 lg:grid-cols-[minmax(0,1.16fr)_minmax(320px,0.84fr)]" {...sectionReveal}>
            <div className="luxe-surface-dark overflow-hidden p-4 md:p-6">
              <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#E8B86D]">Playback Deck</span>
                  <h2 className="section-display-title-compact mt-3 max-w-[9ch] text-white">FEATURED EPISODE</h2>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/42">
                  {activeEpisode.displayDate} · {activeEpisode.duration}
                </div>
              </div>

              <div className="overflow-hidden border border-white/10 bg-black">
                <iframe
                  key={activeEpisode.slug}
                  title={`${activeEpisode.title} embedded player`}
                  width="100%"
                  height="166"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={activeEpisode.embedUrl}
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {activeEpisode.tracklist.slice(0, 3).map((track, index) => (
                  <div key={`${track.timecode}-${track.title}`} className="border border-white/8 bg-white/[0.02] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/38">
                      {String(index + 1).padStart(2, "0")} · {track.timecode}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/82">
                      <span className="font-semibold">{track.artist}</span> · {track.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <motion.article className="luxe-surface-dark p-6" {...sectionReveal}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8B86D]">
                      {activeEpisode.shortCode} · {activeScene.signal}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(2.1rem,4vw,3.3rem)] uppercase leading-[0.9] text-white">
                      {activeEpisode.title}
                    </h3>
                  </div>
                  <div className="hidden h-14 w-14 items-center justify-center border border-[#E8B86D]/20 bg-[#E8B86D]/8 text-[#E8B86D] md:flex">
                    <Headphones className="h-6 w-6" />
                  </div>
                </div>

                <p className="mt-4 text-base leading-relaxed text-white/70">{activeEpisode.summary}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/50">{getNarrativePreview(activeEpisode.narrative)}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={activeEpisode.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-sunsets inline-flex items-center justify-center"
                  >
                    Listen on SoundCloud
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                  <Link href={`/radio/${activeEpisode.slug}`} className="btn-pill-glass inline-flex items-center justify-center">
                    Open Episode Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.article>

              <motion.article className="luxe-surface-dark p-6" {...sectionReveal}>
                <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/38">Guest Links</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      Direct exits for the current guest and the wider Monolith stack.
                    </p>
                  </div>
                  <Waves className="hidden h-5 w-5 text-[#E8B86D] md:block" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {activeEpisode.guestLinks.map((link) =>
                    isExternalLink(link.url) ? (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-pill-glass inline-flex items-center justify-center"
                      >
                        {link.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    ) : (
                      <Link key={link.label} href={link.url} className="btn-pill-glass inline-flex items-center justify-center">
                        {link.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    ),
                  )}
                </div>
              </motion.article>
            </div>
          </motion.div>
        </div>
      </section>

      <BrandMotifDivider tone="warm" className="my-10" />

      <section id="radio-archive" className="px-6 pb-20 scroll-shell-target">
        <div className="container layout-wide">
          <motion.div
            {...sectionReveal}
            className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#C2703E]">Archive Grid</span>
              <h2 className="section-display-title-compact mt-3 max-w-[8ch] text-white">ALL SIGNALS</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58 md:text-base">
                A cleaner shelf for every radio drop. Featured episodes stay collectible, the metadata stays consistent, and the deeper cuts are easier to find.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" as EpisodeFilter },
                { label: "Sunset Cuts", value: "sunsets" as EpisodeFilter },
                { label: "Late-Night Bridges", value: "crossovers" as EpisodeFilter },
              ].map((option) => {
                const isActive = filter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={`inline-flex min-h-[44px] items-center justify-center border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
                      isActive
                        ? "border-[#E8B86D]/38 bg-[#1b1510] text-white"
                        : "border-white/10 bg-white/[0.03] text-white/52 hover:border-white/22 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="mt-8 grid gap-4 lg:gap-5">
            {filteredEpisodes.map((episode, index) => {
              const scene = getEpisodeScene(episode);
              const isActive = episode.slug === activeEpisode.slug;

              return (
                <motion.article
                  key={episode.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.45 }}
                  className={`group border transition-colors ${
                    isActive
                      ? "border-[#E8B86D]/30 bg-[#120f0d]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/22 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="grid gap-4 p-4 md:grid-cols-[108px_minmax(0,1fr)_auto] md:items-center md:gap-5 md:p-5 lg:grid-cols-[120px_minmax(0,1fr)_220px]">
                    <button
                      type="button"
                      onClick={() => selectEpisode(episode.slug, true)}
                      className="relative aspect-square overflow-hidden border border-white/10 bg-black text-left"
                    >
                      <ResponsiveImage
                        src={getCoverSrc(episode)}
                        alt={`${episode.guest} ${episode.title} cover art`}
                        sizes="120px"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute left-3 top-3 font-mono text-[9px] uppercase tracking-[0.24em] text-[#E8B86D]">
                        {episode.shortCode}
                      </div>
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#E8B86D]">
                          {scene.signal}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
                          {episode.displayDate}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
                          {episode.duration}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-[clamp(1.6rem,2vw,2.4rem)] uppercase leading-[0.92] text-white">
                        {episode.guest}
                      </h3>
                      <p className="mt-1 text-base uppercase tracking-[0.04em] text-white/72">{episode.title}</p>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/54 md:text-base">
                        {episode.summary}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <button
                        type="button"
                        onClick={() => selectEpisode(episode.slug, true)}
                        className="inline-flex min-h-[44px] items-center gap-2 border border-[#E8B86D]/24 bg-[#E8B86D]/8 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white transition-colors hover:border-[#E8B86D]/46 hover:bg-[#E8B86D]/14"
                      >
                        <Play className="h-3.5 w-3.5 text-[#E8B86D]" />
                        Load In Deck
                      </button>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <Link href={`/radio/${episode.slug}`} className="btn-pill-glass inline-flex items-center justify-center">
                          Episode Page
                        </Link>
                        <a
                          href={episode.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill-glass inline-flex items-center justify-center"
                        >
                          SoundCloud
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="radio-map" className="border-y border-white/10 bg-[#080808] px-6 py-20 scroll-shell-target">
        <div className="container layout-wide">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
            <motion.article className="relative min-h-[26rem] overflow-hidden border border-white/10 bg-black" {...sectionReveal}>
              <div className="absolute inset-0 opacity-85">
                <RadioGlobe />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.1),rgba(8,8,8,0.86)_62%,rgba(8,8,8,0.98))]" />
              <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#E8B86D]">Signal Reach</span>
                <h2 className="section-display-title-compact mt-3 max-w-[7ch] text-white">WHERE IT LANDS</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/62 md:text-base">
                  Chicago is the root. The archive pulls interest from rooftop cities, after-hours cities, and anywhere the guest mix has enough patience to stay in rotation.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Chicago",
                    "Marbella",
                    "Berlin",
                    "Ibiza",
                    "Tulum",
                    "Paris",
                    "Dubai",
                    "New York",
                  ].map((city) => (
                    <span
                      key={city}
                      className="border border-white/10 bg-black/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-white/56 backdrop-blur-sm"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>

            <motion.article className="luxe-surface-dark p-4 md:p-6" {...sectionReveal}>
              <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C2703E]">Listener Map</span>
                  <h3 className="mt-3 font-display text-3xl uppercase leading-[0.9] text-white md:text-4xl">
                    Active Cities
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/36">
                  8 points live
                </span>
              </div>
              <div className="relative overflow-hidden border border-white/10 bg-black">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10" />
                <div className="h-[320px] md:h-[430px] relative z-0">
                  <GlobalListenerMap />
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      <section id="radio-faq" className="px-6 py-20 scroll-shell-target">
        <div className="container layout-wide">
          <motion.div
            {...sectionReveal}
            className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#C2703E]">Transmission FAQ</span>
              <h2 className="section-display-title-compact mt-3 max-w-[8ch] text-white">HOUSE RULES</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/58 md:text-base">
                Enough structure to make the archive useful. No extra interface theater where a direct answer works better.
              </p>
            </div>
            <Link href="/contact" className="btn-pill-glass inline-flex items-center justify-center self-start lg:self-auto">
              Submit or Ask
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {radioFaqs.map(([question, answer], index) => (
              <motion.article
                key={question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.48 }}
                className="border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#E8B86D]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Sun className="h-4 w-4 text-white/22" />
                </div>
                <h3 className="font-display text-2xl uppercase leading-[0.92] text-white">{question}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/56">{answer}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <JoinSignalSection className="border-t border-white/10" />

      <FloatingFactsChip tone="nocturne" storageKey="floating-facts-chip-radio" />
    </div>
  );
}
