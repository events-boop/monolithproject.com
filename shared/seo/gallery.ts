import type { ArchiveCollection } from "../../client/src/data/galleryData";

export function buildGallerySchema(
  gallery: ArchiveCollection,
  pagePath: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://monolithproject.com${pagePath}#webpage`,
    url: `https://monolithproject.com${pagePath}`,
    name: `${gallery.title} — ${gallery.subtitle}`,
    description: gallery.description,
    isPartOf: { "@id": "https://monolithproject.com/#website" },
    publisher: { "@id": "https://monolithproject.com/#organization" },
  };
}
