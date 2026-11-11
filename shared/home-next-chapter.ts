import { ROUTES } from "./routes";

/** Owner-approved season preview; not event inventory or an on-sale announcement. */
export const HOME_NEXT_CHAPTER = {
  year: "2027",
  brand: "THE MONOLITH PROJECT COLLECTIVE",
  title: "More nights. More stories.",
  description:
    "A new year of music, connection and everything that comes after.",
  signupLabel: "Be the first to know",
  signupHref: ROUTES.newsletter,
  programmes: [
    {
      name: "UNTOLD STORY",
      edition: "Season III",
      note: "After dark",
      href: ROUTES.untoldStory,
    },
    {
      name: "CHASING SUN(SETS)",
      edition: "IV",
      note: "Into the golden hour",
      href: ROUTES.chasingSunsets,
    },
    {
      name: "HOUSE OF FRIENDS",
      edition: "More together",
      note: "Good people. New memories.",
      href: ROUTES.houseOfFriends,
    },
    {
      name: "SUNSETS.FM",
      edition: "Stay tuned",
      note: "Beyond the dance floor",
      href: ROUTES.sunsetsFM,
    },
  ],
} as const;
