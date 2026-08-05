import { describe, expect, it } from "vitest";
import { archiveCollectionsBySlug } from "@/data/galleryData";

describe("Ape Drums archive collection", () => {
  it("opens as a coming-soon record until the photo/video edit ships", () => {
    const collection = archiveCollectionsBySlug["ape-drums-july31-2026"];

    expect(collection.title).toBe("Ape Drums");
    expect(collection.date).toBe("July 31, 2026");
    expect(collection.comingSoon).toBe(true);
    expect(collection.media).toEqual([]);
    expect(collection.coverImage).toBe(
      "/images/events/ape-drums-july31-card.jpg"
    );
  });
});

describe("Autograf archive collection", () => {
  it("maps the Pogi Studios 03-21 collection to the March 21 Autograf event", () => {
    const collection = archiveCollectionsBySlug["autograf-march-21-2026"];

    expect(collection.date).toBe("March 21, 2026");
    expect(collection.title).toBe("Autograf");
    expect(collection.externalGallery).toMatchObject({
      href: "/go/gallery/autograf-mar21",
      provider: "Pogi Studios · JP Quindara",
      context: "AUTOGRAF | 03-21",
    });
  });
});
