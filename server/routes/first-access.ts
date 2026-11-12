import { Router } from "express";
import { asyncHandler } from "../lib/async";
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
    const result = await submitFirstAccess(req.body);
    res.setHeader("Cache-Control", "no-store");
    res.status(result.status).json(result.body);
  })
);
export default router;
