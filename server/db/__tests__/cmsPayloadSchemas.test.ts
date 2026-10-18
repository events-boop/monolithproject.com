// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  eventsCatalogueSchema,
  faqsSiteSchema,
  homeFeaturedSchema,
  sunsetsPublicationSchema,
  trackingPixelsSchema,
  validateCmsPayload,
} from "../../../shared/cms/schemas";
import { FAQ_SITE } from "../../../shared/faqs";
import type { ScheduledEvent } from "../../../shared/events/types";

const baseEvent: ScheduledEvent = {
  id: "test-event",
  series: "untold-story",
  episode: "EPISODE I",
  title: "TEST EVENT",
  date: "January 1, 2027",
  time: "9:00 PM",
  venue: "Hideaway",
  location: "Chicago, IL",
  status: "coming-soon",
};

function catalogue(events: unknown[]) {
  return { events };
}

describe("eventsCatalogueSchema", () => {
  it("accepts a minimal valid event", () => {
    const result = eventsCatalogueSchema.safeParse(catalogue([baseEvent]));
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys (strict object)", () => {
    const result = eventsCatalogueSchema.safeParse(
      catalogue([{ ...baseEvent, primaryCta: { label: "x" } }])
    );
    expect(result.success).toBe(false);
  });

  it("rejects non-kebab-case ids", () => {
    const result = eventsCatalogueSchema.safeParse(
      catalogue([{ ...baseEvent, id: "Test Event!" }])
    );
    expect(result.success).toBe(false);
  });

  it("rejects duplicate ids and duplicate slugs", () => {
    const other = { ...baseEvent, slug: "shared-slug" };
    const dupeId = eventsCatalogueSchema.safeParse(
      catalogue([baseEvent, { ...baseEvent, slug: "other-slug" }])
    );
    const dupeSlug = eventsCatalogueSchema.safeParse(
      catalogue([other, { ...other, id: "test-event-2" }])
    );
    expect(dupeId.success).toBe(false);
    expect(dupeSlug.success).toBe(false);
  });

  it("rejects endsAt before startsAt", () => {
    const result = eventsCatalogueSchema.safeParse(
      catalogue([
        {
          ...baseEvent,
          startsAt: "2027-01-01T21:00:00-06:00",
          endsAt: "2027-01-01T20:00:00-06:00",
        },
      ])
    );
    expect(result.success).toBe(false);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>",
    "//evil.example.com/tickets",
    "http://example.com/tickets",
    "not-a-url",
  ])("rejects unsafe URL %s", url => {
    const result = eventsCatalogueSchema.safeParse(
      catalogue([{ ...baseEvent, image: url }])
    );
    expect(result.success).toBe(false);
  });

  it("accepts https-absolute and site-relative URLs", () => {
    const result = eventsCatalogueSchema.safeParse(
      catalogue([
        {
          ...baseEvent,
          image: "/images/flyer.webp",
          ticketUrl: undefined,
          recapUrl: "https://example.com/recap",
        },
      ])
    );
    expect(result.success).toBe(true);
  });

  it('requires an https ticketUrl while status is "on-sale"', () => {
    const missing = eventsCatalogueSchema.safeParse(
      catalogue([{ ...baseEvent, status: "on-sale" }])
    );
    const relative = eventsCatalogueSchema.safeParse(
      catalogue([{ ...baseEvent, status: "on-sale", ticketUrl: "/go/tickets/x" }])
    );
    const https = eventsCatalogueSchema.safeParse(
      catalogue([
        {
          ...baseEvent,
          status: "on-sale",
          ticketUrl: "https://posh.vip/e/test",
        },
      ])
    );
    expect(missing.success).toBe(false);
    expect(relative.success).toBe(false);
    expect(https.success).toBe(true);
  });

  it.each(["draft", "hidden"] as const)(
    'rejects a ticketUrl while status is "%s"',
    status => {
      const result = eventsCatalogueSchema.safeParse(
        catalogue([
          { ...baseEvent, status, ticketUrl: "https://posh.vip/e/test" },
        ])
      );
      expect(result.success).toBe(false);
    }
  );

  it.each(["EventPostponed", "EventCancelled"] as const)(
    "rejects ticket sales while eventStatus is %s",
    eventStatus => {
      const withUrl = eventsCatalogueSchema.safeParse(
        catalogue([
          {
            ...baseEvent,
            eventStatus,
            ticketUrl: "https://posh.vip/e/test",
          },
        ])
      );
      const selling = eventsCatalogueSchema.safeParse(
        catalogue([{ ...baseEvent, eventStatus, status: "on-sale" }])
      );
      expect(withUrl.success).toBe(false);
      expect(selling.success).toBe(false);
    }
  );
});

