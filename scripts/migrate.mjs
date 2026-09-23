/**
 * Applies the SQL migrations in ./drizzle to the configured database.
 *
 * Runs automatically before `next build` (see package.json), so every Vercel
 * deployment brings the database schema up to date — no need to run
 * drizzle-kit by hand. Already-applied migrations are skipped.
 *
 * With no database configured it prints a warning and exits successfully,
 * so the site can still be built and deployed.
 */
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

config({ path: [".env.local", ".env"], quiet: true });

// Same variables the app reads at runtime (src/db/index.ts), but preferring
// the direct (non-pooled) connection for schema changes when one is provided:
// Neon sets DATABASE_URL_UNPOOLED, Supabase sets POSTGRES_URL_NON_POOLING.
const connectionString = process.env.DATABASE_URL
  ? process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
  : process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!connectionString) {
  console.warn(
    "[migrate] DATABASE_URL is not set — skipping database migrations.\n" +
      "[migrate] The site will build, but inventory pages and forms need a database.\n" +
      "[migrate] Add DATABASE_URL in Vercel → Project → Settings → Environment Variables, then redeploy.",
  );
  process.exit(0);
}

const pool = new pg.Pool({ connectionString, max: 1, connectionTimeoutMillis: 15_000 });

try {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
  console.log("[migrate] Database schema is up to date.");
} catch (error) {
  console.error("[migrate] Failed to apply database migrations.");
  if (process.env.VERCEL && /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString)) {
    console.error(
      "[migrate] DATABASE_URL points to localhost, which does not exist on Vercel.\n" +
        "[migrate] Use a hosted Postgres database (e.g. Neon from the Vercel Storage tab).",
    );
  } else {
    console.error(
      "[migrate] Check that DATABASE_URL is correct and the database accepts connections from Vercel.",
    );
  }
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
