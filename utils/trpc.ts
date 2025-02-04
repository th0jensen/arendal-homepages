import { initTRPC } from '@trpc/server';
import { type CompanySelect } from '../db/schema.ts';
import { db } from '../db/config.ts';
import { companySchema } from "../db/schema.ts";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  getCompanies: publicProcedure
    .query(async () => {
      const companies = await db.select().from(companySchema);
      return companies;
    }),
});

export type AppRouter = typeof appRouter;