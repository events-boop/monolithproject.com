import { describe, expect, it } from "vitest";
import { clockLabel, durationLabelToMs } from "../RadioDeckPlayer";
import { radioEpisodes } from "@/data/radioEpisodes";
import { chasingRadioEpisodes } from "@/data/chasingRadioEpisodes";

describe("radio deck player", () => {
  it("reads episode durations for the scrubber", () => {
    expect(durationLabelToMs("64:17")).toBe((64 * 60 + 17) * 1000);
    expect(durationLabelToMs("1:04:17")).toBe((3600 + 4 * 60 + 17) * 1000);
    expect(durationLabelToMs("soon")).toBe(0);
  });

  it("shows positions as minutes and seconds", () => {
    expect(clockLabel(0)).toBe("0:00");
    expect(clockLabel(65_000)).toBe("1:05");
    expect(clockLabel(-5)).toBe("0:00");
  });
});

describe("radio archive", () => {
  it("gives every Chasing Sunsets Radio art pack an episode page", () => {
    const covers = new Set(radioEpisodes.map(episode => episode.coverImage));
    for (const entry of chasingRadioEpisodes) {
      expect(covers.has(entry.image), entry.image).toBe(true);
    }
    expect(radioEpisodes.length).toBe(chasingRadioEpisodes.length);
  });

  it("keeps slugs unique and every episode playable and linked", () => {
    const slugs = radioEpisodes.map(episode => episode.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const episode of radioEpisodes) {
      expect(episode.embedUrl).toMatch(
        /^https:\/\/w\.soundcloud\.com\/player\/\?url=https%3A\/\/soundcloud\.com\//
      );
      expect(new URL(episode.embedUrl).searchParams.get("url")).toBe(
        episode.audioUrl
      );
      expect(durationLabelToMs(episode.duration)).toBeGreaterThan(0);
    }
  });

  it("does not invent tracklists for episodes brought in from the library", () => {
    const library = radioEpisodes.filter(episode => episode.sunsetsUrl);
    expect(library.length).toBe(7);
    for (const episode of library) expect(episode.tracklist).toEqual([]);
  });
});
