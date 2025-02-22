ALTER TABLE "order_items" RENAME COLUMN "add_on_item" TO "add_ons";--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_add_on_item_menu_id_fk";
--> statement-breakpoint
ALTER TABLE "cart" ALTER COLUMN "add_ons" SET DATA TYPE jsonb USING add_ons::jsonb;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "add_ons" SET DATA TYPE jsonb USING add_ons::jsonb;