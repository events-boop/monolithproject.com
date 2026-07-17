import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";
import { homeGallery } from "@/data/galleryData";
import type { ArchiveExternalGallery, MediaItem } from "@/data/galleryData";
import ResponsiveImage from "./ResponsiveImage";

const GalleryLightbox = lazy(() => import("./GalleryLightbox"));

type GalleryPhoto = {
  key: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  media: MediaItem;
  kind: MediaItem["kind"];
  label: string;
  caption?: string;
  credit?: string;
  description?: string;
};

interface MixedMediaGalleryProps {
  media?: MediaItem[];
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
  dense?: boolean;
  accentColor?: string;
  externalGallery?: ArchiveExternalGallery;
}

export default function MixedMediaGallery({
  media = homeGallery,
  title = "Event Archive",
  subtitle = "Gallery",
  description = "Photos, videos, and recaps from past Monolith nights.",
  className = "bg-background border-t border-white/5 relative",
  style,
  dense = false,
  accentColor = "#FFFFFF",
  externalGallery,
}: MixedMediaGalleryProps) {
  const [index, setIndex] = useState(-1);
  const isLightboxOpen = index >= 0;
  const hasMedia = media.length > 0;
  const mediaCountLabel = externalGallery
    ? `${media.length} on-site ${media.length === 1 ? "preview" : "previews"}`
    : media.some(item => item.kind === "video")
      ? `${media.length} ${media.length === 1 ? "item" : "items"}`
      : `${media.length} ${media.length === 1 ? "photo" : "photos"}`;

  const photos = useMemo<GalleryPhoto[]>(() => {
    return media.map(item => {
      const base =
        item.kind === "video"
          ? {
              src: item.poster,
              width: item.posterWidth,
              height: item.posterHeight,
            }
          : { src: item.src, width: item.width, height: item.height };

      return {
        key: item.id,
        ...base,
        alt: item.alt,
        title: item.caption || item.alt,
        media: item,
        kind: item.kind,
        caption: item.caption,
        description: item.description,
        credit: item.credit,
        label:
          item.kind === "video"
            ? `Open video: ${item.caption || item.alt}`
            : `Open image: ${item.caption || item.alt}`,
      };
    });
  }, [media]);

  return (
    <section className={`gallery-shell relative ${className}`} style={style}>
      <div className="container layout-wide px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            {subtitle && (
              <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-white/70 mb-4 block uppercase">
                {subtitle}
              </span>
            )}
            <h2 className="font-display text-4xl md:text-6xl leading-[0.85] tracking-tight text-white uppercase mb-4">
              {title}
            </h2>
            {description && (
              <p className="font-sans text-base md:text-lg text-white/70 leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>
          {hasMedia && (
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/70">
              {mediaCountLabel}
            </p>
          )}
        </div>

        {externalGallery ? (
          <motion.a
            href={externalGallery.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${externalGallery.label}: ${externalGallery.context}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative mb-10 grid overflow-hidden border bg-white/[0.025] p-5 transition-colors duration-500 hover:bg-white/[0.055] md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-7"
            style={{ borderColor: `${accentColor}2E` }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-px opacity-80"
              style={{ background: accentColor }}
            />
            <div className="relative flex items-start gap-4">
              <span
                className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border bg-black/30"
                style={{ borderColor: `${accentColor}45`, color: accentColor }}
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <span
                  className="block font-mono text-[9px] font-black uppercase tracking-[0.28em]"
                  style={{ color: accentColor }}
                >
                  Official Photo Collection
                </span>
                <p className="mt-2 font-display text-xl uppercase tracking-[0.08em] text-white md:text-2xl">
                  {externalGallery.context}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                  {externalGallery.provider}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
                  {externalGallery.note}
                </p>
              </div>
            </div>

            <span className="relative mt-6 inline-flex min-h-11 items-center justify-center gap-3 border border-white/18 px-5 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white transition-all duration-300 group-hover:border-white/45 group-hover:bg-white group-hover:text-black md:mt-0">
              {externalGallery.label}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </motion.a>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {hasMedia ? (
            <div className={dense ? "gallery-grid-4up" : "gallery-grid-3up"}>
              {photos.map((photo, photoIndex) => (
                <button
                  key={photo.key}
                  type="button"
                  onClick={() => setIndex(photoIndex)}
                  aria-label={photo.label}
                  className="gallery-card-frame group text-left transition-all duration-500 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  <ResponsiveImage
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    sizes={
                      dense
                        ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    }
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[0.22,1,0.36,1] group-hover:scale-[1.04] ${
                      photo.kind === "video" ? "opacity-90" : ""
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {photo.kind === "video" && (
                    <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 border border-white/20 bg-black/60 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 bg-primary animate-pulse" />
                      Video
                    </div>
                  )}
                  {(photo.caption || photo.credit) && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <div className="translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        {photo.caption && (
                          <p className="font-display text-sm uppercase tracking-[0.2em] text-white drop-shadow-xl md:text-base">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <p className="font-display text-2xl uppercase text-white/90">
                Archive Coming Soon
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                Photos are being prepared for this gallery.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {isLightboxOpen && hasMedia ? (
        <Suspense fallback={null}>
          <GalleryLightbox
            media={media}
            index={index}
            onClose={() => setIndex(-1)}
          />
        </Suspense>
      ) : null}
    </section>
  );
}
