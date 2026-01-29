/*
  DESIGN: Cosmic Mysticism - Video Background Hero Slider
  - Full-screen video background
  - Left/right navigation arrows
  - Multiple slides (video + images)
  - Smooth transitions
*/

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

interface Slide {
  type: "video" | "image";
  src: string;
  alt?: string;
}

const slides: Slide[] = [
  { type: "video", src: "/videos/hero-video-1.mp4" },
  { type: "image", src: "/images/hero-monolith.jpg", alt: "The Monolith" },
  { type: "image", src: "/images/chasing-sunsets.jpg", alt: "Chasing Sun(Sets)" },
];

export default function VideoHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-advance for images (not videos)
  useEffect(() => {
    const slide = slides[currentSlide];
    if (slide.type === "image") {
      const timer = setTimeout(nextSlide, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Slides */}
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {currentSlideData.type === "video" ? (
            <video
              ref={videoRef}
              src={currentSlideData.src}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <motion.div className="w-full h-full overflow-hidden">
              <motion.img
                src={currentSlideData.src}
                alt={currentSlideData.alt || ""}
                initial={{ scale: 1 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 10, ease: "linear" }}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays for text readability - Top and Bottom Focused */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
      <div className="absolute inset-0 bg-black/20 z-10" /> {/* General dimming for contrast */}

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center z-20">
        <motion.button
          onClick={prevSlide}
          whileHover={{ scale: 1.1, x: 4 }}
          whileTap={{ scale: 0.95 }}
          className="ml-4 md:ml-8 p-3 bg-background/20 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-background/40 transition-all rounded-full"
        >
          <ChevronLeft size={24} />
        </motion.button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center z-20">
        <motion.button
          onClick={nextSlide}
          whileHover={{ scale: 1.1, x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="mr-4 md:mr-8 p-3 bg-background/20 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-background/40 transition-all rounded-full"
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Slide Indicators - Clean Lines */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-[2px] rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-primary w-12 shadow-[0_0_10px_rgba(212,165,116,0.5)]"
              : "bg-white/20 w-8 hover:bg-white/40"
              }`}
          />
        ))}
      </div>

      {/* Mute/Unmute Button (only show when video is playing) */}
      {currentSlideData.type === "video" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleMute}
          className="absolute bottom-36 right-8 z-20 p-3 bg-background/20 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-background/40 transition-all rounded-full"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      )}
    </div>
  );
}
