import { drizzle } from 'drizzle-orm/node-postgres';

const connString = Deno.env.get("SUPABASE_URL")!

export const db = drizzle(connString);