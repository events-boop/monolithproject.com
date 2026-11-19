// @vitest-environment node
import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { honeypotFieldName } from "../lib/honeypot";

const mocks = vi.hoisted(() => ({
  submit: vi.fn(),
  available: vi.fn(),
  database: true,
  failure: false,
  buckets: new Map<string, { count: number; resetAt: string }>(),
}));
vi.mock("../services/first-access", () => ({
  submitFirstAccess: mocks.submit,
  firstAccessAvailable: mocks.available,
}));
vi.mock("../db/client", () => ({
  getDatabase: () =>
    mocks.database
      ? {
          insert: () => ({
            values: (row: any) => ({
              onConflictDoUpdate: () => ({
                returning: async () => {
                  if (mocks.failure) throw new Error("private database detail");
                  const previous = mocks.buckets.get(row.key);
                  const count =
                    previous && Date.parse(previous.resetAt) > Date.now()
                      ? previous.count + 1
                      : 1;
                  const result = {
                    count,
                    resetAt: previous?.resetAt ?? row.resetAt,
                  };
                  mocks.buckets.set(row.key, result);
                  return [result];
                },
              }),
            }),
          }),
        }
      : null,
}));
import firstAccessRouter from "../routes/first-access";

let server: Server;
let base: string;
beforeAll(async () => {
  const app = express();
  app.use(express.json());
  app.use(firstAccessRouter);
  await new Promise<void>(resolve => {
    server = app.listen(0, "127.0.0.1", () => {
      base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      resolve();
    });
  });
});
afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close(error => (error ? reject(error) : resolve()))
  );
});
beforeEach(() => {
  vi.clearAllMocks();
  mocks.database = true;
  mocks.failure = false;
  mocks.buckets.clear();
  mocks.available.mockResolvedValue(true);
  mocks.submit.mockResolvedValue({
    status: 200,
    body: { ok: true, state: "subscribed", message: "Confirmed" },
  });
});
const post = (body: unknown = { email: "fan@example.test" }) =>
  fetch(base + "/api/first-access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": "operation-1234567890",
    },
    body: JSON.stringify(body),
  });

describe("First Access HTTP contract and durable limiting", () => {
  it("passes the operation header to the service and exposes durable replay", async () => {
    mocks.submit.mockResolvedValueOnce({
      status: 200,
      replayed: true,
      body: { ok: true, state: "subscribed" },
    });
    const response = await post();
    expect(response.status).toBe(200);
    expect(response.headers.get("X-Idempotent-Replay")).toBe("true");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.submit).toHaveBeenCalledWith(
      { email: "fan@example.test" },
      "operation-1234567890"
    );
    expect(mocks.buckets.size).toBe(2);
    expect(Array.from(mocks.buckets.keys()).join(" ")).not.toContain(
      "fan@example.test"
    );
  });
  it("acknowledges a filled decoy without a subscription state or service call", async () => {
    const response = await post({
      email: "fan@example.test",
      [honeypotFieldName]: "bot",
    });
    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({
      ok: true,
      state: "accepted",
    });
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it("returns the retry interval for an operation still in flight", async () => {
    mocks.submit.mockResolvedValueOnce({
      status: 409,
      body: { ok: false, requestSaved: true, retryAfterSec: 2 },
    });
    const response = await post();
    expect(response.status).toBe(409);
    expect(response.headers.get("Retry-After")).toBe("2");
  });
  it("does not lock out a ninth different person on a shared connection", async () => {
    for (let i = 0; i < 9; i++)
      expect((await post({ email: `fan${i}@example.test` })).status).toBe(200);
  });
  it("limits normalized addresses across requests with Retry-After", async () => {
    for (let i = 0; i < 8; i++)
      expect(
        (
          await post({
            email: i % 2 ? " FAN@example.test " : "fan@example.test",
          })
        ).status
      ).toBe(200);
    const response = await post();
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(mocks.submit).toHaveBeenCalledTimes(8);
  });
  it.each(["missing", "failed"])(
    "does not fall back to instance memory when rate storage is %s",
    async failure => {
      mocks.database = failure !== "missing";
      mocks.failure = failure === "failed";
      const response = await post();
      expect(response.status).toBe(503);
      expect(response.headers.get("Retry-After")).toBe("30");
      expect(await response.json()).toMatchObject({
        ok: false,
        error: { code: "RATE_LIMIT_UNAVAILABLE" },
      });
      expect(mocks.submit).not.toHaveBeenCalled();
    }
  );
});
