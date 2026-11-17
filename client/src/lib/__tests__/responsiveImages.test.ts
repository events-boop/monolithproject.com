import { describe, expect, it } from "vitest";

import { getResponsiveImage } from "../responsiveImages";
import { buildResponsiveImageSources } from "../responsiveImagePath";

describe("responsive image catalog", () => {
  it("serves small radio artwork through AVIF and WebP sources", () => {
    const sources = buildResponsiveImageSources(
      "/media/chasing-radio/benchek-marbella-episode-02.webp",
      "80px"
    );
    expect(sources.map(source => source.type)).toEqual([
      "image/avif",
      "image/webp",
    ]);
    for (const source of sources) {
      expect(source.sizes).toBe("80px");
      expect(source.srcSet).toContain("media-chasing-radio-benchek-marbella-episode-02-160.");
      expect(source.srcSet).toContain("160w");
      expect(source.srcSet).toContain("1024w");
    }
  });

  it("serves the Untold Story header from the premium editorial tier", () => {
    const hero = getResponsiveImage("untoldStoryHero");

    expect(hero.src).toBe("/images/untold-story/header-jpq-9379.jpg");
    expect(hero.sources).toHaveLength(2);
    expect(hero.sources[0].srcSet).toContain("640w");
    expect(hero.sources[0].srcSet).toContain("1280w");
    expect(hero.sources[0].srcSet).toContain("1920w");
  });
});
