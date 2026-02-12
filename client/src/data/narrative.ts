import { upcomingEvents, type ScheduledEvent } from "@/data/events";

export type SeriesSlug = ScheduledEvent["series"];

export interface SeriesProfile {
  slug: SeriesSlug;
  title: string;
  shortTitle: string;
  seasonLabel: string;
  tagline: string;
  description: string;
  visualTheme: string;
  chapterOrder: string[];
  keyArtists: string[];
  storyPillars: string[];
  legacyPath: string;
  colors: {
    base: string;
    accent: string;
    glow: string;
  };
}

const seriesProfiles: Record<SeriesSlug, SeriesProfile> = {
  "chasing-sunsets": {
    slug: "chasing-sunsets",
    title: "CHASING SUN(SETS)",
    shortTitle: "Sun(Sets)",
    seasonLabel: "Series 01",
    tagline: "Golden hour. Good people. Great music.",
    description:
      "Rooftop and open-air gatherings designed around light, warmth, and movement. The chapter arc starts at sunset and lands in deep night.",
    visualTheme: "Editorial warm minimalism",
    chapterOrder: [],
    keyArtists: ["Benchek", "Terranova", "Ewerseen", "Autograf"],
    storyPillars: ["Golden Hour Curation", "Open-Air Ritual", "Community Flow"],
    legacyPath: "/chasing-sunsets",
    colors: {
      base: "#1E130D",
      accent: "#C2703E",
      glow: "#E8B86D",
    },
  },
  "untold-story": {
    slug: "untold-story",
    title: "UNTOLD STORY",
    shortTitle: "Untold",
    seasonLabel: "Series 02",
    tagline: "The story is told through sound.",
    description:
      "Late-night, immersive chapters focused on narrative DJ sets, intentional pacing, and a dancefloor-first culture. Each event is a chapter in a connected arc.",
    visualTheme: "Cinematic neon noir",
    chapterOrder: ["us-s3e2", "us-s3e3-autograf", "us-002"],
    keyArtists: ["Deron", "Juany Bravo", "Autograf", "Hashtom", "Rose", "Avo", "Jerome", "Kenbo"],
    storyPillars: ["360 Sound Narrative", "Intimate Rooms", "Chapter Continuity"],
    legacyPath: "/story",
    colors: {
      base: "#06060F",
      accent: "#8B5CF6",
      glow: "#22D3EE",
    },
  },
  "monolith-project": {
    slug: "monolith-project",
    title: "THE MONOLITH PROJECT",
    shortTitle: "Monolith",
    seasonLabel: "Core Series",
    tagline: "Togetherness is the frequency.",
    description:
      "The umbrella narrative that links chapters across formats, artists, and spaces. Built for long-form worldbuilding, not one-off nights.",
    visualTheme: "Futurist editorial monochrome",
    chapterOrder: ["mp-launch-001"],
    keyArtists: ["Monolith Collective"],
    storyPillars: ["Mythology", "Movement", "Interconnected Chapters"],
    legacyPath: "/about",
    colors: {
      base: "#0A0A0A",
      accent: "#E6E6E6",
      glow: "#22D3EE",
    },
  },
};

function parseEventDate(dateLabel: string) {
  const parsed = Date.parse(dateLabel);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function scoreEventForSeries(event: ScheduledEvent, profile: SeriesProfile) {
  const chapterIndex = profile.chapterOrder.indexOf(event.id);
  if (chapterIndex >= 0) return chapterIndex;
  return profile.chapterOrder.length + parseEventDate(event.date);
}

export function getSeriesProfile(slug: string): SeriesProfile | null {
  if (slug === "chasing-sunsets" || slug === "untold-story" || slug === "monolith-project") {
    return seriesProfiles[slug];
  }
  return null;
}

export function getAllSeriesProfiles() {
  return Object.values(seriesProfiles);
}

export function getSeriesEvents(slug: SeriesSlug) {
  const profile = seriesProfiles[slug];
  return upcomingEvents
    .filter((event) => event.series === slug)
    .sort((a, b) => scoreEventForSeries(a, profile) - scoreEventForSeries(b, profile));
}

