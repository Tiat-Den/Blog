import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Disable connection pooling during build
const connectionString = process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/personal_universe";

// Use a singleton for the db connection so we don't exhaust pool connections
// during hot-reloading in development
declare global {
  var dbPool: Pool | undefined;
}

const pool = global.dbPool || new Pool({ 
  connectionString,
  ssl: connectionString.includes("supabase.com") ? { rejectUnauthorized: false } : undefined
});

if (process.env.NODE_ENV !== "production") {
  global.dbPool = pool;
}

export const db = drizzle(pool, { schema });
