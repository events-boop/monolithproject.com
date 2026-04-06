import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MasonryPhotoAlbum, Photo } from "react-photo-album";
import "react-photo-album/masonry.css";
import { MediaItem, homeGallery } from "@/data/galleryData";

const GalleryLightbox = lazy(() => import("./GalleryLightbox"));

type GalleryPhoto = Photo & {
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
}

export default function MixedMediaGallery({
  media = homeGallery,
  title = "Event Archive",
  subtitle = "Gallery",
  description = "Photos, videos, and recaps from past Monolith nights.",
  className = "bg-background border-t border-white/5 relative",
  style,
  dense = false,
}: MixedMediaGalleryProps) {
  const [index, setIndex] = useState(-1);
  const isLightboxOpen = index >= 0;
  const hasMedia = media.length > 0;

  const photos = useMemo<GalleryPhoto[]>(() => {
    return media.map((item) => {
      const base =
        item.kind === "video"
          ? { src: item.poster, width: item.posterWidth, height: item.posterHeight }
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
    <section className={`py-16 relative ${className}`} style={style}>
      <div className="container layout-wide px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            {subtitle && (
              <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-white/40 mb-4 block uppercase">
                {subtitle}
              </span>
            )}
            <h2 className="font-display text-4xl md:text-6xl leading-[0.85] tracking-tight text-white uppercase mb-4">
              {title}
            </h2>
            {description && (
              <p className="font-sans text-base md:text-lg text-white/45 leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>
          {hasMedia && (
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
              {media.length} {media.length === 1 ? "photo" : "photos"}
            </p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {hasMedia ? (
            <MasonryPhotoAlbum
              photos={photos}
              columns={(containerWidth) =>
                dense
                  ? containerWidth < 480
                    ? 2
                    : containerWidth < 768
                      ? 3
                      : containerWidth < 1280
                        ? 4
                        : 5
                  : containerWidth < 640
                    ? 1
                    : containerWidth < 1080
                      ? 2
                      : 3
              }
              spacing={dense ? 6 : 16}
              padding={0}
              sizes={{
                size: "calc(100vw - 3rem)",
                sizes: dense
                  ? [
                      { viewport: "(min-width: 1280px)", size: "240px" },
                      { viewport: "(min-width: 768px)", size: "calc((100vw - 4rem) / 4)" },
                      { viewport: "(min-width: 480px)", size: "calc((100vw - 3rem) / 3)" },
                    ]
                  : [
                      { viewport: "(min-width: 1280px)", size: "384px" },
                      { viewport: "(min-width: 640px)", size: "calc((100vw - 5rem) / 2)" },
                    ],
              }}
              onClick={({ index: nextIndex }) => setIndex(nextIndex)}
              componentsProps={{
                wrapper: () => ({
                  className: dense
                    ? "group relative overflow-hidden cursor-pointer"
                    : "group relative overflow-hidden border-l border-b border-white/10 bg-[#050505] transition-all duration-500 hover:border-white/25",
                }),
                button: ({ photo }) => ({
                  className:
                    "block w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                  "aria-label": photo.label,
                }),
                image: ({ photo }) => ({
                  className: dense
                    ? `w-full h-auto object-cover transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                        photo.kind === "video" ? "opacity-90 group-hover:opacity-100" : ""
                      }`
                    : `w-full h-auto object-cover transition-all duration-700 ease-[0.22,1,0.36,1] opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] ${
                        photo.kind === "video" ? "opacity-90" : ""
                      }`,
                }),
              }}
              render={{
                extras: (_, { photo }) => (
                  <>
                    {photo.kind === "video" && (
                      <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 border border-white/20 bg-black/60 px-2 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 bg-primary animate-pulse" />
                        Video
                      </div>
                    )}

                    {!dense && (photo.caption || photo.credit) && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                        <div className="translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          {photo.caption && (
                            <p className="font-display text-lg uppercase tracking-wider text-white drop-shadow-xl">
                              {photo.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ),
              }}
            />
          ) : (
            <div className="border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
              <p className="font-display text-2xl uppercase text-white/90">
                Archive Coming Soon
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55">
                Photos are being prepared for this gallery.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {isLightboxOpen && hasMedia ? (
        <Suspense fallback={null}>
          <GalleryLightbox media={media} index={index} onClose={() => setIndex(-1)} />
        </Suspense>
      ) : null}
    </section>
  );
}
