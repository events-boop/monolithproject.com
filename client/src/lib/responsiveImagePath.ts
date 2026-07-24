const DEFAULT_RESPONSIVE_WIDTHS = [480, 1024] as const;
// Must mirror the premium editorial tier in generate_responsive_images.mjs.
const PREMIUM_ARTIST_RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;
const PREMIUM_ARTIST_BASE_NAME_PREFIXES = [
  "artists-sommers-uk-",
  "artists-joezi-",
  "artists-massuma-uk-",
  "artists-chris-idh-",
  "artists-juany-bravo-",
  "artists-amari-",
  "artists-sarat-",
  "artists-benchek-",
  "artists-summer-mel-",
  "artists-jerome-",
  "artists-rose-",
  "artists-avo-",
  "artists-jealah-",
  "artists-maximo-",
  "artists-eliana-",
  "artists-kenbo-slice-",
  "artists-terranova-",
  "events-sunsets-2026-09-19-",
  "untold-story-header-jpq-",
] as const;
const DESKTOP_RESPONSIVE_WIDTHS_BY_BASE_NAME: Record<
  string,
  readonly number[]
> = {
  "hero-monolith": [480, 1024, 1920],
  "hero-video-1-poster": [480, 1024, 1920],
  "artist-ewerseen-2026-v2": [447],
  "artists-collective": [480, 1024, 1600],
  "chasing-sunsets": [480, 1024, 1600],
  "chasing-sunsets-castaways-hero": [480, 1024, 1600],
  "untold-story-juany-deron-v2": [480, 1024, 1600],
  "lazare-recap": [480, 1024, 1542],
  "artists-juany-bravo-juany-bravo-portrait": [640, 1280, 1920],
  "artists-summer-mel-summer-mel-portrait": [640, 1280],
  "artists-summer-mel-summer-mel-orange-portrait": [480, 640],
  "artists-sarat-sarat-live": [480, 720],
  "artists-jerome-jerome-portrait": [640, 1280, 1920],
  "artists-rose-rose-live": [640, 1172],
  "artists-avo-avo-portrait": [640, 1280, 1858],
  "artists-jealah-jealah-portrait": [640, 1280, 1920],
  "artists-maximo-maximo-portrait": [640, 1280, 1920],
  "artists-eliana-eliana-live": [309],
  "artists-kenbo-slice-kenbo-slice-portrait": [640, 1280, 1863],
  "artists-terranova-terranova-live": [640, 1280, 1667],
  "events-sunsets-2026-09-19-massuma-official-artwork": [640, 1122],
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
  const desktopWidths = DESKTOP_RESPONSIVE_WIDTHS_BY_BASE_NAME[baseName];
  if (desktopWidths) return desktopWidths;

  if (
    PREMIUM_ARTIST_BASE_NAME_PREFIXES.some(prefix =>
      baseName.startsWith(prefix)
    )
  ) {
    return PREMIUM_ARTIST_RESPONSIVE_WIDTHS;
  }

  return DEFAULT_RESPONSIVE_WIDTHS;
}

export { DEFAULT_RESPONSIVE_WIDTHS as RESPONSIVE_WIDTHS };
