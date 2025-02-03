import { pgTable, varchar, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const companySchema = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  webpage: varchar('webpage', { length: 255 }).notNull().default('No website'),
  stiftelsesdato: varchar('stiftelsesdato', { length: 32 }).notNull().default('No date found'),
  ansatte: integer('ansatte').notNull().default(0),
  businessType: varchar('business_type', { length: 255 }).notNull().default('Not specified'),
  lastUpdated: timestamp('last_updated').notNull().defaultNow()
});

export type CompanyInsert = typeof companySchema.$inferInsert;
export type CompanySelect = typeof companySchema.$inferSelect;

export const CompanyValidator = z.object({
  name: z.string().min(1).max(255),
  webpage: z.string().max(255),
  stiftelsesdato: z.string().max(32),
  ansatte: z.number().int().min(0),
  businessType: z.string().max(255)
});

export type Company = z.infer<typeof CompanyValidator>;

export const BrregCompanyValidator = z.object({
  organisasjonsnummer: z.string(),
  navn: z.string(),
  antallAnsatte: z.number().optional(),
  stiftelsesdato: z.string().optional(),
  hjemmeside: z.string().optional(),
  naeringskode1: z.object({
    beskrivelse: z.string()
  }).optional(),
  beliggenhetsadresse: z.object({
    postnummer: z.string(),
    poststed: z.string()
  }).optional(),
  konkurs: z.boolean(),
  underAvvikling: z.boolean(),
  underTvangsavviklingEllerTvangsopplosning: z.boolean()
});

export type BrregCompany = z.infer<typeof BrregCompanyValidator>;