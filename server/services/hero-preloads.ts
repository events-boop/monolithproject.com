export const appHeroPreloadMarker = "<!-- APP_HERO_PRELOADS -->";

export type HeroPreloadSpec = {
  href: string;
  imageSizes?: string;
  imageSrcSet?: string;
  type?: string;
};

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

  if (route === "/" || route === "/chasing-sunsets") {
    return [
      {
        href: "/images/generated/chasing-sunsets-1280.avif",
        imageSizes: "100vw",
        imageSrcSet: buildGeneratedImageSrcSet("chasing-sunsets", [640, 960, 1280, 1600], "avif"),
        type: "image/avif",
      },
    ];
  }

  if (route === "/story" || route === "/untold-story-deron-juany-bravo") {
    return [{ href: "/images/untold-story-juany-deron.webp", type: "image/webp" }];
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
