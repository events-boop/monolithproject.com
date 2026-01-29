export interface ScheduledEvent {
    id: string;
    series: "chasing-sunsets" | "untold-story";
    episode: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    location: string;
    status: "on-sale" | "coming-soon" | "sold-out";
}

export const upcomingEvents: ScheduledEvent[] = [
    {
        id: "css-s02e01",
        series: "chasing-sunsets",
        episode: "S02E01",
        title: "Spring Equinox",
        date: "March 21, 2026",
        time: "4:00 PM - 10:00 PM",
        venue: "TBA",
        location: "Chicago, IL",
        status: "on-sale" // Changed to on-sale to test Navigation "LIVE" feature
    },
    {
        id: "us-s01e01",
        series: "untold-story",
        episode: "S01E01",
        title: "Chapter One",
        date: "April 2026",
        time: "TBA",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon"
    },
    {
        id: "css-s02e02",
        series: "chasing-sunsets",
        episode: "S02E02",
        title: "Summer Solstice",
        date: "June 21, 2026",
        time: "5:00 PM - 11:00 PM",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon"
    },
    {
        id: "css-s02e03",
        series: "chasing-sunsets",
        episode: "S02E03",
        title: "Golden Hour",
        date: "July 4, 2026",
        time: "4:00 PM - 10:00 PM",
        venue: "TBA",
        location: "Chicago, IL",
        status: "coming-soon"
    }
];
