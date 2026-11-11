import { PUBLISHED_CTA_LABELS, getPublishedEventState } from "./publishedState";
import {
  SUNSETS_JULY4_TICKET_PATH,
  SUNSETS_TICKET_CTA_LABEL,
} from "./sunsets-ticketing";
import type { EventCta, ScheduledEvent } from "./types";
import { ROUTES } from "../routes";

const CTA_LABELS = {
  schedule: "See The Schedule",
  claimLast: "Final Release",
} as const;

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href) || href.startsWith("/go/");
}

function isEventLowInventory(event?: ScheduledEvent | null) {
  if (!event) return false;
  if (event.inventoryState === "low") return true;

  const capacity = event.capacity?.toLowerCase();
  if (!capacity) return false;

  return /(low|last|final|sold out 9\d%|9\d%\s+sold)/.test(capacity);
}

export function resolveEventPrimaryCta(
  event?: ScheduledEvent | null,
  now: Date = new Date()
): EventCta {
  const fallback: EventCta = {
    label: CTA_LABELS.schedule,
    href: "/schedule",
    tool: "posh",
    isExternal: false,
  };

  if (!event) return fallback;

  // One projection decides the state; this function only maps it to a link.
  const state = getPublishedEventState(event, now);

  switch (state.kind) {
    case "unpublished":
      return fallback;

    case "postponed":
    case "cancelled":
      return {
        label: PUBLISHED_CTA_LABELS[state.cta],
        href: state.statusUrl,
        tool: "posh",
        isExternal: false,
      };

    case "past":
      return {
        label: PUBLISHED_CTA_LABELS[state.cta],
        href: state.archiveUrl,
        tool: "laylo",
        isExternal: false,
      };

    case "sold-out":
    case "first-access":
      return {
        label: PUBLISHED_CTA_LABELS[state.cta],
        href: ROUTES.newsletter,
        tool: "laylo",
        isExternal: false,
      };

    case "on-sale": {
      const href = state.ticketUrl;
      const isJuly4 =
        href === SUNSETS_JULY4_TICKET_PATH || event.id === "css-jul04";
      const label = isEventLowInventory(event)
        ? event.id === "css-jul04"
          ? SUNSETS_TICKET_CTA_LABEL
          : CTA_LABELS.claimLast
        : isJuly4
          ? SUNSETS_TICKET_CTA_LABEL
          : PUBLISHED_CTA_LABELS[state.cta];
      return {
        label,
        href,
        tool: href.startsWith("https://allevents.in/") ? "allevents" : "posh",
        isExternal: isExternalHref(href),
      };
    }
  }
}
