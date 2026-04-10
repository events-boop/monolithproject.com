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
        status: "on-sale",
        image: "/images/eran-hersh-live-5.webp",
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
        ticketUrl: "/go/tickets/us-s3e3",
        ticketTiers: [
            {
                id: "presale",
                name: "Early Entry Access",
                price: 40,
                description: "Priority entry for registered drop members.",
                features: ["General admission", "Access to all rooms", "Sign up via Laylo"],
                icon: "ticket",
                available: true,
            },
            {
                id: "general",
                name: "General Access Entry",
                price: 60,
                description: "Standard entry to the ecosystem.",
                features: ["General admission", "Access to all rooms", "Welcome drink"],
                icon: "star",
                available: true,
                highlight: true,
            },
            {
                id: "vip",
                name: "Stage Proximity Access",
                price: 120,
                description: "Premium positioning and discrete service.",
                features: ["Guaranteed proximity to artist", "Dedicated hospitality team", "Expedited entry"],
                icon: "crown",
                available: true,
            }
        ],
        recentlyDropped: true,
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
        inventoryState: "low",
        format: "Day into Night · Open Air",
        dress: "Sun-Kin · Golden Hour Attire",
        description: "The flagship open-air ecosystem session. Start at sunset, continue after dark. Inventory is capped to protect the room.",
        activeFunnels: ["waitlist-chasing"],
        tableReservationEmail: "vip@chasingsunsets.music",
        startingPrice: 65,
        recentlyDropped: true,
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
    funnel: "us-s3e3",
    ticket: "us-s3e3",
    guide: "us-s3e3",
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
        recentlyDropped: event.recentlyDropped,
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
