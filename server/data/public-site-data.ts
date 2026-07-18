import {
  SUNSETS_JULY4_EVENT_ADDRESS,
  SUNSETS_JULY4_EVENT_LOCATION,
  SUNSETS_JULY4_EVENT_TIME,
  SUNSETS_JULY4_EVENT_TITLE,
  SUNSETS_JULY4_EVENT_VENUE,
  SUNSETS_JULY4_LINEUP,
  SUNSETS_JULY4_SET_TIMES,
  SUNSETS_JULY4_TABLE_RAIL,
  SUNSETS_JULY4_TOTAL_CAPACITY,
  SUNSETS_PRELAUNCH_LOCKED,
} from "../../shared/events/sunsets-ticketing";
import type {
  EventSeries,
  PublicSiteData,
  ScheduledEvent,
  SiteExperienceSlot,
  VipPackage,
} from "../../shared/events/types";
import { resolveEventPrimaryCta } from "../lib/public-cta";

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
 * SUN(SETS) II tickets are not live yet, so this points at the Lake List
 * until the Aug 22 Posh checkout passes its gates (then: ticket path).
 */
export const POSH_TICKET_URL = LAYLO_URL;

const CASTAWAYS_VIP_EMAIL = "vip@chasingsunsets.music";

/**
 * Inventory belongs to the event record. The 3D registry only describes
 * geometry, so availability can change without rebuilding a venue scene.
 */
function buildCastawaysVipPackages(
  availability: Partial<
    Record<VipPackage["size"], VipPackage["availability"]>
  > = {}
): VipPackage[] {
  return [
    {
      size: "small",
      name: "Small",
      guestRange: "2–6 guests",
      description: "A reserved setup for an intimate lakefront group.",
      features: [
        "Priority check-in",
        "Reserved VIP space",
        "Dedicated venue service",
      ],
      availability: availability.small ?? "available",
      minimumSpend: "Host quote",
    },
    {
      size: "medium",
      name: "Medium",
      guestRange: "7–10 guests",
      description: "More room for the crew with premium placement when open.",
      features: [
        "Priority check-in",
        "Expanded reserved space",
        "Dedicated venue service",
      ],
      availability: availability.medium ?? "available",
      minimumSpend: "Host quote",
      highlight: true,
    },
    {
      size: "large",
      name: "Large",
      guestRange: "11–15 guests",
      description: "A full cabana or premium section for the complete group.",
      features: [
        "Admission for up to 15 guests",
        "Reserved cabana or premium section",
        "Dedicated venue service",
      ],
      availability: availability.large ?? "limited",
      minimumSpend: "$2,000 minimum spend",
    },
  ];
}

