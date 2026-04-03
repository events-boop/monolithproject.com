import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MasonryPhotoAlbum, Photo } from "react-photo-album";
import "react-photo-album/masonry.css";
import { MediaItem, homeGallery } from "@/data/galleryData";
import ImageTrail from "./ui/ImageTrail";
import KineticDecryption from "./KineticDecryption";

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
}

export default function MixedMediaGallery({
  media = homeGallery,
  title = "Captured Moments",
  subtitle = "Visual Archives",
  description = "A collection of fragments from our past gatherings. Immersive soundscapes and visual memories.",
  className = "bg-background border-t border-white/5 relative",
  style,
}: MixedMediaGalleryProps) {
  const [index, setIndex] = useState(-1);
  const [isHoveringGallery, setIsHoveringGallery] = useState(false);
  const isLightboxOpen = index >= 0;
  const hasMedia = media.length > 0;

  // Extract just image sources for the trail
  const trailImages = useMemo(() => {
    return media.filter((item) => item.kind === "image").map((item) => item.src);
  }, [media]);

  const photos = useMemo<GalleryPhoto[]>(() => {
    return media.map((item) => {
      const base = item.kind === "video"
        ? {
            src: item.poster,
            width: item.posterWidth,
            height: item.posterHeight,
          }
        : {
            src: item.src,
            width: item.width,
            height: item.height,
          };

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
    <section
      className={`py-24 relative ${className}`}
      style={style}
      onMouseEnter={() => setIsHoveringGallery(true)}
      onMouseLeave={() => setIsHoveringGallery(false)}
    >
      {/* Background WebGL Image Trail Effect */}
      <ImageTrail
        images={trailImages}
        isActive={trailImages.length > 0 && isHoveringGallery && !isLightboxOpen}
        distanceToEmit={60}
        maxImages={12}
      />

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 md:mb-32 gap-12 lg:gap-24">
          <div className="max-w-3xl">
            {subtitle && (
              <span className="font-mono text-[10px] md:text-sm tracking-[0.3em] text-white/40 mb-6 block uppercase">
                {subtitle}
              </span>
            )}
            <h2 className="font-heavy text-[clamp(4rem,8vw,9rem)] leading-[0.85] tracking-tighter text-white uppercase mb-8">
              {title.split(" ").map((word, i) => (
                <span key={i} className={`block ${i === 0 ? "text-white/30" : "text-white"}`}>
                  <KineticDecryption text={word} />
                  {i === title.split(" ").length - 1 ? "." : ""}
                </span>
              ))}
            </h2>
            {description && (
              <p className="font-sans text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-xl">
                {description}
              </p>
            )}
          </div>
          
          <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-white/20 to-transparent mr-24" />
        </div>

        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {hasMedia ? (
            <MasonryPhotoAlbum
              photos={photos}
              columns={(containerWidth) =>
                containerWidth < 640 ? 1 : containerWidth < 1080 ? 2 : 3
              }
              spacing={24}
              padding={0}
              sizes={{
                size: "calc(100vw - 3rem)",
                sizes: [
                  { viewport: "(min-width: 1280px)", size: "384px" },
                  { viewport: "(min-width: 640px)", size: "calc((100vw - 5rem) / 2)" },
                ],
              }}
              onClick={({ index: nextIndex }) => setIndex(nextIndex)}
              componentsProps={{
                wrapper: () => ({
                  className:
                    "group relative mb-6 overflow-hidden rounded-none border-l border-b border-white/10 bg-[#050505] transition-all duration-700 hover:border-white/30",
                }),
                button: ({ photo }) => ({
                  className:
                    "block w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                  "aria-label": photo.label,
                }),
                image: ({ photo }) => ({
                  className: `w-full h-auto object-cover transition-all duration-[1.5s] ease-[0.22,1,0.36,1] filter grayscale group-hover:grayscale-0 liquid-hover ${
                    photo.kind === "video"
                      ? "opacity-90 group-hover:scale-[1.02]"
                      : "opacity-70 group-hover:scale-[1.05] group-hover:opacity-100"
                  }`,
                }),
              }}
              render={{
                extras: (_, { photo }) => (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />

                    {photo.kind === "video" && (
                      <div className="pointer-events-none absolute left-6 top-6 inline-flex items-center gap-2 border border-white/20 bg-black/50 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-none bg-primary animate-pulse" />
                        Motion
                      </div>
                    )}

                    {(photo.caption || photo.credit || photo.description) && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <div className="translate-y-4 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100 flex flex-col gap-2">
                          {photo.caption && (
                            <p className="font-heavy text-2xl md:text-3xl uppercase tracking-tighter leading-none text-white drop-shadow-xl">
                              {photo.caption}
                            </p>
                          )}
                          {(photo.credit || photo.description) && (
                            <div className="w-12 h-px bg-primary/70 my-1" />
                          )}
                          {(photo.credit || photo.description) && (
                            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50">
                              {photo.credit || photo.description}
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
            <div className="rounded-none border border-white/10 bg-white/[0.03] px-6 py-12 text-center shadow-[0_18px_34px_rgba(0,0,0,0.18)]">
              <p className="font-display text-2xl uppercase text-white/90">
                Archive In Assembly
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/55">
                This season has been structured for the new gallery system, but the final edit is still being curated.
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
