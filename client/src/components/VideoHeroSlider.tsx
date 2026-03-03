import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";

export interface Slide {
  type: "video" | "image" | "youtube";
  src: string;
  poster?: string;
  alt?: string;
  credit?: string;
  caption?: string;
}

interface VideoHeroSliderProps {
  slides: Slide[];
}

export default function VideoHeroSlider({ slides }: VideoHeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [loadVideo, setLoadVideo] = useState(false);
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const goTo = useCallback((index: number) => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide(((index % slides.length) + slides.length) % slides.length);
  }, [slides]);

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

  // Avoid competing with critical JS/CSS on slow connections: keep the poster image
  // until the browser is idle, and skip video entirely for Save-Data / 2g/3g.
  useEffect(() => {
    if (loadVideo) return;
    if (reduceMotion) return;
    if (!slide) return;
    if (slide.type !== "video") return;

    const conn = (navigator as any).connection as { saveData?: boolean; effectiveType?: string } | undefined;
    if (conn?.saveData) return;
    if (conn?.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) return;

    const w = window as any;
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setLoadVideo(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(() => setLoadVideo(true), 2500);
    return () => window.clearTimeout(id);
  }, [loadVideo, reduceMotion, slide?.type]);

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
            <div className="w-full h-full relative" style={{ paddingTop: '56.25%' }}>
              <ReactPlayer
                url={slide.src}
                playing={!reduceMotion}
                loop={true}
                muted={isMuted}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                config={{
                  youtube: {
                    // @ts-ignore
                    playerVars: {
                      showinfo: 0,
                      controls: 0,
                      modestbranding: 1,
                      rel: 0,
                      fs: 0,
                      disablekb: 1,
                      iv_load_policy: 3
                    }
                  }
                }}
              />
            </div>
          ) : slide.type === "video" ? (
            loadVideo || !slide.poster ? (
              <video
                ref={videoRef}
                src={slide.src}
                poster={slide.poster}
                autoPlay={!reduceMotion}
                loop={!reduceMotion}
                muted={isMuted}
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-hidden="true"
                tabIndex={-1}
              />
            ) : (
              <img
                src={slide.poster}
                alt=""
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover object-[80%_center]"
                aria-hidden="true"
              />
            )
          ) : (
            <img
              src={slide.src}
              alt={slide.alt || ""}
              decoding="async"
              className="w-full h-full object-cover object-[80%_center]"
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
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom bar: indicators + credit + mute */}
      <div className="absolute bottom-36 left-0 right-0 z-20 px-6 md:px-8 flex items-end justify-between">
        {/* Left: Slide indicators */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
              className={`h-[2px] transition-all duration-500 ${index === currentSlide
                ? "bg-primary w-10"
                : "bg-white/20 w-5 hover:bg-white/40"
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
          {(slide.type === "video" || slide.type === "youtube") && (loadVideo || !slide.poster) && !reduceMotion && (
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
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
