import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const dialogRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => {
    if (index === null) return null;
    return media[index] ?? null;
  }, [index, media]);

  const activeCaption = useMemo(() => {
    if (!active) return null;
    if (active.kind === "image") return active.alt || null;
    return null;
  }, [active]);

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + media.length) % media.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % media.length));

  // Keyboard navigation + body scroll lock
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

    // Focus the dialog for screen readers
    dialogRef.current?.focus();

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
            <h2 className="font-display text-4xl md:text-5xl text-current uppercase opacity-95">
              {title}
            </h2>
          </div>
          {description && (
            <p className="opacity-60 max-w-sm text-sm leading-relaxed text-current">
              {description}
            </p>
          )}
        </div>

        {/* Masonry-style Grid */}
        <div className={`${columns} gap-4`}>
          {media.map((item, i) => (
            <motion.button
              key={`${item.kind}-${item.src}-${i}`}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setIndex(i)}
              className="relative group cursor-pointer overflow-hidden rounded-lg break-inside-avoid mb-4 bg-white/5 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              aria-label={item.kind === "video" ? "Open video" : (item.kind === "image" && item.alt) ? `View: ${item.alt}` : "Open image"}
            >
              {item.kind === "video" ? (
                <div className="aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  <img
                    src={item.poster || "/images/hero-video-short-poster.jpg"}
                    alt=""
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.alt || ""}
                  className="w-full h-auto object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Caption on hover for images */}
              {item.kind === "image" && item.alt && (
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                  <span className="text-white text-xs font-mono tracking-widest uppercase">
                    {item.alt}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery viewer"
            tabIndex={-1}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={close}
              aria-label="Close gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative z-10 w-full max-w-5xl"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/60" aria-live="polite">
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

              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/95 flex items-center justify-center">
                {active.kind === "video" ? (
                  <video
                    className="w-full max-h-[80vh] object-contain"
                    controls
                    playsInline
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

              {/* Caption bar */}
              {activeCaption && (
                <div className="mt-3 text-center">
                  <span className="text-white/70 text-xs font-mono tracking-widest uppercase">
                    {activeCaption}
                  </span>
                </div>
              )}

              {/* Navigation */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 md:-left-14 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-black/60 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 md:-right-14 top-1/2 -translate-y-1/2 p-3 rounded-full border border-white/10 bg-black/60 text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
