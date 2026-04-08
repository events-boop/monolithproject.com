export type EventSeries =
  | "chasing-sunsets"
  | "untold-story"
  | "monolith-project";

export type ActiveFunnel =
  | "waitlist"
  | "waitlist-chasing"
  | "waitlist-untold"
  | "giveaway"
  | "coordinates";

export type SiteExperienceSlot =
  | "hero"
  | "banner"
  | "funnel"
  | "ticket"
  | "guide";

export type FunnelTool = "laylo" | "posh" | "fillout";

export interface EventCta {
  label: string;
  href: string;
  tool: FunnelTool;
  isExternal: boolean;
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
  status: "on-sale" | "coming-soon" | "sold-out";
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
}

export type PublicSiteData = {
  path: string;
  events: ScheduledEvent[];
  featuredEvents: Partial<Record<SiteExperienceSlot, ScheduledEvent>>;
};
