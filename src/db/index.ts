import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Database access, created lazily on the first query.
 *
 * `next build` imports every route module while it collects page data. The
 * connection must therefore not be required at import time — otherwise the
 * build fails whenever DATABASE_URL isn't available to the build (e.g. on
 * Vercel before a database has been connected). A missing variable now only
 * surfaces when a query actually runs, with a clear message.
 */

type Database = NodePgDatabase;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: Database;
};

function connectionString(): string {
  // DATABASE_URL is set by the Neon / Prisma Postgres integrations on Vercel;
  // POSTGRES_URL is the variable name used by the Supabase integration.
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Project → Settings → Environment Variables (or in .env locally), then redeploy.",
    );
  }
  return url;
}

export function getPool(): Pool {
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    const pool = new Pool({
      connectionString: connectionString(),
      connectionTimeoutMillis: 10_000,
    });
    // Hosted Postgres (Neon, Supabase…) closes idle connections. Without a
    // listener, that error would crash the whole server process.
    pool.on("error", (error) => {
      console.error("[db] idle client error", error);
    });
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }
  return globalForDb.__arenaNextJsPostgresqlPool;
}

function getDb(): Database {
  if (!globalForDb.__arenaNextJsPostgresqlDb) {
    globalForDb.__arenaNextJsPostgresqlDb = drizzle(getPool());
  }
  return globalForDb.__arenaNextJsPostgresqlDb;
}

/** Drizzle instance. Connects on first use, so importing this module is always safe. */
export const db: Database = new Proxy({} as Database, {
  get(_target, property) {
    const instance = getDb();
    const value = Reflect.get(instance, property, instance);
    return typeof value === "function" && property !== "constructor" ? value.bind(instance) : value;
  },
});
