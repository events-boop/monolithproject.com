import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const rawDatabaseUrl = process.env.DATABASE_URL?.trim();

type DatabaseClient = ReturnType<typeof drizzle<typeof schema>>;

let db: DatabaseClient | null = null;

if (rawDatabaseUrl) {
  const sql = neon(rawDatabaseUrl);
  db = drizzle({ client: sql, schema });
}

export function hasDatabase() {
  return db !== null;
}

export function getDatabase() {
  return db;
}

