import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Film, Sparkles } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import ResponsiveImage from "@/components/ResponsiveImage";
import SEO from "@/components/SEO";
import { archiveEntries } from "@/data/archiveEntries";
import { trackAccessEvent } from "@/lib/api";

type ArchiveFilter = "all" | "chasing-sunsets" | "untold-story" | "monolith";

function inferArchiveFilter(slug: string): Exclude<ArchiveFilter, "all"> {
  if (slug.startsWith("chasing-sunsets")) return "chasing-sunsets";
  if (slug.startsWith("untold-story") || slug.includes("autograf-march")) {
    return "untold-story";
  }
  return "monolith";
}

export default function Archive() {
  const [filter, setFilter] = useState<ArchiveFilter>("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visibleEntries = useMemo(() => {
    if (filter === "all") return archiveEntries;
    return archiveEntries.filter(
      entry => inferArchiveFilter(entry.slug) === filter
    );
  }, [filter]);

  return (
    <div className="min-h-screen text-white relative overflow-hidden lg-dusk-atmosphere">
      <SEO
        title="Archive"
        description="The full history of Monolith Project events — galleries from every season."
      />
      <Navigation />

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 pb-36"
      >
        <section className="lg-cinematic-masthead px-6 mb-14 md:mb-20">
          <div className="container layout-wide">
            <motion.header
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] uppercase text-[#f3b572] mb-5">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>The Monolith Record · Living History</span>
                </span>
                <h1 className="section-display-title text-[#fbf6ee] mb-5">
                  ARCHIVE
                </h1>
                <p className="text-white/76 max-w-2xl leading-relaxed text-base md:text-xl">
                  Every season, every room, every sunset on Lake Michigan and
                  after-dark chapter in Chicago.
                </p>
              </div>

              <div
                role="group"
                aria-label="Filter archive galleries by series"
                className="flex flex-wrap gap-2.5"
              >
                {(
                  [
                    { id: "all", label: `All (${archiveEntries.length})` },
                    { id: "chasing-sunsets", label: "Chasing Sun(Sets)" },
                    { id: "untold-story", label: "Untold Story" },
                    { id: "monolith", label: "Special Chapters" },
                  ] as const
                ).map(tab => {
                  const active = filter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(tab.id)}
                      className={`rounded-full border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                        active
                          ? "border-[#ffe6c2]/65 bg-[#f3a659] text-[#181009] font-semibold"
                          : "border-white/14 bg-white/[0.04] text-white/75 hover:border-[#f3a659]/45 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </motion.header>
          </div>
        </section>

        <div className="container layout-wide px-6">
          {/* Liquid-Glass Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
            {visibleEntries.map((entry, idx) => {
              const videoCount = entry.media.filter(m => m.kind === "video").length;
              return (
                <motion.div
                  key={entry.slug}
                  initial={{ y: 18 }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.05, 0.35),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link href={entry.href} asChild>
                    <a
                      onClick={() =>
                        trackAccessEvent("archive_click", {
                          buttonName: "View Gallery",
                          destinationUrl: entry.href,
                          pagePath: "/archive",
                          eventSlug: entry.slug,
                          eventDate: entry.date,
                          channel: "site",
                          source: "archive_collection_card",
                        })
                      }
                      className="group lg-glass-card lg-glass-card-interactive block rounded-2xl overflow-hidden h-full flex flex-col"
                    >
                      {/* Cover Image */}
                      <div className="aspect-[3/2] overflow-hidden relative">
                        <ResponsiveImage
                          src={entry.coverImage}
                          alt={`${entry.title} ${entry.subtitle}`}
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top series accent bar */}
                        <span
                          className="absolute inset-x-0 top-0 h-[2px]"
                          style={{ background: entry.accentColor }}
                          aria-hidden="true"
                        />

                        {/* Media count / status pill */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-3 py-1 backdrop-blur-md">
                          {videoCount > 0 ? (
                            <Film className="w-3 h-3 text-[#f3b572]" />
                          ) : (
                            <Camera className="w-3 h-3 text-[#f3b572]" />
                          )}
                          <span className="font-mono text-[10.5px] uppercase tracking-wider text-white/85">
                            {entry.comingSoon && entry.media.length === 0
                              ? "IN EDIT"
                              : entry.externalGallery
                                ? "OFFICIAL GALLERY"
                                : `${entry.media.length} FRAMES`}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex flex-1 flex-col">
                        <span
                          className="font-mono text-[11px] tracking-[0.2em] uppercase block mb-2.5"
                          style={{ color: entry.accentColor }}
                        >
                          {entry.date}
                        </span>
                        <h2 className="font-display text-2xl uppercase tracking-wide text-[#fbf6ee] mb-1 group-hover:text-[#ffd8a6] transition-colors">
                          {entry.title}
                        </h2>
                        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/68 mb-3.5">
                          {entry.subtitle}
                        </p>
                        <p className="text-sm text-white/72 leading-relaxed line-clamp-2 mb-5">
                          {entry.description}
                        </p>
                        <span className="mt-auto inline-flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f3c68f] group-hover:text-white transition-colors">
                          <span>Open Collection</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </span>
                      </div>
                    </a>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
