import type { TicketTier } from "./types";

export const SUNSETS_JULY4_EVENT_SLUG = "chasing-sunsets-july-4-2026";
export const SUNSETS_JULY4_EVENT_DATE = "2026-07-04";
export const SUNSETS_JULY4_EVENT_TITLE = "SUN(SETS) I — July 4th at Castaways";
export const SUNSETS_JULY4_EVENT_TIME = "12:00 PM — 10:00 PM";
export const SUNSETS_JULY4_EVENT_VENUE = "Castaways Beach Club";
export const SUNSETS_JULY4_EVENT_LOCATION = "North Avenue Beach, Chicago";
export const SUNSETS_JULY4_EVENT_ADDRESS =
  "1603 N Lake Shore Dr, Chicago, IL 60614";
export const SUNSETS_JULY4_TOTAL_CAPACITY = 1200;
export const SUNSETS_JULY4_FIRST_ACCESS_CODE = "SUNSET26";
export const SUNSETS_JULY4_TABLE_MINIMUM = "$2,000 minimum";
// Flipped false 2026-06-11: July 4 tickets are publicly on sale (owner brief).
// While true this hid prices/counts sitewide and redirected /tickets → /sunsets.
export const SUNSETS_PRELAUNCH_LOCKED = false;

export const SUNSETS_JULY4_TICKET_GROUP = "tickets";
export const SUNSETS_JULY4_TICKET_KEY = "css-jul04";
export const SUNSETS_JULY4_TICKET_PATH = "/go/tickets/css-jul04";
// Launch vanity aliases used on the sunsets.vip landing page and printed
// materials. Redirected to the canonical /go destinations by netlify.toml and
// server/routes/outbound.ts — keep all three places in sync.
export const SUNSETS_JULY4_VANITY_TICKET_PATH = "/go/tickets/sunsets-july4";
// Season Pass purchase rail. Resolves via OUTBOUND_TICKETS_SEASON_PASS_URL;
// shows the branded "coming soon" page until that env var is set.
export const SUNSETS_SEASON_PASS_TICKET_KEY = "season-pass";
export const SUNSETS_SEASON_PASS_PATH = "/go/tickets/season-pass";
export const SUNSETS_LAKELIST_PATH = "/go/lakelist";
export const SUNSETS_LAKELIST_CANONICAL_PATH = "/go/waitlist/chasing-sunsets";
export const SUNSETS_AUG22_TICKET_KEY = "css-aug22";
export const SUNSETS_AUG22_TICKET_PATH = "/go/tickets/css-aug22";
export const SUNSETS_SEP19_TICKET_KEY = "css-sep19";
export const SUNSETS_SEP19_TICKET_PATH = "/go/tickets/css-sep19";

export const SUNSETS_TICKET_CTA_EVENT = "TicketCTA_Click";
export const SUNSETS_TICKET_CTA_LABEL = SUNSETS_PRELAUNCH_LOCKED
  ? "JOIN THE LAKE LIST"
  : "BUY TICKETS — JULY 4";
export const SUNSETS_TICKET_CTA_SUPPORT =
  "Official ticket source powered by Posh.";
export const SUNSETS_2026_SEASON_PASS_CTA_LABEL = "CLAIM SEASON PASS";

export const SUNSETS_2026_SEASON_CHAPTERS = [
  {
    id: "sunsets-i",
    title: "SUN(SETS) I",
    date: "July 4, 2026",
    eventDate: SUNSETS_JULY4_EVENT_DATE,
    eventSlug: SUNSETS_JULY4_EVENT_SLUG,
    venue: "Castaways Chicago",
    lineup: "Autograf x Kiko Franco x Jewels",
    ticketPath: SUNSETS_JULY4_TICKET_PATH,
  },
  {
    id: "sunsets-ii",
    title: "SUN(SETS) II",
    date: "August 22, 2026",
    eventDate: "2026-08-22",
    eventSlug: "chasing-sunsets-august-22-2026",
    venue: "Castaways Chicago",
    lineup: "Lineup TBA",
    ticketPath: SUNSETS_AUG22_TICKET_PATH,
  },
  {
    id: "sunsets-iii",
    title: "SUN(SETS) III",
    date: "September 19, 2026",
    eventDate: "2026-09-19",
    eventSlug: "chasing-sunsets-september-19-2026",
    venue: "Castaways Chicago",
    lineup: "Lineup TBA",
    ticketPath: SUNSETS_SEP19_TICKET_PATH,
  },
] as const;

