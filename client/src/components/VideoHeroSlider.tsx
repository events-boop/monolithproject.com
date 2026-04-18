import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import YouTubeEmbed from "./ui/YouTubeEmbed";

interface SlideSource {
  srcSet: string;
  type: string;
  media?: string;
  sizes?: string;
}

export interface Slide {
  type: "video" | "image" | "youtube";
  src: string;
  poster?: string;
  sources?: SlideSource[];
  sizes?: string;
  posterSources?: SlideSource[];
  posterSizes?: string;
  alt?: string;
  credit?: string;
  caption?: string;
}

interface VideoHeroSliderProps {
  slides: Slide[];
  onSlideChange?: (index: number) => void;
}

function ResponsiveSlideImage({
  alt,
  ariaHidden,
  className,
  fetchPriority = "auto",
  sizes,
  sources,
  src,
}: {
  alt: string;
  ariaHidden?: boolean;
  className: string;
  fetchPriority?: "auto" | "high" | "low";
  sizes?: string;
  sources?: SlideSource[];
  src: string;
}) {
  return (
    <picture>
      {sources?.map((source, index) => (
        <source
          key={`${source.type}-${index}`}
          media={source.media}
          sizes={source.sizes || sizes}
          srcSet={source.srcSet}
          type={source.type}
        />
      ))}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={fetchPriority === "high" ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
        aria-hidden={ariaHidden}
      />
    </picture>
  );
}

export default function VideoHeroSlider({ slides, onSlideChange }: VideoHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [loadVideo, setLoadVideo] = useState(false);
  const [canStartPrimaryVideo, setCanStartPrimaryVideo] = useState(() => {
    if (typeof document === "undefined") return true;
    return !document.getElementById("initial-loader");
  });
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const goTo = useCallback((index: number) => {
    if (!slides || slides.length === 0) return;
    const next = ((index % slides.length) + slides.length) % slides.length;
    setCurrentSlide(next);
    onSlideChange?.(next);
  }, [slides, onSlideChange]);

  const prev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);
  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-advance for all slides
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, 7000); // 7 seconds per slide
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  const slide = slides[currentSlide];
  const slideFetchPriority = currentSlide === 0 ? "high" : "auto";

  useEffect(() => {
    if (canStartPrimaryVideo) return;

    const loader = document.getElementById("initial-loader");
    if (!loader) {
      setCanStartPrimaryVideo(true);
      return;
    }

    const handleLoaderExit = () => setCanStartPrimaryVideo(true);
    window.addEventListener("monolith:loader-exit", handleLoaderExit, { once: true });
    return () => window.removeEventListener("monolith:loader-exit", handleLoaderExit);
  }, [canStartPrimaryVideo]);

  // Avoid competing with critical JS/CSS on slow connections: keep the poster image
  // until the browser is idle, and skip video entirely for Save-Data / 2g/3g.
  useEffect(() => {
    if (loadVideo) return;
    if (reduceMotion) return;
    if (!slide) return;
    if (slide.type !== "video" && slide.type !== "youtube") return;
    if (currentSlide === 0 && slide.type === "video" && !canStartPrimaryVideo) return;

    const id = window.setTimeout(() => setLoadVideo(true), 0);
    return () => window.clearTimeout(id);
  }, [canStartPrimaryVideo, currentSlide, loadVideo, reduceMotion, slide?.type]);

  useEffect(() => {
    if (!loadVideo || reduceMotion || slide?.type !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay can be blocked in some environments; muted inline video is still preferred.
      }
    };

    void attemptPlay();
  }, [currentSlide, loadVideo, reduceMotion, slide?.type]);

  if (!slide) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {slide.type === "youtube" ? (
            <div className="absolute inset-0 overflow-hidden bg-black">
              {loadVideo || !slide.poster ? (
                <YouTubeEmbed
                  url={slide.src}
                  title={slide.alt || slide.caption || "Monolith Project video"}
                  autoplay={!reduceMotion}
                  muted
                  controls={false}
                  loop
                  playsInline
                  allowFullScreen={false}
                  loading="eager"
                  className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
                />
              ) : (
                <ResponsiveSlideImage
                  src={slide.poster}
                  alt=""
                  ariaHidden
                  fetchPriority={slideFetchPriority}
                  sources={slide.posterSources}
                  sizes={slide.posterSizes}
                  className="w-full h-full object-cover object-center md:object-[80%_center]"
                />
              )}
            </div>
          ) : slide.type === "video" ? (
            <div className="relative w-full h-full">
              {/* Persistent Poster/Background to prevent flicker */}
              {slide.poster && (
                <ResponsiveSlideImage
                  src={slide.poster}
                  alt=""
                  ariaHidden
                  fetchPriority={slideFetchPriority}
                  sources={slide.posterSources}
                  sizes={slide.posterSizes}
                  className="absolute inset-0 w-full h-full object-cover object-center md:object-[80%_center]"
                />
              )}
              
              {/* Video Layer fades in over poster once ready */}
              {loadVideo && (
                <motion.video
                  ref={videoRef}
                  initial={{ opacity: 0 }}
                  onCanPlay={() => {
                    if (videoRef.current) {
                      videoRef.current.style.opacity = "1";
                    }
                  }}
                  src={slide.src}
                  autoPlay={!reduceMotion}
                  loop={!reduceMotion}
                  muted={isMuted}
                  playsInline
                  preload={currentSlide === 0 ? "auto" : "metadata"}
                  className="absolute inset-0 w-full h-full object-cover object-center md:object-[80%_center] transition-opacity duration-1000 ease-in-out"
                  aria-hidden="true"
                  tabIndex={-1}
                  style={{ opacity: 0 }}
                />
              )}
            </div>
          ) : (
            <ResponsiveSlideImage
              src={slide.src}
              alt={slide.alt || ""}
              fetchPriority={slideFetchPriority}
              sources={slide.sources}
              sizes={slide.sizes}
              className="w-full h-full object-cover object-center md:object-[80%_center]"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Brighter center, darker edges */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.14),rgba(0,0,0,0.4)_80%,rgba(0,0,0,0.5)_100%)]" />

      {/* Left/Right arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 hidden md:flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 hidden md:flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom bar: indicators + credit + mute */}
      <div className="absolute bottom-24 md:bottom-36 left-0 right-0 z-20 px-5 md:px-8 hidden sm:flex items-end justify-between">
        {/* Left: Slide indicators */}
        <div className="flex gap-1.5 md:gap-2">
          {slides.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
              className={`h-[2px] transition-all duration-500 ${index === currentSlide
                ? "bg-primary w-8 md:w-10"
                : "bg-white/20 w-4 md:w-5 hover:bg-white/40"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70`}
            />
          ))}
        </div>

        {/* Right: Credit + Mute */}
        <div className="flex items-center gap-4">
          {slide.credit && (
            <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase hidden md:block">
              Photo: {slide.credit}
            </span>
          )}
          {slide.type === "video" && (loadVideo || !slide.poster) && !reduceMotion && (
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 border border-white/10 text-white/40 hover:text-white hover:border-white/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
