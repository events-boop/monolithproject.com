import { describe, expect, it } from "vitest";
import { getLegacyRadioRedirect, getRadioEpisode } from "@/data/radioEpisodes";

describe("radio episode routing", () => {
  it("resolves current radio episode slugs from the published archive", () => {
    expect(getRadioEpisode("ep-01-benchek")?.guest).toBe("BENCHEK");
    expect(getRadioEpisode("ep-04-radian")?.guest).toBe("RADIAN");
  });

  it("maps legacy artist-name radio slugs to their current canonical destinations", () => {
    expect(getLegacyRadioRedirect("autograf")).toBe("/artists/autograf");
    expect(getLegacyRadioRedirect("lazare")).toBe("/artists/lazare");
    expect(getLegacyRadioRedirect("eran-hersh")).toBe("/story");
  });

  it("ignores unknown legacy slugs", () => {
    expect(getLegacyRadioRedirect("unknown-guest")).toBeUndefined();
  });
});
