"use strict";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function cleanString(value) {
  return String(value || "").trim();
}

function validateContactPayload(payload) {
  const name = cleanString(payload.name);
  const email = normalizeEmail(payload.email);
  const subject = cleanString(payload.subject);
  const message = cleanString(payload.message);
  const company = cleanString(payload.company);
  const turnstileToken = cleanString(payload.turnstileToken);

  if (company) {
    return { ok: false, error: "Spam detected." };
  }

  if (name.length < 2 || name.length > 100) {
    return { ok: false, error: "Name must be between 2 and 100 characters." };
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return { ok: false, error: "Invalid email address." };
  }

  if (subject.length < 3 || subject.length > 120) {
    return { ok: false, error: "Subject must be between 3 and 120 characters." };
  }

  if (message.length < 10 || message.length > 4000) {
    return { ok: false, error: "Message must be between 10 and 4000 characters." };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      subject,
      message,
      turnstileToken
    }
  };
}

function validateJoinPayload(payload) {
  const email = normalizeEmail(payload.email);
  const firstName = cleanString(payload.firstName);
  const source = cleanString(payload.source);
  const company = cleanString(payload.company);
  const turnstileToken = cleanString(payload.turnstileToken);

  if (company) {
    return { ok: false, error: "Spam detected." };
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return { ok: false, error: "Invalid email address." };
  }

  if (firstName.length > 80) {
    return { ok: false, error: "First name is too long." };
  }

  if (source.length > 100) {
    return { ok: false, error: "Source is too long." };
  }

  return {
    ok: true,
    data: {
      email,
      firstName,
      source,
      turnstileToken
    }
  };
}

module.exports = {
  normalizeEmail,
  validateContactPayload,
  validateJoinPayload
};
