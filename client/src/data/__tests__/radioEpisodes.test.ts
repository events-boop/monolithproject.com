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

  it("plays the No Sleep recording on CH-02 rather than repeating EP-04", () => {
    const chapter = getRadioEpisode("ch-02-radian-no-sleep")!;
    const episode = getRadioEpisode("ep-04-radian")!;
    expect(chapter.audioUrl).toBe(
      "https://soundcloud.com/chasing-sun-sets/radian-x-chasing-sunsets-chapter-ii-x-no-sleep"
    );
    expect(new URL(chapter.embedUrl).searchParams.get("url")).toBe(chapter.audioUrl);
    expect(chapter.audioUrl).not.toBe(episode.audioUrl);
    expect(chapter.coverImage).not.toBe(episode.coverImage);
  });
});
