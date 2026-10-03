import { Router, type ErrorRequestHandler } from "express";
import { createMonolithSignupBridge } from "../audience-signup/server.mjs";
import { createMonolithExpressHandler } from "../audience-signup/express-adapter.mjs";
import { createRateLimitMiddleware } from "../services/rate-limit";

// Server-only configuration. Construct once per app; no values enter client props.
export function createAudienceSignupRouter() {
  const router = Router();
  const enabled = process.env.AUDIENCE_SIGNUP_CONTROLLED_ENABLED === "true";
  const bridge = createMonolithSignupBridge({
    intakeUrl: enabled ? process.env.AUDIENCE_INTAKE_URL || "" : "",
    token: process.env.AUDIENCE_INTAKE_TOKEN || "",
    releaseId: process.env.AUDIENCE_RELEASE_ID || "",
    allowedEmail: process.env.AUDIENCE_CONTROLLED_EMAIL || "",
    pagePath: process.env.AUDIENCE_PAGE_PATH || "",
  });
  router.post(
    "/api/audience-signup",
    createRateLimitMiddleware({
      scope: "api:audience-signup",
      windowMs: 60_000,
      limit: 10,
      message: "Please try again shortly.",
    }),
    createMonolithExpressHandler(bridge)
  );
  return router;
}

// Mount directly on the app: Express skips ordinary routers after parser errors.
export const audienceSignupParseError: ErrorRequestHandler = (
  err,
  _req,
  res,
  next
) => {
  if (err?.type !== "entity.too.large" && err?.type !== "entity.parse.failed") {
    next(err);
    return;
  }
  res.status(err.type === "entity.too.large" ? 413 : 400).json({
    error:
      err.type === "entity.too.large" ? "BODY_TOO_LARGE" : "INVALID_SIGNUP",
  });
};
