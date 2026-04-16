import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { scheduledEvents } from "../server/db/schema.js";
import { eq } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("No DATABASE_URL found");
    process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql, { schema: { scheduledEvents } });

async function main() {
    const ghostId = "us-s3e2"; // The elusive April 18th Kasango event
    console.log(`Searching for Ghost ID: ${ghostId}...`);

    try {
        const deleted = await db.delete(scheduledEvents).where(eq(scheduledEvents.id, ghostId));
        console.log(`Exorcism complete. Record purged.`);
    } catch (e) {
        console.error("Purge failed:", e);
    }
}

main();
