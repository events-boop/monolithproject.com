import { ROUTES, routeRadioEpisode } from "@shared/routes";

export type NavigationChapterId =
  | "schedule"
  | "artists"
  | "chasing-sunsets"
  | "untold-story"
  | "radio";

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
    id: "schedule",
    label: "Shows",
    eyebrow: "Tickets + Dates",
    href: ROUTES.schedule,
    tagline: "Start with the next Monolith show.",
    description:
      "A direct preview of the next show, ticket state, and the fastest path in.",
    proof: "The clearest route from interest to entry.",
    image: "/images/chasing-sunsets-premium.webp",
    accent: "#E05A3A",
    ctaLabel: "View Shows",
    secondaryLinks: [
      { label: "See The Schedule", href: ROUTES.schedule },
      { label: "Sign Up for Drops", href: ROUTES.newsletter },
    ],
  },
  {
    id: "artists",
    label: "Artists",
    eyebrow: "Roster",
    href: ROUTES.artists,
    tagline: "The artists behind the shows.",
    description:
      "Explore artists across Chasing Sun(Sets), Untold Story, and Sun(Sets) Radio.",
    proof: "A direct view of the artists shaping the sound.",
    image: "/images/artists-collective.webp",
    accent: "#F2F0E8",
    ctaLabel: "Explore Artists",
    secondaryLinks: [
      { label: "Featured Artists", href: ROUTES.lineup },
      { label: "Radio Episodes", href: ROUTES.radio },
    ],
  },
  {
    id: "chasing-sunsets",
    label: "Chasing Sun(Sets)",
    eyebrow: "Open-Air Series",
    href: ROUTES.chasingSunsets,
    tagline: "Golden-hour house music built for movement and return.",
    description:
      "Open-air gatherings shaped by lakefront energy, headline moments, and community.",
    proof: "Season drops, lineup news, and the summer archive.",
    image: "/images/chasing-sunsets-premium.webp",
    accent: "#E8B86D",
    ctaLabel: "View Chasing Sun(Sets)",
    secondaryLinks: [
      { label: "Next Episode", href: ROUTES.schedule },
      { label: "Season Archive", href: ROUTES.archive },
    ],
  },
  {
    id: "untold-story",
    label: "Untold Story",
    eyebrow: "Indoor Series",
    href: ROUTES.story,
    tagline: "After-dark rooms built for deeper sound and real dancefloors.",
    description:
      "Indoor nights focused on immersive dancefloors, tighter rooms, and artist-led sets.",
    proof: "Current indoor event details, tickets, and past nights.",
    image: "/images/untold-story-juany-deron-v2.webp",
    accent: "#22D3EE",
    ctaLabel: "View Untold Story",
    secondaryLinks: [
      { label: "Next Night", href: ROUTES.tickets },
      { label: "Season Archive", href: ROUTES.archive },
    ],
  },
  {
    id: "radio",
    label: "Radio",
    eyebrow: "Artist Content",
    href: ROUTES.radio,
    tagline: "Mixes, guests, and radio episodes between shows.",
    description:
      "Episodes, guest mixes, tracklists, and artist context that keep the sound moving between nights.",
    proof: "A direct way to hear the artists before you are in the room.",
    image: "/images/radio-show-gear.webp",
    accent: "#FB7185",
    ctaLabel: "Play Radio",
    secondaryLinks: [
      { label: "Latest Episode", href: routeRadioEpisode("ep-01-benchek") },
      { label: "Browse Episodes", href: ROUTES.radio },
    ],
  },
];
