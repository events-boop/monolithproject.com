import { afterEach, describe, expect, it } from "vitest";
import { buildPublicSocialEchoPayload } from "../routes/social-echo";
import { createMethodNotAllowedHandler } from "../app";
import { createApiResponseHardening } from "../lib/request-hardening";
import { createRateLimitMiddleware } from "../services/rate-limit";
import { createWebhookAuthMiddleware } from "../middleware";
import { createAdminRouteGuard } from "../lib/admin-auth";
import { resolveOutboundDestination } from "../lib/outbound";

const originalPublicSocialEchoLive = process.env.PUBLIC_SOCIAL_ECHO_LIVE;

async function runRateLimitMiddleware(
  middleware: ReturnType<typeof createRateLimitMiddleware>
) {
  const headers = new Map<string, string>();
  let statusCode = 200;
  let jsonBody: unknown = null;
  let nextCalled = false;

  await new Promise<void>((resolve, reject) => {
    middleware(
      {
        ip: "203.0.113.10",
        socket: { remoteAddress: "203.0.113.10" },
        header: () => undefined,
      } as never,
      {
        setHeader(name: string, value: string) {
          headers.set(name.toLowerCase(), value);
          return this;
        },
        status(code: number) {
          statusCode = code;
          return this;
        },
        json(body: unknown) {
          jsonBody = body;
          resolve();
          return this;
        },
      } as never,
      (error?: unknown) => {
        if (error) {
          reject(error);
          return;
        }

        nextCalled = true;
        resolve();
      }
    );
  });

  return { headers, statusCode, jsonBody, nextCalled };
}

async function runMiddleware(
  middleware: any,
  reqOpts: { path: string; headers: Record<string, string>; method?: string }
) {
  const headers = new Map<string, string>();
  let statusCode = 200;
  let jsonBody: unknown = null;
  let nextCalled = false;

  await new Promise<void>((resolve) => {
    const req = {
      path: reqOpts.path,
      method: reqOpts.method || "POST",
      header: (name: string) => reqOpts.headers[name.toLowerCase()] || reqOpts.headers[name],
      headers: reqOpts.headers,
    };

    const res = {
      setHeader(name: string, value: string) {
        headers.set(name.toLowerCase(), value);
        return this;
      },
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: unknown) {
        jsonBody = body;
        resolve();
        return this;
      },
    };

    middleware(
      req as any,
      res as any,
      (error?: any) => {
        if (error) {
          resolve();
          return;
        }
        nextCalled = true;
        resolve();
      }
    );
  });

  return { headers, statusCode, jsonBody, nextCalled };
}

