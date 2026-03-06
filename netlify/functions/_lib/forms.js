"use strict";

const { createHash } = require("node:crypto");

const {
  buildBrevoAttributes,
  parseListIds,
  upsertBrevoContact
} = require("./brevo");
const { sendEmail } = require("./email");
const {
  ensureJsonRequest,
  getClientIp,
  getRequestId,
  json,
  methodNotAllowed,
  parseJsonBody
} = require("./http");
const { persistSubmission } = require("./persistence");
const {
  checkRateLimit,
  hasRecentSignup,
  rememberSignup
} = require("./security");
const { verifyTurnstileToken } = require("./turnstile");
const {
  normalizeEmail,
  validateContactPayload,
  validateJoinPayload
} = require("./validation");

function logEvent(level, event, payload) {
  console.log(
    JSON.stringify({
      level,
      event,
      ...payload
    })
  );
}

function createResponse(statusCode, requestId, payload) {
  return json(
    statusCode,
    {
      requestId,
      ...payload
    },
    {
      "x-request-id": requestId
    }
  );
}

function hashIp(ip) {
  return createHash("sha256").update(ip).digest("hex");
}

function getSubmissionStorePath(overrides = {}) {
  return overrides.submissionStorePath ?? process.env.SUBMISSION_STORE_PATH ?? "";
}

function getBrevoConfig(overrides = {}) {
  return {
    apiKey: overrides.brevoApiKey ?? process.env.BREVO_API_KEY ?? "",
    joinListIds: parseListIds(
      overrides.brevoJoinListIds ?? process.env.BREVO_JOIN_LIST_IDS ?? ""
    ),
    contactListIds: parseListIds(
      overrides.brevoContactListIds ?? process.env.BREVO_CONTACT_LIST_IDS ?? ""
    ),
    joinFirstNameAttribute:
      overrides.brevoJoinFirstNameAttribute ??
      process.env.BREVO_JOIN_FIRSTNAME_ATTRIBUTE ??
      "",
    joinSourceAttribute:
      overrides.brevoJoinSourceAttribute ??
      process.env.BREVO_JOIN_SOURCE_ATTRIBUTE ??
      "",
    contactNameAttribute:
      overrides.brevoContactNameAttribute ??
      process.env.BREVO_CONTACT_NAME_ATTRIBUTE ??
      "",
    contactSubjectAttribute:
      overrides.brevoContactSubjectAttribute ??
      process.env.BREVO_CONTACT_SUBJECT_ATTRIBUTE ??
      "",
    contactSourceAttribute:
      overrides.brevoContactSourceAttribute ??
      process.env.BREVO_CONTACT_SOURCE_ATTRIBUTE ??
      "",
    contactSyncEnabled:
      overrides.brevoContactSyncEnabled ??
      process.env.BREVO_CONTACT_SYNC_ENABLED === "true"
  };
}

async function persistIfConfigured(record, overrides = {}) {
  try {
    return await (overrides.persistSubmission || persistSubmission)(
      record,
      getSubmissionStorePath(overrides)
    );
  } catch (error) {
    return { ok: false, error };
  }
}

async function syncJoinToBrevo(validationData, overrides = {}) {
  const brevo = getBrevoConfig(overrides);
  const attributes = buildBrevoAttributes({
    [brevo.joinFirstNameAttribute]: validationData.firstName,
    [brevo.joinSourceAttribute]: validationData.source || "site"
  });

  return (overrides.upsertBrevoContact || upsertBrevoContact)({
    apiKey: brevo.apiKey,
    email: validationData.email,
    listIds: brevo.joinListIds,
    attributes
  });
}

async function syncContactToBrevo(validationData, overrides = {}) {
  const brevo = getBrevoConfig(overrides);
  if (!brevo.contactSyncEnabled) {
    return { ok: true, skipped: true };
  }

  const attributes = buildBrevoAttributes({
    [brevo.contactNameAttribute]: validationData.name,
    [brevo.contactSubjectAttribute]: validationData.subject,
    [brevo.contactSourceAttribute]: "site_contact"
  });

  return (overrides.upsertBrevoContact || upsertBrevoContact)({
    apiKey: brevo.apiKey,
    email: validationData.email,
    listIds: brevo.contactListIds,
    attributes
  });
}

