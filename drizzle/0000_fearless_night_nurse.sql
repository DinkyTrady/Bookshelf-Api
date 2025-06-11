CREATE TABLE "author" (
	"id" serial PRIMARY KEY NOT NULL,
	"displayId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "author_displayId_unique" UNIQUE("displayId")
);
--> statement-breakpoint
CREATE TABLE "book" (
	"id" serial PRIMARY KEY NOT NULL,
	"displayId" varchar(255) NOT NULL,
	"authorId" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"publisherId" varchar(255) NOT NULL,
	"pageCount" integer NOT NULL,
	"readedPage" integer NOT NULL,
	"reading" boolean DEFAULT false NOT NULL,
	"finished" boolean DEFAULT false NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL,
	"updatedAt" date DEFAULT now() NOT NULL,
	CONSTRAINT "book_displayId_unique" UNIQUE("displayId")
);
--> statement-breakpoint
CREATE TABLE "publisher" (
	"id" serial PRIMARY KEY NOT NULL,
	"displayId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "publisher_displayId_unique" UNIQUE("displayId")
);