const EVENT_CATALOG: ScheduledEvent[] = [
  {
    id: "us-s3e1",
    series: "untold-story",
    episode: "SEASON III · EPISODE I",
    title: "THE OPENING",
    date: "March 21, 2026",
    time: "Doors Closed",
    venue: "Alhambra Palace",
    location: "Chicago, IL",
    status: "past",
    image: "/images/untold-story-moody.webp",
  },
  {
    id: "us-s3e3",
    series: "untold-story",
    episode: "CHAPTER IV",
    title: "UNTOLD STORY IV: ERAN HERSH",
    subtitle: "Untold Story IV",
    headline: "UNTOLD STORY IV: ERAN HERSH",
    slug: "eran-hersh-untold-story-iv",
    date: "May 16, 2026",
    time: "9:00 PM — Late",
    startsAt: "2026-05-16T21:00:00-05:00",
    endsAt: "2026-05-17T03:00:00-05:00",
    doors: "9:00 PM",
    mainExperience: "10:30 PM — Late",
    venue: "Hideaway",
    location: "Chicago, IL",
    lineup: "Eran Hersh (Headliner) · Support TBD",
    status: "past",
    image: "/images/eran-hersh-untold-story-iv.jpg",
    format: "Late Night · Immersive · Intimate",
    dress: "Elevated nightlife attire",
    sound: "Afro House · Melodic House · Peak-Hour Energy",
    description:
      "The Monolith Project presents Untold Story IV with Eran Hersh at Hideaway Chicago on May 16, 2026.",
    experienceIntro:
      "A focused after-dark room built for dancers first. Eran Hersh leads Untold Story IV with immersive Afro and melodic house pressure from open to late.",
    eventNotice: "THE MONOLITH PROJECT PRESENTS: UNTOLD STORY IV",
    whatToExpect: [
      "Late-night Untold Story IV chapter",
      "Immersive room design and focused dancefloor energy",
      "Afro house and melodic pressure built for peak-time movement",
      "Chicago crowd with a tighter, music-first room dynamic",
      "Support lineup reveal to follow",
    ],
    age: "21+",
    activeFunnels: [],
    ticketTiers: [
      {
        id: "presale",
        name: "Early Tickets",
        price: 40,
        description: "First release for registered guests.",
        features: [
          "General admission",
          "Access to all rooms",
          "Newsletter registration required",
        ],
        icon: "ticket",
        available: false,
      },
      {
        id: "general",
        name: "General Admission",
        price: 60,
        description: "Standard entry for the full room.",
        features: ["General admission", "Access to all rooms", "Welcome drink"],
        icon: "star",
        available: false,
        highlight: true,
      },
      {
        id: "vip",
        name: "VIP Table",
        price: 120,
        description: "Premium table placement with dedicated service.",
        features: [
          "Guaranteed proximity to artist",
          "Dedicated hospitality team",
          "Expedited entry",
        ],
        icon: "crown",
        available: false,
      },
    ],
    recentlyDropped: false,
  },
  {
    id: "css-sep19",
    series: "chasing-sunsets",
    episode: "SUN(SETS) III",
    title: "Chasing Sun(Sets)",
    headline: "SUN(SETS) III — Chapter Three",
    date: "September 19, 2026",
    time: "Golden Hour",
    venue: "Castaways",
    location: "Chicago, IL",
    lineup: "Joezi x Massuma (UK) · Special Guests TBA",
    status: "coming-soon",
    description:
      "Chapter Three. The season closer at Castaways with Joezi and Massuma (UK). Join the Lake List for first access.",
    // Date-neutral series art: drives event-page og:image until chapter art exists.
    image: "/images/sunsets-hero-beach.jpg",
    tableReservationEmail: CASTAWAYS_VIP_EMAIL,
    venueMap: {
      id: "castaways-sunsets-iii-2026",
      venueId: "castaways-chicago",
      address: SUNSETS_JULY4_EVENT_ADDRESS,
      neighborhood: "North Avenue Beach · Chicago",
      illustrative: true,
    },
    vipPackages: buildCastawaysVipPackages({
      small: "available",
      medium: "available",
      large: "limited",
    }),
    activeFunnels: ["waitlist-chasing"],
    gates: { creativeReady: false, trackingQA: false, poshLinked: false },
  },
  {
    id: "css-jul04",
    series: "chasing-sunsets",
    episode: "SUN(SETS) I",
    title: "CHASING SUN(SETS)",
    headline: SUNSETS_JULY4_EVENT_TITLE,
    slug: "chasing-sunsets-july-4-2026",
    date: "July 4, 2026",
    time: SUNSETS_JULY4_EVENT_TIME,
    startsAt: "2026-07-04T12:00:00-05:00",
    endsAt: "2026-07-04T22:00:00-05:00",
    doors: "12:00 PM",
    mainExperience: "2:00 PM — 10:00 PM",
    venue: SUNSETS_JULY4_EVENT_VENUE,
    location: SUNSETS_JULY4_EVENT_LOCATION,
    // Lineup confirmed for public announcement — June 2026.
    lineup: SUNSETS_JULY4_LINEUP.join(" · "),
    status: "past",
    capacity: `${SUNSETS_JULY4_TOTAL_CAPACITY.toLocaleString("en-US")} guest admissions`,
    format: "Day Into Night · Open Air · Lakefront House Music",
    dress: "Elevated lakefront summer attire",
    sound: "House Music · Golden Hour · Skyline Energy",
    description:
      "Chasing Sun(Sets) returns home to the lake this July 4th for SUN(SETS) I at Castaways Beach Club with Autograf, Kiko Franco, Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar.",
    experienceIntro:
      "Golden hour. House music. Lake Michigan. The skyline behind you. From afternoon energy to the final sunset set, this is not a holiday party. This is the return of a Chicago summer ritual.",
    whatToExpect: [
      "A full-day house music experience on Lake Michigan",
      "Autograf x Kiko Franco with Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar",
      "Public GA tiers that move from $45 to $55 to $65 as allocations sell out",
      "A limited $20 Before 2PM Arrival Pass capped at 100 tickets",
      "Tables and 6 premium cabanas starting at a $2,000 minimum",
    ],
    eventNotice: "Watch the sun. Stay for the sets.",
    photoNotice: "Togetherness is the frequency. Music is the guide.",
    layloDropId: "IQ5HaR",
    activeFunnels: ["waitlist-chasing"],
    tableReservationEmail: "vip@chasingsunsets.music",
    tablePackages: [
      SUNSETS_JULY4_TABLE_RAIL.description,
      `Address: ${SUNSETS_JULY4_EVENT_ADDRESS}`,
    ],
    // Chapter One archived — sold and executed July 4, 2026.
    gates: { creativeReady: true, trackingQA: true, poshLinked: true },
    archiveSlug: "chasing-sunsets-sunsets-i-2026",
  },
  {
    id: "us-jul04",
    series: "untold-story",
    episode: "THE AFTERPARTY",
    title: "UNTOLD STORY",
    headline: "LATE NIGHT CONTINUATION",
    date: "July 4, 2026",
    time: "10:30 PM — Late",
    startsAt: "2026-07-04T22:30:00-05:00",
    endsAt: "2026-07-05T04:00:00-05:00",
    doors: "10:30 PM",
    venue: "Venue Reveal Soon",
    location: "Chicago, IL",
    lineup: "Secret Guest B2B",
    status: "past",
    format: "Dark Room · Intimate",
    description:
      "The official July 4 after-party. After the open-air session ends, Untold Story carries the night into a darker, tighter room.",
    activeFunnels: ["waitlist-untold"],
  },
  {
    id: "mpr-kashmir-jul24",
    series: "monolith-project",
    episode: "RESIDENCY SERIES / 01",
    title: "ERIK THE DJ · AMAR · FRANK BONO",
    slug: "monolith-residency-kashmir-july-24-2026",
    date: "July 24, 2026",
    time: "Time TBA",
    venue: "Kashmir",
    location: "Chicago, IL",
    lineup: "ERIK THE DJ · AMAR · FRANK BONO",
    artistImages: [
      {
        src: "/images/july4-erik.jpg",
        alt: "ERIK THE DJ",
        artist: "ERIK THE DJ",
      },
      {
        src: "/images/july4-frank.jpg",
        alt: "FRANK BONO",
        artist: "FRANK BONO",
      },
    ],
    status: "coming-soon",
    format: "Monolith Project Residency Series",
    sound: "House Music · Resident DJs",
    description:
      "The Monolith Project Residency Series at Kashmir with ERIK THE DJ, AMAR, and FRANK BONO.",
    eventNotice: "MONOLITH PROJECT RESIDENCY SERIES AT KASHMIR",
    activeFunnels: ["waitlist"],
  },
  {
    id: "hof-kashmir-jul31",
    series: "monolith-project",
    episode: "HOUSE OF FRIENDS POP-UP / RESIDENCY 02",
    title: "HOUSE OF FRIENDS POP-UP",
    headline: "HOUSE OF FRIENDS POP-UP — ERIK THE DJ + SPECIAL GUEST",
    slug: "house-of-friends-kashmir-july-31-2026",
    date: "July 31, 2026",
    time: "Time TBA",
    venue: "Kashmir",
    location: "Chicago, IL",
    lineup: "ERIK THE DJ · SPECIAL GUEST",
    artistImages: [
      {
        src: "/images/july4-erik.jpg",
        alt: "ERIK THE DJ",
        artist: "ERIK THE DJ",
      },
    ],
    status: "coming-soon",
    format: "Give-Back Party · House of Friends Pop-Up",
    sound: "House Music · Residency Session",
    description:
      "House of Friends takes over the Monolith Project Residency Series at Kashmir for a give-back party with ERIK THE DJ and a special guest.",
    eventNotice: "HOUSE OF FRIENDS / KASHMIR / GIVE-BACK PARTY",
    activeFunnels: ["waitlist"],
  },
  {
    id: "mpr-kashmir-aug15",
    series: "monolith-project",
    episode: "RESIDENCY SERIES / 03",
    title: "ERIK THE DJ B2B AMARI",
    slug: "monolith-residency-kashmir-august-15-2026",
    date: "August 15, 2026",
    time: "Time TBA",
    venue: "Kashmir",
    location: "Chicago, IL",
    lineup: "ERIK THE DJ B2B AMARI",
    artistImages: [
      {
        src: "/images/july4-erik.jpg",
        alt: "ERIK THE DJ",
        artist: "ERIK THE DJ",
      },
      {
        src: "/images/july4-amari.jpg",
        alt: "AMARI",
        artist: "AMARI",
      },
    ],
    status: "coming-soon",
    format: "Monolith Project Residency Series · B2B Session",
    sound: "House Music · Resident DJs",
    description:
      "The Monolith Project Residency Series returns to Kashmir with ERIK THE DJ B2B AMARI.",
    eventNotice: "MONOLITH PROJECT RESIDENCY SERIES AT KASHMIR",
    activeFunnels: ["waitlist"],
  },
  {
    id: "css-aug22",
    series: "chasing-sunsets",
    episode: "SUN(SETS) II",
    title: "Chasing Sun(Sets)",
    headline: "SUN(SETS) II — Chapter Two",
    date: "August 22, 2026",
    time: "Golden Hour",
    venue: "Castaways",
    location: "Chicago, IL",
    lineup: "TBA",
    status: "coming-soon",
    description:
      "Chapter Two. Artist reveal coming. Join the Lake List for first access.",
    // Date-neutral series art: drives event-page og:image until chapter art exists.
    image: "/images/sunsets-hero-beach.jpg",
    tableReservationEmail: CASTAWAYS_VIP_EMAIL,
    venueMap: {
      id: "castaways-sunsets-ii-2026",
      venueId: "castaways-chicago",
      address: SUNSETS_JULY4_EVENT_ADDRESS,
      neighborhood: "North Avenue Beach · Chicago",
      illustrative: true,
    },
    vipPackages: buildCastawaysVipPackages({
      small: "available",
      medium: "available",
      large: "limited",
    }),
    activeFunnels: ["waitlist-chasing"],
    // Flip these as the Aug 22 record completes; on-sale is blocked until all pass.
    gates: { creativeReady: false, trackingQA: false, poshLinked: false },
  },
  {
    // Parent-brand launch moment — NOT a SUN(SETS) season date. The
    // "Three dates. One lake. One home." framing stays exclusive to the
    // three CSS dates (Jul 4, Aug 22, Sep 19).
    id: "css-oct10",
    series: "monolith-project",
    episode: "LAUNCH",
    title: "THE MONOLITH PROJECT",
    headline: "THE MONOLITH PROJECT — LAUNCH",
    slug: "monolith-launch",
    date: "October 10, 2026",
    time: "Reveal Soon",
    venue: "Venue Reveal Soon",
    location: "Chicago, IL",
    status: "coming-soon",
    description: "The season ends in September. Then the Monolith stands.",
    eventNotice: "The season ends in September. Then the Monolith stands.",
    activeFunnels: ["waitlist"],
  },
];

