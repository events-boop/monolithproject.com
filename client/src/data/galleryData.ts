export type GalleryImageItem = {
  id: string;
  kind: "image";
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  description?: string;
  credit?: string;
};

export type GalleryVideoItem = {
  id: string;
  kind: "video";
  src: string;
  width: number;
  height: number;
  poster: string;
  posterWidth: number;
  posterHeight: number;
  alt: string;
  caption?: string;
  description?: string;
  credit?: string;
};

export type MediaItem = GalleryImageItem | GalleryVideoItem;

export interface ArchiveCollection {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  coverImage: string;
  date: string;
  media: MediaItem[];
}

function image(item: GalleryImageItem): GalleryImageItem {
  return item;
}

function video(item: GalleryVideoItem): GalleryVideoItem {
  return item;
}

export const homeGallery: MediaItem[] = [
  image({
    id: "home-untold-juany-deron",
    kind: "image",
    src: "/images/untold-story-juany-deron-v2.webp",
    width: 2399,
    height: 3600,
    alt: "Untold Story with Juany Bravo and Deron",
    caption: "Untold Story",
    description: "Juany Bravo and Deron leading the room through a late-night chapter.",
  }),
  video({
    id: "home-highlight-film",
    kind: "video",
    src: "/videos/hero-video-short.mp4",
    width: 1920,
    height: 1080,
    poster: "/images/hero-video-1-poster.jpg",
    posterWidth: 1920,
    posterHeight: 1080,
    alt: "Monolith Project highlight reel",
    caption: "Highlight Reel",
    description: "Atmosphere, movement, and texture from the Monolith world.",
  }),
  image({
    id: "home-chasing-sunsets",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-1.jpg",
    width: 2752,
    height: 1536,
    alt: "Chasing Sun(Sets) crowd at golden hour",
    caption: "Chasing Sun(Sets)",
    description: "Golden-hour energy from the rooftop and shoreline chapters.",
  }),
  image({
    id: "home-collective",
    kind: "image",
    src: "/images/hero-monolith.webp",
    width: 2752,
    height: 1536,
    alt: "The Monolith Project collective",
    caption: "The Collective",
    description: "A wider frame of the community and the scale of the experience.",
  }),
  image({
    id: "home-lazare",
    kind: "image",
    src: "/images/lazare-recap.webp",
    width: 1542,
    height: 1161,
    alt: "Lazare recap moment",
    caption: "Lazare",
    description: "A recap frame from one of the strongest archive nights.",
  }),
  image({
    id: "home-autograf",
    kind: "image",
    src: "/images/autograf-recap.jpg",
    width: 686,
    height: 386,
    alt: "Autograf recap frame",
    caption: "Autograf",
    description: "A compressed burst of live-set energy from the archive.",
  }),
];

export const chasingSeason1: MediaItem[] = [
  image({
    id: "css1-overview",
    kind: "image",
    src: "/images/chasing-sunsets-premium.webp",
    width: 2752,
    height: 1536,
    alt: "Chasing Sun(Sets) overview at sunset",
    caption: "Season I",
  }),
  image({
    id: "css1-amari",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-2.jpg",
    width: 1920,
    height: 1080,
    alt: "Amari at Chasing Sun(Sets)",
    caption: "Amari",
  }),
  image({
    id: "css1-erik",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-3.jpg",
    width: 1920,
    height: 1080,
    alt: "Erik at Chasing Sun(Sets)",
    caption: "Erik",
  }),
  image({
    id: "css1-group",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-4.jpg",
    width: 1920,
    height: 1080,
    alt: "Group moment at Chasing Sun(Sets)",
    caption: "The Crowd",
  }),
  image({
    id: "css1-sarat",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-5.jpg",
    width: 1920,
    height: 1080,
    alt: "Sarat at Chasing Sun(Sets)",
    caption: "Sarat",
  }),
  video({
    id: "css1-film",
    kind: "video",
    src: "/videos/hero-video-1.mp4",
    width: 1920,
    height: 1080,
    poster: "/images/hero-video-1-poster.jpg",
    posterWidth: 1920,
    posterHeight: 1080,
    alt: "Chasing Sun(Sets) moving recap",
    caption: "Season Film",
    description: "Motion study from the series atmosphere and crowd rhythm.",
  }),
];

export const chasingSeason2: MediaItem[] = [
  image({
    id: "css2-1",
    kind: "image",
    src: "/images/chasing-sunsets-1.jpg",
    width: 1024,
    height: 682,
    alt: "Chasing Sun(Sets) season II moment one",
    caption: "Arrival",
  }),
  image({
    id: "css2-2",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-2.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) season II portrait frame",
    caption: "Portrait",
  }),
  image({
    id: "css2-3",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-3.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) season II crowd frame",
    caption: "Crowd",
  }),
  image({
    id: "css2-4",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-4.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) season II wide frame",
    caption: "Wide Frame",
  }),
  image({
    id: "css2-5",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-5.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) season II energy frame",
    caption: "Energy",
  }),
  image({
    id: "css2-6",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-6.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) season II ambient frame",
    caption: "Ambient",
  }),
  image({
    id: "css2-7",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-7.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) season II finale frame",
    caption: "Final Light",
  }),
];

