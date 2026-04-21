import { Router } from "express";
import { randomUUID } from "crypto";
import { logEvent } from "../lib/logging";
import { decorateOutboundDestination, resolveOutboundDestination } from "../lib/outbound";

const router = Router();

router.get("/go/:group/:key", (req, res) => {
  const requestId = randomUUID();
  const destination = resolveOutboundDestination(req.params.group, req.params.key);

  if (!destination) {
    logEvent("outbound.redirect_missing", {
      requestId,
      group: req.params.group,
      key: req.params.key,
    });

    return res.status(404).json({
      ok: false,
      requestId,
      error: {
        code: "OUTBOUND_NOT_FOUND",
        message: "Requested destination is not available.",
        retryable: false,
      },
    });
  }

  const trackedDestination = decorateOutboundDestination(destination, req.query);

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

  logEvent("outbound.redirected", {
    requestId,
    group: req.params.group,
    key: req.params.key,
  });

  return res.redirect(302, trackedDestination);
});

export default router;
