import { Router } from "express";
import { randomUUID } from "crypto";
import { ticketIntentSchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { getDatabase } from "../db/client";
import { ticketIntents } from "../db/schema";

const router = Router();

router.post("/api/ticket-intent", async (req, res) => {
  const requestId = randomUUID();
  const parsed = ticketIntentSchema.safeParse(req.body);
  
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      requestId,
      error: { 
        code: "VALIDATION_ERROR", 
        message: "Invalid payload provided for ticket intent.", 
        retryable: false 
      },
    });
  }

  const ticketIntentId = randomUUID();
  const db = getDatabase();
  if (db) {
    await db.insert(ticketIntents).values({
      id: ticketIntentId,
      source: parsed.data.source,
      eventId: parsed.data.eventId,
      sessionId: parsed.data.sessionId,
      destinationUrl: parsed.data.destinationUrl,
      metadata: parsed.data,
    }).catch((error) => {
      console.error(`[${requestId}] Failed to persist ticket intent:`, error);
    });
  }

  logEvent("ticket.intent_started", {
    requestId,
    ticketIntentId,
    source: parsed.data.source,
    eventId: parsed.data.eventId || null,
    sessionId: parsed.data.sessionId || null,
    destinationUrl: parsed.data.destinationUrl || null,
    pageUrl: parsed.data.pageUrl || null,
    landingPageUrl: parsed.data.landingPageUrl || null,
    referrerDomain: parsed.data.referrerDomain || parsed.data.firstReferrerDomain || null,
    utmSource: parsed.data.utmSource || parsed.data.lastUtmSource || null,
    utmMedium: parsed.data.utmMedium || parsed.data.lastUtmMedium || null,
    utmCampaign: parsed.data.utmCampaign || parsed.data.lastUtmCampaign || null,
    gclid: parsed.data.gclid || parsed.data.lastGclid || null,
    fbclid: parsed.data.fbclid || parsed.data.lastFbclid || null,
  });

  return res.status(202).json({ 
    ok: true, 
    requestId,
    ticketIntentId,
    message: "Intent recorded." 
  });
});

export default router;
