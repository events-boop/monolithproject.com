import { describe, expect, it } from "vitest";
import { FEATURED_SETS } from "../FeaturedSets";

describe("homepage featured lineup", () => {
  it("includes Kiko Franco with the approved July 4 artwork", () => {
    expect(FEATURED_SETS).toHaveLength(6);
    expect(
      FEATURED_SETS.find(featuredSet => featuredSet.id === "july4-kiko-franco")
    ).toMatchObject({
      artist: "KIKO FRANCO",
      title: "Lakefront Debut",
      image: "/images/july4-kiko-franco.jpg",
      responsive: false,
      href: "/artists/kiko-franco",
    });
  });
});
