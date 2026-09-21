// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  brevoListId,
  subscribeBrevoList,
  isBrevoListReachable,
} from "../providers/brevo";
import {
  subscribeSunsets,
  sunsetsSubscriptionAvailability,
} from "../services/sunsets-subscriptions";
const original = { ...process.env };
const active = (listIds = [3]) => ({
  ok: true,
  json: async () => ({ emailBlacklisted: false, listIds }),
});
beforeEach(() => {
  process.env.BREVO_API_KEY = "test-key";
  process.env.BREVO_BYPASS = "false";
  process.env.SUNSETS_SIGNUP_PROVIDER = "brevo";
  process.env.SUNSETS_BREVO_EVENT_LIST_ID = "4";
  process.env.SUNSETS_BREVO_RADIO_LIST_ID = "5";
});
afterEach(() => {
  process.env = { ...original };
  vi.unstubAllGlobals();
});
describe("Brevo list delivery", () => {
  it("requires explicit positive list IDs", () => {
    for (const value of [
      undefined,
      "",
      "0",
      "-1",
      "1.5",
      "3abc",
      "9007199254740992",
    ])
      expect(brevoListId(value)).toBeNull();
    expect(brevoListId("3")).toBe(3);
  });
  it("upserts only the selected list and confirms membership", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, status: 201 })
      .mockResolvedValueOnce(active());
    vi.stubGlobal("fetch", fetch);
    await subscribeBrevoList({ email: " Fan@example.com ", listId: 3 });
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({
      email: "fan@example.com",
      listIds: [3],
      updateEnabled: true,
      attributes: {},
    });
    expect(fetch.mock.calls[2][0]).toContain("fan%40example.com");
  });
  it("preserves prior unsubscribes without updating the contact", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ emailBlacklisted: true, listIds: [3] }),
    });
    vi.stubGlobal("fetch", fetch);
    await expect(
      subscribeBrevoList({ email: "fan@example.com", listId: 3 })
    ).rejects.toMatchObject({ code: "SUPPRESSED" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it("never claims success after a failed verification or wrong list", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(active())
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce(active([9]));
    vi.stubGlobal("fetch", fetch);
    await expect(
      subscribeBrevoList({ email: "fan@example.com", listId: 3 })
    ).rejects.toMatchObject({ code: "DELIVERY_FAILED" });
  });
  it("does not bypass missing credentials or expose upstream errors", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValue(new Error("secret provider response"));
    vi.stubGlobal("fetch", fetch);
    await expect(
      subscribeBrevoList({ email: "fan@example.com", listId: 3 })
    ).rejects.toThrow("Brevo subscription delivery_failed");
    delete process.env.BREVO_API_KEY;
    fetch.mockClear();
    await expect(
      subscribeBrevoList({ email: "fan@example.com", listId: 3 })
    ).rejects.toMatchObject({ code: "UNAVAILABLE" });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("requires distinct configured Sunsets audiences", () => {
    expect(sunsetsSubscriptionAvailability()).toEqual({
      event: true,
      radio: true,
    });
    process.env.SUNSETS_BREVO_RADIO_LIST_ID = "4";
    expect(sunsetsSubscriptionAvailability()).toEqual({
      event: false,
      radio: false,
    });
  });
  it.each([
    ["event", 4],
    ["radio", 5],
  ] as const)(
    "subscribes %s without adding the other audience",
    async (audience, id) => {
      const fetch = vi.fn().mockResolvedValue(active([id]));
      vi.stubGlobal("fetch", fetch);
      const result = await subscribeSunsets({
        email: "fan@example.com",
        audience,
        consent: true,
      });
      expect(result.body).toMatchObject({ ok: true, state: "subscribed" });
      expect(JSON.parse(fetch.mock.calls[1][1].body).listIds).toEqual([id]);
    }
  );
  it("does not contact Brevo without consent", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(
      (
        await subscribeSunsets({
          email: "fan@example.com",
          audience: "event",
          consent: false,
        })
      ).status
    ).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
});

it("keeps forms closed when server credentials cannot reach Brevo", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: "Unauthorized" }),
    });
  vi.stubGlobal("fetch", fetch);
  expect(await isBrevoListReachable(98)).toBe(false);
  fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 99 }) });
  expect(await isBrevoListReachable(99)).toBe(true);
});
