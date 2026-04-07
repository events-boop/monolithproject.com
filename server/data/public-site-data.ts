import type {
    EventSeries,
    PublicSiteData,
    ScheduledEvent,
    SiteExperienceSlot,
} from "../../shared/events/types";
import { resolveEventPrimaryCta } from "../lib/public-cta";

/** Core Socials & Links */
export const LAYLO_URL = "/go/waitlist/general";
export const SOUNDCLOUD_URL = "https://soundcloud.com/monolithproject";
export const SPOTIFY_URL = "https://spotify.com/"; 
export const TIKTOK_URL = "https://tiktok.com/@monolithproject";
export const INSTAGRAM_MONOLITH = "https://instagram.com/monolithproject.events";
export const INSTAGRAM_UNTOLD = "https://instagram.com/untoldstory.music";
export const INSTAGRAM_SUNSETS = "https://instagram.com/chasingsunsets.music";

/** Active ticket link — Posh */
export const POSH_TICKET_URL = "/go/tickets/featured";

export const upcomingEvents: ScheduledEvent[] = [
    {
        id: "us-s3e2",
        series: "untold-story",
        episode: "S3·E2",
        title: "DERON B2B JUANY BRAVO",
        subtitle: "Untold Story — Season III · Episode II",
        headline: "DERON B2B JUANY BRAVO (Chicago Debut)",
        slug: "untold-story-season-iii-episode-ii",
        date: "March 6, 2026",
        time: "7:00 PM — 2:00 AM",
        startsAt: "2026-03-06T19:00:00-06:00",
        endsAt: "2026-03-07T02:00:00-06:00",
        mainExperience: "9:00 PM — 2:00 AM",
        doors: "7:00 PM",
        venue: "Alhambra Palace",
        location: "West Loop, Chicago",
        lineup: "Deron B2B Juany Bravo (Headliner) · Support: Hashtom · Rose · Jerome · Avo · Kenny · Additional guests may be announced",
        status: "on-sale",
        inventoryState: "low", // Aggressive scarcity marker
        format: "Immersive · Late Night · 360 Sound",
        dress: "Elevated Nightlife · Monochrome Preferred",
        sound: "Afro House · Melodic Grooves · Global Rhythms",
        description: "A late-night journey through Afro and melodic house led by two of Chicago's finest selectors in an immersive 360° dancefloor experience.",
        experienceIntro:
            "Untold Story returns with its most anticipated pairing yet. Juany Bravo and Deron share the decks for an extended B2B session, moving from deep soulful grooves to peak-hour energy inside the intimate Alhambra Palace setting. This is not a club night. This is a musical journey built for dancers, not spectators.",
        whatToExpect: [
            "360° Immersive Dancefloor — Curated lighting, visuals, and spatial design",
            "Extended B2B DJ Storytelling — Two selectors, one shared vision",
            "World-Class Sound System — Engineered for depth, clarity, and impact",
            "Afro House, Melodic Grooves & Global Rhythms — Music that moves bodies and builds connection",
            "Community-Driven Energy — A room built for people who show up early, stay late, and hold space on the dancefloor",
            "House music as ceremony",
        ],
        tablePackages: [
            "Standard Table (up to 5 guests): $300 — Includes 1 standard bottle",
            "Gold Table (up to 5 guests): $500 — Includes 1 premium bottle + elevated placement",
            "Platinum Table (up to 5 guests): $750 — Includes 1 premium bottle, closest DJ proximity, priority service",
            "Additional Bottles: Standard: $150 | Premium: $200 | Top Shelf: $250",
        ],
        tableReservationEmail: "events@monolithproject.com",
        faqs: [
            { q: "Are tickets refundable?", a: "All sales are final. No refunds or exchanges." },
            { q: "What time should I arrive?", a: "Doors open at 7:00 PM. Peak experience begins around 9:00 PM. Early arrival is recommended for the full journey." },
            { q: "Is there re-entry?", a: "No re-entry permitted once you leave the venue." },
            { q: "What's the age requirement?", a: "21+ only. Valid government-issued ID required for entry." },
            { q: "Is parking available?", a: "Street parking and nearby garage parking are available in the West Loop. Rideshare is recommended." },
            { q: "Do I need printed tickets?", a: "No. Mobile QR codes are accepted at the door." },
            { q: "What's the dress code?", a: "Elevated nightlife attire is encouraged. Dress to move comfortably." },
            { q: "Is food available?", a: "Yes. Food is available inside the venue." },
        ],
        photoNotice:
            "This event will be photographed and recorded for The Monolith Project, House of Friends, and partner channels. By entering, you consent to possible use of your likeness in event media.",
        eventNotice: "Presented by The Monolith Project: UNTOLD STORY 360 EXPERIENCE",
        age: "21+",
        ticketUrl: "/go/tickets/us-s3e2",
        ticketTiers: [
            {
                id: "early-bird",
                name: "Early Bird",
                price: 45,
                originalPrice: 65,
                description: "Limited availability for early supporters",
                features: ["General admission", "Access to all rooms", "Welcome drink"],
                icon: "ticket",
                available: true,
            },
            {
                id: "general",
                name: "General Admission",
                price: 65,
                description: "Standard entry",
                features: ["General admission", "Access to all rooms", "Welcome drink", "Event wristband"],
                icon: "star",
                available: true,
                highlight: true,
            },
            {
                id: "vip",
                name: "VIP Experience",
                price: 120,
                description: "Elevated access",
                features: ["Priority entry", "Access to all rooms", "VIP lounge access", "Complimentary drinks", "Exclusive merch"],
                icon: "crown",
                available: true,
            }
        ],
        activeFunnels: ["coordinates", "waitlist-untold"], // Activate coordinate drop and waitlist for this event
    },
    {
        id: "mp-autograf-mar21",
        series: "monolith-project",
        episode: "SPECIAL EVENT",
        title: "AUTOGRAF",
        subtitle: "The Monolith Project Presents",
        headline: "AUTOGRAF — CHICAGO",
        slug: "autograf-alhambra-palace-march-21-2026",
        date: "March 21, 2026",
        time: "9:00 PM — Late",
        startsAt: "2026-03-21T21:00:00-05:00",
        endsAt: "2026-03-22T03:00:00-05:00",
        doors: "9:00 PM",
        venue: "Alhambra Palace",
        location: "Chicago, IL",
        lineup: "Autograf (Live Set) · Local Support TBA",
        status: "on-sale",
        inventoryState: "low",
        format: "Live Instrumentation · Immersive · Festival Energy",
        dress: "Creative Black · Mask Highly Encouraged",
        sound: "Melodic House · Afro House · Organic House",
        description: "Global dance music trio Autograf returns for a special Chicago night, bringing their signature blend of melodic house, live instrumentation, and festival-level energy to one of the city’s most iconic venues.",
        experienceIntro: "Known for unforgettable performances across Coachella, EDC, and international stages, Autograf delivers an emotional, high-energy experience built for spaces that move together. This night brings together Chicago’s tastemakers, music lovers, and culture drivers under one roof for a true Monolith experience.",
        whatToExpect: [
            "International headliner performance",
            "Immersive indoor experience",
            "Elevated sound & lighting production",
            "Chicago tastemaker crowd",
            "Signature Monolith Project energy",
        ],
        eventNotice: "THE MONOLITH PROJECT PRESENTS: AUTOGRAF",
        age: "21+",
        ticketUrl: "/go/tickets/mp-autograf-mar21",
        ticketTiers: [
            {
                id: "early-bird",
                name: "Early Bird",
                price: 45,
                originalPrice: 65,
                description: "Limited availability for early supporters",
                features: ["General admission", "Access to all rooms", "Welcome drink"],
                icon: "ticket",
                available: false,
            },
            {
                id: "general",
                name: "General Admission",
                price: 65,
                description: "Standard entry",
                features: ["General admission", "Access to all rooms", "Welcome drink", "Event wristband"],
                icon: "star",
                available: true,
                highlight: true,
            },
            {
                id: "vip",
                name: "VIP Experience",
                price: 140,
                description: "Elevated access",
                features: ["Priority entry", "Access to all rooms", "VIP lounge access", "Complimentary drinks", "Exclusive merch"],
                icon: "crown",
                available: true,
            }
        ],
        activeFunnels: ["giveaway"], // Activate giveaway for the tickets page
    },
    {
        id: "us-s3e3",
        series: "untold-story",
        episode: "SEASON III · EPISODE III",
        title: "ERAN HERSH",
        subtitle: "Untold Story — Season III · Episode III",
        headline: "ERAN HERSH — CHICAGO",
        slug: "untold-story-season-iii-episode-iii-eran-hersh",
        date: "May 16, 2026",
        time: "9:00 PM — Late",
        startsAt: "2026-05-16T21:00:00-05:00",
        endsAt: "2026-05-17T03:00:00-05:00",
        doors: "9:00 PM",
        mainExperience: "10:30 PM — Late",
        venue: "Venue Reveal Soon",
        location: "Chicago, IL",
        lineup: "Eran Hersh (Headliner) · Support TBA",
        status: "coming-soon",
        image: "/images/eran-hersh-hero.png",
        format: "Late Night · Immersive · Intimate",
        dress: "Elevated nightlife attire",
        sound: "Afro House · Melodic House · Peak-Hour Energy",
        description: "Untold Story returns on May 16, 2026 with Eran Hersh for a late-night chapter built around immersive sound, tension, and peak-hour release.",
        experienceIntro: "A focused after-dark room shaped for dancers first. Eran Hersh brings a high-pressure blend of Afro and melodic house into the Untold Story format: intimate scale, strong pacing, and a crowd that stays locked in from open to close.",
        eventNotice: "THE MONOLITH PROJECT PRESENTS: UNTOLD STORY",
        whatToExpect: [
          "Late-night Untold Story chapter",
          "Immersive room design and focused dancefloor energy",
          "Afro house and melodic pressure built for peak-time movement",
          "Chicago crowd with a tighter, music-first room dynamic",
          "Support lineup and venue details announced closer to release",
        ],
        age: "21+",
        activeFunnels: ["waitlist-untold"],
        ticketTiers: [
            {
                id: "presale",
                name: "Presale Access",
                price: 40,
                description: "Waitlist exclusive pricing",
                features: ["General admission", "Access to all rooms", "Sign up via Laylo"],
                icon: "ticket",
                available: true,
            },
            {
                id: "general",
                name: "General Admission",
                price: 60,
                description: "Standard entry",
                features: ["General admission", "Access to all rooms", "Welcome drink"],
                icon: "star",
                available: true,
                highlight: true,
            }
        ]
    },
    {
        id: "css-jun07",
        series: "chasing-sunsets",
        episode: "SUMMER '26",
        title: "Chasing Sun(Sets)",
        date: "June 7, 2026",
        time: "Golden Hour",
        venue: "Venue Reveal Soon",
        location: "Chicago, IL",
        status: "coming-soon",
        activeFunnels: ["waitlist-chasing"],
    },
    {
        id: "css-jul04",
        series: "chasing-sunsets",
        episode: "INDEPENDENCE DAY",
        title: "CHASING SUN(SETS)",
        headline: "JULY 4TH OPEN-AIR EXPERIENCE",
        date: "July 4, 2026",
        time: "3:00 PM — 10:00 PM",
        startsAt: "2026-07-04T15:00:00-05:00",
        endsAt: "2026-07-04T22:00:00-05:00",
        venue: "Venue Reveal Soon",
        location: "Chicago, IL",
        lineup: "Lineup Drops May 15",
        status: "coming-soon",
        inventoryState: "normal",
        format: "Day into Night · Open Air",
        dress: "Sun-Kin · Golden Hour Attire",
        description: "The summer flagship rooftop session. Start at sunset, continue after dark.",
        activeFunnels: ["waitlist-chasing"],
        tableReservationEmail: "vip@chasingsunsets.music",
        startingPrice: 65,
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
        status: "coming-soon",
        format: "Dark Room · Intimate",
        description: "The official July 4th after-party. When the sun sets, the story continues.",
        activeFunnels: ["waitlist-untold"],
        startingPrice: 45,
    },
    {
        id: "us-aug01",
        series: "untold-story",
        episode: "SUMMER '26",
        title: "Untold Story",
        date: "August 1, 2026",
        time: "Late Night",
        venue: "Venue Reveal Soon",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "css-aug22",
        series: "chasing-sunsets",
        episode: "SUMMER '26",
        title: "Chasing Sun(Sets)",
        date: "August 22, 2026",
        time: "Golden Hour",
        venue: "Venue Reveal Soon",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "css-sep26",
        series: "chasing-sunsets",
        episode: "SEASON FINALE",
        title: "Chasing Sun(Sets)",
        date: "September 26, 2026",
        time: "Golden Hour",
        venue: "Venue Reveal Soon",
        location: "Chicago, IL",
        status: "coming-soon",
    }
];

