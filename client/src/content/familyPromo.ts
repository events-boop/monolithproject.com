import { ROUTES } from "@shared/routes";
import { APE_DRUMS_PROMO_IMAGE, APE_DRUMS_RELEASE } from "@/lib/apeDrumsRelease";

export interface FamilyPromo {
  kicker: string;
  title: string;
  detail: string;
  href: string;
  image: string;
  imageAlt: string;
  /** Large announcement frame copy (LolaPopupFrame). */
  eyebrow: string;
  heading: string;
  body: string;
  facts: readonly string[];
  ctaLabel: string;
  flyer: string;
  flyerAlt: string;
}

// The single family cross-promo shown across the Monolith VIP sites, and the
// single source of truth for its copy. It is null while the featured show's
// release gate is closed, and retires automatically once the event has
// concluded (see eventDate in client/src/lib/artistShowRelease.ts) — from
// that moment the archive collection owns the show's public record.
// Reassign only when the next booking is confirmed and approved.
export const FAMILY_PROMO: FamilyPromo | null =
  (APE_DRUMS_RELEASE.publicReady && !APE_DRUMS_RELEASE.eventConcluded) ||
  import.meta.env.DEV
    ? {
        kicker: "Next in the Monolith family",
        title: "Ape Drums",
        detail: "Friday, July 31 · Kashmir · Chicago",
        href: ROUTES.apeDrums,
        image: APE_DRUMS_PROMO_IMAGE,
        imageAlt: "Ape Drums July 31 event artwork",
        eyebrow: "Introducing",
        heading: "The Lola Pop-Up Weekend",
        body: "The Monolith Project presents Chasing Sun(Sets) as a West Loop pop-up weekend, opening Friday, July 31 with Ape Drums at Kashmir.",
        facts: ["Friday, July 31", "Doors 9 PM", "Kashmir · West Loop"],
        ctaLabel: "View Ape Drums",
        flyer: "/images/events/ape-drums-july31-card.jpg",
        flyerAlt:
          "The Monolith Project presents Chasing Sun(Sets): Ape Drums — Friday, July 31 at Kashmir in the West Loop, doors open 9 PM",
      }
    : null;
