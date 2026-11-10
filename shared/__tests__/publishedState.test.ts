// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  PUBLISHED_CTA_LABELS,
  getPublishedCatalogue,
  getPublishedEventState,
  getSitePublishedState,
  needsTicketHolderUpdate,
} from "../events/publishedState";
import { resolveEventPrimaryCta } from "../events/public-cta";
import type { ScheduledEvent } from "../events/types";

// A Saturday night in standard time (Chicago = UTC-6).
const START = "2026-11-14T21:00:00-06:00";
const END = "2026-11-15T03:00:00-06:00";
const BEFORE = new Date("2026-11-01T12:00:00-06:00");
const AFTER = new Date("2026-11-20T12:00:00-06:00");
const ms = (iso: string, offset = 0) => new Date(Date.parse(iso) + offset);

function makeEvent(overrides: Partial<ScheduledEvent> = {}): ScheduledEvent {
  return {
    id: "test-night",
    series: "untold-story",
    episode: "TEST",
    title: "Test Night",
    date: "November 14, 2026",
    time: "9:00 PM",
    startsAt: START,
    endsAt: END,
    venue: "Test Room",
    location: "Chicago, IL",
    status: "on-sale",
    ticketUrl: "/go/tickets/test-night",
    ...overrides,
  };
}

const kindOf = (event: ScheduledEvent | null | undefined, now: Date) =>
  getPublishedEventState(event, now).kind;

