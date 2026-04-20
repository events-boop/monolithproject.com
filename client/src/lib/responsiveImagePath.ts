const RESPONSIVE_WIDTHS = [480, 1024, 1920] as const;

const RASTER_IMAGE_PATTERN = /\.(?:png|jpe?g|webp|avif)$/i;

export type ResponsiveImageSource = {
  media?: string;
  sizes?: string;
  srcSet: string;
  type: string;
};

function isLocalImage(src: string) {
  return src.startsWith("/images/") || src === "/og-image.jpg";
}

function isGeneratedImage(src: string) {
  return src.startsWith("/images/generated/");
}

export function getResponsiveImageBaseName(src: string) {
  if (!isLocalImage(src) || isGeneratedImage(src) || !RASTER_IMAGE_PATTERN.test(src)) {
    return null;
  }

  const normalized = src.startsWith("/images/")
    ? src.replace(/^\/images\//, "")
    : src.replace(/^\//, "");

  return normalized
    .replace(RASTER_IMAGE_PATTERN, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function buildResponsiveImageSrcSet(src: string, extension: "avif" | "webp") {
  const baseName = getResponsiveImageBaseName(src);
  if (!baseName) return undefined;

  return RESPONSIVE_WIDTHS
    .map((width) => `/images/generated/${baseName}-${width}.${extension} ${width}w`)
    .join(", ");
}

export function buildResponsiveImageSources(src: string, sizes: string): ResponsiveImageSource[] {
  const avifSrcSet = buildResponsiveImageSrcSet(src, "avif");
  const webpSrcSet = buildResponsiveImageSrcSet(src, "webp");

  if (!avifSrcSet || !webpSrcSet) return [];

  return [
    { srcSet: avifSrcSet, type: "image/avif", sizes },
    { srcSet: webpSrcSet, type: "image/webp", sizes },
  ];
}

export { RESPONSIVE_WIDTHS };
