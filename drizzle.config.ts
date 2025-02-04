import type { Config } from "npm:drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("SUPABASE_URL") || "",
  },
} satisfies Config;