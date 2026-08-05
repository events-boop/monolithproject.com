import { SUNSETS_AUG22_TICKET_PATH } from "@shared/events/sunsets-ticketing";

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
 * SUN(SETS) II (Aug 22) checkout is live — every "tickets" surface goes
 * straight to the Aug 22 Posh rail. No Lake List middleman in the buying path.
 */
export const POSH_TICKET_URL = SUNSETS_AUG22_TICKET_PATH;
