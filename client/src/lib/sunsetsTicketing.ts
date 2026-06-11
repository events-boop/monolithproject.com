import {
  SUNSETS_2026_SEASON_CHAPTERS,
  SUNSETS_2026_SEASON_PASS,
  SUNSETS_2026_SEASON_PASS_CTA_LABEL,
  SUNSETS_JULY4_ADMISSION_TIERS,
  SUNSETS_JULY4_EVENT_ADDRESS,
  SUNSETS_JULY4_EVENT_DATE,
  SUNSETS_JULY4_EVENT_LOCATION,
  SUNSETS_JULY4_EVENT_SLUG,
  SUNSETS_JULY4_EVENT_TIME,
  SUNSETS_JULY4_EVENT_TITLE,
  SUNSETS_JULY4_EVENT_VENUE,
  SUNSETS_JULY4_FIRST_ACCESS_CODE,
  SUNSETS_JULY4_LINEUP,
  SUNSETS_JULY4_REVENUE,
  SUNSETS_JULY4_SET_TIMES,
  SUNSETS_JULY4_TABLE_MINIMUM,
  SUNSETS_JULY4_TABLE_RAIL,
  SUNSETS_JULY4_TICKET_PATH,
  SUNSETS_JULY4_TOTAL_CAPACITY,
  SUNSETS_JULY4_VANITY_TICKET_PATH,
  SUNSETS_LAKELIST_PATH,
  SUNSETS_PRELAUNCH_LOCKED,
  SUNSETS_TICKET_CTA_EVENT,
  SUNSETS_TICKET_CTA_LABEL,
  SUNSETS_TICKET_CTA_PROPERTIES,
  SUNSETS_TICKET_CTA_SUPPORT,
} from "@shared/events/sunsets-ticketing";
import { capturePostHogEvent } from "./posthog";

export {
  SUNSETS_2026_SEASON_CHAPTERS,
  SUNSETS_2026_SEASON_PASS,
  SUNSETS_2026_SEASON_PASS_CTA_LABEL,
  SUNSETS_JULY4_ADMISSION_TIERS,
  SUNSETS_JULY4_EVENT_ADDRESS,
  SUNSETS_JULY4_EVENT_DATE,
  SUNSETS_JULY4_EVENT_LOCATION,
  SUNSETS_JULY4_EVENT_SLUG,
  SUNSETS_JULY4_EVENT_TIME,
  SUNSETS_JULY4_EVENT_TITLE,
  SUNSETS_JULY4_EVENT_VENUE,
  SUNSETS_JULY4_FIRST_ACCESS_CODE,
  SUNSETS_JULY4_LINEUP,
  SUNSETS_JULY4_REVENUE,
  SUNSETS_JULY4_SET_TIMES,
  SUNSETS_JULY4_TABLE_MINIMUM,
  SUNSETS_JULY4_TABLE_RAIL,
  SUNSETS_JULY4_TICKET_PATH,
  SUNSETS_JULY4_TOTAL_CAPACITY,
  SUNSETS_JULY4_VANITY_TICKET_PATH,
  SUNSETS_LAKELIST_PATH,
  SUNSETS_PRELAUNCH_LOCKED,
  SUNSETS_TICKET_CTA_EVENT,
  SUNSETS_TICKET_CTA_LABEL,
  SUNSETS_TICKET_CTA_SUPPORT,
};

export type TicketCtaPosition =
  | "primary"
  | "chapter"
  | "footer"
  | "secondary"
  | "season_pass";

interface TicketCtaClickOptions {
  ctaPosition?: TicketCtaPosition;
  destinationUrl?: string;
  pagePath?: string;
  sourcePage?: string;
}

export function captureSunsetsTicketCtaClick({
  ctaPosition = "primary",
  destinationUrl = SUNSETS_JULY4_TICKET_PATH,
  pagePath,
  sourcePage = SUNSETS_TICKET_CTA_PROPERTIES.source_page,
}: TicketCtaClickOptions = {}) {
  if (typeof window === "undefined") return;

  const properties = {
    ...SUNSETS_TICKET_CTA_PROPERTIES,
    source_page: sourcePage,
    cta_position: ctaPosition,
    destination_url: destinationUrl,
    page_path: pagePath,
  };
  const win = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  };

  win.gtag?.("event", SUNSETS_TICKET_CTA_EVENT, properties);
  win.dataLayer?.push({ event: SUNSETS_TICKET_CTA_EVENT, ...properties });
  capturePostHogEvent(SUNSETS_TICKET_CTA_EVENT, properties);
}
