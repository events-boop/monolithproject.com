import { Router } from "express";
import { logEvent } from "../lib/logging";
import { asyncHandler } from "../lib/async";
import { hasDatabase } from "../db/client";
import { readSocialEchoSnapshot } from "../db/socialEchoRepo";
import { readInMemorySocialEchoSnapshot } from "../services/social-echo";

const router = Router();
const PUBLIC_SOCIAL_ECHO_ZERO_STATE = {
  summary: {
    totalGoing: 0,
    totalPending: 0,
    liveEvents: 0,
  },
};

export function shouldExposeLiveSocialEcho() {
  return process.env.PUBLIC_SOCIAL_ECHO_LIVE === "true";
}

function coarseCount(value: number) {
  if (value < 10) return 0;
  return Math.floor(value / 10) * 10;
}

function toPublicSocialSnapshot(snapshot: {
  summary: {
    totalGoing: number;
    totalPending: number;
    liveEvents: number;
  };
}) {
  return {
    ok: true,
    summary: {
      totalGoing: coarseCount(snapshot.summary.totalGoing),
      totalPending: coarseCount(snapshot.summary.totalPending),
      liveEvents: snapshot.summary.liveEvents,
    },
    events: [],
    activity: [],
  };
}

export function buildPublicSocialEchoPayload(snapshot?: {
  summary: {
    totalGoing: number;
    totalPending: number;
    liveEvents: number;
  };
} | null) {
  if (!shouldExposeLiveSocialEcho()) {
    return toPublicSocialSnapshot(PUBLIC_SOCIAL_ECHO_ZERO_STATE);
  }

  return toPublicSocialSnapshot(snapshot ?? PUBLIC_SOCIAL_ECHO_ZERO_STATE);
}

router.get("/api/social/echo", asyncHandler(async (_req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=300");
    res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");

    if (!shouldExposeLiveSocialEcho()) {
      return res.status(200).json(buildPublicSocialEchoPayload());
    }

    const snapshot = hasDatabase() ? await readSocialEchoSnapshot() : null;
    if (snapshot) {
      return res.status(200).json(buildPublicSocialEchoPayload(snapshot));
    }

    return res.status(200).json(buildPublicSocialEchoPayload(readInMemorySocialEchoSnapshot()));
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
}));

export default router;
