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
      },
    });
  });
});
