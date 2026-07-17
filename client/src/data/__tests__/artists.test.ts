import { describe, expect, it } from "vitest";

import { ARTISTS } from "../artists";
import { buildResponsiveImageSrcSet } from "../../lib/responsiveImagePath";

describe("artist catalog", () => {
  it("publishes SOMMERS (UK) at the corrected canonical slug", () => {
    expect(ARTISTS["sommers-uk"]).toMatchObject({
      name: "SOMMERS (UK)",
      origin: "LONDON, UK",
      image: "/images/artists/sommers-uk/sommers-uk-portrait.jpg",
    });
    expect(ARTISTS["sommers-uk"].gallery).toHaveLength(5);
    expect(ARTISTS["sommers-uk"].galleryCredit).toBe(
      "Darren Hartwell · Apollo Flux"
    );
    expect(ARTISTS["sommers-uk"].galleryLabel).toBe("Press Gallery");
    expect(ARTISTS["summers-uk"]).toBeUndefined();
  });

  it("uses the premium editorial image tier for SOMMERS (UK)", () => {
    const srcSet = buildResponsiveImageSrcSet(
      ARTISTS["sommers-uk"].image,
      "avif"
    );

    expect(srcSet).toContain("640w");
    expect(srcSet).toContain("1280w");
    expect(srcSet).toContain("1920w");
  });
});
