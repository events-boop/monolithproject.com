export const appHeroPreloadMarker = "<!-- APP_HERO_PRELOADS -->";

export type HeroPreloadSpec = {
  href: string;
  imageSizes?: string;
  imageSrcSet?: string;
  type?: string;
};

const HERO_PRELOAD_WIDTHS = [480, 1024, 1920];

export function normalizeAppPath(pathname: string) {
  const clean = pathname.split("?")[0]?.split("#")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

export function buildGeneratedImageSrcSet(baseName: string, widths: number[], extension: "avif" | "webp") {
  return widths.map((width) => `/images/generated/${baseName}-${width}.${extension} ${width}w`).join(", ");
}

export function getHeroPreloadSpecs(pathname: string): HeroPreloadSpec[] {
  const route = normalizeAppPath(pathname);

  if (route === "/") {
    return [
      {
        href: "/images/generated/hero-video-1-poster-1024.avif",
        imageSizes: "100vw",
        imageSrcSet: buildGeneratedImageSrcSet("hero-video-1-poster", HERO_PRELOAD_WIDTHS, "avif"),
        type: "image/avif",
      },
    ];
  }

  if (route === "/chasing-sunsets") {
    return [
      {
        href: "/images/generated/chasing-sunsets-1024.avif",
        imageSizes: "100vw",
        imageSrcSet: buildGeneratedImageSrcSet("chasing-sunsets", HERO_PRELOAD_WIDTHS, "avif"),
        type: "image/avif",
      },
    ];
  }

  if (route === "/story" || route === "/untold-story-deron-juany-bravo") {
    return [
      {
        href: "/images/generated/untold-story-juany-deron-v2-1024.avif",
        imageSizes: "100vw",
        imageSrcSet: buildGeneratedImageSrcSet("untold-story-juany-deron-v2", HERO_PRELOAD_WIDTHS, "avif"),
        type: "image/avif",
      },
    ];
  }

  return [];
}

export function renderHeroPreloadLinks(pathname: string) {
  const specs = getHeroPreloadSpecs(pathname);

  if (specs.length === 0) {
    return "";
  }

  return specs
    .map((spec) => {
      const attrs = [
        'rel="preload"',
        'as="image"',
        `href="${spec.href}"`,
        'fetchpriority="high"',
      ];

      if (spec.type) attrs.push(`type="${spec.type}"`);
      if (spec.imageSrcSet) attrs.push(`imagesrcset="${spec.imageSrcSet}"`);
      if (spec.imageSizes) attrs.push(`imagesizes="${spec.imageSizes}"`);

      return `  <link ${attrs.join(" ")} />`;
    })
    .join("\n");
}

export function injectHeroPreloads(html: string, pathname: string) {
  const preloadMarkup = renderHeroPreloadLinks(pathname);

  if (html.includes(appHeroPreloadMarker)) {
    return html.replace(appHeroPreloadMarker, preloadMarkup);
  }

  if (!preloadMarkup) {
    return html;
  }

  return html.replace("</head>", `${preloadMarkup}\n</head>`);
}
