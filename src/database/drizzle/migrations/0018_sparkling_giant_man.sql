ALTER TABLE "address" RENAME COLUMN "entity_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "address" DROP CONSTRAINT "address_entity_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "restaurants" ADD COLUMN "type" varchar(30);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "address" ADD CONSTRAINT "address_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
