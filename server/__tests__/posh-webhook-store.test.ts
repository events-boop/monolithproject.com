import { beforeEach, describe, expect, it, vi } from "vitest";
import { contacts, ticketOrders } from "../db/schema";

type InsertOperation = {
  table: unknown;
  values?: Record<string, unknown>;
  conflict?: {
    set?: Record<string, unknown>;
  };
};

const mockState = vi.hoisted(() => ({
  db: null as null | {
    insert: (table: unknown) => unknown;
  },
  operations: [] as InsertOperation[],
}));

vi.mock("../db/client", () => ({
  getDatabase: () => mockState.db,
}));

import { persistPoshWebhookPurchase } from "../services/posh-webhook-store";

function createMockDb() {
  let rowId = 0;

  return {
    insert(table: unknown) {
      const operation: InsertOperation = { table };
      mockState.operations.push(operation);

      const chain = {
        values(values: Record<string, unknown>) {
          operation.values = values;
          return chain;
        },
        onConflictDoUpdate(conflict: InsertOperation["conflict"]) {
          operation.conflict = conflict;
          return chain;
        },
        returning() {
          rowId += 1;
          return Promise.resolve([{ id: `row_${rowId}` }]);
        },
      };

      return chain;
    },
  };
}

function getInsertFor(table: unknown) {
  const operation = mockState.operations.find(item => item.table === table);
  expect(operation).toBeDefined();
  return operation as InsertOperation;
}

describe("persistPoshWebhookPurchase", () => {
  beforeEach(() => {
    mockState.operations.length = 0;
    mockState.db = createMockDb();
  });

  it("maps Posh attribution params into native columns and keeps event slugs on ticket upserts", async () => {
    const trackingLink =
      "https://posh.vip/e/sunsets?utm_source=sunsetsvip&utm_medium=linkinbio&utm_campaign=sunsets_2026_07_04&utm_content=buy_tickets_primary&utm_term=vip-table&event_slug=campaign-july-four&session_id=sess_123";

    await expect(
      persistPoshWebhookPurchase(
        {
          type: "new_order",
          account_email: "Fan@Example.com",
          account_first_name: "Fan",
          account_last_name: "Example",
          account_phone: "3125551212",
          event_id: "evt_123",
          event_name: "SUN(SETS) I",
          event_start: "2026-07-04T18:00:00Z",
          tracking_link: trackingLink,
          order_number: "order_123",
          date_purchased: "2026-06-17T12:00:00Z",
          subtotal: "40",
          total: "45",
          items: [
            {
              item_id: "ticket_1",
              name: "General Admission",
              quantity: 2,
            },
          ],
        },
        "req_123"
      )
    ).resolves.toMatchObject({ status: "purchase" });

    const contactInsert = getInsertFor(contacts);
    expect(contactInsert.values).toMatchObject({
      utmSource: "sunsetsvip",
      utmMedium: "linkinbio",
      utmCampaign: "sunsets_2026_07_04",
      utmContent: "buy_tickets_primary",
      utmTerm: "vip-table",
    });
    expect(contactInsert.conflict?.set).toMatchObject({
      utmSource: "sunsetsvip",
      utmMedium: "linkinbio",
      utmCampaign: "sunsets_2026_07_04",
      utmContent: "buy_tickets_primary",
      utmTerm: "vip-table",
    });
    expect(contactInsert.values?.metadata).not.toHaveProperty("attribution");

    const ticketOrderInsert = getInsertFor(ticketOrders);
    expect(ticketOrderInsert.values).toMatchObject({
      eventSlug: "campaign-july-four",
      utmSource: "sunsetsvip",
      utmCampaign: "sunsets_2026_07_04",
    });
    expect(ticketOrderInsert.conflict?.set).toMatchObject({
      eventSlug: "campaign-july-four",
      utmSource: "sunsetsvip",
      utmCampaign: "sunsets_2026_07_04",
    });
    expect(ticketOrderInsert.values?.rawPayload).toMatchObject({
      normalized: {
        eventSlug: "campaign-july-four",
        utmSource: "sunsetsvip",
        utmMedium: "linkinbio",
        utmCampaign: "sunsets_2026_07_04",
        utmContent: "buy_tickets_primary",
        utmTerm: "vip-table",
        refundCents: 0,
        refundKind: "none",
      },
    });
  });

  it("stores full refunds as zero net revenue with explicit refund metadata", async () => {
    await expect(
      persistPoshWebhookPurchase(
        {
          type: "order_status_update",
          status: "refunded",
          refunded: true,
          account_email: "fan@example.com",
          event_id: "evt_123",
          event_name: "Chasing Sunsets",
          event_start: "2026-08-22T18:00:00Z",
          order_number: "order_refunded",
          subtotal: "80",
          total: "90",
          items: [{ name: "General Admission", quantity: 2 }],
        },
        "req_refunded"
      )
    ).resolves.toMatchObject({ status: "refunded" });

    const ticketOrderInsert = getInsertFor(ticketOrders);
    expect(ticketOrderInsert.values).toMatchObject({
      quantity: 2,
      grossRevenue: 9000,
      netRevenue: 0,
    });
    expect(ticketOrderInsert.values?.rawPayload).toMatchObject({
      normalized: {
        status: "refunded",
        refundCents: 8000,
        refundKind: "full",
      },
    });
  });

  it("keeps remaining net revenue for a partial refund", async () => {
    await persistPoshWebhookPurchase(
      {
        type: "order_status_update",
        account_email: "fan@example.com",
        event_id: "evt_123",
        event_name: "Chasing Sunsets",
        event_start: "2026-08-22T18:00:00Z",
        order_number: "order_partial",
        subtotal: "80",
        total: "90",
        partialRefund: "20",
        items: [{ name: "General Admission", quantity: 2 }],
      },
      "req_partial"
    );

    const ticketOrderInsert = getInsertFor(ticketOrders);
    expect(ticketOrderInsert.values).toMatchObject({
      quantity: 2,
      netRevenue: 6000,
    });
    expect(ticketOrderInsert.values?.rawPayload).toMatchObject({
      normalized: {
        status: "refunded",
        refundCents: 2000,
        refundKind: "partial",
      },
    });
  });
});
