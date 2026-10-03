// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
vi.mock("../db/client", () => ({
  getDatabase: () => null,
  hasDatabase: () => false,
}));
import { createApp } from "../app";

const nativeFetch = globalThis.fetch;
const originalEnv = { ...process.env };
const website = randomUUID(),
  release = randomUUID(),
  receipt = randomUUID();
const intakeUrl = `https://audience.example.test/api/website-capture/${website}`;
const upstream = vi.fn<typeof fetch>();
let server: Server,
  base: string,
  client = 0;
const payload = () => ({
  submissionId: randomUUID(),
  occurredAt: new Date().toISOString(),
  email: "synthetic@example.test",
  phone: "+13125550123",
  instagram: "@synthetic.fan",
  choices: { email: false, sms: true },
  honeypot: "",
  landingPage:
    "https://monolithproject.com/newsletter?utm_source=instagram&private=drop#section",
  referrer: "https://example.test/post?private=drop#section",
});
async function start(enabled = true) {
  process.env.AUDIENCE_SIGNUP_CONTROLLED_ENABLED = String(enabled);
  await new Promise<void>(resolve => {
    server = createApp({ includeSpa: false }).listen(0, "127.0.0.1", () => {
      base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      resolve();
    });
  });
}
function call(
  body: unknown = payload(),
  extra: Record<string, string> = {},
  method = "POST"
) {
  return nativeFetch(base + "/api/audience-signup", {
    method,
    headers: {
      origin: "https://monolithproject.com",
      "content-type": "application/json",
      "sec-fetch-site": "same-origin",
      "x-forwarded-host": "monolithproject.com",
      "x-forwarded-proto": "https",
      "x-forwarded-for": `192.0.2.${client}`,
      ...extra,
    },
    ...(method === "GET"
      ? {}
      : { body: typeof body === "string" ? body : JSON.stringify(body) }),
  });
}
beforeEach(() => {
  client++;
  process.env.TRUST_PROXY_HEADERS = "true";
  process.env.AUDIENCE_INTAKE_URL = intakeUrl;
  process.env.AUDIENCE_INTAKE_TOKEN = "synthetic-only-token-".repeat(3);
  process.env.AUDIENCE_RELEASE_ID = release;
  process.env.AUDIENCE_CONTROLLED_EMAIL = "synthetic@example.test";
  process.env.AUDIENCE_PAGE_PATH = "/newsletter";
  upstream.mockReset().mockImplementation(async () =>
    Response.json({
      status: "received_for_review",
      canonicalChanges: 0,
      receiptId: receipt,
      duplicate: false,
    })
  );
  vi.stubGlobal("fetch", upstream);
});
afterEach(async () => {
  if (server) await new Promise<void>(resolve => server.close(() => resolve()));
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
});
describe("installed controlled Audience OS route", () => {
  it("fails closed without explicit enablement", async () => {
    await start(false);
    const response = await call();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "SIGNUP_UNAVAILABLE" });
    expect(upstream).not.toHaveBeenCalled();
  });
  it("fails closed when enabled with incomplete configuration", async () => {
    delete process.env.AUDIENCE_INTAKE_TOKEN;
    await start();
    expect((await call()).status).toBe(503);
    expect(upstream).not.toHaveBeenCalled();
  });
  it("passes through only pinned scope and safe context with an honest raw acknowledgment", async () => {
    await start();
    const input = payload(),
      response = await call(input, {
        cookie: "private=drop",
        authorization: "Bearer browser-ignored",
      });
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      status: "received",
      submissionId: input.submissionId,
      duplicate: false,
    });
    expect(upstream).toHaveBeenCalledTimes(1);
    const [url, request] = upstream.mock.calls[0];
    expect(url).toBe(intakeUrl);
    expect(request?.headers).toEqual({
      Authorization: "Bearer " + process.env.AUDIENCE_INTAKE_TOKEN,
      "Content-Type": "application/json",
    });
    expect(JSON.parse(String(request?.body))).toEqual({
      releaseId: release,
      submissionId: input.submissionId,
      occurredAt: input.occurredAt,
      answers: {
        email: input.email,
        phone: input.phone,
        instagram: input.instagram,
      },
      choices: { email: false, sms: true },
      honeypot: "",
      landingPage:
        "https://monolithproject.com/newsletter?utm_source=instagram",
      referrer: "https://example.test/post",
    });
  });
  it("enforces existing middleware, canonical scope, method and bounded parser controls", async () => {
    await start();
    expect(
      (await call(payload(), { origin: "https://evil.example.test" })).status
    ).toBe(403);
    expect((await call(payload(), { origin: "" })).status).toBe(403);
    expect(
      (await call(payload(), { "sec-fetch-site": "cross-site" })).status
    ).toBe(403);
    expect(
      (await call(payload(), { "content-type": "text/plain" })).status
    ).toBe(415);
    expect(
      (await call({ ...payload(), email: "other@example.test" })).status
    ).toBe(403);
    expect(
      (
        await call({
          ...payload(),
          landingPage: "https://monolithproject.com/other",
        })
      ).status
    ).toBe(400);
    expect((await call({ ...payload(), honeypot: "bot" })).status).toBe(400);
    const method = await call(undefined, {}, "GET");
    expect(method.status).toBe(405);
    expect(method.headers.get("allow")).toBe("POST");
    const malformed = await call("{");
    expect(malformed.status).toBe(400);
    expect(await malformed.json()).toEqual({ error: "INVALID_SIGNUP" });
    const large = await call({ ...payload(), phone: "x".repeat(17000) });
    expect(large.status).toBe(413);
    expect(await large.json()).toEqual({ error: "BODY_TOO_LARGE" });
    expect(upstream).not.toHaveBeenCalled();
  });
  it("limits repeated attempts without forwarding or pretending success", async () => {
    await start(false);
    for (let i = 0; i < 10; i++) expect((await call()).status).toBe(503);
    const blocked = await call();
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(upstream).not.toHaveBeenCalled();
  });
  it("never acknowledges an upstream failure, rate limit or malformed receipt", async () => {
    await start();
    upstream.mockImplementationOnce(
      async () => new Response("private error", { status: 503 })
    );
    expect(await (await call()).json()).toEqual({
      error: "SIGNUP_NOT_RECORDED",
    });
    upstream.mockImplementationOnce(
      async () => new Response("private error", { status: 429 })
    );
    const limited = await call();
    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toBe("60");
    upstream.mockImplementationOnce(async () =>
      Response.json({ status: "subscribed", private: "drop" })
    );
    const malformed = await call();
    expect(malformed.status).toBe(503);
    expect(await malformed.json()).toEqual({ error: "SIGNUP_NOT_RECORDED" });
  });
});
