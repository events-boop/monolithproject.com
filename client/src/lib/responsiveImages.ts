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

const GENERATED_WIDTHS = [480, 1024, 1920];

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
    widths: GENERATED_WIDTHS,
  },
  chasingSunsets: {
    baseName: "chasing-sunsets",
    sizes: "100vw",
    src: "/images/chasing-sunsets.webp",
    widths: GENERATED_WIDTHS,
  },
  eranHershHero: {
    baseName: "eran-hersh-live-1",
    sizes: "100vw",
    src: "/images/eran-hersh-live-1.webp",
    widths: GENERATED_WIDTHS,
  },
  eranHershPortraitReal: {
    baseName: "eran-hersh-live-6",
    sizes: "(min-width: 1024px) 50vw, 100vw",
    src: "/images/eran-hersh-live-6.png",
    widths: GENERATED_WIDTHS,
  },
  eranHershInternational: {
    baseName: "eran-hersh-live-5",
    sizes: "(min-width: 1024px) 50vw, 100vw",
    src: "/images/eran-hersh-live-5.webp",
    widths: GENERATED_WIDTHS,
  },
  heroMonolith: {
    baseName: "hero-monolith-modern",
    sizes: "100vw",
    src: "/images/hero-monolith-modern.webp",
    widths: GENERATED_WIDTHS,
  },
  autografRecap: {
    baseName: "autograf-recap",
    sizes: "100vw",
    src: "/images/autograf-recap.jpg",
    widths: GENERATED_WIDTHS,
  },
  sunsetPartyHero: {
    baseName: "sunset-party-hero-v2",
    sizes: "100vw",
    src: "/images/sunset-party-hero-v2.jpg",
    widths: GENERATED_WIDTHS,
  },
  lazareCarbonCenter: {
    baseName: "lazare-carbon-center",
    sizes: "(min-width: 1024px) 44vw, 70vw",
    src: "/images/lazare-carbon-center.png",
    widths: GENERATED_WIDTHS,
  },
  lazareSabryHero: {
    baseName: "lazare-sabry-hero-v2",
    sizes: "100vw",
    src: "/images/lazare-sabry-hero-v2.jpg",
    widths: GENERATED_WIDTHS,
  },
  radioShowGear: {
    baseName: "radio-show-gear",
    sizes: "100vw",
    src: "/images/radio-show-gear.webp",
    widths: GENERATED_WIDTHS,
  },
  videoPoster1: {
    baseName: "hero-video-1-poster",
    sizes: "100vw",
    src: "/images/hero-video-1-poster.jpg",
    widths: GENERATED_WIDTHS,
  },
  untoldStoryHero: {
    baseName: "untold-story-juany-deron-v2",
    sizes: "100vw",
    src: "/images/untold-story-juany-deron-v2.webp",
    widths: GENERATED_WIDTHS,
  },
  untoldStoryPoster: {
    baseName: "untold-story-moody",
    sizes: "(min-width: 1280px) 960px, (min-width: 768px) 80vw, 100vw",
    src: "/images/untold-story-moody.webp",
    widths: GENERATED_WIDTHS,
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
