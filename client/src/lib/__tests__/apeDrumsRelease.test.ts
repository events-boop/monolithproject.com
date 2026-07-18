import { describe, expect, it } from "vitest";
import { getYouTubeVideoId, resolveApeDrumsRelease } from "../apeDrumsRelease";

describe("Ape Drums release gate", () => {
  it("stays closed until every launch dependency is real", () => {
    const release = resolveApeDrumsRelease({
      releaseRequested: "true",
      contractCountersigned: "false",
      ticketUrl: "https://example.com/tickets",
      doors: "TBA",
      approvedVideoUrls: ["https://www.youtube.com/watch?v=JHJoX3ufp1E"],
    });

    expect(release.publicReady).toBe(false);
    expect(release.blockers).toEqual([
      "contract countersignature is not confirmed",
      "Posh checkout URL is missing or invalid",
      "doors time is missing",
      "two approved official YouTube URLs are required",
    ]);
  });

  it("opens only with a countersigned contract and complete conversion inputs", () => {
    const release = resolveApeDrumsRelease({
      releaseRequested: "true",
      contractCountersigned: "true",
      ticketUrl: "https://posh.vip/e/approved-event",
      doors: "Doors 10:00 PM",
      approvedVideoUrls: [
        "https://www.youtube.com/watch?v=JHJoX3ufp1E",
        "https://youtu.be/XAp6w9hTAqk",
      ],
    });

    expect(release).toMatchObject({
      publicReady: true,
      ticketUrl: "https://posh.vip/e/approved-event",
      doors: "Doors 10:00 PM",
      blockers: [],
    });
    expect(release.videoIds).toEqual(["JHJoX3ufp1E", "XAp6w9hTAqk"]);
  });

  it("normalizes approved YouTube URL formats", () => {
    expect(getYouTubeVideoId("https://www.youtube.com/embed/JHJoX3ufp1E")).toBe(
      "JHJoX3ufp1E"
    );
    expect(getYouTubeVideoId("https://youtu.be/XAp6w9hTAqk?t=3")).toBe(
      "XAp6w9hTAqk"
    );
    expect(getYouTubeVideoId("https://example.com/JHJoX3ufp1E")).toBeNull();
  });
});
