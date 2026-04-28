import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import ResponsiveImage from "./ResponsiveImage";

interface EpisodeGalleryProps {
  series: "chasing-sunsets" | "untold-story";
  season: string;
  episode?: string;
  title: string;
  subtitle?: string;
  description?: string;
  images: { src: string; alt: string; label?: string }[];
  accentColor: string;
}

export default function EpisodeGallery({
  series,
  season,
  episode,
  title,
  subtitle,
  description,
  images,
  accentColor,
}: EpisodeGalleryProps) {
  const isChasing = series === "chasing-sunsets";
  const seasonHref = `/${series}/${season.replace(/\s+/g, "-").toLowerCase()}`;

  if (isChasing) {
    return (
      <div className="gallery-shell sunset-panel-editorial px-5 py-8 md:px-8 md:py-10">
        <div className="relative z-10 flex flex-col gap-6 border-b border-[#C2703E]/14 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#A4592C]">
              {season} {episode && `- ${episode}`}
            </span>
            <h3 className="font-display text-[clamp(2.8rem,5vw,5rem)] uppercase leading-[0.88] text-[#2C1810]">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-3 font-serif text-[clamp(1.3rem,2vw,1.8rem)] italic text-[#A4592C]">{subtitle}</p>
            ) : null}
            {description ? (
              <p className="mt-4 max-w-2xl border-l-2 border-[#E8B86D]/55 pl-4 text-sm leading-relaxed text-[#2C1810]/68 md:text-base">
                {description}
              </p>
            ) : null}
          </div>

          <Link href={seasonHref} className="btn-pill-outline btn-pill-outline-sunsets-light inline-flex items-center justify-center self-start md:self-auto">
            View Full Gallery
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="gallery-grid-4up pt-8">
          {images.map((img, idx) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div className="sunset-media-frame relative aspect-[4/5] transition-transform duration-500 group-hover:-translate-y-1">
                <ResponsiveImage
                  src={img.src}
                  alt={img.alt}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(18,13,9,0.12)_48%,rgba(18,13,9,0.7))]" />
                <div className="absolute left-4 top-4 rounded-full border border-white/18 bg-black/28 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/82 backdrop-blur-sm">
                  Frame {String(idx + 1).padStart(2, "0")}
                </div>
                {img.label ? (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(246,234,215,0.78))] px-4 py-3 shadow-[0_18px_34px_rgba(18,13,9,0.18)]">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.24em] text-[#A4592C]">Season Proof</span>
                      <p className="mt-2 font-display text-xl uppercase leading-[0.92] text-[#2C1810]">{img.label}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-shell border-white/10">
      <div className="relative z-10 mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <span
            className="mb-3 block font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: accentColor }}
          >
            {season} {episode && `- ${episode}`}
          </span>
          <h3 className="mb-2 font-display text-4xl uppercase text-white md:text-5xl">{title}</h3>
          {subtitle ? (
            <p className="mb-4 font-display text-xl uppercase tracking-widest text-white/70">{subtitle}</p>
          ) : null}
          {description ? (
            <p className="max-w-xl border-l-2 pl-4 text-sm leading-relaxed text-white/50" style={{ borderColor: accentColor }}>
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <Link href={seasonHref} asChild>
            <a className="btn-pill-outline btn-pill-compact group" style={{ borderColor: `${accentColor}40` }}>
              View Full Gallery
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </Link>
        </div>
      </div>

      <div className="gallery-grid-4up pt-10">
        {images.map((img, idx) => (
          <motion.div
            key={img.src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="gallery-card-frame glass group rounded-xl grayscale-[60%] transition-all duration-700 hover:z-20 hover:grayscale-0 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            <ResponsiveImage
              src={img.src}
              alt={img.alt}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />

            {img.label ? (
              <div className="absolute bottom-6 left-6 right-6 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Card {idx + 1}
                </span>
                <p className="font-display text-xl uppercase tracking-widest text-white drop-shadow-md">{img.label}</p>
              </div>
            ) : null}

            <div
              className="absolute inset-0 scale-[0.98] border-[3px] opacity-0 mix-blend-overlay transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
              style={{ borderColor: accentColor }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