const FEATURED_EVENT_IDS: Record<SiteExperienceSlot, string> = {
    hero: "css-jul04",
    banner: "css-jul04",
    funnel: "css-jul04",
    ticket: "css-jul04",
    guide: "css-jul04",
};

function normalizePathname(pathname?: string | null) {
    const raw = pathname || "/";
    const clean = raw.split("?")[0]?.split("#")[0] || "/";
    if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
    return clean || "/";
}

function getEventById(eventId?: string | null) {
    if (!eventId) return undefined;
    return upcomingEvents.find((event) => event.id === eventId);
}

function uniqueEvents(events: ScheduledEvent[]) {
    const seen = new Set<string>();
    return events.filter((event) => {
        if (seen.has(event.id)) return false;
        seen.add(event.id);
        return true;
    });
}

function getSeriesEvents(series: EventSeries) {
    return upcomingEvents.filter((event) => event.series === series);
}

type EventPayloadProfile = "full" | "home" | "summary";

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
        status: event.status,
        inventoryState: event.inventoryState,
        description: event.description,
        age: event.age,
        ticketUrl: event.ticketUrl,
        experienceIntro: event.experienceIntro,
        dress: event.dress,
        tableReservationEmail: event.tableReservationEmail,
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
        image: event.image,
        status: event.status,
        inventoryState: event.inventoryState,
        format: event.format,
        dress: event.dress,
        sound: event.sound,
        description: event.description,
        age: event.age,
        ticketUrl: event.ticketUrl,
        experienceIntro: event.experienceIntro,
        tableReservationEmail: event.tableReservationEmail,
        primaryCta: resolveEventPrimaryCta(event),
    };
}

