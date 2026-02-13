import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
}

export default function SEO({ title, description }: SEOProps) {
  const siteTitle = "The Monolith Project";
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultDescription =
    "A Chicago-based events collective building on music, community, and showing up for each other.";
  const resolvedDescription = description || defaultDescription;

  useEffect(() => {
    if (typeof document === "undefined") return;

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

    upsertMeta("name", "description", resolvedDescription);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", resolvedDescription);
    upsertMeta("property", "twitter:title", fullTitle);
    upsertMeta("property", "twitter:description", resolvedDescription);
  }, [fullTitle, resolvedDescription]);

  return null;
}