describe("getPublishedEventState — per-event states", () => {
  describe("unpublished", () => {
    it("treats a missing record as unpublished", () => {
      expect(getPublishedEventState(null, BEFORE)).toEqual({
        kind: "unpublished",
        listed: false,
        cta: null,
      });
      expect(kindOf(undefined, BEFORE)).toBe("unpublished");
    });

    it("never publishes a draft, even one carrying a ticket URL", () => {
      const state = getPublishedEventState(
        makeEvent({ status: "draft" }),
        BEFORE
      );
      expect(state).toEqual({ kind: "unpublished", listed: false, cta: null });
    });
  });

  describe("on-sale", () => {
    it("carries the ticket URL so the ticket CTA can never dead-end", () => {
      expect(getPublishedEventState(makeEvent(), BEFORE)).toEqual({
        kind: "on-sale",
        listed: true,
        cta: "get-tickets",
        ticketUrl: "/go/tickets/test-night",
      });
    });

    it("falls back to first-access when on-sale has no ticket URL", () => {
      const event = makeEvent({ ticketUrl: undefined });
      expect(kindOf(event, BEFORE)).toBe("first-access");
    });

    it("falls back to first-access when the ticket URL is empty", () => {
      expect(kindOf(makeEvent({ ticketUrl: "" }), BEFORE)).toBe("first-access");
    });

    it("falls back to first-access when on-sale has no usable date", () => {
      const event = makeEvent({
        date: "Reveal Soon",
        startsAt: undefined,
        endsAt: undefined,
      });
      expect(kindOf(event, BEFORE)).toBe("first-access");
    });

    it("treats a rescheduled event as scheduled on its new dates", () => {
      const event = makeEvent({ eventStatus: "EventRescheduled" });
      expect(kindOf(event, BEFORE)).toBe("on-sale");
      expect(kindOf(event, AFTER)).toBe("past");
    });
  });

  describe("first-access", () => {
    it("is the state of an announced event without checkout", () => {
      const event = makeEvent({ status: "coming-soon", ticketUrl: undefined });
      expect(getPublishedEventState(event, BEFORE)).toEqual({
        kind: "first-access",
        listed: true,
        cta: "get-first-access",
      });
    });

    it("keeps an undated announcement in first-access indefinitely", () => {
      const event = makeEvent({
        status: "coming-soon",
        ticketUrl: undefined,
        date: "2027",
        time: "Reveal Soon",
        startsAt: undefined,
        endsAt: undefined,
      });
      expect(kindOf(event, BEFORE)).toBe("first-access");
      expect(kindOf(event, new Date("2029-01-01T00:00:00Z"))).toBe(
        "first-access"
      );
    });

    it("resolves a hidden record but keeps it out of lists", () => {
      const state = getPublishedEventState(
        makeEvent({ status: "hidden", ticketUrl: undefined }),
        BEFORE
      );
      expect(state).toEqual({
        kind: "first-access",
        listed: false,
        cta: "get-first-access",
      });
    });
  });

  describe("sold-out", () => {
    it("renders the sold-out badge and a waitlist CTA", () => {
      expect(
        getPublishedEventState(makeEvent({ status: "sold-out" }), BEFORE)
      ).toEqual({
        kind: "sold-out",
        listed: true,
        cta: "join-waitlist",
        badge: "Sold out",
      });
    });

    it("archives a sold-out event once its window ends", () => {
      expect(kindOf(makeEvent({ status: "sold-out" }), AFTER)).toBe("past");
    });
  });

  describe("postponed / cancelled", () => {
    const disruptions = [
      ["EventPostponed", "postponed"],
      ["EventCancelled", "cancelled"],
    ] as const;

    it.each(disruptions)(
      "%s with ticket holders renders the ticket-holder update",
      (eventStatus, kind) => {
        const event = makeEvent({
          eventStatus,
          ticketHolderNotice: "Tickets will be honored.",
          statusUrl: "/sunsets#event-status",
        });
        expect(getPublishedEventState(event, BEFORE)).toEqual({
          kind,
          listed: false,
          ticketHolders: true,
          cta: "ticket-holder-update",
          statusUrl: "/sunsets#event-status",
        });
      }
    );

    it.each(disruptions)(
      "%s without ticket holders renders a plain event update",
      (eventStatus, kind) => {
        const event = makeEvent({
          eventStatus,
          status: "coming-soon",
          ticketUrl: undefined,
        });
        expect(getPublishedEventState(event, BEFORE)).toEqual({
          kind,
          listed: false,
          ticketHolders: false,
          cta: "event-update",
          statusUrl: "/events/test-night",
        });
      }
    );

    it("prefers the slug over the id for the default status URL", () => {
      const state = getPublishedEventState(
        makeEvent({ eventStatus: "EventPostponed", slug: "test-night-live" }),
        BEFORE
      );
      expect(state).toMatchObject({ statusUrl: "/events/test-night-live" });
    });

    it("ignores a blank ticket-holder notice", () => {
      const state = getPublishedEventState(
        makeEvent({ eventStatus: "EventPostponed", ticketHolderNotice: "   " }),
        BEFORE
      );
      expect(state).toMatchObject({
        ticketHolders: false,
        cta: "event-update",
      });
    });

    it.each(disruptions)(
      "%s overrides live sales and never exposes a ticket URL",
      eventStatus => {
        const state = getPublishedEventState(
          makeEvent({ eventStatus }),
          BEFORE
        );
        expect(state.listed).toBe(false);
        expect("ticketUrl" in state).toBe(false);
      }
    );

    it.each(disruptions)(
      "%s does not expire into the archive when its original date passes",
      (eventStatus, kind) => {
        const event = makeEvent({ eventStatus });
        expect(kindOf(event, AFTER)).toBe(kind);
        expect(kindOf(event, new Date("2030-01-01T00:00:00Z"))).toBe(kind);
      }
    );

    it("lets an explicit past status close out a postponed record", () => {
      const event = makeEvent({
        status: "past",
        eventStatus: "EventPostponed",
        ticketHolderNotice: "Tickets will be honored.",
      });
      expect(kindOf(event, BEFORE)).toBe("past");
    });
  });

  describe("past", () => {
    it("archives by explicit status regardless of dates", () => {
      expect(kindOf(makeEvent({ status: "past" }), BEFORE)).toBe("past");
    });

    it("archives by window even when the status was never flipped", () => {
      expect(getPublishedEventState(makeEvent(), AFTER)).toEqual({
        kind: "past",
        listed: false,
        cta: "view-archive",
        archiveUrl: "/archive",
      });
    });

    it("links the recap first, then the archive collection, then the archive", () => {
      const archiveUrl = (overrides: Partial<ScheduledEvent>) => {
        const state = getPublishedEventState(
          makeEvent({ status: "past", ...overrides }),
          AFTER
        );
        return state.kind === "past" ? state.archiveUrl : undefined;
      };
      expect(
        archiveUrl({ recapUrl: "/recap/test", archiveSlug: "test-2026" })
      ).toBe("/recap/test");
      expect(archiveUrl({ archiveSlug: "test-2026" })).toBe(
        "/archive/test-2026"
      );
      expect(archiveUrl({})).toBe("/archive");
    });
  });
});

