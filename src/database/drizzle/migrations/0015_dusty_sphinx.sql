ALTER TABLE "order_items" DROP CONSTRAINT "order_items_customer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_address_address_id_fk";
--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "taxes" real;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivery_charges" real;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "deleted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "scheduled_at" timestamp (3) with time zone NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "menu_item_variants" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "customer_id";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "restaurant_id";--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "order_time";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "address";