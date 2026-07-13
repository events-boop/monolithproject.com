import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const migrationUrl = new URL(
  "../server/db/migrations/0006_chilly_tarot.sql",
  import.meta.url
);
const migration = await readFile(migrationUrl, "utf8");
const statements = migration
  .split("--> statement-breakpoint")
  .map(statement => statement.trim())
  .filter(Boolean);
const sql = neon(databaseUrl);
const expectedIndexes = [
  "house_of_friends_applications_reference_code_idx",
  "house_of_friends_applications_email_idx",
  "house_of_friends_applications_status_idx",
  "house_of_friends_applications_submitted_at_idx",
];

for (const statement of statements) {
  await sql.query(statement, []);
}

const verification = await sql.query(
  "select count(*)::int as count from information_schema.tables where table_schema = $1 and table_name = $2",
  ["public", "house_of_friends_applications"]
);
if (verification[0]?.count !== 1) {
  throw new Error("House of Friends application table verification failed.");
}

const indexes = await sql.query(
  "select count(*)::int as count from pg_indexes where schemaname = $1 and tablename = $2 and indexname = any($3::text[])",
  ["public", "house_of_friends_applications", expectedIndexes]
);
if (indexes[0]?.count !== expectedIndexes.length) {
  throw new Error("House of Friends application index verification failed.");
}

console.log("House of Friends application table and indexes are ready.");