describe("getPublishedEventState — boundary timestamps", () => {
  it("stays on-sale up to, at, and after doors", () => {
    const event = makeEvent();
    expect(kindOf(event, ms(START, -1))).toBe("on-sale");
    expect(kindOf(event, ms(START))).toBe("on-sale");
    expect(kindOf(event, ms(START, 1))).toBe("on-sale");
  });

  it("flips to past exactly at endsAt", () => {
    const event = makeEvent();
    expect(kindOf(event, ms(END, -1))).toBe("on-sale");
    expect(kindOf(event, ms(END))).toBe("past");
    expect(kindOf(event, ms(END, 1))).toBe("past");
  });

  it("ends a date-only event at the following Chicago midnight (standard time)", () => {
    const event = makeEvent({ startsAt: undefined, endsAt: undefined });
    // Nov 15 00:00 CST = 06:00 UTC.
    expect(kindOf(event, new Date("2026-11-15T05:59:59.999Z"))).toBe("on-sale");
    expect(kindOf(event, new Date("2026-11-15T06:00:00.000Z"))).toBe("past");
  });

  it("ends a date-only event at the following Chicago midnight (daylight time)", () => {
    const event = makeEvent({
      date: "July 4, 2026",
      startsAt: undefined,
      endsAt: undefined,
    });
    // Jul 5 00:00 CDT = 05:00 UTC.
    expect(kindOf(event, new Date("2026-07-05T04:59:59.999Z"))).toBe("on-sale");
    expect(kindOf(event, new Date("2026-07-05T05:00:00.000Z"))).toBe("past");
  });

  it("treats ISO date-only records the same as named dates", () => {
    const event = makeEvent({
      date: "2026-11-14",
      startsAt: undefined,
      endsAt: undefined,
    });
    expect(kindOf(event, new Date("2026-11-15T05:59:59.999Z"))).toBe("on-sale");
    expect(kindOf(event, new Date("2026-11-15T06:00:00.000Z"))).toBe("past");
  });

  it("is on-sale before a date-only event's day begins", () => {
    const event = makeEvent({ startsAt: undefined, endsAt: undefined });
    expect(kindOf(event, new Date("2026-11-14T05:59:59.999Z"))).toBe("on-sale");
  });

  it("uses endsAt over the calendar day for a show that runs past midnight", () => {
    // Ends 3:00 AM Nov 15: still live at 1:00 AM, past at 3:00 AM.
    const event = makeEvent();
    expect(kindOf(event, new Date("2026-11-15T01:00:00-06:00"))).toBe(
      "on-sale"
    );
    expect(kindOf(event, new Date("2026-11-15T03:00:00-06:00"))).toBe("past");
  });
});