export const SUNSETS_2026_SEASON_PASS = {
  name: "SUN(SETS) 2026 Season Pass",
  summary: "Three dates. One lakefront season.",
  tierName: "Season Pass · GA",
  // GA is the entry tier; VIP season pass is $200. `priceLabel` stays the
  // single headline (GA) for surfaces that show one price.
  priceLabel: "$120",
  gaPriceLabel: "$120",
  vipPriceLabel: "$200",
  quantityLabel: "Limited",
  description:
    "Includes access to all three SUN(SETS) 2026 dates, first RSVP priority, insider community access, and early drops.",
  features: [
    "Access to all three SUN(SETS) 2026 dates",
    "First RSVP priority",
    "Insider community access",
    "Early drops",
  ],
} as const;

export const SUNSETS_TICKET_CTA_PROPERTIES = {
  event_slug: SUNSETS_JULY4_EVENT_SLUG,
  source_page: "sunsets.vip",
  destination: "posh",
  cta_position: "primary",
} as const;

export const SUNSETS_JULY4_TICKET_UTMS = {
  utm_source: "sunsetsvip",
  utm_medium: "linkinbio",
  utm_campaign: "sunsets_2026_07_04",
  utm_content: "buy_tickets_primary",
} as const;

// Lineup confirmed for public announcement — June 2026. The headline trio
// (Autograf, Kiko Franco, Jewels (Le Yora)) leads the July 4 billing.
export const SUNSETS_JULY4_LINEUP = [
  "Autograf",
  "Kiko Franco",
  "Jewels (Le Yora)",
  "Amari",
  "Gianni Blu",
  "Jerome b3b Colin b3b Nomar",
  "Frank Bono",
  "Erik The DJ",
] as const;
// The three top-billed names featured in announcements + the /sunsets hero.
export const SUNSETS_JULY4_HEADLINERS = [
  "Autograf",
  "Kiko Franco",
  "Jewels (Le Yora)",
] as const;

export const SUNSETS_JULY4_SET_TIMES = [
  { time: "12:00 PM", label: "Doors / Event Begins" },
  { time: "2:00 PM — 3:00 PM", label: "Jerome b3b Colin b3b Nomar" },
  { time: "3:00 PM — 4:00 PM", label: "Erik The DJ" },
  { time: "4:00 PM — 5:00 PM", label: "Frank Bono" },
  { time: "5:00 PM — 6:00 PM", label: "Gianni Blu" },
  { time: "6:00 PM — 7:00 PM", label: "Jewels (Le Yora)" },
  { time: "7:00 PM — 8:15 PM", label: "Amari" },
  { time: "8:15 PM — 9:30 PM", label: "Kiko Franco" },
  { time: "9:30 PM — 10:00 PM", label: "Autograf — Closing Set" },
  { time: "10:00 PM", label: "Event Ends" },
] as const;

export type SunsetsTicketInventoryTier = {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  quantityLabel: string;
  admissionLabel: string;
  visibility: string;
  timing: string;
  purpose: string;
  description: string;
  rule?: string;
  features: string[];
  icon: TicketTier["icon"];
  available: boolean;
  highlight?: boolean;
};

