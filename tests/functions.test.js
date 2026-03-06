"use strict";

const assert = require("node:assert/strict");
const { mkdtemp, readFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const path = require("node:path");
const test = require("node:test");

const {
  handleContactSubmission,
  handleHealthCheck,
  handleJoinSubmission
} = require("../netlify/functions/_lib/forms");
const { __resetStores, checkRateLimit } = require("../netlify/functions/_lib/security");

function createEvent(body, overrides = {}) {
  const overrideHeaders = overrides.headers || {};
  return {
    httpMethod: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "198.51.100.10",
      ...overrideHeaders
    },
    body: JSON.stringify(body),
    ...overrides
  };
}

function restoreEnv(name, previousValue) {
  if (previousValue === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = previousValue;
}

test.beforeEach(() => {
  __resetStores();
});

test("healthz reports configuration state", async () => {
  const previousResend = process.env.RESEND_API_KEY;
  const previousBrevo = process.env.BREVO_API_KEY;
  const previousTurnstile = process.env.TURNSTILE_SECRET_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.BREVO_API_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;

  const response = handleHealthCheck();
  const payload = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(payload.ok, true);
  assert.equal(payload.checks.resendConfigured, false);
  assert.equal(payload.checks.brevoConfigured, false);
  assert.equal(payload.checks.turnstileConfigured, false);
  assert.equal(payload.checks.submissionStoreConfigured, false);

  restoreEnv("RESEND_API_KEY", previousResend);
  restoreEnv("BREVO_API_KEY", previousBrevo);
  restoreEnv("TURNSTILE_SECRET_KEY", previousTurnstile);
});

test("security store requires durable database config in production by default", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousRateLimitUrl = process.env.RATE_LIMIT_DATABASE_URL;
  const previousDatabaseUrl = process.env.DATABASE_URL;
  const previousDurableRequirement = process.env.REQUIRE_DURABLE_SECURITY_STORE;
  process.env.NODE_ENV = "production";
  delete process.env.RATE_LIMIT_DATABASE_URL;
  delete process.env.DATABASE_URL;
  delete process.env.REQUIRE_DURABLE_SECURITY_STORE;

  try {
    await assert.rejects(
      () => checkRateLimit("contact:198.51.100.10", { limit: 5, windowMs: 1000 }),
      /RATE_LIMIT_DATABASE_URL or DATABASE_URL must be configured/
    );
  } finally {
    restoreEnv("NODE_ENV", previousNodeEnv);
    restoreEnv("RATE_LIMIT_DATABASE_URL", previousRateLimitUrl);
    restoreEnv("DATABASE_URL", previousDatabaseUrl);
    restoreEnv("REQUIRE_DURABLE_SECURITY_STORE", previousDurableRequirement);
  }
});

test("contact submission succeeds with valid payload", async () => {
  const tempDir = await mkdtemp(path.join(tmpdir(), "monolith-contact-"));
  const storePath = path.join(tempDir, "submissions.ndjson");
  const response = await handleContactSubmission(
    createEvent({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Booking inquiry",
      message: "We want to book a summer event.",
      company: "",
      turnstileToken: "ok"
    }),
    {
      verifyTurnstile: async () => ({ ok: true }),
      sendEmail: async () => ({ id: "email_123" }),
      upsertBrevoContact: async () => ({ ok: true, skipped: false, id: 42 }),
      emailDeliveryMode: "log",
      submissionStorePath: storePath
    }
  );

  const payload = JSON.parse(response.body);
  const persisted = await readFile(storePath, "utf8");
  const record = JSON.parse(persisted.trim());
  assert.equal(response.statusCode, 200);
  assert.equal(payload.ok, true);
  assert.match(payload.requestId, /.+/);
  assert.equal(record.type, "contact_submission");
  assert.equal(record.email, "jane@example.com");
});

test("contact submission keeps succeeding when Brevo sync is skipped", async () => {
  const response = await handleContactSubmission(
    createEvent({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Booking inquiry",
      message: "We want to book a summer event.",
      company: "",
      turnstileToken: "ok"
    }),
    {
      verifyTurnstile: async () => ({ ok: true }),
      sendEmail: async () => ({ id: "email_123" }),
      emailDeliveryMode: "log"
    }
  );

  assert.equal(response.statusCode, 200);
});

test("contact submission rejects invalid payload", async () => {
  const response = await handleContactSubmission(
    createEvent({
      name: "J",
      email: "bad-email",
      subject: "Hi",
      message: "short",
      company: "",
      turnstileToken: "ok"
    }),
    {
      verifyTurnstile: async () => ({ ok: true })
    }
  );

  const payload = JSON.parse(response.body);
  assert.equal(response.statusCode, 400);
  assert.match(payload.error, /Name|Invalid email|Message/);
  assert.match(payload.requestId, /.+/);
});

