// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  currentSunsets,
  sunsetsShowVisible,
  sunsetsTicketsEnabled,
  withApprovedSunsets,
} from "../../shared/events/sunsets-current";
import { resolveEventPrimaryCta } from "../../shared/events/public-cta";
import { resolveOutboundDestination } from "../lib/outbound";
import { upcomingEvents } from "../data/public-site-data";
describe("owner-approved postponement publication", () => {
  it("requires the approved status and disables sales", () => {
    expect(currentSunsets.status).toBe("EventPostponed");
    expect(currentSunsets.statusApproval).toContain("Erik");
    expect(sunsetsTicketsEnabled()).toBe(false);
    expect(sunsetsShowVisible()).toBe(true);
  });
  it("keeps the postponed show and its update CTA after the original end time", () => {
    const event = withApprovedSunsets(
      upcomingEvents.find(e => e.id === "css-sep19")!,
      Date.parse("2026-09-21T12:00:00Z")
    );
    expect(event.status).not.toBe("past");
    expect(event.ticketUrl).toBeUndefined();
    expect(
      resolveEventPrimaryCta(event, new Date("2026-09-21T12:00:00Z")).href
    ).toBe("/sunsets#event-status");
  });
  it("sends legacy September ticket links to the update rather than a checkout", () => {
    expect(resolveOutboundDestination("tickets", "css-sep19")).toBe(
      "https://monolithproject.com/sunsets#event-update"
    );
  });
});
