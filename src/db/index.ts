import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!globalForDb.db) {
    globalForDb.db = drizzle(neon(url), { schema });
  }
  return globalForDb.db;
}
