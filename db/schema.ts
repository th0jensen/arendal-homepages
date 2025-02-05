import { pgTable, varchar, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const companySchema = pgTable('companies', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  webpage: varchar('webpage', { length: 255 }).notNull().default('No website'),
  stiftelsesdato: varchar('stiftelsesdato', { length: 32 }).notNull().default('No date found'),
  email: varchar('email', { length: 255 }).notNull().default('No email found'),
  ansatte: integer('ansatte').notNull().default(0),
  businessType: varchar('business_type', { length: 255 }).notNull().default('Not specified'),
  businessTypeCode: varchar('business_type_code', { length: 10 }).notNull().default('N/A'),
  lastUpdated: timestamp('last_updated').notNull().defaultNow()
});

export type CompanyInsert = typeof companySchema.$inferInsert;
export type CompanySelect = typeof companySchema.$inferSelect;

export const CompanyValidator = z.object({
  name: z.string().min(1).max(255),
  webpage: z.string().max(255),
  stiftelsesdato: z.string().max(32),
  email: z.string().max(255).optional(),
  ansatte: z.number().int().min(0),
  businessType: z.string().max(255),
  businessTypeCode: z.string().max(10)
});

export type Company = z.infer<typeof CompanyValidator>;

export const BrregCompanyValidator = z.object({
  organisasjonsnummer: z.string(),
  navn: z.string(),
  antallAnsatte: z.number().optional(),
  stiftelsesdato: z.string().optional(),
  hjemmeside: z.string().optional(),
  epostadresse: z.string().optional(),
  organisasjonsform: z.object({
    kode: z.string(),
    beskrivelse: z.string()
  }).optional(),
  konkurs: z.boolean(),
  underAvvikling: z.boolean(),
  underTvangsavviklingEllerTvangsopplosning: z.boolean()
});

export type BrregCompany = z.infer<typeof BrregCompanyValidator>;