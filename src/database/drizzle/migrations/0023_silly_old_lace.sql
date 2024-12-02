ALTER TABLE "menu_item_variants" DROP CONSTRAINT "menu_item_variants_main_item_id_menu_id_fk";
--> statement-breakpoint
ALTER TABLE "menu_item_variants" DROP CONSTRAINT "menu_item_variants_variant_id_menu_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_item_variants" ADD CONSTRAINT "menu_item_variants_main_item_id_menu_id_fk" FOREIGN KEY ("main_item_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_item_variants" ADD CONSTRAINT "menu_item_variants_variant_id_menu_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