export const chasingSeason3: MediaItem[] = [
  image({
    id: "css3-1",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-1.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) wide boat club shot",
    caption: "Open Air",
  }),
  image({
    id: "css3-2",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-2.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) crowd on deck",
    caption: "Castaways",
  }),
  image({
    id: "css3-3",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-3.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) boat at night with skyline",
    caption: "Night Session",
  }),
  image({
    id: "css3-4",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-4.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) DJ set high energy",
    caption: "The Booth",
  }),
  image({
    id: "css3-5",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-5.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) crowd energy at night",
    caption: "Rhythm",
  }),
  image({
    id: "css3-6",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-6.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) daytime boat overview",
    caption: "Overview",
  }),
  image({
    id: "css3-7",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-7.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) night vibe on boat",
    caption: "Atmosphere",
  }),
  image({
    id: "css3-8",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-8.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) boats aligned in harbor",
    caption: "Shoreline",
  }),
  image({
    id: "css3-9",
    kind: "image",
    src: "/images/archive/chasing-sunsets/css-s3-9.jpg",
    width: 1920,
    height: 1080,
    alt: "Chasing Sun(Sets) finale energy",
    caption: "Finale",
  }),
];

export const untoldSeason1: MediaItem[] = [
  image({
    id: "untold1-overview",
    kind: "image",
    src: "/images/untold-story-moody.webp",
    width: 2752,
    height: 1536,
    alt: "Untold Story atmosphere",
    caption: "Untold Story",
  }),
  image({
    id: "untold1-summer",
    kind: "image",
    src: "/images/untold-story-hero-post1.webp",
    width: 1080,
    height: 1350,
    alt: "Untold Story season I with Summer Mel",
    caption: "Summer Mel",
  }),
  image({
    id: "untold1-manifesto",
    kind: "image",
    src: "/images/untold-story-moody.webp",
    width: 1600,
    height: 893,
    alt: "Untold Story manifesto frame",
    caption: "Manifesto",
  }),
  image({
    id: "untold1-avo",
    kind: "image",
    src: "/images/untold-story-juany-deron-v2.webp",
    width: 1600,
    height: 2401,
    alt: "Avo at Untold Story season I",
    caption: "Avo",
  }),
  image({
    id: "untold1-chapter",
    kind: "image",
    src: "/images/lazare-recap.webp",
    width: 1542,
    height: 1161,
    alt: "Untold Story chapter one lineup",
    caption: "Chapter 01",
  }),
];

// Lazare Sabry - December 12, 2025
export const untoldSeason2: MediaItem[] = [
  image({
    id: "untold2-overview",
    kind: "image",
    src: "/images/lazare-recap.webp",
    width: 1542,
    height: 1161,
    alt: "Lazare Sabry at Untold Story",
    caption: "Lazare Sabry",
  }),
  image({
    id: "untold2-carbon",
    kind: "image",
    src: "/images/lazare-carbon-center.png",
    width: 743,
    height: 665,
    alt: "Carbon center invitation asset",
    caption: "Carbon Center",
  }),
  image({
    id: "untold2-artist",
    kind: "image",
    src: "/images/artist-lazare.webp",
    width: 1024,
    height: 1024,
    alt: "Lazare Sabry",
    caption: "Portrait",
  }),
];

// March 6 2026 - Juany Bravo B2B Deron. The full raw set is not shipped in the
// public bundle; keep the archive page on the optimized editorial selects.
export const untoldSeason3: MediaItem[] = [
  image({
    id: "us3-finale",
    kind: "image",
    src: "/images/untold-story-juany-deron-v2.webp",
    width: 1600,
    height: 2401,
    alt: "Untold Story S3 — Deron B2B Juany Bravo — March 6, 2026",
    caption: "Finale",
  }),
  image({
    id: "us3-room",
    kind: "image",
    src: "/images/untold-story-moody.webp",
    width: 1600,
    height: 893,
    alt: "Untold Story S3 room atmosphere",
    caption: "The Room",
  }),
  image({
    id: "us3-artist",
    kind: "image",
    src: "/images/deron-press.jpg",
    width: 1024,
    height: 1024,
    alt: "Deron Untold Story artist portrait",
    caption: "Deron",
  }),
  image({
    id: "us3-chapter",
    kind: "image",
    src: "/images/untold-story-hero-post1.webp",
    width: 1080,
    height: 1350,
    alt: "Untold Story S3 chapter artwork",
    caption: "Chapter",
  }),
];

