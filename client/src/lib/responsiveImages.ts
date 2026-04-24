import { buildResponsiveImageSources } from "./responsiveImagePath";

type ResponsiveImageSource = {
  media?: string;
  sizes?: string;
  srcSet: string;
  type: string;
};

type ResponsiveImageKey =
  | "artistsCollective"
  | "chasingSunsets"
  | "eranHershHero"
  | "eranHershPortraitReal"
  | "eranHershInternational"
  | "heroMonolith"
  | "autografRecap"
  | "lazareCarbonCenter"
  | "untoldStoryHero"
  | "untoldStoryPoster"
  | "radioShowGear"
  | "videoPoster1"
  | "sunsetPartyHero"
  | "lazareSabryHero";

interface ResponsiveImageAsset {
  baseName: string;
  sizes: string;
  src: string;
  widths: number[];
}

const responsiveImageCatalog: Record<ResponsiveImageKey, ResponsiveImageAsset> = {
  artistsCollective: {
    baseName: "artists-collective",
    sizes: "100vw",
    src: "/images/artists-collective.webp",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  chasingSunsets: {
    baseName: "chasing-sunsets",
    sizes: "100vw",
    src: "/images/chasing-sunsets.webp",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  eranHershHero: {
    baseName: "eran-hersh-hero",
    sizes: "100vw",
    src: "/images/eran-hersh-live-1.webp",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  eranHershPortraitReal: {
    baseName: "eran-hersh-hero-real",
    sizes: "(min-width: 1024px) 50vw, 100vw",
    src: "/images/eran-hersh-live-6.png",
    widths: [640, 1024, 1280, 1600],
  },
  eranHershInternational: {
    baseName: "eran-hersh-international",
    sizes: "(min-width: 1024px) 50vw, 100vw",
    src: "/images/eran-hersh-live-5.webp",
    widths: [640, 1024, 1600, 1920],
  },
  heroMonolith: {
    baseName: "hero-monolith-modern",
    sizes: "100vw",
    src: "/images/hero-monolith-modern.webp",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  autografRecap: {
    baseName: "autograf-recap",
    sizes: "100vw",
    src: "/images/autograf-recap.jpg",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  sunsetPartyHero: {
    baseName: "sunset-party-hero-v2",
    sizes: "100vw",
    src: "/images/sunset-party-hero-v2.jpg",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  lazareCarbonCenter: {
    baseName: "lazare-carbon-center",
    sizes: "(min-width: 1024px) 44vw, 70vw",
    src: "/images/lazare-carbon-center.png",
    widths: [480, 800, 1024, 1280],
  },
  lazareSabryHero: {
    baseName: "lazare-sabry-hero-v2",
    sizes: "100vw",
    src: "/images/lazare-sabry-hero-v2.jpg",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  radioShowGear: {
    baseName: "radio-show-gear",
    sizes: "100vw",
    src: "/images/radio-show-gear.webp",
    widths: [640, 1024, 1600, 1920],
  },
  videoPoster1: {
    baseName: "video-poster-1",
    sizes: "100vw",
    src: "/images/video-poster-1.webp",
    widths: [640, 1024, 1600, 1920, 2560],
  },
  untoldStoryHero: {
    baseName: "untold-story-deron-juany-bravo-v2",
    sizes: "100vw",
    src: "/images/untold-story-deron-juany-bravo-v2.jpg",
    widths: [640, 1024, 1600, 1920, 2560, 3840],
  },
  untoldStoryPoster: {
    baseName: "untold-story",
    sizes: "(min-width: 1280px) 960px, (min-width: 768px) 80vw, 100vw",
    src: "/images/untold-story-moody.webp",
    widths: [640, 1024, 1600, 1920],
  },
};

function buildVariantPath(baseName: string, width: number, ext: "avif" | "webp") {
  return `/images/generated/${baseName}-${width}.${ext}`;
}

function buildSources(asset: ResponsiveImageAsset, sizes: string): ResponsiveImageSource[] {
  return [
    {
      sizes,
      srcSet: asset.widths.map((width) => `${buildVariantPath(asset.baseName, width, "avif")} ${width}w`).join(", "),
      type: "image/avif",
    },
    {
      sizes,
      srcSet: asset.widths.map((width) => `${buildVariantPath(asset.baseName, width, "webp")} ${width}w`).join(", "),
      type: "image/webp",
    },
  ];
}

export function getResponsiveImage(key: ResponsiveImageKey, sizesOverride?: string) {
  const asset = responsiveImageCatalog[key];
  const sizes = sizesOverride || asset.sizes;
  const genericSources = buildResponsiveImageSources(asset.src, sizes);

  return {
    sizes,
    sources: genericSources.length ? genericSources : buildSources(asset, sizes),
    src: asset.src,
  };
}
