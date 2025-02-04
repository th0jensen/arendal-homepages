import { initTRPC } from '@trpc/server';
import { CompanyValidator, type CompanySelect } from '../db/schema.ts';
import { db } from '../db/config.ts';
import CompanyTable from "../islands/CompanyTable.tsx";
import { companySchema } from "../db/schema.ts";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  getCompanies: publicProcedure
    .query(async () => {
      const companies = await db.select().from(companySchema);
      return companies as CompanySelect[];
    }),
});

export type AppRouter = typeof appRouter;