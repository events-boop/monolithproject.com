import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { FAMILY_PROMO } from "@/content/familyPromo";
import ResponsiveImage from "@/components/ResponsiveImage";

// Brand-neutral cross-promo card for the current Monolith family booking.
// Renders nothing while the show's release gate is closed (see
// client/src/content/familyPromo.ts).
export default function FamilyEventPromo() {
  if (!FAMILY_PROMO) return null;

  return (
    <Link
      href={FAMILY_PROMO.href}
      aria-label={`${FAMILY_PROMO.title} — ${FAMILY_PROMO.detail}`}
      className="group flex items-center gap-4 border border-white/12 bg-white/[0.03] p-3 text-left transition hover:border-white/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-[0.99] motion-reduce:transition-none"
    >
      <ResponsiveImage
        src={FAMILY_PROMO.image}
        alt={FAMILY_PROMO.imageAlt}
        sizes="64px"
        className="h-16 w-16 shrink-0 object-cover"
      />
      <span className="min-w-0">
        <span className="block font-mono text-[9px] font-black uppercase tracking-[0.28em] text-white/45">
          {FAMILY_PROMO.kicker}
        </span>
        <span className="mt-1 block font-display text-xl uppercase leading-none text-white">
          {FAMILY_PROMO.title}
        </span>
        <span className="mt-1.5 block text-xs font-medium text-white/55">
          {FAMILY_PROMO.detail}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="ml-auto h-4 w-4 shrink-0 text-white/40 transition group-hover:text-white motion-reduce:transition-none"
      />
    </Link>
  );
}
