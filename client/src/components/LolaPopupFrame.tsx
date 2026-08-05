import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import ResponsiveImage from "@/components/ResponsiveImage";
import { FAMILY_PROMO } from "@/content/familyPromo";

const ACCENTS = {
  gold: {
    border: "border-[#E8B86D]/30",
    innerBorder: "border-[#E8B86D]/25",
    eyebrow: "text-[#E8B86D]",
    fact: "text-[#E8B86D]",
    glow: "from-[#E8B86D]/8",
  },
  cyan: {
    border: "border-[#22D3EE]/30",
    innerBorder: "border-[#22D3EE]/25",
    eyebrow: "text-[#22D3EE]",
    fact: "text-[#22D3EE]",
    glow: "from-[#22D3EE]/8",
  },
} as const;

type LolaPopupFrameProps = {
  accent?: keyof typeof ACCENTS;
  className?: string;
  layout?: "responsive" | "stacked";
};

// All copy lives in FAMILY_PROMO (client/src/content/familyPromo.ts), which is
// release-gated and auto-retires once the show concludes — the frame must not
// reveal the booking before the show page is live, nor sell a past event.
export default function LolaPopupFrame({
  accent = "gold",
  className = "",
  layout = "responsive",
}: LolaPopupFrameProps) {
  const titleId = useId();
  const tone = ACCENTS[accent];
  const gridLayout =
    layout === "stacked"
      ? ""
      : "lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]";

  if (!FAMILY_PROMO) return null;
  const promo = FAMILY_PROMO;

  return (
    <section
      aria-labelledby={titleId}
      className={`relative border ${tone.border} bg-white/[0.035] p-4 backdrop-blur-md ${className}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${tone.glow} to-transparent`}
        aria-hidden="true"
      />
      <div className={`relative grid items-center gap-5 ${gridLayout}`}>
        <figure
          className={`mx-auto w-full max-w-[260px] border ${tone.border} bg-black/60 p-2`}
        >
          <ResponsiveImage
            src={promo.flyer}
            alt={promo.flyerAlt}
            sizes="(min-width: 640px) 240px, 70vw"
            className="block h-auto w-full"
          />
        </figure>
        <div className={`text-center ${layout === "responsive" ? "lg:text-left" : ""}`}>
          <p
            className={`font-mono text-[10px] font-black uppercase tracking-[0.3em] ${tone.eyebrow}`}
          >
            {promo.eyebrow}
          </p>
          <h2
            id={titleId}
            className="mt-2 font-display text-[clamp(1.6rem,7vw,2.6rem)] uppercase leading-[0.9] tracking-tight text-white"
          >
            {promo.heading}
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-relaxed text-white/70">
            {promo.body}
          </p>
          <ul
            className={`mt-4 flex flex-wrap justify-center gap-2 ${layout === "responsive" ? "lg:justify-start" : ""}`}
          >
            {promo.facts.map(fact => (
              <li
                key={fact}
                className={`border ${tone.innerBorder} px-3 py-1.5 font-mono text-[9px] font-black uppercase tracking-[0.18em] ${tone.fact}`}
              >
                {fact}
              </li>
            ))}
          </ul>
          <Link
            href={promo.href}
            aria-label={`View ${promo.title} event details`}
            className={`mt-5 inline-flex items-center gap-2 border ${tone.innerBorder} px-4 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-[0.98] motion-reduce:transition-none`}
          >
            {promo.ctaLabel}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
