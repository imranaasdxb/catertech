import { resolve } from "path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Drizzle CLI does not load .env.local — Next.js does. Load the same files here so `npm run db:push` sees DATABASE_URL.
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL is missing. Add it to .env.local (same folder as package.json), then run npm run db:push again."
  );
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});
