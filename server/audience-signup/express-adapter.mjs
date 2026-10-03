// Prepared adapter for the existing website Express pipeline. Not mounted here.
// Caller must keep existing browser guard/16 KiB parser and mount a dedicated rate limiter.
export function createMonolithExpressHandler(bridge) {
  return async function signup(req, res) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      res.status(405).send(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }));
      return;
    }
    try {
      const headers = new Headers();
      for (const key of ["origin", "sec-fetch-site", "content-type"]) {
        const value = req.headers[key];
        if (Array.isArray(value)) {
          res.status(400).send(JSON.stringify({ error: "INVALID_HEADERS" }));
          return;
        }
        if (typeof value === "string") headers.set(key, value);
      }
      const body = JSON.stringify(req.body);
      if (typeof body !== "string") {
        res.status(400).send(JSON.stringify({ error: "INVALID_SIGNUP" }));
        return;
      }
      const bytes = new TextEncoder().encode(body).byteLength;
      if (bytes > 16384) {
        res.status(413).send(JSON.stringify({ error: "BODY_TOO_LARGE" }));
        return;
      }
      headers.set("content-length", String(bytes));
      const response = await bridge(
        new Request("https://monolithproject.com/api/audience-signup", {
          method: "POST",
          headers,
          body,
        }),
      );
      const retry = response.headers.get("retry-after");
      if (retry && /^\d{1,5}$/.test(retry)) res.setHeader("Retry-After", retry);
      // The bridge produces bounded local JSON. Never forward cookies, provider headers or redirects.
      res.status(response.status).send(await response.text());
    } catch {
      res.status(503).send(JSON.stringify({ error: "SIGNUP_NOT_RECORDED" }));
    }
  };
}
