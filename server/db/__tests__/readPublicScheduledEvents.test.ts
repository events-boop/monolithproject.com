import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  getDatabase: vi.fn(),
  select: vi.fn(),
}));

vi.mock("../client", () => ({
  getDatabase: mocks.getDatabase,
}));

import { readPublicScheduledEvents } from "../scheduledEventsRepo";

function scheduledEventRow(overrides: Record<string, unknown>) {
  return {
    id: "mp-dec31",
    series: "monolith-project",
    episode: "NEW YEAR",
    title: "MONOLITH NEW YEAR",
    slug: null,
    subtitle: null,
    date: "December 31, 2026",
    time: "10:00 PM - Late",
    startsAt: null,
    endsAt: null,
    doors: null,
    venue: "Secret Warehouse",
    location: "Chicago, IL",
    lineup: null,
    image: null,
    status: "coming-soon",
    inventoryState: null,
    capacity: null,
    format: null,
    dress: null,
    sound: null,
    description: null,
    age: null,
    ticketUrl: null,
    startingPrice: null,
    ticketTiers: [],
    headline: null,
    mainExperience: null,
    experienceIntro: null,
    whatToExpect: [],
    tablePackages: [],
    tableReservationEmail: null,
    faqs: [],
    photoNotice: null,
    eventNotice: null,
    activeFunnels: [],
    recentlyDropped: false,
    ...overrides,
  };
}

beforeEach(() => {
  mocks.from.mockReset();
  mocks.getDatabase.mockReset();
  mocks.select.mockReset();
  mocks.select.mockReturnValue({ from: mocks.from });
  mocks.getDatabase.mockReturnValue({ select: mocks.select });
});

describe("readPublicScheduledEvents", () => {
  it("returns valid database-only events alongside the static catalog", async () => {
    mocks.from.mockResolvedValue([scheduledEventRow({})]);

    const events = await readPublicScheduledEvents();

    expect(events.find((event) => event.id === "mp-dec31")).toMatchObject({
      id: "mp-dec31",
      title: "MONOLITH NEW YEAR",
      series: "monolith-project",
    });
  });

  it("keeps stale ghost events out of the public catalog", async () => {
    mocks.from.mockResolvedValue([
      scheduledEventRow({
        id: "us-s3e2",
        series: "untold-story",
        episode: "STALE",
        title: "STALE GHOST",
      }),
    ]);

    const events = await readPublicScheduledEvents();

    expect(events.some((event) => event.id === "us-s3e2")).toBe(false);
  });

  it("normalizes stale external ticket URLs for tracked events", async () => {
    mocks.from.mockResolvedValue([
      scheduledEventRow({
        id: "us-s3e3",
        series: "untold-story",
        episode: "CHAPTER IV",
        title: "UNTOLD STORY IV: ERAN HERSH",
        date: "May 16, 2026",
        time: "9:00 PM - Late",
        venue: "Hideaway",
        status: "on-sale",
        ticketUrl: "https://posh.vip/e/eran-hersh-untold-story-iv-the-360-experience-a-monolith-project",
      }),
    ]);

    const events = await readPublicScheduledEvents();

    expect(events.find((event) => event.id === "us-s3e3")?.ticketUrl).toBe(
      "/go/tickets/us-s3e3",
    );
  });

  it("preserves an already-tracked internal ticket route on a tracked event", async () => {
    mocks.from.mockResolvedValue([
      scheduledEventRow({
        id: "us-s3e3",
        series: "untold-story",
        status: "on-sale",
        ticketUrl: "/go/tickets/us-s3e3-late",
      }),
    ]);

    const events = await readPublicScheduledEvents();

    expect(events.find((event) => event.id === "us-s3e3")?.ticketUrl).toBe(
      "/go/tickets/us-s3e3-late",
    );
  });

  it("drops invalid (non-https, non-path) ticket URLs on untracked events", async () => {
    mocks.from.mockResolvedValue([
      scheduledEventRow({
        id: "mp-dec31",
        series: "monolith-project",
        status: "on-sale",
        ticketUrl: "javascript:alert('xss')",
      }),
    ]);

    const events = await readPublicScheduledEvents();

    expect(events.find((event) => event.id === "mp-dec31")?.ticketUrl).toBeUndefined();
  });

  it("appends a DB-only event to the static catalog instead of dropping it", async () => {
    mocks.from.mockResolvedValue([
      scheduledEventRow({
        id: "mp-dec31",
        series: "monolith-project",
        episode: "NEW YEAR",
        title: "MONOLITH NEW YEAR",
        date: "December 31, 2026",
        time: "10:00 PM - Late",
        venue: "Secret Warehouse",
        status: "coming-soon",
      }),
    ]);

    const events = await readPublicScheduledEvents();

    expect(events.some((event) => event.id === "us-s3e3")).toBe(true);
    expect(events.some((event) => event.id === "mp-dec31")).toBe(true);
  });
});
