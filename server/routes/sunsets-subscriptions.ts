import { Router } from "express";
import { asyncHandler } from "../lib/async";
import { createRateLimitMiddleware } from "../services/rate-limit";
import {
  subscribeSunsets,
  checkedSunsetsSubscriptionAvailability,
} from "../services/sunsets-subscriptions";
import hostedForms from "../../shared/signup-forms.json";
const router = Router();
router.get(
  "/api/sunsets/subscriptions",
  asyncHandler(async (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json({
      ok: true,
      audiences:
        hostedForms.event && hostedForms.radio
          ? { event: false, radio: false }
          : await checkedSunsetsSubscriptionAvailability(),
      hostedForms,
    });
  })
);
router.post(
  "/api/sunsets/subscriptions",
  createRateLimitMiddleware({
    scope: "sunsets:subscriptions",
    windowMs: 15 * 60 * 1000,
    limit: 8,
    message: "Please wait 15 minutes before trying again.",
  }),
  asyncHandler(async (req, res) => {
    const result = await subscribeSunsets(req.body);
    res.setHeader("Cache-Control", "no-store");
    return res.status(result.status).json(result.body);
  })
);
export default router;
