import { Router, type Response } from "express";
import { hasDatabase, getDatabase } from "../db/client";
import { createAdminRouteGuard } from "../lib/admin-auth";
import { getMetaCapiHealthStatus } from "../services/meta-capi";

const router = Router();

function healthPayload() {
  return {
    ok: true,
    capi: getMetaCapiHealthStatus(),
  };
}

function sendHealth(res: Response) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

  res.status(200).json(healthPayload());
}

router.get("/api/health", (_req, res) => {
  // Keeping /api/health as a cheap liveness probe for load balancers and load tests.
  sendHealth(res);
});

router.get("/health", (_req, res) => {
  sendHealth(res);
});

router.get("/api/ready", createAdminRouteGuard({ scope: "ready" }), async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

  let dbConnected = false;
  try {
    if (hasDatabase()) {
      const db = getDatabase();
      await db?.execute("SELECT 1");
      dbConnected = true;
    }
  } catch (e) {
    dbConnected = false;
  }

  const status = dbConnected || !hasDatabase() ? 200 : 503;

  res.status(status).json({ 
    ok: status === 200,
    database: {
      configured: hasDatabase(),
      connected: dbConnected,
    }
  });
});

export default router;
