export interface ArchiveRecap {
  slug: string;
  eventId?: string;
  title: string;
  subtitle: string;
  date: string;
  photographer: string;
  image: string;
  location: string;
  summary: string;
  highlights: string[];
  galleryUrl?: string;
  relatedEpisodeSlug?: string;
}

export interface RadioEpisode {
  slug: string;
  title: string;
  artist: string;
  series: "sunsets" | "untold";
  duration: string;
  soundcloudUrl: string;
  embedUrl: string;
  publishedAt: string;
  commentary: string;
  tracklist: string[];
}

export const archiveRecaps: ArchiveRecap[] = [
  {
    slug: "lazare-sabry-s3e1",
    eventId: "us-s3e1",
    title: "LAZARE SABRY",
    subtitle: "UNTOLD STORY S3·E1",
    date: "December 12, 2025",
    photographer: "JP Quindara",
    image: "/images/lazare-recap.png",
    location: "Chicago, IL",
    summary:
      "A chapter defined by slow-build tension, deep melodic pressure, and a locked-in dancefloor from open to close.",
    highlights: ["Full-room singback at midnight", "Extended closing sequence", "Peak occupancy before 11 PM"],
    galleryUrl: "https://pogistudios.pixieset.com/lazarecarbon/",
    relatedEpisodeSlug: "radian-untold-story",
  },
  {
    slug: "autograf-spring-session",
    eventId: "us-s3e3-autograf",
    title: "AUTOGRAF",
    subtitle: "UNTOLD STORY III",
    date: "March 21, 2026",
    photographer: "Monolith Visual Unit",
    image: "/images/autograf-recap.jpg",
    location: "Alhambra Palace, Chicago",
    summary:
      "Untold Story III delivered a melodic-heavy live set arc with fast sell-through and one of the strongest early-mover turnouts this season.",
    highlights: ["Early mover RSVP sold quickly", "Live instrumentation crossover moments", "High-energy close after 2 AM"],
    relatedEpisodeSlug: "terranova-chasing-sunsets",
  },
];

export const radioEpisodes: RadioEpisode[] = [
  {
    slug: "special-nye-benchek",
    title: "Spécial NYE",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "58:23",
    soundcloudUrl:
      "https://soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ccsep010-chapter-iii-chasing-sunsets-special-nye-by-benchek&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    publishedAt: "January 2026",
    commentary: "An energetic year-transition mix built for rooftops and late-night carry-over.",
    tracklist: ["Benchek Intro ID", "Afro Groove Suite", "Peak Hour Vocal Rework", "Closing Sunrise Cut"],
  },
  {
    slug: "terranova-chasing-sunsets",
    title: "TERRANOVA x CHASING SUN(SETS)",
    artist: "TERRANOVA",
    series: "sunsets",
    duration: "62:10",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/terranova",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/terranova&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    publishedAt: "December 2025",
    commentary: "A warm, progression-driven set recorded for the sunset chapter sequence.",
    tracklist: ["Terranova Warmup", "Organic Midtempo Pivot", "Percussive Lift", "Finale Blend"],
  },
  {
    slug: "ewerseen-mix-vol-3",
    title: "Mix Vol.3",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "55:48",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-chasing-sunsets-mix-vol3&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    publishedAt: "November 2025",
    commentary: "Minimal but punchy structure with dense low-end control throughout the second act.",
    tracklist: ["Volume Open", "Broken Rhythm Segment", "Mainroom Roll", "Afterglow Outro"],
  },
  {
    slug: "radian-untold-story",
    title: "RADIAN x UNTOLD STORY",
    artist: "RADIAN",
    series: "untold",
    duration: "71:05",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/radianofc-set",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/radianofc-set&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    publishedAt: "October 2025",
    commentary: "Late-night narrative pacing with long transitions and low-light tension curves.",
    tracklist: ["Radian Intro", "Untold Build I", "Deep Narrative Segment", "Final Story Arc"],
  },
  {
    slug: "ewerseen-collab-vol-2",
    title: "Collab Mix Vol.2",
    artist: "EWERSEEN",
    series: "sunsets",
    duration: "48:32",
    soundcloudUrl: "https://soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/ewerseen-x-chasing-sunsets-collab-mix-vol2&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    publishedAt: "September 2025",
    commentary: "Collaborative blend focused on rhythmic handoffs and high-energy transitions.",
    tracklist: ["B2B Introduction", "Collab Main Section", "Polyrhythm Bridge", "Closing Runner"],
  },
  {
    slug: "live-from-marbella-ep02",
    title: "Live from Marbella EP02",
    artist: "BENCHEK",
    series: "sunsets",
    duration: "64:17",
    soundcloudUrl:
      "https://soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chasing-sun-sets/benchek-chasing-sunsets-collab-ep02-live-from-marbella&color=%23d4a574&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false",
    publishedAt: "August 2025",
    commentary: "Field recording from an open-air chapter featuring long-form melodic play.",
    tracklist: ["Marbella Intro", "Sunset Segment", "Main Floor Wave", "Nightfall Exit"],
  },
];

export function getArchiveRecapBySlug(slug: string) {
  return archiveRecaps.find((recap) => recap.slug === slug) || null;
}

export function getEpisodeBySlug(slug: string) {
  return radioEpisodes.find((episode) => episode.slug === slug) || null;
}