test("contact submission rejects failed verification", async () => {
  const response = await handleContactSubmission(
    createEvent({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Booking inquiry",
      message: "We want to book a summer event.",
      company: "",
      turnstileToken: "bad"
    }),
    {
      verifyTurnstile: async () => ({ ok: false, error: "Verification failed." })
    }
  );

  assert.equal(response.statusCode, 403);
});

test("contact submission fails closed without turnstile secret in production", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousTurnstile = process.env.TURNSTILE_SECRET_KEY;
  const previousDurableRequirement = process.env.REQUIRE_DURABLE_SECURITY_STORE;
  process.env.NODE_ENV = "production";
  process.env.REQUIRE_DURABLE_SECURITY_STORE = "false";
  delete process.env.TURNSTILE_SECRET_KEY;

  try {
    const response = await handleContactSubmission(
      createEvent({
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Booking inquiry",
        message: "We want to book a summer event.",
        company: "",
        turnstileToken: "ok"
      })
    );

    const payload = JSON.parse(response.body);
    assert.equal(response.statusCode, 500);
    assert.equal(payload.error, "Turnstile is not configured.");
  } finally {
    restoreEnv("NODE_ENV", previousNodeEnv);
    restoreEnv("TURNSTILE_SECRET_KEY", previousTurnstile);
    restoreEnv("REQUIRE_DURABLE_SECURITY_STORE", previousDurableRequirement);
  }
});

test("contact submission rejects non-json content type", async () => {
  const response = await handleContactSubmission({
    httpMethod: "POST",
    headers: {
      "content-type": "text/plain"
    },
    body: "hello"
  });

  const payload = JSON.parse(response.body);
  assert.equal(response.statusCode, 415);
  assert.equal(payload.error, "Content-Type must be application/json.");
});

test("join submission succeeds and dedupes repeated requests", async () => {
  const tempDir = await mkdtemp(path.join(tmpdir(), "monolith-join-"));
  const storePath = path.join(tempDir, "submissions.ndjson");
  const baseEvent = createEvent({
    email: "jane@example.com",
    firstName: "Jane",
    source: "hero",
    company: "",
    turnstileToken: "ok"
  });

  const firstResponse = await handleJoinSubmission(baseEvent, {
    verifyTurnstile: async () => ({ ok: true }),
    upsertBrevoContact: async () => ({ ok: true, skipped: false, id: 11 }),
    emailDeliveryMode: "log",
    joinNotifyToEmail: "",
    submissionStorePath: storePath
  });

  const secondResponse = await handleJoinSubmission(baseEvent, {
    verifyTurnstile: async () => ({ ok: true }),
    upsertBrevoContact: async () => ({ ok: true, skipped: false, id: 11 }),
    emailDeliveryMode: "log",
    joinNotifyToEmail: "",
    submissionStorePath: storePath
  });

  const persisted = await readFile(storePath, "utf8");
  const lines = persisted.trim().split("\n").map((line) => JSON.parse(line));

  assert.equal(firstResponse.statusCode, 200);
  assert.equal(secondResponse.statusCode, 200);
  assert.equal(JSON.parse(secondResponse.body).message, "You are already on the list.");
  assert.equal(lines.length, 1);
  assert.equal(lines[0].type, "join_submission");
});

test("join submission fails when Brevo sync fails", async () => {
  const response = await handleJoinSubmission(
    createEvent({
      email: "jane@example.com",
      firstName: "Jane",
      source: "hero",
      company: "",
      turnstileToken: "ok"
    }),
    {
      verifyTurnstile: async () => ({ ok: true }),
      upsertBrevoContact: async () => {
        throw new Error("Brevo down");
      },
      emailDeliveryMode: "log",
      joinNotifyToEmail: ""
    }
  );

  const payload = JSON.parse(response.body);
  assert.equal(response.statusCode, 500);
  assert.equal(payload.error, "Unable to sync your signup right now.");
});

test("join submission allows retry after failed sync", async () => {
  const baseEvent = createEvent({
    email: "jane@example.com",
    firstName: "Jane",
    source: "hero",
    company: "",
    turnstileToken: "ok"
  });

  const failedResponse = await handleJoinSubmission(baseEvent, {
    verifyTurnstile: async () => ({ ok: true }),
    upsertBrevoContact: async () => {
      throw new Error("Brevo down");
    },
    emailDeliveryMode: "log",
    joinNotifyToEmail: ""
  });

  const retryResponse = await handleJoinSubmission(baseEvent, {
    verifyTurnstile: async () => ({ ok: true }),
    upsertBrevoContact: async () => ({ ok: true, skipped: false, id: 11 }),
    emailDeliveryMode: "log",
    joinNotifyToEmail: ""
  });

  const retryPayload = JSON.parse(retryResponse.body);
  assert.equal(failedResponse.statusCode, 500);
  assert.equal(retryResponse.statusCode, 200);
  assert.equal(retryPayload.message, "You are on the list.");
});

