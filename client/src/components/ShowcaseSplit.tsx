import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { Users, FileText, Images, AudioLines, ArrowUpRight } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

const panels = [
  {
    id: "roster",
    number: "06",
    label: "Roster",
    title: "Artists",
    tagline: "The selectors and guests who shape every room.",
    color: "#D4A574",
    image: "/images/industrial-roster.webp",
    href: "/lineup",
    icon: Users,
    badge: "Full Roster",
  },
  {
    id: "journal",
    number: "07",
    label: "Journal",
    title: "Articles",
    tagline: "News, notes, and the context behind the nights.",
    color: "#E05A3A",
    image: "/images/deron-press.jpg",
    href: "/insights",
    icon: FileText,
    badge: "Latest Posts",
  },
  {
    id: "archive",
    number: "08",
    label: "Gallery",
    title: "Event Archive",
    tagline: "Photos, recaps, and recorded history.",
    color: "#8B5CF6",
    image: "/images/autograf-recap.jpg",
    href: "/archive",
    icon: Images,
    badge: "All Seasons",
  },
  {
    id: "mixes",
    number: "09",
    label: "Radio",
    title: "Radio Show",
    tagline: "Mixes, guest sets, and full replays.",
    color: "#FFFFFF",
    image: "/images/radio-show-gear.webp",
    href: "/radio",
    icon: AudioLines,
    badge: "Now Playing",
  },
];

export default function ShowcaseSplit() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className="relative split-panel-shell w-full overflow-hidden bg-black border-y border-white/10">
      <div className="split-panel-track">
        {panels.map((panel) => (
          <motion.div
            key={panel.id}
            id={panel.id}
            onHoverStart={() => setHoveredId(panel.id)}
            onHoverEnd={() => setHoveredId(null)}
            animate={{
              flex: hoveredId === panel.id ? 2 : hoveredId === null ? 1 : 0.8,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="split-panel-item relative group cursor-pointer overflow-hidden border-b border-white/10 last:border-0 scroll-mt-32 lg:border-b-0 lg:border-r"
          >
            <Link href={panel.href} className="absolute inset-0 block h-full w-full" data-cursor-text="EXPLORE">
              {/* Background Image & Overlays */}
              <div className="absolute inset-0">
                <ResponsiveImage
                  src={panel.image}
                  alt={panel.title}
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover grayscale-[40%] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 transition-colors duration-500 group-hover:bg-black/40" />
                <div
                  className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-40"
                  style={{ background: `linear-gradient(to top, ${panel.color}44, transparent)` }}
                />
              </div>

              {/* Top-left structural label */}
              <div className="absolute top-8 left-6 lg:top-12 lg:left-8 flex items-baseline gap-4 pointer-events-none">
                <span className="font-display text-3xl lg:text-5xl text-white/20 select-none">
                  {panel.number}
                </span>
                <div className="flex items-center gap-3">
                  <span className="ui-kicker text-white/40 tracking-[0.3em] font-bold text-[10px] lg:text-[11px]">
                    {panel.label}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 bg-white/5 border border-white/10 text-white/30 hidden lg:inline-block">
                    {panel.badge}
                  </span>
                </div>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12">
                <div className="max-w-md">
                  {/* Icon */}
                  <motion.div
                    animate={{
                      y: hoveredId === panel.id ? 0 : 20,
                      opacity: (hoveredId === panel.id || hoveredId === null) ? 1 : 0,
                    }}
                    className="mb-4 lg:mb-8 flex h-12 w-12 lg:h-16 lg:w-16 items-center justify-center rounded-none border border-white/20 bg-black/40 backdrop-blur-md shadow-2xl"
                  >
                    <panel.icon className="h-6 w-6 lg:h-8 lg:w-8" style={{ color: panel.color }} />
                  </motion.div>

                  <h3 className="font-display text-3xl lg:text-5xl uppercase tracking-tight text-white leading-none mb-2">
                    {panel.title}
                  </h3>

                  {/* Expanded content on hover */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: hoveredId === panel.id ? "auto" : "0px",
                      opacity: hoveredId === panel.id ? 1 : 0,
                    }}
                    className="hidden lg:block overflow-hidden"
                  >
                    <p className="mt-6 font-serif italic text-xl lg:text-2xl text-white/80 leading-relaxed max-w-sm">
                      {panel.tagline}
                    </p>

                    <div className="btn-text-action mt-8">
                      <span>Open Page</span>
                      <ArrowUpRight />
                    </div>
                  </motion.div>
                </div>

                {/* Mobile tap signal */}
                <div className="lg:hidden mt-6">
                  <span className="btn-text-action">
                    Open Page
                    <ArrowUpRight />
                  </span>
                </div>
              </div>

              {/* Inactive vertical title (desktop only) */}
              <motion.div
                animate={{
                  opacity: hoveredId === panel.id ? 0 : 1,
                  y: hoveredId === panel.id ? 40 : 0,
                }}
                className="hidden lg:block absolute right-6 bottom-12 origin-bottom lg:right-auto lg:left-8 lg:bottom-12 lg:origin-bottom-left lg:-rotate-90 pointer-events-none whitespace-nowrap"
              >
                <span className="font-display text-2xl uppercase tracking-[0.2em] text-white/60">
                  {panel.title}
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
