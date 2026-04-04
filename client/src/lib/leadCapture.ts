import type { ScheduledEvent } from "@/data/events";

interface FunnelLeadFieldsOptions {
  funnelId: string;
  offerId: string;
  event?: ScheduledEvent;
  eventSeries?: string;
  eventTitle?: string;
  interestTags?: string[];
}

function uniqueStrings(values: Array<string | undefined>) {
  return Array.from(new Set(values.map((value) => value?.trim()).filter(Boolean) as string[]));
}

export function splitFullName(fullName: string) {
  const [firstName, ...lastParts] = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: firstName || undefined,
    lastName: lastParts.length ? lastParts.join(" ") : undefined,
  };
}

export function normalizeInstagramHandle(value: string) {
  return value.trim().replace(/^@+/, "");
}

export function buildLeadIdempotencyKey(source: string, email: string, eventId?: string) {
  return `${source}:${eventId || "site"}:${email.trim().toLowerCase()}`;
}

export function buildFunnelLeadFields({
  funnelId,
  offerId,
  event,
  eventSeries,
  eventTitle,
  interestTags,
}: FunnelLeadFieldsOptions) {
  const tags = uniqueStrings([
    funnelId,
    offerId,
    event?.series,
    eventSeries,
    ...(interestTags || []),
  ]);

  return {
    funnelId,
    offerId,
    eventInterest: event?.id,
    eventSeries: event?.series || eventSeries,
    eventTitle: event?.headline || event?.title || eventTitle,
    interestTags: tags.length ? tags : undefined,
  };
}

export function buildCommunityShareUrl(event?: ScheduledEvent, pathname = "/tickets") {
  const baseUrl =
    typeof window !== "undefined"
      ? new URL(pathname, window.location.origin)
      : new URL(pathname, "https://monolithproject.com");

  if (event?.id) {
    baseUrl.searchParams.set("event", event.id);
    baseUrl.searchParams.set("utm_campaign", event.id);
  } else {
    baseUrl.searchParams.set("utm_campaign", "community-share");
  }

  baseUrl.searchParams.set("utm_source", "community");
  baseUrl.searchParams.set("utm_medium", "share");

  return baseUrl.toString();
}
