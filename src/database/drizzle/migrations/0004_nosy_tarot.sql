ALTER TABLE "relation_users_restaurants" DROP CONSTRAINT "relation_users_restaurants_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "relation_users_restaurants" DROP CONSTRAINT "relation_users_restaurants_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relation_users_restaurants" ADD CONSTRAINT "relation_users_restaurants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "relation_users_restaurants" ADD CONSTRAINT "relation_users_restaurants_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
