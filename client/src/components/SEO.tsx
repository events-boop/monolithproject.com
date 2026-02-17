import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}

const CANONICAL_ORIGIN = "https://monolithproject.com";

function resolveAbsoluteUrl(url: string, origin: string) {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${origin}${url}`;
  return `${origin}/${url}`;
}

export default function SEO({ title, description, image = "/og-image.jpg", type = "website", noIndex = false }: SEOProps) {
  /* 
    Logic for canonical URLs and resolving absolute paths 
  */
  const origin = typeof window !== "undefined" ? window.location.origin : CANONICAL_ORIGIN;
  const canonicalOrigin = (() => {
    // Keep local/dev environments "as-is" so links behave predictably.
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) return origin;
    // Treat both custom domains as valid, but collapse canonical URLs to the preferred domain.
    if (/^https?:\/\/(www\.)?themonolithproject\.com$/i.test(origin)) return CANONICAL_ORIGIN;
    if (/^https?:\/\/(www\.)?monolithproject\.com$/i.test(origin)) return CANONICAL_ORIGIN;
    return origin;
  })();

  const siteTitle = "The Monolith Project";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDescription =
    "A Chicago-based events collective building on music, community, and showing up for each other.";
  const resolvedDescription = description || defaultDescription;

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const canonicalUrl = `${canonicalOrigin}${currentPath}`;
  const resolvedImage = resolveAbsoluteUrl(image, canonicalOrigin);

  return (
    <Helmet prioritizeSeoTags>
      {/* Core Meta */}
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={resolvedImage} />
    </Helmet>
  );
}