describe("getPublishedEventState — status × eventStatus matrix", () => {
  const statuses = [
    "draft",
    "hidden",
    "coming-soon",
    "on-sale",
    "sold-out",
    "past",
  ] as const;
  const eventStatuses = [
    undefined,
    "EventScheduled",
    "EventRescheduled",
    "EventPostponed",
    "EventCancelled",
  ] as const;
  const scheduledKind = {
    hidden: "first-access",
    "coming-soon": "first-access",
    "on-sale": "on-sale",
    "sold-out": "sold-out",
  } as const;

  const rows = statuses.flatMap(status =>
    eventStatuses.map(eventStatus => {
      const disruption =
        eventStatus === "EventPostponed"
          ? "postponed"
          : eventStatus === "EventCancelled"
            ? "cancelled"
            : undefined;
      const beforeWindow =
        status === "draft"
          ? "unpublished"
          : status === "past"
            ? "past"
            : (disruption ?? scheduledKind[status]);
      const afterWindow =
        status === "draft" ? "unpublished" : (disruption ?? "past");
      return [
        status,
        eventStatus ?? "(none)",
        beforeWindow,
        status === "past" ? "past" : afterWindow,
        eventStatus,
      ] as const;
    })
  );

  it("covers all 30 combinations", () => {
    expect(rows).toHaveLength(30);
  });

  it.each(rows)(
    "status=%s eventStatus=%s → %s before the show, %s after",
    (status, _label, beforeWindow, afterWindow, eventStatus) => {
      const event = makeEvent({ status, eventStatus });
      expect(kindOf(event, BEFORE)).toBe(beforeWindow);
      expect(kindOf(event, AFTER)).toBe(afterWindow);
    }
  );

  it.each(rows)(
    "status=%s eventStatus=%s is listed only when upcoming and not hidden",
    (status, _label, beforeWindow, _afterWindow, eventStatus) => {
      const state = getPublishedEventState(
        makeEvent({ status, eventStatus }),
        BEFORE
      );
      const expected =
        status !== "hidden" &&
        ["on-sale", "first-access", "sold-out"].includes(beforeWindow);
      expect(state.listed).toBe(expected);
    }
  );
});

describe("getPublishedEventState — purity", () => {
  it("does not mutate the event and is repeatable", () => {
    const event = Object.freeze(makeEvent());
    const first = getPublishedEventState(event, BEFORE);
    const second = getPublishedEventState(event, BEFORE);
    expect(first).toEqual(second);
    expect(event).toEqual(makeEvent());
  });

  it("depends only on the supplied clock", () => {
    const event = makeEvent();
    expect(kindOf(event, BEFORE)).toBe("on-sale");
    expect(kindOf(event, AFTER)).toBe("past");
    expect(kindOf(event, BEFORE)).toBe("on-sale");
  });
});

describe("needsTicketHolderUpdate", () => {
  it("is true only for postponed or cancelled shows with ticket holders", () => {
    const withHolders = { ticketHolderNotice: "Tickets will be honored." };
    const check = (overrides: Partial<ScheduledEvent>) =>
      needsTicketHolderUpdate(
        getPublishedEventState(makeEvent(overrides), BEFORE)
      );
    expect(check({ eventStatus: "EventPostponed", ...withHolders })).toBe(true);
    expect(check({ eventStatus: "EventCancelled", ...withHolders })).toBe(true);
    expect(check({ eventStatus: "EventPostponed" })).toBe(false);
    expect(check(withHolders)).toBe(false);
    expect(check({ status: "past", ...withHolders })).toBe(false);
  });
});

