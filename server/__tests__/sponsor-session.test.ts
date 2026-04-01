import { existsSync } from "fs";
import { describe, expect, it } from "vitest";
import { resolveSponsorDeckPath } from "../services/sponsor-session";

describe("resolveSponsorDeckPath", () => {
  it("finds the sponsor deck within the repository layout", () => {
    const deckPath = resolveSponsorDeckPath();

    expect(deckPath).not.toBeNull();
    expect(existsSync(deckPath!)).toBe(true);
  });
});
