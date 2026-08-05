import { describe, expect, it } from "vitest";
import {
  APE_DRUMS_RELEASE,
  APE_DRUMS_TICKET_URL,
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
      heroImage: "/assets/ape-drums-hero.abcd1234.png",
      approvedVideoUrls: [
        "https://www.youtube.com/watch?v=JHJoX3ufp1E",
        "https://youtu.be/XAp6w9hTAqk",
      ],
    });

    expect(release).toMatchObject({
      publicReady: true,
      ticketUrl: "https://posh.vip/e/approved-event",
      doors: "Doors 10:00 PM",
      heroImage: "/assets/ape-drums-hero.abcd1234.png",
      blockers: [],
    });
    expect(release.videoIds).toEqual(["JHJoX3ufp1E", "XAp6w9hTAqk"]);
  });

  it("treats the show as upcoming before the conclusion window ends", () => {
    const release = resolveApeDrumsRelease(
      { eventDate: "2026-07-31" },
      new Date("2026-07-31T21:00:00")
    );

    expect(release.eventConcluded).toBe(false);
  });

  it("concludes at noon the day after the event by default", () => {
    const before = resolveApeDrumsRelease(
      { eventDate: "2026-07-31" },
      new Date("2026-08-01T11:00:00")
    );
    const after = resolveApeDrumsRelease(
      { eventDate: "2026-07-31" },
      new Date("2026-08-01T13:00:00")
    );

    expect(before.eventConcluded).toBe(false);
    expect(after.eventConcluded).toBe(true);
    expect(after.concludesAt).toBe(
      new Date("2026-08-01T12:00:00").toISOString()
    );
  });

  it("never concludes without a valid event date", () => {
    expect(
      resolveApeDrumsRelease({}, new Date("2026-08-04T00:00:00"))
        .eventConcluded
    ).toBe(false);
    expect(
      resolveApeDrumsRelease(
        { eventDate: "not-a-date" },
        new Date("2026-08-04T00:00:00")
      ).concludesAt
    ).toBeNull();
  });

  it("normalizes approved YouTube URL formats", () => {    expect(getYouTubeVideoId("https://www.youtube.com/embed/JHJoX3ufp1E")).toBe(
      "JHJoX3ufp1E"
    );
    expect(getYouTubeVideoId("https://youtu.be/XAp6w9hTAqk?t=3")).toBe(
      "XAp6w9hTAqk"
    );
    expect(getYouTubeVideoId("https://example.com/JHJoX3ufp1E")).toBeNull();
  });

  it("ships all owner-approved videos in the sealed preview", () => {
    expect(APE_DRUMS_RELEASE.ticketUrl).toBe(APE_DRUMS_TICKET_URL);
    expect(APE_DRUMS_RELEASE.heroImage).toContain("ape-drums-july31-hero.png");
    expect(APE_DRUMS_RELEASE.videoIds[0]).toBe("O94vKVHzamk");
    expect(APE_DRUMS_RELEASE.videoIds[1]).toBe("K_2PZkxuNLY");
    expect(APE_DRUMS_RELEASE.videoIds[2]).toBe("bpG8KPCJ8EM");
    expect(APE_DRUMS_RELEASE.videoIds[3]).toBe("Vyo-kk0wRw4");
    expect(APE_DRUMS_RELEASE.publicReady).toBe(false);
  });
});
