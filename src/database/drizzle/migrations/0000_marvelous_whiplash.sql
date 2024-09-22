CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"role" varchar(50) NOT NULL,
	"contact" char(10) NOT NULL,
	"country_code" char(3) DEFAULT '+91',
	"email" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"address" json DEFAULT '{"address":"","landmark":"","city":"","district":""}'::json,
	"loyalty_points" smallint DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone,
	CONSTRAINT "user_contact_unique" UNIQUE("contact"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
