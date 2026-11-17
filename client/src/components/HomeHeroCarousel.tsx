import WorldEtching from "@/components/WorldEtching";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  X,
} from "lucide-react";
import { Link } from "wouter";
import HeroSection from "./HeroSection";
import CinematicHeroMedia, {
  type CinematicHeroMediaHandle,
  type HeroMediaTelemetry,
} from "./CinematicHeroMedia";
import HeroEventConsole from "./HeroEventConsole";
import YouTubeEmbed from "./ui/YouTubeEmbed";
import { useOptionalGlobalAudio } from "@/contexts/AudioContext";
import { HOME_CINEMATIC_OPENING } from "@/data/homeArtDirection";
import { ROUTES } from "@shared/routes";
import "@/styles/home-carousel.css";

interface SlideMeta {
  id: string;
  name: string;
  hudCode: string;
}

const SLIDES: readonly SlideMeta[] = [
  {
    id: "monolith-opening",
    name: "Monolith",
    hudCode: "01 / A HIGHER CONNECTION",
  },
  {
    id: "monolith-rooms",
    name: "Live Rooms",
    hudCode: "02 / CHICAGO ROOMS",
  },
  {
    id: "sunsets-fm",
    name: "SUNSETS.FM",
    hudCode: "03 / OPEN NETWORK",
  },
  {
    id: "chasing-radio",
    name: "Radio",
    hudCode: "04 / CHASING SUNSETS RADIO",
  },
] as const;

const HERO_DWELL_MS = 9_000;
const HERO_TRANSITION_MS = 1_200;
const DIPLO_VIDEO = "https://www.youtube.com/watch?v=QtKGMfeyPUE";

function formatMediaSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

