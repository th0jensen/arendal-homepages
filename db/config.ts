import { drizzle } from 'drizzle-orm/postgres-js';

const connString = Deno.env.get("SUPABASE_URL")!

export const db = drizzle(connString);