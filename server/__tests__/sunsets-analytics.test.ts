import { beforeEach, describe, expect, it, vi } from "vitest";

const mockState = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("../db/client", () => ({
  getDatabase: () => ({ execute: mockState.execute }),
}));

import {
  classifyAttributionChannel,
  parseSunsetsAnalyticsFilters,
  readSunsetsAnalytics,
} from "../services/sunsets-analytics";

describe("sunsets analytics", () => {
  beforeEach(() => {
    mockState.execute.mockReset();
  });

  it("validates event and inclusive date filters", () => {
    expect(
      parseSunsetsAnalyticsFilters({
        event_slug: "chasing-sunsets-august-22-2026",
        date_from: "2026-08-01",
        date_to: "2026-08-22",
      })
    ).toEqual({
      eventSlug: "chasing-sunsets-august-22-2026",
      dateFrom: "2026-08-01",
      dateTo: "2026-08-22",
    });

    expect(() =>
      parseSunsetsAnalyticsFilters({ event_slug: "not-a-real-show" })
    ).toThrow(/unsupported event_slug/i);
    expect(() =>
      parseSunsetsAnalyticsFilters({
        date_from: "2026-08-23",
        date_to: "2026-08-22",
      })
    ).toThrow(/on or before/i);
  });

  it("classifies paid traffic before owned-source rules", () => {
    expect(classifyAttributionChannel("instagram", "paid_social")).toBe("paid");
    expect(classifyAttributionChannel("laylo", "sms")).toBe("owned");
    expect(classifyAttributionChannel("partner", "referral")).toBe("earned");
    expect(classifyAttributionChannel("direct", "none")).toBe("direct");
  });

  it("reports ticket quantity, refunds, and paid-versus-owned channel totals", async () => {
    mockState.execute
      .mockResolvedValueOnce({
        rows: [
          {
            visits: "20",
            unique_visitors: "18",
            first_access_clicks: "4",
            first_access_signups: "3",
            ticket_clicks: "8",
            orders: "3",
            ticket_quantity: "6",
            gross_ticket_quantity: "8",
            refunded_orders: "1",
            refund_cents: "4000",
            revenue_cents: "12000",
            vip_clicks: "1",
            vip_leads: "1",
            recap_clicks: "0",
            gallery_clicks: "0",
            soundcloud_clicks: "0",
            share_clicks: "0",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            source: "instagram",
            medium: "paid_social",
            visits: "10",
            signups: "1",
            ticket_clicks: "4",
            orders: "1",
            ticket_quantity: "2",
            gross_ticket_quantity: "2",
            refunded_orders: "0",
            refund_cents: "0",
            revenue_cents: "5000",
          },
          {
            source: "laylo",
            medium: "sms",
            visits: "10",
            signups: "2",
            ticket_clicks: "4",
            orders: "2",
            ticket_quantity: "4",
            gross_ticket_quantity: "6",
            refunded_orders: "1",
            refund_cents: "4000",
            revenue_cents: "7000",
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const analytics = await readSunsetsAnalytics({
      eventSlug: "chasing-sunsets-august-22-2026",
    });

    expect(analytics.summary).toMatchObject({
      orders: 3,
      purchases: 3,
      ticketQuantity: 6,
      grossTicketQuantity: 8,
      refundedOrders: 1,
      refundDollars: 40,
    });
    expect(analytics.channels).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          channel: "paid",
          orders: 1,
          ticketQuantity: 2,
        }),
        expect.objectContaining({
          channel: "owned",
          orders: 2,
          ticketQuantity: 4,
          refundedOrders: 1,
        }),
      ])
    );
  });
});
