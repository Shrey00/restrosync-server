ALTER TABLE "menu" RENAME COLUMN "price" TO "marked_price";--> statement-breakpoint
ALTER TABLE "menu" ADD COLUMN "selling_price" real;