async function handleContactSubmission(event, overrides = {}) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  const requestId = getRequestId(event.headers);
  const requestCheck = ensureJsonRequest(event);
  if (!requestCheck.ok) {
    logEvent("warn", "contact.rejected", {
      requestId,
      reason: requestCheck.error
    });
    return createResponse(requestCheck.statusCode, requestId, {
      ok: false,
      error: requestCheck.error
    });
  }

  let payload;
  try {
    payload = parseJsonBody(event.body);
  } catch (error) {
    logEvent("warn", "contact.rejected", {
      requestId,
      reason: error.message
    });
    return createResponse(400, requestId, { ok: false, error: error.message });
  }

  const validation = validateContactPayload(payload);
  if (!validation.ok) {
    logEvent("warn", "contact.rejected", {
      requestId,
      reason: validation.error
    });
    return createResponse(400, requestId, { ok: false, error: validation.error });
  }

  const clientIp = getClientIp(event.headers);
  let rateLimit;
  try {
    rateLimit = await checkRateLimit(`contact:${clientIp}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000
    });
  } catch (error) {
    logEvent("error", "contact.rate_limit_failed", {
      requestId,
      error: error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to process your message right now."
    });
  }

  if (!rateLimit.ok) {
    logEvent("warn", "contact.rate_limited", {
      requestId,
      ip: clientIp
    });
    return createResponse(429, requestId, {
      ok: false,
      error: "Too many requests. Try again shortly."
    });
  }

  const turnstile = await (overrides.verifyTurnstile || verifyTurnstileToken)({
    token: validation.data.turnstileToken,
    remoteIp: clientIp,
    secretKey: overrides.turnstileSecretKey ?? process.env.TURNSTILE_SECRET_KEY
  });

  if (!turnstile.ok) {
    logEvent("warn", "contact.rejected", {
      requestId,
      reason: turnstile.error
    });
    return createResponse(turnstile.statusCode || 403, requestId, {
      ok: false,
      error: turnstile.error
    });
  }

  try {
    await (overrides.sendEmail || sendEmail)({
      apiKey: overrides.resendApiKey ?? process.env.RESEND_API_KEY,
      brevoApiKey: overrides.brevoApiKey ?? process.env.BREVO_API_KEY,
      emailProvider:
        overrides.emailProvider ?? process.env.EMAIL_PROVIDER ?? "",
      from:
        overrides.contactFromEmail ??
        process.env.CONTACT_FROM_EMAIL ??
        "notifications@send.monolithproject.com",
      to:
        overrides.contactToEmail ??
        process.env.CONTACT_TO_EMAIL ??
        "hello@monolithproject.com",
      subject: `[Monolith Contact] ${validation.data.subject}`,
      text: [
        `Name: ${validation.data.name}`,
        `Email: ${validation.data.email}`,
        "",
        validation.data.message
      ].join("\n"),
      replyTo: validation.data.email,
      mode: overrides.emailDeliveryMode ?? process.env.EMAIL_DELIVERY_MODE ?? "live"
    });
  } catch (error) {
    logEvent("error", "contact.email_failed", {
      requestId,
      error: error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to send your message right now."
    });
  }

  let brevoSync = { ok: true, skipped: true };
  try {
    brevoSync = await syncContactToBrevo(validation.data, overrides);
  } catch (error) {
    logEvent("error", "contact.brevo_sync_failed", {
      requestId,
      error: error.message
    });
    brevoSync = { ok: false, skipped: false, error };
  }

  if (!brevoSync.ok) {
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to process your message right now."
    });
  }

  const persistence = await persistIfConfigured(
    {
      type: "contact_submission",
      requestId,
      createdAt: new Date().toISOString(),
      email: validation.data.email,
      name: validation.data.name,
      subject: validation.data.subject,
      message: validation.data.message,
      ipHash: hashIp(clientIp)
    },
    overrides
  );

  if (!persistence.ok) {
    logEvent("error", "contact.persistence_failed", {
      requestId,
      error: persistence.error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Your message was received but could not be recorded safely."
    });
  }

  logEvent("info", "contact.submitted", {
    requestId,
    email: validation.data.email,
    ip: clientIp,
    persisted: !persistence.skipped,
    brevoSynced: !brevoSync.skipped
  });

  return createResponse(200, requestId, {
    ok: true,
    message: "Message received."
  });
}

async function handleJoinSubmission(event, overrides = {}) {
  if (event.httpMethod !== "POST") {
    return methodNotAllowed(["POST"]);
  }

  const requestId = getRequestId(event.headers);
  const requestCheck = ensureJsonRequest(event);
  if (!requestCheck.ok) {
    logEvent("warn", "join.rejected", {
      requestId,
      reason: requestCheck.error
    });
    return createResponse(requestCheck.statusCode, requestId, {
      ok: false,
      error: requestCheck.error
    });
  }

  let payload;
  try {
    payload = parseJsonBody(event.body);
  } catch (error) {
    logEvent("warn", "join.rejected", {
      requestId,
      reason: error.message
    });
    return createResponse(400, requestId, { ok: false, error: error.message });
  }

  const validation = validateJoinPayload(payload);
  if (!validation.ok) {
    logEvent("warn", "join.rejected", {
      requestId,
      reason: validation.error
    });
    return createResponse(400, requestId, { ok: false, error: validation.error });
  }

  const clientIp = getClientIp(event.headers);
  let rateLimit;
  try {
    rateLimit = await checkRateLimit(`join:${clientIp}`, {
      limit: 8,
      windowMs: 10 * 60 * 1000
    });
  } catch (error) {
    logEvent("error", "join.rate_limit_failed", {
      requestId,
      error: error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to process signup right now."
    });
  }

  if (!rateLimit.ok) {
    logEvent("warn", "join.rate_limited", {
      requestId,
      ip: clientIp
    });
    return createResponse(429, requestId, {
      ok: false,
      error: "Too many requests. Try again shortly."
    });
  }

  const turnstile = await (overrides.verifyTurnstile || verifyTurnstileToken)({
    token: validation.data.turnstileToken,
    remoteIp: clientIp,
    secretKey: overrides.turnstileSecretKey ?? process.env.TURNSTILE_SECRET_KEY
  });

  if (!turnstile.ok) {
    logEvent("warn", "join.rejected", {
      requestId,
      reason: turnstile.error
    });
    return createResponse(turnstile.statusCode || 403, requestId, {
      ok: false,
      error: turnstile.error
    });
  }

  const dedupeKey = `join:${normalizeEmail(validation.data.email)}`;
  const now = overrides.now ?? Date.now();
  let duplicateSignup = false;
  try {
    duplicateSignup = await hasRecentSignup(dedupeKey, 24 * 60 * 60 * 1000, now);
  } catch (error) {
    logEvent("error", "join.dedupe_check_failed", {
      requestId,
      error: error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to process signup right now."
    });
  }

  if (duplicateSignup) {
    logEvent("info", "join.duplicate", {
      requestId,
      email: validation.data.email,
      ip: clientIp
    });
    return createResponse(200, requestId, {
      ok: true,
      message: "You are already on the list."
    });
  }

  let brevoSync;
  try {
    brevoSync = await syncJoinToBrevo(validation.data, overrides);
  } catch (error) {
    logEvent("error", "join.brevo_sync_failed", {
      requestId,
      error: error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to sync your signup right now."
    });
  }

  if (!brevoSync.ok) {
    logEvent("error", "join.brevo_sync_failed", {
      requestId,
      error: brevoSync.error?.message || "Unknown Brevo sync error"
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to sync your signup right now."
    });
  }

  const joinNotifyTo =
    overrides.joinNotifyToEmail ?? process.env.JOIN_NOTIFY_TO_EMAIL ?? "";

  if (joinNotifyTo) {
    try {
      await (overrides.sendEmail || sendEmail)({
        apiKey: overrides.resendApiKey ?? process.env.RESEND_API_KEY,
        brevoApiKey: overrides.brevoApiKey ?? process.env.BREVO_API_KEY,
        emailProvider:
          overrides.emailProvider ?? process.env.EMAIL_PROVIDER ?? "",
        from:
          overrides.joinFromEmail ??
          process.env.JOIN_FROM_EMAIL ??
          "notifications@send.monolithproject.com",
        to: joinNotifyTo,
        subject: "[Monolith Join] New signup",
        text: [
          `Email: ${validation.data.email}`,
          `First name: ${validation.data.firstName || "-"}`,
          `Source: ${validation.data.source || "-"}`
        ].join("\n"),
        replyTo: validation.data.email,
        mode: overrides.emailDeliveryMode ?? process.env.EMAIL_DELIVERY_MODE ?? "live"
      });
    } catch (error) {
      logEvent("error", "join.email_failed", {
        requestId,
        error: error.message
      });
      return createResponse(500, requestId, {
        ok: false,
        error: "Unable to process signup right now."
      });
    }
  }

  const persistence = await persistIfConfigured(
    {
      type: "join_submission",
      requestId,
      createdAt: new Date(now).toISOString(),
      email: validation.data.email,
      firstName: validation.data.firstName,
      source: validation.data.source || "unknown",
      ipHash: hashIp(clientIp)
    },
    overrides
  );

  if (!persistence.ok) {
    logEvent("error", "join.persistence_failed", {
      requestId,
      error: persistence.error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Your signup was received but could not be recorded safely."
    });
  }

  try {
    await rememberSignup(dedupeKey, 24 * 60 * 60 * 1000, now);
  } catch (error) {
    logEvent("error", "join.dedupe_store_failed", {
      requestId,
      error: error.message
    });
    return createResponse(500, requestId, {
      ok: false,
      error: "Unable to finalize signup right now."
    });
  }

  logEvent("info", "join.submitted", {
    requestId,
    email: validation.data.email,
    source: validation.data.source || "unknown",
    ip: clientIp,
    persisted: !persistence.skipped,
    brevoSynced: !brevoSync.skipped
  });

  return createResponse(200, requestId, {
    ok: true,
    message: "You are on the list."
  });
}

function handleHealthCheck() {
  return json(200, {
    ok: true,
    checks: {
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      brevoConfigured: Boolean(process.env.BREVO_API_KEY),
      turnstileConfigured: Boolean(process.env.TURNSTILE_SECRET_KEY),
      submissionStoreConfigured: Boolean(process.env.SUBMISSION_STORE_PATH),
      brevoJoinListConfigured: parseListIds(process.env.BREVO_JOIN_LIST_IDS).length > 0
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  handleContactSubmission,
  handleHealthCheck,
  handleJoinSubmission
};
