import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connString = Deno.env.get("SUPABASE_URL")!

const queryClient = postgres(connString, {
  connection: {
    options: `-c client_encoding=utf8 -c gzip=true`
  }
})
export const db = drizzle({ client: queryClient});