import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  canonicalPath?: string;
  absoluteTitle?: boolean;
}

const CANONICAL_ORIGIN = "https://monolithproject.com";

function resolveAbsoluteUrl(url: string, origin: string) {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${origin}${url}`;
  return `${origin}/${url}`;
}

export default function SEO({
  title,
  description,
  image = "/og-image.jpg",
  type = "website",
  noIndex = false,
  canonicalPath,
  absoluteTitle = false,
}: SEOProps) {
  const siteTitle = "The Monolith Project";
  const fullTitle = absoluteTitle ? title : `${title} | ${siteTitle}`;
  const defaultDescription =
    "A Chicago-based events collective building on music, community, and showing up for each other.";
  const resolvedDescription = description || defaultDescription;

  const origin = typeof window !== "undefined" ? (window.location.origin || CANONICAL_ORIGIN) : CANONICAL_ORIGIN;
  const canonicalOrigin = (() => {
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) return origin;
    if (/^https?:\/\/(www\.)?themonolithproject\.com$/i.test(origin)) return CANONICAL_ORIGIN;
    if (/^https?:\/\/(www\.)?monolithproject\.com$/i.test(origin)) return CANONICAL_ORIGIN;
    return origin;
  })();

  const canonicalUrl = canonicalPath
    ? resolveAbsoluteUrl(canonicalPath, canonicalOrigin)
    : typeof window !== "undefined"
      ? `${canonicalOrigin}${window.location.pathname}`
      : CANONICAL_ORIGIN;
  const resolvedImage = resolveAbsoluteUrl(image, canonicalOrigin);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={resolvedImage} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </Helmet>
  );
}
