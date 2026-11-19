import { describe, expect, it } from "vitest";
import { ARTISTS } from "@/data/artists";
import {
  eventIncludesArtist,
  getEventArtists,
  getArtistRecording,
  getArtistAudioTrack,
} from "../artistEventDiscovery";
import type { ScheduledEvent } from "@shared/events/types";
const show = (lineup: string): ScheduledEvent => ({
  id: "test-show",
  series: "chasing-sunsets",
  episode: "Test",
  title: "A show",
  date: "To be announced",
  time: "To be announced",
  venue: "To be announced",
  location: "Chicago",
  status: "coming-soon",
  lineup,
});
describe("named artist discovery", () => {
  it("connects both original headliners even when a profile adds a country suffix", () => {
    const event = show("JOEZI × MASSUMA");
    expect(eventIncludesArtist(event, ARTISTS.joezi)).toBe(true);
    expect(eventIncludesArtist(event, ARTISTS.massuma)).toBe(true);
    expect(getEventArtists(event).map(artist => artist.id)).toEqual(
      expect.arrayContaining(["joezi", "massuma"])
    );
  });
  it("does not infer an artist appearance from membership in the same series", () => {
    expect(
      eventIncludesArtist(
        show("Lineup to be announced"),
        ARTISTS["gene-farris"]
      )
    ).toBe(false);
  });
  it("requires a complete artist name rather than a matching substring", () => {
    expect(eventIncludesArtist(show("JOEZILLA"), ARTISTS.joezi)).toBe(false);
  });
  it("preserves the published video destination", () => {
    expect(getArtistRecording(ARTISTS.joezi)?.href).toBe(
      ARTISTS.joezi.featuredVideo?.url
    );
  });
  it("resolves inline SoundCloud tracks for radio or SoundCloud artists and null for YouTube-only artists", () => {
    const benchekTrack = getArtistAudioTrack(ARTISTS.benchek);
    expect(benchekTrack).not.toBeNull();
    expect(benchekTrack?.src).toContain("w.soundcloud.com/player");

    const geneFarrisTrack = getArtistAudioTrack(ARTISTS["gene-farris"]);
    expect(geneFarrisTrack).not.toBeNull();
    expect(geneFarrisTrack?.src).toContain("w.soundcloud.com/player");

    expect(getArtistAudioTrack(ARTISTS.joezi)).toBeNull();
  });
});
