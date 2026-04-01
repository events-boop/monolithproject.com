export interface ScheduledEvent {
    id: string;
    series: "chasing-sunsets" | "untold-story" | "monolith-project";
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
    capacity?: string;
    format?: string;
    dress?: string;
    sound?: string;
    description?: string;
    age?: string;
    ticketUrl?: string;
    headline?: string;
    mainExperience?: string;
    experienceIntro?: string;
    whatToExpect?: string[];
    tablePackages?: string[];
    tableReservationEmail?: string;
    faqs?: Array<{ q: string; a: string }>;
    photoNotice?: string;
    eventNotice?: string;
    activeFunnels?: ("waitlist" | "waitlist-chasing" | "waitlist-untold" | "giveaway" | "coordinates")[];
}

/** Core Socials & Links */
export const LAYLO_URL = "https://laylo.com/monolithproject"; // Placeholder - map this to specific Laylo handle
export const SOUNDCLOUD_URL = "https://soundcloud.com/monolithproject"; // Placeholder
export const SPOTIFY_URL = "https://spotify.com/"; // Placeholder
export const TIKTOK_URL = "https://tiktok.com/@monolithproject"; // Placeholder
export const INSTAGRAM_MONOLITH = "https://instagram.com/monolithproject.events";
export const INSTAGRAM_UNTOlD = "https://instagram.com/untoldstory.music";
export const INSTAGRAM_SUNSETS = "https://instagram.com/chasingsunsets.music";

/** Active ticket link — Posh */
export const POSH_TICKET_URL = "https://posh.vip/e/untold-storyseason-iii-episode-ivautograf-alhambra-palace-west-loop-chicago-friday-march-21-2026";

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
        format: "Immersive · Late Night · 360 Sound",
        dress: "Elevated nightlife attire",
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
        ticketUrl: POSH_TICKET_URL,
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
        format: "Live Instrumentation · Immersive · Festival Energy",
        dress: "Elevated nightlife attire",
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
        ticketUrl: POSH_TICKET_URL, // Identifying this as the likely link or placeholder
        activeFunnels: ["giveaway"], // Activate giveaway for the tickets page
    },
    {
        id: "mp-eran-hersh",
        series: "monolith-project",
        episode: "SPECIAL EVENT",
        title: "Eran Hersh",
        date: "May 16, 2026",
        time: "TBA",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "css-jun07",
        series: "chasing-sunsets",
        episode: "SUMMER '26",
        title: "Chasing Sun(Sets)",
        date: "June 7, 2026",
        time: "TBA",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "css-jul04",
        series: "chasing-sunsets",
        episode: "SUMMER '26",
        title: "Chasing Sun(Sets)",
        date: "July 4, 2026",
        time: "TBA",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "us-jul04",
        series: "untold-story",
        episode: "LATE NIGHT",
        title: "Untold Story",
        date: "July 4, 2026",
        time: "Late",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "us-aug08",
        series: "untold-story",
        episode: "SUMMER '26",
        title: "Untold Story",
        date: "August 8, 2026",
        time: "TBA",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "css-aug22",
        series: "chasing-sunsets",
        episode: "SUMMER '26",
        title: "Chasing Sun(Sets)",
        date: "August 22, 2026",
        time: "TBA",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
    },
    {
        id: "css-sep26",
        series: "chasing-sunsets",
        episode: "SEASON FINALE",
        title: "Chasing Sun(Sets)",
        date: "September 26, 2026",
        time: "TBA",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
    }
];