function eventStartValue(event: ScheduledEvent) {
  const explicit = event.startsAt ? Date.parse(event.startsAt) : NaN;
  if (!Number.isNaN(explicit)) return explicit;
  const fromDate = Date.parse(event.date);
  return Number.isNaN(fromDate) ? Number.POSITIVE_INFINITY : fromDate;
}

// Chronological ascending for every consumer (client payload, prerender,
// sitemap). Same-day events stay grouped: intra-day order comes from startsAt,
// so the July 4 after-party card sits directly after SUN(SETS) I.
export const upcomingEvents: ScheduledEvent[] = [...EVENT_CATALOG].sort(
  (a, b) => eventStartValue(a) - eventStartValue(b)
);

const FEATURED_EVENT_IDS: Record<SiteExperienceSlot, string> = {
  hero: "css-aug22",
  banner: "css-aug22",
  funnel: "css-aug22",
  ticket: "css-aug22",
  guide: "css-aug22",
};

export const MAX_PUBLIC_SITE_PATH_LENGTH = 160;

export function normalizePublicSitePath(pathname?: string | null) {
  const raw = pathname || "/";
  const clean = raw.split("?")[0]?.split("#")[0] || "/";
  const bounded = clean.slice(0, MAX_PUBLIC_SITE_PATH_LENGTH);
  const withLeadingSlash = bounded.startsWith("/") ? bounded : `/${bounded}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/"))
    return withLeadingSlash.slice(0, -1);
  return withLeadingSlash || "/";
}

function getEventById(events: ScheduledEvent[], eventId?: string | null) {
  if (!eventId) return undefined;
  return events.find(event => event.id === eventId);
}

function uniqueEvents(events: ScheduledEvent[]) {
  const seen = new Set<string>();
  return events.filter(event => {
    if (seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  });
}

function getSeriesEvents(events: ScheduledEvent[], series: EventSeries) {
  return events.filter(event => event.series === series);
}

function deriveStartingPrice(event: ScheduledEvent): number | undefined {
  if (event.startingPrice) return event.startingPrice;
  if (!event.ticketTiers || event.ticketTiers.length === 0) return undefined;

  const availableTiers = event.ticketTiers.filter(t => t.available);
  if (availableTiers.length === 0) return undefined;

  return Math.min(...availableTiers.map(t => t.price));
}

type EventPayloadProfile = "full" | "home" | "summary";

function lockSunsetsPrelaunchEvent(event: ScheduledEvent): ScheduledEvent {
  if (!SUNSETS_PRELAUNCH_LOCKED || event.id !== "css-jul04") return event;

  return {
    ...event,
    status: "coming-soon",
    inventoryState: undefined,
    capacity: undefined,
    ticketUrl: undefined,
    startingPrice: undefined,
    ticketTiers: undefined,
    tablePackages: undefined,
    recentlyDropped: false,
    whatToExpect: [
      "A full-day house music experience on Lake Michigan",
      "Autograf x Kiko Franco with Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar",
      "Lake List members get the first ticket release window",
      "Artist drops and location signals before the public",
      "Season access and VIP/table details unlock at launch",
    ],
  };
}

function toHomeEvent(event: ScheduledEvent): ScheduledEvent {
  return {
    id: event.id,
    series: event.series,
    episode: event.episode,
    title: event.title,
    subtitle: event.subtitle,
    headline: event.headline,
    date: event.date,
    time: event.time,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    doors: event.doors,
    venue: event.venue,
    location: event.location,
    lineup: event.lineup,
    artistImages: event.artistImages,
    status: event.status,
    inventoryState: event.inventoryState,
    description: event.description,
    age: event.age,
    ticketUrl: event.ticketUrl,
    startingPrice: deriveStartingPrice(event),
    experienceIntro: event.experienceIntro,
    dress: event.dress,
    tableReservationEmail: event.tableReservationEmail,
    image: event.image,
    recentlyDropped: event.recentlyDropped,
    primaryCta: resolveEventPrimaryCta(event),
  };
}

function toSummaryEvent(event: ScheduledEvent): ScheduledEvent {
  return {
    id: event.id,
    series: event.series,
    episode: event.episode,
    title: event.title,
    slug: event.slug,
    subtitle: event.subtitle,
    headline: event.headline,
    date: event.date,
    time: event.time,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    doors: event.doors,
    mainExperience: event.mainExperience,
    venue: event.venue,
    location: event.location,
    lineup: event.lineup,
    artistImages: event.artistImages,
    image: event.image,
    status: event.status,
    inventoryState: event.inventoryState,
    format: event.format,
    dress: event.dress,
    sound: event.sound,
    description: event.description,
    age: event.age,
    ticketUrl: event.ticketUrl,
    startingPrice: deriveStartingPrice(event),
    experienceIntro: event.experienceIntro,
    tableReservationEmail: event.tableReservationEmail,
    recentlyDropped: event.recentlyDropped,
    primaryCta: resolveEventPrimaryCta(event),
  };
}

function shapeEvent(event: ScheduledEvent, profile: EventPayloadProfile) {
  const publicEvent = lockSunsetsPrelaunchEvent(event);

  if (profile === "home") return toHomeEvent(publicEvent);
  if (profile === "summary") return toSummaryEvent(publicEvent);
  return {
    ...publicEvent,
    primaryCta: resolveEventPrimaryCta(publicEvent),
  };
}

function resolveFeaturedEvents(
  events: ScheduledEvent[],
  profile: EventPayloadProfile = "full"
) {
  return Object.fromEntries(
    Object.entries(FEATURED_EVENT_IDS)
      .map(([slot, eventId]) => {
        const event = getEventById(events, eventId);
        return [slot, event ? shapeEvent(event, profile) : undefined];
      })
      .filter((entry): entry is [SiteExperienceSlot, ScheduledEvent] =>
        Boolean(entry[1])
      )
  ) as PublicSiteData["featuredEvents"];
}

function resolveEventsForPath(
  pathname: string,
  featuredEvents: PublicSiteData["featuredEvents"],
  events: ScheduledEvent[]
) {
  if (pathname === "/") {
    // The homepage contains a real calendar, not a separate editorial subset.
    // Give it the same summary contract as /schedule so dates, descriptions,
    // slugs, statuses, and actions cannot drift between the two surfaces.
    // Featured hero records still use the lean home profile below.
    return events.map(event => shapeEvent(event, "summary"));
  }

  if (
    pathname === "/schedule" ||
    pathname === "/events" ||
    pathname.startsWith("/artists/")
  ) {
    return events;
  }

  if (pathname === "/vip") {
    const vipEvents = events.filter(
      event =>
        event.status !== "past" &&
        Boolean(event.venueMap) &&
        Boolean(event.vipPackages?.length)
    );

    return vipEvents.length
      ? vipEvents
      : uniqueEvents(Object.values(featuredEvents));
  }

  if (
    pathname === "/story" ||
    pathname === "/untold-story" ||
    pathname === "/untold-story-deron-juany-bravo" ||
    pathname.startsWith("/untold-story/")
  ) {
    return uniqueEvents([
      ...Object.values(featuredEvents),
      ...getSeriesEvents(events, "untold-story"),
    ]);
  }

  if (
    pathname === "/chasing-sunsets" ||
    pathname === "/chasing-sunsets-facts" ||
    pathname.startsWith("/chasing-sunsets/")
  ) {
    return uniqueEvents([
      ...Object.values(featuredEvents),
      ...getSeriesEvents(events, "chasing-sunsets"),
    ]);
  }

  if (pathname.startsWith("/events/")) {
    return events;
  }

  return uniqueEvents(Object.values(featuredEvents));
}

function getPayloadProfileForPath(pathname: string): EventPayloadProfile {
  if (pathname === "/") return "home";

  if (
    pathname === "/tickets" ||
    pathname === "/vip" ||
    pathname === "/story" ||
    pathname === "/untold-story" ||
    pathname === "/untold-story-deron-juany-bravo" ||
    pathname.startsWith("/untold-story/") ||
    pathname === "/chasing-sunsets" ||
    pathname.startsWith("/chasing-sunsets/") ||
    pathname.startsWith("/events/")
  ) {
    return "full";
  }

  return "summary";
}

export function buildPublicSiteData(
  pathname?: string | null,
  eventsSource: ScheduledEvent[] = upcomingEvents
): PublicSiteData {
  const normalizedPath = normalizePublicSitePath(pathname);
  const profile = getPayloadProfileForPath(normalizedPath);
  // Publish OS: drafts never enter a public payload; hidden events only
  // resolve on direct event pages and stay out of every list surface.
  const publishedEvents = eventsSource.filter(
    event => event.status !== "draft"
  );
  const visibleEvents = normalizedPath.startsWith("/events/")
    ? publishedEvents
    : publishedEvents.filter(event => event.status !== "hidden");
  const featuredEvents = resolveFeaturedEvents(visibleEvents, profile);
  const events = resolveEventsForPath(
    normalizedPath,
    featuredEvents,
    visibleEvents
  ).map(event => (profile === "home" ? event : shapeEvent(event, profile)));

  return {
    path: normalizedPath,
    events,
    featuredEvents,
  };
}
