/* Match HOME_HERO_PHOTOGRAPH in src/data/homeArtDirection.ts.
   Begin fetching the homepage photograph before the route bundle renders. */
(() => {
  if (
    location.pathname !== "/" ||
    /(?:sunsets|houseoffriends)\.vip$/i.test(location.hostname)
  )
    return;
  const mobile = matchMedia("(max-width: 639px)").matches;
  const base = mobile
    ? "monolith-crowd-hero-mobile-v2"
    : "untold-story-header-jpq-9379";
  const widths = mobile ? [480, 720] : [640, 1280, 1920];
  const hint = document.createElement("link");
  hint.rel = "preload";
  hint.as = "image";
  hint.type = "image/avif";
  hint.href = `/images/generated/${base}-${widths[0]}.avif`;
  hint.imageSrcset = widths
    .map(width => `/images/generated/${base}-${width}.avif ${width}w`)
    .join(", ");
  hint.imageSizes = "100vw";
  hint.fetchPriority = "high";
  document.head.append(hint);
})();
