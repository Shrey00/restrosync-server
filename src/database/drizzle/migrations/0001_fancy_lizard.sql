ALTER TABLE "restaurants" RENAME COLUMN "img_list" TO "images";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "contact_verified" SET DEFAULT false;