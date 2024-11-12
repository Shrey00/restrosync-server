ALTER TABLE "menu" DROP CONSTRAINT "menu_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "menu" DROP CONSTRAINT "menu_category_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "menu" DROP CONSTRAINT "menu_type_types_id_fk";
--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "restaurant_id";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "name";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "category";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "available";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "cusine_type";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "integer";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "rating";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "text";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "discount";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "marked_price";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "selling_price";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "calories";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "healthScore";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "show_healthinfo";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "images";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "menu" DROP COLUMN IF EXISTS "updated_at";