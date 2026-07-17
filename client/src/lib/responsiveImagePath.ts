const DEFAULT_RESPONSIVE_WIDTHS = [480, 1024] as const;
// Must mirror the premium editorial tier in generate_responsive_images.mjs.
const PREMIUM_ARTIST_RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;
const PREMIUM_ARTIST_BASE_NAME_PREFIXES = [
  "artists-sommers-uk-",
  "artists-joezi-",
  "artists-massuma-uk-",
  "artists-chris-idh-",
  "untold-story-header-jpq-",
] as const;
const DESKTOP_RESPONSIVE_WIDTHS_BY_BASE_NAME: Record<
  string,
  readonly number[]
> = {
  "hero-monolith": [480, 1024, 1920],
  "hero-video-1-poster": [480, 1024, 1920],
  "artists-collective": [480, 1024, 1600],
  "chasing-sunsets": [480, 1024, 1600],
  "untold-story-juany-deron-v2": [480, 1024, 1600],
  "lazare-recap": [480, 1024, 1542],
};

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
  if (
    !isLocalImage(src) ||
    isGeneratedImage(src) ||
    !RASTER_IMAGE_PATTERN.test(src)
  ) {
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

export function buildResponsiveImageSrcSet(
  src: string,
  extension: "avif" | "webp"
) {
  const baseName = getResponsiveImageBaseName(src);
  if (!baseName) return undefined;

  return getResponsiveImageWidths(baseName)
    .map(
      width => `/images/generated/${baseName}-${width}.${extension} ${width}w`
    )
    .join(", ");
}

export function buildResponsiveImageSources(
  src: string,
  sizes: string
): ResponsiveImageSource[] {
  const avifSrcSet = buildResponsiveImageSrcSet(src, "avif");
  const webpSrcSet = buildResponsiveImageSrcSet(src, "webp");

  if (!avifSrcSet || !webpSrcSet) return [];

  return [
    { srcSet: avifSrcSet, type: "image/avif", sizes },
    { srcSet: webpSrcSet, type: "image/webp", sizes },
  ];
}

export function getResponsiveImageWidths(baseName: string) {
  if (
    PREMIUM_ARTIST_BASE_NAME_PREFIXES.some(prefix =>
      baseName.startsWith(prefix)
    )
  ) {
    return PREMIUM_ARTIST_RESPONSIVE_WIDTHS;
  }

  return (
    DESKTOP_RESPONSIVE_WIDTHS_BY_BASE_NAME[baseName] ||
    DEFAULT_RESPONSIVE_WIDTHS
  );
}

export { DEFAULT_RESPONSIVE_WIDTHS as RESPONSIVE_WIDTHS };
