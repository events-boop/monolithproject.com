import { ROUTES } from "./routes";

export const MONOLITH_ORIGIN = "https://monolithproject.com";
export type CampaignBioTheme = "sunsets" | "untold" | "friends";
export const CAMPAIGN_BIOS = {
  sunsets: {
    theme: "sunsets",
    path: ROUTES.sunsetsBio,
    domain: "https://sunsets.vip",
    title: "Chasing",
    accent: "Sun(Sets)",
    name: "Chasing Sun(Sets)",
    description:
      "House music by the lake. Golden-hour gatherings, familiar faces, and a soundtrack that stays with you.",
    status: "2027 · Taking shape",
    note: "New dates and lineups will be announced here.",
    fullPage: {
      label: "Explore Chasing Sun(Sets)",
      detail: "The lakefront series, artists and past gatherings",
      href: MONOLITH_ORIGIN + ROUTES.chasingSunsets,
    },
    instagram: "https://instagram.com/chasingsunsets.music",
  },
  untold: {
    theme: "untold",
    path: ROUTES.untoldVip,
    domain: "https://untold.vip",
    title: "Untold",
    accent: "Story",
    name: "Untold Story",
    description:
      "Chicago after dark. Intimate rooms, deep selections, and nights shaped by the people on the dance floor.",
    status: "2027 · The next chapter",
    note: "Dates and artists are still to be announced.",
    fullPage: {
      label: "Explore Untold Story",
      detail: "The series, artists and previous chapters",
      href: MONOLITH_ORIGIN + ROUTES.untoldStory,
    },
    instagram: "https://instagram.com/untoldstory.music",
  },
  friends: {
    theme: "friends",
    path: ROUTES.houseOfFriendsBio,
    domain: "https://houseoffriends.vip",
    title: "House of",
    accent: "Friends",
    name: "House of Friends",
    description:
      "A home for emerging artists. Meet your people, make music together, and build what comes next.",
    status: "Artist community",
    note: "Explore the program and stay connected for future opportunities.",
    fullPage: {
      label: "Inside House of Friends",
      detail: "The artist program, community and application status",
      href: MONOLITH_ORIGIN + ROUTES.houseOfFriends,
    },
    instagram: "https://instagram.com/monolithproject.events",
  },
} as const;
