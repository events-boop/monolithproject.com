export type NavigationChapterId =
  | "schedule"
  | "radio"
  | "gallery"
  | "about"
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
    id: "schedule",
    label: "Event Series",
    eyebrow: "Shows + Tickets",
    href: "/schedule",
    tagline: "The core Monolith experience calendar.",
    description:
      "All upcoming Chasing Sun(Sets), Untold Story, and special Monolith drops.",
    proof: "Direct path to tickets and season details.",
    image: "/images/eran-hersh-live-1.webp",
    accent: "#E05A3A",
    ctaLabel: "View Schedule",
    secondaryLinks: [
      { label: "Chasing Sun(Sets)", href: "/chasing-sunsets" },
      { label: "Untold Story", href: "/story" },
      { label: "Entry Guide", href: "/guide#entry" },
    ],
  },
  {
    id: "radio",
    label: "Radio",
    eyebrow: "Cultural Sound",
    href: "/radio",
    tagline: "The frequency of the project, delivered weekly.",
    description:
      "Mixes, guest features, and conversation from the artists shaping our rooms.",
    proof: "Tune in to the sound of Chasing Sun(Sets) and beyond.",
    image: "/images/radio-show-gear.webp",
    accent: "#F43F5E",
    ctaLabel: "Listen to Radio",
    secondaryLinks: [
      { label: "Latest Episode", href: "/radio/ep-01-benchek" },
      { label: "All Episodes", href: "/radio#episodes" },
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    eyebrow: "The Proof",
    href: "/archive",
    tagline: "Visual archives from every night and season.",
    description:
      "A cinematic record of past nights, crowds, and artist sets.",
    proof: "The evidence of togetherness.",
    image: "/images/untold-story-juany-deron-v2.webp",
    accent: "#E8B86D",
    ctaLabel: "Enter Gallery",
    secondaryLinks: [
      { label: "Past Nights", href: "/archive" },
      { label: "Journal", href: "/insights" },
    ],
  },
  {
    id: "about",
    label: "About",
    eyebrow: "The Project",
    href: "/about",
    tagline: "Togetherness is the frequency. Music is the guide.",
    description:
      "Chicago-rooted music company producing open-air and after-dark experiences.",
    proof: "Our principles and story.",
    image: "/images/hero-monolith-modern.webp",
    accent: "#D4A574",
    ctaLabel: "About Monolith",
    secondaryLinks: [
      { label: "The Story", href: "/about#story" },
      { label: "Togetherness", href: "/about#togetherness" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    id: "guide",
    label: "Plan Your Night",
    eyebrow: "The Guide",
    href: "/guide",
    tagline: "Everything you need to step into the room.",
    description:
      "Entry requirements, VIP tables, travel info, and community access.",
    proof: "A seamless night starts with the guide.",
    image: "/images/industrial-roster.webp",
    accent: "#22D3EE",
    ctaLabel: "Open Night Guide",
    secondaryLinks: [
      { label: "VIP Tables", href: "/vip" },
      { label: "Inner Circle", href: "/newsletter" },
      { label: "Partner Access", href: "/partners" },
    ],
  },
];
