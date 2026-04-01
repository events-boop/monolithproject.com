type ResponsiveImageSource = {
  media?: string;
  sizes?: string;
  srcSet: string;
  type: string;
};

type ResponsiveImageKey =
  | "artistsCollective"
  | "chasingSunsets"
  | "lazareCarbonCenter"
  | "untoldStoryHero"
  | "untoldStoryPoster";

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
    src: "/images/artists-collective.jpg",
    widths: [640, 960, 1280, 1600],
  },
  chasingSunsets: {
    baseName: "chasing-sunsets",
    sizes: "100vw",
    src: "/images/chasing-sunsets.jpg",
    widths: [640, 960, 1280, 1600],
  },
  lazareCarbonCenter: {
    baseName: "lazare-carbon-center",
    sizes: "(min-width: 1024px) 44vw, 70vw",
    src: "/images/lazare-carbon-center.png",
    widths: [480, 743],
  },
  untoldStoryHero: {
    baseName: "untold-story-juany-deron-v2",
    sizes: "100vw",
    src: "/images/untold-story-juany-deron-v2.jpg",
    widths: [640, 960, 1280, 1600],
  },
  untoldStoryPoster: {
    baseName: "untold-story",
    sizes: "(min-width: 1280px) 960px, (min-width: 768px) 80vw, 100vw",
    src: "/images/untold-story.jpg",
    widths: [640, 960, 1280, 1600],
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

  return {
    sizes,
    sources: buildSources(asset, sizes),
    src: asset.src,
  };
}
