// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const storage = vi.hoisted(() => ({
  available: true,
  rows: new Map<string, any>(),
  write: vi.fn(),
  read: vi.fn(),
}));
vi.mock("../db/client", () => ({
  getDatabase: () =>
    storage.available
      ? {
          insert: () => ({
            values: (row: any) => ({
              onConflictDoNothing: async () => {
                await storage.write();
                if (!storage.rows.has(row.id)) storage.rows.set(row.id, row);
              },
            }),
          }),
          select: () => ({ from: () => ({ limit: () => storage.read() }) }),
        }
      : null,
}));
import { saveSignupRequest } from "../services/signup-capture";
import {
  subscribeSunsets,
  checkedSunsetsSubscriptionAvailability,
} from "../services/sunsets-subscriptions";

beforeEach(() => {
  vi.stubEnv("SIGNUP_CAPTURE_MODE", "database");
  storage.available = true;
  storage.rows.clear();
  storage.write.mockReset().mockResolvedValue(undefined);
  storage.read.mockReset().mockResolvedValue([]);
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Unexpected provider request");
    })
  );
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const request = {
  email: " Fan@example.com ",
  audience: "event" as const,
  consent: true as const,
};
describe("durable pending signup capture", () => {
  it("persists explicit email consent and a pending state without calling a provider", async () => {
    const result = await subscribeSunsets(request);
    expect(result).toMatchObject({
      status: 200,
      body: { ok: true, state: "saved" },
    });
    const row = [...storage.rows.values()][0];
    expect(row).toMatchObject({
      email: "fan@example.com",
      providerStatus: "pending",
      metadata: {
        audience: "event",
        consent: true,
        channelConsent: { email: true, sms: false, whatsapp: false },
        consentVersion: "email-signup-2026-09-21",
        deliveryState: "awaiting_provider_sync",
      },
    });
    expect(Number.isNaN(Date.parse(row.metadata.consentRecordedAt))).toBe(
      false
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  it("does not acknowledge a request before the database acknowledges the write", async () => {
    let finish!: () => void;
    storage.write.mockImplementation(
      () =>
        new Promise<void>(resolve => {
          finish = resolve;
        })
    );
    let complete = false;
    const pending = subscribeSunsets(request).then(result => {
      complete = true;
      return result;
    });
    await Promise.resolve();
    expect(complete).toBe(false);
    finish();
    expect((await pending).body.state).toBe("saved");
  });
  it("deduplicates normalized addresses within each audience and preserves prior delivery state", async () => {
    const first = await saveSignupRequest(request);
    const original = storage.rows.get(first.id);
    original.providerStatus = "suppressed";
    const repeated = await saveSignupRequest({
      ...request,
      email: "fan@example.com",
      source: "another-form",
    });
    expect(repeated.id).toBe(first.id);
    expect(storage.rows.size).toBe(1);
    expect(storage.rows.get(first.id)).toBe(original);
    expect(original.providerStatus).toBe("suppressed");
    for (const audience of ["newsletter", "radio"] as const)
      await saveSignupRequest({ ...request, audience });
    expect(storage.rows.size).toBe(3);
    expect(
      [...storage.rows.values()].map(row => row.metadata.audience).sort()
    ).toEqual(["event", "newsletter", "radio"]);
  });
  it("rejects invalid consent and bots before storage or delivery", async () => {
    for (const invalid of [
      { ...request, consent: false },
      { ...request, email: "bad" },
      { ...request, website: "bot" },
      { ...request, audience: "all" },
    ])
      expect((await subscribeSunsets(invalid)).status).toBe(400);
    expect(storage.write).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("reports failure without exposing database details", async () => {
    storage.write.mockRejectedValue(new Error("private database credential"));
    const result = await subscribeSunsets(request);
    expect(result).toMatchObject({ status: 503, body: { ok: false } });
    expect(result.body).not.toHaveProperty("state");
    expect(JSON.stringify(result)).not.toContain("private database credential");
    expect(storage.rows.size).toBe(0);
  });
  it("keeps capture unavailable when the database is missing or unreadable", async () => {
    storage.available = false;
    expect(await checkedSunsetsSubscriptionAvailability()).toEqual({
      event: false,
      radio: false,
    });
    expect((await subscribeSunsets(request)).status).toBe(503);
    storage.available = true;
    storage.read.mockRejectedValue(new Error("unavailable"));
    expect(await checkedSunsetsSubscriptionAvailability()).toEqual({
      event: false,
      radio: false,
    });
    storage.read.mockResolvedValue([]);
    expect(await checkedSunsetsSubscriptionAvailability()).toEqual({
      event: true,
      radio: true,
    });
  });
});
