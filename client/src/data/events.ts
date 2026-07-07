import { SUNSETS_LAKELIST_CANONICAL_PATH } from "@shared/events/sunsets-ticketing";

export type {
  ActiveFunnel,
  EventSeries,
  PublicSiteData,
  ScheduledEvent,
  SiteExperienceSlot,
  TicketTier,
} from "@shared/events/types";

/** Core Socials & Links */
export const LAYLO_URL = "/go/waitlist/chasing-sunsets";
export const SOUNDCLOUD_URL = "https://soundcloud.com/monolithproject";
export const TIKTOK_URL = "https://tiktok.com/@monolithproject";
export const INSTAGRAM_MONOLITH =
  "https://instagram.com/monolithproject.events";
export const INSTAGRAM_UNTOLD = "https://instagram.com/untoldstory.music";
export const INSTAGRAM_SUNSETS = "https://instagram.com/chasingsunsets.music";

/**
 * Active audience gateway for the next public drop.
 * SUN(SETS) II (Aug 22) checkout isn't live yet — every "tickets" surface
 * funnels to the Lake List until the Aug 22 record passes its gates.
 */
export const POSH_TICKET_URL = SUNSETS_LAKELIST_CANONICAL_PATH;
