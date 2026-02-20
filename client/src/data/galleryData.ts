export type MediaItem =
  | {
      kind: "image";
      src: string;
      alt?: string;
    }
  | {
      kind: "video";
      src: string;
      poster?: string;
    };

export const homeGallery: MediaItem[] = [
  {
    kind: "image",
    src: "/images/untold-story-juany-deron-v2.jpg",
    alt: "Untold Story - Juany Bravo x Deron",
  },
  {
    kind: "video",
    src: "/videos/hero-video-short.mp4",
    poster: "/images/hero-video-short-poster.jpg",
  },
  {
    kind: "image",
    src: "/images/chasing-sunsets.jpg",
    alt: "Chasing Sun(Sets)",
  },
  {
    kind: "image",
    src: "/images/monolith-cercle.jpg",
    alt: "Monolith Project",
  },
  {
    kind: "image",
    src: "/images/untold-deron-single.jpg",
    alt: "Untold Story - Deron",
  },
  {
    kind: "image",
    src: "/images/untold-juany-single.jpg",
    alt: "Untold Story - Juany Bravo",
  },
];

export const chasingSeason1: MediaItem[] = [
  { kind: "image", src: "/images/chasing-sunsets.jpg", alt: "Rooftop Vibes" },
  { kind: "video", src: "/videos/hero-video-1.mp4", poster: "/images/hero-video-1-poster.jpg" },
  { kind: "image", src: "/images/autograf-recap.jpg", alt: "Autograf Live" },
  { kind: "image", src: "/images/chasing-crowd.jpg", alt: "Golden Hour Crowd" }, // Placeholder filename
];

export const chasingSeason2: MediaItem[] = [
  { kind: "image", src: "/images/chasing-s2-1.jpg", alt: "Season 2 Opener" }, // Placeholder
  { kind: "image", src: "/images/chasing-s2-2.jpg", alt: "Sunset Moments" }, // Placeholder
  { kind: "video", src: "/videos/chasing-s2-recap.mp4", poster: "/images/chasing-s2-poster.jpg" }, // Placeholder
];

export const untoldSeason1: MediaItem[] = [
  { kind: "image", src: "/images/untold-deron-single.jpg", alt: "Deron at Untold" },
  { kind: "video", src: "/videos/untold-s1-recap.mp4", poster: "/images/hero-bg.jpg" }, // Placeholder
  { kind: "image", src: "/images/monolith-cercle.jpg", alt: "Immersive Production" },
];

export const untoldSeason2: MediaItem[] = [
  { kind: "image", src: "/images/untold-juany-single.jpg", alt: "Juany Bravo" },
  { kind: "image", src: "/images/untold-story-juany-deron-v2.jpg", alt: "The Duo" },
  { kind: "video", src: "/videos/untold-s2-highlight.mp4", poster: "/images/hero-video-short-poster.jpg" }, // Placeholder
];

