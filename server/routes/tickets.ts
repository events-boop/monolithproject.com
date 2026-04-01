import { Router } from "express";
import { randomUUID } from "crypto";
import { ticketIntentSchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";

const router = Router();

router.post("/api/ticket-intent", (req, res) => {
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

  logEvent("ticket.intent_started", {
    requestId,
    source: parsed.data.source,
    eventId: parsed.data.eventId || null,
  });

  // Intent is an ephemeral event in the current architecture.
  // Success is accepted immediately to keep the UX responsive.
  return res.status(202).json({ 
    ok: true, 
    requestId,
    message: "Intent recorded." 
  });
});

export default router;
