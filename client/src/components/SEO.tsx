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

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEO({ title, description, image = "/og-image.jpg", type = "website", noIndex = false }: SEOProps) {
  const siteTitle = "The Monolith Project";
  const fullTitle = `${title} | ${siteTitle}`;
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

  const canonicalUrl = typeof window !== "undefined" ? `${canonicalOrigin}${window.location.pathname}` : CANONICAL_ORIGIN;
  const resolvedImage = resolveAbsoluteUrl(image, canonicalOrigin);

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta("name", "description", resolvedDescription);
    upsertLink("canonical", canonicalUrl);

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

    if (noIndex) {
      upsertMeta("name", "robots", "noindex,nofollow");
    } else {
      const robotsEl = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (robotsEl) robotsEl.remove();
    }
  }, [fullTitle, resolvedDescription, canonicalUrl, resolvedImage, type, noIndex]);

  return null;
}