describe("api hardening", () => {
  afterEach(() => {
    process.env.PUBLIC_SOCIAL_ECHO_LIVE = originalPublicSocialEchoLive;
  });

  it("returns zero-state social echo data unless live exposure is explicitly enabled", async () => {
    delete process.env.PUBLIC_SOCIAL_ECHO_LIVE;
    const payload = buildPublicSocialEchoPayload({
      summary: {
        totalGoing: 240,
        totalPending: 30,
        liveEvents: 2,
      },
    });

    expect(payload).toMatchObject({
      ok: true,
      summary: {
        totalGoing: 0,
        totalPending: 0,
        liveEvents: 0,
      },
      events: [],
      activity: [],
    });
  });

  it("returns a JSON 405 envelope for wrong-method API requests", async () => {
    const handler = createMethodNotAllowedHandler(["POST"]);
    const headers = new Map<string, string>();
    let statusCode = 200;
    let jsonBody: unknown = null;

    const response = {
      setHeader(name: string, value: string) {
        headers.set(name.toLowerCase(), value);
      },
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(body: unknown) {
        jsonBody = body;
        return this;
      },
    };

    handler({} as never, response as never);

    const payload = jsonBody as {
      ok: boolean;
      requestId?: string;
      error?: {
        code?: string;
      };
    };

    expect(statusCode).toBe(405);
    expect(headers.get("allow")).toBe("POST");
    expect(payload.ok).toBe(false);
    expect(payload.error?.code).toBe("METHOD_NOT_ALLOWED");
    expect(typeof payload.requestId).toBe("string");
  });

  it("overrides API responses with a minimal JSON-only CSP", () => {
    const middleware = createApiResponseHardening();
    const headers = new Map<string, string>();

    middleware(
      {} as never,
      {
        setHeader(name: string, value: string) {
          headers.set(name.toLowerCase(), value);
        },
      } as never,
      () => undefined
    );

    expect(headers.get("content-security-policy")).toBe(
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
    );
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("strict-transport-security")).toBe(
      "max-age=31536000; includeSubDomains; preload"
    );
  });

  it("can skip rate limiting for health probes", () => {
    const middleware = createRateLimitMiddleware({
      scope: "api:global",
      windowMs: 60_000,
      limit: 1,
      message: "Rate limited",
      skip: req => req.path === "/health",
    });

    let nextCalled = false;
    middleware({ path: "/health" } as never, {} as never, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it("returns a 429 JSON envelope when the rate limit is exceeded", async () => {
    const middleware = createRateLimitMiddleware({
      scope: `api:test:${Date.now()}`,
      windowMs: 60_000,
      limit: 1,
      message: "Rate limited",
      preferMemory: true,
    });

    const first = await runRateLimitMiddleware(middleware);
    const second = await runRateLimitMiddleware(middleware);

    expect(first.nextCalled).toBe(true);
    expect(second.nextCalled).toBe(false);
    expect(second.statusCode).toBe(429);
    expect(second.headers.get("retry-after")).toBeTruthy();
    expect(second.jsonBody).toMatchObject({
      ok: false,
      error: {
        code: "RATE_LIMITED",
        message: "Rate limited",
        retryable: true,
      },
    });
    expect((second.jsonBody as { requestId?: string }).requestId).toEqual(
      expect.any(String)
    );
  });

  describe("Webhook Pre-Parser Authentication", () => {
    const originalWebhookSecret = process.env.POSH_WEBHOOK_SECRET;
    const originalLayloWebhookSecret = process.env.LAYLO_WEBHOOK_SECRET;

    afterEach(() => {
      process.env.POSH_WEBHOOK_SECRET = originalWebhookSecret;
      process.env.LAYLO_WEBHOOK_SECRET = originalLayloWebhookSecret;
    });

    it("rejects webhook request with 503 if secret is not configured", async () => {
      delete process.env.POSH_WEBHOOK_SECRET;
      const middleware = createWebhookAuthMiddleware();
      const result = await runMiddleware(middleware, {
        path: "/webhooks/posh",
        headers: { "Posh-Secret": "any-key" },
      });

      expect(result.nextCalled).toBe(false);
      expect(result.statusCode).toBe(503);
      expect(result.jsonBody).toMatchObject({
        ok: false,
        error: { code: "UNAVAILABLE" },
      });
    });

    it("rejects webhook request with 401 if signature is missing", async () => {
      process.env.POSH_WEBHOOK_SECRET = "super-secret";
      const middleware = createWebhookAuthMiddleware();
      const result = await runMiddleware(middleware, {
        path: "/webhooks/posh",
        headers: {},
      });

      expect(result.nextCalled).toBe(false);
      expect(result.statusCode).toBe(401);
      expect(result.jsonBody).toMatchObject({
        ok: false,
        error: { code: "INVALID_CREDENTIALS" },
      });
    });

    it("rejects webhook request with 401 if signature is invalid", async () => {
      process.env.POSH_WEBHOOK_SECRET = "super-secret";
      const middleware = createWebhookAuthMiddleware();
      const result = await runMiddleware(middleware, {
        path: "/webhooks/posh",
        headers: { "Posh-Secret": "wrong-secret" },
      });

      expect(result.nextCalled).toBe(false);
      expect(result.statusCode).toBe(401);
      expect(result.jsonBody).toMatchObject({
        ok: false,
        error: { code: "INVALID_CREDENTIALS" },
      });
    });

    it("accepts webhook request and passes to next if signature is valid", async () => {
      process.env.POSH_WEBHOOK_SECRET = "super-secret";
      const middleware = createWebhookAuthMiddleware();
      const result = await runMiddleware(middleware, {
        path: "/webhooks/posh",
        headers: { "Posh-Secret": "super-secret" },
      });

      expect(result.nextCalled).toBe(true);
    });

    it("accepts Laylo webhook requests with a valid shared secret", async () => {
      process.env.LAYLO_WEBHOOK_SECRET = "laylo-secret";
      const middleware = createWebhookAuthMiddleware();
      const result = await runMiddleware(middleware, {
        path: "/webhooks/laylo",
        headers: { "X-Laylo-Secret": "laylo-secret" },
      });

      expect(result.nextCalled).toBe(true);
    });

    it("rejects Laylo webhook requests with an invalid shared secret", async () => {
      process.env.LAYLO_WEBHOOK_SECRET = "laylo-secret";
      const middleware = createWebhookAuthMiddleware();
      const result = await runMiddleware(middleware, {
        path: "/webhooks/laylo",
        headers: { "X-Laylo-Secret": "wrong-secret" },
      });

      expect(result.nextCalled).toBe(false);
      expect(result.statusCode).toBe(401);
      expect(result.jsonBody).toMatchObject({
        ok: false,
        error: { code: "INVALID_CREDENTIALS" },
      });
    });

    it("ignores paths that are not provider webhooks", async () => {
      process.env.POSH_WEBHOOK_SECRET = "super-secret";
      const middleware = createWebhookAuthMiddleware();
      const result = await runMiddleware(middleware, {
        path: "/leads",
        headers: {},
      });

      expect(result.nextCalled).toBe(true);
    });
  });

  describe("Outbound redirect prototype lookup protection", () => {
    it("returns null or fallback for prototype property lookups like toString, __proto__, constructor", () => {
      expect(resolveOutboundDestination("tickets", "__proto__")).toBeNull();
      expect(resolveOutboundDestination("tickets", "toString")).toBeNull();
      expect(resolveOutboundDestination("tickets", "constructor")).toBeNull();
      expect(resolveOutboundDestination("media", "toString")).toBeNull();
      expect(resolveOutboundDestination("social", "valueOf")).toBeNull();
    });
  });

  describe("Admin / Auth boundaries", () => {
    const originalAdminSecret = process.env.OPS_ADMIN_SECRET;
    const originalNodeEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.OPS_ADMIN_SECRET = originalAdminSecret;
      process.env.NODE_ENV = originalNodeEnv;
    });

    it("rejects unauthenticated admin requests in production with 503 if secret is not set", async () => {
      delete process.env.OPS_ADMIN_SECRET;
      process.env.NODE_ENV = "production";
      const guard = createAdminRouteGuard({ scope: "ops" });
      const result = await runMiddleware(guard, {
        path: "/ops/baseline",
        headers: {},
        method: "GET",
      });

      expect(result.nextCalled).toBe(false);
      expect(result.statusCode).toBe(503);
      expect(result.jsonBody).toMatchObject({
        ok: false,
        error: { code: "UNAVAILABLE" },
      });
    });

    it("rejects unauthenticated admin requests in production with 401 if secret is set but missing in request", async () => {
      process.env.OPS_ADMIN_SECRET = "admin-secret";
      process.env.NODE_ENV = "production";
      const guard = createAdminRouteGuard({ scope: "ops" });
      const result = await runMiddleware(guard, {
        path: "/ops/baseline",
        headers: {},
        method: "GET",
      });

      expect(result.nextCalled).toBe(false);
      expect(result.statusCode).toBe(401);
      expect(result.jsonBody).toMatchObject({
        ok: false,
        error: { code: "INVALID_CREDENTIALS" },
      });
    });

    it("rejects unauthenticated admin requests with 401 if secret is incorrect", async () => {
      process.env.OPS_ADMIN_SECRET = "admin-secret";
      process.env.NODE_ENV = "production";
      const guard = createAdminRouteGuard({ scope: "ops" });
      const result = await runMiddleware(guard, {
        path: "/ops/baseline",
        headers: { "x-admin-secret": "wrong-secret" },
        method: "GET",
      });

      expect(result.nextCalled).toBe(false);
      expect(result.statusCode).toBe(401);
    });

    it("accepts admin requests with correct secret via header", async () => {
      process.env.OPS_ADMIN_SECRET = "admin-secret";
      process.env.NODE_ENV = "production";
      const guard = createAdminRouteGuard({ scope: "ops" });
      const result = await runMiddleware(guard, {
        path: "/ops/baseline",
        headers: { "x-admin-secret": "admin-secret" },
        method: "GET",
      });

      expect(result.nextCalled).toBe(true);
    });
  });
});
