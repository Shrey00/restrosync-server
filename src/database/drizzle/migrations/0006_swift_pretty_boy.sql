CREATE TABLE IF NOT EXISTS "relation_users_restaurants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"restaurant_id" uuid
);
--> statement-breakpoint
ALTER TABLE "restaurants" DROP CONSTRAINT "restaurants_admin_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "next_opening_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "restaurants" ALTER COLUMN "next_closing_time" SET DATA TYPE time;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "menu_item_id" uuid;--> statement-breakpoint
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_menu_item_id_menu_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "restaurants" DROP COLUMN IF EXISTS "admin_id";