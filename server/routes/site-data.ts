import express from "express";
import { siteDataService } from "../services/site-data-service";
import { createRateLimitMiddleware } from "../services/rate-limit";
import { asyncHandler } from "../lib/async";

const router = express.Router();

router.get(
  "/api/site-data",
  createRateLimitMiddleware({
    scope: "site_data_public",
    limit: 5000, // Scaled for 1000+ stress tests
    windowMs: 5 * 60_000,
    preferMemory: true, // Critical: eliminate DB write overhead for this route
    message: "Too many site data requests. Please try again shortly.",
  }),
  asyncHandler(async (req, res) => {
    const path = typeof req.query.path === "string" ? req.query.path : "/";
    
    // The service handles caching and background revalidation
    const siteData = await siteDataService.getSiteData(path);

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("X-Data-Source", "memcached-swr");
    
    res.json(siteData);
  }),
);

export default router;