describe("getPublishedCatalogue — site state", () => {
  const onSale = makeEvent({ id: "on-sale", title: "On Sale" });
  const firstAccess = makeEvent({
    id: "first-access",
    title: "First Access",
    status: "coming-soon",
    ticketUrl: undefined,
    date: "November 7, 2026",
    startsAt: "2026-11-07T21:00:00-06:00",
    endsAt: "2026-11-08T03:00:00-06:00",
  });
  const soldOut = makeEvent({
    id: "sold-out",
    title: "Sold Out",
    status: "sold-out",
  });
  const postponed = makeEvent({
    id: "postponed",
    title: "Postponed",
    date: "September 19, 2026",
    startsAt: "2026-09-19T12:00:00-05:00",
    endsAt: "2026-09-19T22:00:00-05:00",
    status: "coming-soon",
    ticketUrl: undefined,
    eventStatus: "EventPostponed",
    ticketHolderNotice: "Tickets will be honored.",
  });
  const cancelled = makeEvent({
    id: "cancelled",
    title: "Cancelled",
    eventStatus: "EventCancelled",
  });
  const finished = makeEvent({
    id: "finished",
    title: "Finished",
    date: "July 4, 2026",
    startsAt: "2026-07-04T12:00:00-05:00",
    endsAt: "2026-07-04T22:00:00-05:00",
    status: "past",
    ticketUrl: undefined,
  });
  const draft = makeEvent({ id: "draft", title: "Draft", status: "draft" });
  const hidden = makeEvent({
    id: "hidden",
    title: "Hidden",
    status: "hidden",
    ticketUrl: undefined,
  });
  const ids = (entries: Array<{ event: ScheduledEvent }>) =>
    entries.map(entry => entry.event.id);

  it("is between-shows for an empty catalogue", () => {
    expect(getPublishedCatalogue([], BEFORE)).toEqual({
      site: "between-shows",
      upcoming: [],
      notices: [],
      past: [],
      lead: undefined,
    });
  });

  it("is between-shows when everything is finished", () => {
    const catalogue = getPublishedCatalogue([finished], BEFORE);
    expect(catalogue.site).toBe("between-shows");
    expect(ids(catalogue.past)).toEqual(["finished"]);
    expect(catalogue.upcoming).toEqual([]);
  });

  it("is active with an on-sale event and leads with it", () => {
    const catalogue = getPublishedCatalogue([onSale, finished], BEFORE);
    expect(catalogue.site).toBe("active");
    expect(catalogue.lead?.event.id).toBe("on-sale");
  });

  it("is active with only a first-access event", () => {
    const catalogue = getPublishedCatalogue([firstAccess], BEFORE);
    expect(catalogue.site).toBe("active");
    expect(catalogue.lead?.event.id).toBe("first-access");
  });

  it("leads with on-sale over an earlier first-access event", () => {
    const catalogue = getPublishedCatalogue([firstAccess, onSale], BEFORE);
    expect(ids(catalogue.upcoming)).toEqual(["first-access", "on-sale"]);
    expect(catalogue.lead?.event.id).toBe("on-sale");
  });

  it("is between-shows when the only upcoming event is sold out, but still lists it", () => {
    const catalogue = getPublishedCatalogue([soldOut], BEFORE);
    expect(catalogue.site).toBe("between-shows");
    expect(ids(catalogue.upcoming)).toEqual(["sold-out"]);
    expect(catalogue.lead).toBeUndefined();
  });

  it("strictly excludes postponed and cancelled events from upcoming", () => {
    const catalogue = getPublishedCatalogue(
      [postponed, cancelled, onSale],
      BEFORE
    );
    expect(ids(catalogue.upcoming)).toEqual(["on-sale"]);
    expect(ids(catalogue.notices)).toEqual(["postponed", "cancelled"]);
  });

  it("is between-shows when only postponed or cancelled events remain", () => {
    const catalogue = getPublishedCatalogue([postponed, cancelled], BEFORE);
    expect(catalogue.site).toBe("between-shows");
    expect(catalogue.upcoming).toEqual([]);
    expect(catalogue.notices).toHaveLength(2);
  });

  it("never surfaces drafts or hidden records in any list", () => {
    const catalogue = getPublishedCatalogue([draft, hidden], BEFORE);
    expect(catalogue).toEqual({
      site: "between-shows",
      upcoming: [],
      notices: [],
      past: [],
      lead: undefined,
    });
  });

  it("does not let a hidden first-access record keep the site active", () => {
    expect(getSitePublishedState([hidden, finished], BEFORE)).toBe(
      "between-shows"
    );
  });

  it("places every public event in exactly one list", () => {
    const all = [
      onSale,
      firstAccess,
      soldOut,
      postponed,
      cancelled,
      finished,
      draft,
      hidden,
    ];
    const catalogue = getPublishedCatalogue(all, BEFORE);
    const placed = [
      ...ids(catalogue.upcoming),
      ...ids(catalogue.notices),
      ...ids(catalogue.past),
    ];
    expect([...placed].sort()).toEqual(
      [
        "cancelled",
        "finished",
        "first-access",
        "on-sale",
        "postponed",
        "sold-out",
      ].sort()
    );
    expect(new Set(placed).size).toBe(placed.length);
  });

  it("returns the caller's own event objects", () => {
    const catalogue = getPublishedCatalogue([onSale], BEFORE);
    expect(catalogue.upcoming[0].event).toBe(onSale);
  });

  it("does not reorder the caller's array", () => {
    const input = [onSale, firstAccess];
    getPublishedCatalogue(input, BEFORE);
    expect(input.map(event => event.id)).toEqual(["on-sale", "first-access"]);
  });

  it("agrees with getSitePublishedState", () => {
    for (const events of [
      [],
      [onSale],
      [soldOut],
      [postponed],
      [firstAccess],
    ]) {
      expect(getSitePublishedState(events, BEFORE)).toBe(
        getPublishedCatalogue(events, BEFORE).site
      );
    }
  });
});

