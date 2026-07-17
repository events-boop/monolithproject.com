/** The three live event series produced by Monolith Project. */
export type EventSeries =
  | "chasing-sunsets"
  | "untold-story"
  | "monolith-project";

/** Marketing funnel states mapped to specific event series. */
export type ActiveFunnel =
  | "waitlist"
  | "waitlist-chasing"
  | "waitlist-untold"
  | "giveaway"
  | "coordinates";

/** Placement slots across the site for featuring events. */
export type SiteExperienceSlot =
  | "hero"
  | "banner"
  | "funnel"
  | "ticket"
  | "guide";

/** Third-party funnel / ticketing platforms integrated with the site. */
export type FunnelTool = "laylo" | "posh" | "fillout";

export interface EventCta {
  label: string;
  href: string;
  tool: FunnelTool;
  isExternal: boolean;
}

/**
 * Publish gates — the 11-point QA checklist as data instead of memory.
 * scripts/validate_events.mts enforces these at build time: an event
 * cannot ship "on-sale" until every gate is flipped.
 */
export interface EventGates {
  /** Flyer + square + story + OG image uploaded */
  creativeReady: boolean;
  /** Pixel/GA/UTM tracking QA passed */
  trackingQA: boolean;
  /** Posh checkout created and its URL pasted into ticketUrl */
  poshLinked: boolean;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  icon: "ticket" | "star" | "crown";
  available: boolean;
  highlight?: boolean;
}

export interface EventArtistImage {
  src: string;
  alt: string;
  artist: string;
}

/** A scheduled live event with its venue, ticketing, creative, and funnel configuration. */
export interface ScheduledEvent {
  id: string;
  series: EventSeries;
  episode: string;
  title: string;
  slug?: string;
  subtitle?: string;
  date: string;
  time: string;
  startsAt?: string;
  endsAt?: string;
  doors?: string;
  venue: string;
  location: string;
  lineup?: string;
  image?: string;
  /** Confirmed public artist portraits used beside calendar listings. */
  artistImages?: EventArtistImage[];
  /**
   * The one lever that controls how an event appears everywhere.
   *   draft       — internal only; never enters any public payload
   *   hidden      — resolves on direct event pages, excluded from lists
   *   coming-soon — announced; funnel CTA (Lake List), no checkout
   *   on-sale     — checkout live (validator requires all gates passed)
   *   sold-out    — checkout closed, SMS/waitlist CTA
   *   past        — archive mode; recap/gallery is the CTA
   */
  status: "draft" | "hidden" | "on-sale" | "coming-soon" | "sold-out" | "past";
  /** One featured event at a time — gets the flagship card treatment. */
  featured?: boolean;
  inventoryState?: "normal" | "low";
  capacity?: string;
  format?: string;
  dress?: string;
  sound?: string;
  description?: string;
  age?: string;
  ticketUrl?: string;
  startingPrice?: number;
  ticketTiers?: TicketTier[];
  headline?: string;
  mainExperience?: string;
  experienceIntro?: string;
  whatToExpect?: string[];
  tablePackages?: string[];
  tableReservationEmail?: string;
  faqs?: Array<{ q: string; a: string }>;
  photoNotice?: string;
  eventNotice?: string;
  activeFunnels?: ActiveFunnel[];
  primaryCta?: EventCta;
  recentlyDropped?: boolean;
  layloDropId?: string;
  /** Publish gates enforced by scripts/validate_events.mts */
  gates?: EventGates;
  /** Archive collection slug in galleryData — the "Relive It" target for past events */
  archiveSlug?: string;
  /** Recap page/video URL for past events */
  recapUrl?: string;
}

export type PublicSiteData = {
  path: string;
  events: ScheduledEvent[];
  featuredEvents: Partial<Record<SiteExperienceSlot, ScheduledEvent>>;
};
