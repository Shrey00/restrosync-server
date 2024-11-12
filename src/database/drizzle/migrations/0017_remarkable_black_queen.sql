ALTER TABLE "address" DROP CONSTRAINT "address_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "entity_id" uuid;--> statement-breakpoint
ALTER TABLE "address" ADD COLUMN "type" varchar(40);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_entity_id_users_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN IF EXISTS "created_at ";--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN IF EXISTS "updated_at";