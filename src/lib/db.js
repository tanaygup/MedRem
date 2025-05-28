import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/app/db/schema";

// Use Supabase DATABASE_URL (provides Postgres credentials)
const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_PROJECT_URL,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });
