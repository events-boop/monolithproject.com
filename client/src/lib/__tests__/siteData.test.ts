import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import type { PublicSiteData, ScheduledEvent } from "@shared/events/types";
import {
  getPublicEvents,
  getPublicSiteData,
  ensurePublicSiteData,
  primePublicSiteData,
  usePublicSiteDataVersion,
} from "@/lib/siteData";

const eranEvent: ScheduledEvent = {
  id: "us-s3e3",
  series: "untold-story",
  episode: "CHAPTER IV",
  title: "ERAN HERSH",
  date: "May 16, 2026",
  time: "9:00 PM — Late",
  venue: "Hideaway",
  location: "Chicago, IL",
  status: "on-sale",
  ticketUrl: "/go/tickets/us-s3e3",
};

const julyOpenAir: ScheduledEvent = {
  id: "css-jul04",
  series: "chasing-sunsets",
  episode: "INDEPENDENCE DAY",
  title: "CHASING SUN(SETS)",
  date: "July 4, 2026",
  time: "3:00 PM — 10:00 PM",
  venue: "Castaways",
  location: "Chicago, IL",
  status: "coming-soon",
};

function buildSiteData(events: ScheduledEvent[]): PublicSiteData {
  return {
    path: "/events/us-s3e3",
    events,
    featuredEvents: {},
  };
}

describe("siteData refresh", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("notifies subscribers when public site data is re-primed", () => {
    primePublicSiteData(buildSiteData([eranEvent]));
    const { result } = renderHook(() => usePublicSiteDataVersion());
    const initialVersion = result.current;

    act(() => {
      primePublicSiteData(
        buildSiteData([{ ...eranEvent, venue: "Updated Venue" }, julyOpenAir])
      );
    });

    expect(result.current).not.toBe(initialVersion);
    expect(getPublicSiteData().path).toBe("/events/us-s3e3");
    expect(getPublicEvents().find(event => event.id === "us-s3e3")?.venue).toBe(
      "Updated Venue"
    );
    expect(getPublicEvents().some(event => event.id === "css-jul04")).toBe(
      true
    );
  });

  it("revalidates a matching prerendered path against the live API", async () => {
    primePublicSiteData({
      path: "/",
      events: [julyOpenAir],
      featuredEvents: {},
    });

    const liveAugustEvent: ScheduledEvent = {
      ...julyOpenAir,
      id: "css-aug22",
      date: "August 22, 2026",
      title: "SUN(SETS) II",
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        path: "/",
        events: [julyOpenAir, liveAugustEvent],
        featuredEvents: {},
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await ensurePublicSiteData("/");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/site-data?path=%2F",
      expect.objectContaining({ credentials: "same-origin" })
    );
    expect(getPublicEvents().map(event => event.id)).toEqual([
      "css-jul04",
      "css-aug22",
    ]);
  });
});
