import { describe, expect, it } from "vitest";
import {
  APE_DRUMS_RELEASE,
  getYouTubeVideoId,
  resolveApeDrumsRelease,
} from "../apeDrumsRelease";

describe("Ape Drums release gate", () => {
  it("stays closed until every launch dependency is real", () => {
    const release = resolveApeDrumsRelease({
      releaseRequested: "true",
      contractCountersigned: "false",
      ticketUrl: "https://example.com/tickets",
      doors: "TBA",
      heroImage: "",
      approvedVideoUrls: ["https://www.youtube.com/watch?v=JHJoX3ufp1E"],
    });

    expect(release.publicReady).toBe(false);
    expect(release.blockers).toEqual([
      "contract countersignature is not confirmed",
      "approved checkout URL is missing or invalid",
      "doors time is missing",
      "approved hero image is missing or invalid",
      "two approved official YouTube URLs are required",
    ]);
  });

  it("opens only with a countersigned contract and complete conversion inputs", () => {
    const release = resolveApeDrumsRelease({
      releaseRequested: "true",
      contractCountersigned: "true",
      ticketUrl: "https://posh.vip/e/approved-event",
      doors: "Doors 10:00 PM",
      heroImage: "/images/artists/approved/hero.jpg",
      approvedVideoUrls: [
        "https://www.youtube.com/watch?v=JHJoX3ufp1E",
        "https://youtu.be/XAp6w9hTAqk",
      ],
    });

    expect(release).toMatchObject({
      publicReady: true,
      ticketUrl: "https://posh.vip/e/approved-event",
      doors: "Doors 10:00 PM",
      heroImage: "/images/artists/approved/hero.jpg",
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

  it("ships both owner-approved videos in the sealed preview", () => {
    expect(APE_DRUMS_RELEASE.videoIds[0]).toBe("O94vKVHzamk");
    expect(APE_DRUMS_RELEASE.videoIds[1]).toBe("K_2PZkxuNLY");
    expect(APE_DRUMS_RELEASE.publicReady).toBe(false);
  });
});
