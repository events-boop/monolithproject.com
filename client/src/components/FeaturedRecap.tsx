import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import { MONOLITH_ORANGE } from "@/lib/brand";

export default function FeaturedRecap() {
  return (
    <section className="relative bg-black border-t border-white/10 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${MONOLITH_ORANGE}55, transparent)` }}
      />

      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-8 md:mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: MONOLITH_ORANGE }}
            />
            <span
              className="font-mono text-[11px] md:text-[12px] tracking-[0.5em] uppercase font-bold"
              style={{ color: MONOLITH_ORANGE }}
            >
              The Standout
            </span>
            <span className="h-px w-8 md:w-12 bg-white/20" />
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-white/50">
              Archive Selection
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 shrink-0">
            01 · Featured
          </span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 md:gap-12">
          {/* Video — primary mass */}
          <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
            <YouTubeEmbed
              url="https://www.youtube.com/watch?v=9R6XH7JZlJI"
              title="Autograf live at Castaways"
              className="absolute inset-0 w-full h-full"
            />
            <div
              className="absolute left-0 right-0 top-0 h-[2px] pointer-events-none"
              style={{ backgroundColor: MONOLITH_ORANGE }}
            />
          </div>

          {/* Editorial column */}
          <div className="flex flex-col justify-between">
            <div>
              <span
                className="block font-mono text-[10px] tracking-[0.35em] uppercase mb-4"
                style={{ color: MONOLITH_ORANGE }}
              >
                Monolith · Archive
              </span>
              <h3 className="font-display text-[2.25rem] md:text-[2.75rem] lg:text-[3rem] leading-[0.9] uppercase text-white tracking-tight mb-3">
                Autograf
              </h3>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/70 mb-6">
                Live at Castaways
              </p>

              <p className="font-serif italic text-lg md:text-xl leading-relaxed text-white/75 max-w-[38ch] mb-8">
                One of the rooms we built. Captured in full — no edits, no overlays,
                just the set as it happened.
              </p>

              <dl className="grid grid-cols-2 gap-y-4 gap-x-6 font-mono text-[10px] tracking-[0.3em] uppercase border-y border-white/10 py-5 mb-8">
                <div>
                  <dt className="text-white/40 mb-1">Venue</dt>
                  <dd className="text-white">Castaways · Chicago</dd>
                </div>
                <div>
                  <dt className="text-white/40 mb-1">Format</dt>
                  <dd className="text-white">Archive · Full Set</dd>
                </div>
                <div>
                  <dt className="text-white/40 mb-1">Series</dt>
                  <dd className="text-white">Monolith</dd>
                </div>
                <div>
                  <dt className="text-white/40 mb-1">Runtime</dt>
                  <dd className="text-white">58:00</dd>
                </div>
              </dl>
            </div>

            <Link
              href="/archive"
              className="group inline-flex items-center gap-3 self-start font-mono text-[11px] tracking-[0.3em] uppercase text-white border border-white/20 px-5 py-3 hover:border-white hover:bg-white hover:text-black transition-colors"
            >
              <span>Open The Archive</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
