import { Router } from "express";
import { hasDatabase, getDatabase } from "../db/client";

const router = Router();

router.get("/api/health", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

  // Keeping /api/health as a cheap liveness probe for load balancers and load tests.
  res.status(200).json({ ok: true });
});

router.get("/api/ready", async (_req, res) => {
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
