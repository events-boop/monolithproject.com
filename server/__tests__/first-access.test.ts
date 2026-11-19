// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FIRST_ACCESS_CONSENT_VERSION } from "@shared/first-access";
import { honeypotFieldName } from "../lib/honeypot";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  reachable: vi.fn(),
  available: vi.fn(),
  subscribe: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
  claim: vi.fn(),
  finish: vi.fn(),
  receipts: new Map<string, any>(),
}));
vi.mock("../providers/brevo", async importOriginal => ({
  ...(await importOriginal<typeof import("../providers/brevo")>()),
  brevoConfigured: mocks.configured,
  isBrevoListReachable: mocks.reachable,
  subscribeBrevoList: mocks.subscribe,
}));
vi.mock("../services/signup-capture", () => ({
  signupCaptureAvailable: mocks.available,
}));
vi.mock("../services/first-access-store", async importOriginal => ({
  ...(await importOriginal<typeof import("../services/first-access-store")>()),
  findFirstAccessReceipt: mocks.find,
  createFirstAccessReceipt: mocks.create,
  claimFirstAccessReceipt: mocks.claim,
  finishFirstAccessReceipt: mocks.finish,
}));
import {
  firstAccessAvailable,
  submitFirstAccess,
} from "../services/first-access";
import { firstAccessFingerprint } from "../services/first-access-store";
import { BrevoSubscriptionError } from "../providers/brevo";

const key = "operation-1234567890";
const payload = () => ({
  firstName: "  Alex  ",
  email: "  FAN@EXAMPLE.TEST  ",
  city: " Chicago ",
  interests: ["untold-story", "house-of-friends"],
  consent: true,
  adult: true,
  consentVersion: FIRST_ACCESS_CONSENT_VERSION,
});
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("LEAD_PROVIDER", "brevo");
  vi.stubEnv("BREVO_LIST_ID", "42");
  mocks.receipts.clear();
  mocks.configured.mockReturnValue(true);
  mocks.reachable.mockResolvedValue(true);
  mocks.available.mockResolvedValue(true);
  mocks.subscribe.mockResolvedValue(undefined);
  mocks.find.mockImplementation(async key => mocks.receipts.get(key) ?? null);
  mocks.create.mockImplementation(async (key, data, listId) => {
    if (!mocks.receipts.has(key))
      mocks.receipts.set(key, {
        id: key,
        fingerprint: firstAccessFingerprint(data),
        listId,
        details: structuredClone(data),
        status: "pending",
      });
    return mocks.receipts.get(key);
  });
  mocks.claim.mockImplementation(async id => {
    const receipt = mocks.receipts.get(id);
    if (receipt.status !== "pending") return null;
    receipt.status = "processing";
    return "lease-1";
  });
  mocks.finish.mockImplementation(async (id, _lease, status, result) => {
    const receipt = mocks.receipts.get(id);
    receipt.status = status;
    if (status !== "pending") receipt.response = result;
  });
});
afterEach(() => vi.unstubAllEnvs());

