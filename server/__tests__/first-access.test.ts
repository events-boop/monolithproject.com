// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  reachable: vi.fn(),
  available: vi.fn(),
  save: vi.fn(),
  subscribe: vi.fn(),
  status: vi.fn(),
}));
vi.mock("../providers/brevo", async importOriginal => ({
  ...(await importOriginal<typeof import("../providers/brevo")>()),
  brevoConfigured: mocks.configured,
  isBrevoListReachable: mocks.reachable,
  subscribeBrevoList: mocks.subscribe,
}));
vi.mock("../services/signup-capture", () => ({
  signupCaptureAvailable: mocks.available,
  saveSignupRequest: mocks.save,
}));
vi.mock("../db/client", () => ({
  getDatabase: () => ({
    update: () => ({
      set: (value: unknown) => ({ where: () => mocks.status(value) }),
    }),
  }),
}));
import {
  firstAccessAvailable,
  submitFirstAccess,
} from "../services/first-access";
import { BrevoSubscriptionError } from "../providers/brevo";

const payload = () => ({
  firstName: "  Alex  ",
  email: "  FAN@EXAMPLE.TEST  ",
  city: " Chicago ",
  interests: ["untold-story", "house-of-friends"],
  consent: true,
  adult: true,
});
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("LEAD_PROVIDER", "brevo");
  vi.stubEnv("BREVO_LIST_ID", "42");
  mocks.configured.mockReturnValue(true);
  mocks.reachable.mockResolvedValue(true);
  mocks.available.mockResolvedValue(true);
  mocks.save.mockResolvedValue({ id: "signup_test", state: "saved" });
  mocks.subscribe.mockResolvedValue(undefined);
  mocks.status.mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());

describe("First Access intake", () => {
  it("fails closed without an explicitly connected provider", async () => {
    vi.stubEnv("LEAD_PROVIDER", "disabled");
    expect(await firstAccessAvailable()).toBe(false);
    const result = await submitFirstAccess(payload());
    expect(result.status).toBe(503);
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });
  it("does not collect data while provider delivery cannot be verified", async () => {
    mocks.reachable.mockResolvedValue(false);
    expect((await submitFirstAccess(payload())).status).toBe(503);
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it("does not start provider delivery without durable storage", async () => {
    mocks.available.mockResolvedValue(false);
    expect(await firstAccessAvailable()).toBe(false);
    expect(mocks.reachable).not.toHaveBeenCalled();
    expect((await submitFirstAccess(payload())).status).toBe(503);
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });
  it.each([
    { consent: false },
    { adult: false },
    { interests: [] },
    { interests: ["radio"] },
    { email: "invalid" },
    { website: "bot" },
  ])(
    "rejects missing consent, invalid interests, or bots before capture: %j",
    async patch => {
      expect((await submitFirstAccess({ ...payload(), ...patch })).status).toBe(
        400
      );
      expect(mocks.save).not.toHaveBeenCalled();
      expect(mocks.subscribe).not.toHaveBeenCalled();
    }
  );
  it("preserves selected interests and city without subscribing the music audience", async () => {
    const result = await submitFirstAccess(payload());
    expect(result.body).toMatchObject({ ok: true, state: "subscribed" });
    expect(mocks.save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "fan@example.test",
        firstName: "Alex",
        audience: "newsletter",
        consent: true,
        details: expect.objectContaining({
          city: "Chicago",
          interestTags: ["untold-story", "house-of-friends"],
        }),
      })
    );
    expect(mocks.subscribe).toHaveBeenCalledExactlyOnceWith({
      email: "fan@example.test",
      firstName: "Alex",
      listId: 42,
    });
    expect(mocks.status).toHaveBeenCalledWith({ providerStatus: "success" });
  });
  it("does not claim a subscription when only the receipt was saved", async () => {
    mocks.subscribe.mockRejectedValue(
      new BrevoSubscriptionError("DELIVERY_FAILED")
    );
    const result = await submitFirstAccess(payload());
    expect(result.status).toBe(502);
    expect(result.body).toMatchObject({ ok: false, requestSaved: true });
    expect(mocks.status).toHaveBeenCalledWith({ providerStatus: "pending" });
  });
  it("does not reactivate suppressed contacts", async () => {
    mocks.subscribe.mockRejectedValue(new BrevoSubscriptionError("SUPPRESSED"));
    const result = await submitFirstAccess(payload());
    expect(result.status).toBe(409);
    expect(result.body.ok).toBe(false);
    expect(mocks.status).toHaveBeenCalledWith({ providerStatus: "suppressed" });
  });
  it("avoids provider delivery when saving the request fails", async () => {
    mocks.save.mockRejectedValue(new Error("storage unavailable"));
    expect((await submitFirstAccess(payload())).status).toBe(503);
    expect(mocks.subscribe).not.toHaveBeenCalled();
  });
});
