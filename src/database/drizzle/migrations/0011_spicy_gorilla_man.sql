ALTER TABLE "menu" ADD COLUMN "restaurant_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "name" varchar(250) NOT NULL;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "category" integer;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "type" integer;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "available" boolean;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "cusine_type" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "integer" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "rating" real;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "text" text;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "discount" smallint;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "marked_price" real;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "selling_price" real;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "calories" smallint;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "healthScore" smallint;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "show_healthinfo" boolean;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "images" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "created_at" timestamp (3) with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "updated_at" timestamp (3) with time zone NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu" ADD CONSTRAINT "menu_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
