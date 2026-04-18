import express from "express";
import { siteDataService } from "../services/site-data-service";
import { createRateLimitMiddleware } from "../services/rate-limit";
import { asyncHandler } from "../lib/async";

const router = express.Router();
const DEFAULT_SITE_DATA_RATE_LIMIT = 600;
const DEFAULT_SITE_DATA_RATE_LIMIT_WINDOW_MS = 5 * 60_000;

function readPositiveIntEnv(name: string, fallback: number) {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const siteDataLimiter = createRateLimitMiddleware({
  scope: "site_data_public",
  limit: readPositiveIntEnv("SITE_DATA_RATE_LIMIT", DEFAULT_SITE_DATA_RATE_LIMIT),
  windowMs: readPositiveIntEnv(
    "SITE_DATA_RATE_LIMIT_WINDOW_MS",
    DEFAULT_SITE_DATA_RATE_LIMIT_WINDOW_MS,
  ),
  preferMemory: true, // Keep public site-data reads off the database hot path
  message: "Too many site data requests. Please try again shortly.",
});

function hasMatchingEtag(ifNoneMatchHeader: string | undefined, etag: string) {
  if (!ifNoneMatchHeader) return false;
  if (ifNoneMatchHeader.trim() === "*") return true;

  return ifNoneMatchHeader
    .split(",")
    .some((candidate) => candidate.trim() === etag);
}

router.get(
  "/api/site-data",
  siteDataLimiter,
  asyncHandler(async (req, res) => {
    const path = typeof req.query.path === "string" ? req.query.path : "/";
    
    // The service handles SWR event caching plus per-path response memoization.
    const siteData = await siteDataService.getSiteDataResponse(path);
    const ifNoneMatch = req.header("if-none-match");

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=120");
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("X-Data-Source", "memcached-swr");
    res.setHeader("ETag", siteData.etag);

    if (hasMatchingEtag(ifNoneMatch, siteData.etag)) {
      return res.status(304).end();
    }

    res.type("application/json").send(siteData.serialized);
  }),
);

export default router;
