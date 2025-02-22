ALTER TABLE "cart" ADD COLUMN "add_ons" json;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "add_on_item" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "note" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_add_on_item_menu_id_fk" FOREIGN KEY ("add_on_item") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "add_note";