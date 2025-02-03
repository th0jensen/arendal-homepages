import { drizzle } from 'drizzle-orm/node-postgres';

const connString = Deno.env.get("SUPABASE_URL")!

if (!connString) {
  throw new Error("Missing Supabase credentials. Please set SUPABASE_URL.");
}

export const db = drizzle(connString);