/** Fine amber frequency accent paired with the opening "A HIGHER CONNECTION" eyebrow. */
function FrequencyAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`lg-frequency-svg ${className}`}
      viewBox="0 0 148 24"
      width="148"
      height="24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="lg-freq-line"
          x1="0"
          y1="12"
          x2="148"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffb86b" stopOpacity="0" />
          <stop offset="0.28" stopColor="#ffc888" stopOpacity="0.68" />
          <stop offset="0.52" stopColor="#fff0d8" stopOpacity="1" />
          <stop offset="0.76" stopColor="#ffb86b" stopOpacity="0.62" />
          <stop offset="1" stopColor="#ff9442" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="lg-freq-bloom"
          cx="76"
          cy="12"
          r="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#ffae57" stopOpacity="0.48" />
          <stop offset="1" stopColor="#ffae57" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="76" cy="12" rx="30" ry="10" fill="url(#lg-freq-bloom)" />
      <path
        d="M 2 12 H 50 L 55 10 L 59 14.5 L 63 6.5 L 67 17.5 L 72 3 L 76 20 L 80 5.5 L 84 16 L 88 8.5 L 92 13.5 L 96 12 H 146"
        stroke="url(#lg-freq-line)"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeHeroCarousel() {
  const globalAudio = useOptionalGlobalAudio();
  const [current, setCurrent] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"ltr" | "rtl">("ltr");
  const [rotating, setRotating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [initialSceneReady, setInitialSceneReady] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(true);
  const [diploPlaying, setDiploPlaying] = useState(false);
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [mediaTelemetry, setMediaTelemetry] = useState<HeroMediaTelemetry>({
    available: false,
    ready: false,
    playing: false,
    currentTime: 0,
    duration: 0,
  });

  const rootRef = useRef<HTMLElement>(null);
  const mediaHandleRef = useRef<CinematicHeroMediaHandle>(null);
  const watchFilmButtonRef = useRef<HTMLButtonElement>(null);
  const filmCloseButtonRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handlePosterReady = useCallback(() => {
    setInitialSceneReady(true);
  }, []);

  useEffect(() => {
    // Fallback so an uncached image never stalls rotation indefinitely after initial paint
    const safety = window.setTimeout(() => setInitialSceneReady(true), 900);
    return () => window.clearTimeout(safety);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      setReducedMotion(motion.matches);
      if (motion.matches) setRotating(false);
    };
    updateMotion();
    motion.addEventListener("change", updateMotion);

    const handleVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    setFullscreenSupported(Boolean(document.fullscreenEnabled));
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    if (rootRef.current) observer.observe(rootRef.current);

    return () => {
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (outgoing === null) return;
    const timer = window.setTimeout(() => {
      setOutgoing(null);
    }, HERO_TRANSITION_MS + 40);
    return () => window.clearTimeout(timer);
  }, [outgoing]);

  const advanceTo = useCallback(
    (nextRaw: number, direction: "ltr" | "rtl", pauseAutoplay: boolean) => {
      const next = ((nextRaw % SLIDES.length) + SLIDES.length) % SLIDES.length;
      if (pauseAutoplay) {
        setRotating(false);
      }
      if (next === current) return;

      if (reducedMotion) {
        setOutgoing(null);
        setCurrent(next);
        return;
      }

      setSlideDirection(direction);
      setOutgoing(current);
      setCurrent(next);
    },
    [current, reducedMotion]
  );

  // 9s of fully visible dwell time per slide (starts after initial scene is presentable
  // and after each 1.2s horizontal transition completes).
  useEffect(() => {
    if (
      !initialSceneReady ||
      !rotating ||
      reducedMotion ||
      hovering ||
      focusWithin ||
      !visible ||
      !inView ||
      diploPlaying ||
      filmModalOpen ||
      outgoing !== null
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      advanceTo(current + 1, "ltr", false);
    }, HERO_DWELL_MS);

    return () => window.clearTimeout(timer);
  }, [
    initialSceneReady,
    rotating,
    reducedMotion,
    hovering,
    focusWithin,
    visible,
    inView,
    diploPlaying,
    filmModalOpen,
    outgoing,
    current,
    advanceTo,
  ]);

  useEffect(() => {
    if (current !== 2) setDiploPlaying(false);
  }, [current]);

  useEffect(() => {
    if (!filmModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(
      () => filmCloseButtonRef.current?.focus(),
      0
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilmModalOpen(false);
        window.setTimeout(() => watchFilmButtonRef.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filmModalOpen]);

  const openFilmModal = () => {
    setRotating(false);
    // Preserve audio ownership: pause persistent radio playback before audible film opens
    globalAudio?.setPlaying(false);
    setFilmModalOpen(true);
  };

  const closeFilmModal = () => {
    setFilmModalOpen(false);
    window.setTimeout(() => watchFilmButtonRef.current?.focus(), 0);
  };

  const toggleHeroFullscreen = () => {
    const el = rootRef.current;
    if (!el || !document.fullscreenEnabled) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    } else {
      void el.requestFullscreen().catch(() => undefined);
    }
  };

  const showLiveMediaScrubber =
    current === 0 &&
    mediaTelemetry.available &&
    mediaTelemetry.ready &&
    mediaTelemetry.duration > 0;

  const progressPercent =
    showLiveMediaScrubber && mediaTelemetry.duration > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (mediaTelemetry.currentTime / mediaTelemetry.duration) * 100
          )
        )
      : 0;

  const renderScenePlateClass = (index: number) => {
    if (index === current) {
      if (outgoing === null || reducedMotion) return "is-scene-steady";
      return slideDirection === "ltr"
        ? "is-scene-entering-ltr"
        : "is-scene-entering-rtl";
    }
    if (index === outgoing) {
      return slideDirection === "ltr"
        ? "is-scene-exiting-ltr"
        : "is-scene-exiting-rtl";
    }
    return "is-scene-hidden";
  };

  const contentMotionClass =
    outgoing !== null && !reducedMotion
      ? slideDirection === "ltr"
        ? "is-copy-entering-ltr"
        : "is-copy-entering-rtl"
      : "";

  return (
    <>
      <section
        ref={rootRef}
        className="home-carousel monolith-hero-stage lg-hero-shell"
        aria-label="Monolith featured experiences"
        aria-roledescription="carousel"
        data-active-slide={SLIDES[current]?.id}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocusCapture={event => {
          setFocusWithin(true);
          if (
            !(event.target as HTMLElement).closest("[data-carousel-rotation]")
          ) {
            setRotating(false);
          }
        }}
        onBlurCapture={event => {
          if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
            setFocusWithin(false);
          }
        }}
        onTouchStart={event => {
          if (
            (event.target as HTMLElement).closest(
              "a, button, input, iframe, .lg-console-shell"
            )
          ) {
            return;
          }
          touchStart.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={event => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
              advanceTo(current + 1, "ltr", true);
            } else {
              advanceTo(current - 1, "rtl", true);
            }
          }
        }}
      >
        {/* LAYER 1 & 2: Horizontal sliding background scene track + scene-specific portal/orbit */}
        <div className="lg-backdrop-viewport" aria-hidden="true">
          {SLIDES.map((slide, index) => {
            const isCurrent = index === current;
            const isOutgoing = index === outgoing;
            if (!isCurrent && !isOutgoing) return null;

            return (
              <div
                key={slide.id}
                className={`lg-scene-plate lg-scene-plate-${slide.id} ${renderScenePlateClass(index)}`}
                data-scene-index={index}
              >
                {index === 0 && (
                  <>
                    <CinematicHeroMedia
                      ref={mediaHandleRef}
                      variant="opening"
                      active={isCurrent}
                      heroInView={inView}
                      documentVisible={visible}
                      pausedForModal={filmModalOpen}
                      priority
                      onPosterReady={handlePosterReady}
                      onTelemetryChange={setMediaTelemetry}
                    />
                    <div className="lg-opening-local-scrim" />
                  </>
                )}

                {index === 1 && (
                  <>
                    <CinematicHeroMedia variant="rooms" priority={false} />
                    <div className="lg-rooms-scrim" />
                  </>
                )}

                {index === 2 && (
                  <div className="lg-network-backdrop">
                    <img
                      className="home-network-globe"
                      src="/media/home-network/frequency-globe-20261007-1280.webp"
                      alt=""
                      width={1280}
                      height={1280}
                      decoding="async"
                    />
                  </div>
                )}

                {index === 3 && <div className="lg-radio-backdrop" />}
              </div>
            );
          })}
        </div>

        {/* One continuous artwork layer survives slide transitions. */}
        <WorldEtching />

        {/* LAYER 3A: Scene-specific foreground content */}
        <div
          className="home-carousel-panel lg-scene-stage"
          id="home-carousel-panel"
          aria-live={rotating ? "off" : "polite"}
          aria-atomic="true"
        >
          <div
            key={SLIDES[current].id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${current + 1} of ${SLIDES.length}: ${SLIDES[current].name}`}
            className={`home-carousel-slide lg-scene-content ${contentMotionClass}`}
          >
            {current === 0 && (
              <div className="lg-opening-stage">
                <div className="lg-opening-inner">
                  <div
                    className="lg-opening-copy"
                    data-home-hero-heading="true"
                  >
                    <div className="lg-opening-eyebrow-row">
                      <p
                        className="lg-opening-eyebrow"
                        data-home-hero-eyebrow="true"
                      >
                        A HIGHER CONNECTION
                      </p>
                      <FrequencyAccent />
                    </div>

                    <h1 id="home-title" className="lg-opening-title">
                      MONOLITH
                    </h1>

                    <p
                      className="lg-opening-subtitle"
                      data-home-hero-summary="true"
                    >
                      Supporting our DJs.
                      <br />
                      Connecting people through music.
                    </p>

                    <div className="lg-opening-actions">
                      <Link href={ROUTES.schedule} className="lg-btn-amber">
                        <span>Explore Events</span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </Link>

                      <button
                        ref={watchFilmButtonRef}
                        type="button"
                        className="lg-btn-glass"
                        onClick={openFilmModal}
                        aria-haspopup="dialog"
                        aria-expanded={filmModalOpen}
                      >
                        <span className="lg-btn-play-ring" aria-hidden="true">
                          <Play size={12} fill="currentColor" />
                        </span>
                        <span>Watch the Film</span>
                      </button>
                    </div>

                    <nav
                      className="lg-opening-awareness"
                      aria-label="Start exploring Monolith"
                    >
                      <Link href={ROUTES.schedule}>Shows</Link>
                      <Link href={ROUTES.artists}>Artists</Link>
                      <Link href={ROUTES.radio}>Radio</Link>
                      <Link href={ROUTES.newsletter} data-first-access="true">
                        First access
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {current === 1 && (
              <HeroSection
                isActive
                renderMedia={false}
                showInlineEventRail={false}
              />
            )}

            {current === 2 && (
              <div className="home-network-slide lg-slide-layout">
                <div className="home-network-copy">
                  <p className="home-eyebrow">
                    A Monolith Project <span>/</span> Coming soon
                  </p>
                  <p className="home-network-wordmark">SUNSETS.FM</p>
                  <h1>
                    Find your
                    <br />
                    <em>frequency.</em>
                  </h1>
                  <p className="home-network-intro">
                    From our dance floors to a world of sound. DJ sets, places,
                    and the people who bring them together.
                  </p>
                  <div className="home-network-actions">
                    <a href="#sunsets-fm-signup" className="lg-btn-amber">
                      <span>Get launch updates</span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </a>
                    <Link
                      href={ROUTES.sunsetsFM}
                      className="home-network-link"
                    >
                      Discover SUNSETS.FM{" "}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <figure className="home-diplo-feature">
                  {diploPlaying ? (
                    <div className="home-diplo-cover is-playing">
                      <YouTubeEmbed
                        url={DIPLO_VIDEO}
                        title="Diplo — Live in Antarctica"
                        className="home-diplo-player"
                        loading="eager"
                        autoplay
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="home-diplo-cover"
                      aria-label="Play Diplo live in Antarctica here on the page"
                      onClick={() => {
                        setRotating(false);
                        globalAudio?.setPlaying(false);
                        setDiploPlaying(true);
                      }}
                    >
                      <img
                        src="/media/home-network/diplo-antarctica-cover-20261007-1280.webp"
                        srcSet="/media/home-network/diplo-antarctica-cover-20261007-640.webp 640w, /media/home-network/diplo-antarctica-cover-20261007-1280.webp 1280w"
                        sizes="(min-width: 1000px) 55vw, 90vw"
                        width={1280}
                        height={720}
                        alt="Diplo — Live in Antarctica"
                      />
                      <span className="home-cover-play">
                        <Play
                          size={18}
                          fill="currentColor"
                          aria-hidden="true"
                        />{" "}
                        Play the set
                      </span>
                    </button>
                  )}
                  <figcaption>
                    <div>
                      <strong>Diplo</strong>
                      <span>Live in Antarctica</span>
                    </div>
                    <span>
                      Selected from SUNSETS.FM
                      <br />
                      Original recording by Diplo ·{" "}
                      <a
                        href={DIPLO_VIDEO}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="home-diplo-source"
                        aria-label="Watch Diplo live in Antarctica on YouTube"
                      >
                        Watch on YouTube{" "}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </a>
                    </span>
                  </figcaption>
                </figure>
              </div>
            )}

            {current === 3 && (
              <div className="home-radio-slide lg-slide-layout">
                <div className="home-network-copy">
                  <p className="home-eyebrow">
                    The sound of Monolith <span>/</span> Listen now
                  </p>
                  <p className="home-network-wordmark">CHASING SUNSETS RADIO</p>
                  <p className="home-radio-powered-by">
                    powered by <Link href={ROUTES.sunsetsFM}>sunsets.fm</Link>
                  </p>
                  <h1>
                    Stay on the
                    <br />
                    <em>frequency.</em>
                  </h1>
                  <p className="home-network-intro">
                    The sets that started it. Meet the artists, explore the
                    collection, and hear where our next chapter begins.
                  </p>
                  <div className="home-network-actions">
                    <Link
                      href={`${ROUTES.radio}#radio-featured`}
                      className="lg-btn-amber"
                    >
                      <span>Enter the listening room</span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                    <Link
                      href={ROUTES.openNetwork}
                      className="home-network-link"
                    >
                      The Monolith connection{" "}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
                <Link
                  href={`${ROUTES.radio}#radio-archive`}
                  className="home-radio-covers"
                  aria-label="Explore the Chasing SUN(SETS) Radio collection"
                >
                  <img
                    src="/media/chasing-radio/benchek-sunset-protocol-640.webp"
                    alt="Benchek — Sunset Protocol"
                    width={640}
                    height={640}
                  />
                  <img
                    src="/media/chasing-radio/sommers-uk-episode-011-640.webp"
                    alt="SOMMERS (UK) — Episode 011"
                    width={640}
                    height={640}
                  />
                  <img
                    src="/media/chasing-radio/ewerseen-collab-vol-2-640.webp"
                    alt="Ewerseen — Collaboration Volume 2"
                    width={640}
                    height={640}
                  />
                  <span>Original transmissions. One shared frequency.</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* LAYER 3B: Persistent Liquid-Glass Interface (stationary controls + independent bottom console) */}
        <div className="lg-persistent-deck">
          <div className="home-carousel-controls lg-hud-bar">
            {/* Left slot: Real HTML5 video transport when active, calm scene readout otherwise */}
            <div className="lg-hud-media">
              {showLiveMediaScrubber ? (
                <div className="lg-media-transport">
                  <button
                    type="button"
                    className="lg-media-play-btn"
                    aria-label={
                      mediaTelemetry.playing
                        ? "Pause background film"
                        : "Play background film"
                    }
                    onClick={() => mediaHandleRef.current?.togglePlayback()}
                  >
                    {mediaTelemetry.playing ? (
                      <Pause size={15} aria-hidden="true" />
                    ) : (
                      <Play size={15} aria-hidden="true" />
                    )}
                  </button>
                  <span className="lg-media-time" aria-live="off">
                    {formatMediaSeconds(mediaTelemetry.currentTime)} /{" "}
                    {formatMediaSeconds(mediaTelemetry.duration)}
                  </span>
                  <div className="lg-media-scrubber-wrap">
                    <div
                      className="lg-media-scrubber-track"
                      style={
                        {
                          "--scrubber-pct": `${progressPercent}%`,
                        } as React.CSSProperties
                      }
                      aria-hidden="true"
                    >
                      <div className="lg-media-scrubber-fill" />
                      <svg
                        className="lg-media-scrubber-pulse"
                        viewBox="0 0 36 16"
                        width="36"
                        height="16"
                        fill="none"
                      >
                        <path
                          d="M 1 8 H 8 L 11 5 L 14 11 L 18 2 L 21 14 L 24 5 L 27 10 L 30 8 H 35"
                          stroke="#ffd399"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="range"
                      className="lg-media-scrubber-input"
                      min={0}
                      max={mediaTelemetry.duration}
                      step={0.1}
                      value={mediaTelemetry.currentTime}
                      aria-label="Seek background film"
                      onChange={event => {
                        const nextTime = Number.parseFloat(event.target.value);
                        mediaHandleRef.current?.seekTo(nextTime);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="lg-scene-readout" aria-hidden="true">
                  <span className="lg-scene-readout-dot" />
                  <span>{SLIDES[current]?.hudCode}</span>
                </div>
              )}
            </div>

            {/* Center slot: Stationary slide indicators */}
            <div
              className="home-carousel-selectors lg-slide-selectors"
              role="group"
              aria-label="Choose a homepage slide"
            >
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show ${slide.name} slide`}
                  aria-current={current === index ? "true" : undefined}
                  aria-controls="home-carousel-panel"
                  onClick={() => {
                    const dir = index >= current ? "ltr" : "rtl";
                    advanceTo(index, dir, true);
                  }}
                >
                  <span className="lg-selector-dot" aria-hidden="true" />
                  <span className="lg-selector-num">0{index + 1}</span>
                  <span className="lg-selector-label">{slide.name}</span>
                </button>
              ))}
            </div>

            {/* Right slot: Carousel autoplay, prev/next, and fullscreen */}
            <div className="home-carousel-arrows lg-hud-actions">
              <button
                type="button"
                data-carousel-rotation
                onClick={() => setRotating(value => !value)}
                aria-label={
                  rotating ? "Pause homepage slides" : "Start homepage slides"
                }
              >
                {rotating ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button
                type="button"
                onClick={() => advanceTo(current - 1, "rtl", true)}
                aria-label="Previous homepage slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => advanceTo(current + 1, "ltr", true)}
                aria-label="Next homepage slide"
              >
                <ChevronRight size={18} />
              </button>
              {fullscreenSupported && (
                <button
                  type="button"
                  className="lg-fullscreen-btn"
                  onClick={toggleHeroFullscreen}
                  aria-label={
                    isFullscreen
                      ? "Exit fullscreen hero"
                      : "Enter fullscreen hero"
                  }
                >
                  {isFullscreen ? (
                    <Minimize2 size={15} aria-hidden="true" />
                  ) : (
                    <Maximize2 size={15} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Real available Monolith film modal ("Watch the Film") */}
        {filmModalOpen && (
          <div
            className="lg-film-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="monolith-film-dialog-title"
            onClick={event => {
              if (event.target === event.currentTarget) {
                closeFilmModal();
              }
            }}
          >
            <div className="lg-film-modal-card">
              <header className="lg-film-modal-header">
                <div>
                  <p className="lg-film-modal-kicker">
                    The Monolith Project · Official Live Recording
                  </p>
                  <h2 id="monolith-film-dialog-title">
                    {HOME_CINEMATIC_OPENING.watchFilmTitle}
                  </h2>
                </div>
                <button
                  ref={filmCloseButtonRef}
                  type="button"
                  className="lg-film-modal-close"
                  onClick={closeFilmModal}
                  aria-label="Close film"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </header>

              <div className="lg-film-modal-frame">
                <YouTubeEmbed
                  url={HOME_CINEMATIC_OPENING.watchFilmUrl}
                  title={HOME_CINEMATIC_OPENING.watchFilmTitle}
                  className="lg-film-modal-iframe"
                  loading="eager"
                  autoplay
                />
              </div>

              <footer className="lg-film-modal-footer">
                <Link
                  href={ROUTES.archive}
                  className="home-network-link"
                  onClick={() => setFilmModalOpen(false)}
                >
                  Explore the Archive{" "}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
                <a
                  href={HOME_CINEMATIC_OPENING.watchFilmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-network-link"
                >
                  Watch on YouTube <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </footer>
            </div>
          </div>
        )}
      </section>
      <div className="home-status-rail">
        <HeroEventConsole
          heroInView={inView}
          documentVisible={visible}
          reducedMotion={reducedMotion}
          pausedExternal={filmModalOpen || diploPlaying}
        />
      </div>
    </>
  );
}
