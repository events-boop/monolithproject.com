import { Router } from "express";
import { randomUUID } from "crypto";
import { logEvent } from "../lib/logging";
import {
  decorateOutboundDestination,
  resolveOutboundDestination,
  TICKETS_COMING_SOON,
} from "../lib/outbound";
import {
  SUNSETS_JULY4_EVENT_SLUG,
  SUNSETS_JULY4_TICKET_PATH,
  SUNSETS_JULY4_TICKET_UTMS,
  SUNSETS_JULY4_VANITY_TICKET_PATH,
  SUNSETS_LAKELIST_CANONICAL_PATH,
  SUNSETS_LAKELIST_PATH,
  SUNSETS_TICKET_CTA_LABEL,
  getSunsetsTicketRouteMeta,
  isSunsetsJuly4TicketRoute,
} from "../../shared/events/sunsets-ticketing";
import { getDatabase } from "../db/client";
import { linkClicks } from "../db/schema";

const router = Router();

function readQueryParam(value: unknown) {
  if (Array.isArray(value))
    return typeof value[0] === "string" ? value[0] : undefined;
  return typeof value === "string" ? value : undefined;
}

function renderSunsetsTicketsComingSoonPage(
  requestId: string,
  meta = {
    dateLabel: "July 4",
    title: "SUN(SETS) I — July 4th at Castaways",
  }
) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, noarchive, nosnippet" />
  <title>Tickets Coming Soon · SUN(SETS) · ${meta.dateLabel}</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100svh; display: grid; place-items: center; padding: 28px; background: #080a07; color: #f5f1e8; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { width: min(100%, 560px); border: 1px solid rgba(223,194,122,.26); background: rgba(16,20,15,.92); padding: clamp(24px, 6vw, 42px); box-shadow: 0 28px 80px rgba(0,0,0,.5); }
    .eyebrow { color: #dfc27a; font-size: 11px; font-weight: 900; letter-spacing: .24em; text-transform: uppercase; }
    h1 { margin: 14px 0 0; font-size: clamp(34px, 9vw, 58px); line-height: .95; letter-spacing: -.03em; }
    p { color: rgba(245,241,232,.72); line-height: 1.65; }
    .support { color: rgba(245,241,232,.48); font-size: 13px; }
    .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    a { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 16px; color: inherit; text-decoration: none; font-size: 12px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
    .primary { background: #dfc27a; color: #080a07; }
    .secondary { border: 1px solid rgba(245,241,232,.18); color: rgba(245,241,232,.78); }
    .request { margin-top: 24px; color: rgba(245,241,232,.34); font-size: 11px; }
  </style>
</head>
<body>
  <main>
    <div class="eyebrow">Official Tickets</div>
    <h1>Tickets coming soon.</h1>
    <p>${meta.title} tickets will move through the official Posh ticket page once the drop is live.</p>
    <p class="support">First access to ${meta.title}. Tickets powered by Posh. Only Posh or another validated Monolith ticket source will be used for live purchases.</p>
    <div class="actions">
      <a class="primary" href="/sunsets#lake-list">Join Lake List</a>
      <a class="secondary" href="/sunsets">Back to SUN(SETS)</a>
    </div>
    <div class="request">Request ${requestId}</div>
  </main>
</body>
</html>`;
}

function outboundClickMeta(group: string, key: string) {
  const normalizedGroup = group.trim().toLowerCase();
  const normalizedKey = key.trim().toLowerCase();
  const buttonName = `Outbound ${normalizedGroup}/${normalizedKey}`;

  if (normalizedGroup === "media" && normalizedKey === "sunsets-recap") {
    return {
      buttonName: "Watch Recap",
      channel: "YouTube",
      interestType: "recap_click",
    };
  }

  if (normalizedGroup === "media" && normalizedKey === "sunsets-soundcloud") {
    return {
      buttonName: "Follow the Sound",
      channel: "SoundCloud",
      interestType: "soundcloud_click",
    };
  }

  if (normalizedGroup === "gallery" && normalizedKey === "chasing-sunsets") {
    return {
      buttonName: "View Gallery",
      channel: "Pic-Time",
      interestType: "gallery_click",
    };
  }

  if (normalizedGroup === "gallery" && normalizedKey === "autograf-mar21") {
    return {
      buttonName: "View Autograf Gallery",
      channel: "Pixieset",
      interestType: "gallery_click",
    };
  }

  if (normalizedGroup === "forms" && normalizedKey === "sunsets-vip") {
    return {
      buttonName: "VIP / Tables",
      channel: "Fillout",
      interestType: "vip_click",
    };
  }

  if (normalizedGroup === "waitlist" && normalizedKey === "chasing-sunsets") {
    return {
      buttonName: "Join First Access",
      channel: "Laylo",
      interestType: "first_access_click",
    };
  }

  if (normalizedGroup === "waitlist" && normalizedKey === "sunsets-manychat") {
    return {
      buttonName: "ManyChat First Access",
      channel: "ManyChat",
      interestType: "manychat_first_access_click",
    };
  }

  if (normalizedGroup === "tickets") {
    return {
      buttonName: isSunsetsJuly4TicketRoute(normalizedGroup, normalizedKey)
        ? SUNSETS_TICKET_CTA_LABEL
        : "Tickets",
      channel: "Posh",
      interestType: "ticket_click",
    };
  }

  if (normalizedGroup === "social") {
    return {
      buttonName: normalizedKey,
      channel: normalizedKey,
      interestType: `${normalizedKey}_click`,
    };
  }

  return {
    buttonName,
    channel: normalizedGroup,
    interestType: "outbound_click",
  };
}

// Chasing Sun(Sets) 2026 launch vanity aliases. Production traffic is handled
// by the equivalent netlify.toml rules before reaching this function — these
// keep dev/preview behavior identical. Must stay above /go/:group/:key.
const VANITY_ALIASES: Record<string, string> = {
  [SUNSETS_JULY4_VANITY_TICKET_PATH]: SUNSETS_JULY4_TICKET_PATH,
  [SUNSETS_LAKELIST_PATH]: SUNSETS_LAKELIST_CANONICAL_PATH,
};

for (const [from, to] of Object.entries(VANITY_ALIASES)) {
  router.get(from, (req, res) => {
    const query = req.originalUrl.split("?")[1];
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");
    return res.redirect(302, query ? `${to}?${query}` : to);
  });
}

router.get("/go/:group/:key", async (req, res) => {
  const requestId = randomUUID();
  const destination = resolveOutboundDestination(
    req.params.group,
    req.params.key
  );
  const sunsetsTicketMeta = getSunsetsTicketRouteMeta(
    req.params.group,
    req.params.key
  );

  // "Tickets coming soon" — env var is unset for this specific event.
  if (destination === TICKETS_COMING_SOON) {
    logEvent("outbound.tickets_coming_soon", {
      requestId,
      group: req.params.group,
      key: req.params.key,
    });
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");
    return res
      .status(200)
      .send(
        renderSunsetsTicketsComingSoonPage(
          requestId,
          sunsetsTicketMeta ?? undefined
        )
      );
  }

  if (!destination) {
    logEvent("outbound.redirect_missing", {
      requestId,
      group: req.params.group,
      key: req.params.key,
    });

    if (sunsetsTicketMeta) {
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, noarchive, nosnippet");
      return res
        .status(200)
        .send(renderSunsetsTicketsComingSoonPage(requestId, sunsetsTicketMeta));
    }

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

  const isSunsetsTicket = isSunsetsJuly4TicketRoute(
    req.params.group,
    req.params.key
  );
  const trackedDestination = decorateOutboundDestination(
    destination,
    req.query,
    {
      group: req.params.group,
      key: req.params.key,
    }
  );
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
    await db
      .insert(linkClicks)
      .values({
        id: requestId,
        anonymousSessionId: readQueryParam(req.query.session_id) || null,
        buttonName: clickMeta.buttonName,
        destinationUrl: trackedDestination,
        pagePath,
        eventSlug:
          readQueryParam(req.query.event_slug) ||
          (isSunsetsTicket ? SUNSETS_JULY4_EVENT_SLUG : null),
        interestType: clickMeta.interestType,
        channel: clickMeta.channel,
        utmSource:
          readQueryParam(req.query.utm_source) ||
          (isSunsetsTicket ? SUNSETS_JULY4_TICKET_UTMS.utm_source : null),
        utmMedium:
          readQueryParam(req.query.utm_medium) ||
          (isSunsetsTicket ? SUNSETS_JULY4_TICKET_UTMS.utm_medium : null),
        utmCampaign:
          readQueryParam(req.query.utm_campaign) ||
          (isSunsetsTicket ? SUNSETS_JULY4_TICKET_UTMS.utm_campaign : null),
        utmContent:
          readQueryParam(req.query.utm_content) ||
          (isSunsetsTicket ? SUNSETS_JULY4_TICKET_UTMS.utm_content : null),
        utmTerm: readQueryParam(req.query.utm_term) || null,
        metadata: {
          requestId,
          group: req.params.group,
          key: req.params.key,
          query: req.query,
          referer,
        },
      })
      .catch(error => {
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
