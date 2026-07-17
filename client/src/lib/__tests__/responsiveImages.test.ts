import { describe, expect, it } from "vitest";

import { getResponsiveImage } from "../responsiveImages";

describe("responsive image catalog", () => {
  it("serves the Untold Story header from the premium editorial tier", () => {
    const hero = getResponsiveImage("untoldStoryHero");

    expect(hero.src).toBe("/images/untold-story/header-jpq-9379.jpg");
    expect(hero.sources).toHaveLength(2);
    expect(hero.sources[0].srcSet).toContain("640w");
    expect(hero.sources[0].srcSet).toContain("1280w");
    expect(hero.sources[0].srcSet).toContain("1920w");
  });
});
