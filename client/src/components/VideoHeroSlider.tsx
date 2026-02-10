import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  type: "video" | "image";
  src: string;
  alt?: string;
  credit?: string;
  caption?: string;
}

const slides: Slide[] = [
  {
    type: "video",
    src: "/videos/hero-video-1.mp4",
    caption: "THE MONOLITH PROJECT",
  },
  {
    type: "image",
    src: "/images/lazare-recap.png",
    alt: "Lazare at Monolith Project",
    credit: "JP Quindara",
    caption: "LAZARE | MONOLITH PROJECT",
  },
  {
    type: "image",
    src: "/images/hero-monolith.jpg",
    alt: "The Monolith",
    caption: "CHICAGO, 2025",
  },
  {
    type: "image",
    src: "/images/chasing-sunsets.jpg",
    alt: "Chasing Sun(Sets)",
    caption: "CHASING SUN(SETS)",
  },
  {
    type: "image",
    src: "/images/autograf-recap.jpg",
    alt: "Autograf live set",
    credit: "TBA",
    caption: "AUTOGRAF | LIVE SET",
  },
];

export default function VideoHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const goTo = useCallback((index: number) => {
    setCurrentSlide(((index % slides.length) + slides.length) % slides.length);
  }, []);

  const prev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);
  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-advance for images
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const slide = slides[currentSlide];
    if (slide.type === "image") {
      timerRef.current = setTimeout(next, 6000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, next]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  const slide = slides[currentSlide];

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
          {slide.type === "video" ? (
            <video
              ref={videoRef}
              src={slide.src}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={slide.src}
              alt={slide.alt || ""}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Brighter center, darker edges */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(0,0,0,0.14),rgba(0,0,0,0.4)_80%,rgba(0,0,0,0.5)_100%)]" />

      {/* Left/Right arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
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
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-[2px] transition-all duration-500 ${
                index === currentSlide
                  ? "bg-primary w-10"
                  : "bg-white/20 w-5 hover:bg-white/40"
              }`}
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
          {slide.type === "video" && (
            <button
              onClick={toggleMute}
              className="p-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
