export interface ScheduledEvent {
    id: string;
    series: "chasing-sunsets" | "untold-story" | "monolith-project";
    episode: string;
    title: string;
    subtitle?: string;
    date: string;
    time: string;
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
}

/** Active ticket link — Posh */
export const POSH_TICKET_URL = "https://posh.vip/e/untold-story-360-experiencefeat-deron-b2b-juany-bravo";

export const upcomingEvents: ScheduledEvent[] = [
    {
        id: "us-s3e2",
        series: "untold-story",
        episode: "S3·E2",
        title: "DERON B2B JUANY BRAVO",
        subtitle: "Untold Story — Season III · Episode II",
        headline: "DERON B2B JUANY BRAVO (Chicago Debut)",
        date: "March 6, 2026",
        time: "7:00 PM — 2:00 AM",
        mainExperience: "9:00 PM — 2:00 AM",
        doors: "7:00 PM",
        venue: "Alhambra Palace",
        location: "West Loop, Chicago",
        lineup: "Juany Bravo B2B Deron (Headliner) · Support: Hashtom · Rose · Jerome · Avo · Kenny · Additional guests may be announced",
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
    },
    {
        id: "mp-autograf-mar21",
        series: "monolith-project",
        episode: "SPECIAL EVENT",
        title: "AUTOGRAF",
        subtitle: "The Monolith Project Presents",
        headline: "AUTOGRAF — CHICAGO",
        date: "March 21, 2026",
        time: "9:00 PM — Late",
        doors: "9:00 PM",
        venue: "Alhambra Palace",
        location: "Chicago, IL",
        lineup: "Autograf (Live Set) · Local Support TBA",
        status: "on-sale",
        format: "Live Instrumentation · Immersive · Festival Energy",
        dress: "Elevated nightlife attire",
        sound: "Melodic House · Afro House · Organic House",
        description: "Global dance music trio Autograf returns for a special Chicago night, bringing their signature blend of melodic house, live instrumentation, and festival-level energy to one of the city’s most iconic venues.",
        experienceIntro: "Known for unforgettable performances across Coachella, EDC, and international stages, Autograf delivers an emotional, high-energy experience built for dance floors that move together. This night brings together Chicago’s tastemakers, music lovers, and culture drivers under one roof for a true Monolith experience.",
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
    },
    {
        id: "mp-launch-001",
        series: "monolith-project",
        episode: "EP.01",
        title: "The First Monolith",
        date: "August 22, 2026",
        time: "4:00 PM — Late",
        venue: "TBA",
        location: "Chicago, IL",
        lineup: "Untold Story · Chasing Sun(Sets)",
        image: "/images/hero-monolith.jpg",
        status: "coming-soon",
        capacity: "300",
        format: "Sunset → Late Night",
        dress: "Come as you are",
        sound: "Afro House · Techno · Melodic",
    },
    {
        id: "css-002",
        series: "chasing-sunsets",
        episode: "EP.02",
        title: "Golden Hour Vol. 2",
        date: "September 2026",
        time: "4:00 PM — 10:00 PM",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
        capacity: "200",
        format: "Rooftop · Outdoor",
        dress: "Summer whites encouraged",
        sound: "Afro House · Organic House · Global Rhythms",
    },
    {
        id: "us-002",
        series: "untold-story",
        episode: "EP.03",
        title: "Chapter Two",
        date: "October 2026",
        time: "10:00 PM — Late",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon",
        capacity: "150",
        format: "Warehouse · 360 Sound",
        dress: "All black",
        sound: "Techno · Deep House · Psychedelic",
    },
];