describe("First Access intake", () => {
  it("fails closed without an explicitly connected provider", async () => {
    vi.stubEnv("LEAD_PROVIDER", "disabled");
    expect(await firstAccessAvailable()).toBe(false);
    expect((await submitFirstAccess(payload(), key)).status).toBe(503);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });
  it("does not collect data while provider delivery cannot be verified", async () => {
    mocks.reachable.mockResolvedValue(false);
    expect((await submitFirstAccess(payload(), key)).status).toBe(503);
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("does not start provider delivery without durable storage", async () => {
    mocks.available.mockResolvedValue(false);
    expect(await firstAccessAvailable()).toBe(false);
    expect(mocks.reachable).not.toHaveBeenCalled();
    expect((await submitFirstAccess(payload(), key)).status).toBe(503);
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });
  it.each([
    { consent: false },
    { adult: false },
    { interests: [] },
    { interests: ["radio"] },
    { email: "invalid" },
    { consentVersion: "stale-disclosure" },
    { [honeypotFieldName]: "bot" },
  ])(
    "rejects invalid consent, stale disclosure, invalid interests, and bots: %j",
    async patch => {
      expect(
        (await submitFirstAccess({ ...payload(), ...patch }, key)).status
      ).toBe(400);
      expect(mocks.create).not.toHaveBeenCalled();
      expect(mocks.subscribe).not.toHaveBeenCalled();
    }
  );
  it("requires a bounded operation reference before accessing storage", async () => {
    for (const invalid of ["", "x", "x".repeat(129), "operation with spaces"])
      expect((await submitFirstAccess(payload(), invalid)).status).toBe(400);
    expect(mocks.find).not.toHaveBeenCalled();
  });
  it("preserves selected preferences and the matching disclosure without subscribing the radio audience", async () => {
    const result = await submitFirstAccess(payload(), key);
    expect(result.body).toMatchObject({ ok: true, state: "subscribed" });
    expect(mocks.create).toHaveBeenCalledWith(
      key,
      expect.objectContaining({
        email: "fan@example.test",
        firstName: "Alex",
        city: "Chicago",
        interests: ["untold-story", "house-of-friends"],
        consentVersion: FIRST_ACCESS_CONSENT_VERSION,
      }),
      42
    );
    expect(mocks.subscribe).toHaveBeenCalledExactlyOnceWith({
      email: "fan@example.test",
      firstName: "Alex",
      listId: 42,
      skipExistingSubscription: true,
    });
    expect(mocks.finish).toHaveBeenCalledWith(
      key,
      "lease-1",
      "success",
      result
    );
  });
  it("does not claim a subscription when only the receipt was saved", async () => {
    mocks.subscribe.mockRejectedValue(
      new BrevoSubscriptionError("DELIVERY_FAILED")
    );
    const result = await submitFirstAccess(payload(), key);
    expect(result.status).toBe(502);
    expect(result.body).toMatchObject({ ok: false, requestSaved: true });
    expect(mocks.receipts.get(key).status).toBe("pending");
  });
  it("replays success across requests without rechecking the provider", async () => {
    await submitFirstAccess(payload(), key);
    vi.stubEnv("LEAD_PROVIDER", "disabled");
    expect(await submitFirstAccess(payload(), key)).toMatchObject({
      status: 200,
      replayed: true,
      body: { state: "subscribed" },
    });
    expect(mocks.subscribe).toHaveBeenCalledTimes(1);
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
  it("rejects reusing a key for a changed payload without exposing the original details", async () => {
    await submitFirstAccess(payload(), key);
    const result = await submitFirstAccess(
      { ...payload(), email: "different@example.test" },
      key
    );
    expect(result.status).toBe(409);
    expect(JSON.stringify(result)).not.toContain("fan@example.test");
    expect(mocks.subscribe).toHaveBeenCalledTimes(1);
  });
  it("permits a real retry with the same key after a transient failure", async () => {
    mocks.subscribe.mockRejectedValueOnce(
      new BrevoSubscriptionError("DELIVERY_FAILED")
    );
    expect((await submitFirstAccess(payload(), key)).status).toBe(502);
    expect((await submitFirstAccess(payload(), key)).status).toBe(200);
    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.subscribe).toHaveBeenCalledTimes(2);
  });
  it("coordinates concurrent requests rather than delivering twice", async () => {
    let complete!: () => void;
    mocks.subscribe.mockImplementationOnce(
      () =>
        new Promise<void>(resolve => {
          complete = resolve;
        })
    );
    const first = submitFirstAccess(payload(), key);
    await vi.waitFor(() => expect(mocks.subscribe).toHaveBeenCalledTimes(1));
    expect(await submitFirstAccess(payload(), key)).toMatchObject({
      status: 409,
      body: { requestSaved: true, retryAfterSec: 2 },
    });
    complete();
    expect((await first).status).toBe(200);
    expect(mocks.subscribe).toHaveBeenCalledTimes(1);
  });
  it("stores a returning visitor's new preferences separately from prior consent", async () => {
    await submitFirstAccess(payload(), key);
    const original = structuredClone(mocks.receipts.get(key).details);
    await submitFirstAccess(
      { ...payload(), city: "Detroit", interests: ["chasing-sunsets"] },
      "operation-9876543210"
    );
    expect(mocks.receipts.size).toBe(2);
    expect(mocks.receipts.get(key).details).toEqual(original);
    expect(mocks.receipts.get("operation-9876543210").details.city).toBe(
      "Detroit"
    );
  });
  it("does not reactivate suppressed contacts on retry", async () => {
    mocks.subscribe.mockRejectedValue(new BrevoSubscriptionError("SUPPRESSED"));
    expect((await submitFirstAccess(payload(), key)).status).toBe(409);
    expect(await submitFirstAccess(payload(), key)).toMatchObject({
      status: 409,
      replayed: true,
    });
    expect(mocks.subscribe).toHaveBeenCalledTimes(1);
  });
  it("does not redirect a saved operation to a different configured audience", async () => {
    mocks.subscribe.mockRejectedValueOnce(
      new BrevoSubscriptionError("DELIVERY_FAILED")
    );
    await submitFirstAccess(payload(), key);
    vi.stubEnv("BREVO_LIST_ID", "43");
    expect((await submitFirstAccess(payload(), key)).status).toBe(503);
    expect(mocks.subscribe).toHaveBeenCalledTimes(1);
  });
  it("avoids provider delivery when saving the receipt fails", async () => {
    mocks.create.mockRejectedValue(new Error("private storage failure"));
    expect((await submitFirstAccess(payload(), key)).status).toBe(503);
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });
  it("preserves a confirmed subscription when recording its delivery state fails", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    mocks.finish.mockRejectedValue(new Error("private database error"));
    expect((await submitFirstAccess(payload(), key)).status).toBe(200);
    expect(warning).toHaveBeenCalledWith(
      "First Access delivery status needs reconciliation."
    );
    warning.mockRestore();
  });
});
