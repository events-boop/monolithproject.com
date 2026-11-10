import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Link } from "wouter";
import HeroSection from "./HeroSection";
import YouTubeEmbed from "./ui/YouTubeEmbed";
import { ROUTES } from "@shared/routes";
import "@/styles/home-carousel.css";

const slides = ["Monolith", "SUNSETS.FM", "Radio"];
const diploVideo = "https://www.youtube.com/watch?v=QtKGMfeyPUE";

export default function HomeHeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(true);
  const [inView, setInView] = useState(true);
  // The Diplo film plays in place on its slide; the slide must not rotate away while it does.
  const [diploPlaying, setDiploPlaying] = useState(false);
  const root = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setRotating(!motion.matches);
    update();
    motion.addEventListener("change", update);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );
    if (root.current) observer.observe(root.current);
    return () => {
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!rotating || hovering || !visible || !inView || diploPlaying) return;
    const timer = window.setTimeout(
      () => setCurrent(value => (value + 1) % slides.length),
      9000
    );
    return () => window.clearTimeout(timer);
  }, [current, rotating, hovering, visible, inView, diploPlaying]);

  useEffect(() => {
    if (current !== 1) setDiploPlaying(false);
  }, [current]);

  function choose(index: number) {
    setRotating(false);
    setCurrent((index + slides.length) % slides.length);
  }

  return (
    <section
      ref={root}
      className="home-carousel"
      aria-label="Explore Monolith"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={event => {
        if (!(event.target as HTMLElement).closest("[data-carousel-rotation]"))
          setRotating(false);
      }}
      onTouchStart={event => {
        if ((event.target as HTMLElement).closest("a, button, iframe")) return;
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
        if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy))
          choose(current + (dx < 0 ? 1 : -1));
      }}
    >
      <div
        className="home-carousel-panel"
        id="home-carousel-panel"
        aria-live={rotating ? "off" : "polite"}
        aria-atomic="true"
      >
        <div
          key={current}
          role="group"
          aria-roledescription="slide"
          aria-label={`${current + 1} of ${slides.length}: ${slides[current]}`}
          className="home-carousel-slide"
        >
          {current === 0 && <HeroSection />}
          {current === 1 && (
            <div className="home-network-slide">
              <img
                className="home-network-globe"
                src="/media/home-network/frequency-globe-20261007-1280.webp"
                alt=""
                width={1280}
                height={1280}
              />
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
                  <a href="#sunsets-fm-signup" className="home-network-primary">
                    Get launch updates{" "}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  <Link href={ROUTES.openNetwork} className="home-network-link">
                    Explore the network{" "}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <figure className="home-diplo-feature">
                {diploPlaying ? (
                  <div className="home-diplo-cover is-playing">
                    <YouTubeEmbed
                      url={diploVideo}
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
                      <Play size={20} fill="currentColor" aria-hidden="true" />{" "}
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
                      href={diploVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="home-diplo-source"
                    >
                      Watch on YouTube{" "}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  </span>
                </figcaption>
              </figure>
            </div>
          )}
          {current === 2 && (
            <div className="home-radio-slide">
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
                    className="home-network-primary"
                  >
                    Enter the listening room{" "}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                  <Link href={ROUTES.openNetwork} className="home-network-link">
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
      <div className="home-carousel-controls">
        <div
          className="home-carousel-selectors"
          role="group"
          aria-label="Choose a homepage slide"
        >
          {slides.map((name, index) => (
            <button
              key={name}
              type="button"
              aria-label={`Show ${name} slide`}
              aria-current={current === index ? "true" : undefined}
              aria-controls="home-carousel-panel"
              onClick={() => choose(index)}
            >
              <span>0{index + 1}</span>
              {name}
            </button>
          ))}
        </div>
        <div className="home-carousel-arrows">
          <button
            type="button"
            data-carousel-rotation
            onClick={() => setRotating(value => !value)}
            aria-label={
              rotating ? "Pause homepage slides" : "Start homepage slides"
            }
          >
            {rotating ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            onClick={() => choose(current - 1)}
            aria-label="Previous homepage slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => choose(current + 1)}
            aria-label="Next homepage slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
