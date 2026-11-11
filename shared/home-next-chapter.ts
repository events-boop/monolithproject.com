import { ROUTES } from "./routes";

/** Owner-approved season preview; not event inventory or an on-sale announcement. */
export const HOME_NEXT_CHAPTER = {
  year: "2027",
  title: "More nights. More stories.",
  description:
    "A new year of music, connection and everything that comes after.",
  signupLabel: "Be the first to know",
  signupHref: ROUTES.newsletter,
  programmes: [
    {
      name: "Untold Story",
      edition: "Season III",
      note: "After dark",
      href: ROUTES.untoldStory,
    },
    {
      name: "Chasing Sunsets",
      edition: "IV",
      note: "Into the golden hour",
      href: ROUTES.chasingSunsets,
    },
    {
      name: "House of Friends",
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
