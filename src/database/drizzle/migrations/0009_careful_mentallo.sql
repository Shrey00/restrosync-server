CREATE TABLE IF NOT EXISTS "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" text,
	"customer_id" uuid,
	"offer_name" varchar(250),
	"discount" smallint NOT NULL,
	"free_item" uuid,
	"start_time" timestamp (3) with time zone NOT NULL,
	"end_time" timestamp (3) with time zone NOT NULL,
	"max_discount_amount" smallint NOT NULL,
	"max_usage" smallint NOT NULL,
	"usage" smallint NOT NULL,
	"coupon_code" varchar(16),
	"category" integer,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "relation_restaurants_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offer_id" uuid,
	"restaurant_id" uuid
);
--> statement-breakpoint
ALTER TABLE "menu" RENAME COLUMN "show_healthscore" TO "show_healthinfo";--> statement-breakpoint
ALTER TABLE "relation_users_restaurants" DROP CONSTRAINT "relation_users_restaurants_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "relation_users_restaurants" DROP CONSTRAINT "relation_users_restaurants_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer';--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "name" varchar(250) NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "order_item" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_free_item_menu_id_fk" FOREIGN KEY ("free_item") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relation_restaurants_offers" ADD CONSTRAINT "relation_restaurants_offers_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relation_restaurants_offers" ADD CONSTRAINT "relation_restaurants_offers_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_item_menu_id_fk" FOREIGN KEY ("order_item") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relation_users_restaurants" ADD CONSTRAINT "relation_users_restaurants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relation_users_restaurants" ADD CONSTRAINT "relation_users_restaurants_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
