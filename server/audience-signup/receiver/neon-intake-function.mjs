import { createHash } from "node:crypto";
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reply = (body, statusCode, headers = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  },
  body: JSON.stringify(body),
});
function databaseIdentity(value) {
  try {
    const u = new URL(value);
    if (!["postgres:", "postgresql:"].includes(u.protocol)) return null;
    return u.hostname.replace("-pooler.", ".") + u.pathname;
  } catch {
    return null;
  }
}
function configuration(env) {
  try {
    const u = new URL(env.AUDIENCE_DATABASE_URL);
    const token = env.AUDIENCE_INTAKE_TOKEN;
    if (
      env.AUDIENCE_SIGNUP_CONTROLLED_ENABLED !== "true" ||
      !["postgres:", "postgresql:"].includes(u.protocol) ||
      !u.hostname.endsWith(".neon.tech") ||
      !["require", "verify-full"].includes(u.searchParams.get("sslmode")) ||
      !u.username ||
      !u.password ||
      !u.pathname ||
      u.pathname === "/" ||
      databaseIdentity(env.AUDIENCE_DATABASE_URL) ===
        databaseIdentity(env.DATABASE_URL) ||
      typeof token !== "string" ||
      token.length < 32 ||
      /\s/.test(token) ||
      !uuid.test(env.AUDIENCE_WEBSITE_ID || "") ||
      typeof env.AUDIENCE_WORKSPACE_ID !== "string" ||
      !env.AUDIENCE_WORKSPACE_ID.trim() ||
      env.AUDIENCE_WORKSPACE_ID.length > 100 ||
      typeof env.AUDIENCE_SOURCE_ACCOUNT !== "string" ||
      !env.AUDIENCE_SOURCE_ACCOUNT.trim() ||
      env.AUDIENCE_SOURCE_ACCOUNT.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.AUDIENCE_CONTROLLED_EMAIL || "")
    )
      return null;
    return {
      token,
      connection: {
        workspaceId: env.AUDIENCE_WORKSPACE_ID,
        websiteId: env.AUDIENCE_WEBSITE_ID,
        account: env.AUDIENCE_SOURCE_ACCOUNT,
        allowedEmail: env.AUDIENCE_CONTROLLED_EMAIL,
        credentialFingerprint: createHash("sha256").update(token).digest("hex"),
      },
    };
  } catch {
    return null;
  }
}
// Netlify Lambda interface. Secrets are configured independently of the website DB.
export function createNeonIntakeFunction(
  env = process.env,
  { load = () => import("./canonical-intake.mjs") } = {},
) {
  const c = configuration(env);
  let loaded;
  return async function intake(event) {
    if (event.httpMethod !== "POST")
      return reply({ error: "METHOD_NOT_ALLOWED" }, 405, { Allow: "POST" });
    if (!c) return reply({ error: "WEBSITE_INTAKE_NOT_CONFIGURED" }, 503);
    const path = event.path;
    if (
      ![
        "/api/website-capture/" + c.connection.websiteId,
        "/.netlify/functions/audience-intake/api/website-capture/" +
          c.connection.websiteId,
      ].includes(path)
    )
      return reply({ error: "WEBSITE_NOT_AVAILABLE" }, 404);
    try {
      const headers = new Headers();
      const seen = new Set();
      const allowed = [
        "authorization",
        "content-type",
        "content-length",
        "origin",
        "sec-fetch-site",
      ];
      for (const [name, value] of Object.entries(event.headers || {})) {
        const key = name.toLowerCase();
        if (!allowed.includes(key)) continue;
        if (seen.has(key) || typeof value !== "string")
          return reply({ error: "INVALID_HEADERS" }, 400);
        seen.add(key);
        headers.set(key, value);
      }
      for (const [name, values] of Object.entries(
        event.multiValueHeaders || {},
      )) {
        if (
          allowed.includes(name.toLowerCase()) &&
          (!Array.isArray(values) || values.length !== 1)
        )
          return reply({ error: "INVALID_HEADERS" }, 400);
      }
      if (typeof event.body !== "string")
        return reply({ error: "INVALID_JSON" }, 400);
      if (event.body.length > (event.isBase64Encoded ? 21848 : 16384))
        return reply({ error: "BODY_TOO_LARGE" }, 413);
      if (
        event.isBase64Encoded &&
        (!/^[A-Za-z0-9+/]*={0,2}$/.test(event.body) || event.body.length % 4)
      )
        return reply({ error: "INVALID_JSON" }, 400);
      const bytes = Buffer.from(
        event.body,
        event.isBase64Encoded ? "base64" : "utf8",
      );
      if (bytes.byteLength > 16384)
        return reply({ error: "BODY_TOO_LARGE" }, 413);
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (!loaded)
        loaded = Promise.resolve()
          .then(load)
          .catch((error) => {
            loaded = undefined;
            throw error;
          });
      const { handleWebsiteIntake } = await loaded;
      const response = await handleWebsiteIntake(
        new Request(
          "https://monolithproject.com/api/website-capture/" +
            c.connection.websiteId,
          {
            method: "POST",
            headers,
            body: text,
          },
        ),
        c.connection.websiteId,
        { token: c.token, connection: c.connection },
      );
      const result = await response.text();
      if (Buffer.byteLength(result) > 4096)
        throw Error("INVALID_LOCAL_RESPONSE");
      const retry = response.headers.get("retry-after");
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
          ...(retry && /^\d{1,5}$/.test(retry) ? { "Retry-After": retry } : {}),
        },
        body: result,
      };
    } catch {
      return reply({ error: "RECEIPT_STORAGE_FAILED" }, 503);
    }
  };
}
