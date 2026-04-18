import { beforeEach, describe, expect, it, vi } from "vitest";
import { upcomingEvents } from "../data/public-site-data";

const readPublicScheduledEvents = vi.hoisted(() => vi.fn());

vi.mock("../db/scheduledEventsRepo", () => ({
  readPublicScheduledEvents,
}));

vi.mock("../lib/logging", () => ({
  logEvent: vi.fn(),
}));

import { siteDataService } from "../services/site-data-service";

describe("siteDataService", () => {
  beforeEach(() => {
    siteDataService.invalidate();
    readPublicScheduledEvents.mockReset();
    readPublicScheduledEvents.mockResolvedValue(upcomingEvents);
  });

  it("memoizes serialized site data responses per path", async () => {
    const first = await siteDataService.getSiteDataResponse("/radio");
    const second = await siteDataService.getSiteDataResponse("/radio");

    expect(readPublicScheduledEvents).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
    expect(first.serialized).toBe(JSON.stringify(first.payload));
    expect(first.etag).toMatch(/^W\/".+"$/);
  });
});
