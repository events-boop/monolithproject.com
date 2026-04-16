import { Router } from "express";
import { hasDatabase, getDatabase } from "../db/client";

const router = Router();

router.get("/api/health", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

  let dbConnected = false;
  if (hasDatabase()) {
    try {
      const db = getDatabase();
      await db?.execute("SELECT 1");
      dbConnected = true;
    } catch (e) {
      dbConnected = false;
    }
  }

  res.status(200).json({ 
    ok: true,
    database: {
      configured: hasDatabase(),
      connected: dbConnected,
    }
  });
});

export default router;
