import { useEffect } from "react";

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
  const siteTitle = "The Monolith Project";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDescription =
    "A Chicago-based events collective building on music, community, and showing up for each other.";
  const resolvedDescription = description || defaultDescription;

  useEffect(() => {
    if (typeof document === "undefined") return;

    const origin = window.location.origin || CANONICAL_ORIGIN;
    const canonicalOrigin = (() => {
      // Keep local/dev environments "as-is" so links behave predictably.
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) return origin;
      // Treat both custom domains as valid, but collapse canonical URLs to the preferred domain.
      if (/^https?:\/\/(www\.)?themonolithproject\.com$/i.test(origin)) return CANONICAL_ORIGIN;
      if (/^https?:\/\/(www\.)?monolithproject\.com$/i.test(origin)) return CANONICAL_ORIGIN;
      return origin;
    })();

    const canonicalUrl = `${canonicalOrigin}${window.location.pathname}`;
    const resolvedImage = resolveAbsoluteUrl(image, canonicalOrigin);

    document.title = fullTitle;

    const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
      const selector = `meta[${attr}="${key}"]`;
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const upsertLink = (rel: string, href: string) => {
      const selector = `link[rel="${rel}"]`;
      let tag = document.head.querySelector(selector) as HTMLLinkElement | null;
      if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        document.head.appendChild(tag);
      }
      tag.setAttribute("href", href);
    };

    upsertMeta("name", "description", resolvedDescription);
    upsertMeta("name", "robots", noIndex ? "noindex,nofollow" : "index,follow");
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", resolvedDescription);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", resolvedImage);
    upsertMeta("property", "og:site_name", siteTitle);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", resolvedDescription);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:url", canonicalUrl);
    upsertMeta("name", "twitter:image", resolvedImage);
    upsertLink("canonical", canonicalUrl);
  }, [fullTitle, resolvedDescription, image, type, noIndex]);

  return null;
}
