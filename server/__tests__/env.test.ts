import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { validateEnvironment } from "../lib/env";

describe("validateEnvironment", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("throws under fatal: true when SPONSOR_SESSION_SECRET is missing", () => {
    delete process.env.SPONSOR_SESSION_SECRET;
    expect(() => validateEnvironment({ fatal: true })).toThrow(
      /SPONSOR_SESSION_SECRET/,
    );
  });

  it("only warns under fatal: false when SPONSOR_SESSION_SECRET is missing", () => {
    delete process.env.SPONSOR_SESSION_SECRET;
    expect(() => validateEnvironment({ fatal: false })).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });

  it("does not throw when required vars are present", () => {
    process.env.SPONSOR_SESSION_SECRET = "test-secret";
    process.env.NODE_ENV = "development";
    expect(() => validateEnvironment({ fatal: true })).not.toThrow();
  });

  it("throws in production under fatal: true when provider vars are missing", () => {
    process.env.SPONSOR_SESSION_SECRET = "test-secret";
    process.env.NODE_ENV = "production";
    process.env.LEAD_PROVIDER = "mailchimp";
    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_LIST_ID;
    expect(() => validateEnvironment({ fatal: true })).toThrow(/mailchimp/);
  });
});
