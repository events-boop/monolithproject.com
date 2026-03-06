"use strict";

const { isProductionEnvironment } = require("./runtime");

function getEmailProvider({
  emailProvider,
  resendApiKey,
  brevoApiKey,
  mode
}) {
  if (mode === "log") {
    return "log";
  }

  if (emailProvider) {
    return emailProvider;
  }

  if (brevoApiKey) {
    return "brevo";
  }

  if (resendApiKey) {
    return "resend";
  }

  return "log";
}

async function sendWithResend({
  apiKey,
  from,
  to,
  subject,
  text,
  replyTo
}) {
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      reply_to: replyTo
    })
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Email delivery failed: ${payload}`);
  }

  return response.json();
}

async function sendWithBrevo({
  apiKey,
  from,
  to,
  subject,
  text,
  replyTo
}) {
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured.");
  }

  const recipients = Array.isArray(to) ? to : [to];
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        email: from
      },
      to: recipients.map((email) => ({ email })),
      subject,
      textContent: text,
      replyTo: replyTo
        ? {
            email: replyTo
          }
        : undefined
    })
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Email delivery failed: ${payload}`);
  }

  return response.json();
}

async function sendEmail({
  apiKey,
  brevoApiKey,
  emailProvider,
  from,
  to,
  subject,
  text,
  replyTo,
  mode = "live"
}) {
  if (!to || !from) {
    throw new Error("Email sender and recipient must be configured.");
  }

  const normalizedMode = mode === "log" ? "log" : "live";
  const provider = getEmailProvider({
    emailProvider,
    resendApiKey: apiKey,
    brevoApiKey,
    mode: normalizedMode
  });

  if (provider === "log") {
    if (normalizedMode !== "log" && isProductionEnvironment()) {
      throw new Error("Email provider is not configured for live delivery.");
    }

    console.log(
      JSON.stringify({
        level: "info",
        event: "email.log_delivery",
        to,
        from,
        subject,
        provider
      })
    );
    return { id: "logged" };
  }

  if (provider === "brevo") {
    return sendWithBrevo({
      apiKey: brevoApiKey,
      from,
      to,
      subject,
      text,
      replyTo
    });
  }

  return sendWithResend({
    apiKey,
    from,
    to,
    subject,
    text,
    replyTo
  });
}

module.exports = {
  sendEmail
};
