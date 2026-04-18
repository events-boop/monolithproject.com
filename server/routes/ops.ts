import express from "express";
import { siteDataService } from "../services/site-data-service";
import { logEvent } from "../lib/logging";
import { asyncHandler } from "../lib/async";

const router = express.Router();

/**
 * Audit Log: Manual Cache Invalidation
 * Used by editors to force an Edge/Origin refresh for 
 * time-sensitive schedule drops.
 */
router.post(
  "/api/ops/cache/invalidate",
  asyncHandler(async (_req, res) => {
    siteDataService.invalidate();
    logEvent("admin.cache_invalidated", { timestamp: Date.now() });
    
    res.json({
      ok: true,
      message: "Global site-data cache cleared successfully.",
      timestamp: Date.now()
    });
  })
);

/**
 * Performance Health Baseline
 * Returns the target Web Vitals for the Monolith Protocol
 */
router.get(
  "/api/ops/baseline",
  asyncHandler(async (_req, res) => {
    res.json({
      vitals: {
        lcp: "1.2s",
        fid: "0.2ms",
        cls: "0.01",
        inp: "40ms",
        p75_mobile: "1.5s"
      },
      budgets: {
        js_total: "1.0MB",
        img_limit: "400KB",
        render: "Edge Hybrid"
      }
    });
  })
);

export default router;
