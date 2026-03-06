"use strict";

const { randomUUID } = require("node:crypto");

function json(statusCode, payload, headers = {}) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers
    },
    body: JSON.stringify(payload)
  };
}

function getHeader(headers = {}, name) {
  return headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()];
}

function getRequestId(headers = {}) {
  return (
    getHeader(headers, "x-request-id") ||
    getHeader(headers, "x-correlation-id") ||
    randomUUID()
  );
}

function parseJsonBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "object") {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error("Request body must be valid JSON.");
  }
}

function methodNotAllowed(allowedMethods) {
  return json(
    405,
    { ok: false, error: "Method not allowed." },
    { allow: allowedMethods.join(", ") }
  );
}

function getClientIp(headers = {}) {
  const forwardedFor = getHeader(headers, "x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return (
    getHeader(headers, "x-nf-client-connection-ip") ||
    getHeader(headers, "client-ip") ||
    "unknown"
  );
}

function ensureJsonRequest(event, { maxBytes = 16 * 1024 } = {}) {
  const headers = event.headers || {};
  const method = event.httpMethod || "GET";

  if (method !== "POST" && method !== "PUT" && method !== "PATCH") {
    return { ok: true };
  }

  const contentType = String(getHeader(headers, "content-type") || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    return { ok: false, statusCode: 415, error: "Content-Type must be application/json." };
  }

  const body = typeof event.body === "string" ? event.body : JSON.stringify(event.body || {});
  const size = Buffer.byteLength(body, "utf8");

  if (size > maxBytes) {
    return {
      ok: false,
      statusCode: 413,
      error: "Request body is too large."
    };
  }

  return { ok: true };
}

module.exports = {
  getClientIp,
  getHeader,
  getRequestId,
  ensureJsonRequest,
  json,
  methodNotAllowed,
  parseJsonBody
};