describe("sunsetsPublicationSchema", () => {
  const approved = JSON.parse(
    readFileSync(
      new URL("../../../shared/events/sunsets-page.json", import.meta.url),
      "utf8"
    )
  );

  it("accepts the approved sunsets-page.json verbatim", () => {
    const result = sunsetsPublicationSchema.safeParse(approved);
    expect(result.success).toBe(true);
  });

  it("requires statusApproval and disabled sales for a postponed event", () => {
    const noApproval = sunsetsPublicationSchema.safeParse({
      ...approved,
      statusApproval: undefined,
    });
    const salesOn = sunsetsPublicationSchema.safeParse({
      ...approved,
      salesEnabled: true,
    });
    expect(noApproval.success).toBe(false);
    expect(salesOn.success).toBe(false);
  });

  it("requires an https ticketUrl when sales are enabled on a scheduled event", () => {
    const scheduled = {
      ...approved,
      status: "EventScheduled",
      statusApproval: undefined,
      salesEnabled: true,
      ticketUrl: "/go/tickets/css-sep19",
    };
    expect(sunsetsPublicationSchema.safeParse(scheduled).success).toBe(false);
    expect(
      sunsetsPublicationSchema.safeParse({
        ...scheduled,
        ticketUrl: "https://posh.vip/e/test",
      }).success
    ).toBe(true);
  });

  it("rejects stale artwork approval", () => {
    const result = sunsetsPublicationSchema.safeParse({
      ...approved,
      artworkApprovedFor: {
        start: "2026-09-19T12:00:00-05:00",
        venueName: "Some Other Venue",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects end before start", () => {
    const result = sunsetsPublicationSchema.safeParse({
      ...approved,
      end: "2026-09-19T10:00:00-05:00",
    });
    expect(result.success).toBe(false);
  });
});

describe("faqsSiteSchema", () => {
  it("accepts the canonical FAQ content", () => {
    expect(faqsSiteSchema.safeParse(FAQ_SITE).success).toBe(true);
  });

  it("rejects duplicate category ids", () => {
    const dupe = {
      ...FAQ_SITE,
      categories: [FAQ_SITE.categories[0], FAQ_SITE.categories[0]],
    };
    expect(faqsSiteSchema.safeParse(dupe).success).toBe(false);
  });

  it("rejects empty questions", () => {
    const result = faqsSiteSchema.safeParse({
      ...FAQ_SITE,
      home: [{ question: "", answer: "x" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("homeFeaturedSchema", () => {
  const slots = {
    hero: "css-sep19",
    banner: "css-sep19",
    funnel: "css-sep19",
    ticket: "css-sep19",
    guide: "css-sep19",
  };

  it("requires all five slots", () => {
    expect(homeFeaturedSchema.safeParse({ slots }).success).toBe(true);
    const { guide, ...partial } = slots;
    expect(homeFeaturedSchema.safeParse({ slots: partial }).success).toBe(
      false
    );
  });
});

describe("trackingPixelsSchema", () => {
  const production = {
    metaPixelId: "1049241148606250",
    metaBrandPixelId: "166134370742863",
    ga4MeasurementId: "G-DE8Z8VS263",
  };

  it("accepts the current production tracking IDs", () => {
    expect(trackingPixelsSchema.safeParse(production).success).toBe(true);
  });

  it("accepts a null brand pixel and optional notes", () => {
    expect(
      trackingPixelsSchema.safeParse({
        ...production,
        metaBrandPixelId: null,
        notes: "Rotated after Q3 campaign",
      }).success
    ).toBe(true);
  });

  it("rejects malformed GA4 measurement ids", () => {
    for (const ga4MeasurementId of ["DE8Z8VS263", "G-", "UA-12345-1", ""]) {
      expect(
        trackingPixelsSchema.safeParse({ ...production, ga4MeasurementId })
          .success
      ).toBe(false);
    }
  });

  it("rejects non-digit Meta pixel ids", () => {
    for (const metaPixelId of ["abc123", "1049 2411", "1049241148606250x"]) {
      expect(
        trackingPixelsSchema.safeParse({ ...production, metaPixelId }).success
      ).toBe(false);
    }
  });

  it("rejects unknown keys (strict object)", () => {
    expect(
      trackingPixelsSchema.safeParse({ ...production, extra: true }).success
    ).toBe(false);
  });

  it("requires metaPixelId and ga4MeasurementId", () => {
    const { metaPixelId, ...withoutMeta } = production;
    const { ga4MeasurementId, ...withoutGa4 } = production;
    expect(trackingPixelsSchema.safeParse(withoutMeta).success).toBe(false);
    expect(trackingPixelsSchema.safeParse(withoutGa4).success).toBe(false);
  });
});

describe("validateCmsPayload", () => {
  it("fails closed on unknown keys", () => {
    const result = validateCmsPayload("nope.unknown", {});
    expect(result.success).toBe(false);
    expect(result.issues[0]).toContain("Unknown CMS document key");
  });

  it("flattens issues with paths", () => {
    const result = validateCmsPayload("home.featured", {
      slots: { hero: "BAD ID!", banner: "x", funnel: "x", ticket: "x" },
    });
    expect(result.success).toBe(false);
    expect(result.issues.some(issue => issue.startsWith("slots."))).toBe(true);
  });
});
