// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.doUnmock("../data/public-site-data");
  vi.resetModules();
});

describe("event publish gate after the original date", () => {
  for (const eventStatus of ["EventPostponed", "EventCancelled", "EventScheduled"]) {
    it(`${eventStatus} preserves the appropriate archive requirement`, async () => {
      vi.resetModules();
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-09-22T12:00:00Z"));
      vi.spyOn(console, "log").mockImplementation(() => {});
      vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("publish blocked");
      });
      vi.doMock("../data/public-site-data", () => ({
        upcomingEvents: [{
          id: "event-fixture",
          status: "coming-soon",
          eventStatus,
          endsAt: "2026-09-20T00:00:00Z",
        }],
      }));
      const validation = import("../../scripts/validate_events.mts");
      if (eventStatus === "EventScheduled") {
        await expect(validation).rejects.toThrow("publish blocked");
      } else {
        await expect(validation).resolves.toBeDefined();
        expect(process.exit).not.toHaveBeenCalled();
      }
    });
  }
});