function shapeEvent(event: ScheduledEvent, profile: EventPayloadProfile) {
    if (profile === "home") return toHomeEvent(event);
    if (profile === "summary") return toSummaryEvent(event);
    return {
        ...event,
        primaryCta: resolveEventPrimaryCta(event),
    };
}

function resolveFeaturedEvents(profile: EventPayloadProfile = "full") {
    return Object.fromEntries(
        Object.entries(FEATURED_EVENT_IDS)
            .map(([slot, eventId]) => {
                const event = getEventById(eventId);
                return [slot, event ? shapeEvent(event, profile) : undefined];
            })
            .filter((entry): entry is [SiteExperienceSlot, ScheduledEvent] => Boolean(entry[1])),
    ) as PublicSiteData["featuredEvents"];
}

function resolveEventsForPath(pathname: string, featuredEvents: PublicSiteData["featuredEvents"]) {
    if (pathname === "/") {
        return upcomingEvents.map((event) => shapeEvent(event, "home"));
    }

    if (pathname === "/schedule" || pathname.startsWith("/artists/")) {
        return upcomingEvents;
    }

    if (
        pathname === "/story" ||
        pathname === "/untold-story-deron-juany-bravo" ||
        pathname.startsWith("/untold-story/")
    ) {
        return uniqueEvents([...Object.values(featuredEvents), ...getSeriesEvents("untold-story")]);
    }

    if (
        pathname === "/chasing-sunsets" ||
        pathname === "/chasing-sunsets-facts" ||
        pathname.startsWith("/chasing-sunsets/")
    ) {
        return uniqueEvents([...Object.values(featuredEvents), ...getSeriesEvents("chasing-sunsets")]);
    }

    return uniqueEvents(Object.values(featuredEvents));
}

function getPayloadProfileForPath(pathname: string): EventPayloadProfile {
    if (pathname === "/") return "home";

    if (
        pathname === "/tickets" ||
        pathname === "/story" ||
        pathname === "/untold-story-deron-juany-bravo" ||
        pathname.startsWith("/untold-story/") ||
        pathname === "/chasing-sunsets" ||
        pathname.startsWith("/chasing-sunsets/")
    ) {
        return "full";
    }

    return "summary";
}

export function buildPublicSiteData(pathname?: string | null): PublicSiteData {
    const normalizedPath = normalizePathname(pathname);
    const profile = getPayloadProfileForPath(normalizedPath);
    const featuredEvents = resolveFeaturedEvents(profile);
    const events = resolveEventsForPath(normalizedPath, featuredEvents).map((event) =>
        profile === "home" ? event : shapeEvent(event, profile),
    );

    return {
        path: normalizedPath,
        events,
        featuredEvents,
    };
}
