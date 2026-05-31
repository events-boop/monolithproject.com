import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isMetaCapiEnabled, sendLeadConversion } from "../services/meta-capi";

// Precomputed SHA-256 hex of the *normalized* values, so a normalization
// regression (wrong casing/whitespace/digit stripping) fails the test.
const HASH = {
  email: "973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b", // test@example.com
  phone: "5e1d7077518a9f835aa3be3c418af68b51bd943cb11a4b25095159bb7f0e4752", // 13125550199
  city: "a2470c9d137c1c5d3567d1180a64cb43a9269c4d6f1ff13ac8cdbaf6fc5df3b7", // chicago
  state: "a0fb903525dc10dccaa4bd72bed4fe5b24ae8346b8a7343edce84172feb7085a", // il
  firstName: "fdee430d40bd57deeac186cd9790033d0f06f909a8806e7ce6e717ab7c7d5029", // ada
  lastName: "fb1e7ec987523d2cb9e022cec1d6ae7c99dc46edfae4fe51254025fe4bea571f", // lovelace
};

function lastRequestBody(fetchMock: ReturnType<typeof vi.fn>) {
  const [, init] = fetchMock.mock.calls.at(-1)!;
  return JSON.parse((init as RequestInit).body as string);
}

describe("meta capi", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.META_PIXEL_ID;
    delete process.env.META_GRAPH_API_VERSION;
    delete process.env.META_CAPI_TEST_EVENT_CODE;
    process.env.META_CAPI_ACCESS_TOKEN = "test-token";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("no-ops without making a request when no access token is configured", async () => {
    delete process.env.META_CAPI_ACCESS_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(isMetaCapiEnabled()).toBe(false);
    await sendLeadConversion({ eventId: "evt-1", email: "x@y.com" });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("hashes normalized PII and never sends raw identifiers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await sendLeadConversion({
      eventId: "evt-42",
      email: "  Test@Example.COM  ",
      phone: "+1 (312) 555-0199",
      firstName: "Ada",
      lastName: "Lovelace",
      city: "Chicago",
      state: "IL",
      eventSourceUrl: "https://monolithproject.com/sunsets",
      clientIp: "203.0.113.7",
      userAgent: "Mozilla/5.0 Test",
      fbp: "fb.1.123.456",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("/166134370742863/events"); // default pixel id
    expect(url).toContain("/v21.0/"); // default graph version

    const body = lastRequestBody(fetchMock);
    expect(body.access_token).toBe("test-token");

    const event = body.data[0];
    expect(event.event_name).toBe("Lead");
    expect(event.action_source).toBe("website");
    expect(event.event_id).toBe("evt-42");
    expect(event.event_source_url).toBe("https://monolithproject.com/sunsets");

    const ud = event.user_data;
    expect(ud.em).toEqual([HASH.email]);
    expect(ud.ph).toEqual([HASH.phone]);
    expect(ud.fn).toEqual([HASH.firstName]);
    expect(ud.ln).toEqual([HASH.lastName]);
    expect(ud.ct).toEqual([HASH.city]);
    expect(ud.st).toEqual([HASH.state]);
    expect(ud.client_ip_address).toBe("203.0.113.7");
    expect(ud.client_user_agent).toBe("Mozilla/5.0 Test");
    expect(ud.fbp).toBe("fb.1.123.456");

    // No raw PII anywhere in the serialized payload.
    const serialized = JSON.stringify(body).toLowerCase();
    expect(serialized).not.toContain("example.com");
    expect(serialized).not.toContain("lovelace");
    expect(serialized).not.toContain("3125550199");
  });

  it("reconstructs fbc from fbclid when no fbc cookie is present", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await sendLeadConversion({
      eventId: "evt-fbclid",
      email: "test@example.com",
      fbclid: "ABC123",
    });

    const { fbc } = lastRequestBody(fetchMock).data[0].user_data;
    expect(fbc).toMatch(/^fb\.1\.\d+\.ABC123$/);
  });

  it("passes through an explicit fbc cookie unchanged", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await sendLeadConversion({
      eventId: "evt-fbc",
      email: "test@example.com",
      fbc: "fb.1.999.EXISTING",
      fbclid: "SHOULD_BE_IGNORED",
    });

    expect(lastRequestBody(fetchMock).data[0].user_data.fbc).toBe(
      "fb.1.999.EXISTING"
    );
  });

  it("omits the ip field when the identifier is the 'unknown' sentinel", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await sendLeadConversion({
      eventId: "evt-unknown-ip",
      email: "test@example.com",
      clientIp: "unknown",
    });

    expect(
      lastRequestBody(fetchMock).data[0].user_data
    ).not.toHaveProperty("client_ip_address");
  });

  it("never throws when the network call rejects", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendLeadConversion({ eventId: "evt-err", email: "test@example.com" })
    ).resolves.toBeUndefined();
  });
});