describe("getPublishedCatalogue — ordering", () => {
  const dated = (id: string, title: string, day: string) =>
    makeEvent({
      id,
      title,
      date: `November ${day}, 2026`,
      startsAt: `2026-11-${day}T21:00:00-06:00`,
      endsAt: `2026-11-${day}T23:00:00-06:00`,
    });
  const undated = (id: string, title: string) =>
    makeEvent({
      id,
      title,
      status: "coming-soon",
      ticketUrl: undefined,
      date: "2027",
      startsAt: undefined,
      endsAt: undefined,
    });
  const ids = (entries: Array<{ event: ScheduledEvent }>) =>
    entries.map(entry => entry.event.id);

  it("lists upcoming soonest first with undated announcements last", () => {
    const catalogue = getPublishedCatalogue(
      [
        undated("tba", "TBA"),
        dated("late", "Late", "28"),
        dated("early", "Early", "14"),
      ],
      BEFORE
    );
    expect(ids(catalogue.upcoming)).toEqual(["early", "late", "tba"]);
  });

  it("breaks ties by title, including between undated events", () => {
    const catalogue = getPublishedCatalogue(
      [
        undated("z", "Zulu"),
        undated("a", "Alpha"),
        dated("b2", "Bravo", "14"),
        dated("a2", "Able", "14"),
      ],
      BEFORE
    );
    expect(ids(catalogue.upcoming)).toEqual(["a2", "b2", "a", "z"]);
  });

  it("lists past events most recent first", () => {
    const catalogue = getPublishedCatalogue(
      [dated("early", "Early", "14"), dated("late", "Late", "28")],
      new Date("2026-12-15T12:00:00-06:00")
    );
    expect(ids(catalogue.past)).toEqual(["late", "early"]);
  });
});

