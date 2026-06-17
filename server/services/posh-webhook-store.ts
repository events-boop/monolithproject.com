import { createHash, randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { getDatabase } from "../db/client";
import { contacts, events, poshBuyers, ticketOrders } from "../db/schema";
import { scrubEmail } from "../lib/security";

type PoshWebhookPayload = Record<string, unknown>;

type PoshItem = {
  item_id?: unknown;
  name?: unknown;
  price?: unknown;
  quantity?: unknown;
};

type PersistPoshWebhookResult = {
  contactId?: string;
  eventId?: string;
  ticketOrderId?: string;
  poshBuyerId?: string;
  status:
    | "purchase"
    | "pending"
    | "denied"
    | "refunded"
    | "cancelled"
    | "disputed"
    | "ignored";
};

function cleanString(value: unknown) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function cleanNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function cleanBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  return false;
}

function readTrackingQueryParam(payload: PoshWebhookPayload, key: string) {
  const direct = cleanString(payload[key]);
  if (direct) return direct;

  for (const field of [
    "tracking_link",
    "tracking_url",
    "source_url",
    "landing_page_url",
    "referrer",
  ]) {
    const raw = cleanString(payload[field]);
    if (!raw || !raw.includes("?")) continue;

    try {
      const url = new URL(raw, "https://posh.invalid");
      const value = url.searchParams.get(key)?.trim();
      if (value) return value;
    } catch {
      continue;
    }
  }

  return undefined;
}

