import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

export default function FeaturedRecap() {
  return (
    <section className="relative bg-black border-t border-white/10 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
        <div className="mb-8 md:mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-6">
          <div>
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-white/40 block mb-2">
              Featured Set
            </span>
            <h3 className="font-display text-2xl md:text-3xl uppercase text-white tracking-tight leading-tight">
              Autograf — Live at Castaways
            </h3>
          </div>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 shrink-0">
            Archive · Full Set
          </span>
        </div>

        <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          <YouTubeEmbed
            url="https://www.youtube.com/watch?v=9R6XH7JZlJI"
            title="Autograf live at Castaways"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
