CREATE TABLE IF NOT EXISTS "menu" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"restaurant_id" uuid NOT NULL,
	"primary_category" varchar(50),
	"secondary_category" varchar(50),
	"cusine_type" varchar(15) NOT NULL,
	"integer" integer DEFAULT 0 NOT NULL,
	"description" text,
	"rating" real,
	"text" text,
	"price" real,
	"discount" smallint,
	"calories" smallint,
	"healthScore" smallint,
	"show_healthscore" boolean,
	"img_list" json DEFAULT '[]'::json,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid,
	"name" varchar(200) NOT NULL,
	"email" varchar(100) NOT NULL,
	"contact" varchar(20) NOT NULL,
	"country_code" char(3) DEFAULT '+91',
	"description" text,
	"rating" real,
	"address" json DEFAULT '{"address":"","landmark":"","city":"","district":"","latitude":0,"longitude":0}'::json NOT NULL,
	"logo" text,
	"img_list" json DEFAULT '[]'::json,
	"cusine_type" varchar(15) NOT NULL,
	"opens_at" "time(3) with time zone",
	"closes_at" "time(3) with time zone",
	"accepting_orders" boolean NOT NULL,
	"next_opening_time" "time(3) with time zone",
	"next_closing_time" "time(3) with time zone",
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone NOT NULL,
	CONSTRAINT "restaurants_email_unique" UNIQUE("email"),
	CONSTRAINT "restaurants_contact_unique" UNIQUE("contact")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"restaurant_id" uuid,
	"rating" smallint NOT NULL,
	"review" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "address" SET DEFAULT '[{"address":"","landmark":"","city":"","district":""}]'::json;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu" ADD CONSTRAINT "menu_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
