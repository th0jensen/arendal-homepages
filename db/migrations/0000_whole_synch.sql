CREATE TABLE "companies" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"webpage" varchar(255) DEFAULT 'No website' NOT NULL,
	"stiftelsesdato" varchar(10) DEFAULT 'No date found' NOT NULL,
	"ansatte" integer DEFAULT 0 NOT NULL,
	"business_type" varchar(255) DEFAULT 'Not specified' NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
