import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { scheduledEvents } from "../server/db/schema.js";
import { upcomingEvents } from "../server/data/public-site-data.js";

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
        slug: e.slug,
        subtitle: e.subtitle,
        date: e.date,
        time: e.time,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        doors: e.doors,
        venue: e.venue,
        location: e.location,
        lineup: e.lineup,
        image: e.image,
        status: e.status,
        inventoryState: e.inventoryState,
        capacity: e.capacity,
        format: e.format,
        dress: e.dress,
        sound: e.sound,
        description: e.description,
        age: e.age,
        ticketUrl: e.ticketUrl,
        startingPrice: e.startingPrice,
        ticketTiers: e.ticketTiers,
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
        recentlyDropped: e.recentlyDropped ?? false,
    }));

    try {
        for (const record of records) {
            await db.insert(scheduledEvents).values(record).onConflictDoUpdate({
                target: scheduledEvents.id,
                set: record,
            });
        }
        console.log("Seeding completed successfully!");
    } catch (e) {
        console.error(e);
    }
}

main();
