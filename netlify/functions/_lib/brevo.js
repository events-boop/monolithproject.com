"use strict";

const { isProductionEnvironment } = require("./runtime");

function parseListIds(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => Number(item))
      .filter((item) => Number.isInteger(item) && item > 0);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item > 0);
}

function buildBrevoAttributes(attributeMap) {
  return Object.fromEntries(
    Object.entries(attributeMap).filter(([, value]) => value !== undefined && value !== "")
  );
}

async function upsertBrevoContact({
  apiKey,
  email,
  listIds = [],
  attributes = {},
  emailBlacklisted = false
}) {
  if (!apiKey) {
    if (isProductionEnvironment()) {
      throw new Error("BREVO_API_KEY is not configured.");
    }
    return { ok: true, skipped: true };
  }

  const payload = {
    email,
    updateEnabled: true,
    emailBlacklisted
  };

  if (listIds.length > 0) {
    payload.listIds = listIds;
  }

  if (Object.keys(attributes).length > 0) {
    payload.attributes = attributes;
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Brevo contact sync failed: ${text}`);
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  return {
    ok: true,
    skipped: false,
    id: data.id ?? null
  };
}

module.exports = {
  buildBrevoAttributes,
  parseListIds,
  upsertBrevoContact
};
