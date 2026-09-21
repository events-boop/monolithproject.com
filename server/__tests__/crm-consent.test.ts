// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTableName } from "drizzle-orm";
const writes = vi.hoisted(
  () => [] as Array<{ table: string; insert?: any; update?: any }>
);
vi.mock("../db/client", () => ({
  getDatabase: () => ({
    insert: (table: any) => {
      const write = { table: getTableName(table) } as (typeof writes)[number];
      writes.push(write);
      const chain: any = {
        values: (value: any) => {
          write.insert = value;
          return chain;
        },
        onConflictDoUpdate: (value: any) => {
          write.update = value.set;
          return chain;
        },
        returning: async () => [{ id: "test-id" }],
      };
      return chain;
    },
  }),
}));
import { persistLeadCapture } from "../services/crm-store";
import { leadSchema } from "../lib/schemas";
beforeEach(() => {
  writes.length = 0;
});
describe("channel consent persistence", () => {
  it("captures an email signup and phone without inventing or overwriting SMS consent", async () => {
    const lead = leadSchema.parse({
      email: "fan@example.com",
      phone: "+13125550123",
      consent: true,
    });
    const result = await persistLeadCapture({
      lead,
      provider: "brevo",
      idempotencyKey: "test",
      requestId: "test",
    });
    expect(result.contactId).toBe("test-id");
    const contact = writes.find(item => item.table === "contacts")!;
    expect(contact.insert.consentEmail).toBe(true);
    expect(contact.insert.consentSms).toBe(false);
    expect(contact.update).not.toHaveProperty("consentSms");
  });
  it.each([true, false])(
    "records an explicit SMS consent choice: %s",
    async smsConsent => {
      const lead = leadSchema.parse({
        email: "fan@example.com",
        phone: "+13125550123",
        consent: true,
        smsConsent,
      });
      await persistLeadCapture({
        lead,
        provider: "brevo",
        idempotencyKey: "test",
        requestId: "test",
      });
      const contact = writes.find(item => item.table === "contacts")!;
      expect(contact.insert.consentSms).toBe(smsConsent);
      expect(contact.update.consentSms).toBe(smsConsent);
      expect(
        writes.find(item => item.table === "form_submissions")?.insert
          .rawPayload.smsConsent
      ).toBe(smsConsent);
    }
  );
});
