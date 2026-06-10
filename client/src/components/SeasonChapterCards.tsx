import { ArrowUpRight, Sunset } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getSeriesColor, getSeriesEvents } from "@/lib/siteExperience";
import ConversionCTA from "@/components/ConversionCTA";
import { appendAttributionQueryParams } from "@/lib/attribution";

const CHAPTER_LABELS = ["SUN(SETS) I", "SUN(SETS) II", "SUN(SETS) III"];
const CHAPTER_NUMBERS = ["01", "02", "03"];
const CHAPTER_SUBTITLES = [
  "Independence Day · Open-Air Experience",
  "The Summer Return",
  "Season Finale",
];

const PILLARS = [
  { icon: "♩", label: "House Music", sub: "All Day & Night" },
  { icon: "☀", label: "Golden Hour", sub: "By The Lake" },
  { icon: "◎", label: "Togetherness", sub: "Is The Frequency" },
  { icon: "⚓", label: "Castaways", sub: "Chicago, IL" },
];

export default function SeasonChapterCards() {
  const events = getSeriesEvents("chasing-sunsets").slice(0, 3);
  if (!events.length) return null;

  const [featured, ...rest] = events;
  const featuredAccent = getSeriesColor(featured.series);

  return (
    <section className="relative z-10 overflow-hidden border-t border-white/10 bg-[#070707] py-20 md:py-28">
      {/* Subtle ambient glow behind featured card */}
      <div
        className="pointer-events-none absolute left-[18%] top-0 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: featuredAccent }}
      />

      <div className="container mx-auto max-w-[90rem] px-5 sm:px-8">
        {/* Section header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-8 md:mb-14 md:pb-10">
          <div>
            <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[0.38em] text-white/46">
              Monolith / Chicago
            </p>
            <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.88] tracking-tight text-white">
              Upcoming Chapters
            </h2>
            <p
              className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-[0.88] tracking-tight"
              style={{ color: featuredAccent }}
            >
              Sun(Sets) 2026
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/52">
              A lakefront summer series by The Monolith Project —{" "}
              <br className="hidden sm:block" />
              built around golden hour, open-air sound, and togetherness.
            </p>
          </div>
          <Link href="/schedule">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-6 py-3 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-white/72 transition hover:bg-white/[0.08] hover:text-white">
              View All Events
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* ── FEATURED: July 4 ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[1.5rem] border bg-[#0e0e0e] shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
            style={{ borderColor: `${featuredAccent}40` }}
          >
            {/* Amber glow wash */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                background: `radial-gradient(circle at 30% 0%, ${featuredAccent}, transparent 60%)`,
              }}
            />

            <div className="relative z-10 flex h-full flex-col p-6 sm:p-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 top-12 z-0 font-display text-[10rem] font-black leading-none tracking-tight text-white/[0.045] sm:-right-6 sm:text-[12rem]"
              >
                {CHAPTER_NUMBERS[0]}
              </span>

              {/* Top row */}
              <div className="mb-6 flex items-start justify-between gap-3">
                <span
                  className="font-mono text-[10px] font-black uppercase tracking-[0.28em]"
                  style={{ color: featuredAccent }}
                >
                  {CHAPTER_LABELS[0]}
                </span>
                <span className="rounded-full bg-white px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-black">
                  Up Next
                </span>
              </div>

              {/* Date — hero-sized */}
              <p className="relative z-10 font-display text-[clamp(3.2rem,7vw,5.5rem)] font-black uppercase leading-[0.85] tracking-tight text-white">
                {featured.date}
              </p>

              {/* Venue */}
              <p className="mt-2 font-mono text-[11px] font-black uppercase tracking-[0.24em] text-white/55">
                {featured.venue}, Chicago
              </p>

              {/* Subtitle */}
              <p
                className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.22em]"
                style={{ color: featuredAccent }}
              >
                {CHAPTER_SUBTITLES[0]}
              </p>

              {/* Sun icon */}
              <div className="my-6 flex justify-center">
                <Sunset
                  className="h-10 w-10 opacity-30"
                  style={{ color: featuredAccent }}
                  strokeWidth={1.2}
                />
              </div>

              {/* CTA */}
              <div className="mt-auto">
                <ConversionCTA
                  event={featured}
                  size="sm"
                  showUrgency
                  className="w-full"
                />
                <p className="mt-3 text-center font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/36">
                  Limited Capacity
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── SUPPORTING CARDS ── */}
          {rest.map((event, i) => {
            const accent = getSeriesColor(event.series);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.55,
                  delay: 0.1 * (i + 1),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0c0c0c] shadow-[0_18px_48px_rgba(0,0,0,0.38)] transition-colors hover:border-white/20"
              >
                <div className="relative z-10 flex h-full flex-col p-6 sm:p-8">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-4 top-12 z-0 font-display text-[8.5rem] font-black leading-none tracking-tight text-white/[0.04] sm:-right-6 sm:text-[10rem]"
                  >
                    {CHAPTER_NUMBERS[i + 1]}
                  </span>

                  {/* Top row */}
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <span
                      className="font-mono text-[10px] font-black uppercase tracking-[0.28em]"
                      style={{ color: accent }}
                    >
                      {CHAPTER_LABELS[i + 1]}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="relative z-10 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase leading-[0.88] tracking-tight text-white/82">
                    {event.date}
                  </p>

                  <p className="mt-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/42">
                    {event.venue}, Chicago
                  </p>

                  <p
                    className="mt-5 font-mono text-[10px] font-black uppercase tracking-[0.22em]"
                    style={{ color: `${accent}99` }}
                  >
                    {CHAPTER_SUBTITLES[i + 1]}
                  </p>

                  <div className="my-6 flex justify-center">
                    <Sunset
                      className="h-8 w-8 opacity-20"
                      style={{ color: accent }}
                      strokeWidth={1.2}
                    />
                  </div>

                  <div className="mt-auto">
                    <ConversionCTA
                      event={event}
                      size="sm"
                      showUrgency
                      className="w-full"
                    />
                    <p className="mt-3 text-center font-mono text-[9px] font-black uppercase tracking-[0.22em] text-white/70">
                      Limited Capacity
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom pillars */}
        <div className="mt-12 grid grid-cols-2 gap-px border border-white/8 bg-white/[0.04] md:grid-cols-4 md:mt-16">
          {PILLARS.map(p => (
            <div
              key={p.label}
              className="flex flex-col items-center gap-2 bg-[#070707] px-6 py-7 text-center"
            >
              <span className="text-2xl opacity-40">{p.icon}</span>
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.28em] text-white/68">
                {p.label}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/36">
                {p.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