export const autografSpecial: MediaItem[] = [
  image({
    id: "autograf-1",
    kind: "image",
    src: "/images/autograf-recap.jpg",
    width: 2500,
    height: 1667,
    alt: "Autograf at Alhambra Palace — March 21, 2026",
    caption: "Live Set",
  }),
  image({
    id: "autograf-portrait",
    kind: "image",
    src: "/images/artist-autograf.webp",
    width: 1024,
    height: 1024,
    alt: "Autograf",
    caption: "Portrait",
  }),
];

export const archiveCollectionsBySlug: Record<string, ArchiveCollection> = {
  "chasing-sunsets-season-i": {
    slug: "chasing-sunsets-season-i",
    title: "Chasing Sun(Sets)",
    subtitle: "Season I",
    description: "Golden-hour frames, artist portraits, and moving records from the first season.",
    accentColor: "#E8B86D",
    coverImage: "/images/chasing-sunsets-premium.webp",
    date: "Summer 2024",
    media: chasingSeason1,
  },
  "chasing-sunsets-season-ii": {
    slug: "chasing-sunsets-season-ii",
    title: "Chasing Sun(Sets)",
    subtitle: "Season II",
    description: "A tighter editorial cut from the second wave of the sunset series.",
    accentColor: "#E8B86D",
    coverImage: "/images/chasing-sunsets-1.jpg",
    date: "Summer 2025",
    media: chasingSeason2,
  },
  "chasing-sunsets-season-iii": {
    slug: "chasing-sunsets-season-iii",
    title: "Chasing Sun(Sets)",
    subtitle: "Season III",
    description: "The latest wave of the shoreline series — boat club and beach chapters.",
    accentColor: "#E8B86D",
    coverImage: "/images/archive/chasing-sunsets/css-s3-1.jpg",
    date: "Summer 2025",
    media: chasingSeason3,
  },
  "untold-story-season-i": {
    slug: "untold-story-season-i",
    title: "Untold Story",
    subtitle: "Season I",
    description: "The first chapter of Untold Story in poster, crowd, and manifesto form.",
    accentColor: "#8B5CF6",
    coverImage: "/images/untold-story-moody.webp",
    date: "2024",
    media: untoldSeason1,
  },
  "untold-story-season-ii": {
    slug: "untold-story-season-ii",
    title: "Untold Story",
    subtitle: "Season II — Lazare Sabry",
    description: "Artist-led frames and portrait studies from the Lazare Sabry chapter.",
    accentColor: "#8B5CF6",
    coverImage: "/images/lazare-recap.webp",
    date: "December 12, 2025",
    media: untoldSeason2,
  },
  "untold-story-season-iii": {
    slug: "untold-story-season-iii",
    title: "Untold Story",
    subtitle: "Season III — Deron B2B Juany Bravo",
    description: "Optimized editorial selects from the Deron B2B Juany Bravo chapter.",
    accentColor: "#8B5CF6",
    coverImage: "/images/untold-story-juany-deron-v2.webp",
    date: "March 6, 2026",
    media: untoldSeason3,
  },
  "autograf-special-event": {
    slug: "autograf-special-event",
    title: "The Monolith Project",
    subtitle: "Special Event — Autograf",
    description: "Live instrumentation and immersive energy from the Autograf Chicago night.",
    accentColor: "#FFFFFF",
    coverImage: "/images/autograf-recap.jpg",
    date: "March 21, 2026",
    media: autografSpecial,
  },
  "eran-hersh-international": {
    slug: "eran-hersh-international",
    title: "Eran Hersh",
    subtitle: "Global Chapters",
    description: "Atmospheric studies from Eran Hersh's international circuit, featuring RheinRiff and Bazar chapters.",
    accentColor: "#22D3EE",
    coverImage: "/images/eran-hersh-live-5.webp",
    date: "2024-2025",
    media: [
      image({
        id: "eran-global-1",
        kind: "image",
        src: "/images/eran-hersh-live-1.webp",
        width: 1024,
        height: 682,
        alt: "Eran Hersh Bazar chapter",
        caption: "Bazar by Sasson",
      }),
      image({
        id: "eran-global-2",
        kind: "image",
        src: "/images/eran-hersh-live-6.png",
        width: 1024,
        height: 1536,
        alt: "Eran Hersh crowd moment B&W",
        caption: "Dark Room Studies",
      }),
      image({
        id: "eran-global-3",
        kind: "image",
        src: "/images/eran-hersh-live-5.webp",
        width: 2500,
        height: 1667,
        alt: "Eran Hersh at RheinRiff",
        caption: "RheinRiff",
      }),
      image({
        id: "eran-global-4",
        kind: "image",
        src: "/images/eran-hersh-live-6.png",
        width: 1667,
        height: 2500,
        alt: "Eran Hersh portrait study",
        caption: "Portrait Chapter",
      }),
    ],
  },
};
