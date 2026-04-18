import { useState } from "react";
import { Play } from "lucide-react";
import { Link } from "wouter";
import { getSeriesColor, getSeriesLabel } from "@/lib/siteExperience";
import { RADIO_ACCENT } from "@/lib/brand";
import type { ScheduledEvent } from "@shared/events/types";

interface FeaturedSet {
  id: string;
  series: ScheduledEvent["series"] | "radio";
  artist: string;
  title: string;
  shortCode?: string;
  duration: string;
  image: string;
  href: string;
  cta: string;
}

const SETS: FeaturedSet[] = [
  {
    id: "ep-01-benchek",
    series: "radio",
    artist: "BENCHEK",
    title: "Chapter III · Special NYE",
    shortCode: "EP-01",
    duration: "58:23",
    image: "https://i1.sndcdn.com/artworks-WN7kMdVH3nFy71kQ-s2YUBw-t500x500.jpg",
    href: "/radio/ep-01-benchek",
    cta: "Listen Now",
  },
  {
    id: "ep-02-ewerseen",
    series: "radio",
    artist: "EWERSEEN",
    title: "Mix Vol. 3",
    shortCode: "EP-02",
    duration: "55:48",
    image: "https://i1.sndcdn.com/artworks-FMot44uoQiVdP1Uj-bYxapA-t500x500.jpg",
    href: "/radio/ep-02-ewerseen",
    cta: "Listen Now",
  },
  {
    id: "ep-03-terranova",
    series: "radio",
    artist: "TERRANOVA",
    title: "Guest Session",
    shortCode: "EP-03",
    duration: "62:10",
    image: "https://i1.sndcdn.com/artworks-yrdlfcJnVQdyx9ZE-uV4tLw-t500x500.jpg",
    href: "/radio/ep-03-terranova",
    cta: "Listen Now",
  },
  {
    id: "ep-04-radian",
    series: "radio",
    artist: "RADIAN",
    title: "Untold Crossover",
    shortCode: "EP-04",
    duration: "71:05",
    image: "https://i1.sndcdn.com/artworks-ej63xmhBtCg8zlTu-8jyiyw-t500x500.jpg",
    href: "/radio/ep-04-radian",
    cta: "Listen Now",
  },
  {
    id: "autograf-castaways",
    series: "monolith-project",
    artist: "AUTOGRAF",
    title: "Live at Castaways",
    shortCode: "LIVE",
    duration: "Archive Set",
    image: "https://i.ytimg.com/vi/9R6XH7JZlJI/hqdefault.jpg",
    href: "/archive",
    cta: "Watch Set",
  },
];

function getSetColor(series: FeaturedSet["series"]) {
  if (series === "radio") return RADIO_ACCENT;
  return getSeriesColor(series);
}

function getSetLabel(series: FeaturedSet["series"]) {
  if (series === "radio") return "Sun(Sets) · Radio";
  if (series === "monolith-project") return "Monolith · Archive";
  return getSeriesLabel(series);
}

export default function FeaturedSets() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const center = (SETS.length - 1) / 2;

  return (
    <section className="relative bg-black border-t border-white/10 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-10 md:mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="font-mono text-[11px] md:text-[12px] tracking-[0.5em] uppercase text-white font-bold">
              Featured Sets
            </span>
            <span className="h-px w-8 md:w-12 bg-white/20" />
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-white/50">
              The Archive Deck
            </span>
          </div>
          <span className="hidden md:block font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 shrink-0">
            {SETS.length.toString().padStart(2, "0")} Selections
          </span>
        </div>

        {/* Desktop fanning stack */}
        <div
          className="hidden md:flex relative h-[540px] items-center justify-center [contain:layout_paint]"
          onMouseLeave={() => setHoveredId(null)}
        >
          {SETS.map((set, i) => {
            const offset = i - center;
            const color = getSetColor(set.series);
            const label = getSetLabel(set.series);
            const isHovered = hoveredId === set.id;
            const x = offset * 230;
            const baseRot = offset * 3;
            const rot = isHovered ? 0 : baseRot;
            const y = isHovered ? -18 : 0;
            const scale = isHovered ? 1.08 : 1;

            return (
              <div
                key={set.id}
                onMouseEnter={() => setHoveredId(set.id)}
                className="absolute motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg) scale(${scale})`,
                  zIndex: isHovered ? 40 : 10 + (SETS.length - Math.abs(offset)),
                  willChange: "transform",
                }}
              >
                <Link
                  href={set.href}
                  className="group relative block w-[300px] h-[440px] overflow-hidden border border-white/15 bg-black shadow-xl shadow-black/40"
                >
                  <img
                    src={set.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
                  <div
                    className="absolute left-0 right-0 top-0 h-[2px]"
                    style={{ backgroundColor: color }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(120% 80% at 50% 100%, ${color}22, transparent 65%)`,
                    }}
                  />

                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[9px] tracking-[0.35em] uppercase text-white/70">
                    {set.shortCode && (
                      <span
                        className="px-1.5 py-0.5 border"
                        style={{ borderColor: `${color}66`, color }}
                      >
                        {set.shortCode}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-white/60">
                      <span className="h-1 w-1 rounded-full bg-white/50" />
                      {set.duration}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-7">
                    <span
                      className="block font-mono text-[10px] tracking-[0.35em] uppercase mb-3"
                      style={{ color }}
                    >
                      {label}
                    </span>
                    <h3 className="font-display text-[2rem] leading-[0.9] uppercase text-white tracking-tight mb-1">
                      {set.artist}
                    </h3>
                    <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 mb-6">
                      {set.title}
                    </p>

                    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase text-white group-hover:gap-4 transition-all">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full border bg-black/50 backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-black"
                        style={{ borderColor: `${color}88` }}
                      >
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                      </span>
                      <span>{set.cta}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile scroll-snap row */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-none">
          {SETS.map((set) => {
            const color = getSetColor(set.series);
            const label = getSetLabel(set.series);

            return (
              <Link
                key={set.id}
                href={set.href}
                className="snap-center shrink-0 w-[280px] h-[400px] relative overflow-hidden border border-white/15 bg-black"
              >
                <img
                  src={set.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover grayscale-[20%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
                <div
                  className="absolute left-0 right-0 top-0 h-[2px]"
                  style={{ backgroundColor: color }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span
                    className="block font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
                    style={{ color }}
                  >
                    {label}
                  </span>
                  <h3 className="font-display text-[1.75rem] leading-[0.9] uppercase text-white tracking-tight mb-1">
                    {set.artist}
                  </h3>
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/60 mb-5">
                    {set.title}
                  </p>
                  <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase text-white">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full border bg-black/50"
                      style={{ borderColor: `${color}88` }}
                    >
                      <Play className="w-3 h-3 ml-0.5 fill-current" />
                    </span>
                    <span>{set.cta}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
