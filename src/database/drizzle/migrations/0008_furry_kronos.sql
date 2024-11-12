ALTER TABLE "menu" ALTER COLUMN "category" SET DATA TYPE integer  USING (trim(category)::integer);--> statement-breakpoint
ALTER TABLE "menu" ALTER COLUMN "type" SET DATA TYPE integer  USING (trim(type)::integer);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu" ADD CONSTRAINT "menu_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu" ADD CONSTRAINT "menu_type_types_id_fk" FOREIGN KEY ("type") REFERENCES "public"."types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
