import { afterEach, describe, expect, it } from "vitest";
import { buildPublicSocialEchoPayload } from "../routes/social-echo";
import { createMethodNotAllowedHandler } from "../app";
import { createApiResponseHardening } from "../lib/request-hardening";

const originalPublicSocialEchoLive = process.env.PUBLIC_SOCIAL_ECHO_LIVE;

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
      () => undefined,
    );

    expect(headers.get("content-security-policy")).toBe(
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    );
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("strict-transport-security")).toBe(
      "max-age=31536000; includeSubDomains; preload",
    );
  });
});
