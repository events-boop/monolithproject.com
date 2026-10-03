// Copyable server-only Web Request handler. No Fan360 database/runtime dependency.
const LIMIT = 16384;
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];
function json(body, status = 200, retry = false) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(retry ? { "Retry-After": "60" } : {}),
    },
  });
}
function configured(input) {
  try {
    const { intakeUrl, token, releaseId, allowedEmail, pagePath = "/" } = input;
    const u = new URL(intakeUrl);
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      u.search ||
      u.hash ||
      !/^\/api\/website-capture\/[0-9a-f-]{36}$/.test(u.pathname) ||
      !uuid.test(u.pathname.split("/").at(-1)) ||
      !uuid.test(releaseId) ||
      typeof token !== "string" ||
      token.length < 32 ||
      /\s/.test(token) ||
      typeof allowedEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(allowedEmail) ||
      typeof pagePath !== "string" ||
      !/^\/(?!\/)[^?#%\\\s]*$/.test(pagePath) ||
      new URL(pagePath, "https://monolithproject.com").pathname !== pagePath
    )
      return null;
    return {
      intakeUrl: u.href,
      token,
      releaseId,
      allowedEmail: allowedEmail.toLowerCase(),
      pagePath,
    };
  } catch {
    return null;
  }
}
async function bodyText(body, declared, limit) {
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit))
    throw Error("TOO_LARGE");
  if (!body) throw Error("INVALID");
  const reader = body.getReader(),
    chunks = [];
  let total = 0,
    timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(Error("TIMEOUT"));
      void reader.cancel().catch(() => {});
    }, 5000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        void reader.cancel().catch(() => {});
        throw Error("TOO_LARGE");
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
function payload(value, c) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some(
      (k) =>
        ![
          "submissionId",
          "occurredAt",
          "email",
          "phone",
          "instagram",
          "choices",
          "landingPage",
          "referrer",
          "honeypot",
        ].includes(k),
    )
  )
    throw Error("INVALID");
  const {
    submissionId,
    occurredAt = null,
    email,
    phone = "",
    instagram = "",
    choices,
    landingPage,
    referrer = "",
    honeypot = "",
  } = value;
  if (
    typeof submissionId !== "string" ||
    !/^[A-Za-z0-9_-]{8,120}$/.test(submissionId) ||
    typeof email !== "string" ||
    email.length > 320 ||
    !email.trim() ||
    typeof phone !== "string" ||
    phone.length > 200 ||
    typeof instagram !== "string" ||
    instagram.length > 200 ||
    typeof honeypot !== "string" ||
    honeypot !== "" ||
    !choices ||
    typeof choices !== "object" ||
    Array.isArray(choices) ||
    Object.keys(choices).some((k) => !["email", "sms"].includes(k)) ||
    typeof choices.email !== "boolean" ||
    typeof choices.sms !== "boolean"
  )
    throw Error("INVALID");
  if (email.trim().toLowerCase() !== c.allowedEmail) throw Error("SCOPE");
  if (
    occurredAt !== null &&
    (typeof occurredAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
        occurredAt,
      ) ||
      !Number.isFinite(Date.parse(occurredAt)) ||
      Date.parse(occurredAt) > Date.now() + 300000)
  )
    throw Error("INVALID");
  if (
    typeof landingPage !== "string" ||
    landingPage.length > 2000 ||
    typeof referrer !== "string" ||
    referrer.length > 2000
  )
    throw Error("INVALID");
  const page = new URL(landingPage);
  if (
    page.origin !== "https://monolithproject.com" ||
    page.username ||
    page.password ||
    page.pathname !== c.pagePath
  )
    throw Error("INVALID");
  const context = new URL(c.pagePath, "https://monolithproject.com");
  for (const key of utmKeys) {
    const values = page.searchParams.getAll(key);
    if (values.length > 1) throw Error("INVALID");
    if (values.length) {
      if (values[0].length > 200) throw Error("INVALID");
      context.searchParams.set(key, values[0]);
    }
  }
  let safeReferrer = "";
  if (referrer) {
    const r = new URL(referrer);
    if (!["http:", "https:"].includes(r.protocol) || r.username || r.password)
      throw Error("INVALID");
    safeReferrer = r.origin + r.pathname;
  }
  return {
    releaseId: c.releaseId,
    submissionId,
    occurredAt,
    answers: {
      email,
      ...(phone ? { phone } : {}),
      ...(instagram ? { instagram } : {}),
    },
    choices,
    landingPage: context.href,
    referrer: safeReferrer,
    honeypot: "",
  };
}
/** Construct once from trusted server configuration, never browser-supplied settings. */
export function createMonolithSignupBridge(config, { fetcher = fetch } = {}) {
  const c = configured(config);
  return async function signup(request) {
    if (!c) return json({ error: "SIGNUP_UNAVAILABLE" }, 503);
    if (request.method !== "POST")
      return json({ error: "METHOD_NOT_ALLOWED" }, 405);
    const origin = request.headers.get("origin");
    if (
      origin !== "https://monolithproject.com" ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return json({ error: "SAME_ORIGIN_REQUIRED" }, 403);
    if (
      request.headers.get("content-type")?.split(";")[0].trim() !==
      "application/json"
    )
      return json({ error: "JSON_REQUIRED" }, 415);
    let data;
    try {
      data = payload(
        JSON.parse(
          await bodyText(
            request.body,
            request.headers.get("content-length"),
            LIMIT,
          ),
        ),
        c,
      );
    } catch (e) {
      return json(
        {
          error:
            e.message === "SCOPE"
              ? "CONTROLLED_TEST_ONLY"
              : e.message === "TOO_LARGE"
                ? "BODY_TOO_LARGE"
                : e.message === "TIMEOUT"
                  ? "REQUEST_TIMEOUT"
                  : "INVALID_SIGNUP",
        },
        e.message === "SCOPE"
          ? 403
          : e.message === "TOO_LARGE"
            ? 413
            : e.message === "TIMEOUT"
              ? 408
              : 400,
      );
    }
    try {
      const response = await fetcher(c.intakeUrl, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + c.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "error",
        signal: AbortSignal.timeout(10000),
      });
      if (response.status === 429) {
        void response.body?.cancel().catch(() => {});
        return json({ error: "TRY_AGAIN_LATER" }, 429, true);
      }
      if (!response.ok) {
        void response.body?.cancel().catch(() => {});
        return json(
          { error: "SIGNUP_NOT_RECORDED" },
          response.status === 400 || response.status === 409 ? 422 : 503,
        );
      }
      const result = JSON.parse(
        await bodyText(
          response.body,
          response.headers.get("content-length"),
          4096,
        ),
      );
      if (
        result.status !== "received_for_review" ||
        result.canonicalChanges !== 0 ||
        !uuid.test(result.receiptId) ||
        typeof result.duplicate !== "boolean"
      )
        throw Error("INVALID_ACK");
      // A durable raw receipt is not a subscription, verified identity or Fan360 application.
      return json({
        status: "received",
        submissionId: data.submissionId,
        duplicate: result.duplicate,
      });
    } catch {
      return json({ error: "SIGNUP_NOT_RECORDED" }, 503);
    }
  };
}