describe("getPublishedCatalogue — the clock moves the site between states", () => {
  const show = makeEvent();

  it("goes active → between-shows the moment the last show ends", () => {
    const justBefore = getPublishedCatalogue([show], ms(END, -1));
    const atEnd = getPublishedCatalogue([show], ms(END));

    expect(justBefore.site).toBe("active");
    expect(justBefore.upcoming).toHaveLength(1);
    expect(justBefore.past).toHaveLength(0);

    expect(atEnd.site).toBe("between-shows");
    expect(atEnd.upcoming).toHaveLength(0);
    expect(atEnd.past).toHaveLength(1);
  });

  it("returns to active when a new date is announced", () => {
    const next = makeEvent({
      id: "next",
      title: "Next",
      status: "coming-soon",
      ticketUrl: undefined,
      date: "2027",
      startsAt: undefined,
      endsAt: undefined,
    });
    expect(getSitePublishedState([show], AFTER)).toBe("between-shows");
    expect(getSitePublishedState([show, next], AFTER)).toBe("active");
  });

  it("reproduces the November 2026 calendar: no stale dates under upcoming", () => {
    const now = new Date("2026-11-09T16:00:00-06:00");
    const sunsetsFinale = makeEvent({
      id: "finale",
      series: "chasing-sunsets",
      title: "Chasing Sun(Sets)",
      date: "September 19, 2026",
      startsAt: "2026-09-19T12:00:00-05:00",
      endsAt: "2026-09-19T22:00:00-05:00",
      status: "coming-soon",
      ticketUrl: undefined,
      eventStatus: "EventPostponed",
      statusUrl: "/sunsets#event-status",
      ticketHolderNotice: "Ticket purchases will be honored.",
    });
    const launchPlaceholder = makeEvent({
      id: "launch",
      series: "monolith-project",
      title: "The Monolith Project",
      date: "October 10, 2026",
      startsAt: undefined,
      endsAt: undefined,
      status: "coming-soon",
      ticketUrl: undefined,
      eventStatus: "EventPostponed",
    });
    const summerShow = makeEvent({
      id: "summer",
      date: "August 22, 2026",
      startsAt: undefined,
      endsAt: undefined,
      status: "past",
      ticketUrl: undefined,
    });

    const catalogue = getPublishedCatalogue(
      [summerShow, sunsetsFinale, launchPlaceholder],
      now
    );

    expect(catalogue.site).toBe("between-shows");
    expect(catalogue.upcoming).toEqual([]);
    expect(catalogue.notices.map(entry => entry.event.id)).toEqual([
      "finale",
      "launch",
    ]);
    expect(needsTicketHolderUpdate(catalogue.notices[0].state)).toBe(true);
    expect(needsTicketHolderUpdate(catalogue.notices[1].state)).toBe(false);
    expect(catalogue.past.map(entry => entry.event.id)).toEqual(["summer"]);
  });
});

describe("resolveEventPrimaryCta — driven by the published state", () => {
  it("sends on-sale events to checkout", () => {
    expect(resolveEventPrimaryCta(makeEvent(), BEFORE)).toEqual({
      label: PUBLISHED_CTA_LABELS["get-tickets"],
      href: "/go/tickets/test-night",
      tool: "posh",
      isExternal: true,
    });
  });

  it("never returns a ticket label once the show is postponed", () => {
    const cta = resolveEventPrimaryCta(
      makeEvent({
        eventStatus: "EventPostponed",
        ticketHolderNotice: "Tickets will be honored.",
      }),
      AFTER
    );
    expect(cta).toEqual({
      label: "Ticket-Holder Update",
      href: "/events/test-night",
      tool: "posh",
      isExternal: false,
    });
  });

  it("routes by the record's statusUrl, not by event id", () => {
    const anyEvent = makeEvent({
      id: "any-other-show",
      eventStatus: "EventCancelled",
      statusUrl: "/sunsets#event-status",
    });
    const sameIdWithoutStatusUrl = makeEvent({
      id: "css-sep19",
      eventStatus: "EventPostponed",
    });
    expect(resolveEventPrimaryCta(anyEvent, BEFORE).href).toBe(
      "/sunsets#event-status"
    );
    expect(resolveEventPrimaryCta(sameIdWithoutStatusUrl, BEFORE).href).toBe(
      "/events/css-sep19"
    );
  });

  it("keeps the first-access label the Meta Pixel lead handler matches", () => {
    const cta = resolveEventPrimaryCta(
      makeEvent({ status: "coming-soon", ticketUrl: undefined }),
      BEFORE
    );
    expect(cta.label).toBe("Get First Access");
    expect(cta.href).toBe("/untold-story#untold-funnel");
  });

  it("sends sold-out events to the series waitlist and past events to the archive", () => {
    expect(
      resolveEventPrimaryCta(makeEvent({ status: "sold-out" }), BEFORE).label
    ).toBe("Join The Waitlist");
    expect(
      resolveEventPrimaryCta(makeEvent({ archiveSlug: "test-2026" }), AFTER)
    ).toMatchObject({ label: "View archive", href: "/archive/test-2026" });
  });

  it("gives drafts and missing records the neutral schedule link", () => {
    expect(
      resolveEventPrimaryCta(makeEvent({ status: "draft" }), BEFORE).href
    ).toBe("/schedule");
    expect(resolveEventPrimaryCta(null, BEFORE).href).toBe("/schedule");
  });
});
