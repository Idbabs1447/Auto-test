import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Pick up DATABASE_URL from .env.local / .env when running drizzle-kit locally.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
