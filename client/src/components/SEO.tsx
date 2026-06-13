import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  canonicalPath?: string;
  canonicalUrl?: string;
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
  canonicalUrl: canonicalUrlOverride,
  absoluteTitle = false,
  schemaData,
}: SEOProps) {
  const siteTitle = "The Monolith Project";
  const fullTitle = absoluteTitle ? title : `${title} | ${siteTitle}`;
  const defaultDescription =
    "The Monolith Project produces Chicago house music events, Chasing Sun(Sets), Untold Story nights, and artist-led radio.";
  const resolvedDescription = description || defaultDescription;
  const fallbackCanonicalOrigin = getCanonicalOrigin();
  const resolvedCanonical = (() => {
    if (canonicalUrlOverride) {
      try {
        const url = new URL(canonicalUrlOverride);
        url.pathname = normalizePath(url.pathname);
        url.search = "";
        url.hash = "";
        return { origin: url.origin, url: url.toString() };
      } catch {
        // Fall through to the path-based canonical below.
      }
    }

    const canonicalTarget = normalizePath(
      canonicalPath ||
        (typeof window !== "undefined" ? window.location.pathname : "/")
    );
    return {
      origin: fallbackCanonicalOrigin,
      url: `${fallbackCanonicalOrigin}${canonicalTarget}`,
    };
  })();
  const canonicalOrigin = resolvedCanonical.origin;
  const canonicalUrl = resolvedCanonical.url;
  const resolvedImage = resolveAbsoluteUrl(image, canonicalOrigin);
  const serializedSchema =
    schemaData !== undefined
      ? JSON.stringify(schemaData).replace(/</g, "\\u003c")
      : null;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const head = document.head;
    const canonicalLinks = Array.from(
      head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
    );
    const canonicalLink = canonicalLinks[0] ?? document.createElement("link");

    if (!canonicalLinks[0]) {
      canonicalLink.setAttribute("rel", "canonical");
      head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute("href", canonicalUrl);
    canonicalLink.setAttribute("data-rh", "true");

    canonicalLinks.slice(1).forEach(link => link.remove());
  }, [canonicalUrl]);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
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

      {/* react-helmet-async drops dangerouslySetInnerHTML scripts; pass the
          serialized JSON as children so the tag actually renders. */}
      {serializedSchema ? (
        <script type="application/ld+json">{serializedSchema}</script>
      ) : null}
    </Helmet>
  );
}
