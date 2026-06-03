import { Router } from "express";
import { randomUUID } from "crypto";
import { logEvent } from "../lib/logging";
import { decorateOutboundDestination, resolveOutboundDestination, TICKETS_COMING_SOON } from "../lib/outbound";
import { getDatabase } from "../db/client";
import { linkClicks } from "../db/schema";

const router = Router();

function readQueryParam(value: unknown) {
  if (Array.isArray(value)) return typeof value[0] === "string" ? value[0] : undefined;
  return typeof value === "string" ? value : undefined;
}

function outboundClickMeta(group: string, key: string) {
  const normalizedGroup = group.trim().toLowerCase();
  const normalizedKey = key.trim().toLowerCase();
  const buttonName = `Outbound ${normalizedGroup}/${normalizedKey}`;

  if (normalizedGroup === "media" && normalizedKey === "sunsets-recap") {
    return { buttonName: "Watch Recap", channel: "YouTube", interestType: "recap_click" };
  }

  if (normalizedGroup === "media" && normalizedKey === "sunsets-soundcloud") {
    return { buttonName: "Follow the Sound", channel: "SoundCloud", interestType: "soundcloud_click" };
  }

  if (normalizedGroup === "gallery" && normalizedKey === "chasing-sunsets") {
    return { buttonName: "View Gallery", channel: "Pic-Time", interestType: "gallery_click" };
  }

  if (normalizedGroup === "forms" && normalizedKey === "sunsets-vip") {
    return { buttonName: "VIP / Tables", channel: "Fillout", interestType: "vip_click" };
  }

  if (normalizedGroup === "waitlist" && normalizedKey === "chasing-sunsets") {
    return { buttonName: "Join First Access", channel: "Laylo", interestType: "first_access_click" };
  }

  if (normalizedGroup === "waitlist" && normalizedKey === "sunsets-manychat") {
    return { buttonName: "ManyChat First Access", channel: "ManyChat", interestType: "manychat_first_access_click" };
  }

  if (normalizedGroup === "tickets") {
    return { buttonName: "Tickets", channel: "Posh", interestType: "ticket_click" };
  }

  if (normalizedGroup === "social") {
    return { buttonName: normalizedKey, channel: normalizedKey, interestType: `${normalizedKey}_click` };
  }

  return { buttonName, channel: normalizedGroup, interestType: "outbound_click" };
}

router.get("/go/:group/:key", async (req, res) => {
  const requestId = randomUUID();
  const destination = resolveOutboundDestination(req.params.group, req.params.key);

  // "Tickets coming soon" — env var is unset for this specific event.
  // Redirect to the Tickets page with a query flag so the UI can show a
  // clean "coming soon" state instead of a broken link or raw 404.
  if (destination === TICKETS_COMING_SOON) {
    logEvent("outbound.tickets_coming_soon", {
      requestId,
      group: req.params.group,
      key: req.params.key,
    });
    res.setHeader("Cache-Control", "no-store");
    return res.redirect(302, `/tickets?coming-soon=${req.params.key}`);
  }

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
  const clickMeta = outboundClickMeta(req.params.group, req.params.key);
  const referer = req.get("referer");
  const pagePath = (() => {
    if (!referer) return `/go/${req.params.group}/${req.params.key}`;

    try {
      return new URL(referer).pathname;
    } catch {
      return `/go/${req.params.group}/${req.params.key}`;
    }
  })();

  const db = getDatabase();
  if (db) {
    await db.insert(linkClicks).values({
      id: requestId,
      anonymousSessionId: readQueryParam(req.query.session_id) || null,
      buttonName: clickMeta.buttonName,
      destinationUrl: trackedDestination,
      pagePath,
      eventSlug: readQueryParam(req.query.event_slug) || null,
      interestType: clickMeta.interestType,
      channel: clickMeta.channel,
      utmSource: readQueryParam(req.query.utm_source) || null,
      utmMedium: readQueryParam(req.query.utm_medium) || null,
      utmCampaign: readQueryParam(req.query.utm_campaign) || null,
      utmContent: readQueryParam(req.query.utm_content) || null,
      utmTerm: readQueryParam(req.query.utm_term) || null,
      metadata: {
        requestId,
        group: req.params.group,
        key: req.params.key,
        query: req.query,
        referer,
      },
    }).catch((error) => {
      logEvent("outbound.redirect_db_failed", {
        requestId,
        group: req.params.group,
        key: req.params.key,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    });
  }

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
