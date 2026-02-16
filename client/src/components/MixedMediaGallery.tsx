import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MediaItem, homeGallery } from "@/data/galleryData";

interface MixedMediaGalleryProps {
  media?: MediaItem[];
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
  columns?: string;
}

export default function MixedMediaGallery({
  media = homeGallery,
  title = "Captured Moments",
  subtitle = "Visual Archives",
  description = "A collection of fragments from our past gatherings. Immersive soundscapes and visual memories.",
  className = "bg-background border-t border-white/5",
  style,
  columns = "columns-1 md:columns-2 lg:columns-3",
}: MixedMediaGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  const active = useMemo(() => {
    if (index === null) return null;
    return media[index] ?? null;
  }, [index, media]);

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + media.length) % media.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % media.length));

  useEffect(() => {
    if (index === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [index]);

  return (
    <section className={`py-24 ${className}`} style={style}>
      <div className="container max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            {subtitle && (
              <span className="font-mono text-xs tracking-widest text-primary mb-2 block uppercase opacity-80">
                {subtitle}
              </span>
            )}
            <h2 className="font-display text-4xl md:text-5xl text-white uppercase opacity-95">
              {title}
            </h2>
          </div>
          {description && (
            <p className="opacity-60 max-w-sm text-sm leading-relaxed text-white">
              {description}
            </p>
          )}
        </div>

        {/* Masonry-style Grid */}
        <div className={`${columns} gap-4 space-y-4`}>
          {media.map((item, i) => (
            <button
              key={`${item.kind}-${item.src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className="relative group cursor-pointer overflow-hidden rounded-lg break-inside-avoid bg-white/5 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label={item.kind === "video" ? "Open video" : "Open image"}
            >
              {item.kind === "video" ? (
                <div className="aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform group-hover:scale-110">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  <img
                    src={item.poster || "/images/hero-video-short-poster.jpg"}
                    alt=""
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.alt || ""}
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.01]"
                  loading="lazy"
                  decoding="async"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
            </button>
          ))}
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <button
            type="button"
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={close}
            aria-label="Close gallery"
          />

          <div className="relative z-10 w-full max-w-5xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/60">
                {index !== null ? `${index + 1} / ${media.length}` : null}
              </div>
              <button
                type="button"
                onClick={close}
                className="p-2 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black flex items-center justify-center bg-black/95">
              {active.kind === "video" ? (
                <video
                  className="w-full max-h-[80vh] object-contain"
                  controls
                  playsInline
                  autoPlay
                  poster={active.poster}
                >
                  <source src={active.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={active.src}
                  alt={active.alt || ""}
                  className="w-full max-h-[80vh] object-contain"
                  decoding="async"
                />
              )}
            </div>

            {/* Navigation Buttons placed outside container for easier clicking on mobile or overlaying */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 p-3 rounded-full border border-white/10 bg-black/50 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 p-3 rounded-full border border-white/10 bg-black/50 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
