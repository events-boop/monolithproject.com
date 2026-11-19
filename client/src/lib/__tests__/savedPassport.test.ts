import { beforeEach, describe, expect, it } from "vitest";
import {
  clearSavedPassport,
  getSavedPassportSnapshot,
  toggleSavedArtist,
  toggleSavedEpisode,
  toggleSavedEvent,
} from "../savedPassport";

describe("savedPassport store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearSavedPassport();
  });

  it("toggles saved events, artists, and radio episodes cleanly without duplicates", () => {
    expect(getSavedPassportSnapshot().total).toBe(0);

    expect(toggleSavedEvent("css-sep19")).toBe(true);
    expect(toggleSavedArtist("joezi")).toBe(true);
    expect(toggleSavedEpisode("ep-01-benchek")).toBe(true);

    const snap1 = getSavedPassportSnapshot();
    expect(snap1.events).toEqual(["css-sep19"]);
    expect(snap1.artists).toEqual(["joezi"]);
    expect(snap1.episodes).toEqual(["ep-01-benchek"]);
    expect(snap1.total).toBe(3);

    expect(toggleSavedArtist("joezi")).toBe(false);
    expect(getSavedPassportSnapshot().artists).toEqual([]);
    expect(getSavedPassportSnapshot().total).toBe(2);

    clearSavedPassport();
    expect(getSavedPassportSnapshot().total).toBe(0);
  });
});
