CREATE TABLE IF NOT EXISTS "menu_item_variants" (
	"id" serial NOT NULL,
	"name" varchar(250) NOT NULL,
	"main_item_id" uuid,
	"variant_id" uuid
);
--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "total_price" TO "total_amount";--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "variant" varchar(6);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "quantity" smallint DEFAULT 1;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "add_note" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_item_variants" ADD CONSTRAINT "menu_item_variants_main_item_id_menu_id_fk" FOREIGN KEY ("main_item_id") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_item_variants" ADD CONSTRAINT "menu_item_variants_variant_id_menu_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