export const SUNSETS_JULY4_ADMISSION_TIERS: SunsetsTicketInventoryTier[] = [
  {
    id: "before-2pm-arrival",
    name: "Before 2PM Arrival Pass",
    price: 20,
    priceLabel: "$20",
    quantityLabel: "100 tickets",
    admissionLabel: "100 admissions",
    visibility: "Public early release",
    timing: "Valid only before 2:00 PM check-in",
    purpose: "Fill the venue early and start daytime energy.",
    description:
      "Early arrival pass for SUN(SETS) I. Valid for entry before 2:00 PM only.",
    rule: "Guests must be checked in by 2:00 PM. Late arrival is not guaranteed entry and may require an upgrade, subject to capacity and venue discretion.",
    features: [
      "General admission",
      "Before 2:00 PM check-in required",
      "Capped at 100 tickets",
    ],
    icon: "ticket",
    available: true,
  },
  {
    id: "first-access-lake-list",
    name: "First Access — Lake List",
    price: 30,
    priceLabel: "$30",
    quantityLabel: "150 tickets",
    admissionLabel: "150 admissions",
    visibility: "Hidden / code required",
    timing: "Phase 3 first access window",
    purpose: "Reward Lake List signups before public release.",
    description: "Exclusive early access for the Lake List community.",
    rule: "Access code: SUNSET26.",
    features: ["Hidden tier", "Code SUNSET26", "Lake List priority"],
    icon: "star",
    available: true,
    highlight: true,
  },
  {
    id: "ga-tier-1",
    name: "General Admission — Tier 1",
    price: 45,
    priceLabel: "$45",
    quantityLabel: "250 tickets",
    admissionLabel: "250 admissions",
    visibility: "Public",
    timing: "Phase 4 public release",
    purpose: "Main public release entry tier.",
    description:
      "Standard entry for SUN(SETS) I. Price increases when this tier sells out.",
    features: [
      "General admission",
      "Public release",
      "Price moves after sellout",
    ],
    icon: "ticket",
    available: true,
  },
  {
    id: "ga-tier-2",
    name: "General Admission — Tier 2",
    price: 55,
    priceLabel: "$55",
    quantityLabel: "340 tickets",
    admissionLabel: "340 admissions",
    visibility: "Public",
    timing: "Opens when Tier 1 sells out",
    purpose: "Momentum tier after initial demand is confirmed.",
    description:
      "Standard entry for SUN(SETS) I. Price increases when this tier sells out.",
    features: ["General admission", "Sequential release", "Main momentum tier"],
    icon: "star",
    available: false,
  },
  {
    id: "ga-final-tier",
    name: "General Admission — Final Tier",
    price: 65,
    priceLabel: "$65",
    quantityLabel: "200 tickets",
    admissionLabel: "200 admissions",
    visibility: "Public",
    timing: "Opens when Tier 2 sells out",
    purpose: "Final public allocation as capacity tightens.",
    description: "Final allocation of standard entry tickets.",
    features: ["General admission", "Final allocation", "Last public tier"],
    icon: "crown",
    available: false,
  },
  {
    id: "four-pack-group-bundle",
    name: "The 4-Pack — Group Bundle",
    price: 160,
    priceLabel: "$160",
    quantityLabel: "25 bundles",
    admissionLabel: "100 admissions",
    visibility: "Public",
    timing: "Phase 4 public release",
    purpose: "Capture group momentum and encourage crews to commit together.",
    description:
      "Bring the crew. Includes 4 General Admission tickets at a preferred rate.",
    rule: "$40 effective price per ticket. Preferred setup issues 4 individual scannable tickets.",
    features: ["4 GA admissions", "$40 per ticket", "Group bundle"],
    icon: "star",
    available: true,
  },
];

export const SUNSETS_JULY4_TABLE_RAIL = {
  name: "Table / Cabana Reservation Request",
  priceLabel: "$2,000+ minimum",
  quantityLabel: "6 cabanas + limited tables",
  admissionLabel: "60 guest hold",
  visibility: "Public inquiry rail",
  cta: "/vip",
  description:
    "Limited tables and 6 premium cabanas are available for SUN(SETS) I. Tables and cabanas start at a $2,000 minimum and include reserved space for your group.",
  rule: "This is an inquiry or deposit path, not a free public admission ticket.",
} as const;

export const SUNSETS_JULY4_REVENUE = {
  ticketRevenuePotential: "$53,450",
  premiumMinimumSpendPotential: "$12,000",
  combinedMinimumPotential: "$65,450",
} as const;

export function getSunsetsJuly4ScheduledTicketTiers(): TicketTier[] {
  return SUNSETS_JULY4_ADMISSION_TIERS.map(tier => ({
    id: tier.id,
    name: tier.name,
    price: tier.price,
    description: tier.description,
    features: tier.features,
    icon: tier.icon,
    available: tier.available,
    highlight: tier.highlight,
  }));
}

export function isSunsetsJuly4TicketRoute(group: string, key: string) {
  return (
    group.trim().toLowerCase() === SUNSETS_JULY4_TICKET_GROUP &&
    key.trim().toLowerCase() === SUNSETS_JULY4_TICKET_KEY
  );
}

export type SunsetsTicketRouteMeta = {
  eventSlug: string;
  dateLabel: string;
  title: string;
};

export function getSunsetsTicketRouteMeta(
  group: string,
  key: string
): SunsetsTicketRouteMeta | null {
  if (group.trim().toLowerCase() !== SUNSETS_JULY4_TICKET_GROUP) return null;

  switch (key.trim().toLowerCase()) {
    case SUNSETS_JULY4_TICKET_KEY:
      return {
        eventSlug: SUNSETS_JULY4_EVENT_SLUG,
        dateLabel: "July 4",
        title: SUNSETS_JULY4_EVENT_TITLE,
      };
    case SUNSETS_AUG22_TICKET_KEY:
      return {
        eventSlug: "chasing-sunsets-august-22-2026",
        dateLabel: "August 22",
        title: "SUN(SETS) II — August 22nd at Castaways",
      };
    case SUNSETS_SEP19_TICKET_KEY:
      return {
        eventSlug: "chasing-sunsets-september-19-2026",
        dateLabel: "September 19",
        title: "SUN(SETS) III — September 19th at Castaways",
      };
    case SUNSETS_SEASON_PASS_TICKET_KEY:
      return {
        eventSlug: SUNSETS_JULY4_EVENT_SLUG,
        dateLabel: "Season Pass",
        title: "SUN(SETS) 2026 Season Pass",
      };
    default:
      return null;
  }
}
