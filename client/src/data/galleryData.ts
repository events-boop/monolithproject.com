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
    src: "/images/untold-story-juany-deron-v2.jpg",
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
    poster: "/images/hero-video-short-poster.jpg",
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
    src: "/images/hero-monolith.jpg",
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
    src: "/images/chasing-sunsets.jpg",
    width: 2752,
    height: 1536,
    alt: "Chasing Sun(Sets) overview at sunset",
    caption: "Season I",
  }),
  image({
    id: "css1-amari",
    kind: "image",
    src: "/images/chasing-s1e1-amari.jpg",
    width: 2752,
    height: 1536,
    alt: "Amari at Chasing Sun(Sets)",
    caption: "Amari",
  }),
  image({
    id: "css1-erik",
    kind: "image",
    src: "/images/chasing-s1e1-erik.jpg",
    width: 2752,
    height: 1536,
    alt: "Erik at Chasing Sun(Sets)",
    caption: "Erik",
  }),
  image({
    id: "css1-group",
    kind: "image",
    src: "/images/chasing-s1e1-group.jpg",
    width: 2752,
    height: 1536,
    alt: "Group moment at Chasing Sun(Sets)",
    caption: "The Crowd",
  }),
  image({
    id: "css1-sarat",
    kind: "image",
    src: "/images/chasing-s1e1-sarat.jpg",
    width: 2752,
    height: 1536,
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
    src: "/images/chasing-sunsets-2.jpg",
    width: 682,
    height: 1024,
    alt: "Chasing Sun(Sets) season II portrait frame",
    caption: "Portrait",
  }),
  image({
    id: "css2-3",
    kind: "image",
    src: "/images/chasing-sunsets-3.jpg",
    width: 1024,
    height: 682,
    alt: "Chasing Sun(Sets) season II crowd frame",
    caption: "Crowd",
  }),
  image({
    id: "css2-4",
    kind: "image",
    src: "/images/chasing-sunsets-4.jpg",
    width: 1024,
    height: 682,
    alt: "Chasing Sun(Sets) season II wide frame",
    caption: "Wide Frame",
  }),
  image({
    id: "css2-5",
    kind: "image",
    src: "/images/chasing-sunsets-5.jpg",
    width: 1024,
    height: 682,
    alt: "Chasing Sun(Sets) season II energy frame",
    caption: "Energy",
  }),
  image({
    id: "css2-6",
    kind: "image",
    src: "/images/chasing-sunsets-6.jpg",
    width: 1024,
    height: 682,
    alt: "Chasing Sun(Sets) season II ambient frame",
    caption: "Ambient",
  }),
  image({
    id: "css2-7",
    kind: "image",
    src: "/images/chasing-sunsets-7.jpg",
    width: 1024,
    height: 682,
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
    src: "/images/untold-story.jpg",
    width: 2752,
    height: 1536,
    alt: "Untold Story atmosphere",
    caption: "Untold Story",
  }),
  image({
    id: "untold1-summer",
    kind: "image",
    src: "/images/untold-s1e1-summer.jpg",
    width: 2752,
    height: 1536,
    alt: "Untold Story season I with Summer Mel",
    caption: "Summer Mel",
  }),
  image({
    id: "untold1-manifesto",
    kind: "image",
    src: "/images/untold-s1e1-info.jpg",
    width: 2752,
    height: 1536,
    alt: "Untold Story manifesto frame",
    caption: "Manifesto",
  }),
  image({
    id: "untold1-avo",
    kind: "image",
    src: "/images/untold-s1e1-avo.jpg",
    width: 2752,
    height: 1536,
    alt: "Avo at Untold Story season I",
    caption: "Avo",
  }),
  image({
    id: "untold1-chapter",
    kind: "image",
    src: "/images/untold-s1e1-chapter1.jpg",
    width: 2752,
    height: 1536,
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

// March 6 2026 - Juany Bravo B2B Deron
export const untoldSeason3: MediaItem[] = [
  image({
    id: "us3-1",
    kind: "image",
    src: "/images/archive/us-s3/JPQ_6000.jpg",
    width: 1024,
    height: 683,
    alt: "Untold Story Juany Bravo x Deron - March 6",
    caption: "Chapter III",
  }),
  image({
    id: "us3-2",
    kind: "image",
    src: "/images/archive/us-s3/JPQ_7781.jpg",
    width: 1024,
    height: 683,
    alt: "Untold Story Juany Bravo x Deron - Vibe",
    caption: "Vibe",
  }),
  image({
    id: "us3-3",
    kind: "image",
    src: "/images/archive/us-s3/JPQ_8258.jpg",
    width: 1024,
    height: 683,
    alt: "Untold Story Juany Bravo x Deron - Crowd",
    caption: "Crowd",
  }),
  image({
    id: "us3-4",
    kind: "image",
    src: "/images/archive/us-s3/JPQ_8028.jpg",
    width: 1024,
    height: 683,
    alt: "Untold Story Juany Bravo x Deron - Energy",
    caption: "Energy",
  }),
  image({
    id: "us3-5",
    kind: "image",
    src: "/images/archive/us-s3/JPQ_6055.jpg",
    width: 1024,
    height: 683,
    alt: "Untold Story Juany Bravo x Deron - Motion",
    caption: "Motion",
  }),
  image({
    id: "us3-6",
    kind: "image",
    src: "/images/archive/us-s3/JPQ_8168.jpg",
    width: 1024,
    height: 683,
    alt: "Untold Story Juany Bravo x Deron - DJ Booth",
    caption: "Juany x Deron",
  }),
  image({
    id: "us3-7",
    kind: "image",
    src: "/images/archive/us-s3/JPQ_7453.jpg",
    width: 1024,
    height: 683,
    alt: "Untold Story Juany Bravo x Deron - Atmosphere",
    caption: "Underground",
  }),
];

export const archiveCollectionsBySlug: Record<string, ArchiveCollection> = {
  "chasing-sunsets-season-1": {
    slug: "chasing-sunsets-season-1",
    title: "Chasing Sun(Sets) - Season I",
    subtitle: "Archive Collection",
    description: "Golden-hour frames, artist portraits, and moving records from the first season.",
    accentColor: "#E8B86D",
    media: chasingSeason1,
  },
  "chasing-sunsets-season-2": {
    slug: "chasing-sunsets-season-2",
    title: "Chasing Sun(Sets) - Season II",
    subtitle: "Archive Collection",
    description: "A tighter editorial cut from the second wave of the sunset series.",
    accentColor: "#E8B86D",
    media: chasingSeason2,
  },
  "chasing-sunsets-season-3": {
    slug: "chasing-sunsets-season-3",
    title: "Chasing Sun(Sets) - Season III",
    subtitle: "Archive Collection",
    description: "The latest wave of the shoreline series, featuring high-energy frames from the boat and beach club chapters.",
    accentColor: "#E8B86D",
    media: chasingSeason3,
  },
  "untold-story-season-1": {
    slug: "untold-story-season-1",
    title: "Untold Story - Season I",
    subtitle: "Archive Collection",
    description: "The first chapter of Untold Story in poster, crowd, and manifesto form.",
    accentColor: "#8B5CF6",
    media: untoldSeason1,
  },
  "untold-story-season-2": {
    slug: "untold-story-season-2",
    title: "Untold Story - Season II",
    subtitle: "Archive Collection",
    description: "Artist-led frames and portrait studies from the later Untold chapters.",
    accentColor: "#8B5CF6",
    media: untoldSeason2,
  },
  "untold-story-season-3": {
    slug: "untold-story-season-3",
    title: "Untold Story - Season III",
    subtitle: "Archive Collection",
    description: "The Deron B2B Juany Bravo chapter.",
    accentColor: "#8B5CF6",
    media: untoldSeason3,
  },
};
