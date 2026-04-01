import { Router } from "express";
import { hasDatabase } from "../db/client";

const router = Router();
const startTime = Date.now();

router.get("/api/health", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  
  const isHealthy = hasDatabase();
  const status = {
    ok: isHealthy,
    service: "monolith-api",
    version: "1.0.0-ss-tier",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: hasDatabase() ? "connected" : "disconnected",
      environment: process.env.NODE_ENV || "production",
    }
  };

  // Return 200 even if degraded to prevent aggressive orchestrator restarts
  res.status(200).json(status);
});

export default router;
