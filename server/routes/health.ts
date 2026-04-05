import { Router } from "express";

const router = Router();

router.get("/api/health", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

  // Keep the public liveness probe intentionally minimal.
  res.status(200).json({ ok: true });
});

export default router;
