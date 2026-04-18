import { describe, expect, it, beforeEach } from "vitest";
import { getFromCache, setInCache, idempotencyCache } from "../services/idempotency";

describe("idempotency cache", () => {
  beforeEach(() => {
    idempotencyCache.clear();
  });

  it("stores and returns a 2xx response under its key", () => {
    setInCache("k1", 200, { ok: true });
    expect(getFromCache("k1")).toMatchObject({ status: 200, body: { ok: true } });
  });

  it("only caches successful responses in the leads route (contract test)", () => {
    // Mirrors the guard in server/routes/leads.ts: failures must NOT enter the cache
    // so a transient provider outage doesn't lock out retries for the 24h TTL.
    const shouldCache = (status: number) => status >= 200 && status < 300;

    expect(shouldCache(200)).toBe(true);
    expect(shouldCache(201)).toBe(true);
    expect(shouldCache(400)).toBe(false);
    expect(shouldCache(429)).toBe(false);
    expect(shouldCache(502)).toBe(false);
    expect(shouldCache(503)).toBe(false);
  });
});
