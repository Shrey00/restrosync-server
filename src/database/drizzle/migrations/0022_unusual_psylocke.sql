ALTER TABLE "cart" RENAME COLUMN "item_id" TO "menu_item_id";--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_item_id_menu_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_menu_item_id_menu_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "restaurant_id";