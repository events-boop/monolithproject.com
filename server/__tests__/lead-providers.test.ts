import { afterEach, describe, expect, it, vi } from "vitest";
import {
  shouldSyncLeadToLaylo,
  subscribeBrevo,
  subscribeLaylo,
} from "../providers/lead-providers";

describe("lead providers", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it("bypasses Brevo without making an outbound request when BREVO_API_KEY is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    delete process.env.BREVO_API_KEY;
    delete process.env.BREVO_BYPASS;

    await expect(
      subscribeBrevo({
        email: "fan@example.com",
        consent: true,
        source: "newsletter_section",
      })
    ).resolves.toBeUndefined();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bypasses Brevo without making an outbound request when BREVO_BYPASS is true", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    process.env.BREVO_API_KEY = "test-key";
    process.env.BREVO_BYPASS = "true";

    await expect(
      subscribeBrevo({
        email: "fan@example.com",
        consent: true,
        source: "newsletter_section",
      })
    ).resolves.toBeUndefined();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses Brevo when the API key is present and bypass is off", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);
    process.env.BREVO_API_KEY = "test-key";
    process.env.BREVO_BYPASS = "false";

    await expect(
      subscribeBrevo({
        email: "fan@example.com",
        consent: true,
        source: "newsletter_section",
      })
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/contacts",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "api-key": "test-key",
        }),
      })
    );
  });

  it("bypasses Laylo without making an outbound request when the API token is missing", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    delete process.env.LAYLO_API_TOKEN;
    delete process.env.LAYLO_API_KEY;
    delete process.env.LAYLO_BYPASS;

    await expect(
      subscribeLaylo({
        email: "fan@example.com",
        consent: true,
        source: "sunsets_lake_list",
        interestTags: ["laylo", "lake_list"],
      })
    ).resolves.toBeUndefined();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("detects Laylo-relevant lead submissions", () => {
    expect(
      shouldSyncLeadToLaylo({
        email: "fan@example.com",
        consent: true,
        source: "sunsets_lake_list",
        formType: "lake_list_signup",
        interestTags: ["first_access_signup"],
      })
    ).toBe(true);

    expect(
      shouldSyncLeadToLaylo({
        email: "fan@example.com",
        consent: true,
        source: "newsletter_section",
        interestTags: ["newsletter"],
      })
    ).toBe(false);
  });

  it("sends Laylo signups to the GraphQL API when configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { subscribeToUser: true } }),
    });
    vi.stubGlobal("fetch", fetchMock);
    process.env.LAYLO_API_TOKEN = "laylo-test-token";
    delete process.env.LAYLO_API_KEY;
    delete process.env.LAYLO_BYPASS;
    delete process.env.LAYLO_API_URL;

    await expect(
      subscribeLaylo({
        email: "Fan@Example.com",
        phone: "(312) 555-1212",
        consent: true,
        source: "sunsets_lake_list",
        interestTags: ["laylo", "lake_list"],
      })
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://laylo.com/api/graphql",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer laylo-test-token",
        }),
      })
    );

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.query).toContain("subscribeToUser");
    expect(body.variables).toEqual({
      email: "fan@example.com",
      phoneNumber: "+13125551212",
    });
  });

  it("fails Laylo sync when GraphQL returns errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ errors: [{ message: "Invalid phone number" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    process.env.LAYLO_API_TOKEN = "laylo-test-token";
    delete process.env.LAYLO_BYPASS;

    await expect(
      subscribeLaylo({
        email: "fan@example.com",
        consent: true,
        source: "sunsets_lake_list",
        interestTags: ["laylo"],
      })
    ).rejects.toThrow("Laylo subscription failed");
  });
});
