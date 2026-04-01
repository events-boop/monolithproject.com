import { Router } from "express";
import { logEvent } from "../lib/logging";
import { hasDatabase } from "../db/client";
import { readSocialEchoSnapshot } from "../db/socialEchoRepo";
import { readInMemorySocialEchoSnapshot } from "../services/social-echo";

const router = Router();

router.get("/api/social/echo", async (_req, res) => {
  try {
    const snapshot = hasDatabase() ? await readSocialEchoSnapshot() : null;
    if (snapshot) {
      return res.status(200).json({ ok: true, ...snapshot });
    }

    return res.status(200).json({ ok: true, ...readInMemorySocialEchoSnapshot() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logEvent("social.echo_read_failed", { message });
    return res.status(500).json({
      ok: false,
      error: {
        code: "SOCIAL_ECHO_UNAVAILABLE",
        message: "Unable to load live social activity right now.",
      },
    });
  }
});

export default router;
