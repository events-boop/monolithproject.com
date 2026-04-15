export type NavigationChapterId =
  | "next-night"
  | "schedule"
  | "chasing-sunsets"
  | "untold-story"
  | "artists"
  | "radio"
  | "guide";

export interface NavigationChapterLink {
  label: string;
  href: string;
}

export interface NavigationChapter {
  id: NavigationChapterId;
  label: string;
  eyebrow: string;
  href: string;
  tagline: string;
  description: string;
  proof: string;
  image: string;
  accent: string;
  ctaLabel: string;
  secondaryLinks: NavigationChapterLink[];
}

export const navigationChapters: NavigationChapter[] = [
  {
    id: "next-night",
    label: "Next Night",
    eyebrow: "Current Signal",
    href: "/tickets",
    tagline: "The fastest path into the room.",
    description:
      "A direct preview of the next Monolith night, ticket state, and arrival path.",
    proof: "Current event, ticket state, and room context in one step.",
    image: "/images/eran-hersh-live-1.png",
    accent: "#E05A3A",
    ctaLabel: "Secure Access",
    secondaryLinks: [
      { label: "View Event", href: "/schedule" },
      { label: "Arrival Guide", href: "/guide" },
    ],
  },
  {
    id: "schedule",
    label: "Schedule",
    eyebrow: "Season Map",
    href: "/schedule",
    tagline: "All upcoming dates, states, and series in one place.",
    description:
      "The canonical calendar for Chasing Sun(Sets), Untold Story, and Monolith releases.",
    proof: "A cleaner decision surface for every upcoming date.",
    image: "/images/autograf-recap.jpg",
    accent: "#8B5CF6",
    ctaLabel: "View Schedule",
    secondaryLinks: [
      { label: "Tickets", href: "/tickets" },
      { label: "Archive", href: "/archive" },
    ],
  },
  {
    id: "chasing-sunsets",
    label: "Chasing Sun(Sets)",
    eyebrow: "Open-Air Branch",
    href: "/chasing-sunsets",
    tagline: "Golden-hour rituals built for movement and return.",
    description:
      "Warm open-air rooms, melodic and afro house, and sunset-to-sundown pacing.",
    proof: "The daytime branch of the Monolith ecosystem.",
    image: "/images/chasing-sunsets-premium.webp",
    accent: "#E8B86D",
    ctaLabel: "Enter Chasing Sun(Sets)",
    secondaryLinks: [
      { label: "Next Episode", href: "/schedule" },
      { label: "Season Archive", href: "/archive" },
    ],
  },
  {
    id: "untold-story",
    label: "Untold Story",
    eyebrow: "After-Dark Branch",
    href: "/story",
    tagline: "Late-night rooms built for tension, clarity, and connection.",
    description:
      "A darker, more immersive branch for indoor rooms, focused sound, and narrative energy.",
    proof: "The nocturne branch of the Monolith ecosystem.",
    image: "/images/untold-story-juany-deron-v2.webp",
    accent: "#22D3EE",
    ctaLabel: "Enter Untold Story",
    secondaryLinks: [
      { label: "Next Night", href: "/tickets" },
      { label: "Season Archive", href: "/archive" },
    ],
  },
  {
    id: "artists",
    label: "Artists",
    eyebrow: "The Roster",
    href: "/lineup",
    tagline: "The people behind the rooms.",
    description:
      "Explore artists across Chasing Sun(Sets), Untold Story, and Sun(Sets) Radio.",
    proof: "A taste-led roster connected across events, radio, and archive.",
    image: "/images/artists-collective.webp",
    accent: "#F2F0E8",
    ctaLabel: "Explore Lineup",
    secondaryLinks: [
      { label: "Featured Artists", href: "/lineup" },
      { label: "Radio Episodes", href: "/radio" },
    ],
  },
  {
    id: "radio",
    label: "Radio",
    eyebrow: "Between Rooms",
    href: "/radio",
    tagline: "The sound of the project between events.",
    description:
      "Episodes, guest mixes, tracklists, and a continuous taste layer for the Monolith world.",
    proof: "Retention, discovery, and artist context without waiting for the next event.",
    image: "/images/radio-show-gear.webp",
    accent: "#FB7185",
    ctaLabel: "Play Radio",
    secondaryLinks: [
      { label: "Latest Episode", href: "/radio/ep-01-benchek" },
      { label: "Browse Episodes", href: "/radio" },
    ],
  },
  {
    id: "guide",
    label: "Guide",
    eyebrow: "Plan The Night",
    href: "/guide",
    tagline: "Entry, timing, arrival, and hospitality without guesswork.",
    description:
      "The practical layer for getting in, arriving cleanly, and choosing the right access path.",
    proof: "Operational clarity is part of the premium experience.",
    image: "/images/industrial-roster.webp",
    accent: "#D4A574",
    ctaLabel: "Plan Your Night",
    secondaryLinks: [
      { label: "Entry Checklist", href: "/guide#entry" },
      { label: "VIP Access", href: "/vip" },
    ],
  },
];
