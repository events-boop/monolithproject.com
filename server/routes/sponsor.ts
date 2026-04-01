import { Router } from "express";
import { randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import { sponsorAccessSchema } from "../lib/schemas";
import { logEvent } from "../lib/logging";
import { secureCompare } from "../lib/security";
import { parseCookieHeader } from "../lib/cookies";
import {
  sponsorSessionTtlMs,
  sponsorSessionCookieName,
  sponsorDeckPath,
  sponsorDeckFilename,
  sponsorSessions,
  buildSponsorSessionCookie,
  issueSponsorSession,
  hasValidSponsorSession,
} from "../services/sponsor-session";

const router = Router();

const sponsorAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return res.status(429).json({
      ok: false,
      requestId: randomUUID(),
      error: {
        code: "RATE_LIMITED",
        message: "Too many access attempts. Please wait 15 minutes before retrying.",
        retryable: true,
      },
    });
  },
});

router.post("/api/sponsor-access", sponsorAccessLimiter, (req, res) => {
  const requestId = randomUUID();
  const parsed = sponsorAccessSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      requestId,
      error: {
        code: "VALIDATION_ERROR",
        message: "Enter a valid access code.",
        retryable: false,
      },
    });
  }

  const configuredPassword = process.env.SPONSOR_ACCESS_PASSWORD?.trim();
  if (!configuredPassword) {
    logEvent("sponsor.access_unconfigured", { requestId });
    return res.status(503).json({
      ok: false,
      requestId,
      error: {
        code: "UNAVAILABLE",
        message: "Sponsor access is temporarily unavailable.",
        retryable: false,
      },
    });
  }

  const providedPassword = parsed.data.password.trim();
  if (!secureCompare(providedPassword, configuredPassword)) {
    res.setHeader("Set-Cookie", buildSponsorSessionCookie("", 0));
    logEvent("sponsor.access_denied", { requestId });
    return res.status(401).json({
      ok: false,
      requestId,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Invalid access code.",
        retryable: true,
      },
    });
  }

  const sessionToken = issueSponsorSession();
  res.setHeader("Set-Cookie", buildSponsorSessionCookie(sessionToken, Math.floor(sponsorSessionTtlMs / 1000)));
  logEvent("sponsor.access_granted", { requestId });
  return res.status(200).json({ ok: true, requestId, sessionExpiresInSec: Math.floor(sponsorSessionTtlMs / 1000) });
});

router.get("/api/sponsor-deck", (req, res) => {
  const requestId = randomUUID();
  const sessionToken = parseCookieHeader(req.header("cookie"))[sponsorSessionCookieName];

  if (!sessionToken || !hasValidSponsorSession(sessionToken)) {
    res.setHeader("Set-Cookie", buildSponsorSessionCookie("", 0));
    logEvent("sponsor.deck_denied", { requestId });
    return res.status(401).json({
      ok: false,
      requestId,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "Sponsor access required.",
        retryable: true,
      },
    });
  }

  sponsorSessions.set(sessionToken, Date.now() + sponsorSessionTtlMs);

  return res.download(sponsorDeckPath, sponsorDeckFilename, (error) => {
    if (!error) {
      logEvent("sponsor.deck_downloaded", { requestId });
      return;
    }

    const code = (error as NodeJS.ErrnoException).code || "UNKNOWN";
    const isMissing = code === "ENOENT";
    logEvent("sponsor.deck_download_failed", { requestId, code, message: error.message });

    if (res.headersSent) return;
    return res.status(isMissing ? 404 : 500).json({
      ok: false,
      requestId,
      error: {
        code: isMissing ? "DOCUMENT_NOT_FOUND" : "DOCUMENT_UNAVAILABLE",
        message: isMissing ? "Sponsor deck is unavailable." : "Unable to download sponsor deck right now.",
        retryable: !isMissing,
      },
    });
  });
});

export default router;
