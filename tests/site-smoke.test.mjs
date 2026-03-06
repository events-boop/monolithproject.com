import assert from "node:assert/strict";
import { before, test } from "node:test";

import { __resetStores } from "../netlify/functions/_lib/security.js";
import {
  ensureBuildOutput,
  handlePreviewRequest
} from "../scripts/preview-site.mjs";

before(async () => {
  process.env.NODE_ENV = "test";
  process.env.EMAIL_DELIVERY_MODE = "log";
  delete process.env.TURNSTILE_SECRET_KEY;
  await ensureBuildOutput();
});

test.beforeEach(() => {
  __resetStores();
});

async function request(pathname, options = {}) {
  return handlePreviewRequest({
    url: pathname,
    headers: options.headers || {},
    method: options.method || "GET",
    body: options.body || ""
  });
}

test("core routes return 200", async () => {
  for (const pathname of [
    "/",
    "/events",
    "/radio",
    "/gallery",
    "/about",
    "/contact",
    "/privacy",
    "/terms"
  ]) {
    const response = await request(pathname);
    const body = Buffer.isBuffer(response.body)
      ? response.body.toString("utf8")
      : String(response.body);

    assert.equal(response.statusCode, 200, pathname);
    assert.match(body, /MONOLITH|Monolith/i, pathname);
  }
});

test("unknown route returns branded 404 page", async () => {
  const response = await request("/not-a-real-route");
  const body = Buffer.isBuffer(response.body)
    ? response.body.toString("utf8")
    : String(response.body);

  assert.equal(response.statusCode, 404);
  assert.match(body, /That page does not exist/i);
});

test("health check route returns configuration payload", async () => {
  const response = await request("/api/healthz");
  const payload = JSON.parse(String(response.body));

  assert.equal(response.statusCode, 200);
  assert.equal(payload.ok, true);
  assert.equal(typeof payload.checks.brevoConfigured, "boolean");
  assert.equal(typeof payload.checks.resendConfigured, "boolean");
});

test("contact endpoint accepts valid payload", async () => {
  const response = await request("/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Booking inquiry",
      message: "We want to talk about an upcoming event collaboration.",
      company: "",
      turnstileToken: ""
    })
  });

  const payload = JSON.parse(String(response.body));
  assert.equal(response.statusCode, 200);
  assert.equal(payload.ok, true);
});

test("join endpoint accepts valid payload", async () => {
  const response = await request("/api/join", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email: "jane@example.com",
      firstName: "Jane",
      source: "hero",
      company: "",
      turnstileToken: ""
    })
  });

  const payload = JSON.parse(String(response.body));
  assert.equal(response.statusCode, 200);
  assert.equal(payload.ok, true);
});

test("contact endpoint rejects invalid payload", async () => {
  const response = await request("/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      name: "",
      email: "bad-email",
      subject: "x",
      message: "short",
      company: "",
      turnstileToken: ""
    })
  });

  assert.equal(response.statusCode, 400);
});
