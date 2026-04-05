import express from "express";
import { createRateLimitMiddleware } from "../services/rate-limit";
import { buildPublicSiteData } from "../data/public-site-data";

const router = express.Router();

router.get(
  "/api/site-data",
  createRateLimitMiddleware({
    scope: "site_data_public",
    limit: 120,
    windowMs: 15 * 60_000,
    message: "Too many site data requests. Please try again shortly.",
  }),
  (req, res) => {
  const path = typeof req.query.path === "string" ? req.query.path : "/";

  res.setHeader("Cache-Control", "public, max-age=120, stale-while-revalidate=300");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.json(buildPublicSiteData(path));
  },
);

export default router;
