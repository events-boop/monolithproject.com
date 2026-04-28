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

  it("does not require SPONSOR_SESSION_SECRET when sponsor access is disabled", () => {
    delete process.env.SPONSOR_SESSION_SECRET;
    delete process.env.SPONSOR_ACCESS_PASSWORD;
    process.env.NODE_ENV = "development";

    expect(() => validateEnvironment({ fatal: true })).not.toThrow();
  });

  it("throws under fatal: true when sponsor access has a password but no session secret", () => {
    process.env.SPONSOR_ACCESS_PASSWORD = "test-password";
    delete process.env.SPONSOR_SESSION_SECRET;

    expect(() => validateEnvironment({ fatal: true })).toThrow(
      /SPONSOR_SESSION_SECRET/,
    );
  });

  it("only warns under fatal: false when sponsor access is partially configured", () => {
    process.env.SPONSOR_ACCESS_PASSWORD = "test-password";
    delete process.env.SPONSOR_SESSION_SECRET;

    expect(() => validateEnvironment({ fatal: false })).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });

  it("does not throw when required vars are present", () => {
    process.env.SPONSOR_ACCESS_PASSWORD = "test-password";
    process.env.SPONSOR_SESSION_SECRET = "test-secret";
    process.env.NODE_ENV = "development";
    expect(() => validateEnvironment({ fatal: true })).not.toThrow();
  });

  it("does not throw in production when LEAD_PROVIDER is omitted (disabled default)", () => {
    process.env.NODE_ENV = "production";
    delete process.env.LEAD_PROVIDER;
    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_LIST_ID;
    expect(() => validateEnvironment({ fatal: true })).not.toThrow();
  });

  it("warns in production when OPS_ADMIN_SECRET is missing", () => {
    process.env.NODE_ENV = "production";
    delete process.env.OPS_ADMIN_SECRET;

    expect(() => validateEnvironment({ fatal: true })).not.toThrow();
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("OPS_ADMIN_SECRET"),
    );
  });

  it("throws in production under fatal: true when provider vars are missing", () => {
    process.env.NODE_ENV = "production";
    process.env.LEAD_PROVIDER = "mailchimp";
    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_LIST_ID;
    expect(() => validateEnvironment({ fatal: true })).toThrow(/mailchimp/);
  });
});
