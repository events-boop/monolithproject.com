import { Router } from "express";
import { hasDatabase } from "../db/client";

const router = Router();
const startTime = Date.now();

router.get("/api/health", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  
  const status = {
    ok: true,
    service: "monolith-api",
    version: "1.0.0-ss-tier",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: hasDatabase() ? "connected" : "disconnected",
      environment: process.env.NODE_ENV || "production",
    }
  };

  const isHealthy = hasDatabase();

  res.status(isHealthy ? 200 : 503).json(status);
});

export default router;
