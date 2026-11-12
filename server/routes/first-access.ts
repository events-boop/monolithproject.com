import { randomUUID } from "crypto";
import { Router } from "express";
import { asyncHandler } from "../lib/async";
import { honeypotFieldName, readHoneypotValue } from "../lib/honeypot";
import { logEvent } from "../lib/logging";
import { createRateLimitMiddleware } from "../services/rate-limit";
import {
  firstAccessAvailable,
  submitFirstAccess,
} from "../services/first-access";

const router = Router();
router.get(
  "/api/first-access",
  createRateLimitMiddleware({
    scope: "first_access:availability",
    windowMs: 60_000,
    limit: 60,
    preferMemory: true,
    message: "Please wait before checking again.",
  }),
  asyncHandler(async (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, available: await firstAccessAvailable() });
  })
);
router.post(
  "/api/first-access",
  createRateLimitMiddleware({
    scope: "first_access:submit",
    windowMs: 15 * 60_000,
    limit: 8,
    preferMemory: true,
    message: "Please wait 15 minutes before trying again.",
  }),
  asyncHandler(async (req, res) => {
    const requestId = randomUUID();
    // Same trap and the same quiet reply as the booking and contact routes: a
    // filled decoy field is logged and answered as success, so a bot learns
    // nothing and a person never sees an error they cannot act on.
    const honeypotValue = readHoneypotValue(req.body);
    if (honeypotValue) {
      logEvent("bot.honeypot_triggered", {
        requestId,
        route: "/api/first-access",
        field: honeypotFieldName,
        valueLength: honeypotValue.length,
      });
      res.setHeader("Cache-Control", "no-store");
      res.status(202).json({
        ok: true,
        requestId,
        state: "subscribed",
        message: "You’re on the First Access list.",
      });
      return;
    }
    const result = await submitFirstAccess(req.body);
    res.setHeader("Cache-Control", "no-store");
    res.status(result.status).json(result.body);
  })
);
export default router;
