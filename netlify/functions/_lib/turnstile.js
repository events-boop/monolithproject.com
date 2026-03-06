"use strict";

const { isProductionEnvironment } = require("./runtime");

async function verifyTurnstileToken({ token, remoteIp, secretKey }) {
  if (!secretKey) {
    if (isProductionEnvironment()) {
      return {
        ok: false,
        statusCode: 500,
        error: "Turnstile is not configured."
      };
    }
    return { ok: true, skipped: true };
  }

  if (!token) {
    return { ok: false, error: "Verification token is required." };
  }

  const params = new URLSearchParams({
    secret: secretKey,
    response: token
  });

  if (remoteIp && remoteIp !== "unknown") {
    params.set("remoteip", remoteIp);
  }

  let response;
  try {
    response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      }
    );
  } catch (error) {
    return { ok: false, error: "Verification service unavailable." };
  }

  let payload = {};
  try {
    payload = await response.json();
  } catch (error) {
    return { ok: false, error: "Verification response was invalid." };
  }

  if (!response.ok || !payload.success) {
    return { ok: false, error: "Verification failed." };
  }

  return { ok: true };
}

module.exports = {
  verifyTurnstileToken
};
