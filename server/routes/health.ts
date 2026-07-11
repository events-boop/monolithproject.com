import { Router, type Response } from "express";
import { hasDatabase, getDatabase } from "../db/client";
import { createAdminRouteGuard } from "../lib/admin-auth";
import { getLayloBypassReason, readProvider } from "../lib/env";
import { getMetaCapiHealthStatus } from "../services/meta-capi";
import { isAirtableSyncEnabled } from "../services/airtable-sync";

const router = Router();

function healthPayload() {
  const leadProvider = readProvider();
  const layloBypassReason = getLayloBypassReason();

  return {
    ok: true,
    capi: getMetaCapiHealthStatus(),
    integrations: {
      laylo: {
        provider_sync_enabled: leadProvider === "laylo" && !layloBypassReason,
        webhook_configured: Boolean(process.env.LAYLO_WEBHOOK_SECRET?.trim()),
      },
      posh: {
        webhook_configured: Boolean(process.env.POSH_WEBHOOK_SECRET?.trim()),
      },
      airtable: {
        sync_enabled: isAirtableSyncEnabled(),
      },
    },
  };
}

function sendHealth(res: Response) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

  // Liveness only. Integration topology and upstream error strings are
  // recon-useful, so the full payload lives behind the admin guard below.
  res.status(200).json({ ok: true });
}

router.get("/api/health", (_req, res) => {
  // Keeping /api/health as a cheap liveness probe for load balancers and load tests.
  sendHealth(res);
});

router.get("/health", (_req, res) => {
  sendHealth(res);
});

router.get(
  "/api/health/details",
  createAdminRouteGuard({ scope: "health" }),
  (_req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");
    res.status(200).json(healthPayload());
  }
);

router.get(
  "/api/ready",
  createAdminRouteGuard({ scope: "ready" }),
  async (_req, res) => {
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
      },
    });
  }
);

export default router;
