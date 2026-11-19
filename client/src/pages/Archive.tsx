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
  const [year, setYear] = useState("all");
  const [venue, setVenue] = useState("all");
  const venues = Array.from(
    new Set(archiveEntries.flatMap(entry => (entry.venue ? [entry.venue] : [])))
  ).sort();
  const years = Array.from(
    new Set(archiveEntries.flatMap(entry => entry.date.match(/20\d{2}/g) || []))
  )
    .sort()
    .reverse();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const visibleEntries = useMemo(
    () =>
      archiveEntries.filter(
        entry =>
          (filter === "all" || inferArchiveFilter(entry.slug) === filter) &&
          (year === "all" || entry.date.includes(year)) &&
          (venue === "all" || entry.venue === venue)
      ),
    [filter, year, venue]
  );

  return (
    <div className="archive-index relative min-h-screen overflow-hidden text-white lg-dusk-atmosphere">
      <SEO
        title="Archive"
        description="The full history of Monolith Project events — galleries from every season."
      />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="relative z-10 pb-36">
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
                <h1 className="section-display-title mb-5 max-w-[8ch] text-[#fbf6ee]">
                  Archive
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-[#f4e9d8]/78 md:text-xl">
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
                      className={`min-h-[44px] cursor-pointer rounded-full border px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] backdrop-blur-md transition-colors ${
                        active
                          ? "border-[rgba(255,230,194,0.72)] bg-[#f3a659] font-semibold text-[#181009] shadow-[0_8px_24px_rgba(243,152,70,0.28)]"
                          : "border-[rgba(255,228,194,0.16)] bg-[rgba(255,255,255,0.04)] text-white/75 hover:border-[rgba(243,166,89,0.45)] hover:text-white"
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
          <div className="archive-discovery">
            <label>
              Explore a year{" "}
              <select
                className="archive-year-select"
                aria-label="Filter archive by year"
                value={year}
                onChange={event => setYear(event.target.value)}
              >
                <option value="all">All years</option>
                {years.map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              Explore a room
              <select
                className="archive-year-select"
                aria-label="Filter archive by venue"
                value={venue}
                onChange={event => setVenue(event.target.value)}
              >
                <option value="all">All venues &amp; seasons</option>
                {venues.map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <p role="status">{visibleEntries.length} collections</p>
          </div>
          {visibleEntries.length === 0 ? (
            <div className="lg-glass-card rounded-2xl px-6 py-12 md:px-10">
              <h2 className="font-display text-3xl uppercase tracking-[-0.03em] text-[#fbf6ee]">
                No galleries in this filter.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
                Try another series, or return to the full Monolith record.
              </p>
              <button
                type="button"
                className="lg-pill-amber mt-6"
                onClick={() => {
                  setFilter("all");
                  setYear("all");
                  setVenue("all");
                }}
              >
                Show all archives
              </button>
            </div>
          ) : (
            <div className="archive-grid grid grid-cols-1 gap-7 md:grid-cols-2 md:gap-9 lg:grid-cols-3">
              {visibleEntries.map((entry, idx) => {
                const videoCount = entry.media.filter(
                  m => m.kind === "video"
                ).length;
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
                        className="group lg-glass-card lg-glass-card-interactive flex h-full flex-col overflow-hidden rounded-2xl"
                      >
                        <div className="archive-card-image relative aspect-[3/2] overflow-hidden">
                          <ResponsiveImage
                            src={entry.coverImage}
                            alt={`${entry.title} ${entry.subtitle}`}
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            style={{ objectPosition: "50% 0%" }}
                            className="h-full w-full object-cover object-top origin-top transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <span
                            className="absolute inset-x-0 top-0 h-[2px]"
                            style={{ background: entry.accentColor }}
                            aria-hidden="true"
                          />
                          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-3 py-1 backdrop-blur-md">
                            {videoCount > 0 ? (
                              <Film className="h-3 w-3 text-[#f3b572]" />
                            ) : (
                              <Camera className="h-3 w-3 text-[#f3b572]" />
                            )}
                            <span className="font-mono text-[10.5px] uppercase tracking-wider text-white/85">
                              {entry.comingSoon
                                ? "IN EDIT"
                                : entry.externalGallery
                                  ? "OFFICIAL GALLERY"
                                  : `${entry.media.length} FRAMES`}
                            </span>
                          </div>
                        </div>

                        <div className="archive-card-copy flex flex-1 flex-col p-6">
                          <span
                            className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.2em]"
                            style={{ color: entry.accentColor }}
                          >
                            {entry.date}
                          </span>
                          <h2 className="mb-1 font-display text-2xl uppercase tracking-wide text-[#fbf6ee] transition-colors group-hover:text-[#ffd8a6]">
                            {entry.title}
                          </h2>
                          <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/68">
                            {entry.subtitle}
                          </p>
                          <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-white/72">
                            {entry.description}
                          </p>
                          <span className="mt-auto inline-flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f3c68f] transition-colors group-hover:text-white">
                            <span>Open Collection</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                      </a>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
