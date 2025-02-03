import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: Deno.env.get("SUPABASE_URL")!,
    ssl: { rejectUnauthorized: false }
  },
});