function isoDate(value: unknown) {
  const text = cleanString(value);
  if (!text) return undefined;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function moneyToCents(value: unknown) {
  const amount = cleanNumber(value);
  if (amount === undefined) return 0;
  return Math.round(amount * 100);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

function hashId(prefix: string, value: string) {
  return `${prefix}_${createHash("sha256").update(value).digest("hex").slice(0, 40)}`;
}

function asItems(payload: PoshWebhookPayload): PoshItem[] {
  return Array.isArray(payload.items) ? (payload.items as PoshItem[]) : [];
}

function itemQuantity(item: PoshItem) {
  const quantity = cleanNumber(item.quantity);
  if (quantity && quantity > 0) return Math.min(100, Math.floor(quantity));
  return 1;
}

function totalQuantity(items: PoshItem[]) {
  if (!items.length) return 1;
  return Math.max(
    1,
    Math.min(
      100,
      items.reduce((sum, item) => sum + itemQuantity(item), 0)
    )
  );
}

function itemNames(items: PoshItem[]) {
  const names = items
    .map(item => cleanString(item.name))
    .filter((name): name is string => Boolean(name));
  return Array.from(new Set(names));
}

function deriveEventSlug(
  eventName: string,
  eventStart?: string,
  eventId?: string
) {
  const date = eventStart ? new Date(eventStart) : undefined;
  const year =
    date && !Number.isNaN(date.getTime()) ? date.getUTCFullYear() : undefined;
  const month =
    date && !Number.isNaN(date.getTime()) ? date.getUTCMonth() + 1 : undefined;
  const day =
    date && !Number.isNaN(date.getTime()) ? date.getUTCDate() : undefined;
  const normalizedName = eventName.toLowerCase();

  if (normalizedName.includes("chasing") && normalizedName.includes("sun")) {
    if (year === 2026 && month === 7 && day === 4)
      return "chasing-sunsets-july-4-2026";
    if (year === 2026 && month === 8 && day === 22)
      return "chasing-sunsets-august-22-2026";
    if (year === 2026 && month === 9 && day === 19)
      return "chasing-sunsets-september-19-2026";
  }

  const datePart =
    year && month && day
      ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      : undefined;
  const base = slugify([eventName, datePart].filter(Boolean).join(" "));
  return base || (eventId ? `posh-${eventId}` : "posh-event");
}

function deriveStatus(
  payload: PoshWebhookPayload
): PersistPoshWebhookResult["status"] {
  const type = cleanString(payload.type)?.toLowerCase() || "unknown";
  const action = cleanString(payload.action)?.toLowerCase();

  if (cleanBoolean(payload.disputed)) return "disputed";
  if (cleanBoolean(payload.cancelled)) return "cancelled";
  if (cleanBoolean(payload.refunded) || moneyToCents(payload.partialRefund) > 0)
    return "refunded";
  if (type === "pending_order_actioned" && action === "denied") return "denied";
  if (type === "new_order_request") return "pending";
  if (
    type === "new_order" ||
    (type === "pending_order_actioned" && action === "approved")
  )
    return "purchase";
  if (type === "order_status_update") return "purchase";
  return "ignored";
}

function shouldPersistRevenue(status: PersistPoshWebhookResult["status"]) {
  return (
    status === "purchase" ||
    status === "refunded" ||
    status === "cancelled" ||
    status === "disputed"
  );
}

export async function persistPoshWebhookPurchase(
  payload: PoshWebhookPayload,
  requestId: string
): Promise<PersistPoshWebhookResult> {
  const db = getDatabase();
  if (!db) return { status: "ignored" };

  const now = new Date().toISOString();
  const type = cleanString(payload.type) || "unknown";
  const status = deriveStatus(payload);
  const email = cleanString(payload.account_email);
  const normalizedEmail = email ? scrubEmail(email) : undefined;
  const firstName = cleanString(payload.account_first_name);
  const lastName = cleanString(payload.account_last_name);
  const phone = cleanString(payload.account_phone);
  const instagramHandle = cleanString(payload.account_instagram);
  const eventExternalId = cleanString(payload.event_id);
  const eventTitle = cleanString(payload.event_name) || "Posh Event";
  const eventStart = isoDate(payload.event_start);
  const eventSlug = deriveEventSlug(eventTitle, eventStart, eventExternalId);
  const eventId = eventExternalId
    ? `posh:${eventExternalId}`
    : hashId("posh_event", eventSlug);
  const items = asItems(payload);
  const names = itemNames(items);
  const firstItemId = cleanString(items[0]?.item_id);
  const ticketType = names.length ? names.join(", ") : undefined;
  const quantity = totalQuantity(items);
  const trackingLink = cleanString(payload.tracking_link);
  const orderNumber = cleanString(payload.order_number);
  const orderKey =
    trackingLink ||
    orderNumber ||
    createHash("sha256")
      .update(
        JSON.stringify({ type, eventExternalId, eventTitle, email, items })
      )
      .digest("hex");
  const purchaseDate =
    isoDate(payload.date_purchased) || isoDate(payload.update_date) || now;
  const subtotalCents = moneyToCents(payload.subtotal);
  const totalCents = moneyToCents(payload.total);
  const refundCents = moneyToCents(payload.partialRefund);
  const feesCents = Math.max(0, totalCents - subtotalCents);
  const grossRevenue = shouldPersistRevenue(status) ? totalCents : 0;
  const netRevenue = shouldPersistRevenue(status)
    ? Math.max(0, subtotalCents - refundCents)
    : 0;
  const promoCode = cleanString(payload.promo_code);
  const utmSource = readTrackingQueryParam(payload, "utm_source");
  const utmMedium = readTrackingQueryParam(payload, "utm_medium");
  const utmCampaign = readTrackingQueryParam(payload, "utm_campaign");
  const utmContent = readTrackingQueryParam(payload, "utm_content");
  const utmTerm = readTrackingQueryParam(payload, "utm_term");
  const anonymousSessionId = readTrackingQueryParam(payload, "session_id");
  const inboundEventSlug = readTrackingQueryParam(payload, "event_slug");

  let contactId: string | undefined;
  if (normalizedEmail) {
    const [contact] = await db
      .insert(contacts)
      .values({
        id: randomUUID(),
        email: normalizedEmail,
        emailNormalized: normalizedEmail,
        phone: phone || null,
        firstName: firstName || null,
        lastName: lastName || null,
        instagramHandle: instagramHandle || null,
        primarySource: "posh",
        sourceFirstSeen: utmSource || "posh",
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        utmTerm: utmTerm || null,
        lastSeenAt: now,
        consentEmail: true,
        consentSms: Boolean(phone),
        tags: ["posh", "buyer"],
        metadata: { requestId, lastPoshWebhookType: type, anonymousSessionId },
      })
      .onConflictDoUpdate({
        target: contacts.emailNormalized,
        set: {
          phone: phone || null,
          firstName: firstName || null,
          lastName: lastName || null,
          instagramHandle: instagramHandle || null,
          primarySource: "posh",
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null,
          utmContent: utmContent || null,
          utmTerm: utmTerm || null,
          lastSeenAt: now,
          consentEmail: true,
          consentSms: Boolean(phone),
          tags: ["posh", "buyer"],
          metadata: sql`${contacts.metadata} || ${JSON.stringify({
            lastRequestId: requestId,
            lastPoshWebhookType: type,
            lastPoshWebhookStatus: status,
            anonymousSessionId,
          })}::jsonb`,
        },
      })
      .returning({ id: contacts.id });

    contactId = contact?.id;
  }

  const [event] = await db
    .insert(events)
    .values({
      id: eventId,
      externalId: eventExternalId || null,
      series: eventTitle.toLowerCase().includes("chasing")
        ? "chasing-sunsets"
        : "posh",
      title: eventTitle,
      slug: eventSlug,
      startsAt: eventStart || null,
      status: "ticketing",
      updatedAt: now,
      metadata: {
        requestId,
        provider: "posh",
        eventEnd: isoDate(payload.event_end),
      },
    })
    .onConflictDoUpdate({
      target: events.slug,
      set: {
        externalId: eventExternalId || null,
        title: eventTitle,
        slug: eventSlug,
        startsAt: eventStart || null,
        status: "ticketing",
        updatedAt: now,
        metadata: sql`${events.metadata} || ${JSON.stringify({
          lastRequestId: requestId,
          provider: "posh",
          eventEnd: isoDate(payload.event_end),
        })}::jsonb`,
      },
    })
    .returning({ id: events.id });

  if (!shouldPersistRevenue(status)) {
    return { contactId, eventId: event?.id, status };
  }

  const ticketOrderId = hashId("ticket_order", `posh:${eventId}:${orderKey}`);
  const poshBuyerId = hashId(
    "posh_buyer",
    `posh:${eventId}:${orderKey}:${firstItemId || ticketType || "ticket"}`
  );
  const rawPayload = {
    ...payload,
    normalized: {
      requestId,
      status,
      eventSlug: inboundEventSlug || eventSlug,
      orderKey,
      anonymousSessionId,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      grossRevenueCents: grossRevenue,
      feesCents,
      netRevenueCents: netRevenue,
    },
  };

  const [ticketOrder] = await db
    .insert(ticketOrders)
    .values({
      id: ticketOrderId,
      contactId: contactId || null,
      eventSlug: inboundEventSlug || eventSlug,
      poshOrderId: orderNumber || trackingLink || null,
      ticketType: ticketType || null,
      quantity,
      grossRevenue,
      fees: feesCents,
      netRevenue,
      promoCode: promoCode || null,
      utmSource: utmSource || null,
      utmCampaign: utmCampaign || null,
      purchasedAt: purchaseDate,
      rawPayload,
    })
    .onConflictDoUpdate({
      target: ticketOrders.id,
      set: {
        contactId: contactId || null,
        eventSlug: inboundEventSlug || eventSlug,
        ticketType: ticketType || null,
        quantity,
        grossRevenue,
        fees: feesCents,
        netRevenue,
        promoCode: promoCode || null,
        utmSource: utmSource || null,
        utmCampaign: utmCampaign || null,
        purchasedAt: purchaseDate,
        rawPayload,
      },
    })
    .returning({ id: ticketOrders.id });

  const [poshBuyer] = await db
    .insert(poshBuyers)
    .values({
      id: poshBuyerId,
      contactId: contactId || null,
      eventId: event?.id || null,
      poshOrderId: orderNumber || trackingLink || null,
      poshTicketId: firstItemId || null,
      ticketType: ticketType || null,
      quantity,
      amountCents: netRevenue,
      purchasedAt: purchaseDate,
      rawPayload,
    })
    .onConflictDoUpdate({
      target: poshBuyers.id,
      set: {
        contactId: contactId || null,
        eventId: event?.id || null,
        poshOrderId: orderNumber || trackingLink || null,
        poshTicketId: firstItemId || null,
        ticketType: ticketType || null,
        quantity,
        amountCents: netRevenue,
        purchasedAt: purchaseDate,
        rawPayload,
      },
    })
    .returning({ id: poshBuyers.id });

  return {
    contactId,
    eventId: event?.id,
    ticketOrderId: ticketOrder?.id,
    poshBuyerId: poshBuyer?.id,
    status,
  };
}
