ALTER TABLE "offers" ALTER COLUMN "customer_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "offer_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "free_item" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "offers" ADD COLUMN "item" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "offers" ADD CONSTRAINT "offers_item_menu_id_fk" FOREIGN KEY ("item") REFERENCES "public"."menu"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
