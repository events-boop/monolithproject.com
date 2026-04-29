import { afterEach, describe, expect, it, vi } from "vitest";
import { subscribeBrevo } from "../providers/lead-providers";

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

    await expect(subscribeBrevo({
      email: "fan@example.com",
      consent: true,
      source: "newsletter_section",
    })).resolves.toBeUndefined();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bypasses Brevo without making an outbound request when BREVO_BYPASS is true", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    process.env.BREVO_API_KEY = "test-key";
    process.env.BREVO_BYPASS = "true";

    await expect(subscribeBrevo({
      email: "fan@example.com",
      consent: true,
      source: "newsletter_section",
    })).resolves.toBeUndefined();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses Brevo when the API key is present and bypass is off", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
    });
    vi.stubGlobal("fetch", fetchMock);
    process.env.BREVO_API_KEY = "test-key";
    process.env.BREVO_BYPASS = "false";

    await expect(subscribeBrevo({
      email: "fan@example.com",
      consent: true,
      source: "newsletter_section",
    })).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/contacts",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "api-key": "test-key",
        }),
      }),
    );
  });
});