test("join submission fails closed without Brevo key in production", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousBrevoKey = process.env.BREVO_API_KEY;
  const previousDurableRequirement = process.env.REQUIRE_DURABLE_SECURITY_STORE;
  process.env.NODE_ENV = "production";
  process.env.REQUIRE_DURABLE_SECURITY_STORE = "false";
  delete process.env.BREVO_API_KEY;

  try {
    const response = await handleJoinSubmission(
      createEvent({
        email: "jane@example.com",
        firstName: "Jane",
        source: "hero",
        company: "",
        turnstileToken: "ok"
      }),
      {
        verifyTurnstile: async () => ({ ok: true }),
        emailDeliveryMode: "log",
        joinNotifyToEmail: ""
      }
    );

    const payload = JSON.parse(response.body);
    assert.equal(response.statusCode, 500);
    assert.equal(payload.error, "Unable to sync your signup right now.");
  } finally {
    restoreEnv("NODE_ENV", previousNodeEnv);
    restoreEnv("BREVO_API_KEY", previousBrevoKey);
    restoreEnv("REQUIRE_DURABLE_SECURITY_STORE", previousDurableRequirement);
  }
});

test("contact submission fails closed without email provider keys in production", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousResend = process.env.RESEND_API_KEY;
  const previousBrevo = process.env.BREVO_API_KEY;
  const previousProvider = process.env.EMAIL_PROVIDER;
  const previousDurableRequirement = process.env.REQUIRE_DURABLE_SECURITY_STORE;
  process.env.NODE_ENV = "production";
  process.env.REQUIRE_DURABLE_SECURITY_STORE = "false";
  delete process.env.RESEND_API_KEY;
  delete process.env.BREVO_API_KEY;
  delete process.env.EMAIL_PROVIDER;

  try {
    const response = await handleContactSubmission(
      createEvent({
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Booking inquiry",
        message: "We want to book a summer event.",
        company: "",
        turnstileToken: "ok"
      }),
      {
        verifyTurnstile: async () => ({ ok: true })
      }
    );

    const payload = JSON.parse(response.body);
    assert.equal(response.statusCode, 500);
    assert.equal(payload.error, "Unable to send your message right now.");
  } finally {
    restoreEnv("NODE_ENV", previousNodeEnv);
    restoreEnv("RESEND_API_KEY", previousResend);
    restoreEnv("BREVO_API_KEY", previousBrevo);
    restoreEnv("EMAIL_PROVIDER", previousProvider);
    restoreEnv("REQUIRE_DURABLE_SECURITY_STORE", previousDurableRequirement);
  }
});

test("contact submission fails closed without Brevo key when contact sync is enabled in production", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousBrevo = process.env.BREVO_API_KEY;
  const previousDurableRequirement = process.env.REQUIRE_DURABLE_SECURITY_STORE;
  process.env.NODE_ENV = "production";
  process.env.REQUIRE_DURABLE_SECURITY_STORE = "false";
  delete process.env.BREVO_API_KEY;

  try {
    const response = await handleContactSubmission(
      createEvent({
        name: "Jane Doe",
        email: "jane@example.com",
        subject: "Booking inquiry",
        message: "We want to book a summer event.",
        company: "",
        turnstileToken: "ok"
      }),
      {
        verifyTurnstile: async () => ({ ok: true }),
        sendEmail: async () => ({ id: "email_123" }),
        brevoContactSyncEnabled: true
      }
    );

    const payload = JSON.parse(response.body);
    assert.equal(response.statusCode, 500);
    assert.equal(payload.error, "Unable to process your message right now.");
  } finally {
    restoreEnv("NODE_ENV", previousNodeEnv);
    restoreEnv("BREVO_API_KEY", previousBrevo);
    restoreEnv("REQUIRE_DURABLE_SECURITY_STORE", previousDurableRequirement);
  }
});

test("join submission rejects honeypot spam", async () => {
  const response = await handleJoinSubmission(
    createEvent({
      email: "jane@example.com",
      firstName: "Jane",
      source: "hero",
      company: "Bot",
      turnstileToken: "ok"
    }),
    {
      verifyTurnstile: async () => ({ ok: true })
    }
  );

  assert.equal(response.statusCode, 400);
});

test("join submission rejects oversized body", async () => {
  const response = await handleJoinSubmission({
    httpMethod: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      email: "jane@example.com",
      firstName: "a".repeat(20000),
      source: "hero",
      company: "",
      turnstileToken: "ok"
    })
  });

  assert.equal(response.statusCode, 413);
});
