import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  canonicalPath?: string;
  absoluteTitle?: boolean;
  schemaData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const CANONICAL_ORIGIN = "https://monolithproject.com";

function resolveAbsoluteUrl(url: string, origin: string) {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${origin}${url}`;
  return `${origin}/${url}`;
}

function normalizePath(pathname?: string) {
  const clean = (pathname || "/").split("?")[0]?.split("#")[0] || "/";
  if (!clean.startsWith("/")) return `/${clean}`;
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean;
}

function getCanonicalOrigin() {
  if (typeof window === "undefined") return CANONICAL_ORIGIN;

  const origin = window.location.origin || CANONICAL_ORIGIN;
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
    return origin;
  }

  if (/^https?:\/\/(www\.)?(the)?monolithproject\.com$/i.test(origin)) {
    return CANONICAL_ORIGIN;
  }

  return origin;
}

export default function SEO({
  title,
  description,
  image = "/og-image.jpg",
  type = "website",
  noIndex = false,
  canonicalPath,
  absoluteTitle = false,
  schemaData,
}: SEOProps) {
  const siteTitle = "The Monolith Project";
  const fullTitle = absoluteTitle ? title : `${title} | ${siteTitle}`;
  const defaultDescription =
    "A Chicago music project building events, radio, and archive around dance music and community.";
  const resolvedDescription = description || defaultDescription;
  const canonicalOrigin = getCanonicalOrigin();
  const canonicalTarget = normalizePath(
    canonicalPath || (typeof window !== "undefined" ? window.location.pathname : "/"),
  );
  const canonicalUrl = `${canonicalOrigin}${canonicalTarget}`;
  const resolvedImage = resolveAbsoluteUrl(image, canonicalOrigin);
  const serializedSchema =
    schemaData !== undefined ? JSON.stringify(schemaData).replace(/</g, "\\u003c") : null;

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
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      {serializedSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializedSchema }}
        />
      ) : null}
    </Helmet>
  );
}
