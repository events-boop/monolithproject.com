// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import {
  FIRST_ACCESS_ADULT_CONFIRMATION,
  FIRST_ACCESS_CONSENT_VERSION,
  FIRST_ACCESS_EMAIL_CONSENT,
} from "@shared/first-access";

const storage = vi.hoisted(() => ({
  available: true,
  rows: new Map<string, any>(),
  values: vi.fn(),
  update: vi.fn(),
  condition: vi.fn(),
  returning: vi.fn(),
}));
vi.mock("../db/client", () => ({
  getDatabase: () =>
    storage.available
      ? {
          insert: () => ({
            values: (row: any) => ({
              onConflictDoNothing: async () => {
                storage.values(row);
                if (!storage.rows.has(row.id)) storage.rows.set(row.id, row);
              },
            }),
          }),
          select: () => ({
            from: () => ({
              where: (condition: unknown) => ({
                limit: () => {
                  const query = new PgDialect().sqlToQuery(condition as never);
                  const row = storage.rows.get(String(query.params[0]));
                  return row ? [row] : [];
                },
              }),
            }),
          }),
          update: () => ({
            set: (value: unknown) => {
              storage.update(value);
              return {
                where: (condition: unknown) => {
                  storage.condition(condition);
                  return { returning: storage.returning };
                },
              };
            },
          }),
        }
      : null,
}));
import {
  claimFirstAccessReceipt,
  createFirstAccessReceipt,
  findFirstAccessReceipt,
  finishFirstAccessReceipt,
  firstAccessFingerprint,
  firstAccessReceiptId,
} from "../services/first-access-store";

const key = "operation-1234567890";
const details = () => ({
  email: "fan@example.test",
  firstName: "Alex",
  city: "Chicago",
  interests: ["untold-story"],
  consentVersion: FIRST_ACCESS_CONSENT_VERSION,
});
beforeEach(() => {
  vi.clearAllMocks();
  storage.available = true;
  storage.rows.clear();
  storage.returning.mockResolvedValue([{ id: firstAccessReceiptId(key) }]);
});

describe("durable First Access receipts", () => {
  it("stores exact consent evidence and preferences without replacing earlier receipts", async () => {
    const first = await createFirstAccessReceipt(key, details(), 42);
    const original = structuredClone(storage.rows.get(first.id));
    const changed = {
      ...details(),
      city: "Detroit",
      interests: ["house-of-friends"],
    };
    await createFirstAccessReceipt(key, changed, 42);
    expect(storage.rows.get(first.id)).toEqual(original);
    await createFirstAccessReceipt("operation-9876543210", changed, 42);
    expect(storage.rows.size).toBe(2);
    expect(original.metadata).toMatchObject({
      consentVersion: FIRST_ACCESS_CONSENT_VERSION,
      consentText: FIRST_ACCESS_EMAIL_CONSENT,
      adultConfirmation: FIRST_ACCESS_ADULT_CONFIRMATION,
      adultConfirmed: true,
      channelConsent: { email: true, sms: false, whatsapp: false },
      city: "Chicago",
      interestTags: ["untold-story"],
      providerListId: 42,
    });
    expect(Date.parse(original.metadata.consentRecordedAt)).toBeGreaterThan(0);
    expect(original.providerStatus).toBe("pending");
  });

  it("hashes operation references and canonicalizes preference order", () => {
    expect(firstAccessReceiptId(key)).not.toContain(key);
    expect(
      firstAccessFingerprint({
        ...details(),
        interests: ["untold-story", "house-of-friends", "untold-story"],
      })
    ).toBe(
      firstAccessFingerprint({
        ...details(),
        interests: ["house-of-friends", "untold-story"],
      })
    );
  });

  it("claims delivery with one conditional database UPDATE and an expiring lease", async () => {
    const lease = await claimFirstAccessReceipt(firstAccessReceiptId(key));
    expect(lease).toEqual(expect.any(String));
    expect(storage.update).toHaveBeenCalledTimes(1);
    const dialect = new PgDialect();
    const condition = dialect.sqlToQuery(storage.condition.mock.calls[0][0]);
    expect(condition.sql).toContain("'pending'");
    expect(condition.sql).toContain("'processing'");
    expect(condition.sql).toContain("'leaseExpiresAt')::timestamptz <= now()");
    expect(condition.params).toContain(firstAccessReceiptId(key));
    const metadata = dialect.sqlToQuery(
      storage.update.mock.calls[0][0].metadata
    );
    expect(metadata.sql).toContain("now() + interval '60 seconds'");
    expect(metadata.params).toContain(lease);
    storage.returning.mockResolvedValueOnce([]);
    expect(await claimFirstAccessReceipt(firstAccessReceiptId(key))).toBeNull();
  });

  it("can finish only the owned lease and merges status without replacing consent", async () => {
    const result = {
      status: 200,
      body: { ok: true, state: "subscribed", message: "Confirmed" },
    };
    await finishFirstAccessReceipt(
      firstAccessReceiptId(key),
      "lease-owner",
      "success",
      result
    );
    const dialect = new PgDialect();
    const condition = dialect.sqlToQuery(storage.condition.mock.calls[0][0]);
    expect(condition.params).toEqual([
      firstAccessReceiptId(key),
      "processing",
      "lease-owner",
    ]);
    expect(condition.sql).toContain("'leaseId'");
    const metadata = dialect.sqlToQuery(
      storage.update.mock.calls[0][0].metadata
    );
    expect(metadata.sql).toContain("- 'leaseId' - 'leaseExpiresAt'");
    const update = JSON.parse(String(metadata.params[0]));
    expect(update.completedResponse).toEqual(result);
    expect(update).not.toHaveProperty("consentRecordedAt");
    storage.returning.mockResolvedValueOnce([]);
    await expect(
      finishFirstAccessReceipt(
        firstAccessReceiptId(key),
        "stale-owner",
        "success",
        result
      )
    ).rejects.toThrow("no longer owned");
  });

  it("does not cache a transient provider failure as a terminal result", async () => {
    await finishFirstAccessReceipt(
      firstAccessReceiptId(key),
      "owner",
      "pending",
      {
        status: 502,
        body: { ok: false, message: "Please retry" },
      }
    );
    const metadata = new PgDialect().sqlToQuery(
      storage.update.mock.calls[0][0].metadata
    );
    expect(JSON.parse(String(metadata.params[0]))).not.toHaveProperty(
      "completedResponse"
    );
    expect(storage.update.mock.calls[0][0].providerStatus).toBe("pending");
  });

  it("fails closed when storage is unavailable", async () => {
    storage.available = false;
    await expect(findFirstAccessReceipt(key)).rejects.toThrow("unavailable");
    await expect(createFirstAccessReceipt(key, details(), 42)).rejects.toThrow(
      "unavailable"
    );
    await expect(
      claimFirstAccessReceipt(firstAccessReceiptId(key))
    ).rejects.toThrow("unavailable");
  });
});
