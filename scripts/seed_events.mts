import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { scheduledEvents } from "../server/db/schema.js";
import { upcomingEvents } from "../client/src/data/events.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("No DATABASE_URL found");
    process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema: { scheduledEvents } });

async function main() {
    console.log("Seeding events into DB...");
    const records = upcomingEvents.map(e => ({
        id: e.id,
        series: e.series,
        episode: e.episode || "",
        title: e.title,
        subtitle: e.subtitle,
        date: e.date,
        time: e.time,
        doors: e.doors,
        venue: e.venue,
        location: e.location,
        lineup: e.lineup,
        image: e.image,
        status: e.status,
        capacity: e.capacity,
        format: e.format,
        dress: e.dress,
        sound: e.sound,
        description: e.description,
        age: e.age,
        ticketUrl: e.ticketUrl,
        headline: e.headline,
        mainExperience: e.mainExperience,
        experienceIntro: e.experienceIntro,
        whatToExpect: e.whatToExpect,
        tablePackages: e.tablePackages,
        tableReservationEmail: e.tableReservationEmail,
        faqs: e.faqs,
        photoNotice: e.photoNotice,
        eventNotice: e.eventNotice,
        activeFunnels: e.activeFunnels,
    }));

    try {
        await db.insert(scheduledEvents).values(records).onConflictDoNothing();
        console.log("Seeding completed successfully!");
    } catch (e) {
        console.error(e);
    }
}

main();
