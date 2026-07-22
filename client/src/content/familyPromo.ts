import { ROUTES } from "@shared/routes";
import { APE_DRUMS_PROMO_IMAGE, APE_DRUMS_RELEASE } from "@/lib/apeDrumsRelease";

export interface FamilyPromo {
  kicker: string;
  title: string;
  detail: string;
  href: string;
  image: string;
  imageAlt: string;
}

// The single family cross-promo shown across the Monolith VIP sites. It is
// null while the featured show's release gate is closed, so every site
// surfaces the card at the same moment the show's landing page goes live.
// Reassign only when the next booking is confirmed and approved.
export const FAMILY_PROMO: FamilyPromo | null =
  APE_DRUMS_RELEASE.publicReady || import.meta.env.DEV
    ? {
        kicker: "Next in the Monolith family",
        title: "Ape Drums",
        detail: "Friday, July 31 · Kashmir · Chicago",
        href: ROUTES.apeDrums,
        image: APE_DRUMS_PROMO_IMAGE,
        imageAlt: "Ape Drums July 31 event artwork",
      }
    : null;
